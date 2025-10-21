# リソースシークレットの更新

インテグレーションリソースのシークレット（環境変数）を更新します。

## エンドポイント

```
PUT /v1/installations/{integrationConfigurationId}/resources/{resourceId}/secrets
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール設定識別子 |
| `resourceId` | string | ✓ | リソース識別子 |

## リクエストボディ

```typescript
interface UpdateResourceSecretsRequest {
  secrets: Secret[];                    // シークレットの配列
  partial?: boolean;                    // 部分更新フラグ（オプション）
}

interface Secret {
  name: string;                         // シークレット名（必須）
  value: string;                        // シークレット値（必須）
  prefix?: string;                      // シークレットプレフィックス（オプション）
  environmentOverrides?: {              // 環境別オーバーライド（オプション）
    development?: string;               // 開発環境の値
    preview?: string;                   // プレビュー環境の値
    production?: string;                // 本番環境の値
  };
}
```

### フィールド説明

- **secrets** (必須): 更新するシークレットオブジェクトの配列
  - **name** (必須): シークレット識別子
  - **value** (必須): シークレットの内容
  - **prefix** (オプション): シークレット名のプレフィックス
  - **environmentOverrides** (オプション): "本番、プレビュー、開発環境のデプロイ間で異なる値を設定するための環境のマップ"

- **partial** (オプション): `true`の場合、すべてのシークレットを置き換える代わりに、指定されたシークレットのみを上書きします

## レスポンス

### 成功 (201)

```
空のレスポンス（ステータスコード201のみ）
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |
| 409 | 競合 |
| 422 | 処理不可能なエンティティ |

## 使用例

### 基本的なシークレット更新

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'API_KEY',
      value: 'sk_live_new_secret_key'
    }
  ]
});

console.log('✅ Secret updated successfully');
```

### 環境別のシークレット設定

```typescript
await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'DATABASE_URL',
      value: 'postgresql://user:pass@localhost:5432/dev',
      environmentOverrides: {
        production: 'postgresql://user:pass@prod-db:5432/production',
        preview: 'postgresql://user:pass@preview-db:5432/preview',
        development: 'postgresql://user:pass@localhost:5432/dev'
      }
    }
  ]
});

console.log('✅ Environment-specific secrets configured');
```

### プレフィックス付きシークレット

```typescript
await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'HOST',
      value: 'db.example.com',
      prefix: 'DB_'  // 結果: DB_HOST
    },
    {
      name: 'PORT',
      value: '5432',
      prefix: 'DB_'  // 結果: DB_PORT
    },
    {
      name: 'NAME',
      value: 'mydb',
      prefix: 'DB_'  // 結果: DB_NAME
    }
  ]
});

console.log('✅ Prefixed secrets created');
```

### 部分更新（特定のシークレットのみ）

```typescript
await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'API_KEY',
      value: 'new_api_key_value'
    }
  ],
  partial: true  // 他のシークレットは保持される
});

console.log('✅ API_KEY updated, other secrets preserved');
```

### 複数シークレットの一括更新

```typescript
await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'DB_HOST',
      value: 'new-db.example.com'
    },
    {
      name: 'DB_PORT',
      value: '5432'
    },
    {
      name: 'DB_USER',
      value: 'newuser'
    },
    {
      name: 'DB_PASSWORD',
      value: 'new_secure_password'
    },
    {
      name: 'DB_NAME',
      value: 'production_db'
    }
  ]
});

console.log('✅ All database credentials updated');
```

### 安全なシークレット生成と更新

```typescript
import crypto from 'crypto';

function generateSecureSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

const newApiKey = generateSecureSecret(32);
const newWebhookSecret = generateSecureSecret(48);

await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  secrets: [
    {
      name: 'API_KEY',
      value: newApiKey
    },
    {
      name: 'WEBHOOK_SECRET',
      value: newWebhookSecret
    }
  ]
});

console.log('✅ Secure secrets generated and updated');
```

### エラーハンドリング付き更新

```typescript
async function updateSecretsSafely(
  configId: string,
  resourceId: string,
  secrets: Secret[]
) {
  try {
    await vercel.marketplace.updateResourceSecretsById({
      integrationConfigurationId: configId,
      resourceId,
      secrets
    });

    console.log('✅ Secrets updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to update secrets');

    if (error.statusCode === 400) {
      console.error('   Invalid secret data format');
    } else if (error.statusCode === 404) {
      console.error('   Resource not found');
    } else if (error.statusCode === 422) {
      console.error('   Unprocessable entity - check secret values');
    } else {
      console.error(`   Error: ${error.message}`);
    }

    return { success: false, error: error.message };
  }
}

await updateSecretsSafely('iconfig_abc123', 'resource_xyz789', [
  {
    name: 'API_KEY',
    value: 'new_key'
  }
]);
```

### シークレットローテーション

```typescript
async function rotateSecret(
  configId: string,
  resourceId: string,
  secretName: string,
  generateNew: () => string
) {
  console.log(`🔄 Rotating secret: ${secretName}`);

  const newValue = generateNew();

  await vercel.marketplace.updateResourceSecretsById({
    integrationConfigurationId: configId,
    resourceId,
    secrets: [
      {
        name: secretName,
        value: newValue
      }
    ],
    partial: true
  });

  console.log(`✅ ${secretName} rotated successfully`);
  console.log('⚠️ Note: Connected projects need manual redeployment');

  return newValue;
}

