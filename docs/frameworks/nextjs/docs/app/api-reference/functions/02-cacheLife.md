# cacheLife

この機能は現在カナリアチャンネルで利用可能で、変更される可能性があります。

## 使用方法

`next.config.js`ファイルで[`cacheComponents`フラグ](/docs/app/api-reference/config/next-config-js/cacheComponents)を有効にします：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
  },
}

export default nextConfig
```

次に、関数またはコンポーネントのスコープ内で`cacheLife`関数をインポートして呼び出します：

```typescript
'use cache'
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Page() {
  cacheLife('hours')
  return <div>Page</div>
}
```

## デフォルトのキャッシュプロファイル

Next.jsは、さまざまな時間スケールでモデル化された名前付きキャッシュプロファイルのセットを提供します。

| プロファイル | stale | revalidate | expire | 説明 |
|------------|-------|------------|--------|------|
| `default` | 5分 | 15分 | 1年 | デフォルトプロファイル、頻繁な更新が不要なコンテンツに適しています |
| `seconds` | 0 | 1秒 | 1秒 | ほぼリアルタイムの更新が必要な変化の激しいコンテンツ用 |
| `minutes` | 5分 | 1分 | 1時間 | 1時間以内に頻繁に更新されるコンテンツ用 |
| `hours` | 5分 | 1時間 | 1日 | 毎日更新されるコンテンツ用 |
| `days` | 5分 | 1日 | 1週間 | 毎週更新されるコンテンツ用 |
| `weeks` | 5分 | 1週間 | 1ヶ月 | 毎月更新されるコンテンツ用 |
| `max` | 5分 | 1ヶ月 | 1年 | ほとんど変更されないコンテンツ用 |

## カスタムキャッシュプロファイル

`next.config.js`で独自のキャッシュプロファイルを定義できます。
