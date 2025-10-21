# Turso - Scale to Zero（ゼロスケーリング）

Tursoのスケールトゥゼロ機能により、未使用時のデータベースコストを最小化する方法を説明します。

## 概要

Scale to Zeroは、データベースが使用されていない時に自動的にリソースを解放し、使用時のみコストが発生する機能です。サーバーレスアーキテクチャの理想的な特性を提供します。

## 主な特徴

```typescript
interface ScaleToZero {
  benefits: {
    costEfficiency: "未使用時のコストゼロ";
    automatic: "自動的なスケーリング";
    instant: "即座の起動と停止";
    transparent: "アプリケーションへの影響なし";
  };

  behavior: {
    idle: "非アクティブ時にリソース解放";
    active: "リクエスト受信時に即座に起動";
    coldStart: "最小限のコールドスタート時間";
    seamless: "接続の透過的な管理";
  };
}
```

## 仕組み

### アイドル状態への移行

```typescript
interface ScaleToZeroBehavior {
  active: {
    state: "データベースが使用中";
    resources: "フルリソースで動作";
    cost: "アクティブ時間に応じた課金";
  };

  idle: {
    trigger: "一定時間リクエストがない";
    state: "スケールダウン開始";
    resources: "リソース解放";
    cost: "ストレージのみ課金";
  };

  wakeup: {
    trigger: "新しいリクエスト受信";
    state: "即座に起動";
    latency: "数ミリ秒〜数百ミリ秒";
    transparent: "クライアントは遅延を感じるのみ";
  };
}
```

## コストへの影響

### 課金モデル

```typescript
interface PricingWithScaleToZero {
  active: {
    compute: "実際の使用時間のみ課金";
    reads: "行読み取り数に応じて課金";
    writes: "行書き込み数に応じて課金";
  };

  idle: {
    compute: "課金なし";
    storage: "データ保存のみ課金";
    benefit: "大幅なコスト削減";
  };

  example: {
    traditional: "24時間 × 30日 = 常時課金";
    scaleToZero: "実際の使用時間のみ（例: 2時間/日）";
    savings: "最大90%以上のコスト削減";
  };
}
```

### 実際のコスト比較

```typescript
// 従来のデータベース vs Scale to Zero

interface CostComparison {
  traditionalDB: {
    monthlyBase: "$50/月（最小インスタンス）";
    usage: "24時間稼働";
    totalCost: "$50/月 + 使用量";
  };

  tursoScaleToZero: {
    monthlyBase: "$0（基本料金なし）";
    activeTime: "1日2時間 × 30日 = 60時間/月";
    storageCost: "データ量に応じて";
    computeCost: "実際の使用時間のみ";
    totalCost: "大幅に削減（通常70-90%減）";
  };
}
```

## 実装パターン

### 基本的な使用

```typescript
// 通常のTurso接続と同じ - Scale to Zeroは自動
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// データベースはリクエスト時に自動的に起動
async function fetchUsers() {
  // 最初のクエリでコールドスタートが発生する可能性がある
  const result = await client.execute("SELECT * FROM users");
  return result.rows;
}
```

### コールドスタートの処理

```typescript
// コールドスタートを考慮した実装
async function queryWithRetry<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      // コールドスタートやタイムアウトエラーの場合
      if (i === maxRetries - 1) throw error;

      // エクスポネンシャルバックオフ
      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Query failed after retries");
}

// 使用例
const users = await queryWithRetry(() =>
  client.execute("SELECT * FROM users")
);
```

### ウォームアップ戦略

```typescript
// 定期的にクエリを実行してデータベースをウォーム状態に保つ
class DatabaseWarmer {
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private client: any,
    private warmupIntervalMs = 5 * 60 * 1000 // 5分
  ) {}

  start() {
    if (this.interval) return;

    console.log("Starting database warmer...");

    this.interval = setInterval(async () => {
      try {
        await this.client.execute("SELECT 1");
        console.log("Database warmed up");
      } catch (error) {
        console.error("Warmup failed:", error);
      }
    }, this.warmupIntervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("Database warmer stopped");
    }
  }
}

// 使用例（必要な場合のみ）
const warmer = new DatabaseWarmer(client);

// ピークタイム前にウォームアップ開始
if (isBusinessHours()) {
  warmer.start();
} else {
  warmer.stop(); // コストを削減
}
```

