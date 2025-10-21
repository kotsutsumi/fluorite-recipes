# Databases API - データベース設定の取得

データベースの現在の設定を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases/{databaseName}/configuration
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
interface DatabaseConfiguration {
  size_limit: string;        // 最大サイズ（バイト単位）
  allow_attach: boolean;     // アタッチ許可（非推奨）
  block_reads: boolean;      // 読み取りブロック
  block_writes: boolean;     // 書き込みブロック
  delete_protection: boolean; // 削除保護
}
```

### レスポンス例

```json
{
  "size_limit": "1073741824",
  "allow_attach": true,
  "block_reads": false,
  "block_writes": false,
  "delete_protection": true
}
```

## 使用例

### cURL

```bash
curl -L -X GET 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/configuration' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function getDatabaseConfiguration(
  organizationSlug: string,
  databaseName: string
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/configuration`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

const config = await getDatabaseConfiguration('my-org', 'my-db');
console.log('Size limit:', config.size_limit, 'bytes');
console.log('Delete protection:', config.delete_protection);
```

### サイズ制限の変換

```typescript
function formatBytes(bytes: string): string {
  const num = parseInt(bytes);
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = num;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

const config = await getDatabaseConfiguration('my-org', 'my-db');
console.log('Size limit:', formatBytes(config.size_limit));
```

---

**参考リンク**:
- [データベース設定の更新](./09-databases-update-configuration.md)
- [データベースの取得](./07-databases-retrieve.md)
