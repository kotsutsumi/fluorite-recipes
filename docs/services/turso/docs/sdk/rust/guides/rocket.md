# Rocket + Turso 統合ガイド

Rocket フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ

### 依存関係の追加

```bash
cargo add libsql rocket serde tokio
```

### データベース接続

```rust
#[macro_use] extern crate rocket;

use libsql::Database;
use rocket::{State, serde::json::Json};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Todo {
    id: i64,
    title: String,
    completed: bool,
}

#[get("/todos")]
async fn get_todos(db: &State<Database>) -> Json<Vec<Todo>> {
    let conn = db.connect().unwrap();

    let mut response = conn
        .query("SELECT id, title, completed FROM todos", ())
        .await
        .unwrap();

    let mut todos = Vec::new();

    while let Some(row) = response.next().await.unwrap() {
        todos.push(Todo {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            completed: row.get::<bool>(2).unwrap(),
        });
    }

    Json(todos)
}

#[launch]
async fn rocket() -> _ {
    let url = env::var("TURSO_DATABASE_URL")
        .expect("TURSO_DATABASE_URL not found!");
    let token = env::var("TURSO_AUTH_TOKEN")
        .expect("TURSO_AUTH_TOKEN not found!");

    let db = Database::open_remote(url, token).unwrap();

    rocket::build()
        .manage(db)
        .mount("/", routes![get_todos])
}
```

## サンプルプロジェクト

**Todo List**: GitHub で完全な例を確認できます。

## 関連リンク

- [Rust SDK リファレンス](../reference.md)
- [Rocket 公式ドキュメント](https://rocket.rs)
