# Sentry + Turso 統合ガイド

Sentry を使用して Turso データベースのクエリをトレースし、エラーをキャプチャする方法を説明します。

## 📚 目次

- [概要](#概要)
- [セットアップ手順](#セットアップ手順)
- [設定オプション](#設定オプション)
- [使用例](#使用例)
- [トラブルシューティング](#トラブルシューティング)

## 概要

`sentry-integration-libsql-client` パッケージを使用することで、以下の機能を利用できます：

- 遅いクエリのトレース
- SQL エラーのキャプチャ
- クエリのブレッドクラム記録

## セットアップ手順

### 1. パッケージのインストール

```bash
npm install @sentry/node @libsql/client sentry-integration-libsql-client
```

### 2. 基本的な統合

```typescript
import * as Sentry from "@sentry/node";
import { createClient } from "@libsql/client";
import { libsqlIntegration } from "sentry-integration-libsql-client";

// libSQL クライアントを作成
const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Sentry を初期化
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [libsqlIntegration(libsqlClient, Sentry)],
  tracesSampleRate: 1.0, // 本番環境では調整してください
});
```

## 設定オプション

### デフォルト設定

```typescript
interface IntegrationOptions {
  tracing: boolean;      // デフォルト: true
  breadcrumbs: boolean;  // デフォルト: true
  errors: boolean;       // デフォルト: true
}
```

### カスタム設定

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    libsqlIntegration(libsqlClient, Sentry, {
      tracing: true,       // SQL クエリのトレースを有効化
      breadcrumbs: true,   // SQL クエリのブレッドクラムを有効化
      errors: true,        // SQL クエリのエラーハンドリングを有効化
    }),
  ],
});
```

### トレーシングのみを有効化

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    libsqlIntegration(libsqlClient, Sentry, {
      tracing: true,
      breadcrumbs: false,
      errors: false,
    }),
  ],
});
```

## 使用例

### Express アプリケーションでの使用

```typescript
import express from "express";
import * as Sentry from "@sentry/node";
import { createClient } from "@libsql/client";
import { libsqlIntegration } from "sentry-integration-libsql-client";

const app = express();

const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    libsqlIntegration(libsqlClient, Sentry),
  ],
  tracesSampleRate: 1.0,
});

// Sentry のリクエストハンドラー（最初に配置）
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ルート定義
app.get("/users", async (req, res) => {
  try {
    const { rows } = await libsqlClient.execute("SELECT * FROM users");
    res.json({ users: rows });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Sentry のエラーハンドラー（最後に配置）
app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Next.js での使用

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@libsql/client";
import { libsqlIntegration } from "sentry-integration-libsql-client";

const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [libsqlIntegration(libsqlClient, Sentry)],
  tracesSampleRate: 1.0,
  debug: false,
});
```

### 手動トランザクションのトレース

```typescript
import * as Sentry from "@sentry/node";
import { createClient } from "@libsql/client";

const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function transferFunds(fromId: number, toId: number, amount: number) {
  const transaction = Sentry.startTransaction({
    op: "db.transaction",
    name: "Transfer Funds",
  });

  try {
    const tx = await libsqlClient.transaction("write");

    try {
      await tx.execute({
        sql: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        args: [amount, fromId],
      });

      await tx.execute({
        sql: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        args: [amount, toId],
      });

      await tx.commit();
      transaction.setStatus("ok");
    } catch (error) {
      await tx.rollback();
      transaction.setStatus("internal_error");
      throw error;
    }
  } finally {
    transaction.finish();
  }
}
```

## トラブルシューティング

### 遅いクエリの検出

Sentry ダッシュボードで以下を確認：

1. **Performance** タブを開く
2. **Queries** セクションでデータベースクエリを確認
3. 実行時間が長いクエリを特定

### エラーの確認

```typescript
// カスタムコンテキストを追加
Sentry.setContext("database", {
  url: process.env.TURSO_DATABASE_URL,
  operation: "SELECT",
});

try {
  await libsqlClient.execute("SELECT * FROM users");
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      database: "turso",
      operation: "query",
    },
  });
}
```

### ブレッドクラムの活用

ブレッドクラムは自動的に記録されます：

```typescript
// これらのクエリは自動的にブレッドクラムとして記録されます
await libsqlClient.execute("SELECT * FROM users");
await libsqlClient.execute("INSERT INTO logs (message) VALUES (?)", ["Log entry"]);
```

Sentry でエラーが発生した際、直前のクエリ履歴が表示されます。

## ベストプラクティス

### 1. 本番環境でのサンプリングレート調整

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [libsqlIntegration(libsqlClient, Sentry)],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});
```

### 2. 機密情報の除外

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [libsqlIntegration(libsqlClient, Sentry)],
  beforeSend(event) {
    // SQL クエリから機密情報を削除
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.category === "query") {
          // パスワードなどの機密情報をマスク
          breadcrumb.message = breadcrumb.message?.replace(
            /password\s*=\s*'[^']*'/gi,
            "password='***'"
          );
        }
        return breadcrumb;
      });
    }
    return event;
  },
});
```

### 3. 環境ごとの設定

```typescript
const sentryConfig = {
  development: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: true,
  },
  production: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,
  },
};

const config = sentryConfig[process.env.NODE_ENV as keyof typeof sentryConfig];

Sentry.init({
  ...config,
  integrations: [libsqlIntegration(libsqlClient, Sentry)],
});
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Sentry 公式ドキュメント](https://docs.sentry.io)
- [Turso 公式ドキュメント](https://docs.turso.tech)
