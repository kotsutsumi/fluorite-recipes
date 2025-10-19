# Databases API - データベース一覧の取得

組織内のすべてのデータベースを取得します。オプションでグループや親データベースでフィルタリングできます。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織またはユーザーアカウントのスラッグ |

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `group` | string | いいえ | グループ名でフィルタリング |
| `parent` | string | いいえ | 親データベースIDでブランチをフィルタリング |
| `schema` | string | いいえ | ⚠️ 非推奨: スキーマデータベース名でフィルタリング |

### リクエストヘッダー

```http
Authorization: Bearer YOUR_API_TOKEN
```

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface ListDatabasesResponse {
  databases: Database[];
}

interface Database {
  Name: string;                    // データベース名
  DbId: string;                    // データベースUUID
  Hostname: string;                // 接続用ホスト名
  IsSchema: boolean;               // スキーマデータベースかどうか
  block_reads: boolean;            // 読み取りブロック状態
  block_writes: boolean;           // 書き込みブロック状態
  allow_attach: boolean;           // アタッチ許可状態（非推奨）
  regions: string[];               // レプリケーション先リージョン
  primaryRegion: string;           // プライマリリージョン
  type: "logical" | "schema";      // データベースタイプ
  version: string;                 // データベースバージョン
  group: string;                   // 所属グループ名
  sleeping: boolean;               // スリープ状態
  archived: boolean;               // アーカイブ状態
  schema: string;                  // スキーマデータベース（該当する場合）
  parent: ParentDatabase;          // 親データベース情報（ブランチの場合）
  delete_protection: boolean;      // 削除保護状態
}

interface ParentDatabase {
  Name: string;                    // 親データベース名
  DbId: string;                    // 親データベースUUID
  Hostname: string;                // 親データベースホスト名
}
```

### レスポンス例

**すべてのデータベースを取得**:

```json
{
  "databases": [
    {
      "Name": "production-db",
      "DbId": "0eb771dd-6906-11ee-8553-eaa7715aeaf2",
      "Hostname": "production-db-my-org.turso.io",
      "IsSchema": false,
      "block_reads": false,
      "block_writes": false,
      "allow_attach": true,
      "regions": ["lhr", "nrt", "syd"],
      "primaryRegion": "lhr",
      "type": "logical",
      "version": "0.24.1",
      "group": "production",
      "sleeping": false,
      "archived": false,
      "delete_protection": true
    },
    {
      "Name": "staging-db",
      "DbId": "1fc882ee-7a17-22ff-9664-fbb8826bfcf3",
      "Hostname": "staging-db-my-org.turso.io",
      "IsSchema": false,
      "block_reads": false,
      "block_writes": false,
      "allow_attach": true,
      "regions": ["lhr"],
      "primaryRegion": "lhr",
      "type": "logical",
      "version": "0.24.1",
      "group": "staging",
      "sleeping": false,
      "archived": false,
      "delete_protection": false
    }
  ]
}
```

**グループでフィルタリング**:

```json
{
  "databases": [
    {
      "Name": "production-db",
      "DbId": "0eb771dd-6906-11ee-8553-eaa7715aeaf2",
      "Hostname": "production-db-my-org.turso.io",
      "group": "production",
      ...
    }
  ]
}
```

## 使用例

### cURL

**すべてのデータベースを取得**:

```bash
curl -L -X GET 'https://api.turso.tech/v1/organizations/my-org/databases' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

**グループでフィルタリング**:

```bash
curl -L -X GET 'https://api.turso.tech/v1/organizations/my-org/databases?group=production' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

**親データベースIDでブランチをフィルタリング**:

```bash
curl -L -X GET 'https://api.turso.tech/v1/organizations/my-org/databases?parent=0eb771dd-6906-11ee-8553-eaa7715aeaf2' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
const organizationSlug = 'my-org';
const token = process.env.TURSO_API_TOKEN;

// すべてのデータベースを取得
async function listAllDatabases() {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.databases;
}

// グループでフィルタリング
async function listDatabasesByGroup(groupName: string) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases?group=${groupName}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();
  return data.databases;
}

// 使用例
const allDatabases = await listAllDatabases();
console.log('All databases:', allDatabases);

const productionDatabases = await listDatabasesByGroup('production');
console.log('Production databases:', productionDatabases);
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

// すべてのデータベースを取得
const databases = await turso.databases.list();
console.log('Databases:', databases);

// データベース情報の表示
databases.forEach(db => {
  console.log(`
    Name: ${db.Name}
    Group: ${db.group}
    Regions: ${db.regions.join(', ')}
    Primary: ${db.primaryRegion}
    Protected: ${db.delete_protection}
  `);
});
```

### Python

```python
import requests
import os

organization_slug = 'my-org'
token = os.environ['TURSO_API_TOKEN']

def list_databases(group=None):
    url = f'https://api.turso.tech/v1/organizations/{organization_slug}/databases'

    params = {}
    if group:
        params['group'] = group

    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    return response.json()['databases']

# すべてのデータベースを取得
all_databases = list_databases()
print(f'Total databases: {len(all_databases)}')

