# Actix Web + Turso 統合ガイド

Actix Web フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ

### 依存関係の追加

```bash
cargo add libsql actix-web tokio serde
```

### データベース接続

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer, Result};
use libsql::Builder;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Item {
    id: i64,
    task: String,
}

#[get("/items")]
async fn get_items() -> Result<HttpResponse> {
    let db_url = env::var("TURSO_DATABASE_URL").unwrap();
    let auth_token = env::var("TURSO_AUTH_TOKEN").unwrap();
    let db_file = env::var("LOCAL_DB").unwrap_or_else(|_| "local.db".to_string());

    let db = Builder::new_remote_replica(db_file, db_url, auth_token)
        .read_your_writes(true)
        .build()
        .await
        .unwrap();

    let conn = db.connect().unwrap();

    let mut results = conn
        .query("SELECT id, task FROM items", ())
        .await
        .unwrap();

    let mut items: Vec<Item> = Vec::new();

    while let Some(row) = results.next().await.unwrap() {
        let item = Item {
            id: row.get(0).unwrap(),
            task: row.get(1).unwrap(),
        };
        items.push(item);
    }

    Ok(HttpResponse::Ok().json(items))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(get_items)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## サンプルプロジェクト

**Web Traffic Tracker**: GitHub で完全な例を確認できます。

## 関連リンク

- [Rust SDK リファレンス](../reference.md)
- [Actix Web 公式ドキュメント](https://actix.rs)
