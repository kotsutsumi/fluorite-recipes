# Turso - Multi-DB Schemas（マルチデータベーススキーマ）

Tursoで複数のデータベーススキーマを使用し、データを論理的に分離する方法を説明します。

## 概要

Multi-DB Schemasは、単一のTursoアカウント内で複数の独立したデータベースを作成・管理できる機能です。各データベースは完全に分離されており、異なるスキーマ、データ、アクセス権限を持つことができます。

## 主な特徴

```typescript
interface MultiDBSchemas {
  capabilities: {
    isolation: "完全なデータ分離";
    scalability: "独立したスケーリング";
    security: "データベースごとのアクセス制御";
    flexibility: "異なるスキーマの共存";
  };

  useCases: {
    multiTenancy: "マルチテナントアプリケーション";
    environments: "開発・ステージング・本番環境";
    microservices: "マイクロサービスアーキテクチャ";
    dataSegmentation: "データの論理的分離";
  };
}
```

## 基本的な使い方

### 複数のデータベース作成

```bash
# 本番データベース
turso db create production-db

# ステージングデータベース
turso db create staging-db

# 開発データベース
turso db create development-db

# データベース一覧
turso db list
```

### 各データベースへの接続

```typescript
// lib/db-clients.ts
import { createClient } from "@libsql/client";

export const productionClient = createClient({
  url: process.env.PRODUCTION_DB_URL!,
  authToken: process.env.PRODUCTION_AUTH_TOKEN!,
});

export const stagingClient = createClient({
  url: process.env.STAGING_DB_URL!,
  authToken: process.env.STAGING_AUTH_TOKEN!,
});

export const developmentClient = createClient({
  url: process.env.DEV_DB_URL!,
  authToken: process.env.DEV_AUTH_TOKEN!,
});

// 環境に応じてクライアントを切り替え
export function getClient() {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return productionClient;
    case "staging":
      return stagingClient;
    default:
      return developmentClient;
  }
}
```

## ユースケース

### 1. マルチテナントアプリケーション

テナントごとに独立したデータベースを使用：

```typescript
// テナント管理
interface Tenant {
  id: string;
  name: string;
  dbUrl: string;
  dbToken: string;
}

class TenantManager {
  private tenantClients = new Map<string, any>();

  async getTenantClient(tenantId: string) {
    // キャッシュをチェック
    if (this.tenantClients.has(tenantId)) {
      return this.tenantClients.get(tenantId);
    }

    // テナント情報を取得
    const tenant = await this.getTenantInfo(tenantId);

    // クライアントを作成
    const client = createClient({
      url: tenant.dbUrl,
      authToken: tenant.dbToken,
    });

    // キャッシュに保存
    this.tenantClients.set(tenantId, client);

    return client;
  }

  private async getTenantInfo(tenantId: string): Promise<Tenant> {
    // メタデータデータベースからテナント情報を取得
    const result = await metadataClient.execute({
      sql: "SELECT * FROM tenants WHERE id = ?",
      args: [tenantId],
    });

    return result.rows[0] as Tenant;
  }
}

const tenantManager = new TenantManager();

// APIエンドポイント
app.get("/api/:tenantId/users", async (req, res) => {
  const { tenantId } = req.params;

  // テナント専用のDBクライアントを取得
  const client = await tenantManager.getTenantClient(tenantId);

  // テナントのデータのみにアクセス
  const result = await client.execute("SELECT * FROM users");

  res.json(result.rows);
});
```

### 2. 環境分離

開発・ステージング・本番環境を完全に分離：

```typescript
// config/database.ts
const dbConfig = {
  development: {
    url: process.env.DEV_DB_URL!,
    token: process.env.DEV_AUTH_TOKEN!,
    schema: "development",
  },
  staging: {
    url: process.env.STAGING_DB_URL!,
    token: process.env.STAGING_AUTH_TOKEN!,
    schema: "staging",
  },
  production: {
    url: process.env.PRODUCTION_DB_URL!,
    token: process.env.PRODUCTION_AUTH_TOKEN!,
    schema: "production",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
const config = dbConfig[currentEnv];

export const client = createClient({
  url: config.url,
  authToken: config.token,
});

// マイグレーション管理
export async function runMigrations() {
  console.log(`Running migrations for ${currentEnv} environment`);

  // 環境ごとに異なるマイグレーションを実行可能
  if (currentEnv === "development") {
    // 開発環境用のテストデータ投入
    await client.execute("INSERT INTO users (name) VALUES ('Test User')");
  }

  // 共通のマイグレーション
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
```

### 3. マイクロサービスアーキテクチャ

サービスごとに独立したデータベース：

