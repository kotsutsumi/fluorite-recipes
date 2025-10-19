# Turso - Database Branching（データベースブランチング）

Tursoのデータベースブランチング機能を使用して、本番データのコピーで安全に開発・テストを行う方法を説明します。

## 概要

Database Branchingは、既存のデータベースから新しいブランチを作成し、本番データを使用した開発・テスト環境を素早く構築できる機能です。Gitのブランチと同様の概念で、データベースのコピーを瞬時に作成できます。

## 主な特徴

```typescript
interface DatabaseBranching {
  features: {
    instantCopy: "既存DBから瞬時にブランチを作成";
    isolatedEnvironment: "本番環境から独立したテスト環境";
    realData: "本番データを使用した開発・テスト";
    costEffective: "効率的なストレージ共有";
  };

  useCases: {
    development: "開発環境の構築";
    testing: "本番データでのテスト";
    staging: "ステージング環境";
    experimentation: "新機能の実験";
  };
}
```

## ブランチの作成

### CLIでのブランチ作成

```bash
# 本番データベースからブランチを作成
turso db create dev-branch --from-db production-db

# タイムスタンプを指定してブランチを作成
turso db create staging-branch --from-db production-db --timestamp "2024-01-15T10:00:00Z"

# 現在のデータベースを確認
turso db list
```

### ブランチの詳細確認

```bash
# ブランチ情報を表示
turso db show dev-branch

# 出力例:
# Name:           dev-branch
# URL:            libsql://dev-branch-[org].turso.io
# Locations:      nrt
# Size:           1.2 MB
# Parent:         production-db
# Created:        2024-01-20 10:30:00
```

## ブランチの使用

### 開発環境での接続

```typescript
// dev.config.ts
import { createClient } from "@libsql/client";

export const devClient = createClient({
  url: process.env.DEV_DATABASE_URL!, // ブランチのURL
  authToken: process.env.DEV_AUTH_TOKEN!,
});

// 開発用データの変更
async function testFeature() {
  // ブランチで自由にデータを変更可能
  await devClient.execute(`
    INSERT INTO users (name, email)
    VALUES ('Test User', 'test@example.com')
  `);

  const result = await devClient.execute("SELECT * FROM users");
  console.log(result.rows);
}
```

### 環境別の設定

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";

const config = {
  production: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  staging: {
    url: process.env.STAGING_DATABASE_URL!,
    authToken: process.env.STAGING_AUTH_TOKEN!,
  },
  development: {
    url: process.env.DEV_DATABASE_URL!,
    authToken: process.env.DEV_AUTH_TOKEN!,
  },
};

const env = process.env.NODE_ENV || "development";

export const client = createClient(config[env]);
```

## ユースケース

### 1. マイグレーションのテスト

```typescript
// migrations/test-migration.ts
import { devClient } from "./dev.config";

