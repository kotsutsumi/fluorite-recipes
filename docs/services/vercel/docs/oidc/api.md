# 独自のAPIに接続する

セキュアバックエンドアクセスのためのOIDC連携は、[すべてのプラン](/docs/plans)で利用可能です。

独自のAPIやバックエンドサービスでVercelのOIDCトークンを検証する方法を説明します。

## トークンを検証する

Vercelのトークンを独自のAPIで受け入れるには、Vercelの JSON Web Keys (JWKs) を使用してトークンを検証する必要があります。

### JWKSエンドポイント

利用可能なJWKSエンドポイント:
- **チーム発行者**: `https://oidc.vercel.com/[TEAM_SLUG]/.well-known/jwks`
- **グローバル発行者**: `https://oidc.vercel.com/.well-known/jwks`

## jose ライブラリを使用した検証

### インストール

```bash
npm install jose
# または
pnpm add jose
# または
yarn add jose
```

### サーバー側のコード例

```typescript
import http from 'node:http';
import * as jose from 'jose';

const ISSUER_URL = 'https://oidc.vercel.com/[TEAM_SLUG]';
// またはグローバル発行者: 'https://oidc.vercel.com'

const JWKS = jose.createRemoteJWKSet(
  new URL(`${ISSUER_URL}/.well-known/jwks`)
);

const server = http.createServer(async (req, res) => {
  const token = req.headers['authorization']?.split('Bearer ')[1];

  if (!token) {
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      audience: 'https://vercel.com/[TEAM_SLUG]',
      subject: 'owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production',
    });

    // トークンが有効、payloadを使用してアクセス制御
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, claims: payload }));
  } catch (error) {
    res.statusCode = 403;
    res.end('Forbidden');
  }
});

server.listen(3000);
```

### Next.js API Routeでの例

```typescript
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const ISSUER_URL = 'https://oidc.vercel.com/[TEAM_SLUG]';
const JWKS = jose.createRemoteJWKSet(
  new URL(`${ISSUER_URL}/.well-known/jwks`)
);

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      audience: 'https://vercel.com/[TEAM_SLUG]',
    });

    // トークンクレームを使用してアクセス制御
    if (payload.environment !== 'production') {
      return NextResponse.json({ error: 'Production only' }, { status: 403 });
    }

    // 保護されたロジック
    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
```

## トークンクレームを使用したアクセス制御

### 環境ベースの制御

```typescript
const { payload } = await jose.jwtVerify(token, JWKS, {
  issuer: ISSUER_URL,
  audience: 'https://vercel.com/[TEAM_SLUG]',
});

if (payload.environment === 'production') {
  // 本番環境のみの操作
  return { access: 'full' };
} else if (payload.environment === 'preview') {
  // プレビュー環境の制限された操作
  return { access: 'limited' };
} else {
  return { error: 'Access denied' };
}
```

### プロジェクトベースの制御

```typescript
const allowedProjects = [
  'project-a',
  'project-b',
];

if (!allowedProjects.includes(payload.project_id as string)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### カスタムクレームの使用

```typescript
// トークンペイロードの例
{
  "iss": "https://oidc.vercel.com/my-team",
  "sub": "owner:my-team:project:my-project:environment:production",
  "aud": "https://vercel.com/my-team",
  "exp": 1234567890,
  "iat": 1234567800,
  "owner_id": "team_abc123",
  "project_id": "prj_xyz789",
  "deployment_id": "dpl_456def",
  "environment": "production"
}

// クレームを使用したアクセス制御
if (payload.owner_id !== 'team_abc123') {
  return { error: 'Unauthorized owner' };
}

if (payload.deployment_id) {
  // デプロイメント固有のロジック
  console.log(`Request from deployment: ${payload.deployment_id}`);
}
```

## ミドルウェアでの検証

### Express.js ミドルウェア

```typescript
import * as jose from 'jose';
import { Request, Response, NextFunction } from 'express';

const ISSUER_URL = 'https://oidc.vercel.com/[TEAM_SLUG]';
const JWKS = jose.createRemoteJWKSet(
  new URL(`${ISSUER_URL}/.well-known/jwks`)
);

export async function verifyVercelToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      audience: 'https://vercel.com/[TEAM_SLUG]',
    });

    req.vercelToken = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// 使用例
app.post('/api/protected', verifyVercelToken, (req, res) => {
  res.json({
    message: 'Protected endpoint',
    environment: req.vercelToken.environment,
  });
});
```

## Vercelからのトークン送信

### Vercel Functionからカスタム APIを呼び出す

```typescript
import { getVercelOidcToken } from '@vercel/functions/oidc';

export async function POST(request: Request) {
  const token = await getVercelOidcToken();

  const response = await fetch('https://your-api.com/endpoint', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: 'example' }),
  });

  return response;
}
```

## トラブルシューティング

### トークン検証が失敗する

1. **issuer URLが正しいか確認**: チーム発行者とグローバル発行者を混同していないか
2. **audience が正しいか確認**: チームスラッグが一致しているか
3. **トークンの有効期限を確認**: トークンが期限切れでないか
4. **JWKSエンドポイントにアクセスできるか確認**: ネットワーク設定やファイアウォールを確認

### クレームの不一致

1. **subject クレームを確認**: プロジェクト名と環境が一致しているか
2. **ワイルドカードの使用**: すべての環境を許可する場合、検証時にsubjectを指定しない

### パフォーマンスの問題

1. **JWKSのキャッシング**: `jose.createRemoteJWKSet`は自動的にキャッシュしますが、手動でキャッシュすることも可能
2. **トークンの再利用**: 同じトークンを複数のリクエストで再利用しない（新しいトークンを毎回取得）

## ベストプラクティス

1. **Always検証する**: すべてのリクエストでトークンを検証
2. **有効期限を確認**: トークンの有効期限を確認し、期限切れトークンを拒否
3. **クレームベースのアクセス制御**: トークンクレームを使用して詳細なアクセス制御を実装
4. **エラーハンドリング**: 適切なエラーメッセージとステータスコードを返す
5. **監視とログ**: トークンの使用をログに記録し、異常を監視

詳細については、[OIDC ドキュメント](/docs/oidc)および[jose ライブラリドキュメント](https://github.com/panva/jose)を参照してください。
