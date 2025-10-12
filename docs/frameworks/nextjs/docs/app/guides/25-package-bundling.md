# パッケージバンドリング

このガイドでは、Next.jsアプリケーションのパッケージバンドリングを最適化する方法について説明します。

## 概要

デフォルトでは、サーバーコンポーネントとルートハンドラーでインポートされたパッケージは自動的にバンドルされます。このガイドでは、バンドリングの動作を制御し、最適化する方法を紹介します。

## JavaScriptバンドルの分析

### `@next/bundle-analyzer`プラグイン

バンドルサイズを視覚的に分析するために、`@next/bundle-analyzer`プラグインを使用できます。

#### インストール

```bash
npm i @next/bundle-analyzer
# または
yarn add @next/bundle-analyzer
# または
pnpm add @next/bundle-analyzer
```

#### next.config.jsの設定

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

#### レポート生成

```bash
ANALYZE=true npm run build
# または
ANALYZE=true yarn build
# または
ANALYZE=true pnpm build
```

ビルド後、ブラウザで自動的に3つのタブが開き、バンドルサイズを視覚的に確認できます。

## パッケージインポートの最適化

### optimizePackageImportsオプション

アイコンライブラリなどの大きなパッケージのインポートを最適化するには、`optimizePackageImports`オプションを使用します。このオプションは、実際に使用しているコンポーネントのみをロードし、バンドルサイズを削減します。

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['icon-library', 'other-large-package'],
  },
}

module.exports = nextConfig
```

例えば、次のようなインポートがある場合：

```javascript
import { IconA, IconB } from 'icon-library'
```

この設定により、ライブラリ全体ではなく、`IconA`と`IconB`のみがバンドルに含まれます。

## バンドリングからのパッケージの除外

### serverExternalPackagesオプション

特定のパッケージをバンドリングから除外し、Node.jsのネイティブ`require`を使用してインポートするには、`serverExternalPackages`オプションを使用します。

```javascript
// next.config.js
const nextConfig = {
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```

このオプションは、次のような場合に役立ちます：

- ネイティブバイナリを含むパッケージ
- バンドリングすると問題が発生するパッケージ
- サーバー側でのみ使用されるパッケージ

### 注意事項

- `serverExternalPackages`は、サーバーコンポーネントとルートハンドラーでのみ動作します
- クライアントコンポーネントでは、通常のバンドリングが適用されます
- 除外されたパッケージは、デプロイメント環境で利用可能である必要があります

## ベストプラクティス

### 1. バンドルサイズの定期的な監視

```bash
# 定期的にバンドルサイズをチェック
ANALYZE=true npm run build
```

### 2. 必要な部分のみをインポート

```javascript
// 悪い例
import _ from 'lodash'

// 良い例
import debounce from 'lodash/debounce'
```

### 3. 動的インポートの活用

```javascript
// 大きなコンポーネントを遅延ロード
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### 4. ツリーシェイキングを考慮

ESModulesを使用し、ツリーシェイキングが有効なパッケージを選択します。

## 次のステップ

- [パフォーマンス最適化](/docs/app/guides/performance-optimization)
- [本番環境チェックリスト](/docs/app/guides/production-checklist)
- [静的エクスポート](/docs/app/guides/static-exports)
