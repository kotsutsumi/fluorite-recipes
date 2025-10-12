# Next.js Architecture

このドキュメントは、Next.js のアーキテクチャと技術的基盤の包括的なリファレンスです。LLMが解析・参照しやすいよう、Next.js の内部仕組みと技術的特徴の要約とリンクを含めています。

## 目次

- [開発者体験](#開発者体験)
- [コンパイラ・ビルドシステム](#コンパイラビルドシステム)
- [アクセシビリティ](#アクセシビリティ)
- [ブラウザサポート](#ブラウザサポート)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [技術的詳細](#技術的詳細)

---

## 開発者体験

### ⚡ [`Fast Refresh`](./02-fast-refresh.md)

Next.js 9.4以降でデフォルト有効の高速開発体験機能。Reactコンポーネントの編集に対してインスタントフィードバックを提供します。

#### 🔑 **主要な特徴**

- **瞬間的な更新**: ほとんどの編集が1秒以内に反映
- **状態保持**: 編集中もReactコンポーネントの状態を維持
- **エラー耐性**: 構文エラーやランタイムエラーからの自動回復
- **ゼロ設定**: Next.jsアプリケーションでデフォルト有効

#### 🔧 **動作原理**

**ファイルタイプ別の動作**:

1. **Reactコンポーネントのみ**: そのコンポーネントのみ再レンダリング

   ```typescript
   // Button.tsx - コンポーネントのみの編集
   export default function Button() {
     return <button>Click me</button>  // この変更は即座に反映
   }
   ```

2. **混合エクスポート**: インポートするファイルも含めて再実行

   ```typescript
   // theme.ts - 複数ファイルに影響
   export const colors = { primary: '#blue' }  // Button.tsxとModal.tsxが更新
   export const Button = () => <button />       // Reactコンポーネントも含む
   ```

3. **React外ファイル**: 完全なリロードが実行
   ```typescript
   // utils.ts - React外部ファイル
   export const API_URL = "https://api.example.com"; // 完全リロード
   ```

#### 🛡️ **エラー耐性**

**構文エラー**:

- エラー修正後、自動的にエラー表示が消失
- アプリケーションのリロード不要
- コンポーネント状態は完全保持

**ランタイムエラー**:

- コンテキスト付きオーバーレイ表示
- エラー修正時の自動オーバーレイ削除
- エラー境界との適切な連携

#### ⚠️ **制限事項と対応**

**状態がリセットされるケース**:

- **クラスコンポーネント**: 関数コンポーネント+フックのみ状態保持
- **混合エクスポート**: Reactコンポーネント以外のエクスポートを含む
- **高階コンポーネント**: HOCの結果がクラスの場合
- **無名アロー関数**: `export default () => <div />`

**最適化のヒント**:

```typescript
// ❌ 状態がリセットされる
export default () => <div>Content</div>

// ✅ 状態が保持される
export default function MyComponent() {
  return <div>Content</div>
}

// 強制リマウント（アニメーション調整時）
// @refresh reset
export default function AnimatedComponent() {
  // マウント時アニメーションのテスト
}
```

---

## コンパイラ・ビルドシステム

### 🦀 [`Next.js Compiler`](./03-nextjs-compiler.md)

SWC（Rust製）をベースとした高性能コンパイラ。Next.js 12以降でデフォルト有効。

#### 🚀 **パフォーマンス向上**

- **Babelより17倍高速**: TypeScript・JSXの変換処理
- **Fast Refresh 3倍高速化**: 開発時の変更反映速度
- **ビルド5倍高速化**: 本番ビルドの処理時間
- **Terser代替**: ミニファイケーション処理の最適化

#### 🔧 **SWC採用理由**

1. **拡張性**: Next.js内でCrateとして統合可能
2. **パフォーマンス**: Rustの高速処理能力
3. **WebAssembly**: 全プラットフォーム対応
4. **コミュニティ**: Rustエコシステムの成長性

#### ⚙️ **サポート機能**

**Styled Components**:

```javascript
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
};

// 高度な設定
module.exports = {
  compiler: {
    styledComponents: {
      displayName: true, // 開発時のクラス名表示
      ssr: true, // サーバーサイドレンダリング
      fileName: true, // ファイル名情報の保持
      meaninglessFileNames: ["index", "styles"],
    },
  },
};
```

**Emotion**:

```javascript
// next.config.js
module.exports = {
  compiler: {
    emotion: true,
  },
};

// ラベル付き設定
module.exports = {
  compiler: {
    emotion: {
      sourceMap: true, // ソースマップ生成
      autoLabel: "always", // 自動ラベリング
      labelFormat: "[local]", // ラベル形式
    },
  },
};
```

**Remove Console**:

```javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ["error"], // console.error は残す
    },
  },
};
```

**React Remove Properties**:

```javascript
// next.config.js
module.exports = {
  compiler: {
    reactRemoveProperties: true, // data-testid 削除

    // カスタム設定
    reactRemoveProperties: {
      properties: ["^data-test"], // data-test* を削除
    },
  },
};
```

#### 🔄 **Babel フォールバック**

Next.js Compilerがサポートしない機能使用時：

```javascript
// .babelrc または babel.config.js の存在
// → 自動的にBabelにフォールバック

// サポート確認方法
console.log("Using SWC:", process.env.__NEXT_SWC_DISABLED !== "true");
```

---

## アクセシビリティ

### ♿ [`Accessibility`](./01-accessibility.md)

Next.js に組み込まれたアクセシビリティ機能と推奨実装パターン。

#### 🔊 **ルートアナウンス**

**自動ページ変更通知**:

- **サーバーサイドナビゲーション**: `<a href>`での標準的な通知
- **クライアントサイドルーティング**: `next/link`での自動アナウンス
- **スクリーンリーダー対応**: ページ変更の音声通知

**アナウンス優先順位**:

1. `<title>` タグの内容
2. `<h1>` 要素の内容
3. URLパス名

```typescript
// アクセシブルなページ構造
export default function PostPage({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | My Blog</title>  {/* 最優先 */}
      </Head>
      <main>
        <h1>{post.title}</h1>                  {/* 次の優先 */}
        <article>{post.content}</article>
      </main>
    </>
  )
}
```

#### 🔍 **ESLint統合**

**eslint-plugin-jsx-a11y** 自動統合:

- **ARIA属性**: 正しいプレフィックスと型チェック
- **Role属性**: 適切な使用法の検証
- **代替テキスト**: 画像・動画・音声の必須属性

```typescript
// ESLintが検出するアクセシビリティ問題

// ❌ 代替テキストなし
<img src="/hero.jpg" />

// ✅ 適切な代替テキスト
<img src="/hero.jpg" alt="Hero section showing our product" />

// ❌ 無効なARIA属性
<div aria-labelledby="nonexistent-id" />

// ✅ 正しいARIA属性
<div aria-labelledby="heading-1" />
<h1 id="heading-1">Section Title</h1>

// ❌ 無効なrole
<div role="button" />  // キーボードイベントなし

// ✅ セマンティックなHTML
<button type="button">Click me</button>
```

#### 🎯 **ベストプラクティス**

**WCAG準拠チェックリスト**:

```typescript
// 色とコントラスト
const theme = {
  colors: {
    primary: '#1a365d',      // 4.5:1 コントラスト比以上
    secondary: '#2d3748',
    background: '#ffffff',
  }
}

// キーボードナビゲーション
function AccessibleModal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // フォーカストラップの実装
      const firstFocusable = modal.querySelector('[tabindex], button, input')
      firstFocusable?.focus()
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {children}
    </div>
  )
}

// 減らされたモーション対応
const styles = {
  animation: 'fadeIn 0.3s ease-in-out',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
}
```

---

## ブラウザサポート

### 🌐 [`Supported Browsers`](./04-supported-browsers.md)

Next.js の包括的なブラウザサポートと最適化戦略。

#### 📋 **サポート対象ブラウザ**

**モダンブラウザ（設定なし）**:

- **Chrome 64+** (2018年1月〜)
- **Edge 79+** (2020年1月〜)
- **Firefox 67+** (2019年6月〜)
- **Opera 51+** (2018年2月〜)
- **Safari 12+** (2018年9月〜)

#### ⚙️ **Browserslist設定**

```json
// package.json - デフォルト設定
{
  "browserslist": [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
  ]
}

// カスタム設定例
{
  "browserslist": [
    "> 1%",              // 1%以上のシェア
    "last 2 versions",   // 最新2バージョン
    "not dead"           // 更新停止していない
  ]
}
```

#### 🔧 **自動ポリフィル**

**組み込みポリフィル**（自動挿入）:

```typescript
// 自動的に含まれるポリフィル
-fetch() - // whatwg-fetch代替
  URL - // Node.js url package代替
  Object.assign() - // object-assign代替
  Promise - // es6-promise代替
  Symbol; // symbol-es6代替
```

**スマートロード**:

- **条件付き配信**: 必要なブラウザのみにポリフィル提供
- **重複除去**: 依存関係の重複ポリフィル自動削除
- **バンドルサイズ最適化**: 不要なコードの除去

**カスタムポリフィル**:

```typescript
// pages/_app.tsx
import "intersection-observer"; // 古いブラウザ用
import "resize-observer-polyfill";

// 条件付きポリフィル
if (typeof window !== "undefined" && !window.IntersectionObserver) {
  require("intersection-observer");
}

// ダイナミックインポート
async function loadPolyfills() {
  if (!window.ResizeObserver) {
    await import("resize-observer-polyfill");
  }
}
```

---

## パフォーマンス最適化

### 🚀 **自動最適化機能**

#### **コード分割**

```typescript
// 自動ルートベース分割
pages/
├── index.tsx        // chunk: pages/index
├── about.tsx        // chunk: pages/about
└── blog/
    └── [slug].tsx   // chunk: pages/blog/[slug]

// 動的インポート
const DynamicComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false  // クライアントサイドのみ
})
```

#### **プリフェッチ最適化**

```typescript
// Link コンポーネントの自動プリフェッチ
<Link href="/blog" prefetch={true}>     {/* 本番環境で自動 */}
  <a>Blog</a>
</Link>

// カスタムプリフェッチ
import { useRouter } from 'next/router'

function CustomLink({ href, children }) {
  const router = useRouter()

  const handleMouseEnter = () => {
    router.prefetch(href)  // ホバー時プリフェッチ
  }

  return (
    <a href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  )
}
```

#### **画像最適化**

```typescript
import Image from 'next/image'

// 自動最適化
<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority              // LCPに重要な画像
  placeholder="blur"    // ぼかしプレースホルダー
  sizes="(max-width: 768px) 100vw, 50vw"  // レスポンシブ
/>

// WebP/AVIF自動変換（対応ブラウザ）
// 遅延読み込み（Intersection Observer）
// サイズ最適化（srcset生成）
```

---

## 技術的詳細

### 🔧 **内部アーキテクチャ**

#### **コンパイルパイプライン**

```
TypeScript/JavaScript → SWC → Next.js Optimizations → Bundle
```

1. **SWC変換**: TypeScript→JavaScript、JSX→React.createElement
2. **Next.js最適化**: ルートベース分割、プリフェッチ注入
3. **バンドル生成**: Webpack/Turbopack による最終成果物

#### **レンダリング戦略**

```typescript
// 静的生成 (SSG)
export async function getStaticProps() {
  return { props: { data } }
}

// サーバーサイドレンダリング (SSR)
export async function getServerSideProps() {
  return { props: { data } }
}

// インクリメンタル静的再生成 (ISR)
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600  // 1時間で再生成
  }
}

// App Router - サーバーコンポーネント
async function ServerComponent() {
  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

#### **開発vs本番環境**

**開発環境**:

- Fast Refresh 有効
- 詳細エラーオーバーレイ
- ソースマップ生成
- Hot Module Replacement

**本番環境**:

- SWC最適化コンパイル
- コード分割・ミニファイ
- プリフェッチ最適化
- 画像・フォント最適化

---

## 設定とカスタマイズ

### ⚙️ **next.config.js での調整**

```javascript
// next.config.js
module.exports = {
  // コンパイラ設定
  compiler: {
    styledComponents: true,
    removeConsole: { exclude: ["error"] },
    reactRemoveProperties: true,
  },

  // ブラウザサポート
  browserslist: ["chrome 64", "firefox 67", "safari 12"],

  // 実験的機能
  experimental: {
    swcMinify: true, // SWCミニファイ（デフォルト）
    turbopack: true, // Turbopackバンドラー
  },

  // アクセシビリティ強化
  eslint: {
    dirs: ["pages", "components", "lib"],
  },
};
```

### 🔧 **開発体験の最適化**

```typescript
// TypeScript設定
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,         // 増分コンパイル
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}

// ESLint設定
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",      // パフォーマンス最適化
    "next/accessibility"         // アクセシビリティチェック
  ],
  "rules": {
    "@next/next/no-img-element": "error"  // next/image強制
  }
}
```

---

## トラブルシューティング

### 🐛 **よくある問題と解決方法**

#### **Fast Refresh が動作しない**

```typescript
// 原因1: 無名関数
export default () => <div />  // ❌

// 解決策: 名前付き関数
export default function MyComponent() {  // ✅
  return <div />
}

// 原因2: 混合エクスポート
export const API_URL = 'https://api.example.com'  // ❌
export default function Component() {}

// 解決策: 分離
// constants.ts
export const API_URL = 'https://api.example.com'

// Component.tsx
export default function Component() {}
```

#### **SWC コンパイルエラー**

```bash
# Babel フォールバック確認
npm run build -- --debug

# SWC無効化（一時的）
NEXT_SWC_DISABLED=true npm run dev
```

#### **アクセシビリティ警告**

```typescript
// ESLint警告の修正
// ❌
<div onClick={handleClick}>Clickable</div>

// ✅
<button type="button" onClick={handleClick}>
  Clickable
</button>

// または
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Clickable
</div>
```

---

このドキュメントは、Next.js のアーキテクチャと技術的基盤の包括的なリファレンスです。各セクションの詳細については、個別のリンク先ドキュメントを参照してください。開発時は、Fast Refresh による高速な開発体験、SWC による高性能なビルド、組み込まれたアクセシビリティ機能を活用し、幅広いブラウザサポートのもとで最適化されたアプリケーションを構築することを推奨します。
