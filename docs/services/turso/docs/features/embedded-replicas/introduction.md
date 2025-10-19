# Turso - Embedded Replicas（組み込みレプリカ）入門

Turso Embedded Replicasは、アプリケーションと同じプロセス内にデータベースのローカルレプリカを作成し、超低レイテンシでデータにアクセスできる機能です。

## 概要

Embedded Replicasを使用すると、アプリケーションはローカルのSQLiteデータベースファイルを使用してクエリを実行し、バックグラウンドでリモートのTursoデータベースと同期します。

## 主な特徴

### パフォーマンス

- **ローカル読み取り**: すべての読み取りクエリがローカルで実行される
- **サブミリ秒レイテンシ**: ネットワーク往復を排除
- **高速応答**: データベースがアプリケーションと同じプロセス内に存在

### データ同期

- **自動同期**: バックグラウンドでリモートデータベースと同期
- **書き込みの透過性**: 書き込みは自動的にリモートに送信
- **整合性**: 最終的な整合性を保証

### スケーラビリティ

- **オフロード**: 読み取り負荷をローカルに分散
- **コスト削減**: リモートデータベースへのリクエスト削減
- **エッジコンピューティング**: エッジロケーションでの高速化

## 仕組み

```typescript
interface EmbeddedReplicaWorkflow {
  initialization: {
    step1: "リモートデータベースに接続";
    step2: "ローカルSQLiteファイルを作成";
    step3: "初期データを同期";
  };

  readOperations: {
    execution: "ローカルSQLiteファイルから読み取り";
    latency: "サブミリ秒";
    network: "不要";
  };

  writeOperations: {
    execution: "リモートデータベースに書き込み";
    propagation: "他のレプリカに伝播";
    confirmation: "書き込み完了を待機";
  };

  synchronization: {
    direction: "双方向";
    frequency: "設定可能";
    mode: "バックグラウンド";
  };
}
```

## 使用例

### JavaScript/TypeScript

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:local.db",
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 初回同期
await client.sync();

// ローカルで読み取り（超高速）
const result = await client.execute("SELECT * FROM users");

// リモートに書き込み
await client.execute({
  sql: "INSERT INTO users (name) VALUES (?)",
  args: ["Alice"],
});

// 定期的な同期
setInterval(async () => {
  await client.sync();
}, 60000); // 1分ごと
```

### Rust

```rust
use libsql::Builder;

let db = Builder::new_local_replica("local.db")
    .sync_url(env::var("TURSO_DATABASE_URL")?)
    .auth_token(env::var("TURSO_AUTH_TOKEN")?)
    .build()
    .await?;

// 初回同期
db.sync().await?;

// ローカルで読み取り
let mut rows = db.query("SELECT * FROM users", ()).await?;

// リモートに書き込み
db.execute("INSERT INTO users (name) VALUES (?)", ["Alice"]).await?;

// 同期
db.sync().await?;
```

### Python

```python
import libsql_experimental as libsql
import os

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

conn = libsql.connect("local.db", sync_url=url, auth_token=auth_token)

# 初回同期
conn.sync()

# ローカルで読み取り
cursor = conn.execute("SELECT * FROM users")
rows = cursor.fetchall()

# リモートに書き込み
conn.execute("INSERT INTO users (name) VALUES (?)", ["Alice"])

