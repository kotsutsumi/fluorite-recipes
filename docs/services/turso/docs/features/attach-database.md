# Turso - Attach Database（データベースアタッチ）

SQLiteの`ATTACH DATABASE`機能を使用して、複数のデータベースを横断したクエリを実行する方法を説明します。

## 概要

Attach Database機能により、複数の独立したTursoデータベースを同一のSQLコンテキスト内で操作できます。これにより、データベース間でのJOINやデータコピーが可能になります。

## 主な特徴

```typescript
interface AttachDatabase {
  capabilities: {
    crossDBQueries: "複数DB間でのJOIN";
    dataMigration: "DBRaw間のデータ移動";
    dataAggregation: "複数DBからのデータ集約";
    multiSchema: "異なるスキーマの同時使用";
  };

  limitations: {
    localOnly: "ローカルDBまたはEmbedded Replicasのみ";
    remote: "リモートTurso DBへの直接アタッチは不可";
    workaround: "Embedded Replicasを使用";
  };
}
```

## 基本的な使い方

### ローカルSQLiteファイルのアタッチ

```sql
-- データベースをアタッチ
ATTACH DATABASE 'path/to/second.db' AS secondary;

-- アタッチしたデータベースのテーブルにアクセス
SELECT * FROM secondary.users;

-- メインデータベースと結合
SELECT
  main.orders.id,
  main.orders.total,
  secondary.users.name
FROM main.orders
JOIN secondary.users ON main.orders.user_id = secondary.users.id;

-- デタッチ
DETACH DATABASE secondary;
```

### TypeScriptでの使用

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:main.db",
});

async function attachAndQuery() {
  // データベースをアタッチ
  await client.execute("ATTACH DATABASE 'secondary.db' AS secondary");

  // クロスデータベースクエリ
  const result = await client.execute(`
    SELECT
      main.products.id,
      main.products.name,
      secondary.inventory.stock
    FROM main.products
    JOIN secondary.inventory ON main.products.id = secondary.inventory.product_id
  `);

  console.log(result.rows);

  // デタッチ
  await client.execute("DETACH DATABASE secondary");
}
```

## Embedded Replicasでの使用

### 複数のTursoデータベースを使用

```typescript
import { createClient } from "@libsql/client";
import path from "path";

// 主データベース（Embedded Replica）
const mainClient = createClient({
  url: "file:/tmp/main.db",
  syncUrl: process.env.MAIN_DB_URL,
  authToken: process.env.MAIN_AUTH_TOKEN,
});

// セカンダリデータベース（Embedded Replica）
const secondaryClient = createClient({
  url: "file:/tmp/secondary.db",
  syncUrl: process.env.SECONDARY_DB_URL,
  authToken: process.env.SECONDARY_AUTH_TOKEN,
});

async function initializeAndSync() {
  // 両方のデータベースを同期
  await mainClient.sync();
  await secondaryClient.sync();

  console.log("Databases synchronized");
}

async function crossDatabaseQuery() {
  // 初期同期
  await initializeAndSync();

  // セカンダリデータベースをアタッチ
  await mainClient.execute(
    "ATTACH DATABASE '/tmp/secondary.db' AS secondary"
  );

  // クロスデータベースクエリ
  const result = await mainClient.execute(`
    SELECT
      u.name,
      u.email,
      o.total,
      o.created_at
    FROM main.users u
    JOIN secondary.orders o ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT 10
  `);

  console.log("Recent orders with user info:", result.rows);

  // デタッチ
  await mainClient.execute("DETACH DATABASE secondary");
}
```

## 実践的なユースケース

### 1. データ移行

```typescript
async function migrateData() {
  // ソースとターゲットを同期
  await sourceClient.sync();
  await targetClient.sync();

  // ターゲットをアタッチ
  await sourceClient.execute("ATTACH DATABASE '/tmp/target.db' AS target");

  // データをコピー
  await sourceClient.execute(`
    INSERT INTO target.users (id, name, email, created_at)
    SELECT id, name, email, created_at
    FROM main.users
    WHERE created_at >= date('now', '-30 days')
  `);

  console.log("Data migration completed");

  // 変更を同期
  await targetClient.sync();

  // デタッチ
  await sourceClient.execute("DETACH DATABASE target");
}
```

### 2. マルチテナントデータ集約

```typescript
// 複数のテナントデータベースからデータを集約
async function aggregateTenantsData(tenantPaths: string[]) {
  const mainClient = createClient({ url: "file:/tmp/aggregate.db" });

  // 集計テーブルを作成
  await mainClient.execute(`
    CREATE TABLE IF NOT EXISTS tenant_stats (
      tenant_id TEXT,
      user_count INTEGER,
      order_count INTEGER,
      total_revenue REAL
    )
  `);

  // 各テナントDBをアタッチして集計
  for (let i = 0; i < tenantPaths.length; i++) {
    const aliasName = `tenant${i}`;

    // アタッチ
    await mainClient.execute(
      `ATTACH DATABASE '${tenantPaths[i]}' AS ${aliasName}`
    );

    // 統計を集計
    await mainClient.execute(`
      INSERT INTO tenant_stats (tenant_id, user_count, order_count, total_revenue)
      SELECT
        '${aliasName}' as tenant_id,
        (SELECT COUNT(*) FROM ${aliasName}.users) as user_count,
        (SELECT COUNT(*) FROM ${aliasName}.orders) as order_count,
        (SELECT COALESCE(SUM(total), 0) FROM ${aliasName}.orders) as total_revenue
    `);

    // デタッチ
    await mainClient.execute(`DETACH DATABASE ${aliasName}`);
  }

  // 集計結果を取得
  const stats = await mainClient.execute("SELECT * FROM tenant_stats");
  return stats.rows;
}

