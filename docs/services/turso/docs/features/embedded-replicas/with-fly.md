# Turso - FlyでEmbedded Replicasを使用

Fly.ioでTurso Embedded Replicasを使用してアプリケーションのパフォーマンスを向上させる方法を説明します。

## 概要

Fly.ioは世界中にエッジロケーションを持つプラットフォームです。Turso Embedded Replicasと組み合わせることで、各Flyインスタンスがローカルデータベースレプリカを持ち、超低レイテンシでデータにアクセスできます。

## アーキテクチャ

```typescript
interface FlyEmbeddedReplicaArchitecture {
  flyRegions: {
    tokyo: "ローカルレプリカ + Tursoリモート";
    singapore: "ローカルレプリカ + Tursoリモート";
    sanFrancisco: "ローカルレプリカ + Tursoリモート";
  };

  benefits: {
    localReads: "各リージョンで超高速読み取り";
    globalWrites: "すべてのレプリカに自動伝播";
    lowLatency: "ユーザーに最も近いロケーションで処理";
  };
}
```

## セットアップ

### 1. Tursoデータベースの作成

```bash
# Tursoデータベースを作成
turso db create my-app-db

# データベースURLを取得
turso db show my-app-db --url

# 認証トークンを作成
turso db tokens create my-app-db
```

### 2. Flyアプリケーションの作成

```bash
# Flyアプリを初期化
fly launch

# または既存のアプリにデプロイ
fly deploy
```

### 3. 環境変数の設定

```bash
# Turso認証情報をFlyシークレットとして設定
fly secrets set TURSO_DATABASE_URL="libsql://my-app-db-[org].turso.io"
fly secrets set TURSO_AUTH_TOKEN="your-auth-token"
```

## 実装例

### Node.js/Express アプリケーション

```typescript
// app.ts
import express from "express";
import { createClient } from "@libsql/client";
import path from "path";

const app = express();

// Flyの永続ボリュームを使用
const dbPath = process.env.FLY_VOLUME_DIR
  ? path.join(process.env.FLY_VOLUME_DIR, "local.db")
  : "local.db";

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 起動時に同期
async function initializeDatabase() {
  try {
    console.log("Initial sync starting...");
    await client.sync();
    console.log("Initial sync completed");
  } catch (error) {
    console.error("Initial sync failed:", error);
  }
}

// バックグラウンドで定期的に同期
function startPeriodicSync() {
  setInterval(async () => {
    try {
      await client.sync();
      console.log("Periodic sync completed");
    } catch (error) {
      console.error("Periodic sync failed:", error);
    }
  }, 60000); // 1分ごと
}

// APIエンドポイント
app.get("/api/products", async (req, res) => {
  try {
    // ローカルから超高速で読み取り
    const result = await client.execute("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/products", express.json(), async (req, res) => {
  try {
    const { name, price } = req.body;

    // リモートに書き込み
    await client.execute({
      sql: "INSERT INTO products (name, price) VALUES (?, ?)",
      args: [name, price],
    });

    // 書き込み後に同期
    await client.sync();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database write failed" });
  }
});

// ヘルスチェック
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
  startPeriodicSync();
});
```

### Next.js アプリケーション

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";
import path from "path";

const dbPath = process.env.FLY_VOLUME_DIR
  ? path.join(process.env.FLY_VOLUME_DIR, "local.db")
  : path.join(process.cwd(), "local.db");

export const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

let syncInitialized = false;

export async function ensureSync() {
  if (!syncInitialized) {
    await client.sync();
    syncInitialized = true;

    // 定期同期開始
    setInterval(async () => {
      try {
        await client.sync();
      } catch (error) {
        console.error("Sync error:", error);
      }
    }, 60000);
  }
}
```

```typescript
// app/api/products/route.ts
import { client, ensureSync } from "@/lib/db";

export async function GET() {
  await ensureSync();

  const result = await client.execute("SELECT * FROM products");
  return Response.json(result.rows);
}

export async function POST(request: Request) {
  await ensureSync();

  const body = await request.json();

  await client.execute({
    sql: "INSERT INTO products (name, price) VALUES (?, ?)",
    args: [body.name, body.price],
  });

  await client.sync();

  return Response.json({ success: true });
}
```

## Fly設定ファイル

### fly.toml

```toml
app = "my-turso-app"
primary_region = "nrt"  # Tokyo

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3000"

