# Turso SDK - 入門

TursoのSDK（Software Development Kit）を使用してアプリケーションからデータベースに接続する方法を説明します。

## 概要

Tursoは、複数のプログラミング言語向けに公式SDKを提供しています。各SDKは、libSQLプロトコルを使用してTursoデータベースと通信し、高速で信頼性の高い接続を実現します。

## サポートされているSDK

```typescript
interface SupportedSDKs {
  official: {
    typescript: "@libsql/client";
    python: "libsql-client";
    rust: "libsql";
    go: "libsql-client-go";
    dart: "libsql_dart";
  };

  protocols: {
    http: "HTTP/REST API（サーバーレス向け）";
    websocket: "WebSocket（長期接続）";
    embedded: "Embedded Replicas（ローカル + 同期）";
  };
}
```

## クイックスタート

### TypeScript/JavaScript

```bash
# インストール
npm install @libsql/client
```

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// クエリ実行
const result = await client.execute("SELECT * FROM users");
console.log(result.rows);
```

### Python

```bash
# インストール
pip install libsql-client
```

```python
import libsql_experimental as libsql
import os

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

conn = libsql.connect(database=url, auth_token=auth_token)

# クエリ実行
cursor = conn.execute("SELECT * FROM users")
rows = cursor.fetchall()
print(rows)
```

### Rust

```toml
# Cargo.toml
[dependencies]
libsql = "0.3"
tokio = { version = "1", features = ["full"] }
```

```rust
use libsql::Builder;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = std::env::var("TURSO_DATABASE_URL")?;
    let token = std::env::var("TURSO_AUTH_TOKEN")?;

    let db = Builder::new_remote(url, token).build().await?;

    let mut rows = db.query("SELECT * FROM users", ()).await?;

    while let Some(row) = rows.next().await? {
        println!("{:?}", row);
    }

    Ok(())
}
```

### Go

```bash
# インストール
go get github.com/tursodatabase/libsql-client-go/libsql
```

```go
package main

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
    url := os.Getenv("TURSO_DATABASE_URL")
    token := os.Getenv("TURSO_AUTH_TOKEN")

    dbUrl := fmt.Sprintf("%s?authToken=%s", url, token)
    db, err := sql.Open("libsql", dbUrl)
    if err != nil {
        panic(err)
    }
    defer db.Close()

    rows, err := db.Query("SELECT * FROM users")
    if err != nil {
        panic(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        rows.Scan(&id, &name)
        fmt.Printf("%d: %s\n", id, name)
    }
}
```

## 接続方法

### 1. リモート接続（HTTP）

サーバーレス環境に最適：

```typescript
const client = createClient({
  url: "libsql://my-db-[org].turso.io",
  authToken: "your-auth-token",
});
```

**特徴:**
- 短命なコネクション
- サーバーレス関数に最適
- オーバーヘッドが少ない

### 2. リモート接続（WebSocket）

長期接続が必要な場合：

```typescript
const client = createClient({
  url: "wss://my-db-[org].turso.io",
  authToken: "your-auth-token",
});
```

**特徴:**
- 持続的な接続
- トランザクションサポート
- 低レイテンシ

### 3. ローカル接続

ローカル開発用：

```typescript
const client = createClient({
  url: "file:local.db",
});
```

**特徴:**
- 認証不要
- オフライン動作
- 開発・テストに最適

### 4. Embedded Replicas

ローカルレプリカ + リモート同期：

```typescript
const client = createClient({
  url: "file:local.db",
  syncUrl: "libsql://my-db-[org].turso.io",
  authToken: "your-auth-token",
});

// 定期同期
await client.sync();
```

**特徴:**
- 超低レイテンシ読み取り
- バックグラウンド同期
- オフライン機能

## 基本操作

### クエリの実行

```typescript
// 単純なSELECT
const result = await client.execute("SELECT * FROM users");
console.log(result.rows);

// パラメータ付きクエリ
const result = await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [1],
});

// 複数のパラメータ
const result = await client.execute({
  sql: "SELECT * FROM users WHERE age > ? AND city = ?",
  args: [18, "Tokyo"],
});
```

### INSERT/UPDATE/DELETE

```typescript
// INSERT
const result = await client.execute({
  sql: "INSERT INTO users (name, email) VALUES (?, ?)",
  args: ["Alice", "alice@example.com"],
});

console.log("Inserted ID:", result.lastInsertRowid);

// UPDATE
await client.execute({
  sql: "UPDATE users SET email = ? WHERE id = ?",
  args: ["newemail@example.com", 1],
});

// DELETE
await client.execute({
  sql: "DELETE FROM users WHERE id = ?",
  args: [1],
});
```

### トランザクション

```typescript
// トランザクション開始
await client.execute("BEGIN TRANSACTION");

