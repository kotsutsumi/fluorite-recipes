# Vercel REST APIを使用した統合の構築

## Vercel REST APIの使用

Vercelのドキュメントには、REST APIを使用して統合を作成する方法について、以下のAPIリファレンスドキュメントが記載されています：

- [プロジェクト環境変数の作成](/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables)
- [ログドレインを使用したログの転送](/docs/drains/reference/logs)
- [アクセストークンの作成](/docs/rest-api/vercel-api-integrations#create-an-access-token)
- [チームとのやり取り](/docs/rest-api/vercel-api-integrations#interacting-with-teams)
- [設定とのやり取り](/docs/rest-api/vercel-api-integrations#interacting-with-configurations)
- [Vercelプロジェクトとのやり取り](/docs/rest-api/vercel-api-integrations#interacting-with-vercel-projects)

## アクセストークンの作成

Vercel REST APIを使用するには、必要な[スコープ](#scopes)を含む[アクセストークン](/docs/rest-api/reference/welcome#authentication)で認証する必要があります。その後、[`Authorization`ヘッダー](/docs/rest-api#authentication)を通じてAPIトークンを提供できます。

### コードをアクセストークンに交換

統合を作成する際、[リダイレクトURL](/docs/integrations/create-integration/submit-integration#redirect-url)にクエリパラメータを付けることができます。

これらのパラメータの1つは`code`パラメータです。この短命のパラメータは30分間有効で、以下のAPIエンドポイントを使用して1回だけ長期的なアクセストークンに交換できます：

```typescript
// app/api/oauth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const response = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.VERCEL_CLIENT_ID!,
      client_secret: process.env.VERCEL_CLIENT_SECRET!,
      code: code!,
      redirect_uri: process.env.REDIRECT_URI!,
    }),
  });

  const data = await response.json();
  const { access_token, team_id, user_id } = data;

  // アクセストークンを保存
  await saveAccessToken(team_id || user_id, access_token);

  return new Response('Integration installed successfully');
}
```

### スコープ

統合が必要とする権限を定義します：

| スコープ | 説明 |
|---------|------|
| `user` | ユーザー情報の読み取り |
| `team` | チーム情報の読み取り |
| `project` | プロジェクトの読み取りと書き込み |
| `deployment` | デプロイメントの読み取りと書き込み |
| `env` | 環境変数の読み取りと書き込み |
| `logs` | ログの読み取り |
| `checks` | チェックの書き込み |

## チームとのやり取り

### チーム情報の取得

```typescript
async function getTeam(accessToken: string, teamId: string) {
  const response = await fetch(`https://api.vercel.com/v2/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

### チームメンバーの取得

```typescript
async function getTeamMembers(accessToken: string, teamId: string) {
  const response = await fetch(`https://api.vercel.com/v2/teams/${teamId}/members`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

## Vercelプロジェクトとのやり取り

### プロジェクト一覧の取得

```typescript
async function getProjects(accessToken: string, teamId?: string) {
  const url = new URL('https://api.vercel.com/v9/projects');
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.projects;
}
```

### プロジェクト詳細の取得

```typescript
async function getProject(accessToken: string, projectId: string, teamId?: string) {
  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}`);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

### プロジェクトの作成

```typescript
async function createProject(
  accessToken: string,
  name: string,
  teamId?: string
) {
  const url = new URL('https://api.vercel.com/v10/projects');
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
}
```

## 環境変数の管理

### 環境変数の作成

```typescript
async function createEnvVariable(
  accessToken: string,
  projectId: string,
  env: {
    key: string;
    value: string;
    target: ('production' | 'preview' | 'development')[];
    type?: 'encrypted' | 'plain';
  },
  teamId?: string
) {
  const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/env`);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(env),
  });

  return response.json();
}
```

### 環境変数の取得

```typescript
async function getEnvVariables(
  accessToken: string,
  projectId: string,
  teamId?: string
) {
  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/env`);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.envs;
}
```

### 環境変数の削除

```typescript
async function deleteEnvVariable(
  accessToken: string,
  projectId: string,
  envId: string,
  teamId?: string
) {
  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/env/${envId}`);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

## デプロイメントの管理

### デプロイメント一覧の取得

```typescript
async function getDeployments(
  accessToken: string,
  projectId: string,
  teamId?: string
) {
  const url = new URL('https://api.vercel.com/v6/deployments');
  url.searchParams.set('projectId', projectId);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.deployments;
}
```

### デプロイメント詳細の取得

```typescript
async function getDeployment(
  accessToken: string,
  deploymentId: string,
  teamId?: string
) {
  const url = new URL(`https://api.vercel.com/v13/deployments/${deploymentId}`);
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

## ログドレインの設定

### ログドレインの作成

```typescript
async function createLogDrain(
  accessToken: string,
  config: {
    name: string;
    url: string;
    sources: string[];
  },
  teamId?: string
) {
  const url = new URL('https://api.vercel.com/v1/integrations/log-drains');
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  return response.json();
}
```

### ログドレイン一覧の取得

```typescript
async function getLogDrains(accessToken: string, teamId?: string) {
  const url = new URL('https://api.vercel.com/v1/integrations/log-drains');
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

## Webhookの処理

### Webhookハンドラーの実装

```typescript
// app/api/webhook/route.ts
import crypto from 'crypto';

function verifySignature(payload: string, signature: string, secret: string) {
  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('x-vercel-signature');

  if (!signature || !verifySignature(payload, signature, process.env.WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const data = JSON.parse(payload);

  switch (data.type) {
    case 'deployment.created':
      await handleDeploymentCreated(data.payload);
      break;
    case 'deployment.succeeded':
      await handleDeploymentSucceeded(data.payload);
      break;
    case 'deployment.failed':
      await handleDeploymentFailed(data.payload);
      break;
  }

  return new Response('OK');
}
```

## エラーハンドリング

### API エラーの処理

```typescript
async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

### レート制限の処理

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

## ベストプラクティス

### アクセストークンの安全な保存

```typescript
// データベースにトークンを暗号化して保存
import { encrypt, decrypt } from '@/lib/crypto';

async function saveAccessToken(userId: string, token: string) {
  const encryptedToken = await encrypt(token);
  await db.tokens.create({
    data: {
      userId,
      token: encryptedToken,
    },
  });
}

async function getAccessToken(userId: string) {
  const record = await db.tokens.findUnique({
    where: { userId },
  });

  if (!record) return null;

  return await decrypt(record.token);
}
```

### キャッシング

```typescript
import { cache } from 'react';

export const getProjects = cache(async (accessToken: string, teamId?: string) => {
  // APIリクエスト
});
```

## トラブルシューティング

### 認証エラー

1. アクセストークンが有効か確認
2. 必要なスコープが付与されているか確認
3. チームIDが正しいか確認

### レート制限

1. Retry-Afterヘッダーを確認
2. 指数バックオフを実装
3. リクエストをバッチ処理

## 関連リソース

- [Vercel REST API リファレンス](https://vercel.com/docs/rest-api)
- [OAuth 2.0 ドキュメント](https://oauth.net/2/)
- [Webhook セキュリティ](https://vercel.com/docs/integrations/create-integration)
