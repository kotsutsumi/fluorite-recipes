# Python SDK クイックスタート - Turso

Python アプリケーションで Turso データベースを使用するための基本ガイドです。

## インストール

```bash
pip install libsql
```

## 接続方法

### 1. 組み込みレプリカ（推奨）

```python
import libsql
import os

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

conn = libsql.connect("hello.db", sync_url=url, auth_token=auth_token)
conn.sync()
```

### 2. ローカルのみ

```python
conn = libsql.connect("hello.db")
```

### 3. インメモリ

```python
conn = libsql.connect(":memory:")
```

## クエリの実行

### テーブルの作成

```python
conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )
""")
```

### データの挿入

```python
# 単一レコード
conn.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ("Alice", "alice@example.com")
)

# トランザクションをコミット
conn.commit()
```

### データの取得

```python
# すべてのユーザーを取得
results = conn.execute("SELECT * FROM users").fetchall()

for row in results:
    print(f"ID: {row[0]}, Name: {row[1]}, Email: {row[2]}")

# 単一レコードを取得
result = conn.execute(
    "SELECT * FROM users WHERE id = ?",
    (1,)
).fetchone()

if result:
    print(f"Found user: {result[1]}")
```

### データの更新

```python
conn.execute(
    "UPDATE users SET name = ? WHERE id = ?",
    ("Alice Updated", 1)
)
conn.commit()
```

### データの削除

```python
conn.execute("DELETE FROM users WHERE id = ?", (1,))
conn.commit()
```

## カーソルの使用

```python
cur = conn.cursor()

# データを挿入
cur.execute("INSERT INTO users (name, email) VALUES (?, ?)", ("Bob", "bob@example.com"))

# データを取得
cur.execute("SELECT * FROM users")
for row in cur:
    print(row)

cur.close()
```

## トランザクション

```python
try:
    conn.execute("BEGIN")

    conn.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        ("Charlie", "charlie@example.com")
    )

    conn.execute(
        "UPDATE stats SET count = count + 1"
    )

    conn.execute("COMMIT")
except Exception as e:
    conn.execute("ROLLBACK")
    raise e
```

## 同期機能（組み込みレプリカ）

### 手動同期

```python
# 変更を加えた後に同期
conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", ("Dave", "dave@example.com"))
conn.commit()
conn.sync()
```

### 定期的な同期

```python
import time

while True:
    # 処理を実行
    conn.execute("SELECT COUNT(*) FROM users").fetchone()

    # 定期的に同期
    conn.sync()

    time.sleep(60)  # 60秒待機
```

## 完全な例

```python
import libsql
import os
from typing import List, Optional

def create_connection():
    """データベース接続を作成"""
    url = os.getenv("TURSO_DATABASE_URL")
    auth_token = os.getenv("TURSO_AUTH_TOKEN")

    if url and auth_token:
        # 組み込みレプリカ
        conn = libsql.connect("app.db", sync_url=url, auth_token=auth_token)
        conn.sync()
    else:
        # ローカルのみ
        conn = libsql.connect("app.db")

    return conn

def create_table(conn):
    """テーブルを作成"""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    """)
    conn.commit()

def create_user(conn, name: str, email: str) -> int:
    """ユーザーを作成"""
    cursor = conn.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        (name, email)
    )
    conn.commit()

    if hasattr(conn, 'sync'):
        conn.sync()

    return cursor.lastrowid

def get_all_users(conn) -> List[tuple]:
    """すべてのユーザーを取得"""
    results = conn.execute("SELECT id, name, email FROM users").fetchall()
    return results

def get_user_by_id(conn, user_id: int) -> Optional[tuple]:
    """IDでユーザーを取得"""
    result = conn.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()
    return result

def update_user(conn, user_id: int, name: str):
    """ユーザーを更新"""
    conn.execute(
        "UPDATE users SET name = ? WHERE id = ?",
        (name, user_id)
    )
    conn.commit()

    if hasattr(conn, 'sync'):
        conn.sync()

def delete_user(conn, user_id: int):
    """ユーザーを削除"""
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()

    if hasattr(conn, 'sync'):
        conn.sync()

def main():
    # データベースに接続
    conn = create_connection()

    try:
        # テーブルを作成
        create_table(conn)

        # ユーザーを作成
        user_id = create_user(conn, "Alice", "alice@example.com")
        print(f"Created user with ID: {user_id}")

        # すべてのユーザーを取得
        users = get_all_users(conn)
        print("\nAll users:")
        for user in users:
            print(f"  {user[0]}: {user[1]} ({user[2]})")

        # ユーザーを更新
        update_user(conn, user_id, "Alice Updated")
        print(f"\nUpdated user {user_id}")

        # 更新後のユーザーを取得
        user = get_user_by_id(conn, user_id)
        if user:
            print(f"Updated user: {user[1]}")

    finally:
        conn.close()

if __name__ == "__main__":
    main()
```

## 関連リンク

- [Python SDK リファレンス](./reference.md)
- [Flask との統合](./guides/flask.md)
- [SQLAlchemy ORM との統合](./orm/sqlalchemy.md)
