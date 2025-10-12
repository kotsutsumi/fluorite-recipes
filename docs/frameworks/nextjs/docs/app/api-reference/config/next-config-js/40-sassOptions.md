# sassOptions

`sassOptions` 設定を使用すると、Next.js プロジェクトの Sass コンパイラをカスタマイズできます。

## 設定例

```typescript
import type { NextConfig } from 'next'

const sassOptions = {
  additionalData: `
    $var: red;
  `,
}

const nextConfig: NextConfig = {
  sassOptions: {
    ...sassOptions,
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

## 主要なポイント

- `sassOptions` を使用して、さまざまな Sass コンパイラ設定を構成できます
- `additionalData` プロパティを使用して、追加の Sass データを追加できます
- `implementation` オプションを使用すると、Sass コンパイラ (例: 'sass-embedded') を指定できます
- ドキュメントには、「Next.js は `implementation` 以外の他の可能なプロパティを保守していません」と記載されています

## 設定ファイル

設定は通常、プロジェクトのルートディレクトリにある `next.config.js` (または TypeScript の場合は `next.config.ts`) ファイルに追加されます。
