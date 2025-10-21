# SQLAlchemy + Turso 統合ガイド

SQLAlchemy ORM を使用して Turso データベースを操作する方法を説明します。

## セットアップ

### パッケージのインストール

```bash
pip install sqlalchemy-libsql
```

## モデルの定義

```python
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
```

## エンジンの作成

### リモート接続

```python
from sqlalchemy import create_engine
import os

TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

engine = create_engine(
    f"sqlite+{TURSO_DATABASE_URL}?secure=true",
    connect_args={
        "auth_token": TURSO_AUTH_TOKEN,
    },
)
```

### 組み込みレプリカ

```python
engine = create_engine(
    "sqlite+file:local.db",
    connect_args={
        "sync_url": os.getenv("TURSO_DATABASE_URL"),
        "auth_token": os.getenv("TURSO_AUTH_TOKEN"),
    },
)
```

### ローカルのみ

```python
engine = create_engine("sqlite+file:local.db")
```

### インメモリ

```python
engine = create_engine("sqlite+:memory:")
```

## クエリの実行

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

# セッションを作成
session = Session(engine)

# SELECT
stmt = select(User)
for user in session.scalars(stmt):
    print(f"{user.id}: {user.name}")

# INSERT
new_user = User(name="Alice", email="alice@example.com")
session.add(new_user)
session.commit()

# UPDATE
user = session.get(User, 1)
user.name = "Alice Updated"
session.commit()

# DELETE
user = session.get(User, 1)
session.delete(user)
session.commit()

session.close()
```

## 完全な例

```python
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session
import os

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)

# エンジンを作成
TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

engine = create_engine(
    f"sqlite+{TURSO_DATABASE_URL}?secure=true",
    connect_args={"auth_token": TURSO_AUTH_TOKEN},
)

# テーブルを作成
Base.metadata.create_all(engine)

# データを操作
with Session(engine) as session:
    # ユーザーを作成
    user = User(name="Alice", email="alice@example.com")
    session.add(user)
    session.commit()

    # ユーザーを取得
    stmt = select(User)
    for user in session.scalars(stmt):
        print(f"User: {user.name} ({user.email})")
```

## 関連リンク

- [Python SDK リファレンス](../reference.md)
- [Flask との統合](../guides/flask.md)
- [SQLAlchemy 公式ドキュメント](https://docs.sqlalchemy.org)
