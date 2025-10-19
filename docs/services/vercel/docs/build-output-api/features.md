# Build Output API - 機能

Build Output APIを通じて一般的なVercelプラットフォーム機能を実装する方法。

## 概要

このページでは、Build Output APIを使用してVercelプラットフォームの主要機能を実装する方法を説明します。

## 1. 高レベルルーティング

### vercel.jsonの使用

`vercel.json`でルーティング設定を行います。

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### ルーティング変換

`@vercel/routing-utils`の`getTransformedRoutes()`を使用してルーティング構文を変換します。

```typescript
import { getTransformedRoutes } from '@vercel/routing-utils';

const routes = getTransformedRoutes({
  cleanUrls: true,
  trailingSlash: false,
  redirects: [
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true
    }
  ]
});
```

### cleanUrlsの特別処理

`cleanUrls`機能を使用する場合、拡張子なしのファイルアクセスを有効にします：

```typescript
// .html拡張子を削除
const routes = [
  {
    src: '/about',
    dest: '/about.html'
  }
];
```

## 2. Edge Middleware

HTTPリクエストライフサイクルにミドルウェア関数を追加します。

### 概要

- Edge Runtime関数として実装
- ルートの`middlewarePath`プロパティで設定

### 実装例

**設定（config.json）:**

```json
{
  "version": 3,
  "routes": [
    {
      "src": "/api/.*",
      "middlewarePath": "middleware",
      "continue": true
    }
  ]
}
```

**ミドルウェア関数:**

```typescript
// .vercel/output/functions/middleware.func/index.ts
export default async function middleware(request: Request) {
  // 認証チェック
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !isValidToken(authHeader)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 次のハンドラーに続ける
  return new Response(null, {
    headers: {
      'x-middleware-next': '1'
    }
  });
}

function isValidToken(token: string): boolean {
  // トークン検証ロジック
  return token === 'valid-token';
}
```

### ユースケース

- 認証・認可
- リクエストロギング
- レート制限
- ヘッダー操作
- A/Bテスト

## 3. Draft Mode（ドラフトモード）

プリレンダー関数のキャッシュをバイパスします。

### 概要

- ランダム化された`bypassToken`が必要
- 特定のCookieを設定してアクティブ化

### 実装

**1. バイパストークンの生成:**

```typescript
import { randomBytes } from 'crypto';

const bypassToken = randomBytes(32).toString('hex');
```

**2. プリレンダー設定:**

```json
{
  "expiration": false,
  "allowQuery": ["url"],
  "bypassToken": "ランダムに生成されたトークン"
}
```

**3. Draft Mode API:**

```typescript
// /api/draft エンドポイント
export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  // Cookieを設定してDraft Modeを有効化
  return new Response(null, {
    status: 307,
    headers: {
      'Location': url || '/',
      'Set-Cookie': `__prerender_bypass=${bypassToken}; Path=/; HttpOnly; SameSite=Lax`
    }
  });
}
```

### 動作フロー

1. `/api/draft?url=/preview-page`にアクセス
2. バイパストークン付きCookieが設定される
3. プリレンダーページがキャッシュをバイパスして最新コンテンツを表示

## 4. オンデマンドISR（Incremental Static Regeneration）

プリレンダー関数のキャッシュを無効化します。

### 概要

- `bypassToken`を使用
- 特定のヘッダーでリクエストしてキャッシュを無効化

### 実装

**1. バイパストークンの設定:**

```json
{
  "expiration": 86400,
  "bypassToken": "ランダムに生成されたトークン"
}
```

**2. 再検証API:**

```typescript
// /api/revalidate エンドポイント
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  const secret = searchParams.get('secret');

  // シークレット検証
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  // 特定のパスを再検証
  await fetch(`https://yourdomain.com${path}`, {
    headers: {
      'x-prerender-revalidate': bypassToken
    }
  });

  return new Response(JSON.stringify({ revalidated: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 使用方法

```bash
curl "https://yourdomain.com/api/revalidate?path=/blog/post-1&secret=your-secret"
```

### ユースケース

- コンテンツ更新時の即時反映
- CMSからのWebhook連携
- 動的コンテンツの更新

## パフォーマンス最適化

### キャッシュ戦略

1. **静的コンテンツ**: 長期キャッシュ
2. **動的コンテンツ**: 短期キャッシュまたはISR
3. **認証が必要なコンテンツ**: キャッシュなし

### Edge Middlewareのベストプラクティス

- 軽量な処理のみを実行
- 重い計算はサーバーレス関数に委譲
- 必要最小限のデータのみを取得

## セキュリティ考慮事項

1. **バイパストークンの保護**
   - ランダムで予測不可能なトークンを使用
   - 環境変数に安全に保存

2. **認証の実装**
   - Edge Middlewareで早期に認証チェック
   - トークンベースの認証を推奨

3. **レート制限**
   - 再検証エンドポイントにレート制限を実装
   - 不正アクセスの防止

## 関連リンク

- [Build Output API 概要](/docs/build-output-api)
- [Build Output API 設定](/docs/build-output-api/configuration)
- [Build Output API プリミティブ](/docs/build-output-api/primitives)
- [@vercel/routing-utils](https://www.npmjs.com/package/@vercel/routing-utils)
