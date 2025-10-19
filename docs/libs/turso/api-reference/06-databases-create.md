# Databases API - データベースの作成

新しいデータベースを作成します。既存のデータベースからシードしたり、サイズ制限を設定することもできます。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/databases
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織またはユーザーアカウントのスラッグ |

### リクエストヘッダー

```http
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

### リクエストボディ

```typescript
interface CreateDatabaseRequest {
  name: string;              // データベース名（必須）
  group: string;             // 所属グループ名（必須）
  seed?: SeedConfig;         // シード設定（オプション）
  size_limit?: string;       // サイズ制限（オプション）
  is_schema?: boolean;       // スキーマデータベースとして作成（オプション）
  schema?: string;           // 使用するスキーマ名（オプション）
}

interface SeedConfig {
  type: "database" | "dump";
  name?: string;             // ソースデータベース名
  url?: string;              // ダンプファイルのURL
  timestamp?: string;        // ポイントインタイムリカバリのタイムスタンプ（ISO 8601形式）
}
```

### パラメータの詳細

#### name（必須）

データベース名は以下のルールに従う必要があります：

- 小文字の英字、数字、ハイフン（`-`）のみ使用可能
- 最大64文字
- ハイフンで始まったり終わったりしない
- 組織内で一意である必要がある

**有効な名前の例**:
```
my-database
production-db
user-123-db
staging-v2
```

**無効な名前の例**:
```
MyDatabase      // 大文字を含む
my_database     // アンダースコアを含む
-my-db          // ハイフンで始まる
my-db-          // ハイフンで終わる
```

#### group（必須）

データベースを作成するグループ名。グループは事前に存在している必要があります。

#### seed（オプション）

既存のデータベースやダンプファイルからデータベースを初期化：

**データベースからシード**:
```json
{
  "type": "database",
  "name": "source-db",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**ダンプファイルからシード**:
```json
{
  "type": "dump",
  "url": "https://example.com/backup.sql"
}
```

#### size_limit（オプション）

データベースの最大サイズ。バイト単位または単位付きで指定：

```
"1000000"      // 1,000,000バイト
"10mb"         // 10メガバイト
"1gb"          // 1ギガバイト
```

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface CreateDatabaseResponse {
  database: Database;
}

interface Database {
  DbId: string;              // データベースUUID
  Name: string;              // データベース名
  Hostname: string;          // 接続用ホスト名
  IsSchema: boolean;         // スキーマデータベースかどうか
  block_reads: boolean;      // 読み取りブロック状態
  block_writes: boolean;     // 書き込みブロック状態
  allow_attach: boolean;     // アタッチ許可状態
  regions: string[];         // レプリケーション先リージョン
  primaryRegion: string;     // プライマリリージョン
  type: string;              // データベースタイプ
  version: string;           // データベースバージョン
  group: string;             // 所属グループ名
}
```

### レスポンス例

```json
{
  "database": {
    "DbId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    "Name": "my-new-db",
    "Hostname": "my-new-db-my-org.turso.io",
    "IsSchema": false,
    "block_reads": false,
    "block_writes": false,
    "allow_attach": true,
    "regions": ["lhr"],
    "primaryRegion": "lhr",
    "type": "logical",
    "version": "0.24.1",
    "group": "default"
  }
}
```

### エラーレスポンス

#### 400 Bad Request - グループが存在しない

```json
{
  "error": "Group 'non-existent-group' not found"
}
```

#### 409 Conflict - データベース名が既に存在

```json
{
  "error": "Database with name 'my-db' already exists"
}
```

#### 422 Unprocessable Entity - 無効なデータベース名

```json
{
  "error": "Invalid database name: must contain only lowercase alphanumeric characters and hyphens"
}
```

## 使用例

### cURL

**基本的なデータベース作成**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-new-db",
    "group": "default"
  }'
```

**サイズ制限付きで作成**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "limited-db",
    "group": "default",
    "size_limit": "100mb"
  }'
```

**既存データベースからシード**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "cloned-db",
    "group": "default",
    "seed": {
      "type": "database",
      "name": "source-db",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }'
```

### JavaScript / TypeScript

```typescript
interface CreateDatabaseOptions {
  name: string;
  group: string;
  sizeLimit?: string;
  seed?: {
    type: 'database' | 'dump';
    name?: string;
    url?: string;
    timestamp?: string;
  };
}

async function createDatabase(
  organizationSlug: string,
  options: CreateDatabaseOptions
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: options.name,
        group: options.group,
        ...(options.sizeLimit && { size_limit: options.sizeLimit }),
        ...(options.seed && { seed: options.seed })
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  return data.database;
}

// 使用例

// 基本的なデータベース作成
const basicDb = await createDatabase('my-org', {
  name: 'my-new-db',
  group: 'default'
});
console.log('Created:', basicDb.Hostname);

// サイズ制限付き
const limitedDb = await createDatabase('my-org', {
  name: 'limited-db',
  group: 'default',
  sizeLimit: '100mb'
});

// 既存DBからクローン
const clonedDb = await createDatabase('my-org', {
  name: 'cloned-db',
  group: 'default',
  seed: {
    type: 'database',
    name: 'source-db',
    timestamp: new Date().toISOString()
  }
});
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

// 基本的なデータベース作成
const database = await turso.databases.create("my-new-db", {
  group: "default"
});

// サイズ制限付き
const limitedDb = await turso.databases.create("limited-db", {
  group: "default",
  size_limit: "100mb"
});

// 既存データベースからシード
const seededDb = await turso.databases.create("cloned-db", {
  group: "default",
  seed: {
    type: "database",
    name: "source-db",
    timestamp: "2024-01-15T10:30:00Z"
  }
});
```

