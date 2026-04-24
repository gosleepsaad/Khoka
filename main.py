import os
import json
from datetime import datetime, date, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import anthropic

from database import get_db, init_db
from seed import seed

app = FastAPI(title="Khoka")


# ─── Startup ────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()
    seed()


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class SaleItem(BaseModel):
    item_id: Optional[int] = None
    item_name: str
    price: float
    quantity: int

class SaleCreate(BaseModel):
    items: List[SaleItem]
    total: float

class UdhaarCreate(BaseModel):
    customer_id: int
    amount: float
    note: Optional[str] = ""

class PaymentCreate(BaseModel):
    amount: float
    note: Optional[str] = "Payment"

class CustomerCreate(BaseModel):
    name: str
    phone: Optional[str] = ""
    cnic: Optional[str] = ""

class ExpenseCreate(BaseModel):
    category: str
    amount: float
    note: Optional[str] = ""

class ItemCreate(BaseModel):
    category_id: int
    name: str
    name_ur: Optional[str] = ""
    price: float
    sort_order: Optional[int] = 0

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    name_ur: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    is_active: Optional[int] = None
    is_low_stock: Optional[int] = None

class CategoryCreate(BaseModel):
    name: str
    name_ur: str

class BuyListAdd(BaseModel):
    item_id: Optional[int] = None
    item_name: str
    note: Optional[str] = ""

class AskClaudeRequest(BaseModel):
    question: str
    language: str = "en"  # "en" or "ur"


# ─── Helper ──────────────────────────────────────────────────────────────────

def _coerce(v):
    from decimal import Decimal
    from datetime import date, datetime
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    return v

def row_to_dict(row):
    return {k: _coerce(v) for k, v in row.items()} if row else None

def rows_to_list(rows):
    return [{k: _coerce(v) for k, v in r.items()} for r in rows] if rows else []


def get_shop_context():
    """Build a rich context string for Claude about the current shop state."""
    conn = get_db()
    c = conn.cursor()

    today = date.today().isoformat()
    week_ago = (date.today() - timedelta(days=7)).isoformat()

    # Today's sales
    c.execute("SELECT COALESCE(SUM(total),0) as v FROM sales WHERE DATE(created_at)=?", (today,))
    today_sales = float(c.fetchone()["v"])

    # Today's expenses
    c.execute("SELECT COALESCE(SUM(amount),0) as v FROM expenses WHERE DATE(created_at)=?", (today,))
    today_exp = float(c.fetchone()["v"])

    # Total udhaar
    c.execute("""
        SELECT COALESCE(SUM(CASE WHEN type='debit' THEN amount ELSE -amount END),0) as v
        FROM udhaar_transactions
    """)
    total_udhaar = float(c.fetchone()["v"])

    # Top items this week
    c.execute("""
        SELECT si.item_name, SUM(si.quantity) as qty, SUM(si.price*si.quantity) as revenue
        FROM sale_items si
        JOIN sales s ON s.id=si.sale_id
        WHERE DATE(s.created_at) >= ?
        GROUP BY si.item_name
        ORDER BY qty DESC
        LIMIT 5
    """, (week_ago,))
    top_items = rows_to_list(c.fetchall())

    # Customers with udhaar
    c.execute("""
        SELECT name, balance FROM (
            SELECT cu.name,
                   COALESCE(SUM(CASE WHEN ut.type='debit' THEN ut.amount ELSE -ut.amount END),0) as balance
            FROM customers cu
            LEFT JOIN udhaar_transactions ut ON ut.customer_id=cu.id
            GROUP BY cu.id, cu.name
        ) sub WHERE balance > 0
        ORDER BY balance DESC
    """)
    udhaar_customers = rows_to_list(c.fetchall())

    # Recent expenses (7 days)
    c.execute("""
        SELECT category, COALESCE(SUM(amount),0) as total
        FROM expenses WHERE DATE(created_at) >= ?
        GROUP BY category
    """, (week_ago,))
    recent_expenses = rows_to_list(c.fetchall())

    # Low stock items
    c.execute("SELECT name FROM items WHERE is_low_stock=1 AND is_active=1")
    low_stock = [r["name"] for r in c.fetchall()]

    # Weekly sales trend
    c.execute("""
        SELECT DATE(created_at) as day, COALESCE(SUM(total),0) as total
        FROM sales
        WHERE DATE(created_at) >= ?
        GROUP BY day ORDER BY day
    """, (week_ago,))
    daily_sales = rows_to_list(c.fetchall())

    conn.close()

    context = f"""
SHOP DATA — Khoka (Pakistan)
Date: {today}

FINANCIALS:
- Today's sales: Rs {today_sales:,.0f}
- Today's profit (sales - expenses): Rs {today_sales - today_exp:,.0f}
- Total outstanding udhaar: Rs {total_udhaar:,.0f}

TOP SELLING ITEMS THIS WEEK:
{json.dumps(top_items, ensure_ascii=False)}

UDHAAR CUSTOMERS (outstanding balance):
{json.dumps(udhaar_customers, ensure_ascii=False)}

EXPENSES THIS WEEK BY CATEGORY:
{json.dumps(recent_expenses, ensure_ascii=False)}

LOW STOCK ITEMS: {', '.join(low_stock) if low_stock else 'None'}

DAILY SALES LAST 7 DAYS:
{json.dumps(daily_sales, ensure_ascii=False)}
"""
    return context