# 同期
conn.sync()
```

## 同期戦略

### 手動同期

明示的に`sync()`を呼び出してデータを同期：

```typescript
// 読み取り前に同期
await client.sync();
const data = await client.execute("SELECT * FROM products");
```

### 定期同期

定期的にバックグラウンドで同期：

```typescript
// 1分ごとに自動同期
const syncInterval = setInterval(async () => {
  try {
    await client.sync();
    console.log("Sync completed");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}, 60000);

// クリーンアップ
process.on("SIGINT", () => {
  clearInterval(syncInterval);
  process.exit();
});
```

### 書き込み後同期

書き込み操作後に即座に同期：

```typescript
async function createUser(name: string) {
  await client.execute({
    sql: "INSERT INTO users (name) VALUES (?)",
    args: [name],
  });

  // 書き込み後すぐに同期
  await client.sync();
}
```

## メリット

### パフォーマンス向上

- **読み取り速度**: ネットワークレイテンシの排除
- **応答性**: ユーザー体験の向上
- **スループット**: 並行読み取りの増加

### コスト削減

- **リクエスト削減**: リモートデータベースへの読み取りリクエストが不要
- **帯域幅**: ネットワークトラフィックの削減
- **スケーリング**: 効率的なリソース使用

### 可用性

- **オフライン機能**: ネットワーク障害時でも読み取り可能
- **耐障害性**: リモート障害の影響を軽減
- **レジリエンス**: ローカルでの継続動作

## ユースケース

### Webアプリケーション

```typescript
// Next.js API Route
export async function GET(request: Request) {
  // ローカルから超高速で読み取り
  const products = await client.execute(
    "SELECT * FROM products WHERE featured = true"
  );

  return Response.json(products.rows);
}
```

### サーバーレス関数

```typescript
// Vercel Edge Function
export const config = { runtime: "edge" };

export default async function handler(request: Request) {
  // コールドスタート時に同期
  if (needsSync) {
    await client.sync();
  }

  // ローカルで読み取り
  const data = await client.execute("SELECT * FROM cache");

  return new Response(JSON.stringify(data.rows));
}
```

### モバイルアプリ

```typescript
// React Native / Expo
import { useSQLiteContext } from "expo-sqlite/next";

function useProducts() {
  const db = useSQLiteContext();

  useEffect(() => {
    // バックグラウンドで同期
    const sync = async () => {
      await db.sync();
    };

    sync();
    const interval = setInterval(sync, 120000); // 2分ごと

    return () => clearInterval(interval);
  }, []);

  // ローカルから即座に読み取り
  return db.getAllSync("SELECT * FROM products");
}
```

## ベストプラクティス

### 1. 同期頻度の最適化

```typescript
// アプリケーションの要件に応じて調整
const SYNC_INTERVAL = {
  realtime: 5000,      // 5秒 - リアルタイムアプリ
  frequent: 30000,     // 30秒 - 頻繁な更新
  moderate: 60000,     // 1分 - 通常のアプリ
  occasional: 300000,  // 5分 - 低頻度の更新
};
```

### 2. エラーハンドリング

```typescript
async function syncWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.sync();
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. ローカルファイルの管理

```typescript
// 適切な場所にローカルファイルを保存
import path from "path";
import os from "os";

const dbPath = path.join(os.tmpdir(), "app-replica.db");

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

### 4. 同期ステータスの監視

```typescript
let lastSyncTime: Date | null = null;
let syncInProgress = false;

async function monitoredSync() {
  if (syncInProgress) {
    console.log("Sync already in progress");
    return;
  }

  syncInProgress = true;
  try {
    await client.sync();
    lastSyncTime = new Date();
    console.log(`Sync completed at ${lastSyncTime}`);
  } catch (error) {
    console.error("Sync error:", error);
  } finally {
    syncInProgress = false;
  }
}
```

## 制限事項

### ストレージ

- ローカルディスク容量が必要
- データベースサイズに応じた空き容量

### 整合性

- 最終的な整合性モデル
- 即座の一貫性は保証されない
- 同期タイミングに依存

### 競合解決

- 最後の書き込みが優先（Last Write Wins）
- カスタム競合解決は未サポート

## トラブルシューティング

### 同期エラー

```typescript
try {
  await client.sync();
} catch (error) {
  if (error.code === "SQLITE_BUSY") {
    // データベースがロックされている
    await new Promise(resolve => setTimeout(resolve, 100));
    await client.sync();
  } else if (error.code === "NETWORK_ERROR") {
    // ネットワークエラー - 後で再試行
    console.log("Network error, will retry later");
  } else {
    throw error;
  }
}
```

### ディスク容量不足

```typescript
import { statSync } from "fs";

// ローカルファイルのサイズを確認
const stats = statSync(dbPath);
const sizeInMB = stats.size / (1024 * 1024);

if (sizeInMB > 100) {
  console.warn(`Database size: ${sizeInMB}MB - consider optimization`);
}
```

## 次のステップ

デプロイ環境別のEmbedded Replicas設定ガイド：

- [Flyでの使用](/docs/services/turso/docs/features/embedded-replicas/with-fly)
- [Renderでの使用](/docs/services/turso/docs/features/embedded-replicas/with-render)
- [Koyebでの使用](/docs/services/turso/docs/features/embedded-replicas/with-koyeb)
- [Railwayでの使用](/docs/services/turso/docs/features/embedded-replicas/with-railway)
- [Akamaiでの使用](/docs/services/turso/docs/features/embedded-replicas/with-akamai)

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Embedded Replicas公式ドキュメント](https://docs.turso.tech/features/embedded-replicas)
- [libSQL Documentation](https://docs.turso.tech/libsql)
- [SDK入門](/docs/services/turso/docs/sdk/introduction)
