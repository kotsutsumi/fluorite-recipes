# リソースシークレットの更新（非推奨）

⚠️ **このエンドポイントは非推奨です。** 新しいエンドポイントを使用してください: [Update Resource Secrets](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource-secrets.md)

インテグレーションリソースのシークレット（環境変数）を更新します。

## エンドポイント

```
PUT /v1/installations/{integrationConfigurationId}/products/{integrationProductIdOrSlug}/resources/{resourceId}/secrets
```

**ベースURL**: `https://api.vercel.com`

**ステータス**: 非推奨（Deprecated）

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール設定識別子 |
| `integrationProductIdOrSlug` | string | ✓ | プロダクトIDまたはスラッグ |
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

await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'DB_PASSWORD',
        value: 'new_password_value'
      }
    ]
  }
});

console.log('✅ Secret updated');
```

### 環境別のシークレット設定

```typescript
await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'DB_PASSWORD',
        value: 'default_password',
        environmentOverrides: {
          development: 'dev_password',
          preview: 'preview_password',
          production: 'prod_password'
        }
      }
    ]
  }
});

console.log('✅ Environment-specific secrets updated');
```

### プレフィックス付きシークレット

```typescript
await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'CONNECTION_STRING',
        value: 'postgresql://user:pass@host:5432/db',
        prefix: 'DB_'  // 結果: DB_CONNECTION_STRING
      }
    ]
  }
});

console.log('✅ Prefixed secret updated');
```

### 部分更新

```typescript
await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'API_KEY',
        value: 'new_api_key'
      }
    ],
    partial: true  // 指定したシークレットのみ更新、他は保持
  }
});

console.log('✅ Partial update completed');
```

### 複数シークレットの更新

```typescript
await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'DB_HOST',
        value: 'db.example.com'
      },
      {
        name: 'DB_PORT',
        value: '5432'
      },
      {
        name: 'DB_NAME',
        value: 'mydb'
      },
      {
        name: 'DB_USER',
        value: 'dbuser'
      },
      {
        name: 'DB_PASSWORD',
        value: 'secure_password'
      }
    ]
  }
});

console.log('✅ Multiple secrets updated');
```

## 重要な注意事項

### 非推奨エンドポイント

⚠️ このエンドポイントは非推奨です。以下の新しいエンドポイントを使用してください：

```
PUT /v1/installations/{integrationConfigurationId}/resources/{resourceId}/secrets
```

新しいエンドポイントでは、パスパラメータから`integrationProductIdOrSlug`が削除されています。

### 自動再デプロイについて

**重要**: このエンドポイントでシークレットを更新しても、**既存の接続プロジェクトは自動的に再デプロイされません**。

更新されたシークレットを使用するには、ユーザーが手動でプロジェクトを再デプロイする必要があります。

### 移行ガイド

#### 旧エンドポイント（非推奨）

```typescript
await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',  // ← このパラメータは不要
  resourceId: 'resource_xyz789',
  requestBody: { secrets: [...] }
});
```

#### 新エンドポイント（推奨）

```typescript
await vercel.marketplace.updateResourceSecretsById({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',  // productId不要
  requestBody: { secrets: [...] }
});
```

## シークレット管理のベストプラクティス

### 安全な値の生成

```typescript
import crypto from 'crypto';

function generateSecurePassword(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64');
}

const newPassword = generateSecurePassword();

await vercel.marketplace.updateResourceSecrets({
  integrationConfigurationId: 'iconfig_abc123',
  integrationProductIdOrSlug: 'product_database',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'DB_PASSWORD',
        value: newPassword
      }
    ]
  }
});
```

### ローテーションパターン

```typescript
async function rotateSecret(
  configId: string,
  productId: string,
  resourceId: string,
  secretName: string
) {
  const newValue = generateSecurePassword();

  try {
    await vercel.marketplace.updateResourceSecrets({
      integrationConfigurationId: configId,
      integrationProductIdOrSlug: productId,
      resourceId,
      requestBody: {
        secrets: [
          {
            name: secretName,
            value: newValue
          }
        ],
        partial: true
      }
    });

    console.log(`✅ ${secretName} rotated successfully`);
    console.log('⚠️ Manual redeployment required for connected projects');

    return newValue;
  } catch (error) {
    console.error(`❌ Failed to rotate ${secretName}: ${error.message}`);
    throw error;
  }
}

await rotateSecret(
  'iconfig_abc123',
  'product_database',
  'resource_xyz789',
  'API_KEY'
);
```

## 関連リンク

- **[Update Resource Secrets (新エンドポイント)](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource-secrets.md)** - 推奨
- [Update Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource.md)
- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
