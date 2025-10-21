# Turso - Data at the Edge（エッジでのデータ）

Tursoのエッジデータベース機能を使用して、ユーザーに最も近い場所でデータにアクセスする方法を説明します。

## 概要

Data at the Edgeは、世界中の複数のロケーションにデータベースレプリカを配置し、ユーザーに最も近いロケーションからデータを提供する機能です。これにより、グローバルアプリケーションのレイテンシを最小化できます。

## 主な特徴

```typescript
interface DataAtEdge {
  benefits: {
    lowLatency: "ユーザーに最も近いロケーションから応答";
    globalReach: "世界中にデータ配信";
    automatic: "自動的なレプリケーション";
    transparent: "アプリケーションコードの変更不要";
  };

  architecture: {
    primaryLocation: "プライマリロケーション（書き込み）";
    replicaLocations: "レプリカロケーション（読み取り）";
    sync: "自動的な同期";
    routing: "最適なロケーションへの自動ルーティング";
  };
}
```

## サポートされるロケーション

### グローバルロケーション

```typescript
interface Locations {
  americas: {
    ord: "Chicago (US Central)";
    iad: "Washington D.C. (US East)";
    sjc: "San Jose (US West)";
    gru: "São Paulo (Brazil)";
  };

  europe: {
    ams: "Amsterdam (Netherlands)";
    fra: "Frankfurt (Germany)";
    lhr: "London (UK)";
    mad: "Madrid (Spain)";
  };

  asia: {
    nrt: "Tokyo (Japan)";
    sin: "Singapore";
    syd: "Sydney (Australia)";
    hkg: "Hong Kong";
  };
}
```

## セットアップ

### プライマリロケーションの設定

```bash
# データベースを作成（プライマリロケーション指定）
turso db create my-global-app --location nrt  # Tokyo

# データベース情報を確認
turso db show my-global-app
```

### レプリカの追加

```bash
# レプリカロケーションを追加
turso db replicate my-global-app --location iad  # Washington D.C.
turso db replicate my-global-app --location fra  # Frankfurt
turso db replicate my-global-app --location sin  # Singapore

# ロケーション一覧を確認
turso db locations list my-global-app
```

## 使用方法

### 基本的な接続

```typescript
import { createClient } from "@libsql/client";

// 最も近いロケーションに自動的にルーティングされる
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!, // プライマリURL
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// 読み取り - 最も近いレプリカから
async function getUsers() {
  const result = await client.execute("SELECT * FROM users");
  return result.rows;
}

// 書き込み - プライマリロケーションへ
async function createUser(name: string, email: string) {
  await client.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: [name, email],
  });
}
```

### ロケーション固有の接続

```typescript
// 特定のロケーションに直接接続
const tokyoClient = createClient({
  url: "libsql://my-global-app-nrt-[org].turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const dcClient = createClient({
  url: "libsql://my-global-app-iad-[org].turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// アジアユーザー向け
async function getDataForAsianUsers() {
  return await tokyoClient.execute("SELECT * FROM products");
}

// 米国ユーザー向け
async function getDataForUSUsers() {
  return await dcClient.execute("SELECT * FROM products");
}
```

## レプリケーションの仕組み

### 書き込みの伝播

```typescript
interface WriteReplication {
  flow: {
    step1: "アプリケーションがプライマリに書き込み";
    step2: "プライマリが書き込みを受理";
    step3: "変更が全レプリカに非同期で伝播";
    step4: "レプリカが更新される";
  };

  timing: {
    primary: "即座に反映";
    replicas: "数百ミリ秒〜数秒で伝播";
    eventual: "最終的な整合性";
  };
}
```

### 読み取りの動作

```typescript
async function demonstrateReadBehavior() {
  // 書き込みを実行
  await client.execute({
    sql: "INSERT INTO posts (title, content) VALUES (?, ?)",
    args: ["New Post", "Content here"],
  });

  // プライマリでは即座に読み取り可能
  const immediateRead = await client.execute(
    "SELECT * FROM posts WHERE title = 'New Post'"
  );
  console.log("Immediate read:", immediateRead.rows);

  // レプリカでは少し遅延する可能性がある
  // （通常は数百ミリ秒以内に伝播）
  await new Promise(resolve => setTimeout(resolve, 500));

  const replicaRead = await client.execute(
    "SELECT * FROM posts WHERE title = 'New Post'"
  );
  console.log("Replica read:", replicaRead.rows);
}
```

