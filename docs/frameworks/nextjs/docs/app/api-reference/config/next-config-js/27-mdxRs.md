# mdxRs

`mdxRs` は、新しい Rust コンパイラを使用して MDX ファイルをコンパイルするための実験的設定オプションです。

## 設定例

`next.config.js` での使用方法:

```javascript
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```

## 主要なポイント

- MDX コンパイル用の実験的機能
- `@next/mdx` パッケージが必要
- MDX ファイル用の Rust ベースのコンパイラを有効化
- `next.config.js` の `experimental` セクションで設定可能
- ページ拡張子に MDX ファイルを含めることができます

この設定は、コンパイルパフォーマンスと開発者体験を改善するための Next.js の継続的な取り組みの一部です。
