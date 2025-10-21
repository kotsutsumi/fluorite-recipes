# Databases API - データベースの取得

特定のデータベースの詳細情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases/{databaseName}
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織またはユーザーアカウントのスラッグ |
| `databaseName` | string | はい | データベース名 |

### リクエストヘッダー

```http
Authorization: Bearer YOUR_API_TOKEN
```

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface GetDatabaseResponse {
  database: Database;
}

interface Database {
  DbId: string;
  Name: string;
  Hostname: string;
  IsSchema: boolean;
  block_reads: boolean;
  block_writes: boolean;
  allow_attach: boolean;
  regions: string[];
  primaryRegion: string;
  type: string;
  version: string;
  group: string;
  sleeping: boolean;
  archived: boolean;
  schema?: string;
  parent?: ParentDatabase;
  delete_protection: boolean;
}
```

### レスポンス例

```json
{
  "database": {
    "DbId": "0eb771dd-6906-11ee-8553-eaa7715aeaf2",
    "Name": "my-db",
    "Hostname": "my-db-my-org.turso.io",
    "IsSchema": false,
    "block_reads": false,
    "block_writes": false,
    "allow_attach": true,
    "regions": ["lhr", "nrt", "syd"],
    "primaryRegion": "lhr",
    "type": "logical",
    "version": "0.24.1",
    "group": "default",
    "sleeping": false,
    "archived": false,
    "delete_protection": true
  }
}
```

## 使用例

### cURL

```bash
curl -L -X GET 'https://api.turso.tech/v1/organizations/my-org/databases/my-db' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function getDatabase(organizationSlug: string, databaseName: string) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.database;
}

const database = await getDatabase('my-org', 'my-db');
console.log('Database:', database);
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

const database = await turso.databases.get("my-db");
console.log(`Hostname: ${database.Hostname}`);
console.log(`Primary Region: ${database.primaryRegion}`);
console.log(`Replicas: ${database.regions.join(', ')}`);
```

## エラーレスポンス

### 404 Not Found

```json
{
  "error": "could not find database with name 'my-db': record not found"
}
```

---

**参考リンク**:
- [データベース一覧の取得](./05-databases-list.md)
- [データベースの作成](./06-databases-create.md)
- [データベース設定の取得](./08-databases-configuration.md)
