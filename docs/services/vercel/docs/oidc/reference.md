# OIDC フェデレーションリファレンス

すべての[プラン](/docs/plans)で利用可能なOIDCフェデレーションによるバックエンドアクセスのセキュリティ。

## ヘルパーライブラリ

Vercelは、クラウドプロバイダーと短期間の認証情報を交換するのを容易にするヘルパーライブラリを提供しています。これらは[@vercel/functions パッケージ](https://www.npmjs.com/package/@vercel/functions)から利用可能です。

### インストール

```bash
npm install @vercel/functions
# または
pnpm add @vercel/functions
# または
yarn add @vercel/functions
```

## AWS用ヘルパー

### awsCredentialsProvider()

`awsCredentialsProvider()` は、AWS SDKクライアントの `credentials` プロパティとして使用できる関数を返すヘルパー関数です。`AssumeRoleWithWebIdentity` 操作を呼び出して、AWS と OIDC トークンを交換します。

#### 使用例

```typescript
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
  }),
});

export async function GET() {
  const command = new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: 'file.txt',
  });

  const response = await s3client.send(command);
  return Response.json({ data: await response.Body?.transformToString() });
}
```

#### オプション

```typescript
interface AwsCredentialsProviderOptions {
  roleArn: string;              // IAMロールのARN（必須）
  sessionName?: string;         // セッション名（オプション）
  durationSeconds?: number;     // セッション期間（デフォルト: 3600秒）
}
```

## その他のクラウドプロバイダー

### getVercelOidcToken()

`getVercelOidcToken()` は、OIDCトークンを取得するヘルパー関数です：

- **ビルド時**: `VERCEL_OIDC_TOKEN` 環境変数から取得
- **ランタイム時**: `x-vercel-oidc-token` ヘッダーから取得
- **ローカル開発**: 開発用のモックトークンを返す

#### 使用例

```typescript
import { getVercelOidcToken } from '@vercel/functions/oidc';

export async function POST(request: Request) {
  const token = await getVercelOidcToken();

  // トークンを使用してバックエンドAPIにアクセス
  const response = await fetch('https://your-api.com/endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response;
}
```

#### Azure / CosmosDBの例

```typescript
import { getVercelOidcToken } from '@vercel/functions/oidc';
import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

export async function GET() {
  const token = await getVercelOidcToken();

  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  });

  const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT!,
    aadCredentials: credential,
  });

  const database = client.database('my-database');
  const container = database.container('my-container');

  const { resources } = await container.items.readAll().fetchAll();

  return Response.json({ items: resources });
}
```

## トークンクレーム

OIDCトークンには以下のクレームが含まれます：

### 標準クレーム

| クレーム | 型 | 説明 | 例 |
|---------|------|------|-----|
| `iss` | string | 発行者URL | `https://oidc.vercel.com/my-team` |
| `sub` | string | サブジェクト（識別子） | `owner:my-team:project:my-project:environment:production` |
| `aud` | string | オーディエンス | `https://vercel.com/my-team` |
| `exp` | number | 有効期限（Unixタイムスタンプ） | `1234567890` |
| `iat` | number | 発行時刻（Unixタイムスタンプ） | `1234567800` |

### Vercel固有のクレーム

| クレーム | 型 | 説明 | 例 |
|---------|------|------|-----|
| `owner_id` | string | オーナー（チーム）ID | `team_abc123` |
| `project_id` | string | プロジェクトID | `prj_xyz789` |
| `deployment_id` | string | デプロイメントID | `dpl_456def` |
| `environment` | string | 環境名 | `production` / `preview` / `development` |

### Subject (sub) クレームの構造

```
owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:[ENVIRONMENT]
```

例：
- `owner:my-team:project:my-app:environment:production`
- `owner:acme:project:website:environment:preview`
- `owner:startup:project:api:environment:development`

## エンドポイント

### JWKS エンドポイント

トークン検証用のJSON Web Key Set:

- **チーム発行者**: `https://oidc.vercel.com/[TEAM_SLUG]/.well-known/jwks`
- **グローバル発行者**: `https://oidc.vercel.com/.well-known/jwks`

### OpenID Configuration

OpenID Connect Discovery:

- **チーム発行者**: `https://oidc.vercel.com/[TEAM_SLUG]/.well-known/openid-configuration`
- **グローバル発行者**: `https://oidc.vercel.com/.well-known/openid-configuration`

## 環境変数

### ビルド時

| 変数 | 説明 |
|------|------|
| `VERCEL_OIDC_TOKEN` | ビルド時に使用可能なOIDCトークン |

### ランタイム時

トークンはリクエストヘッダー `x-vercel-oidc-token` で利用可能です。`getVercelOidcToken()` を使用して取得することを推奨します。

## サポートされる環境

### プロダクション環境

- **environment**: `production`
- **subject**: `owner:[TEAM]:project:[PROJECT]:environment:production`

### プレビュー環境

- **environment**: `preview`
- **subject**: `owner:[TEAM]:project:[PROJECT]:environment:preview`

### 開発環境

- **environment**: `development`
- **subject**: `owner:[TEAM]:project:[PROJECT]:environment:development`
- **注意**: ローカル開発ではモックトークンが使用されます

## トークンの有効期限

- **ビルド時**: ビルドの期間中のみ有効
- **ランタイム時**: 通常15分間有効
- **自動更新**: トークンは各リクエストで自動的に更新されます

## セキュリティ推奨事項

1. **トークンをログに記録しない**: トークンは機密情報として扱う
2. **トークンをクライアントに公開しない**: サーバーサイドでのみ使用
3. **有効期限を確認**: 常にトークンの有効期限を検証
4. **最小権限**: バックエンドロールには必要最小限の権限のみを付与
5. **監査ログ**: トークンの使用を監視し、異常を検出

## TypeScript型定義

```typescript
interface VercelOidcToken {
  iss: string;              // 発行者
  sub: string;              // サブジェクト
  aud: string;              // オーディエンス
  exp: number;              // 有効期限
  iat: number;              // 発行時刻
  owner_id: string;         // オーナーID
  project_id: string;       // プロジェクトID
  deployment_id: string;    // デプロイメントID
  environment: 'production' | 'preview' | 'development';
}

interface AwsCredentialsProviderOptions {
  roleArn: string;
  sessionName?: string;
  durationSeconds?: number;
}

function awsCredentialsProvider(
  options: AwsCredentialsProviderOptions
): AwsCredentialIdentityProvider;

function getVercelOidcToken(): Promise<string>;
```

## エラーハンドリング

### トークン取得の失敗

```typescript
try {
  const token = await getVercelOidcToken();
} catch (error) {
  console.error('Failed to get OIDC token:', error);
  // フォールバックまたはエラーレスポンス
}
```

### AWS認証情報の失敗

```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

try {
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
    }),
  });

  // S3操作
} catch (error) {
  console.error('AWS credential error:', error);
  return Response.json({ error: 'Authentication failed' }, { status: 500 });
}
```

## 関連ドキュメント

- [OIDC概要](/docs/oidc)
- [OIDC AWS](/docs/oidc/aws)
- [OIDC Azure](/docs/oidc/azure)
- [OIDC GCP](/docs/oidc/gcp)
- [OIDC API](/docs/oidc/api)
- [@vercel/functions パッケージ](https://www.npmjs.com/package/@vercel/functions)
