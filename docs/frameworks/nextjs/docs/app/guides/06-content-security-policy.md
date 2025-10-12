# コンテンツセキュリティポリシー (CSP)

コンテンツセキュリティポリシー (CSP) は、クロスサイトスクリプティング (XSS) やコードインジェクションなどの様々な攻撃から Web アプリケーションを保護するセキュリティメカニズムです。開発者は、スクリプト、スタイルシート、画像、その他のリソースに対して許可されるコンテンツソースを指定できます。

## 主要な概念

### Nonce（ナンス）

**Nonce** は、厳格な CSP ディレクティブをバイパスしながら、特定のインラインスクリプトやスタイルの実行を選択的に許可するために使用される、一意でランダムな文字列です。

#### Nonce を使用する理由

- 不正なスクリプトの実行を防止
- スクリプトセキュリティに対してより細かいアプローチを提供
- 攻撃者が予測不可能な値を推測する必要がある

### Next.js での実装

Middleware での設定例：

```typescript
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  )

  return response
}
```

### レンダリングに関する考慮事項

- Nonce は **動的レンダリング** を必要とします
- 静的生成と ISR は無効化されます
- 各リクエストで新しい nonce が生成されます
- サーバーサイドレンダリングのため、パフォーマンスに影響する可能性があります

## 代替手段：Subresource Integrity (SRI)

ビルド時に JavaScript ファイルの暗号化ハッシュを生成する実験的機能で、nonce の代替手段を提供します。

### 設定例

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    sri: {
      algorithm: 'sha256', // または 'sha384', 'sha512'
    },
  },
}

module.exports = nextConfig
```

## 開発環境と本番環境

- 開発環境では `'unsafe-eval'` が必要な場合があります
- 本番環境では慎重な CSP 設定が必要です

### 開発環境用の CSP 例

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' ${
    process.env.NODE_ENV === 'production' ? '' : `'unsafe-eval'`
  };
  style-src 'self' 'nonce-${nonce}';
`
```

## ベストプラクティス

1. **許可されたコンテンツソースを慎重に定義する**: 必要最小限のソースのみを許可
2. **Nonce または SRI を使用してセキュリティを強化する**: インラインスクリプトの実行を制御
3. **パフォーマンスへの影響を考慮する**: 動的レンダリングの必要性を理解
4. **環境全体で徹底的にテストする**: 開発環境と本番環境での動作を確認
5. **CSP レポートを監視する**: 違反を検出し、ポリシーを改善

## CSP ディレクティブの例

### 基本的な CSP ヘッダー

```
default-src 'self';
script-src 'self' 'nonce-{NONCE}' 'strict-dynamic';
style-src 'self' 'nonce-{NONCE}';
img-src 'self' blob: data:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

このドキュメントは、セキュリティとパフォーマンスのバランスを取りながら、Next.js アプリケーションで CSP を実装するための包括的なガイダンスを提供します。