// 使用例
const newApiKey = await rotateSecret(
  'iconfig_abc123',
  'resource_xyz789',
  'API_KEY',
  () => crypto.randomBytes(32).toString('base64url')
);
```

### 環境別の段階的ロールアウト

```typescript
async function rolloutSecretByEnvironment(
  configId: string,
  resourceId: string,
  secretName: string,
  newValue: string
) {
  // ステップ 1: 開発環境でテスト
  console.log('Step 1: Deploying to development...');
  await vercel.marketplace.updateResourceSecretsById({
    integrationConfigurationId: configId,
    resourceId,
    secrets: [
      {
        name: secretName,
        value: 'old_value',
        environmentOverrides: {
          development: newValue
        }
      }
    ],
    partial: true
  });
  console.log('✅ Development updated');

  // ステップ 2: プレビュー環境にロールアウト
  console.log('Step 2: Deploying to preview...');
  await vercel.marketplace.updateResourceSecretsById({
    integrationConfigurationId: configId,
    resourceId,
    secrets: [
      {
        name: secretName,
        value: 'old_value',
        environmentOverrides: {
          development: newValue,
          preview: newValue
        }
      }
    ],
    partial: true
  });
  console.log('✅ Preview updated');

  // ステップ 3: 本番環境にロールアウト
  console.log('Step 3: Deploying to production...');
  await vercel.marketplace.updateResourceSecretsById({
    integrationConfigurationId: configId,
    resourceId,
    secrets: [
      {
        name: secretName,
        value: newValue,
        environmentOverrides: {
          development: newValue,
          preview: newValue,
          production: newValue
        }
      }
    ],
    partial: true
  });
  console.log('✅ Production updated - Rollout complete!');
}

await rolloutSecretByEnvironment(
  'iconfig_abc123',
  'resource_xyz789',
  'API_KEY',
  'new_api_key_value'
);
```

### 複数リソースのシークレット同期

```typescript
async function syncSecretsAcrossResources(
  configId: string,
  resourceIds: string[],
  secrets: Secret[]
) {
  console.log(`Syncing secrets across ${resourceIds.length} resources...`);

  const results = [];

  for (const resourceId of resourceIds) {
    try {
      await vercel.marketplace.updateResourceSecretsById({
        integrationConfigurationId: configId,
        resourceId,
        secrets
      });

      results.push({ resourceId, success: true });
      console.log(`✅ ${resourceId}`);
    } catch (error) {
      results.push({ resourceId, success: false, error: error.message });
      console.error(`❌ ${resourceId}: ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Synced: ${successCount}/${resourceIds.length} resources`);

  return results;
}

await syncSecretsAcrossResources(
  'iconfig_abc123',
  ['resource_1', 'resource_2', 'resource_3'],
  [
    {
      name: 'SHARED_API_KEY',
      value: 'shared_key_value'
    }
  ]
);
```

### シークレット監査ログ

```typescript
interface SecretUpdate {
  timestamp: string;
  resourceId: string;
  secretName: string;
  success: boolean;
  error?: string;
}

class SecretAuditLogger {
  private logs: SecretUpdate[] = [];

  async updateAndLog(
    configId: string,
    resourceId: string,
    secretName: string,
    newValue: string
  ) {
    const log: SecretUpdate = {
      timestamp: new Date().toISOString(),
      resourceId,
      secretName,
      success: false
    };

    try {
      await vercel.marketplace.updateResourceSecretsById({
        integrationConfigurationId: configId,
        resourceId,
        secrets: [
          {
            name: secretName,
            value: newValue
          }
        ],
        partial: true
      });

      log.success = true;
      this.logs.push(log);

      console.log(`✅ ${secretName} updated and logged`);
    } catch (error) {
      log.error = error.message;
      this.logs.push(log);

      console.error(`❌ ${secretName} update failed: ${error.message}`);
      throw error;
    }
  }

  getAuditLog() {
    return this.logs;
  }

  getFailedUpdates() {
    return this.logs.filter(log => !log.success);
  }
}

const logger = new SecretAuditLogger();
await logger.updateAndLog(
  'iconfig_abc123',
  'resource_xyz789',
  'API_KEY',
  'new_value'
);
```

## 注意事項

- **自動再デプロイなし**: シークレットを更新しても、既存の接続プロジェクトは自動的に再デプロイされません
- **手動再デプロイ必須**: 更新されたシークレットを使用するには、ユーザーが手動でプロジェクトを再デプロイする必要があります
- **環境オーバーライド**: 環境ごとに異なる値を設定できます（development, preview, production）
- **部分更新**: `partial: true`を指定すると、指定したシークレットのみが更新され、他は保持されます
- **プレフィックス**: `prefix`を指定すると、シークレット名の前に自動的に追加されます
- **セキュリティ**: シークレット値は暗号化して保存され、取得時に復号化されます
- **レスポンス**: 成功時は201ステータスコードのみが返され、レスポンスボディは空です

## シークレット命名規則

### 推奨パターン

```typescript
// 良い例
const secrets = [
  { name: 'DATABASE_URL', value: '...' },
  { name: 'API_KEY', value: '...' },
  { name: 'WEBHOOK_SECRET', value: '...' }
];

// プレフィックス使用
const secrets = [
  { name: 'URL', value: '...', prefix: 'DATABASE_' },  // DATABASE_URL
  { name: 'KEY', value: '...', prefix: 'API_' }        // API_KEY
];
```

## 関連リンク

- [Update Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource.md)
- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Import Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/import-resource.md)
