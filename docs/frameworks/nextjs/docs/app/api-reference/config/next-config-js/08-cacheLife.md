# cacheLife

この機能は現在canaryチャンネルで利用可能であり、変更される可能性があります。[Next.jsをアップグレード](/docs/app/building-your-application/upgrading/canary)して試してみて、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有してください。

`cacheLife` オプションを使用すると、コンポーネントや関数内で[`cacheLife`](/docs/app/api-reference/functions/cacheLife)関数を使用する場合、および[`use cache` ディレクティブ](/docs/app/api-reference/directives/use-cache)のスコープ内で**カスタムキャッシュプロファイル**を定義できます。

## 使用方法

プロファイルを定義するには、[`cacheComponents` フラグ](/docs/app/api-reference/config/next-config-js/cacheComponents)を有効にし、`next.config.js` ファイルの `cacheLife` オブジェクトにキャッシュプロファイルを追加します。例えば、`blog` プロファイル：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    cacheLife: {
      blog: {
        stale: 3600, // 1時間
        revalidate: 900, // 15分
        expire: 86400, // 1日
      },
    },
  },
}

export default nextConfig
```

次のように、コンポーネントまたは関数でこのカスタム `blog` 設定を使用できるようになります：

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

export async function getCachedData() {
  'use cache'
  cacheLife('blog')
  const data = await fetch('/api/data')
  return data
}
```

## リファレンス

設定オブジェクトには、次の形式のキー値があります：

| プロパティ | 値 | 説明 | 要件 |
|----------|-------|-------------|-------------|
| `stale` | `number` | クライアントがサーバーをチェックせずに値をキャッシュする期間 | オプション |
| `revalidate` | `number` | キャッシュをリフレッシュする頻度 | オプション |
| `expire` | `number` | キャッシュエントリが有効である最大期間 | オプション |
