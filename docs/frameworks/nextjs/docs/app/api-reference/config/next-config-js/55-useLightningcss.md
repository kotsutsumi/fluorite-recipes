# useLightningcss

> **警告**: この機能は現在実験的であり、変更される可能性があります。本番環境での使用は推奨されません。

Lightning CSSのサポートを有効にします。Lightning CSSは、Rustで書かれた高速なCSSバンドラーおよびミニファイアです。

## 設定例

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: true,
  },
}

export default nextConfig
```

## Lightning CSSとは

Lightning CSSは、以下を提供するRustベースのCSSツールです：

- **高速なパフォーマンス**: Rustで書かれており、従来のJavaScriptベースのツールよりも大幅に高速
- **CSSの最小化**: 最適化されたCSSの圧縮
- **モダンなCSS機能**: 最新のCSS仕様のサポート
- **ベンダープレフィックス**: 自動的にベンダープレフィックスを追加

## 利点

### パフォーマンス

Lightning CSSは、PostCSSや他のCSSプロセッサよりも大幅に高速です：

```
PostCSS: ~500ms
Lightning CSS: ~50ms (10倍高速)
```

### 機能

- CSS Modules
- CSS Nesting
- カスタムメディアクエリ
- カラー関数
- その他多数

## 使用例

### 基本的な使用

`useLightningcss`を有効にするだけで、Next.jsはLightning CSSを使用してCSSを処理します：

```css filename="styles.css"
.container {
  /* モダンなCSSネスティング */
  & .title {
    color: blue;
  }

  /* カスタムプロパティ */
  --spacing: 1rem;
  padding: var(--spacing);

  /* モダンなカラー関数 */
  background: oklch(0.5 0.2 180);
}
```

### CSS Modules

```css filename="component.module.css"
.button {
  padding: 1rem 2rem;

  &:hover {
    background: color-mix(in srgb, blue 50%, white);
  }
}
```

```typescript filename="component.tsx"
import styles from './component.module.css'

export default function Button() {
  return <button className={styles.button}>クリック</button>
}
```

## PostCSSとの比較

### PostCSSの場合

```javascript filename="postcss.config.js"
module.exports = {
  plugins: {
    'postcss-preset-env': {},
    'autoprefixer': {},
    'cssnano': {},
  },
}
```

### Lightning CSSの場合

設定不要！`useLightningcss: true`を設定するだけです。

## 互換性

Lightning CSSは、以下との互換性があります：

- CSS Modules
- グローバルCSS
- Tailwind CSS（制限あり）
- Sass/SCSS（変換後）

## 制限事項

- 一部のPostCSSプラグインは互換性がない可能性があります
- カスタムPostCSS設定は無視される場合があります
- Tailwind CSSの一部の機能は制限される可能性があります

## トラブルシューティング

### CSSが正しく処理されない

Lightning CSSとPostCSSの構文の違いを確認してください。

### ベンダープレフィックスが欠けている

Lightning CSSは自動的にプレフィックスを追加しますが、ターゲットブラウザの設定を確認してください：

```json filename="package.json"
{
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}
```

### Tailwind CSSとの互換性

Tailwind CSSを使用している場合、一部の機能は完全にはサポートされない可能性があります。

## パフォーマンスの測定

Lightning CSSのパフォーマンスの向上を測定するには：

```bash
# PostCSSの場合
time npm run build

# Lightning CSSの場合（useLightningcss: trueを設定後）
time npm run build
```

## フィードバック

この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v14.1.0` | `experimental.useLightningcss`が導入されました |

## 関連項目

- [Lightning CSSドキュメント](https://lightningcss.dev/)
- [CSSサポート](/docs/app/building-your-application/styling)
- [CSS Modules](/docs/app/building-your-application/styling/css-modules)