async function testMigration() {
  console.log("Testing migration on dev branch...");

  try {
    // マイグレーションを実行
    await devClient.execute(`
      ALTER TABLE users ADD COLUMN phone_number TEXT
    `);

    // データの整合性を確認
    const result = await devClient.execute(`
      SELECT * FROM users LIMIT 5
    `);

    console.log("Migration successful:", result.rows);

    // 本番で問題ないことを確認してから本番に適用
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

testMigration();
```

### 2. 新機能のテスト

```typescript
// features/new-feature.test.ts
import { devClient } from "../dev.config";

describe("New Feature Tests", () => {
  beforeAll(async () => {
    // 開発ブランチでテストデータをセットアップ
    await devClient.execute(`
      INSERT INTO products (name, price, category)
      VALUES ('Test Product', 99.99, 'Electronics')
    `);
  });

  it("should calculate discount correctly", async () => {
    const result = await devClient.execute(`
      SELECT price * 0.8 as discounted_price
      FROM products
      WHERE name = 'Test Product'
    `);

    expect(result.rows[0].discounted_price).toBe(79.992);
  });

  afterAll(async () => {
    // クリーンアップ（オプション）
    await devClient.execute(`
      DELETE FROM products WHERE name = 'Test Product'
    `);
  });
});
```

### 3. パフォーマンステスト

```typescript
// performance/load-test.ts
import { devClient } from "../dev.config";

async function performanceTest() {
  console.log("Running performance tests on dev branch...");

  const queries = [
    "SELECT * FROM users WHERE created_at > date('now', '-30 days')",
    "SELECT category, COUNT(*) FROM products GROUP BY category",
    "SELECT * FROM orders JOIN users ON orders.user_id = users.id LIMIT 1000",
  ];

  for (const query of queries) {
    const start = Date.now();

    await devClient.execute(query);

    const duration = Date.now() - start;
    console.log(`Query: ${query.substring(0, 50)}...`);
    console.log(`Duration: ${duration}ms\n`);
  }
}

performanceTest();
```

### 4. データ分析・探索

```typescript
// analytics/explore-data.ts
import { devClient } from "../dev.config";

async function exploreData() {
  // 本番データで安全にクエリを実験
  const analyses = [
    {
      name: "User Growth",
      query: `
        SELECT
          DATE(created_at) as date,
          COUNT(*) as new_users
        FROM users
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
    },
    {
      name: "Top Products",
      query: `
        SELECT
          p.name,
          COUNT(o.id) as order_count,
          SUM(o.total) as revenue
        FROM products p
        JOIN orders o ON p.id = o.product_id
        GROUP BY p.id
        ORDER BY revenue DESC
        LIMIT 10
      `,
    },
  ];

  for (const analysis of analyses) {
    console.log(`\n${analysis.name}:`);
    const result = await devClient.execute(analysis.query);
    console.table(result.rows);
  }
}

exploreData();
```

## スキーマ変更のワークフロー

### ステップ1: ブランチ作成

```bash
# 本番DBからブランチを作成
turso db create schema-test --from-db production-db
```

### ステップ2: ブランチでテスト

```typescript
// test-schema-change.ts
import { createClient } from "@libsql/client";

const branchClient = createClient({
  url: process.env.SCHEMA_TEST_DB_URL!,
  authToken: process.env.SCHEMA_TEST_AUTH_TOKEN!,
});

async function testSchemaChange() {
  // 1. スキーマ変更を適用
  await branchClient.execute(`
    CREATE TABLE user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      theme TEXT DEFAULT 'light',
      language TEXT DEFAULT 'en',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 2. 既存データとの整合性を確認
  const users = await branchClient.execute("SELECT id FROM users LIMIT 10");

  for (const user of users.rows) {
    await branchClient.execute({
      sql: `
        INSERT INTO user_preferences (user_id, theme)
        VALUES (?, ?)
      `,
      args: [user.id, "dark"],
    });
  }

  // 3. クエリのテスト
  const result = await branchClient.execute(`
    SELECT u.name, up.theme, up.language
    FROM users u
    JOIN user_preferences up ON u.id = up.user_id
    LIMIT 5
  `);

  console.log("Schema change test results:", result.rows);
}

testSchemaChange();
```

### ステップ3: 本番適用

```bash
# テストが成功したら本番に適用
turso db shell production-db

# スキーマ変更を実行
CREATE TABLE user_preferences (...);
```

## ブランチの管理

### ブランチ一覧

```bash
# すべてのデータベースを表示
turso db list

# 出力例:
# NAME              TYPE      LOCATION
# production-db     primary   nrt
# dev-branch        branch    nrt
# staging-branch    branch    nrt
# schema-test       branch    nrt
```

### ブランチの削除

```bash
# ブランチを削除
turso db destroy dev-branch

# 確認プロンプトをスキップ
turso db destroy schema-test --yes
```

### ブランチの情報確認

```bash
# ブランチの詳細情報
turso db show staging-branch

# 接続情報の取得
turso db show staging-branch --url
turso db tokens create staging-branch
```

## 環境変数の管理

### .env.development

```bash
# 開発環境（ブランチ）
DEV_DATABASE_URL=libsql://dev-branch-[org].turso.io
DEV_AUTH_TOKEN=dev-branch-token
```

### .env.staging

```bash
# ステージング環境（ブランチ）
STAGING_DATABASE_URL=libsql://staging-branch-[org].turso.io
STAGING_AUTH_TOKEN=staging-branch-token
```

### .env.production

```bash
# 本番環境
TURSO_DATABASE_URL=libsql://production-db-[org].turso.io
TURSO_AUTH_TOKEN=production-token
```

## CI/CDとの統合

### GitHub Actions例

```yaml
# .github/workflows/test.yml
name: Test with Database Branch

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Turso CLI
        run: |
          curl -sSfL https://get.tur.so/install.sh | bash
          echo "$HOME/.turso/bin" >> $GITHUB_PATH

      - name: Create test branch
        env:
          TURSO_TOKEN: ${{ secrets.TURSO_TOKEN }}
        run: |
          turso auth token $TURSO_TOKEN
          turso db create test-${{ github.run_id }} --from-db production-db

      - name: Get branch credentials
        id: db-credentials
        run: |
          echo "url=$(turso db show test-${{ github.run_id }} --url)" >> $GITHUB_OUTPUT
          echo "token=$(turso db tokens create test-${{ github.run_id }})" >> $GITHUB_OUTPUT

      - name: Run tests
        env:
          DATABASE_URL: ${{ steps.db-credentials.outputs.url }}
          AUTH_TOKEN: ${{ steps.db-credentials.outputs.token }}
        run: |
          npm install
          npm test

      - name: Cleanup
        if: always()
        run: |
          turso db destroy test-${{ github.run_id }} --yes
```

## ベストプラクティス

### 1. 命名規則

```bash
# 環境ごとに明確な命名
my-app-production     # 本番
my-app-staging        # ステージング
my-app-dev-alice      # 開発者別
my-app-feature-auth   # 機能別
```

### 2. ブランチのライフサイクル

```typescript
// scripts/manage-branches.ts
const BRANCH_MAX_AGE_DAYS = 7;

async function cleanupOldBranches() {
  const branches = await listBranches();

  for (const branch of branches) {
    const age = Date.now() - new Date(branch.created_at).getTime();
    const ageInDays = age / (1000 * 60 * 60 * 24);

    if (ageInDays > BRANCH_MAX_AGE_DAYS) {
      console.log(`Deleting old branch: ${branch.name}`);
      await deleteBranch(branch.name);
    }
  }
}
```

### 3. ブランチの使い分け

```typescript
interface BranchStrategy {
  production: {
    purpose: "本番環境";
    updates: "マイグレーション、リリース";
  };

  staging: {
    purpose: "本番前の最終確認";
    updates: "本番デプロイ前のテスト";
  };

  development: {
    purpose: "開発・実験";
    updates: "頻繁な変更";
  };

  featureBranch: {
    purpose: "特定機能の開発";
    updates: "機能完成まで";
    cleanup: "マージ後に削除";
  };
}
```

## 制限事項

### ストレージ

- ブランチは親データベースのストレージを共有
- 変更分のみ追加のストレージを使用
- 効率的な差分ストレージ

### リージョン

- ブランチは親データベースと同じリージョンに作成される
- 異なるリージョンへのブランチ作成は不可

### 同期

- ブランチは作成時点のスナップショット
- 親データベースへの自動同期はなし
- 独立したデータベースとして動作

## トラブルシューティング

### ブランチ作成エラー

```bash
# エラー: Database not found
# 解決: データベース名を確認
turso db list

# エラー: Invalid timestamp
# 解決: 正しいISO 8601フォーマットを使用
turso db create branch --from-db parent --timestamp "2024-01-15T10:00:00Z"
```

### 接続エラー

```typescript
// ブランチURLとトークンを確認
const url = process.env.BRANCH_DATABASE_URL;
const token = process.env.BRANCH_AUTH_TOKEN;

console.log("Connecting to:", url);

try {
  const client = createClient({ url, authToken: token });
  await client.execute("SELECT 1");
  console.log("Connection successful");
} catch (error) {
  console.error("Connection failed:", error);
}
```

## 料金への影響

```typescript
interface BranchingCosts {
  storage: {
    shared: "親データベースとストレージを共有";
    additional: "変更分のみ課金";
    efficient: "コスト効率的";
  };

  rowsRead: {
    separate: "各ブランチで独立してカウント";
    development: "開発環境の使用量も計上";
  };

  rowsWritten: {
    separate: "各ブランチで独立してカウント";
    testing: "テスト時の書き込みも計上";
  };
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Database Branching公式ドキュメント](https://docs.turso.tech/features/branching)
- [Turso CLI Reference](https://docs.turso.tech/cli)
- [Point-in-Time Recovery](/docs/services/turso/docs/features/point-in-time-recovery)
