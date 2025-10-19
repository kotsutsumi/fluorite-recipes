# 監査ログの取得 - Turso API リファレンス

組織の監査ログを取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/audit-logs
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organizationSlug` | string | ✓ | 組織のスラッグ |

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|----------|
| `page_size` | number | - | 1ページあたりの項目数 | 100 |
| `page` | number | - | ページ番号 | 1 |

## TypeScript インターフェース

```typescript
interface AuditLog {
  code: string;
  message: string;
  origin: 'cli' | 'web';
  author: string;
  created_at: string;
  data: Record<string, any>;
}

interface AuditLogsResponse {
  audit_logs: AuditLog[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "audit_logs": [
    {
      "code": "db-create",
      "message": "Database created",
      "origin": "cli",
      "author": "iku",
      "created_at": "2024-01-01T00:00:00Z",
      "data": {
        "database": "my-db",
        "group": "default"
      }
    },
    {
      "code": "user-signup",
      "message": "User signed up",
      "origin": "web",
      "author": "iku",
      "created_at": "2024-01-01T00:00:00Z",
      "data": {}
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 100,
    "total_pages": 1,
    "total_items": 2
  }
}
```

## 監査ログコード

主な監査ログコード：

| コード | 説明 |
|-------|------|
| `db-create` | データベースの作成 |
| `db-delete` | データベースの削除 |
| `group-create` | グループの作成 |
| `group-delete` | グループの削除 |
| `group-transfer` | グループの転送 |
| `token-create` | トークンの作成 |
| `token-revoke` | トークンの失効 |
| `user-signup` | ユーザー登録 |
| `user-login` | ユーザーログイン |
| `member-add` | メンバーの追加 |
| `member-remove` | メンバーの削除 |

## コード例

### cURL

```bash
# 最初のページを取得
curl -X GET "https://api.turso.tech/v1/organizations/my-org/audit-logs?page=1&page_size=50" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getAuditLogs = async (orgSlug, page = 1, pageSize = 100) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/audit-logs?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get audit logs');
  }

  return await response.json();
};

// 使用例
const { audit_logs, pagination } = await getAuditLogs('my-org');
console.log(`Found ${pagination.total_items} audit logs`);

audit_logs.forEach(log => {
  console.log(`[${log.created_at}] ${log.code}: ${log.message}`);
  console.log(`  Author: ${log.author} (${log.origin})`);
});
```

### TypeScript

```typescript
async function getAuditLogs(
  orgSlug: string,
  page = 1,
  pageSize = 100
): Promise<AuditLogsResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/audit-logs?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get audit logs');
  }

  return await response.json();
}

// ページネーション処理
async function getAllAuditLogs(orgSlug: string): Promise<AuditLog[]> {
  const allLogs: AuditLog[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const { audit_logs, pagination } = await getAuditLogs(orgSlug, page);
    allLogs.push(...audit_logs);
    totalPages = pagination.total_pages;
    page++;
  }

  return allLogs;
}
```

### Python

```python
import os
import requests
from typing import Dict, List

def get_audit_logs(
    org_slug: str,
    page: int = 1,
    page_size: int = 100
) -> Dict:
    """組織の監査ログを取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/audit-logs"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}
    params = {"page": page, "page_size": page_size}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

# 使用例
result = get_audit_logs("my-org")
audit_logs = result["audit_logs"]
pagination = result["pagination"]

print(f"Found {pagination['total_items']} audit logs")
for log in audit_logs:
    print(f"[{log['created_at']}] {log['code']}: {log['message']}")
    print(f"  Author: {log['author']} ({log['origin']})")

# すべてのログを取得
def get_all_audit_logs(org_slug: str) -> List[Dict]:
    """すべての監査ログを取得します。"""
    all_logs = []
    page = 1

    while True:
        result = get_audit_logs(org_slug, page=page)
        all_logs.extend(result["audit_logs"])

        if page >= result["pagination"]["total_pages"]:
            break

        page += 1

    return all_logs
```

## ベストプラクティス

### 1. 特定のイベントのフィルタリング

```typescript
async function filterAuditLogs(
  orgSlug: string,
  eventCode: string
): Promise<AuditLog[]> {
  const allLogs = await getAllAuditLogs(orgSlug);
  return allLogs.filter(log => log.code === eventCode);
}

// 使用例: データベース作成イベントのみ
const dbCreations = await filterAuditLogs('my-org', 'db-create');
```

### 2. 期間指定の検索

```typescript
async function getAuditLogsByDateRange(
  orgSlug: string,
  startDate: Date,
  endDate: Date
): Promise<AuditLog[]> {
  const allLogs = await getAllAuditLogs(orgSlug);

  return allLogs.filter(log => {
    const logDate = new Date(log.created_at);
    return logDate >= startDate && logDate <= endDate;
  });
}
```

### 3. ユーザー別のアクティビティ追跡

```typescript
async function getUserActivity(
  orgSlug: string,
  username: string
): Promise<AuditLog[]> {
  const allLogs = await getAllAuditLogs(orgSlug);
  return allLogs.filter(log => log.author === username);
}
```

## セキュリティ考慮事項

監査ログは組織のセキュリティとコンプライアンスに重要です：

1. **定期的な監視**: 不審なアクティビティを検出
2. **ログの保存**: コンプライアンス要件のため、ログを外部に保存
3. **アクセス制限**: 監査ログへのアクセスは管理者のみに制限

## 関連リンク

- [組織の取得](/docs/services/turso/docs/api-reference/organizations/retrieve.md)
- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [トークンの作成](/docs/services/turso/docs/api-reference/tokens/create.md)
