# Turso - RailwayでEmbedded Replicasを使用

Railway上でTurso Embedded Replicasを使用してアプリケーションのパフォーマンスを向上させる方法を説明します。

## 概要

Railwayは、開発者向けのクラウドプラットフォームで、アプリケーションを簡単にデプロイできます。Turso Embedded Replicasを使用することで、Railwayインスタンス上でローカルデータベースレプリカを動作させ、読み取りパフォーマンスを大幅に向上させることができます。

## セットアップ

### 1. Tursoデータベースの作成

```bash
# Tursoデータベースを作成
turso db create my-railway-app

# データベースURLを取得
turso db show my-railway-app --url

# 認証トークンを作成
turso db tokens create my-railway-app
```

### 2. Railwayプロジェクトの作成

1. [Railway Dashboard](https://railway.app/)にログイン
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択
4. リポジトリを接続

### 3. 環境変数の設定

Railway Dashboardで環境変数を設定：

```
TURSO_DATABASE_URL=libsql://my-railway-app-[org].turso.io
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

// Railwayのボリュームまたは一時ストレージ
const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "local.db")
  : "/tmp/local.db";

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 初期化とバックグラウンド同期
async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    console.log(`Database path: ${dbPath}`);

    // 初回同期
    await client.sync();
    console.log("Initial sync completed");

    // バックグラウンド同期を開始
    startBackgroundSync();
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

function startBackgroundSync() {
  setInterval(async () => {
    try {
      const startTime = Date.now();
      await client.sync();
      const duration = Date.now() - startTime;
      console.log(`Sync completed in ${duration}ms`);
    } catch (error) {
      console.error("Background sync failed:", error);
    }
  }, 60000); // 1分ごと
}

// API Routes
app.get("/api/items", async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM items ORDER BY created_at DESC");
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch items",
    });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await client.execute({
      sql: "INSERT INTO items (title, description) VALUES (?, ?) RETURNING *",
      args: [title, description],
    });

    // 書き込み後に同期
    await client.sync();

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create item",
    });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await client.execute({
      sql: "DELETE FROM items WHERE id = ?",
      args: [id],
    });

    await client.sync();

    res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete item",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    dbPath,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
```

### Next.js アプリケーション

```typescript
// lib/turso.ts
import { createClient } from "@libsql/client";
import path from "path";

const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "local.db")
  : process.env.NODE_ENV === "production"
  ? "/tmp/local.db"
  : path.join(process.cwd(), ".data", "local.db");

let clientInstance: ReturnType<typeof createClient> | null = null;
let syncInterval: NodeJS.Timeout | null = null;

export function getTursoClient() {
  if (!clientInstance) {
    console.log(`Initializing Turso client with db path: ${dbPath}`);

    clientInstance = createClient({
      url: `file:${dbPath}`,
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }

  return clientInstance;
}

export async function initializeSync() {
  const client = getTursoClient();

  // 初回同期
  try {
    await client.sync();
    console.log("Initial sync completed");
  } catch (error) {
    console.error("Initial sync failed:", error);
    throw error;
  }

  // 定期同期（一度だけ開始）
  if (!syncInterval) {
    syncInterval = setInterval(async () => {
      try {
        await client.sync();
        console.log("Periodic sync completed");
      } catch (error) {
        console.error("Periodic sync failed:", error);
      }
    }, 60000); // 1分ごと

    // プロセス終了時にクリーンアップ
    process.on("SIGINT", () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    });
  }
}

// スマート同期（最終同期から一定時間経過した場合のみ同期）
let lastSyncTime = 0;
const SYNC_COOLDOWN = 30000; // 30秒

export async function smartSync() {
  const now = Date.now();
  if (now - lastSyncTime > SYNC_COOLDOWN) {
    const client = getTursoClient();
    await client.sync();
    lastSyncTime = now;
  }
}
```

```typescript
// app/api/items/route.ts
import { getTursoClient, initializeSync } from "@/lib/turso";

// 初期化フラグ
let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeSync();
    initialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    const client = getTursoClient();

    const result = await client.execute(
      "SELECT * FROM items ORDER BY created_at DESC LIMIT 100"
    );

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("GET /api/items error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureInitialized();
    const client = getTursoClient();
    const body = await request.json();

    const result = await client.execute({
      sql: "INSERT INTO items (title, description) VALUES (?, ?) RETURNING *",
      args: [body.title, body.description],
    });

    // 書き込み後に同期
    await client.sync();

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return Response.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
```

## Railway設定

### nixpacks.toml

Railwayは自動的にNixpacksを使用してビルドします。カスタマイズが必要な場合：

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### Railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Railwayボリュームの使用

### ボリュームの作成

1. Railway Dashboardでサービスを選択
2. 「Variables」タブに移動
3. 「Add Volume」をクリック
4. マウントパス（例: `/data`）を指定

### ボリュームの使用

```typescript
// 環境変数でボリュームパスが提供される
const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH; // 例: "/data"
const dbPath = volumePath
  ? path.join(volumePath, "local.db")
  : "/tmp/local.db";
```

## パフォーマンス最適化

### 1. 接続プーリング

```typescript
class DatabasePool {
  private static client: any = null;
  private static isInitialized = false;

  static async getClient() {
    if (!this.client) {
      this.client = getTursoClient();
    }

    if (!this.isInitialized) {
      await this.client.sync();
      this.isInitialized = true;
      this.startPeriodicSync();
    }

    return this.client;
  }

  private static startPeriodicSync() {
    setInterval(async () => {
      try {
        if (this.client) {
          await this.client.sync();
        }
      } catch (error) {
        console.error("Periodic sync error:", error);
      }
    }, 60000);
  }
}

// 使用例
const client = await DatabasePool.getClient();
```

### 2. クエリキャッシング

```typescript
import NodeCache from "node-cache";

const queryCache = new NodeCache({
  stdTTL: 300, // 5分
  checkperiod: 60, // 60秒ごとにチェック
});

export async function getCachedQuery(
  key: string,
  query: string,
  args?: any[]
) {
  // キャッシュチェック
  const cached = queryCache.get(key);
  if (cached) {
    return cached;
  }

  // クエリ実行
  const client = getTursoClient();
  const result = await client.execute({ sql: query, args });

  // キャッシュに保存
  queryCache.set(key, result.rows);

  return result.rows;
}

// 使用例
app.get("/api/popular-items", async (req, res) => {
  const items = await getCachedQuery(
    "popular-items",
    "SELECT * FROM items WHERE popular = 1 ORDER BY views DESC LIMIT 10"
  );

  res.json(items);
});
```

### 3. バッチ処理

```typescript
// 複数の挿入を一度に実行
export async function batchInsert(items: any[]) {
  const client = getTursoClient();

  // トランザクション開始
  await client.execute("BEGIN TRANSACTION");

  try {
    for (const item of items) {
      await client.execute({
        sql: "INSERT INTO items (title, description) VALUES (?, ?)",
        args: [item.title, item.description],
      });
    }

    await client.execute("COMMIT");

    // バッチ処理後に1回だけ同期
    await client.sync();
  } catch (error) {
    await client.execute("ROLLBACK");
    throw error;
  }
}
```

## モニタリング

### ヘルスチェックエンドポイント

```typescript
// app/api/health/route.ts
import { getTursoClient } from "@/lib/turso";

export async function GET() {
  const health = {
    status: "unknown",
    timestamp: new Date().toISOString(),
    checks: {
      database: "unknown",
      sync: "unknown",
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
    },
  };

  try {
    const client = getTursoClient();

    // データベース接続確認
    await client.execute("SELECT 1");
    health.checks.database = "connected";

    // 同期確認
    try {
      await client.sync();
      health.checks.sync = "operational";
      health.status = "healthy";
    } catch (syncError) {
      health.checks.sync = "degraded";
      health.status = "degraded";
    }

    const statusCode = health.status === "healthy" ? 200 : 503;
    return Response.json(health, { status: statusCode });
  } catch (error) {
    health.status = "unhealthy";
    health.checks.database = "failed";
    return Response.json(health, { status: 503 });
  }
}
```

### メトリクス収集

```typescript
// メトリクス追跡
class Metrics {
  private static data = {
    queries: 0,
    syncCount: 0,
    syncErrors: 0,
    avgSyncDuration: 0,
    lastSync: null as Date | null,
  };

  static recordQuery() {
    this.data.queries++;
  }

  static async recordSync(syncFn: () => Promise<void>) {
    const start = Date.now();

    try {
      await syncFn();
      const duration = Date.now() - start;

      this.data.syncCount++;
      this.data.avgSyncDuration =
        (this.data.avgSyncDuration * (this.data.syncCount - 1) + duration) /
        this.data.syncCount;
      this.data.lastSync = new Date();
    } catch (error) {
      this.data.syncErrors++;
      throw error;
    }
  }

  static getMetrics() {
    return { ...this.data };
  }

  static reset() {
    this.data = {
      queries: 0,
      syncCount: 0,
      syncErrors: 0,
      avgSyncDuration: 0,
      lastSync: null,
    };
  }
}

// メトリクスエンドポイント
app.get("/metrics", (req, res) => {
  res.json(Metrics.getMetrics());
});
```

## デプロイ

### GitHubからの自動デプロイ

1. Railway Dashboardでプロジェクトを開く
2. 「Settings」→「Deployments」
3. GitHubブランチを選択
4. 自動デプロイが有効化される

### Railway CLIでのデプロイ

```bash
# Railway CLIをインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクトを初期化
railway init

# デプロイ
railway up

# ログを確認
railway logs
```

## 環境変数の管理

### ローカル開発

```bash
# .env.local
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
NODE_ENV=development
```

### Railway環境

Railway Dashboardまたは CLIで設定：

```bash
# CLIで環境変数を設定
railway variables set TURSO_DATABASE_URL=libsql://my-app.turso.io
railway variables set TURSO_AUTH_TOKEN=your-auth-token
```

## トラブルシューティング

### ファイルシステムエラー

```typescript
import { access, mkdir } from "fs/promises";
import { constants } from "fs";

async function ensureDbDirectory(dbPath: string) {
  const dir = path.dirname(dbPath);

  try {
    await access(dir, constants.W_OK);
  } catch (error) {
    // ディレクトリが存在しない、または書き込み不可
    await mkdir(dir, { recursive: true });
  }
}

// 使用前に確認
await ensureDbDirectory(dbPath);
```

### メモリリーク対策

```typescript
// 定期的にメモリ使用量を監視
setInterval(() => {
  const usage = process.memoryUsage();
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024);

  console.log(`Memory usage: ${usedMB}MB`);

  if (usedMB > 400) {
    console.warn("High memory usage detected!");
  }
}, 60000);
```

### 同期エラーのリトライ

```typescript
async function syncWithExponentialBackoff(
  client: any,
  maxRetries = 5
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.sync();
      return;
    } catch (error) {
      const delay = Math.min(1000 * Math.pow(2, i), 30000);
      console.error(`Sync attempt ${i + 1} failed. Retrying in ${delay}ms...`);

      if (i === maxRetries - 1) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## ベストプラクティス

1. **ボリュームの使用**: 永続化が必要な場合はRailwayボリュームを使用
2. **環境変数の管理**: 秘密情報はRailway環境変数で管理
3. **ヘルスチェック**: アプリケーションの健全性を監視
4. **エラーハンドリング**: すべてのデータベース操作でエラーをキャッチ
5. **ログ記録**: 適切なログレベルで記録

## スケーリング

Railwayは自動スケーリングをサポート：

```typescript
// 複数インスタンスでの同期を考慮
const instanceId = process.env.RAILWAY_REPLICA_ID || "0";
console.log(`Running on instance: ${instanceId}`);

// インスタンスごとに独立したローカルDB
const dbPath = `/tmp/local-${instanceId}.db`;
```

## 関連リンク

- [Railway公式サイト](https://railway.app/)
- [Railway Documentation](https://docs.railway.app/)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [libSQL Client](https://docs.turso.tech/sdk/ts/reference)
