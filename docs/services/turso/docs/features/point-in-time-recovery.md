# Turso - Point-in-Time Recovery（ポイントインタイムリカバリ）

Tursoのポイントインタイムリカバリ機能を使用して、過去の特定時点の状態にデータベースを復元する方法を説明します。

## 概要

Point-in-Time Recovery（PITR）は、データベースを過去の任意の時点の状態に復元できる機能です。誤操作やデータ破損からの復旧、または特定時点でのデータ分析に使用できます。

## 主な特徴

```typescript
interface PointInTimeRecovery {
  capabilities: {
    timeTravel: "任意の過去時点への復元";
    granularity: "秒単位の精度";
    nonDestructive: "元のデータベースは保持";
    instantRecovery: "高速な復元プロセス";
  };

  useCases: {
    errorRecovery: "誤操作からの復旧";
    dataAudit: "過去データの監査";
    testing: "特定時点でのテスト";
    analysis: "履歴データの分析";
  };
}
```

## 基本的な使い方

### 特定時点への復元

```bash
# 現在のデータベース状態を確認
turso db show production-db

# 特定時点のブランチを作成（復元）
turso db create restored-db \
  --from-db production-db \
  --timestamp "2024-01-15T10:30:00Z"

# 復元されたデータベースの確認
turso db show restored-db
```

### タイムスタンプ形式

```bash
# ISO 8601形式を使用
# 完全な形式
--timestamp "2024-01-15T10:30:00Z"

# 日付のみ（その日の開始時刻）
--timestamp "2024-01-15"

# 時刻まで指定
--timestamp "2024-01-15T14:30:00Z"
```

## 実践的なユースケース

### 1. 誤削除からの復旧

```typescript
// 誤って重要なデータを削除してしまった場合

// シナリオ: 誤ってユーザーデータを削除
// DELETE FROM users WHERE created_at < '2024-01-01';  -- 間違い！

// ステップ1: 削除前の時刻を確認
// 例: 2024-01-20 15:45:00 に削除操作を実行

// ステップ2: CLIで削除前の状態に復元
```

```bash
# 削除の5分前の状態に復元
turso db create users-recovery \
  --from-db production-db \
  --timestamp "2024-01-20T15:40:00Z"

# 復元されたDBから必要なデータを取得
turso db shell users-recovery

# 削除されたユーザーを確認
SELECT * FROM users WHERE created_at < '2024-01-01';
```

