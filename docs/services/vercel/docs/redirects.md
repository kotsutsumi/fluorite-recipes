# Redirects（リダイレクト）

リダイレクトは、ユーザーをあるURLから別のURLに送信するルールです。

## 概要

Vercelでは、2つの主要なリダイレクトタイプを提供しています:

1. **Dynamic Redirects（動的リダイレクト）**
2. **Static Redirects（静的リダイレクト）**

## ユースケース

### 1. 新しいドメインへの移行

古いドメインから新しいドメインへユーザーをリダイレクトします。

### 2. 削除されたページの置き換え

削除または移動されたページから、適切なページにリダイレクトします。

### 3. 複数URLの正規化

同じコンテンツに対する複数のURLを1つの正規URLにリダイレクトします。

### 4. 地域ベースのリダイレクト

ユーザーの地理的位置に基づいて、適切な地域サイトにリダイレクトします。

## Dynamic Redirects（動的リダイレクト）

### Vercel Functions（Next.js例）

```typescript
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  redirect('https://nextjs.org/');
}
```

### 動的リダイレクトの利点

- リクエストごとに異なるリダイレクト先を決定可能
- ユーザー情報やリクエストデータに基づいてリダイレクト
- 複雑なロジックの実装が可能

### Middleware（ミドルウェア）の使用

すべてのリクエストで実行される動的リダイレクトには、Middlewareを使用します。

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 特定の条件でリダイレクト
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.redirect(new URL('/new-path', request.url));
  }
}
```

詳細:
- [Middleware](/docs/routing-middleware)
- [Edge Config](/docs/storage/edge-config)

## Static Redirects（静的リダイレクト）

### Dashboard Redirects（ダッシュボードリダイレクト）

Vercelダッシュボードのドメインセクションでドメインをリダイレクトできます。

**手順**:
1. プロジェクトダッシュボードに移動
2. Settingsタブを選択
3. Domainsメニューを選択
4. リダイレクトを設定

### Configuration Redirects（設定ファイルでのリダイレクト）

フレームワーク固有の設定ファイルまたは`vercel.json`でリダイレクトを定義します。

#### Next.js設定例

**next.config.js**:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: false,
      },
    ];
  },
};
```

#### vercel.json設定例

```json
{
  "redirects": [
    {
      "source": "/about",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/old-blog/:slug",
      "destination": "/blog/:slug",
      "permanent": true
    }
  ]
}
```

## リダイレクトステータスコード

### 307: Temporary Redirect（一時的リダイレクト）

**特徴**:
- 一時的なリダイレクト
- HTTPメソッドとボディを保持
- 推奨される一時的リダイレクト

**使用ケース**:
- メンテナンス中のリダイレクト
- A/Bテスト
- 一時的なページ移動

### 302: Found

**特徴**:
- 一時的なリダイレクト
- HTTPメソッドがGETに変更される可能性

**使用ケース**:
- レガシーシステムとの互換性

### 308: Permanent Redirect（永続的リダイレクト）

**特徴**:
- 永続的なリダイレクト
- HTTPメソッドとボディを保持
- 推奨される永続的リダイレクト

**使用ケース**:
- URLの恒久的な変更
- ドメインの移行

### 301: Moved Permanently

**特徴**:
- 永続的なリダイレクト
- HTTPメソッドがGETに変更される可能性

**使用ケース**:
- レガシーシステムとの互換性
- SEO目的

## パターンマッチング

### パスパラメータ

```javascript
{
  source: '/blog/:slug',
  destination: '/news/:slug',
  permanent: true
}
```

**マッチ例**:
- `/blog/hello-world` → `/news/hello-world`
- `/blog/my-post` → `/news/my-post`

### ワイルドカード

```javascript
{
  source: '/blog/:slug*',
  destination: '/news/:slug*',
  permanent: true
}
```

**マッチ例**:
- `/blog/2024/01/post` → `/news/2024/01/post`
- `/blog/category/tech` → `/news/category/tech`

### 正規表現

```javascript
{
  source: '/old/:path(\\d{1,})',
  destination: '/new/:path',
  permanent: true
}
```

**マッチ例**:
- `/old/123` → `/new/123`
- `/old/456` → `/new/456`
- `/old/abc` → マッチしない

## 制限

### リダイレクト数の上限

**最大1,024個**のリダイレクトを設定可能

### 文字数制限

source/destinationは、それぞれ**最大4,096文字**

## ベストプラクティス

### 1. 徹底的なテスト

リダイレクトを実装する前に、すべてのパターンをテストします。

```bash
# curlでリダイレクトをテスト
curl -I https://yourdomain.com/old-path
```

### 2. 相対パスの使用

可能な限り相対パスを使用します。

```javascript
// ✅ 推奨
{
  source: '/old-path',
  destination: '/new-path',
  permanent: true
}

// ❌ 避けるべき（必要な場合を除く）
{
  source: '/old-path',
  destination: 'https://yourdomain.com/new-path',
  permanent: true
}
```

### 3. 適切なリダイレクトタイプの使用

- 永続的な変更には**308または301**を使用
- 一時的な変更には**307または302**を使用

### 4. ワイルドカードの慎重な使用

ワイルドカードは強力ですが、意図しないマッチを避けるために慎重に使用します。

### 5. HTTPSの優先

```javascript
{
  source: 'http://example.com/:path*',
  destination: 'https://example.com/:path*',
  permanent: true
}
```

## 高度な例

### 地域ベースのリダイレクト

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country;

  if (country === 'JP') {
    return NextResponse.redirect(new URL('/jp', request.url));
  } else if (country === 'US') {
    return NextResponse.redirect(new URL('/us', request.url));
  }

  return NextResponse.next();
}
```

### 認証ベースのリダイレクト

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### 言語ベースのリダイレクト

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLanguage = acceptLanguage?.split(',')[0].split('-')[0];

  if (preferredLanguage === 'ja' && !request.nextUrl.pathname.startsWith('/ja')) {
    return NextResponse.redirect(new URL(`/ja${request.nextUrl.pathname}`, request.url));
  }

  return NextResponse.next();
}
```

## トラブルシューティング

### リダイレクトが機能しない

1. パターンマッチングが正しいか確認
2. ステータスコードが適切か確認
3. 優先順位を確認（最初にマッチしたルールが適用される）

### リダイレクトループ

```javascript
// ❌ リダイレクトループの例
{
  source: '/a',
  destination: '/b',
  permanent: true
},
{
  source: '/b',
  destination: '/a',
  permanent: true
}
```

**解決策**: リダイレクトチェーンを確認し、ループを排除します。

## まとめ

Vercelのリダイレクト機能を使用することで、柔軟で強力なURL管理が可能です。ステータスコード307または308を使用し、適切なパターンマッチングとテストを行うことで、効果的なリダイレクト戦略を実装できます。