# ─── Items & Categories ───────────────────────────────────────────────────────

@app.get("/api/items")
def get_items():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT cat.id as category_id, cat.name as category_name, cat.name_ur as category_name_ur,
               cat.sort_order as category_sort,
               i.id, i.name, i.name_ur, i.price, i.is_active, i.is_low_stock, i.sort_order
        FROM categories cat
        LEFT JOIN items i ON i.category_id=cat.id AND i.is_active=1
        ORDER BY cat.sort_order, i.sort_order
    """)
    rows = c.fetchall()
    conn.close()

    categories = {}
    for r in rows:
        cid = r["category_id"]
        if cid not in categories:
            categories[cid] = {
                "id": cid,
                "name": r["category_name"],
                "name_ur": r["category_name_ur"],
                "sort_order": r["category_sort"],
                "items": [],
            }
        if r["id"] is not None:
            categories[cid]["items"].append({
                "id": r["id"],
                "name": r["name"],
                "name_ur": r["name_ur"],
                "price": r["price"],
                "is_low_stock": r["is_low_stock"],
                "sort_order": r["sort_order"],
            })
    return list(categories.values())


@app.get("/api/categories")
def get_categories():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM categories ORDER BY sort_order")
    cats = rows_to_list(c.fetchall())
    conn.close()
    return cats


@app.post("/api/categories")
def create_category(body: CategoryCreate):
    conn = get_db()
    row = conn.cursor().execute("SELECT COALESCE(MAX(sort_order),0) as ms FROM categories").fetchone()
    max_sort = row["ms"] if row else 0
    cat_id = conn.insert(
        "INSERT INTO categories (name, name_ur, sort_order) VALUES (?,?,?)",
        (body.name, body.name_ur, max_sort + 1),
    )
    conn.commit()
    c2 = conn.cursor()
    c2.execute("SELECT * FROM categories WHERE id=?", (cat_id,))
    cat = row_to_dict(c2.fetchone())
    conn.close()
    return cat


@app.post("/api/items")
def create_item(body: ItemCreate):
    conn = get_db()
    item_id = conn.insert(
        "INSERT INTO items (category_id, name, name_ur, price, sort_order) VALUES (?,?,?,?,?)",
        (body.category_id, body.name, body.name_ur, body.price, body.sort_order),
    )
    conn.commit()
    c = conn.cursor()
    c.execute("SELECT * FROM items WHERE id=?", (item_id,))
    item = row_to_dict(c.fetchone())
    conn.close()
    return item


@app.put("/api/items/{item_id}")
def update_item(item_id: int, body: ItemUpdate):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM items WHERE id=?", (item_id,))
    item = c.fetchone()
    if not item:
        conn.close()
        raise HTTPException(404, "Item not found")
    updates = {k: v for k, v in body.dict().items() if v is not None}
    if not updates:
        conn.close()
        return row_to_dict(item)
    set_clause = ", ".join(f"{k}=?" for k in updates)
    c.execute(f"UPDATE items SET {set_clause} WHERE id=?", (*updates.values(), item_id))
    conn.commit()
    c.execute("SELECT * FROM items WHERE id=?", (item_id,))
    updated = row_to_dict(c.fetchone())
    conn.close()
    return updated


@app.delete("/api/items/{item_id}")
def delete_item(item_id: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE items SET is_active=0 WHERE id=?", (item_id,))
    conn.commit()
    conn.close()
    return {"ok": True}


@app.put("/api/items/{item_id}/low-stock")
def toggle_low_stock(item_id: int, body: dict = None):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT is_low_stock FROM items WHERE id=?", (item_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(404)
    new_val = 0 if row["is_low_stock"] else 1
    c.execute("UPDATE items SET is_low_stock=? WHERE id=?", (new_val, item_id))

    # Add to buy list if marking low
    if new_val == 1:
        c.execute("SELECT name FROM items WHERE id=?", (item_id,))
        name = c.fetchone()["name"]
        c.execute("SELECT id FROM buy_list WHERE item_id=? AND is_completed=0", (item_id,))
        if not c.fetchone():
            c.execute(
                "INSERT INTO buy_list (item_id, item_name, note, created_at) VALUES (?,?,?,?)",
                (item_id, name, "Low stock", datetime.now().isoformat()),
            )

    conn.commit()
    conn.close()
    return {"is_low_stock": new_val}


# ─── Sales ────────────────────────────────────────────────────────────────────

@app.post("/api/sales")
def create_sale(body: SaleCreate):
    conn = get_db()
    now = datetime.now().isoformat()
    sale_id = conn.insert("INSERT INTO sales (total, created_at) VALUES (?,?)", (body.total, now))
    for item in body.items:
        conn.insert(
            "INSERT INTO sale_items (sale_id, item_id, item_name, price, quantity) VALUES (?,?,?,?,?)",
            (sale_id, item.item_id, item.item_name, item.price, item.quantity),
        )
    conn.commit()
    conn.close()
    return {"id": sale_id, "total": body.total, "created_at": now}


@app.get("/api/sales")
def get_sales(date_from: Optional[str] = None, date_to: Optional[str] = None, limit: int = 50):
    conn = get_db()
    c = conn.cursor()

    where = []
    params = []
    if date_from:
        where.append("DATE(s.created_at) >= ?")
        params.append(date_from)
    if date_to:
        where.append("DATE(s.created_at) <= ?")
        params.append(date_to)

    where_clause = "WHERE " + " AND ".join(where) if where else ""
    c.execute(f"""
        SELECT s.id, s.total, s.created_at
        FROM sales s
        {where_clause}
        ORDER BY s.created_at DESC
        LIMIT ?
    """, (*params, limit))
    sales = rows_to_list(c.fetchall())

    for sale in sales:
        c.execute(
            "SELECT item_name, price, quantity FROM sale_items WHERE sale_id=?",
            (sale["id"],),
        )
        sale["items"] = rows_to_list(c.fetchall())

    conn.close()
    return sales


# ─── Dashboard ───────────────────────────────────────────────────────────────

@app.get("/api/dashboard")
def get_dashboard():
    conn = get_db()
    c = conn.cursor()
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    week_ago = (date.today() - timedelta(days=7)).isoformat()

    def scalar(cur): return list(cur.fetchone().values())[0]

    c.execute("SELECT COALESCE(SUM(total),0) as v FROM sales WHERE DATE(created_at)=?", (today,))
    today_sales = scalar(c)

    c.execute("SELECT COALESCE(SUM(total),0) as v FROM sales WHERE DATE(created_at)=?", (yesterday,))
    yesterday_sales = scalar(c)

    c.execute("SELECT COALESCE(SUM(amount),0) as v FROM expenses WHERE DATE(created_at)=?", (today,))
    today_expenses = scalar(c)

    c.execute("""
        SELECT COALESCE(SUM(CASE WHEN type='debit' THEN amount ELSE -amount END),0) as v
        FROM udhaar_transactions
    """)
    total_udhaar = scalar(c)

    c.execute("SELECT COUNT(*) as v FROM items WHERE is_low_stock=1 AND is_active=1")
    low_stock_count = scalar(c)

    c.execute("""
        SELECT si.item_name, SUM(si.quantity) as qty
        FROM sale_items si JOIN sales s ON s.id=si.sale_id
        WHERE DATE(s.created_at) >= ?
        GROUP BY si.item_name
        ORDER BY qty DESC LIMIT 5
    """, (week_ago,))
    top_items = rows_to_list(c.fetchall())

    # Hourly sales today for best time analysis (strftime is SQLite; use EXTRACT for PG)
    from database import IS_POSTGRES
    if IS_POSTGRES:
        c.execute("""
            SELECT LPAD(EXTRACT(HOUR FROM created_at::timestamp)::text,2,'0') as hour,
                   COUNT(*) as count, SUM(total) as total
            FROM sales WHERE DATE(created_at)=?
            GROUP BY hour ORDER BY total DESC LIMIT 1
        """, (today,))
    else:
        c.execute("""
            SELECT strftime('%H', created_at) as hour, COUNT(*) as count, SUM(total) as total
            FROM sales WHERE DATE(created_at)=?
            GROUP BY hour ORDER BY total DESC LIMIT 1
        """, (today,))
    best_hour_row = c.fetchone()
    best_hour = best_hour_row["hour"] if best_hour_row else None

    conn.close()
    return {
        "today_sales": today_sales,
        "yesterday_sales": yesterday_sales,
        "today_profit": today_sales - today_expenses,
        "today_expenses": today_expenses,
        "total_udhaar": total_udhaar,
        "low_stock_count": low_stock_count,
        "top_items_week": top_items,
        "best_hour_today": best_hour,
    }


# ─── Customers & Udhaar ──────────────────────────────────────────────────────

@app.get("/api/customers")
def get_customers():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT cu.id, cu.name, cu.phone, cu.cnic, cu.created_at,
               COALESCE(SUM(CASE WHEN ut.type='debit' THEN ut.amount ELSE -ut.amount END),0) as balance
        FROM customers cu
        LEFT JOIN udhaar_transactions ut ON ut.customer_id=cu.id
        GROUP BY cu.id, cu.name, cu.phone, cu.cnic, cu.created_at
        ORDER BY balance DESC
    """)
    customers = rows_to_list(c.fetchall())
    conn.close()
    return customers