try {
  await client.execute({
    sql: "INSERT INTO accounts (user_id, balance) VALUES (?, ?)",
    args: [1, 1000],
  });

  await client.execute({
    sql: "UPDATE users SET has_account = 1 WHERE id = ?",
    args: [1],
  });

  // コミット
  await client.execute("COMMIT");
} catch (error) {
  // ロールバック
  await client.execute("ROLLBACK");
  throw error;
}
```

### バッチ実行

```typescript
// 複数のステートメントを一度に実行
const results = await client.batch([
  "SELECT * FROM users WHERE id = 1",
  "SELECT * FROM posts WHERE user_id = 1",
  "SELECT COUNT(*) as count FROM comments WHERE user_id = 1",
]);

console.log("Users:", results[0].rows);
console.log("Posts:", results[1].rows);
console.log("Comment count:", results[2].rows[0].count);
```

## エラーハンドリング

### 基本的なエラーハンドリング

```typescript
try {
  const result = await client.execute("SELECT * FROM users");
  console.log(result.rows);
} catch (error) {
  console.error("Database error:", error);

  if (error.code === "SQLITE_ERROR") {
    console.error("SQL syntax error");
  } else if (error.code === "SQLITE_CONSTRAINT") {
    console.error("Constraint violation");
  }
}
```

### リトライロジック

```typescript
async function executeWithRetry(
  client: any,
  sql: string,
  args?: any[],
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.execute({ sql, args });
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      console.log(`Retry ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## ベストプラクティス

### 1. 環境変数の使用

```typescript
// 認証情報をハードコーディングしない
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

```bash
# .env
TURSO_DATABASE_URL=libsql://my-db-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### 2. パラメータ化クエリ

```typescript
// 悪い例 - SQLインジェクションのリスク
const userId = req.params.id;
const result = await client.execute(`SELECT * FROM users WHERE id = ${userId}`);

// 良い例 - パラメータ化
const userId = req.params.id;
const result = await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [userId],
});
```

### 3. 接続の再利用

```typescript
// シングルトンパターン
let clientInstance: any = null;

export function getClient() {
  if (!clientInstance) {
    clientInstance = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return clientInstance;
}

// 使用
const client = getClient();
const result = await client.execute("SELECT * FROM users");
```

### 4. エラーハンドリング

```typescript
async function safeQuery(sql: string, args?: any[]) {
  try {
    return await client.execute({ sql, args });
  } catch (error) {
    console.error("Query failed:", { sql, args, error });
    throw new Error("Database operation failed");
  }
}
```

## SDK別の詳細ドキュメント

各SDKの詳細な使用方法については、以下のドキュメントを参照してください：

### TypeScript/JavaScript
- [クイックスタート](/docs/services/turso/docs/sdk/ts/quickstart)
- [APIリファレンス](/docs/services/turso/docs/sdk/ts/reference)

### HTTP API
- [クイックスタート](/docs/services/turso/docs/sdk/http/quickstart)
- [APIリファレンス](/docs/services/turso/docs/sdk/http/reference)

### その他の言語
- Python SDK
- Rust SDK
- Go SDK
- Dart SDK

## パフォーマンスのヒント

### 1. バッチ処理

```typescript
// 悪い例 - 個別にクエリ
for (const user of users) {
  await client.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: [user.name, user.email],
  });
}

// 良い例 - トランザクション内でバッチ処理
await client.execute("BEGIN TRANSACTION");
try {
  for (const user of users) {
    await client.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?)",
      args: [user.name, user.email],
    });
  }
  await client.execute("COMMIT");
} catch (error) {
  await client.execute("ROLLBACK");
  throw error;
}
```

### 2. インデックスの使用

```typescript
// インデックスを作成
await client.execute(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
`);

// インデックスを利用したクエリ
const result = await client.execute({
  sql: "SELECT * FROM users WHERE email = ?",
  args: ["user@example.com"],
});
```

### 3. クエリの最適化

```typescript
// LIMIT を使用
const result = await client.execute(
  "SELECT * FROM users ORDER BY created_at DESC LIMIT 10"
);

// 必要なカラムのみ選択
const result = await client.execute(
  "SELECT id, name FROM users"
);
```

## 次のステップ

- [認証](/docs/services/turso/docs/sdk/authentication) - 認証トークンの管理
- [Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction) - ローカルレプリカの使用
- [HTTP SDK](/docs/services/turso/docs/sdk/http/quickstart) - HTTP API の使用
- [TypeScript SDK](/docs/services/turso/docs/sdk/ts/quickstart) - TypeScript SDKの詳細

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [libSQL GitHub](https://github.com/tursodatabase/libsql)
- [SDK Examples](https://github.com/tursodatabase/examples)
- [Turso Discord Community](https://discord.gg/turso)
