# Vercel マーケットプレイス REST API

VercelマーケットプレイスのベースURLを設定するための統合サーバーを認証および使用する方法について説明します。

## 仕組み

顧客が統合を使用する際、ユーザー、Vercel、プロバイダー統合間の対話と通信のために、次の2つのAPIが使用されます：

* Vercelがプロバイダー APIを呼び出す
* プロバイダーがVercel APIを呼び出す

[ネイティブ統合の概念](/docs/integrations/create-integration/native-integration)と[ネイティブ統合フロー](/docs/integrations/marketplace-flows)を確認して詳細を学んでください。

エンドポイントが**非推奨**とマークされている場合、仕様内に一定期間残りますが、その後削除されます。エンドポイントの説明には、同等の機能を持つ他のエンドポイントへの移行方法が含まれます。

## セキュリティ

### マーケットプレイスパートナーAPI認証

#### ユーザー認証

この認証は[OpenID Connect プロトコル (OIDC)](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol)を使用します。Vercelは、Vercelの秘密鍵で署名され、Vercelの公開[JSON Web Key Sets](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) (JWKS)で検証できるJWTトークンを送信します。

**認証フロー**:

1. VercelがリクエストのAuthorizationヘッダーにJWTトークンを含めて送信
2. 統合サーバーがトークンを検証：
   - トークンの署名を確認
   - 有効期限を確認
   - クレームを検証

