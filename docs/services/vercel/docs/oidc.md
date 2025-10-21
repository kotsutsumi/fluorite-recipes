# OpenID Connect (OIDC) Federation

## 概要

OpenID Connect (OIDC) フェデレーションは、[すべてのプラン](/docs/plans)で利用可能な、バックエンドへのアクセスを安全に保護する機能です。

長期間有効で永続的な認証情報をバックエンドに作成すると、これらの認証情報が漏洩やハッキングされるセキュリティリスクが高まります。Vercelの OIDC Identity Provider (IdP) によって署名された、短期間で非永続的なトークンを発行することで、このリスクを軽減できます。

## メリット

### 永続的な認証情報が不要

- シークレットキーやアクセストークンを環境変数に保存する必要がない
- 認証情報の漏洩リスクを大幅に削減
- 認証情報のローテーション管理が不要

### きめ細かいアクセス制御

- プロジェクト、環境、ブランチごとに異なるアクセス権限を設定
- トークンのクレームに基づいた詳細なアクセス制御
- 最小権限の原則を簡単に実装

### ローカル開発環境へのアクセス

- ローカル開発環境でも同じOIDCトークンを使用可能
- 開発と本番で一貫した認証フロー
- セキュアな開発環境の実現

## はじめに

バックエンドを安全に接続するには、以下のプロバイダーとの連携が可能です：

- [Amazon Web Services (AWS)](/docs/oidc/aws) - IAMロールとの連携
- [Google Cloud Platform (GCP)](/docs/oidc/gcp) - Workload Identity Federation
- [Microsoft Azure](/docs/oidc/azure) - Workload Identity
- [独自のAPI](/docs/oidc/api) - カスタムトークン検証

## 発行者モード

発行者URLの設定には2つのオプションがあります：

### 1. チーム発行者（推奨）

- チーム専用のURL：`https://oidc.vercel.com/[TEAM_SLUG]`
- より細かいアクセス制御が可能
- チーム固有のトークンクレーム

**メリット**:
- チーム間での分離
- より強力なセキュリティポリシー
- 監査とコンプライアンスの簡素化

### 2. グローバル発行者

- 汎用的なURL：`https://oidc.vercel.com`
- すべてのVercelユーザーで共有
- シンプルな設定

**使用シーン**:
- 単一チームの小規模プロジェクト
- レガシーシステムとの互換性

## OIDC トークンフェデレーションの仕組み

### ビルド時

1. ビルド実行時に、Vercelは自動的に新しいトークンを生成
2. `VERCEL_OIDC_TOKEN` 環境変数に割り当て
3. トークンはビルドの期間中のみ有効

### ランタイム時（Vercel Functions）

1. Functionの実行時に、各リクエストに対して新しいトークンを生成
2. `x-vercel-oidc-token` ヘッダーで利用可能
3. トークンは短期間（通常15分）のみ有効

### トークンの内容

OIDCトークンには以下のクレームが含まれます：

```json
{
  "iss": "https://oidc.vercel.com/[TEAM_SLUG]",
  "sub": "owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:[ENV]",
  "aud": "https://vercel.com/[TEAM_SLUG]",
  "exp": 1234567890,
  "iat": 1234567800,
  "owner_id": "[OWNER_ID]",
  "project_id": "[PROJECT_ID]",
  "deployment_id": "[DEPLOYMENT_ID]",
  "environment": "production"
}
```

## 使用例

### AWS S3へのアクセス

```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const s3 = new S3Client({
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

  const response = await s3.send(command);
  const data = await response.Body?.transformToString();

  return Response.json({ content: data });
}
```

### Google Cloud Storageへのアクセス

```typescript
import { Storage } from '@google-cloud/storage';
import { getVercelOidcToken } from '@vercel/functions/oidc';

export async function GET() {
  const token = await getVercelOidcToken();

  const storage = new Storage({
    authClient: {
      getAccessToken: async () => {
        // トークンをGCPの認証情報と交換
        return { token };
      },
    },
  });

  const [files] = await storage.bucket('my-bucket').getFiles();
  return Response.json({ files: files.map(f => f.name) });
}
```

### カスタムAPIでのトークン検証

```typescript
import * as jose from 'jose';

const ISSUER_URL = 'https://oidc.vercel.com/[TEAM_SLUG]';
const JWKS = jose.createRemoteJWKSet(
  new URL(`${ISSUER_URL}/.well-known/jwks`)
);

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      audience: 'https://vercel.com/[TEAM_SLUG]',
    });

    // トークンが有効、payloadを使用してアクセス制御
    return Response.json({ success: true, claims: payload });
  } catch (error) {
    return Response.json({ error: 'Invalid token' }, { status: 403 });
  }
}
```

## トークンのクレームを使用したアクセス制御

### 環境ベースのアクセス制御

```typescript
if (payload.environment === 'production') {
  // 本番環境のみの操作
} else {
  // プレビュー環境の制限された操作
}
```

### プロジェクトベースのアクセス制御

```typescript
const allowedProjects = ['project-a', 'project-b'];
if (!allowedProjects.includes(payload.project_id)) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

### オーナーベースのアクセス制御

```typescript
if (payload.owner_id !== expectedOwnerId) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

## ベストプラクティス

1. **チーム発行者を使用**: より強力なセキュリティのためにチーム発行者モードを推奨
2. **最小権限**: バックエンドロールには必要最小限の権限のみを付与
3. **トークンの検証**: 常にissuer、audience、subjectを検証
4. **有効期限の確認**: トークンの有効期限を確認し、期限切れトークンを拒否
5. **ログと監視**: OIDCトークンの使用をログに記録し、異常を監視

## セキュリティ考慮事項

### トークンの保護

- トークンをログに記録しない
- トークンをクライアント側に公開しない
- トークンを環境変数として保存しない（ランタイム時は自動的に提供される）

### トークンの有効期限

- ビルド時トークン: ビルドの期間中のみ有効
- ランタイムトークン: 通常15分間有効
- 期限切れトークンは自動的に拒否される

### ネットワークセキュリティ

- TLS/HTTPSを使用してトークンを送信
- トークン交換エンドポイントへのアクセスを制限
- ファイアウォールルールで追加の保護

## トラブルシューティング

### トークンが取得できない

1. `@vercel/functions` パッケージがインストールされているか確認
2. Vercel Functionsを使用しているか確認（Edge Runtimeではサポートされていない可能性あり）
3. 環境変数が正しく設定されているか確認

### トークン検証が失敗する

1. issuer URLが正しいか確認
2. audience が正しいか確認
3. トークンの有効期限を確認
4. JWKSエンドポイントにアクセスできるか確認

### バックエンドアクセスが拒否される

1. バックエンドでOIDCプロバイダーが正しく設定されているか確認
2. トラストポリシーまたはWorkload Identityが正しく設定されているか確認
3. 必要な権限がロールに付与されているか確認

## 関連ドキュメント

- [OIDC AWS](/docs/oidc/aws)
- [OIDC Azure](/docs/oidc/azure)
- [OIDC GCP](/docs/oidc/gcp)
- [OIDC API](/docs/oidc/api)
- [OIDC Reference](/docs/oidc/reference)
- [Functions](/docs/functions)
- [Environment Variables](/docs/projects/environment-variables)