# 永続ボリュームをマウント
[mounts]
  source = "turso_data"
  destination = "/data"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    interval = "15s"
    timeout = "2s"
    grace_period = "5s"

  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "get"
    path = "/health"
```

## 永続ボリュームの作成

Embedded Replicasのローカルデータベースファイルを永続化するために、Flyボリュームを作成します：

```bash
# ボリュームを作成（リージョンごと）
fly volumes create turso_data --region nrt --size 1  # Tokyo
fly volumes create turso_data --region sin --size 1  # Singapore
fly volumes create turso_data --region sjc --size 1  # San Jose

# ボリュームの確認
fly volumes list
```

## マルチリージョンデプロイ

複数のリージョンにデプロイして、グローバルに低レイテンシを実現：

```bash
# 複数リージョンにスケール
fly scale count 3 --region nrt,sin,sjc

# 各リージョンのステータス確認
fly status

# リージョン別のインスタンス確認
fly regions list
```

## 環境変数の管理

```typescript
// .env.local (ローカル開発)
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=

// .env.production (Fly - fly secrets経由)
TURSO_DATABASE_URL=libsql://my-app-db-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
FLY_VOLUME_DIR=/data
```

## パフォーマンス最適化

### 1. 同期戦略の最適化

```typescript
// 読み取り頻度の高いアプリケーション
const SYNC_INTERVAL = 30000; // 30秒

// 書き込み頻度の高いアプリケーション
const SYNC_INTERVAL = 5000; // 5秒

// 低頻度の更新
const SYNC_INTERVAL = 300000; // 5分
```

### 2. コネクションプーリング

```typescript
// シングルトンクライアント
let clientInstance: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!clientInstance) {
    clientInstance = createClient({
      url: `file:${dbPath}`,
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return clientInstance;
}
```

### 3. キャッシュ戦略

```typescript
import { cache } from "react";

// Next.jsのキャッシュ機能と組み合わせ
export const getProducts = cache(async () => {
  const client = getClient();
  const result = await client.execute("SELECT * FROM products");
  return result.rows;
});
```

## モニタリング

### ログ監視

```bash
# リアルタイムログ
fly logs

# 特定のリージョンのログ
fly logs --region nrt

# エラーログのみ
fly logs --grep error
```

### メトリクス

```typescript
// 同期メトリクスの収集
let syncMetrics = {
  lastSync: null as Date | null,
  syncCount: 0,
  failureCount: 0,
  avgDuration: 0,
};

async function syncWithMetrics() {
  const startTime = Date.now();

  try {
    await client.sync();
    const duration = Date.now() - startTime;

    syncMetrics.lastSync = new Date();
    syncMetrics.syncCount++;
    syncMetrics.avgDuration =
      (syncMetrics.avgDuration * (syncMetrics.syncCount - 1) + duration)
      / syncMetrics.syncCount;
  } catch (error) {
    syncMetrics.failureCount++;
    throw error;
  }
}

// メトリクスエンドポイント
app.get("/metrics", (req, res) => {
  res.json(syncMetrics);
});
```

## トラブルシューティング

### ボリュームマウントエラー

```bash
# ボリュームの状態確認
fly volumes list

# ボリュームを再作成
fly volumes destroy turso_data
fly volumes create turso_data --region nrt --size 1
```

### 同期エラー

```typescript
// リトライロジック
async function syncWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.sync();
      return;
    } catch (error) {
      console.error(`Sync attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### メモリ使用量の最適化

```toml
# fly.toml
[vm]
  memory = '512mb'  # メモリを増やす
  cpu_kind = 'shared'
  cpus = 1
```

## ベストプラクティス

1. **永続ボリュームの使用**: レプリカデータの永続化
2. **マルチリージョンデプロイ**: グローバルなパフォーマンス
3. **適切な同期間隔**: アプリケーション要件に応じて調整
4. **エラーハンドリング**: リトライロジックの実装
5. **モニタリング**: ログとメトリクスの監視

## デプロイ

```bash
# アプリケーションをデプロイ
fly deploy

# デプロイステータス確認
fly status

# 特定のリージョンへのデプロイ
fly deploy --region nrt
```

## 関連リンク

- [Fly.io公式サイト](https://fly.io/)
- [Fly.io Documentation](https://fly.io/docs/)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [libSQL Client](https://docs.turso.tech/sdk/ts/reference)