### Python

```python
import requests
import os
from datetime import datetime

def create_database(org_slug, name, group, size_limit=None, seed=None):
    url = f'https://api.turso.tech/v1/organizations/{org_slug}/databases'

    payload = {
        'name': name,
        'group': group
    }

    if size_limit:
        payload['size_limit'] = size_limit

    if seed:
        payload['seed'] = seed

    headers = {
        'Authorization': f'Bearer {os.environ["TURSO_API_TOKEN"]}',
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    return response.json()['database']

# 基本的なデータベース作成
db = create_database('my-org', 'my-new-db', 'default')
print(f'Created: {db["Hostname"]}')

# サイズ制限付き
limited_db = create_database(
    'my-org',
    'limited-db',
    'default',
    size_limit='100mb'
)

# 既存データベースからシード
seeded_db = create_database(
    'my-org',
    'cloned-db',
    'default',
    seed={
        'type': 'database',
        'name': 'source-db',
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }
)
```

## ポイントインタイムリカバリ (PITR)

タイムスタンプを指定して、特定の時点のデータベース状態から新しいデータベースを作成できます。

### 制限事項

- **Scaler プラン**: 過去24時間以内のタイムスタンプ
- **Enterprise プラン**: 過去30日間以内のタイムスタンプ

### 使用例

```typescript
// 1時間前の状態から復元
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

const restoredDb = await createDatabase('my-org', {
  name: 'restored-db',
  group: 'default',
  seed: {
    type: 'database',
    name: 'production-db',
    timestamp: oneHourAgo.toISOString()
  }
});

console.log('Restored from:', oneHourAgo.toISOString());
```

## エラーハンドリング

### 包括的なエラーハンドリング

```typescript
async function createDatabaseSafely(
  organizationSlug: string,
  options: CreateDatabaseOptions
) {
  try {
    const database = await createDatabase(organizationSlug, options);
    console.log('✓ データベース作成成功:', database.Name);
    return database;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('already exists')) {
        console.error('✗ データベース名が既に使用されています');
        console.log('  別の名前を試してください:',
          `${options.name}-${Date.now()}`);
      } else if (message.includes('group') && message.includes('not found')) {
        console.error('✗ グループが存在しません:', options.group);
        console.log('  利用可能なグループを確認してください');
      } else if (message.includes('invalid') && message.includes('name')) {
        console.error('✗ 無効なデータベース名');
        console.log('  小文字の英数字とハイフンのみ使用可能です');
      } else {
        console.error('✗ データベース作成エラー:', error.message);
      }
    }
    throw error;
  }
}
```

### 名前の競合を自動解決

```typescript
async function createDatabaseWithAutoRetry(
  organizationSlug: string,
  baseName: string,
  group: string,
  maxRetries = 5
) {
  for (let i = 0; i < maxRetries; i++) {
    const name = i === 0 ? baseName : `${baseName}-${i}`;

    try {
      return await createDatabase(organizationSlug, {
        name,
        group
      });
    } catch (error) {
      if (error instanceof Error &&
          error.message.includes('already exists') &&
          i < maxRetries - 1) {
        console.log(`名前が競合、リトライ中: ${name}`);
        continue;
      }
      throw error;
    }
  }

  throw new Error('データベース作成の最大リトライ回数に達しました');
}

// 使用例
const db = await createDatabaseWithAutoRetry('my-org', 'my-db', 'default');
```

## ベストプラクティス

### 1. グループの存在確認

```typescript
async function createDatabaseWithValidation(
  organizationSlug: string,
  name: string,
  group: string
) {
  // グループの存在を確認
  const groups = await turso.groups.list();
  const groupExists = groups.some(g => g.name === group);

  if (!groupExists) {
    throw new Error(`Group '${group}' does not exist. Available groups: ${
      groups.map(g => g.name).join(', ')
    }`);
  }

  // データベースを作成
  return createDatabase(organizationSlug, { name, group });
}
```

### 2. 名前のバリデーション

```typescript
function validateDatabaseName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'データベース名は必須です' };
  }

  if (name.length > 64) {
    return { valid: false, error: 'データベース名は64文字以内にしてください' };
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    return {
      valid: false,
      error: '小文字の英数字とハイフンのみ使用できます'
    };
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return {
      valid: false,
      error: 'ハイフンで始まったり終わったりできません'
    };
  }

  return { valid: true };
}

// 使用例
const validation = validateDatabaseName('my-new-db');
if (!validation.valid) {
  throw new Error(validation.error);
}
```

### 3. サイズ制限の計算

```typescript
function calculateSizeLimit(planType: 'starter' | 'scaler' | 'enterprise'): string {
  const limits = {
    starter: '500mb',
    scaler: '10gb',
    enterprise: '100gb'
  };

  return limits[planType];
}

// 使用例
const sizeLimit = calculateSizeLimit('scaler');
const db = await createDatabase('my-org', {
  name: 'my-db',
  group: 'default',
  sizeLimit
});
```

## 関連API

- [データベース一覧の取得](./05-databases-list.md)
- [データベースの取得](./07-databases-retrieve.md)
- [データベースの削除](./12-databases-delete.md)
- [グループの作成](./18-groups-create.md)

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [Authentication](./03-authentication.md)
- [Response Codes](./04-response-codes.md)
