# Turso - KoyebでEmbedded Replicasを使用

Koyeb上でTurso Embedded Replicasを使用してアプリケーションのパフォーマンスを向上させる方法を説明します。

## 概要

Koyebは、グローバルにアプリケーションをデプロイできるサーバーレスプラットフォームです。Turso Embedded Replicasと組み合わせることで、各Koyebインスタンスがローカルデータベースレプリカを持ち、低レイテンシでデータにアクセスできます。

## セットアップ

### 1. Tursoデータベースの作成

```bash
# Tursoデータベースを作成
turso db create my-koyeb-app

# データベースURLを取得
turso db show my-koyeb-app --url

# 認証トークンを作成
turso db tokens create my-koyeb-app
```

### 2. Koyebアプリの作成

1. [Koyeb Control Panel](https://app.koyeb.com/)にログイン
2. 「Create App」をクリック
3. デプロイ方法を選択（GitHub、Docker、など）

### 3. 環境変数の設定

Koyeb Control Panelで環境変数を設定：

```
TURSO_DATABASE_URL=libsql://my-koyeb-app-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## 実装例

### Node.js/Express アプリケーション

```typescript
// server.ts
import express from "express";
import { createClient } from "@libsql/client";
import path from "path";
import { mkdir } from "fs/promises";

const app = express();
app.use(express.json());

// Koyebの一時ストレージを使用
const dataDir = "/tmp/turso-data";
const dbPath = path.join(dataDir, "local.db");

// データディレクトリを確保
async function ensureDataDir() {
  try {
    await mkdir(dataDir, { recursive: true });
    console.log(`Data directory created: ${dataDir}`);
  } catch (error) {
    console.log("Data directory already exists");
  }
}

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 初期化
async function initialize() {
  await ensureDataDir();

  console.log("Starting initial sync...");
  await client.sync();
  console.log("Initial sync completed");

  // 定期同期を開始
  startPeriodicSync();
}

// バックグラウンド同期
function startPeriodicSync() {
  setInterval(async () => {
    try {
      const start = Date.now();
      await client.sync();
      const duration = Date.now() - start;
      console.log(`Sync completed in ${duration}ms`);
    } catch (error) {
      console.error("Sync error:", error);
    }
  }, 30000); // 30秒ごと
}

// APIエンドポイント
app.get("/api/products", async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM products");
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    await client.execute({
      sql: "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
      args: [name, price, description],
    });

    // 書き込み後に同期
    await client.sync();

    res.json({
      success: true,
      message: "Product created",
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initialize();
});
```

### Next.js アプリケーション

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";
import { mkdir } from "fs/promises";
import path from "path";

const dataDir = "/tmp/turso-data";
const dbPath = path.join(dataDir, "local.db");

async function ensureDataDir() {
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // ディレクトリが存在する場合は無視
  }
}

let clientInstance: ReturnType<typeof createClient> | null = null;

export async function getDbClient() {
  if (!clientInstance) {
    await ensureDataDir();

    clientInstance = createClient({
      url: `file:${dbPath}`,
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // 初回同期
    await clientInstance.sync();
    console.log("Database client initialized");
  }

  return clientInstance;
}

// 同期ヘルパー
let lastSync = 0;
const SYNC_INTERVAL = 30000; // 30秒

export async function syncIfNeeded(client: any) {
  const now = Date.now();
  if (now - lastSync > SYNC_INTERVAL) {
    await client.sync();
    lastSync = now;
  }
}
```

```typescript
// app/api/products/route.ts
import { getDbClient, syncIfNeeded } from "@/lib/db";

export async function GET() {
  try {
    const client = await getDbClient();
    await syncIfNeeded(client);

    const result = await client.execute(
      "SELECT * FROM products ORDER BY created_at DESC"
    );

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await getDbClient();
    const body = await request.json();

    const result = await client.execute({
      sql: "INSERT INTO products (name, price, description) VALUES (?, ?, ?) RETURNING *",
      args: [body.name, body.price, body.description],
    });

    // 書き込み後に同期
    await client.sync();

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
```

## Koyeb設定

### Dockerfile

Koyebで独自のDockerイメージを使用する場合：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm ci --production

# アプリケーションコードをコピー
COPY . .

# Next.jsをビルド
RUN npm run build

# 一時ストレージ用ディレクトリ
RUN mkdir -p /tmp/turso-data

EXPOSE 8000

CMD ["npm", "start"]
```

### koyeb.yaml

```yaml
app:
  name: my-turso-app

services:
  - name: web
    type: web
    instance_type: nano
    regions:
      - fra  # Frankfurt
    ports:
      - port: 8000
        protocol: http
    env:
      - key: PORT
        value: "8000"
      - key: NODE_ENV
        value: production
      - key: TURSO_DATABASE_URL
        secret: turso-database-url
      - key: TURSO_AUTH_TOKEN
        secret: turso-auth-token
    health_checks:
      - http:
          port: 8000
          path: /health
    routes:
      - path: /
        port: 8000
```

## 環境変数の管理

### Koyeb Secrets

セキュアな環境変数を設定：

```bash
# Koyeb CLIで秘密情報を設定
koyeb secrets create turso-database-url --value "libsql://my-app.turso.io"
koyeb secrets create turso-auth-token --value "your-auth-token"
```

### ローカル開発

```bash
# .env.local
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
PORT=3000
```

## パフォーマンス最適化

### 1. スマート同期

```typescript
// 同期状態の管理
class SyncManager {
  private lastSyncTime = 0;
  private syncInProgress = false;
  private readonly syncInterval = 30000; // 30秒

  async syncIfNeeded(client: any) {
    const now = Date.now();

    if (this.syncInProgress) {
      console.log("Sync already in progress, skipping");
      return;
    }

    if (now - this.lastSyncTime < this.syncInterval) {
      return;
    }

    this.syncInProgress = true;
    try {
      await client.sync();
      this.lastSyncTime = now;
      console.log("Sync completed");
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }
}

export const syncManager = new SyncManager();
```

### 2. 接続プーリング

```typescript
// シングルトンパターン
class DatabaseClient {
  private static instance: DatabaseClient;
  private client: any;

  private constructor() {}

  static async getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
      await DatabaseClient.instance.initialize();
    }
    return DatabaseClient.instance;
  }

  private async initialize() {
    await ensureDataDir();

    this.client = createClient({
      url: `file:${dbPath}`,
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    await this.client.sync();
  }

  getClient() {
    return this.client;
  }
}
```

### 3. キャッシング戦略

```typescript
// メモリキャッシュの追加
import { LRUCache } from "lru-cache";

const queryCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5分
});

export async function getCachedProducts() {
  const cacheKey = "products:all";

  // キャッシュチェック
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // データベースからフェッチ
  const client = await getDbClient();
  const result = await client.execute("SELECT * FROM products");

  // キャッシュに保存
  queryCache.set(cacheKey, result.rows);

  return result.rows;
}
```

## モニタリング

### ヘルスチェック

```typescript
// app/api/health/route.ts
import { getDbClient } from "@/lib/db";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      database: "unknown",
      sync: "unknown",
    },
  };

  try {
    const client = await getDbClient();

    // データベース接続確認
    await client.execute("SELECT 1");
    health.checks.database = "connected";

    // 同期確認
    try {
      await client.sync();
      health.checks.sync = "operational";
    } catch (syncError) {
      health.checks.sync = "degraded";
      health.status = "degraded";
    }

    return Response.json(health);
  } catch (error) {
    health.status = "unhealthy";
    health.checks.database = "failed";

    return Response.json(health, { status: 503 });
  }
}
```

### ログ記録

```typescript
// 構造化ログ
function log(level: string, message: string, meta?: any) {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  }));
}

