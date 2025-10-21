# Turso SDK - 認証

Tursoデータベースへの認証とトークン管理について説明します。

## 概要

Tursoデータベースへのアクセスには認証トークンが必要です。トークンは、データベースへのアクセスを制御し、セキュリティを確保するために使用されます。

## 認証トークンの種類

```typescript
interface AuthenticationTokens {
  databaseToken: {
    scope: "特定のデータベースへのアクセス";
    creation: "turso db tokens create コマンド";
    expiration: "無期限（明示的に失効させるまで）";
    permissions: "読み取り・書き込み両方";
  };

  personalToken: {
    scope: "アカウント全体の管理";
    creation: "Dashboard または CLI";
    expiration: "設定可能";
    permissions: "管理操作（DB作成・削除など）";
    usage: "主にCLI操作用";
  };
}
```

## データベーストークンの作成

### CLIでの作成

```bash
# データベースのトークンを作成
turso db tokens create my-database

# 出力例:
# eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 有効期限付きトークン

```bash
# 7日間有効なトークンを作成
turso db tokens create my-database --expiration 7d

# 24時間有効なトークン
turso db tokens create my-database --expiration 24h

# カスタム有効期限（ISO 8601形式）
turso db tokens create my-database --expiration 2024-12-31T23:59:59Z
```

### 読み取り専用トークン

```bash
# 読み取り専用トークンの作成
turso db tokens create my-database --read-only
```

## トークンの使用

### TypeScript/JavaScript

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// トークンが自動的にすべてのリクエストに含まれる
const result = await client.execute("SELECT * FROM users");
```

### Python

```python
import libsql_experimental as libsql
import os

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

conn = libsql.connect(database=url, auth_token=auth_token)
cursor = conn.execute("SELECT * FROM users")
```

### Rust

```rust
use libsql::Builder;

let url = std::env::var("TURSO_DATABASE_URL")?;
let token = std::env::var("TURSO_AUTH_TOKEN")?;

let db = Builder::new_remote(url, token).build().await?;
```

### Go

```go
import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/tursodatabase/libsql-client-go/libsql"
)

url := os.Getenv("TURSO_DATABASE_URL")
token := os.Getenv("TURSO_AUTH_TOKEN")

dbUrl := fmt.Sprintf("%s?authToken=%s", url, token)
db, err := sql.Open("libsql", dbUrl)
```

## 環境変数の管理

### 開発環境

```.env
# .env.local（ローカル開発）
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=  # ローカルでは不要

# .env.development
TURSO_DATABASE_URL=libsql://dev-db-[org].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 本番環境

```bash
# 本番環境の環境変数設定例（Vercel）
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN

# Railway
railway variables set TURSO_DATABASE_URL=libsql://...
railway variables set TURSO_AUTH_TOKEN=eyJ...

# Render
# Dashboard の Environment Variables で設定
```

## セキュリティベストプラクティス

### 1. トークンの保護

```typescript
// ❌ 悪い例 - トークンをハードコーディング
const client = createClient({
  url: "libsql://my-db.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...", // 危険！
});

// ✅ 良い例 - 環境変数を使用
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

### 2. トークンの公開回避

```typescript
// ❌ 悪い例 - クライアントサイドでトークンを公開
// pages/index.tsx
const client = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL!,
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN!, // 危険！
});

// ✅ 良い例 - サーバーサイドでのみ使用
// pages/api/users.ts
export default async function handler(req, res) {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!, // 安全
  });

  const result = await client.execute("SELECT * FROM users");
  res.json(result.rows);
}
```

### 3. .gitignoreの設定

```.gitignore
# 環境変数ファイルをバージョン管理から除外
.env
.env.local
.env.*.local
.env.development
.env.production

# サンプルファイルは含める
!.env.example
```

```.env.example
# .env.example - サンプル設定ファイル
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

## トークンのローテーション

### 定期的なローテーション

```bash
#!/bin/bash
# rotate-token.sh

DB_NAME="production-db"

echo "Creating new token..."
NEW_TOKEN=$(turso db tokens create $DB_NAME)

echo "New token created: $NEW_TOKEN"
echo ""
echo "Please update the following:"
echo "1. Update TURSO_AUTH_TOKEN in your deployment platform"
echo "2. Deploy the updated environment variables"
echo "3. Verify the application is working"
echo ""
echo "After verification, you can invalidate the old token if needed."
```

### トークンの失効

```bash
# トークンを失効させる（将来の機能）
# 現在は、データベースを再作成することでトークンを無効化可能
```

## 複数環境の管理

### 環境別トークン

```typescript
// config/database.ts
interface DatabaseConfig {
  url: string;
  authToken: string;
}

function getDatabaseConfig(): DatabaseConfig {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return {
        url: process.env.TURSO_DATABASE_URL_PROD!,
        authToken: process.env.TURSO_AUTH_TOKEN_PROD!,
      };

    case "staging":
      return {
        url: process.env.TURSO_DATABASE_URL_STAGING!,
        authToken: process.env.TURSO_AUTH_TOKEN_STAGING!,
      };

    default:
      return {
        url: process.env.TURSO_DATABASE_URL_DEV!,
        authToken: process.env.TURSO_AUTH_TOKEN_DEV!,
      };
  }
}

export const dbConfig = getDatabaseConfig();