// 使用例
const tenantStats = await aggregateTenantsData([
  "/tmp/tenant1.db",
  "/tmp/tenant2.db",
  "/tmp/tenant3.db",
]);

console.table(tenantStats);
```

### 3. レポート生成

```typescript
// 複数のデータソースからレポートを生成
async function generateCrossSystemReport() {
  const reportClient = createClient({ url: "file:/tmp/report.db" });

  // 販売データベース
  await reportClient.execute("ATTACH DATABASE '/tmp/sales.db' AS sales");

  // 在庫データベース
  await reportClient.execute("ATTACH DATABASE '/tmp/inventory.db' AS inventory");

  // 顧客データベース
  await reportClient.execute("ATTACH DATABASE '/tmp/customers.db' AS customers");

  // クロスシステムレポート
  const report = await reportClient.execute(`
    SELECT
      p.id,
      p.name,
      i.stock as current_stock,
      COUNT(o.id) as orders_count,
      SUM(o.quantity) as total_sold,
      AVG(o.price) as avg_price
    FROM inventory.products p
    LEFT JOIN sales.orders o ON p.id = o.product_id
    LEFT JOIN inventory.stock i ON p.id = i.product_id
    WHERE o.created_at >= date('now', '-30 days')
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 20
  `);

  // デタッチ
  await reportClient.execute("DETACH DATABASE sales");
  await reportClient.execute("DETACH DATABASE inventory");
  await reportClient.execute("DETACH DATABASE customers");

  return report.rows;
}
```

### 4. データバックアップ

```typescript
async function backupDatabase(sourceDb: string, backupDb: string) {
  const client = createClient({ url: `file:${sourceDb}` });

  // バックアップDBをアタッチ
  await client.execute(`ATTACH DATABASE '${backupDb}' AS backup`);

  // 全テーブルのリストを取得
  const tables = await client.execute(`
    SELECT name FROM main.sqlite_master
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `);

  // 各テーブルをコピー
  for (const table of tables.rows) {
    const tableName = table.name;

    // テーブル構造をコピー
    const createTable = await client.execute(`
      SELECT sql FROM main.sqlite_master
      WHERE type='table' AND name='${tableName}'
    `);

    await client.execute(createTable.rows[0].sql.replace(/CREATE TABLE/, "CREATE TABLE backup."));

    // データをコピー
    await client.execute(`
      INSERT INTO backup.${tableName}
      SELECT * FROM main.${tableName}
    `);

    console.log(`Backed up table: ${tableName}`);
  }

  // デタッチ
  await client.execute("DETACH DATABASE backup");
  console.log("Backup completed");
}
```

## パフォーマンス考慮事項

### インデックスの使用

```sql
-- アタッチしたデータベースでもインデックスは有効
ATTACH DATABASE 'secondary.db' AS secondary;

-- インデックスがあれば効率的
SELECT * FROM secondary.users WHERE email = 'user@example.com';

