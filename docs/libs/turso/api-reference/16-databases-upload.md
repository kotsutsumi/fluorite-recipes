# Databases API - データベースのアップロード

SQLダンプファイルから新しいデータベースを作成します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/databases
```

## 概要

SQLダンプファイル（.sqlファイル）をアップロードして、新しいTursoデータベースを作成できます。この機能は、既存のSQLiteデータベースや他のデータベースシステムからTursoへの移行に便利です。

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |

### リクエストボディ

```typescript
interface UploadDatabaseRequest {
  name: string;              // データベース名
  group: string;             // 所属グループ
  seed: {
    type: "dump";
    url: string;             // SQLダンプファイルのURL
  };
  size_limit?: string;       // サイズ制限（オプション）
}
```

### リクエスト例

```json
{
  "name": "imported-db",
  "group": "default",
  "seed": {
    "type": "dump",
    "url": "https://example.com/backup.sql"
  },
  "size_limit": "1gb"
}
```

## レスポンス

通常のデータベース作成と同じレスポンス形式です。

```typescript
interface UploadDatabaseResponse {
  database: Database;
}
```

## 使用例

### cURL

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "imported-db",
    "group": "default",
    "seed": {
      "type": "dump",
      "url": "https://example.com/database-backup.sql"
    }
  }'
```

### JavaScript / TypeScript

```typescript
async function uploadDatabase(
  organizationSlug: string,
  name: string,
  group: string,
  dumpUrl: string,
  sizeLimit?: string
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
        name,
        group,
        seed: {
          type: 'dump',
          url: dumpUrl
        },
        ...(sizeLimit && { size_limit: sizeLimit })
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.database;
}

// 使用例
const db = await uploadDatabase(
  'my-org',
  'imported-db',
  'default',
  'https://example.com/backup.sql',
  '1gb'
);

console.log('Database created:', db.Hostname);
```

## SQLダンプファイルの準備

### SQLiteからのエクスポート

```bash
# SQLiteデータベースをSQLダンプとしてエクスポート
sqlite3 mydb.sqlite .dump > backup.sql
```

### PostgreSQLからのエクスポート

```bash
# PostgreSQLからSQLiteと互換性のある形式でエクスポート
pg_dump --data-only --inserts mydb > backup.sql
```

### MySQLからのエクスポート

```bash
# MySQLからエクスポート
mysqldump --compatible=ansi --skip-extended-insert mydb > backup.sql
```

## ダンプファイルのホスティング

ダンプファイルは公開アクセス可能なURLでホストする必要があります：

### Amazon S3

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';

async function uploadDumpToS3(filePath: string): Promise<string> {
  const s3 = new S3Client({ region: 'us-east-1' });

  const fileContent = fs.readFileSync(filePath);

  await s3.send(new PutObjectCommand({
    Bucket: 'my-database-dumps',
    Key: 'backup.sql',
    Body: fileContent,
    ContentType: 'application/sql',
    ACL: 'public-read'  // 一時的に公開
  }));

  const url = `https://my-database-dumps.s3.amazonaws.com/backup.sql`;
  return url;
}
```

### Cloudflare R2

```typescript
async function uploadDumpToR2(filePath: string): Promise<string> {
  // R2へのアップロード実装
  // ...

  return 'https://pub-xxxxx.r2.dev/backup.sql';
}
```

## 移行ワークフロー

### 完全な移行プロセス

```typescript
async function migrateDatabase(
  organizationSlug: string,
  sourceDbPath: string,
  targetDbName: string,
  targetGroup: string
) {
  console.log('Starting database migration...');

  // 1. SQLダンプを作成
  console.log('1. Creating SQL dump...');
  const dumpFile = await createSQLDump(sourceDbPath);
  console.log('✓ Dump created:', dumpFile);

  // 2. ダンプファイルをアップロード
  console.log('2. Uploading dump to cloud storage...');
  const dumpUrl = await uploadDumpToS3(dumpFile);
  console.log('✓ Dump uploaded:', dumpUrl);

  // 3. Tursoデータベースを作成
  console.log('3. Creating Turso database from dump...');
  const database = await uploadDatabase(
    organizationSlug,
    targetDbName,
    targetGroup,
    dumpUrl
  );
  console.log('✓ Database created:', database.Hostname);

  // 4. ダンプファイルを削除（セキュリティ）
  console.log('4. Cleaning up temporary dump file...');
  await deleteDumpFromS3(dumpUrl);
  console.log('✓ Cleanup complete');

  console.log('\nMigration complete!');
  console.log(`Database URL: libsql://${database.Hostname}`);

  return database;
}

