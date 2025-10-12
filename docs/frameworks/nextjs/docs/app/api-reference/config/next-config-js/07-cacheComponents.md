# cacheComponents

この機能は現在canaryチャンネルで利用可能であり、変更される可能性があります。[Next.jsをアップグレード](/docs/app/building-your-application/upgrading/canary)して試してみて、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有してください。

`cacheComponents` フラグはNext.jsの実験的機能であり、明示的にキャッシュされない限り、App Routerでのデータフェッチ操作をプリレンダリングから除外します。これは、サーバーコンポーネントでの動的データフェッチのパフォーマンスを最適化するのに役立ちます。

プリレンダリングされたキャッシュから提供するのではなく、ランタイム中に新しいデータフェッチが必要な場合に便利です。

[`use cache`](/docs/app/api-reference/directives/use-cache)と併用することが想定されており、デフォルトでランタイム時にデータフェッチが行われ、ページ、関数、またはコンポーネントレベルで `use cache` を使用してアプリケーションの特定の部分をキャッシュするように定義できます。

## 使用方法

`cacheComponents` フラグを有効にするには、`next.config.ts` ファイルの `experimental` セクションで `true` に設定します：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
  },
}

export default nextConfig
```

`cacheComponents` を有効にすると、次のキャッシュ関数と設定を使用できます：

- [`use cache` ディレクティブ](/docs/app/api-reference/directives/use-cache)
- [`use cache` と併用する `cacheLife` 関数](/docs/app/api-reference/config/next-config-js/cacheLife)
- [`cacheTag` 関数](/docs/app/api-reference/functions/cacheTag)

## 注意事項

- `cacheComponents` はランタイム中に新しいデータフェッチを保証することでパフォーマンスを最適化できますが、プリレンダリングされたコンテンツを提供する場合と比較して、追加のレイテンシが発生する可能性もあります。