## グローバルアプリケーションのパターン

### 1. マルチリージョンAPI

```typescript
// Next.js Edge API Route
export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  // Edge Functionは自動的に最も近いロケーションで実行される
  // Tursoも最も近いレプリカに接続される
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const products = await client.execute("SELECT * FROM products LIMIT 20");

  return new Response(JSON.stringify(products.rows), {
    headers: {
      "content-type": "application/json",
      // ユーザーのロケーション情報を返す
      "x-location": request.headers.get("cf-ray") || "unknown",
    },
  });
}
```

### 2. 地域別コンテンツ配信

```typescript
// 地域に応じたコンテンツの提供
async function getRegionalContent(userRegion: string) {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // 地域別のコンテンツをクエリ
  const result = await client.execute({
    sql: `
      SELECT * FROM content
      WHERE region = ? OR region = 'global'
      ORDER BY priority DESC
      LIMIT 10
    `,
    args: [userRegion],
  });

  return result.rows;
}

// Vercel Edge Function
export default async function handler(request: Request) {
  // Vercelの地域情報を取得
  const userRegion = request.headers.get("x-vercel-ip-country") || "US";

  const content = await getRegionalContent(userRegion);

  return Response.json(content);
}
```

### 3. グローバルEコマース

```typescript
// 在庫管理 - グローバル在庫の一元管理
class GlobalInventoryManager {
  private client: any;

  constructor() {
    this.client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }

  // どのリージョンからでも最新の在庫を確認
  async checkStock(productId: string) {
    const result = await this.client.execute({
      sql: "SELECT stock FROM inventory WHERE product_id = ?",
      args: [productId],
    });

    return result.rows[0]?.stock || 0;
  }

  // 在庫を減らす（プライマリに書き込み）
  async decrementStock(productId: string, quantity: number) {
    await this.client.execute({
      sql: `
        UPDATE inventory
        SET stock = stock - ?
        WHERE product_id = ?
      `,
      args: [quantity, productId],
    });

    // 変更は自動的に全リージョンに伝播
  }

  // 注文処理
  async createOrder(userId: string, productId: string, quantity: number) {
    // トランザクション
    await this.client.execute("BEGIN TRANSACTION");

    try {
      // 在庫確認
      const stock = await this.checkStock(productId);

      if (stock < quantity) {
        throw new Error("Insufficient stock");
      }

      // 注文作成
      await this.client.execute({
        sql: `
          INSERT INTO orders (user_id, product_id, quantity, status)
          VALUES (?, ?, ?, 'pending')
        `,
        args: [userId, productId, quantity],
      });

      // 在庫減少
      await this.decrementStock(productId, quantity);

      await this.client.execute("COMMIT");

      return { success: true };
    } catch (error) {
      await this.client.execute("ROLLBACK");
      throw error;
    }
  }
}
```

### 4. グローバルチャットアプリ

```typescript
// リアルタイムメッセージング
class GlobalChatService {
  private client: any;

  constructor() {
    this.client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }

  // メッセージを送信（プライマリに書き込み）
  async sendMessage(roomId: string, userId: string, message: string) {
    const result = await this.client.execute({
      sql: `
        INSERT INTO messages (room_id, user_id, message, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      args: [roomId, userId, message],
    });

    return result.rows[0];
  }

  // メッセージを取得（最も近いレプリカから）
  async getMessages(roomId: string, limit = 50) {
    const result = await this.client.execute({
      sql: `
        SELECT m.*, u.name as user_name
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.room_id = ?
        ORDER BY m.created_at DESC
        LIMIT ?
      `,
      args: [roomId, limit],
    });

    return result.rows.reverse(); // 古い順に
  }

  // リアルタイム購読（ポーリング）
  async subscribeToRoom(
    roomId: string,
    lastMessageId: number,
    callback: (messages: any[]) => void
  ) {
    setInterval(async () => {
      const result = await this.client.execute({
        sql: `
          SELECT m.*, u.name as user_name
          FROM messages m
          JOIN users u ON m.user_id = u.id
          WHERE m.room_id = ? AND m.id > ?
          ORDER BY m.created_at ASC
        `,
        args: [roomId, lastMessageId],
      });

      if (result.rows.length > 0) {
        callback(result.rows);
        lastMessageId = result.rows[result.rows.length - 1].id;
      }
    }, 1000); // 1秒ごとにポーリング
  }
}
```

## パフォーマンス最適化

### レイテンシの測定

```typescript
async function measureLatency() {
  const measurements: number[] = [];

  for (let i = 0; i < 10; i++) {
    const start = Date.now();

    await client.execute("SELECT 1");

    const latency = Date.now() - start;
    measurements.push(latency);
  }

  const avg = measurements.reduce((a, b) => a + b) / measurements.length;
  const min = Math.min(...measurements);
  const max = Math.max(...measurements);

  console.log({
    average: `${avg}ms`,
    min: `${min}ms`,
    max: `${max}ms`,
  });
}
```

### キャッシング戦略

```typescript
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5分
});