-- JOIN時もインデックスが使用される
SELECT *
FROM main.orders o
JOIN secondary.users u ON o.user_id = u.id
WHERE u.email = 'user@example.com';
```

### トランザクション

```typescript
async function transactionAcrossDatabases() {
  await client.execute("ATTACH DATABASE 'secondary.db' AS secondary");

  // トランザクション開始
  await client.execute("BEGIN TRANSACTION");

  try {
    // 複数のデータベースにまたがる操作
    await client.execute(`
      INSERT INTO main.orders (user_id, total)
      VALUES (1, 100.00)
    `);

    await client.execute(`
      UPDATE secondary.users
      SET last_order = CURRENT_TIMESTAMP
      WHERE id = 1
    `);

    // コミット
    await client.execute("COMMIT");
  } catch (error) {
    // ロールバック
    await client.execute("ROLLBACK");
    throw error;
  } finally {
    await client.execute("DETACH DATABASE secondary");
  }
}
```

## ベストプラクティス

### 1. エラーハンドリング

```typescript
async function safeAttachQuery<T>(
  mainDb: any,
  attachDbPath: string,
  aliasName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  try {
    // アタッチ
    await mainDb.execute(`ATTACH DATABASE '${attachDbPath}' AS ${aliasName}`);

    // クエリ実行
    const result = await queryFn();

    return result;
  } catch (error) {
    console.error("Query failed:", error);
    throw error;
  } finally {
    // 必ずデタッチ
    try {
      await mainDb.execute(`DETACH DATABASE ${aliasName}`);
    } catch (detachError) {
      console.error("Failed to detach database:", detachError);
    }
  }
}

// 使用例
const result = await safeAttachQuery(
  mainClient,
  "/tmp/secondary.db",
  "secondary",
  async () => {
    return await mainClient.execute(`
      SELECT * FROM main.users
      JOIN secondary.orders ON main.users.id = secondary.orders.user_id
    `);
  }
);
```

### 2. パスの管理

```typescript
import path from "path";

class DatabasePathManager {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  getPath(dbName: string): string {
    return path.join(this.basePath, `${dbName}.db`);
  }

  getAbsolutePath(dbName: string): string {
    return path.resolve(this.getPath(dbName));
  }
}

const pathManager = new DatabasePathManager("/tmp/databases");

// 一貫したパス管理
const mainPath = pathManager.getAbsolutePath("main");
const secondaryPath = pathManager.getAbsolutePath("secondary");
```

### 3. 接続の再利用

```typescript
class AttachDatabaseManager {
  private attachedDbs = new Set<string>();

  constructor(private client: any) {}

  async attach(dbPath: string, aliasName: string) {
    if (this.attachedDbs.has(aliasName)) {
      console.log(`Database ${aliasName} already attached`);
      return;
    }

    await this.client.execute(`ATTACH DATABASE '${dbPath}' AS ${aliasName}`);
    this.attachedDbs.add(aliasName);
  }

  async detach(aliasName: string) {
    if (!this.attachedDbs.has(aliasName)) {
      console.log(`Database ${aliasName} not attached`);
      return;
    }

    await this.client.execute(`DETACH DATABASE ${aliasName}`);
    this.attachedDbs.delete(aliasName);
  }

  async detachAll() {
    for (const aliasName of this.attachedDbs) {
      await this.detach(aliasName);
    }
  }

  isAttached(aliasName: string): boolean {
    return this.attachedDbs.has(aliasName);
  }
}
```

## 制限事項

### リモートデータベース

```typescript
interface Limitations {
  remote: {
    issue: "リモートTurso DBへの直接アタッチは不可";
    reason: "SQLiteのATTACHはローカルファイルのみサポート";
    solution: "Embedded Replicasを使用してローカルコピーを作成";
  };

  workaround: {
    step1: "Embedded Replicasでローカルコピーを作成";
    step2: "ローカルファイルをアタッチ";
    step3: "必要に応じて同期";
  };
}
```

### パフォーマンス

- 大量のアタッチは避ける（通常2-3個まで）
- アタッチしたままにせず、使用後はデタッチ
- 複雑なクロスDBクエリはパフォーマンスに影響

## トラブルシューティング

### ファイルが見つからない

```typescript
import { access } from "fs/promises";
import { constants } from "fs";

async function verifyDatabaseExists(dbPath: string) {
  try {
    await access(dbPath, constants.R_OK);
    return true;
  } catch {
    console.error(`Database not found: ${dbPath}`);
    return false;
  }
}

// 使用前に確認
if (await verifyDatabaseExists(secondaryDbPath)) {
  await client.execute(`ATTACH DATABASE '${secondaryDbPath}' AS secondary`);
}
```

### ロックエラー

```typescript
// データベースがロックされている場合のリトライ
async function attachWithRetry(
  client: any,
  dbPath: string,
  aliasName: string,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.execute(`ATTACH DATABASE '${dbPath}' AS ${aliasName}`);
      return;
    } catch (error) {
      if (error.message.includes("database is locked") && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}
```

## 関連リンク

- [SQLite ATTACH Documentation](https://www.sqlite.org/lang_attach.html)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [Multi-DB Schemas](/docs/services/turso/docs/features/multi-db-schemas)
- [Turso公式サイト](https://turso.tech/)
