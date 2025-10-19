# Axum + Turso 統合ガイド

Axum フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ

### 依存関係の追加

```bash
cargo add libsql axum tokio serde
```

### データベース接続とアプリケーション

```rust
use axum::{
    extract::State,
    routing::get,
    Json, Router,
};
use libsql::{Builder, Database};
use serde::Serialize;
use std::sync::Arc;

#[derive(Clone)]
struct AppState {
    db: Arc<Database>,
}

#[derive(Serialize)]
struct User {
    id: i64,
    name: String,
    email: String,
}

async fn get_users(State(state): State<AppState>) -> Json<Vec<User>> {
    let conn = state.db.connect().unwrap();

    let mut rows = conn
        .query("SELECT id, name, email FROM users", ())
        .await
        .unwrap();

    let mut users = Vec::new();

    while let Some(row) = rows.next().await.unwrap() {
        users.push(User {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            email: row.get(2).unwrap(),
        });
    }

    Json(users)
}

#[tokio::main]
async fn main() {
    let db_url = std::env::var("TURSO_DATABASE_URL").unwrap();
    let auth_token = std::env::var("TURSO_AUTH_TOKEN").unwrap();

    let db = Builder::new_remote(db_url, auth_token)
        .build()
        .await
        .unwrap();

    let state = AppState { db: Arc::new(db) };

    let app = Router::new()
        .route("/users", get(get_users))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
```

## 関連リンク

- [Rust SDK リファレンス](../reference.md)
- [Axum 公式ドキュメント](https://github.com/tokio-rs/axum)
