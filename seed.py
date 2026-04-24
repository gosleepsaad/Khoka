"""Seed database with realistic fake data for a Pakistani khoka."""
import sqlite3
import random
from datetime import datetime, timedelta, date
from database import get_db, init_db

CATEGORIES = [
    (1, "Cigarettes", "سگریٹ", 1),
    (2, "Cold Drinks", "ٹھنڈے مشروبات", 2),
    (3, "Snacks", "نمکین", 3),
    (4, "Other", "دیگر", 4),
]

ITEMS = [
    # Cigarettes (category 1)
    (1, 1, "Gold Leaf Single", "گولڈ لیف سنگل", 30, 1, 0, 1),
    (2, 1, "Gold Leaf Half", "گولڈ لیف ہاف", 255, 1, 0, 2),
    (3, 1, "Gold Leaf Full", "گولڈ لیف فل", 510, 1, 0, 3),
    (4, 1, "Marlboro Single", "مارلبورو سنگل", 35, 1, 0, 4),
    (5, 1, "Marlboro Full", "مارلبورو فل", 320, 1, 0, 5),
    (6, 1, "Morven Single", "مورون سنگل", 15, 1, 0, 6),
    (7, 1, "Morven Full", "مورون فل", 160, 1, 0, 7),
    (8, 1, "K2 Single", "کے ٹو سنگل", 15, 1, 0, 8),
    (9, 1, "K2 Full", "کے ٹو فل", 160, 1, 0, 9),
    (10, 1, "Pine Single", "پائن سنگل", 15, 1, 0, 10),
    (11, 1, "Capstan Single", "کیپسٹن سنگل", 20, 1, 0, 11),
    # Cold Drinks (category 2)
    (12, 2, "Pepsi", "پیپسی", 80, 1, 0, 1),
    (13, 2, "Coke", "کوک", 80, 1, 0, 2),
    (14, 2, "7Up", "سیون اپ", 80, 1, 0, 3),
    (15, 2, "Sprite", "سپرائٹ", 80, 1, 0, 4),
    (16, 2, "Sting", "اسٹنگ", 80, 1, 0, 5),
    (17, 2, "Mountain Dew", "ماؤنٹن ڈیو", 80, 1, 0, 6),
    (18, 2, "Water", "پانی", 50, 1, 0, 7),
    # Snacks (category 3)
    (19, 3, "Lays Small", "لیز چھوٹا", 20, 1, 0, 1),
    (20, 3, "Lays Big", "لیز بڑا", 50, 1, 0, 2),
    (21, 3, "Kurkure", "کرکرے", 20, 1, 0, 3),
    (22, 3, "Candies", "ٹافیاں", 5, 1, 0, 4),
    # Other (category 4)
    (23, 4, "Pan", "پان", 30, 1, 0, 1),
    (24, 4, "Gutka", "گٹکا", 20, 1, 0, 2),
]

CUSTOMERS = [
    (1, "Asif Ali", "0300-1234567", "35202-1234567-1"),
    (2, "Raheel Ahmed", "0321-9876543", "35201-9876543-2"),
    (3, "Tariq Mehmood", "0333-5551234", "35202-5551234-3"),
    (4, "Bilal Hussain", "0312-7778888", ""),
    (5, "Kamran Iqbal", "0345-4443322", "35201-4443322-5"),
]

# Weighted item picks for realistic sales (cigarettes dominate)
ITEM_WEIGHTS = {
    1: 25,   # Gold Leaf Single — most sold
    4: 15,   # Marlboro Single
    6: 12,   # Morven Single
    8: 10,   # K2 Single
    10: 8,   # Pine Single
    11: 7,   # Capstan Single
    2: 4,    # Gold Leaf Half
    3: 2,    # Gold Leaf Full
    5: 2,    # Marlboro Full
    7: 3,    # Morven Full
    9: 3,    # K2 Full
    12: 6,   # Pepsi
    13: 5,   # Coke
    16: 7,   # Sting
    17: 4,   # Mountain Dew
    14: 3,   # 7Up
    15: 3,   # Sprite
    18: 5,   # Water
    19: 4,   # Lays Small
    20: 2,   # Lays Big
    21: 3,   # Kurkure
    22: 3,   # Candies
    23: 5,   # Pan
    24: 4,   # Gutka
}

ITEM_PRICES = {i[0]: i[4] for i in ITEMS}
ITEM_NAMES = {i[0]: i[2] for i in ITEMS}


def weighted_choice(weights_dict):
    items = list(weights_dict.keys())
    weights = list(weights_dict.values())
    return random.choices(items, weights=weights, k=1)[0]


