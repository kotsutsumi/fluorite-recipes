# Turso - Rustで接続

Rustを使用してTursoに接続する方法を説明します。

## セットアップ手順

### 1. インストール

Cargoを使用してTurso crateをプロジェクトに追加します：

```bash
cargo add turso
```

または、`Cargo.toml`に直接追加：

```toml
[dependencies]
turso = "*"
tokio = { version = "1", features = ["full"] }
```

### 2. 接続

ローカルSQLiteデータベースに接続します：

```rust
use turso::Builder;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Builder::new_local("sqlite.db").build().await?;

    Ok(())
}
```

### 3. テーブルの作成

`users`テーブルを作成します：

```rust
db.execute(
    "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL
    )"
).await?;
```

### 4. データの挿入

プリペアドステートメントを使用してユーザーを挿入します：

```rust
db.execute("INSERT INTO users (id, username) VALUES (?, ?)")
    .bind(1)
    .bind("alice")
    .await?;

db.execute("INSERT INTO users (id, username) VALUES (?, ?)")
    .bind(2)
    .bind("bob")
    .await?;
```

### 5. データのクエリ

すべてのユーザーを取得して表示します：

```rust
let rows = db.query("SELECT * FROM users").await?;

for row in rows {
    println!("{:?}", row);
}
```

## 完全なコード例

```rust
use turso::Builder;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // データベースに接続
    let db = Builder::new_local("sqlite.db").build().await?;

    // テーブルを作成
    db.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL
        )"
    ).await?;

    // データを挿入
    db.execute("INSERT INTO users (id, username) VALUES (?, ?)")
        .bind(1)
        .bind("alice")
        .await?;

    db.execute("INSERT INTO users (id, username) VALUES (?, ?)")
        .bind(2)
        .bind("bob")
        .await?;

    // データをクエリ
    let rows = db.query("SELECT * FROM users").await?;

    println!("Users:");
    for row in rows {
        println!("  {:?}", row);
    }

    Ok(())
}
```

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```rust
use turso::Builder;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = env::var("TURSO_DATABASE_URL")?;
    let token = env::var("TURSO_AUTH_TOKEN")?;

    let db = Builder::new_remote(url, token).build().await?;

    Ok(())
}
```

## 主な機能

### プリペアドステートメント

SQLインジェクション攻撃を防ぐため、プリペアドステートメントの使用を推奨します：

```rust
let username = "alice";
db.execute("INSERT INTO users (username) VALUES (?)")
    .bind(username)
    .await?;
```

### トランザクション

複数の操作をアトミックに実行できます：

```rust
let tx = db.transaction().await?;

tx.execute("INSERT INTO users (username) VALUES (?)")
    .bind("alice")
    .await?;

tx.execute("INSERT INTO users (username) VALUES (?)")
    .bind("bob")
    .await?;

tx.commit().await?;
```

### 型安全なクエリ

Rustの型システムを活用して型安全なクエリを作成できます：

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct User {
    id: i64,
    username: String,
}

let rows = db.query("SELECT id, username FROM users").await?;

for row in rows {
    let user: User = serde_json::from_value(row)?;
    println!("User: {} - {}", user.id, user.username);
}
```

### エラーハンドリング

Rustの`Result`型を使用した適切なエラーハンドリング：

```rust
use turso::Builder;

async fn get_user(db: &turso::Database, id: i64) -> Result<Option<String>, Box<dyn std::error::Error>> {
    let rows = db.query("SELECT username FROM users WHERE id = ?")
        .bind(id)
        .await?;

    if let Some(row) = rows.first() {
        let username = row.get("username")
            .and_then(|v| v.as_str())
            .map(String::from);
        Ok(username)
    } else {
        Ok(None)
    }
}
```

### バッチ操作

複数のクエリを一度に実行できます：

```rust
let statements = vec![
    "INSERT INTO users (username) VALUES ('alice')",
    "INSERT INTO users (username) VALUES ('bob')",
    "INSERT INTO users (username) VALUES ('charlie')",
];

for stmt in statements {
    db.execute(stmt).await?;
}
```

## 非同期プログラミング

Turso Rustクライアントは完全に非同期です。Tokioランタイムが必要です：

```toml
[dependencies]
turso = "*"
tokio = { version = "1", features = ["full"] }
```

非同期コンテキストでのエラーハンドリング：

```rust
#[tokio::main]
async fn main() {
    if let Err(e) = run().await {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let db = Builder::new_local("sqlite.db").build().await?;
    // データベース操作
    Ok(())
}
```

## ベストプラクティス

1. **型安全性を活用**: Rustの型システムを最大限に活用
2. **エラーハンドリング**: `Result`型と`?`演算子を使用
3. **非同期処理**: `async/await`を適切に使用
4. **プリペアドステートメント**: SQLインジェクションを防ぐ
5. **環境変数**: 認証情報をコードにハードコードしない

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [turso Rust crate](https://crates.io/crates/turso)
- [Tokio Documentation](https://tokio.rs/)
