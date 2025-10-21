# Rate Limiting SDK

`@vercel/firewall` パッケージを使用して、コード内でカスタムレートリミットルールを設定できます。以下のような場合に便利です：

- バックエンドのリクエストにレート制限を設定する必要がある
- ダッシュボードのカスタムルール設定では不可能な追加条件を使用したい場合

## `@vercel/firewall` の使用

### インストール

```bash
npm install @vercel/firewall
# または
pnpm add @vercel/firewall
# または
yarn add @vercel/firewall
```

### `@vercel/firewall` ルールの作成

1. [ダッシュボード](https://vercel.com/dashboard/)から、レート制限を設定するプロジェクトを選択
2. 右上の「Configure」を選択し、「+ New Rule」を選択
3. ルールを以下のように設定：
   - 名前を入力（例：「Firewall api rule」）
   - 最初の「If」条件で `@vercel/firewall` を選択
   - レートリミット ID に `update-object` を使用
   - レートリミットとその他のデフォルト値を使用
4. 「Save Rule」を選択
5. 変更を適用：
   - 「Review Changes」ボタンをクリック
   - 「Publish」で本番デプロイメントに適用

### コード内でのレート制限の設定

以下の例では、IPに基づいてリクエストのレート制限を設定します：

```typescript
import { checkRateLimit } from '@vercel/firewall';

export async function POST(request: Request) {
  const { rateLimited } = await checkRateLimit('update-object', { request });

  if (rateLimited) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 通常の処理を続行
  // ... ビジネスロジック

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
```

## カスタムキーによるレート制限

IPアドレス以外のキーでレート制限を行う場合：

```typescript
import { checkRateLimit } from '@vercel/firewall';

export async function POST(request: Request) {
  // ユーザーIDベースのレート制限
  const userId = request.headers.get('x-user-id');

  const { rateLimited } = await checkRateLimit('api-per-user', {
    request,
    key: userId || 'anonymous',
  });

  if (rateLimited) {
    return new Response('Too many requests', { status: 429 });
  }

  // 処理を続行
}
```

## 複数のレート制限の組み合わせ

異なる条件で複数のレート制限を適用する例：

```typescript
import { checkRateLimit } from '@vercel/firewall';

export async function POST(request: Request) {
  // グローバルレート制限（IPベース）
  const { rateLimited: globalLimit } = await checkRateLimit('global-limit', {
    request,
  });

  if (globalLimit) {
    return new Response('Global rate limit exceeded', { status: 429 });
  }

  // ユーザー固有のレート制限
  const userId = request.headers.get('x-user-id');
  const { rateLimited: userLimit } = await checkRateLimit('user-limit', {
    request,
    key: userId || 'anonymous',
  });

  if (userLimit) {
    return new Response('User rate limit exceeded', { status: 429 });
  }

  // 処理を続行
}
```

## レート制限情報の取得

残りのリクエスト数や制限情報を取得する：

```typescript
import { checkRateLimit } from '@vercel/firewall';

export async function GET(request: Request) {
  const result = await checkRateLimit('api-limit', { request });

  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
  });

  if (result.rateLimited) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: result.reset,
      }),
      {
        status: 429,
        headers,
      }
    );
  }

  return new Response(
    JSON.stringify({ data: 'success' }),
    {
      status: 200,
      headers,
    }
  );
}
```

## Next.js ミドルウェアでの使用

ミドルウェアでレート制限を適用する例：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@vercel/firewall';

export async function middleware(request: NextRequest) {
  // APIルートに対してのみレート制限を適用
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const { rateLimited } = await checkRateLimit('api-middleware', {
      request,
    });

    if (rateLimited) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## TypeScript型定義

```typescript
interface RateLimitResult {
  rateLimited: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

interface RateLimitOptions {
  request: Request;
  key?: string; // カスタムキー（省略時はIPアドレス）
}

function checkRateLimit(
  ruleId: string,
  options: RateLimitOptions
): Promise<RateLimitResult>;
```

## ベストプラクティス

1. **適切なルールID**: ルールIDは用途を明確に示す名前を使用
2. **エラーハンドリング**: レート制限エラーには適切なメッセージとステータスコードを返す
3. **ヘッダーの提供**: クライアントに制限情報をヘッダーで提供
4. **階層的な制限**: グローバル制限とユーザー固有制限を組み合わせる
5. **テスト**: 本番環境適用前に十分にテスト

## 制限事項

- ダッシュボードでルールを作成する必要がある
- レート制限はVercelのエッジネットワークで実行される
- ローカル開発環境では、レート制限は適用されない（常に`rateLimited: false`を返す）

詳細については、[@vercel/firewall のドキュメント](https://vercel.com/docs/security/vercel-waf)を参照してください。
