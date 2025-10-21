# Routing Middleware API

## Routing Middlewareのファイルの場所と名前

Routing Middlewareファイルは以下の条件を満たす必要があります:

- `middleware.ts`という名前
- プロジェクトのルートに配置
- `package.json`と同じレベル

例:

```typescript
export default function middleware() {}
```

## Configオブジェクト

`config`オブジェクトを使用すると、以下が可能になります:

- ミドルウェアが実行されるルートを制御
- ランタイムを指定

### パスのマッチング

#### カスタムマッチャー設定

以下を使用してパスをマッチできます:

単一パス:

```typescript
export const config = {
  matcher: '/about/:path*',
};
```

複数パス:

```typescript
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
};
```

#### 正規表現マッチング

例:

否定先読み(特定のパスを除外):

```typescript
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
```

文字マッチング:

```typescript
export const config = {
  matcher: ['/blog/:slug(\\d{1,})'],
};
```

### 条件文

```typescript
export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/about')) {
    return rewrite(new URL('/about-2', request.url));
  }
}
```

### ランタイムの指定

```typescript
export const config = {
  runtime: 'nodejs', // デフォルトは'edge'
};
```

## Routing Middlewareのシグネチャ

パラメータ:

- `request`: Requestオブジェクト
- `context`: `waitUntil`メソッドを含むオブジェクト

## ヘルパーメソッド

### 地理位置情報

```typescript
export default function middleware(request: NextRequest) {
  const country = request.geo?.country ?? 'US';
  // 地理位置情報ロジック
}
```

### IPアドレス

```typescript
import { ipAddress } from '@vercel/functions';

export default function middleware(request: Request) {
  const ip = ipAddress(request);
  // IPアドレスロジック
}
```

### Rewrites

リライト機能により、異なるURLへの内部リダイレクトが可能になります。