```typescript
// services/user-service/db.ts
export const userServiceDB = createClient({
  url: process.env.USER_SERVICE_DB_URL!,
  authToken: process.env.USER_SERVICE_AUTH_TOKEN!,
});

// services/order-service/db.ts
export const orderServiceDB = createClient({
  url: process.env.ORDER_SERVICE_DB_URL!,
  authToken: process.env.ORDER_SERVICE_AUTH_TOKEN!,
});

// services/product-service/db.ts
export const productServiceDB = createClient({
  url: process.env.PRODUCT_SERVICE_DB_URL!,
  authToken: process.env.PRODUCT_SERVICE_AUTH_TOKEN!,
});

// 各サービスは独立してスケール可能
export class UserService {
  async getUser(id: number) {
    const result = await userServiceDB.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id],
    });
    return result.rows[0];
  }
}

export class OrderService {
  async getOrdersByUser(userId: number) {
    const result = await orderServiceDB.execute({
      sql: "SELECT * FROM orders WHERE user_id = ?",
      args: [userId],
    });
    return result.rows;
  }
}
```

### 4. データセグメンテーション

データタイプや地域ごとの分離：

```typescript
// 地域別データベース
const regionalDBs = {
  us: createClient({
    url: process.env.US_DB_URL!,
    authToken: process.env.US_AUTH_TOKEN!,
  }),
  eu: createClient({
    url: process.env.EU_DB_URL!,
    authToken: process.env.EU_AUTH_TOKEN!,
  }),
  asia: createClient({
    url: process.env.ASIA_DB_URL!,
    authToken: process.env.ASIA_AUTH_TOKEN!,
  }),
};

function getRegionalClient(region: "us" | "eu" | "asia") {
  return regionalDBs[region];
}

// GDPRコンプライアンス: EUユーザーのデータはEUに保存
async function createUser(userData: {
  name: string;
  email: string;
  region: "us" | "eu" | "asia";
}) {
  const client = getRegionalClient(userData.region);

  await client.execute({
    sql: "INSERT INTO users (name, email, region) VALUES (?, ?, ?)",
    args: [userData.name, userData.email, userData.region],
  });
}
```

## テナントプロビジョニング

### 新規テナントの自動作成

```typescript
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class TenantProvisioner {
  async createTenant(tenantName: string) {
    console.log(`Creating tenant: ${tenantName}`);

    // 1. Tursoデータベースを作成
    const dbName = `tenant-${tenantName}`;

    try {
      await execAsync(`turso db create ${dbName}`);
      console.log(`Database created: ${dbName}`);
    } catch (error) {
      console.error("Failed to create database:", error);
      throw error;
    }

    // 2. 接続情報を取得
    const { stdout: dbUrl } = await execAsync(`turso db show ${dbName} --url`);
    const { stdout: authToken } = await execAsync(
      `turso db tokens create ${dbName}`
    );

    // 3. テナント情報を保存
    await metadataClient.execute({
      sql: `
        INSERT INTO tenants (name, db_name, db_url, db_token, created_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [tenantName, dbName, dbUrl.trim(), authToken.trim()],
    });

    // 4. テナント専用のスキーマを初期化
    const tenantClient = createClient({
      url: dbUrl.trim(),
      authToken: authToken.trim(),
    });

    await this.initializeTenantSchema(tenantClient);

    console.log(`Tenant ${tenantName} provisioned successfully`);

    return {
      name: tenantName,
      dbName,
      dbUrl: dbUrl.trim(),
    };
  }

  private async initializeTenantSchema(client: any) {
    // テナント共通のスキーマを作成
    await client.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // デフォルト設定
    await client.execute({
      sql: "INSERT INTO settings (key, value) VALUES (?, ?)",
      args: ["initialized", "true"],
    });
  }

  async deleteTenant(tenantName: string) {
    // テナント情報を取得
    const result = await metadataClient.execute({
      sql: "SELECT db_name FROM tenants WHERE name = ?",
      args: [tenantName],
    });

    if (result.rows.length === 0) {
      throw new Error(`Tenant ${tenantName} not found`);
    }

    const dbName = result.rows[0].db_name;

    // データベースを削除
    await execAsync(`turso db destroy ${dbName} --yes`);

    // メタデータから削除
    await metadataClient.execute({
      sql: "DELETE FROM tenants WHERE name = ?",
      args: [tenantName],
    });

    console.log(`Tenant ${tenantName} deleted`);
  }
}

// 使用例
const provisioner = new TenantProvisioner();

