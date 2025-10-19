# Rust SDK クイックスタート - Turso

Rust アプリケーションで Turso データベースを使用するための基本ガイドです。

## インストール

```bash
cargo add libsql
```

## 接続タイプ

### 1. 組み込みレプリカ（推奨）

ローカルレプリカとリモートデータベースを同期します。

```rust
use libsql::Builder;

#[tokio::main]
async fn main() {
    let url = std::env::var("TURSO_DATABASE_URL")
        .expect("TURSO_DATABASE_URL must be set");
    let token = std::env::var("TURSO_AUTH_TOKEN")
        .expect("TURSO_AUTH_TOKEN must be set");

    let db = Builder::new_remote_replica("local.db", url, token)
        .build()
        .await
        .unwrap();

    let conn = db.connect().unwrap();
}
```

### 2. ローカルのみ

```rust
let db = libsql::Builder::new_local("local.db")
    .build()
    .await
    .unwrap();

let conn = db.connect().unwrap();
```

### 3. リモートのみ

```rust
let url = std::env::var("TURSO_DATABASE_URL").unwrap();
let token = std::env::var("TURSO_AUTH_TOKEN").unwrap();

let db = Builder::new_remote(url, token)
    .build()
    .await
    .unwrap();

let conn = db.connect().unwrap();
```

## クエリの実行

### 基本的なクエリ

```rust
// テーブルの作成
conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)", ())
    .await?;

// データの挿入
conn.execute("INSERT INTO users (name) VALUES ('Alice')", ())
    .await?;

// データの取得
let mut rows = conn.query("SELECT * FROM users", ()).await?;

while let Some(row) = rows.next().await? {
    let id: i64 = row.get(0)?;
    let name: String = row.get(1)?;
    println!("User: {} - {}", id, name);
}
```

### プレースホルダーの使用

```rust
use libsql::params;

// 位置指定パラメータ
conn.execute(
    "SELECT * FROM users WHERE id = ?1",
    params![1]
).await?;

// 名前付きパラメータ
use libsql::named_params;

conn.execute(
    "INSERT INTO users (name) VALUES (:name)",
    named_params! { ":name": "Iku" }
).await?;
```

## 同期機能（組み込みレプリカ）

### 手動同期

```rust
db.sync().await.unwrap();
```

### 自動定期同期

```rust
use std::time::Duration;

let db = Builder::new_remote_replica("local.db", url, token)
    .sync_interval(Duration::from_secs(60)) // 60秒ごとに同期
    .build()
    .await?;
```

## 完全な例

```rust
use libsql::{Builder, params};
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = std::env::var("TURSO_DATABASE_URL")?;
    let token = std::env::var("TURSO_AUTH_TOKEN")?;

    // データベースを作成（自動同期付き）
    let db = Builder::new_remote_replica("local.db", url, token)
        .sync_interval(Duration::from_secs(60))
        .build()
        .await?;

    let conn = db.connect()?;

    // テーブルを作成
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )",
        (),
    ).await?;

    // データを挿入
    conn.execute(
        "INSERT INTO users (name, email) VALUES (?1, ?2)",
        params!["Alice", "alice@example.com"],
    ).await?;

    // データを取得
    let mut rows = conn.query("SELECT id, name, email FROM users", ()).await?;

    println!("Users:");
    while let Some(row) = rows.next().await? {
        let id: i64 = row.get(0)?;
        let name: String = row.get(1)?;
        let email: String = row.get(2)?;
        println!("  {} - {} ({})", id, name, email);
    }

    Ok(())
}
```

## 関連リンク

- [Rust SDK リファレンス](./reference.md)
- [Actix との統合](./guides/actix.md)
- [Axum との統合](./guides/axum.md)