## ユースケース別の最適化

### 1. 低頻度アクセスのアプリケーション

```typescript
// 個人プロジェクト、小規模アプリ
// → Scale to Zeroで大幅なコスト削減

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// そのまま使用 - 特別な処理は不要
export async function getArticles() {
  const result = await client.execute(
    "SELECT * FROM articles ORDER BY created_at DESC LIMIT 10"
  );
  return result.rows;
}
```

### 2. バースト型トラフィック

```typescript
// イベント駆動、キャンペーン時のみアクセス増加
// → アクティブ時のみコスト、通常時はゼロ

async function handleCampaignTraffic() {
  // キャンペーン開始時は多数のリクエスト
  const promises = Array.from({ length: 100 }, (_, i) =>
    client.execute({
      sql: "INSERT INTO campaign_signups (email) VALUES (?)",
      args: [`user${i}@example.com`],
    })
  );

  await Promise.all(promises);
  // アクティブ時間のみ課金される
}
```

### 3. 開発・ステージング環境

```typescript
// 開発環境は夜間・週末は未使用
// → 未使用時はコストゼロ

const devClient = createClient({
  url: process.env.DEV_DATABASE_URL!,
  authToken: process.env.DEV_AUTH_TOKEN!,
});

// 開発時間のみアクティブ
// 夜間・週末は自動的にスケールダウン
async function developmentQuery() {
  return await devClient.execute("SELECT * FROM test_data");
}
```

### 4. スケジュールされたジョブ

```typescript
// 定期的なバッチ処理
// → 実行時のみアクティブ

async function dailyReportJob() {
  console.log("Starting daily report job...");

  // データベースが自動的に起動
  const result = await client.execute(`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as count,
      SUM(amount) as total
    FROM orders
    WHERE created_at >= date('now', '-1 day')
    GROUP BY DATE(created_at)
  `);

  // レポート生成...
  console.log("Report generated:", result.rows);

  // ジョブ完了後、しばらくしてスケールダウン
}

// Cronで1日1回実行
// 実行時の数分のみ課金
```

## パフォーマンス考慮事項

### コールドスタート時間

```typescript
interface ColdStartMetrics {
  typical: {
    latency: "50-200ms（追加）";
    impact: "最初のクエリのみ";
    frequency: "アイドル後の最初のリクエスト";
  };

  mitigation: {
    cache: "アプリケーションレベルのキャッシュ";
    warmup: "定期的なウォームアップ（必要な場合）";
    async: "バックグラウンド処理";
    userExperience: "ローディングインジケーター";
  };
}
```

### コールドスタートの測定

```typescript
// コールドスタートを測定
async function measureColdStart() {
  const measurements: number[] = [];

  for (let i = 0; i < 10; i++) {
    // 十分な待機時間（データベースがアイドルになるまで）
    await new Promise(resolve => setTimeout(resolve, 60000));

    const start = Date.now();
    await client.execute("SELECT 1");
    const duration = Date.now() - start;

    measurements.push(duration);
    console.log(`Attempt ${i + 1}: ${duration}ms`);
  }

  const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
  console.log(`Average cold start: ${avg}ms`);
}
```

## ベストプラクティス

### 1. タイムアウトの設定

```typescript
// 適切なタイムアウトを設定
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  // リクエストタイムアウトを増やす（コールドスタート考慮）
});

// アプリケーションレベルのタイムアウト
async function queryWithTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs = 5000
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Query timeout")), timeoutMs)
  );

  return Promise.race([queryFn(), timeout]);
}
```

### 2. キャッシング戦略