// 新規テナント作成
app.post("/api/admin/tenants", async (req, res) => {
  const { name } = req.body;

  try {
    const tenant = await provisioner.createTenant(name);
    res.json({
      success: true,
      tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

## データベース間のデータ移行

### データのコピー

```typescript
async function copyDataBetweenDatabases(
  sourceClient: any,
  targetClient: any,
  tableName: string
) {
  console.log(`Copying data from source to target: ${tableName}`);

  // ソースからデータを取得
  const result = await sourceClient.execute(`SELECT * FROM ${tableName}`);

  if (result.rows.length === 0) {
    console.log("No data to copy");
    return;
  }

  // ターゲットにデータを挿入
  const columns = Object.keys(result.rows[0]);
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

  for (const row of result.rows) {
    const values = columns.map((col) => row[col]);
    await targetClient.execute({ sql, args: values });
  }

  console.log(`Copied ${result.rows.length} rows`);
}

// 使用例: ステージングから本番へのプロモーション
async function promoteToProduction() {
  await copyDataBetweenDatabases(stagingClient, productionClient, "users");
  await copyDataBetweenDatabases(stagingClient, productionClient, "settings");
}
```

## モニタリングと管理

### 全データベースの監視

```typescript
class DatabaseMonitor {
  private clients: Map<string, any> = new Map();

  addDatabase(name: string, client: any) {
    this.clients.set(name, client);
  }

  async checkAllDatabases() {
    const results: any[] = [];

    for (const [name, client] of this.clients) {
      try {
        const start = Date.now();
        await client.execute("SELECT 1");
        const latency = Date.now() - start;

        results.push({
          name,
          status: "healthy",
          latency,
        });
      } catch (error) {
        results.push({
          name,
          status: "unhealthy",
          error: error.message,
        });
      }
    }

    return results;
  }

  async getDatabaseSizes() {
    const sizes: any[] = [];

    for (const [name, client] of this.clients) {
      try {
        // SQLiteのページ数とページサイズから計算
        const pageCount = await client.execute("PRAGMA page_count");
        const pageSize = await client.execute("PRAGMA page_size");

        const sizeInBytes =
          pageCount.rows[0].page_count * pageSize.rows[0].page_size;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

        sizes.push({
          name,
          sizeInMB,
        });
      } catch (error) {
        sizes.push({
          name,
          error: error.message,
        });
      }
    }

    return sizes;
  }
}

const monitor = new DatabaseMonitor();
monitor.addDatabase("production", productionClient);
monitor.addDatabase("staging", stagingClient);
monitor.addDatabase("development", developmentClient);

// モニタリングエンドポイント
app.get("/api/admin/database-health", async (req, res) => {
  const health = await monitor.checkAllDatabases();
  res.json(health);
});

app.get("/api/admin/database-sizes", async (req, res) => {
  const sizes = await monitor.getDatabaseSizes();
  res.json(sizes);
});
```

## ベストプラクティス

### 1. 命名規則

```typescript
interface NamingConvention {
  environments: {
    pattern: "{app-name}-{environment}";
    examples: ["myapp-production", "myapp-staging", "myapp-dev"];
  };

  tenants: {
    pattern: "tenant-{tenant-id}";
    examples: ["tenant-acme", "tenant-globex", "tenant-initech"];
  };

  services: {
    pattern: "{service-name}-{environment}";
    examples: ["user-service-prod", "order-service-prod"];
  };
}
```

### 2. 環境変数管理

```bash
# .env.production
PRODUCTION_DB_URL=libsql://myapp-production-[org].turso.io
PRODUCTION_AUTH_TOKEN=prod-token

# .env.staging
STAGING_DB_URL=libsql://myapp-staging-[org].turso.io
STAGING_AUTH_TOKEN=staging-token

# .env.development
DEV_DB_URL=libsql://myapp-dev-[org].turso.io
DEV_AUTH_TOKEN=dev-token
```

### 3. 接続プーリング

```typescript
class DatabaseConnectionPool {
  private pools = new Map<string, any>();

  getOrCreateClient(dbUrl: string, authToken: string) {
    const key = `${dbUrl}:${authToken}`;

    if (!this.pools.has(key)) {
      this.pools.set(
        key,
        createClient({
          url: dbUrl,
          authToken,
        })
      );
    }

    return this.pools.get(key);
  }

  closeAll() {
    this.pools.clear();
  }
}
```

### 4. エラーハンドリング

```typescript
async function safeQuery(client: any, sql: string, args?: any[]) {
  try {
    return await client.execute({ sql, args });
  } catch (error) {
    console.error("Database query failed:", error);
    console.error("SQL:", sql);
    console.error("Args:", args);
    throw new Error("Database operation failed");
  }
}
```

## 制限事項

### コスト

- 各データベースは独立して課金される
- ストレージ、読み取り、書き込みすべて個別にカウント
- 大量のテナントがある場合はコストに注意

### 管理

- データベース数の上限はプランによる
- 手動での管理が必要（自動スケーリングなし）
- クロスデータベースクエリは不可

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso CLI Reference](https://docs.turso.tech/cli)
- [Database Branching](/docs/services/turso/docs/features/branching)
- [Attach Database](/docs/services/turso/docs/features/attach-database)
