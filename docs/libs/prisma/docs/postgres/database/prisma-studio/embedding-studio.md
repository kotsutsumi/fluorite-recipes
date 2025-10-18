# 独自のアプリケーションにPrisma Studioを組み込む

## ユースケース

Prisma Studioは、以下のようなアプリケーションに組み込むことができます:
- 迅速な管理ダッシュボードの作成
- マルチテナントアプリケーション
- 簡単なデータ表示/編集インターフェースの提供

## 前提条件

- フロントエンド: Reactアプリケーション
- バックエンド:
  - サーバーサイドエンドポイント（例: Express、Hono）
  - Prisma Postgresインスタンス

## インストール

```bash
npm install @prisma/studio-core
```

## フロントエンドのセットアップ

### 最小限の実装

```javascript
import { Studio } from "@prisma/studio-core/ui";
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core";
import { createStudioBFFClient } from "@prisma/studio-core/data/bff";
import "@prisma/studio-core/ui/index.css"

function App() {
  const adapter = useMemo(() => {
    const executor = createStudioBFFClient({
      url: "http://localhost:4242/studio",
    });
    const adapter = createPostgresAdapter({ executor });
    return adapter;
  }, []);

  return (
    <Layout>
      <Studio adapter={adapter} />
    </Layout>
  )
}
```

### カスタムヘッダー/ペイロードの実装

```javascript
function App() {
  const adapter = useMemo(() => {
    const executor = createStudioBFFClient({
      url: "http://localhost:4242/studio",
      customHeaders: {
        "X-Custom-Header": "example-value",
      },
      customPayload: {
        customValue: "example-value"
      }
    });
    const adapter = createPostgresAdapter({ executor });
    return adapter;
  }, []);

  return (
    <Layout>
      <Studio adapter={adapter} />
    </Layout>
  )
}
```

## バックエンドのセットアップ

### 最小限の実装（Hono）

```javascript
import { Hono } from "hono";
import { createPrismaPostgresHttpClient } from "@prisma/studio-core/server";

const app = new Hono();

app.post("/studio", async (c) => {
  const client = createPrismaPostgresHttpClient({
    connectionString: process.env.DATABASE_URL!,
  });

  const body = await c.req.json();
  const result = await client.execute(body);

  return c.json(result);
});
```

このドキュメントは、Prisma Studioを独自のアプリケーションに組み込むための包括的なガイドを提供し、フロントエンドとバックエンドの両方のセットアップ例を示しています。
