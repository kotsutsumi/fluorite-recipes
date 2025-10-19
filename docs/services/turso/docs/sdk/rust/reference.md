# Rust SDK リファレンス - Turso

libSQL Rust SDK の完全なリファレンスドキュメントです。

## インストール

```bash
cargo add libsql
```

## コンパイル機能

```toml
[dependencies]
libsql = { version = "0.3", features = ["remote", "replication", "encryption"] }
```

機能フラグ：
- `remote`: リモートサーバー用の HTTP クライアント
- `core`: SQLite3 を使用したローカルデータベース
- `replication`: 組み込みレプリカサポート
- `encryption`: データ暗号化機能

## データベースの初期化

### リモートレプリカ

```rust
use libsql::Builder;

let db = Builder::new_remote_replica("local.db", &url, &token)
    .build()
    .await?;
```

### インメモリデータベース

```rust
let db = Builder::new_local(":memory:")
    .build()
    .await?;
```

### ローカル SQLite ファイル

```rust
let db = Builder::new_local("local.db")
    .build()
    .await?;
```

### リモートのみ

```rust
let db = Builder::new_remote(url, token)
    .build()
    .await?;
```

## 同期機能

### 手動同期

```rust
db.sync().await?;
```

### 定期的な自動同期

```rust
use std::time::Duration;

let db = Builder::new_remote_replica("local.db", url, token)
    .sync_interval(Duration::from_secs(60))
    .build()
    .await?;
```

### Read-Your-Writes 一貫性

```rust
let db = Builder::new_remote_replica("local.db", url, token)
    .read_your_writes(true)
    .build()
    .await?;
```

## 暗号化

```rust
let encryption_key = std::env::var("ENCRYPTION_KEY")?;

let db = Builder::new_local("encrypted.db")
    .encryption_config(libsql::EncryptionConfig::new(
        libsql::Cipher::Aes256Cbc,
        encryption_key.as_bytes().to_vec(),
    ))
    .build()
    .await?;
```

**注意**: 暗号化されたデータベースは libSQL クライアントでのみ読み取り可能です。

## クエリの実行

### 基本的なクエリ

```rust
let conn = db.connect()?;

conn.execute("SELECT * FROM users", ()).await?;
```

### プリペアドステートメント

```rust
let stmt = conn.prepare("SELECT * FROM users WHERE id = ?1").await?;
let mut rows = conn.query(&stmt, params![1]).await?;

while let Some(row) = rows.next().await? {
    // 行を処理
}
```

### パラメータ付きクエリ

```rust
use libsql::{params, named_params};

// 位置指定パラメータ
conn.execute(
    "INSERT INTO users (name, email) VALUES (?1, ?2)",
    params!["Alice", "alice@example.com"],
).await?;

// 名前付きパラメータ
conn.execute(
    "INSERT INTO users (name, email) VALUES (:name, :email)",
    named_params! {
        ":name": "Bob",
        ":email": "bob@example.com"
    },
).await?;
```

## トランザクション

### バッチトランザクション

```rust
let tx = conn.transaction().await?;

tx.execute("INSERT INTO users (name) VALUES ('Alice')", ()).await?;
tx.execute("INSERT INTO users (name) VALUES ('Bob')", ()).await?;

tx.commit().await?;
```

### インタラクティブトランザクション

```rust
let tx = conn.transaction().await?;

match tx.execute("INSERT INTO users (name) VALUES ('Charlie')", ()).await {
    Ok(_) => tx.commit().await?,
    Err(e) => {
        tx.rollback().await?;
        return Err(e.into());
    }
}
```

## 行のデシリアライゼーション

### 手動でフィールドを取得

```rust
let mut rows = conn.query("SELECT id, name, email FROM users", ()).await?;

while let Some(row) = rows.next().await? {
    let id: i64 = row.get(0)?;
    let name: String = row.get(1)?;
    let email: String = row.get(2)?;
    println!("{}: {} - {}", id, name, email);
}
```

### Serde との統合

```rust
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct User {
    id: i64,
    name: String,
    email: String,
}

let mut rows = conn.query("SELECT id, name, email FROM users", ()).await?;

while let Some(row) = rows.next().await? {
    let user = libsql::de::from_row::<User>(&row)?;
    println!("{:?}", user);
}
```

## エラーハンドリング

```rust
use libsql::Error;

match conn.execute("INSERT INTO users (email) VALUES (?1)", params!["test@example.com"]).await {
    Ok(_) => println!("Success"),
    Err(Error::SqliteFailure(code, msg)) => {
        eprintln!("SQL Error {}: {}", code, msg.unwrap_or_default());
    }
    Err(e) => {
        eprintln!("Error: {}", e);
    }
}
```

## ベストプラクティス

### 接続プール

```rust
use std::sync::Arc;

let db = Arc::new(Builder::new_remote_replica("local.db", url, token)
    .build()
    .await?);

// 複数のタスクで db をクローン
let db_clone = Arc::clone(&db);
tokio::spawn(async move {
    let conn = db_clone.connect().unwrap();
    // クエリを実行
});
```

### エラー処理

```rust
async fn get_user(conn: &libsql::Connection, id: i64) -> Result<Option<User>, Box<dyn std::error::Error>> {
    let mut rows = conn.query(
        "SELECT id, name, email FROM users WHERE id = ?1",
        params![id],
    ).await?;

    if let Some(row) = rows.next().await? {
        Ok(Some(User {
            id: row.get(0)?,
            name: row.get(1)?,
            email: row.get(2)?,
        }))
    } else {
        Ok(None)
    }
}
```

## 関連リンク

- [Rust SDK クイックスタート](./quickstart.md)
- [Actix との統合](./guides/actix.md)
- [Axum との統合](./guides/axum.md)
- [Rocket との統合](./guides/rocket.md)
- [Tauri との統合](./guides/tauri.md)
