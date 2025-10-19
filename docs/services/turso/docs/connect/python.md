# Turso - Pythonで接続

Pythonを使用してTursoに接続する方法を説明します。

## セットアップ手順

### 1. インストール

`uv`パッケージマネージャーを使用してpytursoをインストールします：

```bash
uv pip install pyturso
```

または、通常のpipを使用：

```bash
pip install pyturso
```

### 2. 接続

ローカルSQLiteデータベースに接続します：

```python
import turso

con = turso.connect("sqlite.db")
cur = con.cursor()
```

### 3. テーブルの作成

`users`テーブルを作成します：

```python
cur.execute("""
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
  )
""")
con.commit()
```

### 4. データの挿入

プリペアドステートメントを使用してユーザーを挿入します：

```python
cur.execute("INSERT INTO users (username) VALUES (?)", ("alice",))
cur.execute("INSERT INTO users (username) VALUES (?)", ("bob",))
con.commit()
```

### 5. データのクエリ

すべてのユーザーを取得して表示します：

```python
res = cur.execute("SELECT * FROM users")
users = res.fetchall()
print(users)
```

## 完全なコード例

```python
import turso

# データベースに接続
con = turso.connect("sqlite.db")
cur = con.cursor()

# テーブルを作成
cur.execute("""
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
  )
""")
con.commit()

# データを挿入
cur.execute("INSERT INTO users (username) VALUES (?)", ("alice",))
cur.execute("INSERT INTO users (username) VALUES (?)", ("bob",))
con.commit()

# データをクエリ
res = cur.execute("SELECT * FROM users")
users = res.fetchall()
print(users)

# 接続を閉じる
con.close()
```

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```python
import turso
import os

con = turso.connect(
    url=os.environ.get("TURSO_DATABASE_URL"),
    auth_token=os.environ.get("TURSO_AUTH_TOKEN")
)
cur = con.cursor()
```

## 主な機能

### プリペアドステートメント

SQLインジェクション攻撃を防ぐため、プリペアドステートメントの使用を推奨します：

```python
username = "alice"
cur.execute("INSERT INTO users (username) VALUES (?)", (username,))
```

**注意**: パラメータはタプルとして渡す必要があります。単一の値の場合でも `(value,)` の形式にします。

### トランザクション

デフォルトでは自動コミットモードではないため、明示的に`commit()`を呼び出す必要があります：

```python
try:
    cur.execute("INSERT INTO users (username) VALUES (?)", ("alice",))
    cur.execute("INSERT INTO users (username) VALUES (?)", ("bob",))
    con.commit()
except Exception as e:
    con.rollback()
    print(f"Error: {e}")
```

### 結果の取得

クエリ結果を取得する方法は複数あります：

```python
# すべての行を取得
res = cur.execute("SELECT * FROM users")
all_users = res.fetchall()

# 1行ずつ取得
res = cur.execute("SELECT * FROM users")
for user in res:
    print(user)

# 1行だけ取得
res = cur.execute("SELECT * FROM users WHERE id = ?", (1,))
user = res.fetchone()
```

### コンテキストマネージャー

リソースを自動的に管理するために`with`文を使用できます：

```python
with turso.connect("sqlite.db") as con:
    cur = con.cursor()
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    print(users)
```

## エラーハンドリング

適切なエラーハンドリングを実装することを推奨します：

```python
import turso

try:
    con = turso.connect("sqlite.db")
    cur = con.cursor()

    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    print(users)

except turso.Error as e:
    print(f"Database error: {e}")
finally:
    if con:
        con.close()
```

## ベストプラクティス

1. **常にプリペアドステートメントを使用**: SQLインジェクションを防ぐ
2. **接続を適切に閉じる**: リソースリークを防ぐ
3. **トランザクションを明示的に管理**: データ整合性を確保
4. **環境変数を使用**: 認証情報をコードにハードコードしない

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [pyturso PyPI](https://pypi.org/project/pyturso/)
