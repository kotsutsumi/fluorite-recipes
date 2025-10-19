# Databases API - インスタンス一覧の取得

データベースのすべてのインスタンス（プライマリとレプリカ）を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases/{databaseName}/instances
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | データベース名 |

## レスポンス

```typescript
interface ListInstancesResponse {
  instances: DatabaseInstance[];
}

interface DatabaseInstance {
  uuid: string;      // インスタンスUUID
  name: string;      // ロケーションコード
  type: "primary" | "replica";
  region: string;    // リージョンコード
  hostname: string;  // 接続用ホスト名
}
```

### レスポンス例

```json
{
  "instances": [
    {
      "uuid": "0be90471-6906-11ee-8553-eaa7715aeaf2",
      "name": "lhr",
      "type": "primary",
      "region": "lhr",
      "hostname": "my-db-my-org.turso.io"
    },
    {
      "uuid": "1cf91582-7b28-33gg-a775-gccフ937cgdg4",
      "name": "nrt",
      "type": "replica",
      "region": "nrt",
      "hostname": "my-db-nrt-my-org.turso.io"
    },
    {
      "uuid": "2dg02693-8c39-44hh-b886-hdd0a48dheh5",
      "name": "syd",
      "type": "replica",
      "region": "syd",
      "hostname": "my-db-syd-my-org.turso.io"
    }
  ]
}
```

## 使用例

### cURL

```bash
curl -L 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/instances' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function listDatabaseInstances(
  organizationSlug: string,
  databaseName: string
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/instances`,
    {
      headers: { 'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}` }
    }
  );

  const data = await response.json();
  return data.instances;
}

const instances = await listDatabaseInstances('my-org', 'my-db');

// プライマリインスタンスを見つける
const primary = instances.find(i => i.type === 'primary');
console.log('Primary:', primary?.hostname);

// すべてのレプリカを一覧表示
const replicas = instances.filter(i => i.type === 'replica');
console.log('Replicas:', replicas.map(r => r.region).join(', '));
```

### インスタンス情報の表示

```typescript
function displayInstances(instances: DatabaseInstance[]) {
  console.log('\n=== Database Instances ===');

  instances.forEach(instance => {
    const marker = instance.type === 'primary' ? '★' : '○';
    console.log(`${marker} ${instance.region.toUpperCase()} (${instance.type})`);
    console.log(`   Hostname: ${instance.hostname}`);
    console.log(`   UUID: ${instance.uuid}`);
  });
}

const instances = await listDatabaseInstances('my-org', 'my-db');
displayInstances(instances);
```

---

**参考リンク**:
- [グループへのロケーション追加](./24-groups-add-location.md)
- [グループからのロケーション削除](./25-groups-remove-location.md)
