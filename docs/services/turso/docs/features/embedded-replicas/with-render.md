# Turso - RenderでEmbedded Replicasを使用

Render.comでTurso Embedded Replicasを使用してアプリケーションのパフォーマンスを向上させる方法を説明します。

## 概要

Renderは、Webサービス、静的サイト、バックグラウンドワーカーなどをホスティングするプラットフォームです。Turso Embedded Replicasを使用することで、Renderインスタンス上でローカルデータベースレプリカを動作させ、読み取りパフォーマンスを大幅に向上させることができます。

## セットアップ

### 1. Tursoデータベースの作成

```bash
# Tursoデータベースを作成
turso db create my-render-app

# データベースURLを取得
turso db show my-render-app --url

# 認証トークンを作成
turso db tokens create my-render-app
```

### 2. Renderサービスの作成

1. [Render Dashboard](https://dashboard.render.com/)にログイン
2. 「New +」をクリック
3. 「Web Service」を選択
4. GitHubリポジトリを接続

### 3. 環境変数の設定

Render Dashboardで環境変数を設定：

```
TURSO_DATABASE_URL=libsql://my-render-app-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## 実装例

### Node.js/Express アプリケーション

```typescript
// server.ts
import express from "express";
import { createClient } from "@libsql/client";
import path from "path";

const app = express();
app.use(express.json());

// Renderのディスク使用
const dbPath = process.env.RENDER
  ? "/opt/render/project/src/data/local.db"
  : "local.db";

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// データベース初期化
async function initDatabase() {
  try {
    console.log("Initializing database...");
    await client.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

// 定期同期
function startSync() {
  setInterval(async () => {
    try {
      await client.sync();
      console.log("Sync completed at", new Date().toISOString());
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }, 60000); // 1分ごと
}

// APIルート
app.get("/api/users", async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    await client.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?)",
      args: [name, email],
    });

    // 書き込み後に同期
    await client.sync();

    res.json({ success: true });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDatabase();
  startSync();
});
```

### Next.js アプリケーション

```typescript
// lib/turso.ts
import { createClient } from "@libsql/client";
import path from "path";
import { mkdir } from "fs/promises";

const dataDir = process.env.RENDER
  ? "/opt/render/project/src/data"
  : path.join(process.cwd(), ".data");

const dbPath = path.join(dataDir, "local.db");

// データディレクトリを作成
async function ensureDataDir() {
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // ディレクトリが既に存在する場合は無視
  }
}

