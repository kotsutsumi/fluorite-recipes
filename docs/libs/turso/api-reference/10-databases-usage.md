# Databases API - データベース使用量の取得

データベースの使用量（読み取り行数、書き込み行数、ストレージ、同期バイト数）を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases/{databaseName}/usage
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | データベース名 |

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `from` | string | いいえ | 開始日時（ISO 8601形式）、デフォルトは当月初日 |
| `to` | string | いいえ | 終了日時（ISO 8601形式）、デフォルトは現在 |

## レスポンス

```typescript
interface DatabaseUsageResponse {
  uuid: string;
  instances: InstanceUsage[];
  total: UsageMetrics;
}

interface InstanceUsage {
  uuid: string;
  usage: UsageMetrics;
}

interface UsageMetrics {
  rows_read: number;
  rows_written: number;
  storage_bytes: number;
  bytes_synced: number;
}
```

### レスポンス例

```json
{
  "uuid": "0eb771dd-6906-11ee-8553-eaa7715aeaf2",
  "instances": [
    {
      "uuid": "1fc882ee-7a17-22ff-9664-fbb8826bfcf3",
      "usage": {
        "rows_read": 150000,
        "rows_written": 25000,
        "storage_bytes": 524288000,
        "bytes_synced": 1048576
      }
    }
  ],
  "total": {
    "rows_read": 150000,
    "rows_written": 25000,
    "storage_bytes": 524288000,
    "bytes_synced": 1048576
  }
}
```

## 使用例

### cURL

```bash
# 当月の使用量を取得
curl -L 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/usage' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'

# 期間を指定
curl -L 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/usage?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function getDatabaseUsage(
  organizationSlug: string,
  databaseName: string,
  from?: Date,
  to?: Date
) {
  const params = new URLSearchParams();
  if (from) params.set('from', from.toISOString());
  if (to) params.set('to', to.toISOString());

  const url = `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/usage?${params}`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}` }
  });

  return response.json();
}

// 当月の使用量
const currentUsage = await getDatabaseUsage('my-org', 'my-db');

// 先月の使用量
const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

const lastMonthUsage = await getDatabaseUsage(
  'my-org',
  'my-db',
  lastMonthStart,
  lastMonthEnd
);

console.log('Storage:', (currentUsage.total.storage_bytes / 1024 / 1024).toFixed(2), 'MB');
console.log('Rows read:', currentUsage.total.rows_read.toLocaleString());
console.log('Rows written:', currentUsage.total.rows_written.toLocaleString());
```

### 使用量のフォーマット

```typescript
function formatUsage(usage: UsageMetrics) {
  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  };

  return {
    storage: formatBytes(usage.storage_bytes),
    rowsRead: usage.rows_read.toLocaleString(),
    rowsWritten: usage.rows_written.toLocaleString(),
    bytesSynced: formatBytes(usage.bytes_synced)
  };
}

const usage = await getDatabaseUsage('my-org', 'my-db');
const formatted = formatUsage(usage.total);
console.log(formatted);
// { storage: '500.00 MB', rowsRead: '150,000', rowsWritten: '25,000', bytesSynced: '1.00 MB' }
```

---

**参考リンク**:
- [データベース統計の取得](./11-databases-stats.md)
- [組織使用量の取得](./38-organizations-usage.md)