// 使用例
log("info", "Sync started");
log("error", "Sync failed", { error: error.message });
```

## デプロイ

### GitHubからデプロイ

1. GitHubリポジトリをKoyebに接続
2. ブランチを選択（例: `main`）
3. ビルドコマンドを設定: `npm install && npm run build`
4. 起動コマンドを設定: `npm start`

### CLIからデプロイ

```bash
# Koyeb CLIをインストール
npm install -g @koyeb/cli

# ログイン
koyeb login

# アプリをデプロイ
koyeb app init my-turso-app
koyeb deploy
```

## トラブルシューティング

### ディスク容量エラー

```typescript
import { statSync } from "fs";

function checkDiskSpace() {
  try {
    const stats = statSync(dbPath);
    const sizeInMB = stats.size / (1024 * 1024);

    console.log(`Database size: ${sizeInMB.toFixed(2)}MB`);

    if (sizeInMB > 100) {
      console.warn("Database size exceeds 100MB");
    }
  } catch (error) {
    console.error("Failed to check disk space:", error);
  }
}
```

### 同期タイムアウト

```typescript
async function syncWithTimeout(client: any, timeoutMs = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Sync timeout")), timeoutMs)
  );

  try {
    await Promise.race([client.sync(), timeout]);
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}
```

### コールドスタート最適化

```typescript
// ウォームアップエンドポイント
app.get("/warmup", async (req, res) => {
  try {
    const client = await getDbClient();
    await client.execute("SELECT 1");
    res.json({ status: "warmed" });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
});
```

## ベストプラクティス

1. **一時ストレージの使用**: `/tmp`ディレクトリにローカルDBを保存
2. **シングルトンパターン**: データベースクライアントの再利用
3. **エラーハンドリング**: すべての非同期操作でエラーをキャッチ
4. **ヘルスチェック**: アプリケーションの状態を監視
5. **構造化ログ**: デバッグしやすいログ形式

## リージョン選択

Koyebは複数のリージョンをサポート：

- **fra**: Frankfurt (ヨーロッパ)
- **was**: Washington D.C. (北米東部)
- **par**: Paris (ヨーロッパ)
- **sin**: Singapore (アジア)

## スケーリング

```yaml
# koyeb.yaml
services:
  - name: web
    instance_type: small
    scaling:
      min: 1
      max: 10
    autoscaling:
      enabled: true
      target_cpu_percent: 80
```

## 関連リンク

- [Koyeb公式サイト](https://www.koyeb.com/)
- [Koyeb Documentation](https://www.koyeb.com/docs)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [libSQL Client](https://docs.turso.tech/sdk/ts/reference)
