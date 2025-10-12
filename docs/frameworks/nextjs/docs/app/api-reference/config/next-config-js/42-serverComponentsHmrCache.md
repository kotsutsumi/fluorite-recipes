# serverComponentsHmrCache

> **警告**: この機能は現在実験的であり、変更される可能性があります。本番環境での使用は推奨されません。

Server ComponentsにおけるHot Module Replacement（HMR）中に`fetch`レスポンスをキャッシュすることができます。

## 設定

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // デフォルトはtrue
  },
}

export default nextConfig
```

## 動作

- デフォルトでは、`cache: 'no-store'`を含むすべての`fetch`リクエストに適用されます
- キャッシュされていないリクエストは、HMRリフレッシュ間で最新のデータを表示しない場合があります
- キャッシュは、完全なページナビゲーションまたはリロード時にクリアされます

## 追加の推奨事項

開発中にfetchキャッシュのヒットとミスをより適切に観察するために、[`logging.fetches`](/docs/app/api-reference/config/next-config-js/logging)の使用を推奨します。

## フィードバック

この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.0.0` | `serverComponentsHmrCache`が導入されました |