# グループでフィルタリング
production_databases = list_databases(group='production')
print(f'Production databases: {len(production_databases)}')
```

## データベースプロパティの詳細

### データベースタイプ

| タイプ | 説明 |
|-------|------|
| `logical` | 通常のデータベース |
| `schema` | スキーマデータベース（他のデータベースのテンプレート） |

### リージョンとレプリケーション

- `primaryRegion`: データベースのプライマリインスタンスがホストされているリージョン
- `regions`: データベースがレプリケートされているすべてのリージョン

```typescript
interface DatabaseRegions {
  primaryRegion: string;      // 例: "lhr"
  regions: string[];          // 例: ["lhr", "nrt", "syd"]
}
```

### ブロック状態

データベースへのアクセスを制御：

| プロパティ | 説明 |
|----------|------|
| `block_reads` | `true`の場合、読み取りクエリがブロックされる |
| `block_writes` | `true`の場合、書き込みクエリがブロックされる |

### 削除保護

`delete_protection`が`true`の場合、データベースは誤って削除されないように保護されます。

## エラーハンドリング

### 401 Unauthorized

```json
{
  "error": "Invalid or expired auth token"
}
```

**対処方法**: APIトークンを確認し、必要に応じて新しいトークンを作成してください。

### 403 Forbidden

```json
{
  "error": "You do not have permission to access this resource"
}
```

**対処方法**: 組織のメンバーであることを確認してください。

### エラーハンドリング例

```typescript
async function listDatabasesSafely(organizationSlug: string) {
  try {
    const response = await fetch(
      `https://api.turso.tech/v1/organizations/${organizationSlug}/databases`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();

      switch (response.status) {
        case 401:
          console.error('認証エラー: トークンを確認してください');
          break;
        case 403:
          console.error('権限エラー: 組織へのアクセス権限を確認してください');
          break;
        case 404:
          console.error('組織が見つかりません');
          break;
        default:
          console.error('エラー:', error.error);
      }

      throw new Error(error.error);
    }

    const data = await response.json();
    return data.databases;
  } catch (error) {
    console.error('データベース一覧の取得に失敗:', error);
    throw error;
  }
}
```

## 実用的な例

### データベースの検索

```typescript
// 名前でデータベースを検索
function findDatabaseByName(databases: Database[], name: string): Database | undefined {
  return databases.find(db => db.Name === name);
}

// グループ内のデータベースを検索
function findDatabasesByGroup(databases: Database[], group: string): Database[] {
  return databases.filter(db => db.group === group);
}

// 特定のリージョンにあるデータベースを検索
function findDatabasesByRegion(databases: Database[], region: string): Database[] {
  return databases.filter(db => db.regions.includes(region));
}

// 使用例
const databases = await listAllDatabases();
const myDb = findDatabaseByName(databases, 'production-db');
const londonDatabases = findDatabasesByRegion(databases, 'lhr');
```

### データベース統計の表示

```typescript
async function displayDatabaseStats(organizationSlug: string) {
  const databases = await listDatabasesSafely(organizationSlug);

  console.log('\n=== データベース統計 ===');
  console.log(`総データベース数: ${databases.length}`);

  // グループ別集計
  const byGroup = databases.reduce((acc, db) => {
    acc[db.group] = (acc[db.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nグループ別:');
  Object.entries(byGroup).forEach(([group, count]) => {
    console.log(`  ${group}: ${count}`);
  });

  // リージョン別集計
  const byRegion = databases.reduce((acc, db) => {
    db.regions.forEach(region => {
      acc[region] = (acc[region] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  console.log('\nリージョン別:');
  Object.entries(byRegion)
    .sort((a, b) => b[1] - a[1])
    .forEach(([region, count]) => {
      console.log(`  ${region}: ${count}`);
    });

  // 削除保護状態
  const protected_count = databases.filter(db => db.delete_protection).length;
  console.log(`\n削除保護が有効: ${protected_count}/${databases.length}`);
}
```

### データベースのエクスポート

```typescript
async function exportDatabaseList(organizationSlug: string, format: 'json' | 'csv' = 'json') {
  const databases = await listDatabasesSafely(organizationSlug);

  if (format === 'json') {
    return JSON.stringify(databases, null, 2);
  }

  // CSV形式
  const headers = ['Name', 'DbId', 'Group', 'Primary Region', 'Regions', 'Protected'];
  const rows = databases.map(db => [
    db.Name,
    db.DbId,
    db.group,
    db.primaryRegion,
    db.regions.join(';'),
    db.delete_protection.toString()
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csv;
}

// 使用例
const jsonExport = await exportDatabaseList('my-org', 'json');
const csvExport = await exportDatabaseList('my-org', 'csv');
```

## 関連API

- [データベースの作成](./06-databases-create.md)
- [データベースの取得](./07-databases-retrieve.md)
- [データベースの削除](./12-databases-delete.md)
- [グループ一覧の取得](./17-groups-list.md)

## 次のステップ

1. データベースを作成: [データベースの作成](./06-databases-create.md)
2. 特定のデータベースの詳細を取得: [データベースの取得](./07-databases-retrieve.md)
3. データベースの設定を確認: [データベース設定の取得](./08-databases-configuration.md)

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [Authentication](./03-authentication.md)
- [Response Codes](./04-response-codes.md)