export async function getClient() {
  await ensureDataDir();

  return createClient({
    url: `file:${dbPath}`,
    syncUrl: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

let syncInterval: NodeJS.Timeout | null = null;

export async function initializeSync() {
  const client = await getClient();

  // 初回同期
  await client.sync();

  // 定期同期（まだ開始していない場合）
  if (!syncInterval) {
    syncInterval = setInterval(async () => {
      try {
        await client.sync();
        console.log("Background sync completed");
      } catch (error) {
        console.error("Background sync failed:", error);
      }
    }, 60000);
  }
}
```

```typescript
// app/api/products/route.ts
import { getClient, initializeSync } from "@/lib/turso";

export async function GET() {
  try {
    await initializeSync();
    const client = await getClient();

    const result = await client.execute("SELECT * FROM products");
    return Response.json(result.rows);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initializeSync();
    const client = await getClient();

    const body = await request.json();

    await client.execute({
      sql: "INSERT INTO products (name, price) VALUES (?, ?)",
      args: [body.name, body.price],
    });

    await client.sync();

    return Response.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
```

## Render設定

### render.yaml

```yaml
services:
  - type: web
    name: my-turso-app
    env: node
    region: oregon  # または singapore, frankfurt など
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: TURSO_DATABASE_URL
        sync: false
      - key: TURSO_AUTH_TOKEN
        sync: false
    healthCheckPath: /health
```

### ディスクストレージ

Renderでは、`/opt/render/project/src`配下のファイルは永続化されます：

```typescript
// ディレクトリ構造
// /opt/render/project/src/
//   ├── app/
//   ├── data/           <- ここにローカルDBを保存
//   │   └── local.db
//   └── node_modules/
```

## パッケージ設定

### package.json

```json
{
  "name": "turso-render-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@libsql/client": "^0.4.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 環境変数の管理

### ローカル開発

```bash
# .env.local
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
```

### Render環境

Render Dashboardで設定：

1. サービスを選択
2. 「Environment」タブをクリック
3. 環境変数を追加：
   - `TURSO_DATABASE_URL`: プロダクションのTurso URL
   - `TURSO_AUTH_TOKEN`: Turso認証トークン

## パフォーマンス最適化

### 1. コネクションの再利用

```typescript
// グローバルクライアントインスタンス
let globalClient: any = null;

export async function getClient() {
  if (!globalClient) {
    await ensureDataDir();
    globalClient = createClient({
      url: `file:${dbPath}`,
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return globalClient;
}
```

### 2. 同期の最適化

```typescript
// 最終同期時刻を追跡
let lastSyncTime = 0;
const SYNC_COOLDOWN = 5000; // 5秒

export async function smartSync(client: any) {
  const now = Date.now();
  if (now - lastSyncTime > SYNC_COOLDOWN) {
    await client.sync();
    lastSyncTime = now;
  }
}
```

### 3. エラーリトライ

```typescript
async function syncWithRetry(client: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.sync();
      return;
    } catch (error) {
      console.error(`Sync attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;

      // エクスポネンシャルバックオフ
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

## モニタリング

### ヘルスチェック

```typescript
// app/api/health/route.ts
import { getClient } from "@/lib/turso";

export async function GET() {
  try {
    const client = await getClient();

    // データベース接続確認
    await client.execute("SELECT 1");

    return Response.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
```

### ログ監視

Renderのログを確認：

```bash
# Render CLIをインストール
npm install -g render

# ログをストリーミング
render logs --service my-turso-app --tail
```

## デプロイ

### 手動デプロイ

1. コードをGitHubにプッシュ
2. Renderが自動的にビルド・デプロイ

### CLIデプロイ

```bash
# Render CLIでデプロイ
render deploy --service my-turso-app
```

## トラブルシューティング

### ファイルパーミッションエラー

```typescript
import { access, mkdir } from "fs/promises";
import { constants } from "fs";

async function ensureWritableDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
    await access(dir, constants.W_OK);
  } catch (error) {
    console.error("Directory not writable:", error);
    throw new Error(`Cannot write to ${dir}`);
  }
}
```

### 同期タイムアウト

```typescript
// タイムアウト付き同期
async function syncWithTimeout(client: any, timeoutMs = 10000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Sync timeout")), timeoutMs)
  );

  return Promise.race([
    client.sync(),
    timeoutPromise,
  ]);
}
```

### メモリ使用量

```typescript
// メモリ使用量の監視
function logMemoryUsage() {
  const usage = process.memoryUsage();
  console.log({
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
  });
}

// 定期的に監視
setInterval(logMemoryUsage, 60000);
```

## ベストプラクティス

1. **環境変数の使用**: 認証情報をコードにハードコーディングしない
2. **エラーハンドリング**: すべてのデータベース操作でエラーをキャッチ
3. **ヘルスチェック**: アプリケーションの健全性を監視
4. **ログ記録**: 同期とエラーを適切にログに記録
5. **リソース管理**: メモリとディスク使用量を監視

## リージョン選択

Renderは複数のリージョンをサポート：

- **Oregon (US West)**
- **Ohio (US East)**
- **Frankfurt (Europe)**
- **Singapore (Asia)**

ユーザーに最も近いリージョンを選択してレイテンシを最小化します。

## スケーリング

```yaml
# render.yaml
services:
  - type: web
    name: my-turso-app
    env: node
    region: oregon
    plan: standard  # スケーリング可能
    scaling:
      minInstances: 1
      maxInstances: 10
      targetMemoryPercent: 80
      targetCPUPercent: 80
```

## 関連リンク

- [Render公式サイト](https://render.com/)
- [Render Documentation](https://render.com/docs)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [libSQL Client](https://docs.turso.tech/sdk/ts/reference)