```typescript
// アプリケーションレベルのキャッシュでコールドスタートの影響を軽減
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // 5分

async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  // キャッシュチェック
  const cached = cache.get<T>(key);
  if (cached) {
    console.log("Cache hit:", key);
    return cached;
  }

  // データベースから取得（コールドスタートの可能性）
  console.log("Cache miss, fetching from DB:", key);
  const data = await fetchFn();

  // キャッシュに保存
  cache.set(key, data);

  return data;
}

// 使用例
const users = await getCachedData("users:all", async () => {
  const result = await client.execute("SELECT * FROM users");
  return result.rows;
});
```

### 3. 非同期処理

```typescript
// バックグラウンドでデータベース操作
import { Queue } from "bullmq";

const dbQueue = new Queue("database-operations");

// リクエストハンドラー
app.post("/api/users", async (req, res) => {
  // すぐにレスポンスを返す
  res.json({ status: "accepted", message: "Processing..." });

  // バックグラウンドでDB操作
  await dbQueue.add("create-user", {
    name: req.body.name,
    email: req.body.email,
  });
});

// ワーカー（別プロセス）
const worker = new Worker("database-operations", async (job) => {
  // コールドスタートの影響はユーザーには見えない
  await client.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: [job.data.name, job.data.email],
  });
});
```

### 4. ヘルスチェックの調整

```typescript
// ヘルスチェックでデータベースを不必要にウェイクアップしない
app.get("/health", async (req, res) => {
  // データベースチェックをスキップするオプション
  const skipDb = req.query.skipDb === "true";

  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: skipDb ? "skipped" : "unknown",
  };

  if (!skipDb) {
    try {
      await client.execute("SELECT 1");
      health.database = "connected";
    } catch (error) {
      health.database = "failed";
      health.status = "degraded";
    }
  }

  res.json(health);
});

// ロードバランサーはスキップ版を使用
// GET /health?skipDb=true
```

## モニタリング

### アクティブ時間の追跡

```typescript
// データベースのアクティブ時間を記録
class DatabaseActivityTracker {
  private activeStartTime: number | null = null;
  private totalActiveTime = 0;

  onQueryStart() {
    if (!this.activeStartTime) {
      this.activeStartTime = Date.now();
      console.log("Database became active");
    }
  }

  onQueryEnd() {
    // 実際にはアイドルタイムアウト後に呼ばれる
    if (this.activeStartTime) {
      const duration = Date.now() - this.activeStartTime;
      this.totalActiveTime += duration;
      this.activeStartTime = null;
      console.log(`Database was active for ${duration}ms`);
    }
  }

  getTotalActiveTime() {
    return this.totalActiveTime;
  }

  getEstimatedMonthlyCost() {
    // 仮の計算
    const hours = this.totalActiveTime / (1000 * 60 * 60);
    const costPerHour = 0.01; // 例
    return hours * costPerHour;
  }
}
```

## よくある質問

### Q: コールドスタートを完全に避けられますか？

```typescript
// A: ウォームアップクエリを使用できますが、コストが発生します

// オプション1: 定期的なウォームアップ（コスト増）
setInterval(async () => {
  await client.execute("SELECT 1");
}, 5 * 60 * 1000); // 5分ごと

// オプション2: コールドスタートを受け入れる（推奨）
// - ユーザー体験の最適化（ローディング、キャッシュ）
// - コスト削減を優先
```

### Q: どのくらいでアイドル状態になりますか？

```typescript
interface IdleTimeout {
  typical: "数分間の非アクティブ後";
  exact: "Tursoが自動管理（調整不可）";
  recommendation: "アイドルタイミングに依存しない設計";
}
```

### Q: 本番環境で使用すべきですか？

```typescript
interface ProductionUsage {
  suitable: {
    lowTraffic: "低〜中程度のトラフィック";
    burst: "バースト型トラフィック";
    scheduled: "スケジュールされたジョブ";
    development: "開発・ステージング環境";
  };

  considerations: {
    highTraffic: "常時高トラフィック → 常にアクティブ";
    latencySensitive: "レイテンシ重視 → ウォームアップ検討";
    costOptimized: "コスト重視 → Scale to Zero最適";
  };
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso Pricing](https://turso.tech/pricing)
- [libSQL Documentation](https://docs.turso.tech/libsql)
- [Database Branching](/docs/services/turso/docs/features/branching)