**トークン検証の例**:

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://vercel.com/.well-known/jwks.json')
);

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: 'https://vercel.com',
  });

  return payload;
}
```

#### サーバー間認証

統合サーバーがVercel APIを呼び出す場合、APIトークンを使用して認証します。

**APIトークンの使用**:

```typescript
const response = await fetch('https://api.vercel.com/v1/projects', {
  headers: {
    'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
  },
});
```

## プロバイダーAPIエンドポイント

統合サーバーが実装する必要があるエンドポイントです。これらのエンドポイントは、Vercelから呼び出されます。

### アカウント管理

#### アカウントの作成または取得

**エンドポイント**: `POST /marketplace/account`

**説明**: ユーザーのアカウントを作成または取得します。

**リクエストボディ**:
```typescript
{
  "teamId": "team_xxx",
  "userId": "user_xxx",
  "installationId": "installation_xxx"
}
```

**レスポンス**:
```typescript
{
  "accountId": "account_xxx",
  "status": "active" | "pending_terms",
  "termsUrl": "https://example.com/terms" // status が pending_terms の場合
}
```

### プラン管理

#### 利用可能なプランの取得

**エンドポイント**: `GET /marketplace/plans`

**説明**: 製品の利用可能な課金プランを取得します。

**クエリパラメータ**:
- `productId`: 製品ID
- `installationId`: インストールID

**レスポンス**:
```typescript
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "currency": "USD",
      "interval": "month",
      "features": [
        "5 GB ストレージ",
        "100 リクエスト/日"
      ],
      "limits": {
        "storage": 5368709120, // バイト単位
        "requests": 100
      }
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 2000,
      "currency": "USD",
      "interval": "month",
      "features": [
        "100 GB ストレージ",
        "無制限リクエスト",
        "優先サポート"
      ],
      "limits": {
        "storage": 107374182400,
        "requests": -1 // 無制限
      }
    }
  ]
}
```

### リソース管理

#### リソースの作成

**エンドポイント**: `POST /marketplace/resources`

**説明**: 新しいリソースを作成します。

**リクエストボディ**:
```typescript
{
  "teamId": "team_xxx",
  "installationId": "installation_xxx",
  "productId": "database",
  "planId": "pro",
  "configuration": {
    "name": "my-database",
    "region": "us-east-1"
  }
}
```

**レスポンス**:
```typescript
{
  "resourceId": "resource_xxx",
  "status": "active" | "provisioning" | "failed",
  "metadata": {
    "name": "my-database",
    "region": "us-east-1",
    "connectionString": "postgresql://...",
    "createdAt": "2023-10-20T10:30:00Z"
  },
  "environmentVariables": [
    {
      "key": "DATABASE_URL",
      "value": "postgresql://user:password@host:port/database",
      "target": ["production", "preview", "development"],
      "type": "encrypted"
    }
  ]
}
```

#### リソースの取得

**エンドポイント**: `GET /marketplace/resources/:id`

**説明**: リソースの詳細を取得します。

**レスポンス**:
```typescript
{
  "resourceId": "resource_xxx",
  "status": "active",
  "planId": "pro",
  "metadata": {
    "name": "my-database",
    "region": "us-east-1",
    "createdAt": "2023-10-20T10:30:00Z",
    "usage": {
      "storage": 53687091200, // 50 GB
      "requests": 1500000
    }
  }
}
```

#### リソースの更新

**エンドポイント**: `PATCH /marketplace/resources/:id`

**説明**: リソースの設定を更新します。

**リクエストボディ**:
```typescript
{
  "configuration": {
    "name": "updated-database-name"
  }
}
```

#### プランの変更

**エンドポイント**: `PATCH /marketplace/resources/:id/plan`

**説明**: リソースの課金プランを変更します。

**リクエストボディ**:
```typescript
{
  "newPlanId": "enterprise"
}
```

**レスポンス**:
```typescript
{
  "resourceId": "resource_xxx",
  "oldPlanId": "pro",
  "newPlanId": "enterprise",
  "effectiveDate": "2023-10-20T10:30:00Z"
}
```

#### リソースの削除

**エンドポイント**: `DELETE /marketplace/resources/:id`

**説明**: リソースを削除します。

**レスポンス**:
```typescript
{
  "resourceId": "resource_xxx",
  "status": "deleted",
  "deletedAt": "2023-10-20T10:30:00Z"
}
```

#### リソースのプロジェクトへの接続

**エンドポイント**: `POST /marketplace/resources/:id/connect`

**説明**: リソースをVercelプロジェクトに接続します。

**リクエストボディ**:
```typescript
{
  "projectId": "prj_xxx",
  "environmentVariables": true // 環境変数を自動追加
}
```

**レスポンス**:
```typescript
{
  "resourceId": "resource_xxx",
  "projectId": "prj_xxx",
  "connectedAt": "2023-10-20T10:30:00Z",
  "environmentVariables": [
    {
      "key": "DATABASE_URL",
      "target": ["production", "preview", "development"]
    }
  ]
}
```

### デプロイメントアクション

#### アクションの宣言

**エンドポイント**: `GET /marketplace/resources/:id/actions`

**説明**: リソースの利用可能なデプロイメントアクションを取得します。

**レスポンス**:
```typescript
{
  "actions": [
    {
      "id": "create-branch",
      "name": "データベースブランチを作成",
      "description": "プレビューデプロイメント用の新しいデータベースブランチを作成します",
      "type": "deployment",
      "triggers": ["deployment.created"],
      "configuration": {
        "branchName": {
          "type": "string",
          "description": "ブランチ名",
          "default": "preview-${deployment.id}"
        }
      },
      "suggestions": {
        "environments": ["preview"],
        "enabled": true
      }
    }
  ]
}
```

#### アクションの実行

**エンドポイント**: `POST /marketplace/webhook`

**説明**: デプロイメントアクションを実行します。

**リクエストボディ**:
```typescript
{
  "type": "deployment.created",
  "payload": {
    "deploymentId": "dpl_xxx",
    "projectId": "prj_xxx",
    "resourceId": "resource_xxx",
    "action": {
      "id": "create-branch",
      "configuration": {
        "branchName": "preview-abc123"
      }
    }
  }
}
```

**レスポンス**:
```typescript
{
  "status": "success",
  "message": "データベースブランチが作成されました",
  "data": {
    "branchId": "branch_xxx",
    "connectionString": "postgresql://..."
  },
  "logs": [
    {
      "timestamp": "2023-10-20T10:30:00Z",
      "message": "ブランチ作成を開始"
    },
    {
      "timestamp": "2023-10-20T10:30:15Z",
      "message": "ブランチが正常に作成されました"
    }
  ]
}
```

## Vercel APIエンドポイント

統合サーバーがVercelに対して呼び出すことができるエンドポイントです。

### プロジェクト環境変数

#### 環境変数の作成

**エンドポイント**: `POST https://api.vercel.com/v10/projects/:projectId/env`

**リクエストボディ**:
```typescript
{
  "key": "DATABASE_URL",
  "value": "postgresql://...",
  "type": "encrypted",
  "target": ["production", "preview", "development"]
}
```

### デプロイメント

#### デプロイメント情報の取得

**エンドポイント**: `GET https://api.vercel.com/v13/deployments/:deploymentId`

## エラーハンドリング

すべてのエンドポイントで適切なHTTPステータスコードとエラーメッセージを返してください：

```typescript
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "リソースが見つかりません",
    "details": "ID 'resource_xxx' のリソースは存在しません",
    "statusCode": 404
  }
}
```

**一般的なエラーコード**:
- `400`: 不正なリクエスト
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソースが見つからない
- `409`: 競合（リソースが既に存在するなど）
- `500`: サーバーエラー

## ベストプラクティス

- **認証**: すべてのリクエストでJWT トークンを検証
- **レート制限**: API レート制限を実装
- **ログ**: すべてのAPI呼び出しをログに記録
- **モニタリング**: APIのパフォーマンスと可用性を監視
- **バージョニング**: APIバージョンを管理
- **ドキュメント**: API仕様を詳細に文書化