export const client = createClient({
  url: dbConfig.url,
  authToken: dbConfig.authToken,
});
```

## トークンのバリデーション

### トークンの検証

```typescript
import jwt from "jsonwebtoken";

function validateToken(token: string): boolean {
  try {
    // JWTトークンのデコード（検証なし）
    const decoded = jwt.decode(token);

    if (!decoded) {
      return false;
    }

    // 有効期限のチェック
    if (typeof decoded === "object" && decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.error("Token has expired");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

// 使用例
const token = process.env.TURSO_AUTH_TOKEN!;
if (!validateToken(token)) {
  throw new Error("Invalid or expired authentication token");
}
```

### 接続テスト

```typescript
async function testConnection() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // 簡単なクエリでテスト
    await client.execute("SELECT 1");

    console.log("✅ Connection successful");
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return false;
  }
}

// アプリケーション起動時にテスト
testConnection().then(success => {
  if (!success) {
    console.error("Failed to connect to database. Check your credentials.");
    process.exit(1);
  }
});
```

## ローカル開発での認証

### トークン不要のローカルDB

```typescript
// ローカル開発ではトークン不要
const client = createClient({
  url: "file:local.db",
  // authToken は不要
});
```

### 環境に応じた条件付き認証

```typescript
const isLocal = process.env.NODE_ENV === "development" &&
  process.env.TURSO_DATABASE_URL?.startsWith("file:");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  ...(isLocal ? {} : { authToken: process.env.TURSO_AUTH_TOKEN! }),
});
```

## トークン管理のヘルパー

### トークンマネージャークラス

```typescript
class TokenManager {
  private static instance: TokenManager;
  private token: string;

  private constructor() {
    this.token = process.env.TURSO_AUTH_TOKEN || "";
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getToken(): string {
    if (!this.token) {
      throw new Error("Authentication token not configured");
    }
    return this.token;
  }

  isConfigured(): boolean {
    return !!this.token;
  }

  updateToken(newToken: string) {
    this.token = newToken;
  }
}

// 使用例
const tokenManager = TokenManager.getInstance();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: tokenManager.getToken(),
});
```

## エラーハンドリング

### 認証エラーの処理

```typescript
async function handleAuthError() {
  try {
    const result = await client.execute("SELECT * FROM users");
    return result.rows;
  } catch (error: any) {
    if (error.message?.includes("authentication") ||
        error.message?.includes("unauthorized")) {
      console.error("Authentication failed. Check your token.");
      console.error("Token:", process.env.TURSO_AUTH_TOKEN?.substring(0, 20) + "...");
      throw new Error("Invalid authentication token");
    }

    throw error;
  }
}
```

### 自動リトライ（トークンリフレッシュ）

```typescript
class AuthenticatedClient {
  private client: any;
  private tokenRefreshFn?: () => Promise<string>;

  constructor(url: string, authToken: string, tokenRefreshFn?: () => Promise<string>) {
    this.client = createClient({ url, authToken });
    this.tokenRefreshFn = tokenRefreshFn;
  }

  async execute(sql: string, args?: any[]) {
    try {
      return await this.client.execute({ sql, args });
    } catch (error: any) {
      if (error.message?.includes("authentication") && this.tokenRefreshFn) {
        // トークンをリフレッシュして再試行
        const newToken = await this.tokenRefreshFn();
        this.client = createClient({
          url: this.client.url,
          authToken: newToken,
        });

        return await this.client.execute({ sql, args });
      }

      throw error;
    }
  }
}
```

## セキュリティチェックリスト

```typescript
interface SecurityChecklist {
  storage: {
    "✅": "環境変数に保存";
    "❌": "コードにハードコーディング";
    "❌": "バージョン管理にコミット";
    "❌": "クライアントサイドに公開";
  };

  transmission: {
    "✅": "HTTPS/TLS経由のみ";
    "✅": "環境変数から読み込み";
    "❌": "URLパラメータに含めない";
    "❌": "ログに出力しない";
  };

  management: {
    "✅": "定期的なローテーション";
    "✅": "環境ごとに異なるトークン";
    "✅": "最小権限の原則";
    "❌": "本番トークンを開発で使用";
  };
}
```

## トラブルシューティング

### よくあるエラー

```typescript
// エラー: "Authentication required"
// 原因: トークンが設定されていない
// 解決: 環境変数を確認

// エラー: "Invalid authentication token"
// 原因: トークンが間違っている、または期限切れ
// 解決: 新しいトークンを生成

// エラー: "Database not found"
// 原因: データベースURLが間違っている
// 解決: データベース名を確認
```

### デバッグ

```typescript
// 認証情報のデバッグ（本番環境では無効化）
if (process.env.NODE_ENV === "development") {
  console.log("Database URL:", process.env.TURSO_DATABASE_URL);
  console.log("Token present:", !!process.env.TURSO_AUTH_TOKEN);
  console.log("Token length:", process.env.TURSO_AUTH_TOKEN?.length);
  console.log("Token prefix:", process.env.TURSO_AUTH_TOKEN?.substring(0, 20) + "...");
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [SDK Introduction](/docs/services/turso/docs/sdk/introduction)
- [TypeScript SDK](/docs/services/turso/docs/sdk/ts/quickstart)
- [セキュリティベストプラクティス](https://docs.turso.tech/security)
