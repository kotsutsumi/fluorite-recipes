# transpilePackages

Next.jsは、以下からの依存関係を自動的にトランスパイルおよびバンドルできます：

- ローカルパッケージ（モノレポなど）
- `node_modules`内の外部依存関係

この設定は、`next-transpile-modules`パッケージを置き換えるものです。

## 設定例

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['package-name'],
}

module.exports = nextConfig
```

## 複数のパッケージの指定

複数のパッケージをトランスパイルする場合：

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@acme/ui', '@acme/shared', 'untranspiled-package'],
}

module.exports = nextConfig
```

## 使用例

### モノレポでのパッケージトランスパイル

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/shared'],
}

module.exports = nextConfig
```

### 外部ライブラリのトランスパイル

一部の外部ライブラリは、ES ModulesまたはTypeScriptで公開されており、トランスパイルが必要な場合があります：

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['modern-library', 'esm-only-package'],
}

module.exports = nextConfig
```

## 主なポイント

- 特定のパッケージの自動トランスパイルを許可します
- 依存関係の管理を簡素化します
- デフォルトのNext.jsバンドルと互換性がないパッケージの統合を容易にします

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v13.0.0` | `transpilePackages`が追加されました |

## Good to know

- この機能は、モノレポや、トランスパイルが必要なモダンなJavaScriptを使用するパッケージで特に役立ちます
- トランスパイルは、ビルド時間にわずかな影響を与える可能性があります
- パッケージがすでに互換性のあるJavaScriptを提供している場合、トランスパイルは不要です