def seed():
    init_db()
    conn = get_db()
    c = conn.cursor()

    # Check if already seeded
    c.execute("SELECT COUNT(*) FROM categories")
    if c.fetchone()[0] > 0:
        print("Database already seeded, skipping.")
        conn.close()
        return

    # Insert categories
    c.executemany(
        "INSERT INTO categories (id, name, name_ur, sort_order) VALUES (?,?,?,?)",
        CATEGORIES,
    )

    # Insert items
    c.executemany(
        "INSERT INTO items (id, category_id, name, name_ur, price, is_active, is_low_stock, sort_order) VALUES (?,?,?,?,?,?,?,?)",
        ITEMS,
    )

    # Insert customers
    now_str = datetime.now().isoformat()
    for cust in CUSTOMERS:
        c.execute(
            "INSERT INTO customers (id, name, phone, cnic, created_at) VALUES (?,?,?,?,?)",
            (*cust, now_str),
        )

    # Generate 16 days of sales history (today minus 15 days to today)
    today = date.today()
    sale_id = 1

    for days_ago in range(15, -1, -1):
        sale_date = today - timedelta(days=days_ago)
        # More sales on weekends, peak hours: 7-9am, 12-2pm, 5-9pm
        num_sales = random.randint(35, 65)

        for _ in range(num_sales):
            # Random hour weighted to peak times
            hour = random.choices(
                list(range(6, 23)),
                weights=[2, 5, 7, 4, 3, 8, 6, 10, 8, 12, 15, 14, 10, 8, 6, 4, 3],
                k=1,
            )[0]
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            sale_dt = datetime(
                sale_date.year, sale_date.month, sale_date.day, hour, minute, second
            )

            # Generate 1-4 items per sale
            num_items = random.choices([1, 2, 3, 4], weights=[55, 25, 15, 5], k=1)[0]
            chosen_items = {}
            for _ in range(num_items):
                item_id = weighted_choice(ITEM_WEIGHTS)
                qty = random.choices([1, 2, 3], weights=[75, 20, 5], k=1)[0]
                chosen_items[item_id] = chosen_items.get(item_id, 0) + qty

            total = sum(ITEM_PRICES[iid] * qty for iid, qty in chosen_items.items())

            c.execute(
                "INSERT INTO sales (id, total, created_at) VALUES (?,?,?)",
                (sale_id, total, sale_dt.isoformat()),
            )
            for item_id, qty in chosen_items.items():
                c.execute(
                    "INSERT INTO sale_items (sale_id, item_id, item_name, price, quantity) VALUES (?,?,?,?,?)",
                    (sale_id, item_id, ITEM_NAMES[item_id], ITEM_PRICES[item_id], qty),
                )
            sale_id += 1

    # Udhaar transactions for customers
    udhaar_id = 1
    udhaar_balances = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    for days_ago in range(14, -1, -1):
        txn_date = today - timedelta(days=days_ago)
        # Each customer has random chance of udhaar each day
        for cust_id in range(1, 6):
            if random.random() < 0.25:  # 25% chance per customer per day
                amount = random.choice([50, 80, 100, 150, 160, 200, 255, 300, 320])
                udhaar_balances[cust_id] += amount
                txn_dt = datetime(txn_date.year, txn_date.month, txn_date.day,
                                  random.randint(8, 20), random.randint(0, 59))
                c.execute(
                    "INSERT INTO udhaar_transactions (id, customer_id, amount, type, note, created_at) VALUES (?,?,?,?,?,?)",
                    (udhaar_id, cust_id, amount, "debit", "Udhaar", txn_dt.isoformat()),
                )
                udhaar_id += 1

            # Occasional payments
            if udhaar_balances[cust_id] > 300 and random.random() < 0.2:
                payment = random.choice([100, 200, 300])
                payment = min(payment, udhaar_balances[cust_id])
                udhaar_balances[cust_id] -= payment
                txn_dt = datetime(txn_date.year, txn_date.month, txn_date.day,
                                  random.randint(8, 20), random.randint(0, 59))
                c.execute(
                    "INSERT INTO udhaar_transactions (id, customer_id, amount, type, note, created_at) VALUES (?,?,?,?,?,?)",
                    (udhaar_id, cust_id, payment, "credit", "Payment", txn_dt.isoformat()),
                )
                udhaar_id += 1

    # Expenses
    expense_id = 1
    for days_ago in range(15, -1, -1):
        exp_date = today - timedelta(days=days_ago)

        # Daily restock
        if random.random() < 0.7:
            amount = random.choice([500, 1000, 1500, 2000, 2500, 3000])
            exp_dt = datetime(exp_date.year, exp_date.month, exp_date.day, 8, 0)
            c.execute(
                "INSERT INTO expenses (id, category, amount, note, created_at) VALUES (?,?,?,?,?)",
                (expense_id, "restock", amount, "Daily restock from supplier", exp_dt.isoformat()),
            )
            expense_id += 1

        # Monthly expenses on day 1 of the seeded period (15 days ago)
        if days_ago == 15:
            monthly_dt = datetime(exp_date.year, exp_date.month, exp_date.day, 8, 0)
            c.execute(
                "INSERT INTO expenses (id, category, amount, note, created_at) VALUES (?,?,?,?,?)",
                (expense_id, "rent", 8000, "Monthly rent", monthly_dt.isoformat()),
            )
            expense_id += 1
            c.execute(
                "INSERT INTO expenses (id, category, amount, note, created_at) VALUES (?,?,?,?,?)",
                (expense_id, "electricity", 2500, "Electricity bill", monthly_dt.isoformat()),
            )
            expense_id += 1

    # Mark K2 Full and Morven Full as low stock for demo
    c.execute("UPDATE items SET is_low_stock=1 WHERE id IN (9, 7)")

    # Add a couple of buy list items
    c.execute(
        "INSERT INTO buy_list (item_id, item_name, note, created_at) VALUES (?,?,?,?)",
        (9, "K2 Full", "Running low", datetime.now().isoformat()),
    )
    c.execute(
        "INSERT INTO buy_list (item_id, item_name, note, created_at) VALUES (?,?,?,?)",
        (7, "Morven Full", "Running low", datetime.now().isoformat()),
    )

    conn.commit()
    conn.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed()
