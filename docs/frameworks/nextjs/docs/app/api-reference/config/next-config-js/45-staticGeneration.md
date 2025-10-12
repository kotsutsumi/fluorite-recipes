# staticGeneration*

> **警告**: この機能は現在実験的であり、変更される可能性があります。本番環境での使用は推奨されません。

`staticGeneration*`オプションは、Static Generation（静的生成）プロセスの高度な設定を可能にします。

## 設定例

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
}

export default nextConfig
```

## 利用可能なオプション

### `staticGenerationRetryCount`

ビルドを失敗させる前に、失敗したページ生成を再試行する回数を指定します。

- **型**: `number`
- **デフォルト**: `3`

### `staticGenerationMaxConcurrency`

ワーカーごとに処理されるページの最大数を設定します。

- **型**: `number`
- **デフォルト**: `8`

### `staticGenerationMinPagesPerWorker`

新しいワーカーを起動する前に処理されるページの最小数を定義します。

- **型**: `number`
- **デフォルト**: `25`

## 使用例

これらの設定は、大規模なサイトで静的生成のパフォーマンスを最適化する際に役立ちます：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // より多くの再試行を許可してビルドの信頼性を向上
    staticGenerationRetryCount: 3,
    // 並行処理を増やしてビルドを高速化
    staticGenerationMaxConcurrency: 16,
    // ワーカーあたりのページ数を調整してメモリ使用量を最適化
    staticGenerationMinPagesPerWorker: 50,
  },
}

export default nextConfig
```

## 注意事項

これらの設定は`experimental`キーの下に配置され、実験的な性質を示しています。将来のバージョンで変更される可能性があります。
