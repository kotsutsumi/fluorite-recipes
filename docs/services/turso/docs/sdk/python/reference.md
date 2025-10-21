# Python SDK リファレンス - Turso

libSQL Python SDK の完全なリファレンスドキュメントです。

## インストール

```bash
pip install libsql
```

## 接続

### 組み込みレプリカ

```python
import libsql
import os

conn = libsql.connect(
    "local.db",
    sync_url=os.getenv("LIBSQL_URL"),
    auth_token=os.getenv("LIBSQL_AUTH_TOKEN")
)
```

### 定期的な自動同期

```python
conn = libsql.connect(
    "local.db",
    sync_url=os.getenv("LIBSQL_URL"),
    auth_token=os.getenv("LIBSQL_AUTH_TOKEN"),
    sync_interval=60  # 60秒ごとに同期
)
```

### 手動同期

```python
conn.sync()
```

## 暗号化

```python
encryption_key = os.getenv("ENCRYPTION_KEY")

conn = libsql.connect(
    "encrypted.db",
    encryption_key=encryption_key
)
```

**重要**: 暗号化されたデータベースは libSQL クライアントでのみ読み取り可能です。

## クエリメソッド

### execute()

```python
# SELECT クエリ
result = conn.execute("SELECT * FROM users")
rows = result.fetchall()

# INSERT クエリ
cursor = conn.execute(
    "INSERT INTO users (name) VALUES (?)",
    ("Alice",)
)
print(f"Inserted ID: {cursor.lastrowid}")

# UPDATE クエリ
cursor = conn.execute(
    "UPDATE users SET name = ? WHERE id = ?",
    ("Bob", 1)
)
print(f"Rows affected: {cursor.rowcount}")
```

### executemany()

```python
users = [
    ("Alice", "alice@example.com"),
    ("Bob", "bob@example.com"),
    ("Charlie", "charlie@example.com"),
]

conn.executemany(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    users
)
conn.commit()
```

### executescript()

```python
conn.executescript("""
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);
    INSERT INTO users (name) VALUES ('Alice');
    INSERT INTO users (name) VALUES ('Bob');
""")
```

## 結果の取得

### fetchone()

```python
result = conn.execute("SELECT * FROM users WHERE id = ?", (1,))
row = result.fetchone()

if row:
    print(f"ID: {row[0]}, Name: {row[1]}")
```

### fetchall()

```python
result = conn.execute("SELECT * FROM users")
rows = result.fetchall()

for row in rows:
    print(f"ID: {row[0]}, Name: {row[1]}")
```

### fetchmany()

```python
result = conn.execute("SELECT * FROM users")

while True:
    rows = result.fetchmany(10)  # 10行ずつ取得
    if not rows:
        break
    for row in rows:
        print(row)
```

### イテレータとして使用

```python
result = conn.execute("SELECT * FROM users")

for row in result:
    print(f"User: {row[1]}")
```

## カーソル

### カーソルの作成

```python
cur = conn.cursor()

cur.execute("SELECT * FROM users")
for row in cur:
    print(row)

cur.close()
```

### with 文での使用

```python
with conn:  # トランザクションを自動的にコミット/ロールバック
    conn.execute("INSERT INTO users (name) VALUES (?)", ("Dave",))
```

## トランザクション

### 明示的なトランザクション

```python
try:
    conn.execute("BEGIN")

    conn.execute("INSERT INTO users (name) VALUES (?)", ("Eve",))
    conn.execute("UPDATE stats SET count = count + 1")

    conn.execute("COMMIT")
except Exception as e:
    conn.execute("ROLLBACK")
    raise e
```

### with 文でのトランザクション

```python
try:
    with conn:
        conn.execute("INSERT INTO users (name) VALUES (?)", ("Frank",))
        conn.execute("UPDATE stats SET count = count + 1")
except Exception as e:
    print(f"Transaction failed: {e}")
```

## Row オブジェクト

### 行ファクトリの設定

```python
import libsql

def dict_factory(cursor, row):
    """辞書形式で行を返す"""
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

conn.row_factory = dict_factory

result = conn.execute("SELECT * FROM users")
for row in result:
    print(f"Name: {row['name']}, Email: {row['email']}")
```

### Row クラスの使用

```python
conn.row_factory = libsql.Row

result = conn.execute("SELECT * FROM users")
for row in result:
    # インデックスでアクセス
    print(row[0], row[1])

    # カラム名でアクセス
    print(row['name'], row['email'])
```

## 型変換

### カスタムアダプタ

```python
import datetime

def adapt_datetime(dt):
    return dt.isoformat()

libsql.register_adapter(datetime.datetime, adapt_datetime)

conn.execute(
    "INSERT INTO events (name, timestamp) VALUES (?, ?)",
    ("Event", datetime.datetime.now())
)
```

### カスタムコンバータ

```python
def convert_datetime(val):
    return datetime.datetime.fromisoformat(val.decode())

libsql.register_converter("datetime", convert_datetime)

conn = libsql.connect("app.db", detect_types=libsql.PARSE_DECLTYPES)
```

## エラーハンドリング

```python
import libsql

try:
    conn.execute("INSERT INTO users (email) VALUES (?)", ("test@example.com",))
    conn.commit()
except libsql.IntegrityError as e:
    print(f"Integrity error: {e}")
except libsql.OperationalError as e:
    print(f"Operational error: {e}")
except libsql.DatabaseError as e:
    print(f"Database error: {e}")
```

## ベストプラクティス

### コンテキストマネージャーの使用

```python
def get_users():
    with libsql.connect("app.db") as conn:
        result = conn.execute("SELECT * FROM users")
        return result.fetchall()
```

### プリペアドステートメント

```python
# 同じクエリを複数回実行する場合
stmt = "INSERT INTO users (name, email) VALUES (?, ?)"

for user in user_list:
    conn.execute(stmt, (user['name'], user['email']))

conn.commit()
```

### パラメータ化されたクエリ

```python
# ❌ 危険: SQL インジェクションの可能性
user_input = "Alice"
conn.execute(f"SELECT * FROM users WHERE name = '{user_input}'")

# ✅ 安全: パラメータ化
conn.execute("SELECT * FROM users WHERE name = ?", (user_input,))
```

## 関連リンク

- [Python SDK クイックスタート](./quickstart.md)
- [Flask との統合](./guides/flask.md)
- [SQLAlchemy ORM との統合](./orm/sqlalchemy.md)
