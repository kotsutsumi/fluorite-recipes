# Flask + Turso 統合ガイド

Flask アプリケーションで Turso データベースを使用する方法を説明します。

## セットアップ

### パッケージのインストール

```bash
pip install flask sqlalchemy-libsql python-dotenv
```

### 環境変数の設定

`.env` ファイルを作成：

```env
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

## モデルの定義

```python
# models.py
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)

class Item(Base):
    __tablename__ = "items"

    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(500))
```

## Flask アプリケーション

```python
# app.py
from flask import Flask, jsonify, request
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from models import Base, User, Item

load_dotenv()

app = Flask(__name__)

# Turso 接続の設定
TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN")

dbUrl = f"sqlite+{TURSO_DATABASE_URL}/?authToken={TURSO_AUTH_TOKEN}&secure=true"

engine = create_engine(
    dbUrl,
    connect_args={'check_same_thread': False},
    echo=True
)

# テーブルを作成
Base.metadata.create_all(engine)

@app.route("/")
def home():
    return jsonify({"message": "Flask + Turso API"})

@app.route("/users", methods=["GET"])
def get_users():
    with Session(engine) as session:
        stmt = select(User)
        users = session.scalars(stmt).all()
        return jsonify([
            {"id": user.id, "name": user.name, "email": user.email}
            for user in users
        ])

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    with Session(engine) as session:
        user = User(name=data["name"], email=data["email"])
        session.add(user)
        session.commit()
        session.refresh(user)

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email
        }), 201

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    with Session(engine) as session:
        user = session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email
        })

@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    with Session(engine) as session:
        user = session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)

        session.commit()
        session.refresh(user)

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email
        })

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    with Session(engine) as session:
        user = session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        session.delete(user)
        session.commit()

        return jsonify({"message": "User deleted"})

if __name__ == "__main__":
    app.run(debug=True)
```

## サンプルプロジェクト

GitHub に Social App の例があります。

## 関連リンク

- [Python SDK リファレンス](../reference.md)
- [SQLAlchemy との統合](../orm/sqlalchemy.md)
- [Flask 公式ドキュメント](https://flask.palletsprojects.com)