async function createSQLDump(dbPath: string): Promise<string> {
  const { execSync } = require('child_process');
  const dumpPath = `${dbPath}.dump.sql`;

  execSync(`sqlite3 ${dbPath} .dump > ${dumpPath}`);

  return dumpPath;
}
```

### バッチ移行

```typescript
async function migratMultipleDatabases(
  organizationSlug: string,
  databases: Array<{ path: string; name: string }>
) {
  const results = [];

  for (const db of databases) {
    try {
      console.log(`\nMigrating ${db.name}...`);

      const migrated = await migrateDatabase(
        organizationSlug,
        db.path,
        db.name,
        'default'
      );

      results.push({
        name: db.name,
        status: 'success',
        hostname: migrated.Hostname
      });

      console.log(`✓ ${db.name} migrated successfully`);
    } catch (error) {
      console.error(`✗ ${db.name} migration failed:`, error);

      results.push({
        name: db.name,
        status: 'failed',
        error: error.message
      });
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);

  return results;
}

// 使用例
const databasesToMigrate = [
  { path: './data/users.db', name: 'users-db' },
  { path: './data/products.db', name: 'products-db' },
  { path: './data/orders.db', name: 'orders-db' }
];

await migratMultipleDatabases('my-org', databasesToMigrate);
```

## トラブルシューティング

### ダンプファイルが大きすぎる場合

```typescript
import zlib from 'zlib';
import fs from 'fs';

async function compressDump(inputPath: string): Promise<string> {
  const outputPath = `${inputPath}.gz`;

  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip();

    input.pipe(gzip).pipe(output)
      .on('finish', () => resolve(outputPath))
      .on('error', reject);
  });
}

// 圧縮してからアップロード
const dumpFile = await createSQLDump('./mydb.sqlite');
const compressedDump = await compressDump(dumpFile);
const dumpUrl = await uploadDumpToS3(compressedDump);
```

### 互換性のないSQL文の修正

```typescript
function sanitizeSQLDump(dumpContent: string): string {
  // Tursoと互換性のない構文を修正
  let sanitized = dumpContent;

  // PRAGMA文を削除
  sanitized = sanitized.replace(/PRAGMA.*?;/g, '');

  // BEGIN TRANSACTION を削除
  sanitized = sanitized.replace(/BEGIN TRANSACTION;/g, '');

  // COMMIT を削除
  sanitized = sanitized.replace(/COMMIT;/g, '');

  return sanitized;
}

// 使用例
const dumpContent = fs.readFileSync('backup.sql', 'utf-8');
const sanitized = sanitizeSQLDump(dumpContent);
fs.writeFileSync('backup-sanitized.sql', sanitized);
```

## ベストプラクティス

### 1. セキュリティ

- ダンプファイルのURLは短期間のみ公開アクセス可能にする
- 移行完了後、即座にダンプファイルを削除
- 署名付きURLを使用（S3, R2など）

```typescript
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

async function getPresignedUrl(bucket: string, key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // 1時間有効な署名付きURL
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
```

### 2. データ検証

```typescript
async function validateMigration(
  sourceDbPath: string,
  targetDb: Database
) {
  console.log('Validating migration...');

  // ソースDBの統計
  const sourceStats = await getSourceStats(sourceDbPath);

  // ターゲットDBの統計
  const targetStats = await getDatabaseUsage(orgSlug, targetDb.Name);

  console.log('Source:');
  console.log(`  Tables: ${sourceStats.tableCount}`);
  console.log(`  Rows: ${sourceStats.rowCount}`);

  console.log('Target:');
  console.log(`  Storage: ${targetStats.total.storage_bytes} bytes`);

  // 検証...
}
```

---

**参考リンク**:
- [データベースの作成](./06-databases-create.md)
- [データベース一覧の取得](./05-databases-list.md)