async function getCachedData(key: string, fetchFn: () => Promise<any>) {
  // キャッシュチェック
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  // データベースから取得（最も近いレプリカ）
  const data = await fetchFn();

  // キャッシュに保存
  cache.set(key, data);

  return data;
}

// 使用例
const products = await getCachedData("products:featured", async () => {
  const result = await client.execute(
    "SELECT * FROM products WHERE featured = true"
  );
  return result.rows;
});
```

## モニタリング

### ロケーション別のメトリクス

```typescript
class LocationMonitor {
  private metrics = new Map<string, any>();

  async trackRequest(location: string, duration: number) {
    if (!this.metrics.has(location)) {
      this.metrics.set(location, {
        requests: 0,
        totalDuration: 0,
        avgDuration: 0,
      });
    }

    const metric = this.metrics.get(location);
    metric.requests++;
    metric.totalDuration += duration;
    metric.avgDuration = metric.totalDuration / metric.requests;
  }

  getMetrics() {
    const result: any[] = [];

    for (const [location, metric] of this.metrics) {
      result.push({
        location,
        ...metric,
      });
    }

    return result;
  }
}

const monitor = new LocationMonitor();

// APIハンドラーでトラッキング
app.get("/api/data", async (req, res) => {
  const start = Date.now();
  const location = req.headers["cf-ray"] || "unknown";

  try {
    const data = await client.execute("SELECT * FROM data");

    const duration = Date.now() - start;
    await monitor.trackRequest(location, duration);

    res.json(data.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
```

## ベストプラクティス

### 1. 読み取り最適化

```typescript
// 読み取りは自動的に最も近いレプリカから
// 書き込みは明示的にプライマリへ

const readClient = createClient({
  url: process.env.TURSO_DATABASE_URL!, // 自動ルーティング
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const writeClient = createClient({
  url: process.env.TURSO_PRIMARY_URL!, // プライマリ固定
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

### 2. 整合性の理解

```typescript
// 最終的な整合性を理解する
async function handleEventualConsistency() {
  // 書き込み
  await client.execute({
    sql: "INSERT INTO posts (id, title) VALUES (?, ?)",
    args: [1, "New Post"],
  });

  // 即座の読み取りでは見つからない可能性がある（レプリカ）
  // 少し待つか、プライマリから読み取る
  await new Promise(resolve => setTimeout(resolve, 100));

  const result = await client.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [1],
  });

  return result.rows[0];
}
```

### 3. エラーハンドリング

```typescript
async function resilientQuery(sql: string, args?: any[]) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.execute({ sql, args });
    } catch (error) {
      console.error(`Query attempt ${i + 1} failed:`, error);

      if (i === maxRetries - 1) {
        throw error;
      }

      // リトライ前に待機
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 料金への影響

```typescript
interface PricingConsiderations {
  storage: {
    cost: "レプリカ間でストレージを共有";
    note: "追加のストレージコストなし";
  };

  reads: {
    cost: "各ロケーションでの読み取りがカウント";
    optimization: "キャッシングで削減可能";
  };

  replication: {
    cost: "レプリケーション自体は無料";
    note: "データ転送コストなし";
  };
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso Locations](https://turso.tech/locations)
- [Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [Multi-DB Schemas](/docs/services/turso/docs/features/multi-db-schemas)
