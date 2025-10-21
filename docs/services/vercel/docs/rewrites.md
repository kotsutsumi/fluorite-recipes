# Rewrites（リライト）

リライトは、ブラウザのURLを変更せずに、リクエストを別の送信先にルーティングする機能です。

## 定義

**リライトの特徴**:
- ブラウザに表示されるURLは変更されない
- サーバー側で別の送信先にリクエストをルーティング
- ユーザーには透過的な動作

## 2つの主要なタイプ

### 1. Same-Application Rewrites（同一アプリケーション内のリライト）

Vercelプロジェクト内でリクエストをルーティングします。

### 2. External Rewrites（外部リライト）

外部APIやWebサイトにリクエストを転送します。

## リライトの設定

プロジェクトのルートディレクトリにある`vercel.json`で定義します。

### 基本構文

```json
{
  "rewrites": [
    {
      "source": "/source-path",
      "destination": "/destination-path"
    }
  ]
}
```

## Same-Application Rewrites（同一アプリケーション内のリライト）

### ユースケース

#### 1. フレンドリーなURLの作成

```json
{
  "rewrites": [
    {
      "source": "/about",
      "destination": "/pages/about-us"
    }
  ]
}
```

**結果**:
- ユーザーには`/about`が表示される
- 実際には`/pages/about-us`のコンテンツが配信される

#### 2. デバイス固有のコンテンツ配信

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/mobile",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*Mobile.*"
        }
      ]
    }
  ]
}
```

#### 3. A/Bテスト

```json
{
  "rewrites": [
    {
      "source": "/product/:id",
      "destination": "/experiments/product-a/:id",
      "has": [
        {
          "type": "cookie",
          "key": "experiment",
          "value": "variant-a"
        }
      ]
    },
    {
      "source": "/product/:id",
      "destination": "/experiments/product-b/:id",
      "has": [
        {
          "type": "cookie",
          "key": "experiment",
          "value": "variant-b"
        }
      ]
    }
  ]
}
```

#### 4. 国別コンテンツ

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/jp",
      "has": [
        {
          "type": "header",
          "key": "x-vercel-ip-country",
          "value": "JP"
        }
      ]
    }
  ]
}
```

### 実装例: 画像リサイズ

```json
{
  "rewrites": [
    {
      "source": "/resize/:width/:height",
      "destination": "/api/sharp"
    }
  ]
}
```

**API実装**:

```typescript
// app/api/sharp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');

  // 画像処理ロジック
  const buffer = await sharp(inputImage)
    .resize(width, height)
    .toBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}
```

## External Rewrites（外部リライト）

### ユースケース

#### 1. APIリクエストのプロキシ

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

**効果**:
- CORS問題の回避
- APIキーの隠蔽
- レート制限の実装

#### 2. 複数サービスの統合

```json
{
  "rewrites": [
    {
      "source": "/blog/:path*",
      "destination": "https://blog.example.com/:path*"
    },
    {
      "source": "/shop/:path*",
      "destination": "https://shop.example.com/:path*"
    }
  ]
}
```

#### 3. マイクロフロントエンドの作成

```json
{
  "rewrites": [
    {
      "source": "/dashboard/:path*",
      "destination": "https://dashboard-service.example.com/:path*"
    },
    {
      "source": "/analytics/:path*",
      "destination": "https://analytics-service.example.com/:path*"
    }
  ]
}
```

#### 4. キャッシングの追加

```json
{
  "rewrites": [
    {
      "source": "/cached-api/:path*",
      "destination": "https://slow-api.example.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/cached-api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=3600, stale-while-revalidate=86400"
        }
      ]
    }
  ]
}
```

#### 5. 外部ホストコンテンツの配信

```json
{
  "rewrites": [
    {
      "source": "/external-content/:path*",
      "destination": "https://cdn.example.com/:path*"
    }
  ]
}
```

### 実装例: APIプロキシ

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

**使用方法**:

```typescript
// クライアント側のコード
async function fetchData() {
  // 外部APIに直接リクエストせず、リライトを経由
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
}
```

## 外部リライトのキャッシング

### 3つのアプローチ

#### 1. API制御によるキャッシング

外部APIが`Cache-Control`ヘッダーを返す場合、そのヘッダーが尊重されます。

```
Cache-Control: s-maxage=3600
```

#### 2. Vercel設定によるキャッシング

`vercel.json`でキャッシュヘッダーを設定します。

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60"
        }
      ]
    }
  ]
}
```

#### 3. `x-vercel-enable-rewrite-caching`ヘッダー

外部APIが特定のヘッダーを返すことで、Vercelのキャッシングを有効化します。

```
x-vercel-enable-rewrite-caching: 1
Cache-Control: s-maxage=3600
```

## パス転送

### ワイルドカードマッチング

```json
{
  "rewrites": [
    {
      "source": "/blog/:slug*",
      "destination": "/news/:slug*"
    }
  ]
}
```

**マッチ例**:
- `/blog/2024/01/post` → `/news/2024/01/post`
- `/blog/category/tech` → `/news/category/tech`

### 正規表現ベースのマッチング

```json
{
  "rewrites": [
    {
      "source": "/products/:id(\\d{1,})",
      "destination": "/api/products/:id"
    }
  ]
}
```

**マッチ例**:
- `/products/123` → `/api/products/123`
- `/products/abc` → マッチしない

## フレームワークの考慮事項

### ネイティブルーティングの優先

可能な限り、フレームワークのネイティブルーティングを使用してください。

#### Next.js

```typescript
// app/about/route.ts
export async function GET() {
  return Response.redirect('/pages/about-us');
}
```

#### Astro

```javascript
// astro.config.mjs
export default {
  redirects: {
    '/about': '/pages/about-us'
  }
}
```

#### SvelteKit

```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  if (event.url.pathname === '/about') {
    return new Response(null, {
      status: 307,
      headers: { location: '/pages/about-us' }
    });
  }

  return resolve(event);
};
```

## テスト

### プレビューデプロイメントの使用

Vercelのプレビューデプロイメントを使用して、リライトを検証します。

```bash
# プレビューデプロイメントの作成
vercel

# リライトのテスト
curl -I https://your-preview-url.vercel.app/rewrite-path
```

### ローカルテスト

```bash
# Vercel CLIでローカルサーバーを起動
vercel dev

# リライトのテスト
curl http://localhost:3000/rewrite-path
```

## ベストプラクティス

### 1. ネイティブルーティングの優先

フレームワークが提供するルーティング機能を最大限活用します。

### 2. 外部リライトのキャッシング

外部APIへのリライトには、適切なキャッシュ戦略を実装します。

### 3. パフォーマンスの監視

外部リライトのレスポンス時間を監視します。

### 4. エラーハンドリング

外部サービスが利用できない場合のフォールバックを実装します。

```typescript
// Middleware例
export function middleware(request: NextRequest) {
  try {
    // 外部リライトのロジック
  } catch (error) {
    // フォールバック
    return NextResponse.rewrite(new URL('/fallback', request.url));
  }
}
```

### 5. セキュリティ

外部リライトを使用する際は、セキュリティに注意します:

- APIキーを環境変数に保存
- リクエストの検証
- レート制限の実装

## トラブルシューティング

### リライトが機能しない

1. パターンマッチングを確認
2. 優先順位を確認（最初にマッチしたルールが適用される）
3. フレームワークのルーティングとの競合を確認

### 外部リライトのパフォーマンス問題

1. キャッシュ戦略を見直す
2. 外部APIのレスポンス時間を確認
3. タイムアウト設定を調整

## まとめ

Vercelのリライト機能は、URLを変更せずに柔軟なルーティングを実現する強力なツールです。同一アプリケーション内のリライトと外部リライトを適切に組み合わせることで、複雑なアーキテクチャを実装しながら、優れたユーザーエクスペリエンスを提供できます。
