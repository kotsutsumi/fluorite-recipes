# Databases API - データベース設定の更新

データベースの設定を更新します。サイズ制限、読み書きブロック、削除保護などを設定できます。

## エンドポイント

```
PATCH /v1/organizations/{organizationSlug}/databases/{databaseName}/configuration
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
Content-Type: application/json
```

### リクエストボディ

```typescript
interface UpdateConfigurationRequest {
  size_limit?: string;        // 最大サイズ（例: "1gb", "500mb"）
  allow_attach?: boolean;     // アタッチ許可（非推奨）
  block_reads?: boolean;      // 読み取りブロック
  block_writes?: boolean;     // 書き込みブロック
  delete_protection?: boolean; // 削除保護
}
```

すべてのパラメータはオプションです。指定されたパラメータのみが更新されます。

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface UpdateConfigurationResponse {
  size_limit: string;
  allow_attach: boolean;
  block_reads: boolean;
  block_writes: boolean;
  delete_protection: boolean;
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

**サイズ制限の設定**:

```bash
curl -L -X PATCH 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/configuration' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "size_limit": "1gb"
  }'
```

**削除保護の有効化**:

```bash
curl -L -X PATCH 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/configuration' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "delete_protection": true
  }'
```

**書き込みブロックの有効化**:

```bash
curl -L -X PATCH 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/configuration' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "block_writes": true
  }'
```

### JavaScript / TypeScript

```typescript
async function updateDatabaseConfiguration(
  organizationSlug: string,
  databaseName: string,
  config: Partial<UpdateConfigurationRequest>
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/configuration`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// サイズ制限を設定
await updateDatabaseConfiguration('my-org', 'my-db', {
  size_limit: '1gb'
});

// 削除保護を有効化
await updateDatabaseConfiguration('my-org', 'my-db', {
  delete_protection: true
});

// 複数の設定を同時に更新
await updateDatabaseConfiguration('my-org', 'my-db', {
  size_limit: '500mb',
  delete_protection: true,
  block_writes: false
});
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

// 設定の更新
await turso.databases.updateConfiguration("my-db", {
  size_limit: "1gb",
  delete_protection: true
});
```

## 設定パラメータの詳細

### size_limit

データベースの最大サイズを制限します。

**形式**:
- バイト数: `"1073741824"`
- 単位付き: `"1gb"`, `"500mb"`, `"100kb"`

**例**:
```typescript
// 1GB制限
{ size_limit: "1gb" }

// 500MB制限
{ size_limit: "500mb" }

// 無制限（プランによる）
{ size_limit: "0" }
```

### block_reads / block_writes

データベースへの読み取り/書き込みアクセスを制御します。

**ユースケース**:
- メンテナンス中のアクセス制限
- データ移行時の整合性保証
- 緊急時のデータ保護

**例**:
```typescript
// メンテナンスモード（読み取り専用）
await updateDatabaseConfiguration('my-org', 'my-db', {
  block_writes: true,
  block_reads: false
});

// 完全ブロック
await updateDatabaseConfiguration('my-org', 'my-db', {
  block_writes: true,
  block_reads: true
});

// 通常モードに戻す
await updateDatabaseConfiguration('my-org', 'my-db', {
  block_writes: false,
  block_reads: false
});
```

### delete_protection

誤った削除を防ぎます。

**重要**: 削除保護が有効なデータベースは削除できません。削除する前に保護を無効化する必要があります。

**例**:
```typescript
// 本番データベースの保護
await updateDatabaseConfiguration('my-org', 'production-db', {
  delete_protection: true
});

// 一時的なデータベースは保護しない
await updateDatabaseConfiguration('my-org', 'temp-db', {
  delete_protection: false
});
```

## 実用的な例

### メンテナンスモードの切り替え

```typescript
async function setMaintenanceMode(
  organizationSlug: string,
  databaseName: string,
  enabled: boolean
) {
  console.log(`メンテナンスモード: ${enabled ? 'ON' : 'OFF'}`);

  await updateDatabaseConfiguration(organizationSlug, databaseName, {
    block_writes: enabled,
    block_reads: false  // 読み取りは許可
  });

  console.log('✓ メンテナンスモード設定完了');
}

// メンテナンス開始
await setMaintenanceMode('my-org', 'my-db', true);

// データ移行やメンテナンス作業...

// メンテナンス終了
await setMaintenanceMode('my-org', 'my-db', false);
```

### 本番データベースの保護設定

```typescript
async function protectProductionDatabase(
  organizationSlug: string,
  databaseName: string
) {
  console.log('本番データベースの保護設定を適用中...');

  await updateDatabaseConfiguration(organizationSlug, databaseName, {
    delete_protection: true,
    size_limit: '10gb'  // 適切なサイズ制限
  });

  console.log('✓ 保護設定完了:');
  console.log('  - 削除保護: 有効');
  console.log('  - サイズ制限: 10GB');
}

await protectProductionDatabase('my-org', 'production-db');
```

### 段階的なサイズ拡張

```typescript
async function expandDatabaseSize(
  organizationSlug: string,
  databaseName: string,
  targetSize: string
) {
  const currentConfig = await getDatabaseConfiguration(
    organizationSlug,
    databaseName
  );

  console.log(`現在のサイズ制限: ${currentConfig.size_limit} bytes`);
  console.log(`新しいサイズ制限: ${targetSize}`);

  const confirmed = confirm('サイズ制限を変更しますか？');
  if (!confirmed) {
    console.log('キャンセルされました');
    return;
  }

  await updateDatabaseConfiguration(organizationSlug, databaseName, {
    size_limit: targetSize
  });

  console.log('✓ サイズ制限を更新しました');
}

await expandDatabaseSize('my-org', 'my-db', '5gb');
```

## ベストプラクティス

### 1. 本番データベースには必ず削除保護を設定

```typescript
async function setupProductionDatabase(name: string, group: string) {
  // データベース作成
  const db = await createDatabase('my-org', { name, group });

  // すぐに削除保護を有効化
  await updateDatabaseConfiguration('my-org', name, {
    delete_protection: true
  });

  return db;
}
```

### 2. メンテナンス前後の状態管理

```typescript
async function performMaintenance(
  organizationSlug: string,
  databaseName: string,
  maintenanceTask: () => Promise<void>
) {
  // 現在の設定を保存
  const originalConfig = await getDatabaseConfiguration(
    organizationSlug,
    databaseName
  );

  try {
    // メンテナンスモードに切り替え
    await updateDatabaseConfiguration(organizationSlug, databaseName, {
      block_writes: true
    });

    // メンテナンス作業を実行
    await maintenanceTask();

  } finally {
    // 元の設定に戻す
    await updateDatabaseConfiguration(organizationSlug, databaseName, {
      block_writes: originalConfig.block_writes
    });
  }
}
```

### 3. サイズ制限の監視と自動拡張

```typescript
async function monitorAndExpandSize(
  organizationSlug: string,
  databaseName: string
) {
  const usage = await getDatabaseUsage(organizationSlug, databaseName);
  const config = await getDatabaseConfiguration(organizationSlug, databaseName);

  const usedBytes = usage.total.storage_bytes;
  const limitBytes = parseInt(config.size_limit);
  const usagePercent = (usedBytes / limitBytes) * 100;

  console.log(`使用率: ${usagePercent.toFixed(2)}%`);

  // 80%を超えたら警告
  if (usagePercent > 80) {
    console.warn('⚠️ ストレージ使用率が80%を超えています');

    // 90%を超えたら自動拡張
    if (usagePercent > 90) {
      const newLimit = limitBytes * 1.5; // 1.5倍に拡張
      await updateDatabaseConfiguration(organizationSlug, databaseName, {
        size_limit: newLimit.toString()
      });
      console.log('✓ サイズ制限を自動拡張しました');
    }
  }
}
```

## エラーハンドリング

```typescript
async function updateConfigurationSafely(
  organizationSlug: string,
  databaseName: string,
  config: Partial<UpdateConfigurationRequest>
) {
  try {
    const result = await updateDatabaseConfiguration(
      organizationSlug,
      databaseName,
      config
    );
    console.log('✓ 設定を更新しました');
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('✗ 設定の更新に失敗:', error.message);
    }
    throw error;
  }
}
```

---

**参考リンク**:
- [データベース設定の取得](./08-databases-configuration.md)
- [データベースの取得](./07-databases-retrieve.md)
- [データベース使用量の取得](./10-databases-usage.md)