```typescript
// ステップ3: データを本番に戻す
import { createClient } from "@libsql/client";

const recoveryClient = createClient({
  url: process.env.RECOVERY_DB_URL!,
  authToken: process.env.RECOVERY_AUTH_TOKEN!,
});

const productionClient = createClient({
  url: process.env.PRODUCTION_DB_URL!,
  authToken: process.env.PRODUCTION_AUTH_TOKEN!,
});

async function recoverDeletedUsers() {
  // 復元DBから削除されたユーザーを取得
  const result = await recoveryClient.execute(
    "SELECT * FROM users WHERE created_at < '2024-01-01'"
  );

  console.log(`Found ${result.rows.length} deleted users`);

  // 本番DBに戻す
  for (const user of result.rows) {
    await productionClient.execute({
      sql: `
        INSERT INTO users (id, name, email, created_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `,
      args: [user.id, user.name, user.email, user.created_at],
    });
  }

  console.log("Recovery completed");
}

recoverDeletedUsers();
```

### 2. 不正なマイグレーションからの復旧

```bash
# シナリオ: マイグレーションで予期しない変更が発生

# マイグレーション実行前の時刻: 2024-01-20 16:00:00
# マイグレーション実行後: データの整合性に問題発見

# マイグレーション前の状態に復元
turso db create pre-migration \
  --from-db production-db \
  --timestamp "2024-01-20T15:59:00Z"

# 復元されたDBの状態を確認
turso db shell pre-migration
```

```typescript
// スクリプトで検証
async function validateMigrationRollback() {
  const preMigrationClient = createClient({
    url: process.env.PRE_MIGRATION_DB_URL!,
    authToken: process.env.PRE_MIGRATION_AUTH_TOKEN!,
  });

  // テーブル構造を確認
  const tables = await preMigrationClient.execute(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );

  console.log("Tables in pre-migration state:", tables.rows);

  // データ整合性を確認
  const userCount = await preMigrationClient.execute(
    "SELECT COUNT(*) as count FROM users"
  );

  console.log("User count:", userCount.rows[0].count);
}
```

### 3. データ監査とコンプライアンス

```typescript
// 特定時点のデータを監査
async function auditDataAtTime(timestamp: string) {
  // 監査対象時点のブランチを作成
  // turso db create audit-20240115 --from-db production-db --timestamp "2024-01-15T00:00:00Z"

  const auditClient = createClient({
    url: process.env.AUDIT_DB_URL!,
    authToken: process.env.AUDIT_AUTH_TOKEN!,
  });

  // 監査クエリ実行
  const financialRecords = await auditClient.execute(`
    SELECT
      date,
      SUM(amount) as total_revenue,
      COUNT(*) as transaction_count
    FROM transactions
    WHERE date = ?
    GROUP BY date
  `, [timestamp.split('T')[0]]);

  console.log("Financial records for", timestamp);
  console.table(financialRecords.rows);

  // レポート生成
  return {
    date: timestamp,
    totalRevenue: financialRecords.rows[0]?.total_revenue || 0,
    transactionCount: financialRecords.rows[0]?.transaction_count || 0,
  };
}

// 使用例
auditDataAtTime("2024-01-15T00:00:00Z");
```

### 4. A/Bテストとデータ分析

```typescript
// 複数時点のデータを比較
async function compareDataAcrossTime() {
  // 1週間前のデータ
  // turso db create snapshot-week-ago --from-db production-db --timestamp "2024-01-13T00:00:00Z"

  // 1ヶ月前のデータ
  // turso db create snapshot-month-ago --from-db production-db --timestamp "2023-12-20T00:00:00Z"

  const weekAgoClient = createClient({
    url: process.env.WEEK_AGO_DB_URL!,
    authToken: process.env.WEEK_AGO_AUTH_TOKEN!,
  });

  const monthAgoClient = createClient({
    url: process.env.MONTH_AGO_DB_URL!,
    authToken: process.env.MONTH_AGO_AUTH_TOKEN!,
  });

  // 週次成長分析
  const weekAgoUsers = await weekAgoClient.execute(
    "SELECT COUNT(*) as count FROM users"
  );

  const monthAgoUsers = await monthAgoClient.execute(
    "SELECT COUNT(*) as count FROM users"
  );

  const weeklyGrowth =
    weekAgoUsers.rows[0].count - monthAgoUsers.rows[0].count;

  console.log({
    monthAgo: monthAgoUsers.rows[0].count,
    weekAgo: weekAgoUsers.rows[0].count,
    weeklyGrowth,
    growthRate: (weeklyGrowth / monthAgoUsers.rows[0].count) * 100,
  });
}
```

## 復元ワークフロー

### 完全な復元プロセス

```bash
#!/bin/bash
# recovery-workflow.sh

# 設定
PRODUCTION_DB="production-db"
RECOVERY_TIMESTAMP="2024-01-20T15:30:00Z"
RECOVERY_DB="recovery-$(date +%Y%m%d-%H%M%S)"

echo "Starting recovery process..."
echo "Production DB: $PRODUCTION_DB"
echo "Recovery timestamp: $RECOVERY_TIMESTAMP"
echo "Recovery DB name: $RECOVERY_DB"

# 1. 復元ブランチを作成
echo "Creating recovery branch..."
turso db create $RECOVERY_DB \
  --from-db $PRODUCTION_DB \
  --timestamp "$RECOVERY_TIMESTAMP"

# 2. 復元DBの接続情報を取得
echo "Getting connection details..."
RECOVERY_URL=$(turso db show $RECOVERY_DB --url)
RECOVERY_TOKEN=$(turso db tokens create $RECOVERY_DB)

echo "Recovery DB URL: $RECOVERY_URL"

# 3. データ検証
echo "Validating recovered data..."
turso db shell $RECOVERY_DB "SELECT COUNT(*) FROM users;"

# 4. 必要に応じてデータをエクスポート
echo "Exporting data..."
turso db shell $RECOVERY_DB .dump > recovery-dump.sql

echo "Recovery process completed!"
echo "Review the data and decide next steps:"
echo "1. Keep recovery DB for analysis"
echo "2. Migrate data back to production"
echo "3. Delete recovery DB: turso db destroy $RECOVERY_DB"
```

### TypeScriptでの自動復元

```typescript
// scripts/auto-recovery.ts
import { createClient } from "@libsql/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RecoveryOptions {
  productionDb: string;
  timestamp: string;
  validateData?: boolean;
}

async function performRecovery(options: RecoveryOptions) {
  const recoveryDbName = `recovery-${Date.now()}`;

  console.log("Starting recovery process...");
  console.log(`Target timestamp: ${options.timestamp}`);

  // 1. 復元ブランチを作成
  const createCmd = `turso db create ${recoveryDbName} --from-db ${options.productionDb} --timestamp "${options.timestamp}"`;

  try {
    await execAsync(createCmd);
    console.log(`Recovery DB created: ${recoveryDbName}`);
  } catch (error) {
    console.error("Failed to create recovery DB:", error);
    throw error;
  }

  // 2. 接続情報を取得
  const { stdout: url } = await execAsync(
    `turso db show ${recoveryDbName} --url`
  );

  const { stdout: token } = await execAsync(
    `turso db tokens create ${recoveryDbName}`
  );

  const recoveryClient = createClient({
    url: url.trim(),
    authToken: token.trim(),
  });

  // 3. データ検証（オプション）
  if (options.validateData) {
    console.log("Validating recovered data...");

    const tables = await recoveryClient.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );

    console.log("Tables found:", tables.rows.length);

    for (const table of tables.rows) {
      const count = await recoveryClient.execute(
        `SELECT COUNT(*) as count FROM ${table.name}`
      );
      console.log(`${table.name}: ${count.rows[0].count} rows`);
    }
  }

  return {
    dbName: recoveryDbName,
    url: url.trim(),
    token: token.trim(),
    client: recoveryClient,
  };
}

// 使用例
async function main() {
  const recovery = await performRecovery({
    productionDb: "production-db",
    timestamp: "2024-01-20T15:30:00Z",
    validateData: true,
  });

  console.log("\nRecovery completed!");
  console.log(`DB Name: ${recovery.dbName}`);
  console.log(`URL: ${recovery.url}`);

  // 必要な処理を実行...
}

main();
```

## ベストプラクティス

### 1. 定期的なスナップショット

```typescript
// 定期的にスナップショットブランチを作成
interface SnapshotStrategy {
  daily: {
    retention: "7日間";
    time: "毎日午前2時";
    naming: "daily-YYYYMMDD";
  };

  weekly: {
    retention: "4週間";
    time: "毎週日曜日";
    naming: "weekly-YYYYMMDD";
  };

  monthly: {
    retention: "12ヶ月";
    time: "毎月1日";
    naming: "monthly-YYYYMM";
  };
}
```

```bash
# Cronジョブ例
# 毎日午前2時にスナップショット作成
0 2 * * * /usr/local/bin/create-daily-snapshot.sh
```

### 2. 復元テスト

```typescript
// 定期的に復元プロセスをテスト
async function testRecoveryProcess() {
  console.log("Testing recovery process...");

  // 1. 現在時刻の1時間前に復元
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const timestamp = oneHourAgo.toISOString();

  // 2. 復元実行
  const recovery = await performRecovery({
    productionDb: "production-db",
    timestamp,
    validateData: true,
  });

  // 3. データ整合性チェック
  const isValid = await validateRecoveredData(recovery.client);

  // 4. クリーンアップ
  await execAsync(`turso db destroy ${recovery.dbName} --yes`);

  console.log(`Recovery test ${isValid ? "PASSED" : "FAILED"}`);
}

// 毎週実行
setInterval(testRecoveryProcess, 7 * 24 * 60 * 60 * 1000);
```

### 3. ドキュメント化

```typescript
// 復元履歴を記録
interface RecoveryLog {
  timestamp: string;
  reason: string;
  targetTime: string;
  performedBy: string;
  result: "success" | "failed";
  notes?: string;
}

const recoveryHistory: RecoveryLog[] = [];

function logRecovery(log: RecoveryLog) {
  recoveryHistory.push({
    ...log,
    timestamp: new Date().toISOString(),
  });

  // ファイルに保存
  fs.writeFileSync(
    "recovery-history.json",
    JSON.stringify(recoveryHistory, null, 2)
  );
}
```

## 制限事項

### 保持期間

```typescript
interface RetentionLimits {
  starter: {
    retention: "24時間";
    note: "24時間以内の任意の時点に復元可能";
  };

  pro: {
    retention: "7日間";
    note: "7日以内の任意の時点に復元可能";
  };

  enterprise: {
    retention: "カスタム";
    note: "要件に応じた保持期間を設定可能";
  };
}
```

### パフォーマンス

- 大規模データベースでは復元に時間がかかる場合がある
- 復元は新しいブランチとして作成される
- 元のデータベースは影響を受けない

## トラブルシューティング

### タイムスタンプエラー

```bash
# エラー: Invalid timestamp format
# 解決: ISO 8601形式を使用
turso db create restored --from-db prod --timestamp "2024-01-20T15:30:00Z"

# エラー: Timestamp too old
# 解決: プランの保持期間内のタイムスタンプを指定
turso db show production-db  # 作成日時を確認
```

### データ検証

```typescript
async function validateRestoredData(client: any) {
  // テーブル数を確認
  const tables = await client.execute(
    "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
  );

  console.log(`Tables: ${tables.rows[0].count}`);

  // 主要テーブルのレコード数を確認
  const criticalTables = ["users", "orders", "products"];

  for (const table of criticalTables) {
    try {
      const result = await client.execute(
        `SELECT COUNT(*) as count FROM ${table}`
      );
      console.log(`${table}: ${result.rows[0].count} rows`);
    } catch (error) {
      console.error(`Table ${table} not found or error:`, error);
    }
  }
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Point-in-Time Recovery公式ドキュメント](https://docs.turso.tech/features/point-in-time-recovery)
- [Database Branching](/docs/services/turso/docs/features/branching)
- [Turso CLI Reference](https://docs.turso.tech/cli)
