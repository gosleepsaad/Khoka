import sqlite3
import os

DATABASE = os.environ.get("DATABASE_PATH", "khoka.db")


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript("""
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
    """)
    conn.commit()
    conn.close()
