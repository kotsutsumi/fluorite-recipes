# Amazon Web Services (AWS)に接続する

セキュアなバックエンドアクセスのためのOIDCフェデレーションは、[すべてのプラン](/docs/plans)で利用可能です。

AWSでのOIDCサポートと詳細なユーザーガイドについては、[AWS OIDCドキュメント](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)を参照してください。

## AWS アカウントの設定

### 1. OIDCアイデンティティプロバイダーの作成

1. [AWS Console](https://console.aws.amazon.com/)に移動
2. IAM > Identity Providersに移動
3. 「Add Provider」を選択
4. プロバイダータイプで「OpenID Connect」を選択
5. プロバイダーURLを入力:
   - **チーム**: `https://oidc.vercel.com/[TEAM_SLUG]`
   - **グローバル**: `https://oidc.vercel.com`
6. オーディエンスフィールドに `https://vercel.com/[TEAM_SLUG]` を入力
7. 「Add Provider」を選択

### 2. IAMロールの作成

[IAMロール](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)には、ロールを引き受けることができる「プリンシパル」を記述する「トラストリレーションシップ」が必要です。

#### チーム発行者モードのトラストポリシー例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::[YOUR_AWS_ACCOUNT_ID]:oidc-provider/oidc.vercel.com/[TEAM_SLUG]"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.vercel.com/[TEAM_SLUG]:aud": "https://vercel.com/[TEAM_SLUG]",
          "oidc.vercel.com/[TEAM_SLUG]:sub": "owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production"
        }
      }
    }
  ]
}
```

#### グローバル発行者モードのトラストポリシー例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::[YOUR_AWS_ACCOUNT_ID]:oidc-provider/oidc.vercel.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.vercel.com:aud": "https://vercel.com/[TEAM_SLUG]",
          "oidc.vercel.com:sub": "owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production"
        }
      }
    }
  ]
}
```

### 3. IAMポリシーのアタッチ

ロールに必要な権限を付与するポリシーをアタッチします。

#### S3アクセスポリシーの例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-bucket"
    }
  ]
}
```

## Vercelでの使用

### 環境変数の設定

プロジェクト設定で以下の環境変数を設定：

- `AWS_REGION`: AWSリージョン（例：`us-east-1`）
- `AWS_ROLE_ARN`: IAMロールのARN（例：`arn:aws:iam::123456789012:role/VercelRole`）

### コード例

#### S3へのアクセス

```typescript
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
  }),
});

// ファイルの取得
export async function GET() {
  const command = new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: 'file.txt',
  });

  const response = await s3.send(command);
  const data = await response.Body?.transformToString();

  return Response.json({ content: data });
}

// ファイルのアップロード
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const command = new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: file.name,
    Body: Buffer.from(await file.arrayBuffer()),
  });

  await s3.send(command);

  return Response.json({ success: true });
}
```

#### DynamoDBへのアクセス

```typescript
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const dynamodb = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
  }),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const command = new GetItemCommand({
    TableName: 'MyTable',
    Key: {
      id: { S: id! },
    },
  });

  const response = await dynamodb.send(command);

  return Response.json({ item: response.Item });
}
```

## 条件の詳細設定

### 環境ベースのアクセス制御

本番環境のみアクセスを許可：

```json
{
  "Condition": {
    "StringEquals": {
      "oidc.vercel.com/[TEAM_SLUG]:aud": "https://vercel.com/[TEAM_SLUG]",
      "oidc.vercel.com/[TEAM_SLUG]:sub": "owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production"
    }
  }
}
```

### ワイルドカードを使用した柔軟なアクセス

すべての環境を許可：

```json
{
  "Condition": {
    "StringEquals": {
      "oidc.vercel.com/[TEAM_SLUG]:aud": "https://vercel.com/[TEAM_SLUG]"
    },
    "StringLike": {
      "oidc.vercel.com/[TEAM_SLUG]:sub": "owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:*"
    }
  }
}
```

## トラブルシューティング

### AssumeRoleWithWebIdentity が失敗する

1. OIDCプロバイダーが正しく設定されているか確認
2. トラストポリシーのARNが正しいか確認
3. audience と subject の値が一致しているか確認

### 権限エラー

1. IAMロールに必要なポリシーがアタッチされているか確認
2. リソースARNが正しいか確認
3. アクションが許可されているか確認

### トークンの有効期限切れ

トークンは自動的にリフレッシュされますが、長時間実行される操作では注意が必要です。

## ベストプラクティス

1. **最小権限の原則**: 必要最小限の権限のみを付与
2. **環境ごとに異なるロール**: 本番環境とプレビュー環境で異なるロールを使用
3. **監査ログ**: CloudTrailでOIDCトークンの使用を監視
4. **リソースタグ**: AWSリソースにタグを付けて管理を簡素化

詳細については、[OIDC ドキュメント](/docs/oidc)および[AWS IAM ドキュメント](https://docs.aws.amazon.com/IAM/latest/UserGuide/)を参照してください。