@app.post("/api/customers")
def create_customer(body: CustomerCreate):
    conn = get_db()
    now = datetime.now().isoformat()
    cust_id = conn.insert(
        "INSERT INTO customers (name, phone, cnic, created_at) VALUES (?,?,?,?)",
        (body.name, body.phone, body.cnic, now),
    )
    conn.commit()
    c = conn.cursor()
    c.execute("SELECT * FROM customers WHERE id=?", (cust_id,))
    cust = row_to_dict(c.fetchone())
    cust["balance"] = 0
    conn.close()
    return cust


@app.get("/api/customers/{customer_id}/transactions")
def get_customer_transactions(customer_id: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM customers WHERE id=?", (customer_id,))
    cust = row_to_dict(c.fetchone())
    if not cust:
        conn.close()
        raise HTTPException(404)
    c.execute("""
        SELECT * FROM udhaar_transactions
        WHERE customer_id=? ORDER BY created_at DESC
    """, (customer_id,))
    txns = rows_to_list(c.fetchall())
    c.execute("""
        SELECT COALESCE(SUM(CASE WHEN type='debit' THEN amount ELSE -amount END),0) as v
        FROM udhaar_transactions WHERE customer_id=?
    """, (customer_id,))
    balance = list(c.fetchone().values())[0]
    conn.close()
    cust["balance"] = balance
    cust["transactions"] = txns
    return cust


@app.post("/api/udhaar")
def add_udhaar(body: UdhaarCreate):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM customers WHERE id=?", (body.customer_id,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(404, "Customer not found")
    now = datetime.now().isoformat()
    txn_id = conn.insert(
        "INSERT INTO udhaar_transactions (customer_id, amount, type, note, created_at) VALUES (?,?,?,?,?)",
        (body.customer_id, body.amount, "debit", body.note or "Udhaar", now),
    )
    conn.commit()
    conn.close()
    return {"id": txn_id, "ok": True}


@app.post("/api/customers/{customer_id}/pay")
def add_payment(customer_id: int, body: PaymentCreate):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM customers WHERE id=?", (customer_id,))
    if not c.fetchone():
        conn.close()
        raise HTTPException(404)
    now = datetime.now().isoformat()
    conn.insert(
        "INSERT INTO udhaar_transactions (customer_id, amount, type, note, created_at) VALUES (?,?,?,?,?)",
        (customer_id, body.amount, "credit", body.note or "Payment", now),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


# ─── Expenses ────────────────────────────────────────────────────────────────

@app.get("/api/expenses")
def get_expenses(date_from: Optional[str] = None, date_to: Optional[str] = None):
    conn = get_db()
    c = conn.cursor()
    where = []
    params = []
    if date_from:
        where.append("DATE(created_at) >= ?")
        params.append(date_from)
    if date_to:
        where.append("DATE(created_at) <= ?")
        params.append(date_to)
    where_clause = "WHERE " + " AND ".join(where) if where else ""
    c.execute(f"SELECT * FROM expenses {where_clause} ORDER BY created_at DESC LIMIT 100", params)
    expenses = rows_to_list(c.fetchall())

    # Monthly totals — portable across SQLite and PostgreSQL
    from database import IS_POSTGRES
    if IS_POSTGRES:
        c.execute("""
            SELECT TO_CHAR(created_at::timestamp, 'YYYY-MM') as month,
                   COALESCE(SUM(amount),0) as total
            FROM expenses GROUP BY month ORDER BY month DESC LIMIT 3
        """)
    else:
        c.execute("""
            SELECT strftime('%Y-%m', created_at) as month,
                   COALESCE(SUM(amount),0) as total
            FROM expenses GROUP BY month ORDER BY month DESC LIMIT 3
        """)
    monthly = rows_to_list(c.fetchall())

    conn.close()
    return {"expenses": expenses, "monthly_totals": monthly}


@app.post("/api/expenses")
def create_expense(body: ExpenseCreate):
    conn = get_db()
    now = datetime.now().isoformat()
    exp_id = conn.insert(
        "INSERT INTO expenses (category, amount, note, created_at) VALUES (?,?,?,?)",
        (body.category, body.amount, body.note, now),
    )
    conn.commit()
    conn.close()
    return {"id": exp_id, "ok": True}


# ─── Buy List ─────────────────────────────────────────────────────────────────

@app.get("/api/buy-list")
def get_buy_list():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM buy_list WHERE is_completed=0 ORDER BY created_at DESC")
    items = rows_to_list(c.fetchall())
    conn.close()
    return items


@app.post("/api/buy-list")
def add_to_buy_list(body: BuyListAdd):
    conn = get_db()
    now = datetime.now().isoformat()
    bl_id = conn.insert(
        "INSERT INTO buy_list (item_id, item_name, note, created_at) VALUES (?,?,?,?)",
        (body.item_id, body.item_name, body.note, now),
    )
    conn.commit()
    conn.close()
    return {"id": bl_id, "ok": True}


@app.put("/api/buy-list/{item_id}/complete")
def complete_buy_list(item_id: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE buy_list SET is_completed=1 WHERE id=?", (item_id,))
    conn.commit()
    conn.close()
    return {"ok": True}


# ─── Settings (PIN etc.) ─────────────────────────────────────────────────────

class PinUpdate(BaseModel):
    current_pin: str
    new_pin: str

@app.get("/api/settings/pin")
def get_pin():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT value FROM settings WHERE key='pin'")
    row = c.fetchone()
    conn.close()
    return {"pin": row["value"] if row else "1234"}

@app.put("/api/settings/pin")
def update_pin(body: PinUpdate):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT value FROM settings WHERE key='pin'")
    row = c.fetchone()
    current = row["value"] if row else "1234"
    if body.current_pin != current:
        conn.close()
        raise HTTPException(400, "Current PIN is incorrect")
    if not body.new_pin.isdigit() or len(body.new_pin) != 4:
        conn.close()
        raise HTTPException(400, "New PIN must be 4 digits")
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=?",
        ("pin", body.new_pin, body.new_pin),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


# ─── AI ───────────────────────────────────────────────────────────────────────

def get_claude_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(503, "ANTHROPIC_API_KEY not configured")
    return anthropic.Anthropic(api_key=api_key)


@app.post("/api/ai/ask")
async def ask_claude(body: AskClaudeRequest):
    try:
        client = get_claude_client()
    except HTTPException:
        raise

    context = get_shop_context()

    if body.language == "ur":
        lang_instruction = "IMPORTANT: Reply ONLY in pure Urdu script. Do NOT mix in English words or phrases — use Urdu equivalents for all terms (e.g. فروخت not sales, منافع not profit, روپے not Rs). Write all numbers in Western digits (1234) but keep all words in Urdu."
    else:
        lang_instruction = "IMPORTANT: Reply ONLY in English. Do not use any Urdu script."

    system_prompt = f"""You are a helpful business assistant for a Pakistani khoka (small shop) owner.
You have access to the shop's complete data. Answer questions concisely and helpfully.
{lang_instruction}
Keep answers brief and practical. Use Pakistani Rupees (Rs) for amounts.
Do NOT use markdown formatting — no asterisks, no bold, no bullet symbols. Use plain text with line breaks only.

{context}"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system=system_prompt,
            messages=[{"role": "user", "content": body.question}],
        )
        return {"answer": message.content[0].text}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/ai/summary")
async def get_daily_summary(language: str = "en"):
    today = date.today().isoformat()

    # Return cached summary if exists
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT summary FROM ai_summary WHERE date=?", (today,))
    row = c.fetchone()
    if row:
        conn.close()
        return {"summary": row["summary"], "cached": True}
    conn.close()

    # Generate new summary
    try:
        client = get_claude_client()
    except HTTPException:
        return {"summary": "AI summary unavailable — check API key.", "cached": False}

    context = get_shop_context()

    if language == "ur":
        lang_instruction = "Write ONLY in pure Urdu script. Do NOT mix in English words — use Urdu for all terms. Use Western digits for numbers."
    else:
        lang_instruction = "Write ONLY in English."

    prompt = f"""Generate a concise daily business summary for a Pakistani khoka owner.
{lang_instruction}
Include: total sales and profit today, top selling items, udhaar changes, items to restock, notable patterns.
Keep it under 150 words. Be warm and practical. Use plain text only — no asterisks, no markdown.

{context}"""

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        summary = message.content[0].text

        # Cache it
        conn = get_db()
        from database import IS_POSTGRES
        if IS_POSTGRES:
            conn.execute(
                "INSERT INTO ai_summary (date, summary, generated_at) VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET summary=?, generated_at=?",
                (today, summary, datetime.now().isoformat(), summary, datetime.now().isoformat()),
            )
        else:
            conn.execute(
                "INSERT OR REPLACE INTO ai_summary (date, summary, generated_at) VALUES (?,?,?)",
                (today, summary, datetime.now().isoformat()),
            )
        conn.commit()
        conn.close()

        return {"summary": summary, "cached": False}
    except Exception as e:
        return {"summary": f"Could not generate summary: {e}", "cached": False}


@app.get("/api/ai/insights")
async def get_ai_insights():
    conn = get_db()
    c = conn.cursor()

    today = date.today().isoformat()
    week_ago = (date.today() - timedelta(days=7)).isoformat()
    three_days_ago = (date.today() - timedelta(days=3)).isoformat()

    # Hot items this week
    c.execute("""
        SELECT si.item_name, SUM(si.quantity) as qty, SUM(si.price*si.quantity) as revenue
        FROM sale_items si JOIN sales s ON s.id=si.sale_id
        WHERE DATE(s.created_at) >= ?
        GROUP BY si.item_name ORDER BY qty DESC LIMIT 5
    """, (week_ago,))
    hot_items = rows_to_list(c.fetchall())

    # Slow moving (no sales in last 3 days but sold before)
    c.execute("""
        SELECT DISTINCT si.item_name
        FROM sale_items si JOIN sales s ON s.id=si.sale_id
        WHERE DATE(s.created_at) < ?
    """, (three_days_ago,))
    sold_before = set(r["item_name"] for r in c.fetchall())

    c.execute("""
        SELECT DISTINCT si.item_name
        FROM sale_items si JOIN sales s ON s.id=si.sale_id
        WHERE DATE(s.created_at) >= ?
    """, (three_days_ago,))
    sold_recent = set(r["item_name"] for r in c.fetchall())
    slow_items = list(sold_before - sold_recent)[:5]

    from database import IS_POSTGRES
    if IS_POSTGRES:
        c.execute("""
            SELECT LPAD(EXTRACT(HOUR FROM created_at::timestamp)::text,2,'0') as hour, SUM(total) as total
            FROM sales WHERE DATE(created_at) >= ?
            GROUP BY hour ORDER BY total DESC LIMIT 3
        """, (week_ago,))
    else:
        c.execute("""
            SELECT strftime('%H', created_at) as hour, SUM(total) as total
            FROM sales WHERE DATE(created_at) >= ?
            GROUP BY hour ORDER BY total DESC LIMIT 3
        """, (week_ago,))
    best_hours = rows_to_list(c.fetchall())

    # Daily sales trend
    c.execute("""
        SELECT DATE(created_at) as day, SUM(total) as total, COUNT(*) as num_sales
        FROM sales WHERE DATE(created_at) >= ?
        GROUP BY day ORDER BY day
    """, (week_ago,))
    daily_trend = rows_to_list(c.fetchall())

    # Top udhaar customers — subquery to avoid HAVING alias issue
    c.execute("""
        SELECT name, balance FROM (
            SELECT cu.name,
                   COALESCE(SUM(CASE WHEN ut.type='debit' THEN ut.amount ELSE -ut.amount END),0) as balance
            FROM customers cu
            LEFT JOIN udhaar_transactions ut ON ut.customer_id=cu.id
            GROUP BY cu.id, cu.name
        ) sub WHERE balance > 0
        ORDER BY balance DESC LIMIT 5
    """)
    top_udhaar = rows_to_list(c.fetchall())

    # Restock urgency
    c.execute("""
        SELECT i.name, COALESCE(SUM(si.quantity),0) as qty_sold, i.is_low_stock
        FROM items i
        LEFT JOIN sale_items si ON si.item_id=i.id
        LEFT JOIN sales s ON s.id=si.sale_id AND DATE(s.created_at) >= ?
        WHERE i.is_active=1
        GROUP BY i.id, i.name, i.is_low_stock
        ORDER BY qty_sold DESC LIMIT 10
    """, (week_ago,))
    restock_urgency = rows_to_list(c.fetchall())

    conn.close()

    raw_data = {
        "hot_items": hot_items,
        "slow_items": slow_items,
        "best_hours": best_hours,
        "daily_trend": daily_trend,
        "top_udhaar_customers": top_udhaar,
        "restock_urgency": restock_urgency,
    }

    # Ask Claude to format nicely
    try:
        client = get_claude_client()
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=600,
            messages=[{
                "role": "user",
                "content": f"""Format these shop insights in clear, actionable bullet points for a Pakistani khoka owner.
Be concise and use Rs for amounts. Max 200 words total.

Data: {json.dumps(raw_data, ensure_ascii=False)}

Format as JSON with keys: hot_items_text, slow_items_text, best_time_text, trend_text, udhaar_text, restock_text"""
            }],
        )
        text = message.content[0].text
        # Try to parse JSON from response
        import re
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            insights = json.loads(json_match.group())
        else:
            insights = {"raw": text}
        return {**raw_data, "formatted": insights}
    except Exception:
        return raw_data


# ─── Static files ─────────────────────────────────────────────────────────────

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return FileResponse("static/index.html")


@app.get("/{full_path:path}")
def catch_all(full_path: str):
    return FileResponse("static/index.html")
