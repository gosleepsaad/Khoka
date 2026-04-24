import os
import sqlite3

DATABASE_URL = os.environ.get("DATABASE_URL", "")
DATABASE_PATH = os.environ.get("DATABASE_PATH", "khoka.db")
IS_POSTGRES = DATABASE_URL.startswith("postgres")


def _pg_url():
    return DATABASE_URL.replace("postgres://", "postgresql://", 1)


def _adapt(sql):
    """Translate SQLite ? placeholders to PostgreSQL %s."""
    if not IS_POSTGRES:
        return sql
    result, i = [], 0
    while i < len(sql):
        ch = sql[i]
        if ch == "'" :          # skip string literals
            result.append(ch); i += 1
            while i < len(sql):
                result.append(sql[i])
                if sql[i] == "'" and (i + 1 >= len(sql) or sql[i+1] != "'"):
                    break
                i += 1
        elif ch == "?":
            result.append("%s")
        else:
            result.append(ch)
        i += 1
    return "".join(result)


def get_db():
    if IS_POSTGRES:
        import pg8000.dbapi as pg
        from urllib.parse import urlparse
        u = urlparse(_pg_url())
        conn = pg.connect(
            host=u.hostname,
            user=u.username,
            password=u.password,
            database=u.path.lstrip("/"),
            port=u.port or 5432,
            ssl_context=True,
        )
        return _PGConn(conn)
    else:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return _SQLiteConn(conn)


# ── Row helpers ───────────────────────────────────────────────────

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


# ── SQLite wrapper ────────────────────────────────────────────────

class _SQLiteCursor:
    def __init__(self, cur):
        self._c = cur

    def execute(self, sql, params=()):
        self._c.execute(sql, params)
        return self

    def fetchone(self):
        r = self._c.fetchone()
        return dict(r) if r else None

    def fetchall(self):
        return [dict(r) for r in self._c.fetchall()]

    @property
    def lastrowid(self):
        return self._c.lastrowid


class _SQLiteConn:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self):
        return _SQLiteCursor(self._conn.cursor())

    def execute(self, sql, params=()):
        c = self.cursor()
        c.execute(sql, params)
        return c

    def insert(self, sql, params=()):
        """Execute INSERT and return new row id."""
        c = self.cursor()
        c.execute(sql, params)
        return c.lastrowid

    def executescript(self, script):
        self._conn.executescript(script)

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()


# ── PostgreSQL wrapper ────────────────────────────────────────────

class _PGCursor:
    def __init__(self, cur):
        self._c = cur
        self.lastrowid = None

    def execute(self, sql, params=()):
        self._c.execute(_adapt(sql), params)
        return self

    def _cols(self):
        return [d[0] for d in (self._c.description or [])]

    def fetchone(self):
        r = self._c.fetchone()
        if r is None:
            return None
        return dict(zip(self._cols(), r))

    def fetchall(self):
        cols = self._cols()
        rows = self._c.fetchall()
        return [dict(zip(cols, r)) for r in rows] if rows else []


class _PGConn:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self):
        return _PGCursor(self._conn.cursor())

    def execute(self, sql, params=()):
        c = self.cursor()
        c.execute(sql, params)
        return c

    def insert(self, sql, params=()):
        """Execute INSERT RETURNING id and return the new id."""
        c = self.cursor()
        c.execute(sql + " RETURNING id", params)
        row = c.fetchone()
        return row["id"] if row else None

    def executescript(self, script):
        cur = self._conn.cursor()
        statements = [s.strip() for s in script.split(";") if s.strip()]
        for stmt in statements:
            try:
                cur.execute(stmt)
            except Exception:
                pass
        self._conn.commit()

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()


# ── Schema ────────────────────────────────────────────────────────

_SQLITE_SCHEMA = """
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ur TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    name_ur TEXT DEFAULT '',
    price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    is_low_stock INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER REFERENCES sales(id),
    item_id INTEGER,
    item_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    cnic TEXT DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS udhaar_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER REFERENCES customers(id),
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    sale_id INTEGER DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS ai_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    generated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS buy_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER DEFAULT NULL,
    item_name TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    is_completed INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"""

_POSTGRES_SCHEMA = """
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ur TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    name_ur TEXT DEFAULT '',
    price NUMERIC NOT NULL,
    is_active INTEGER DEFAULT 1,
    is_low_stock INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    total NUMERIC NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    item_id INTEGER,
    item_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    cnic TEXT DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS udhaar_transactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    sale_id INTEGER DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS ai_summary (
    id SERIAL PRIMARY KEY,
    date TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    generated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS buy_list (
    id SERIAL PRIMARY KEY,
    item_id INTEGER DEFAULT NULL,
    item_name TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    is_completed INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"""


def init_db():
    conn = get_db()
    conn.executescript(_POSTGRES_SCHEMA if IS_POSTGRES else _SQLITE_SCHEMA)
    # Seed default PIN if not set
    try:
        c = conn.cursor()
        c.execute("SELECT value FROM settings WHERE key='pin'")
        if not c.fetchone():
            conn.execute("INSERT INTO settings (key, value) VALUES (?, ?)", ("pin", "1234"))
            conn.commit()
    except Exception:
        pass
    conn.close()
