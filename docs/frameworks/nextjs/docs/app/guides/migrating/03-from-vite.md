# Vite から Next.js への移行

既存の Vite React アプリケーションを Next.js に移行する方法を説明します。Vite の高速な開発体験を維持しながら、Next.js の強力な機能を活用できます。

## 移行する理由

### 初期ページ読み込みの改善

クライアントサイドアプリケーションの課題：

- 初期読み込み時間が遅い
- ブラウザはアプリケーション全体のバンドルをダウンロードして実行する必要がある

### コード分割の自動化

- **Vite**: 手動でコード分割を実装
- **Next.js**: ルーターによる自動コード分割

### 柔軟なデータフェッチング

Next.js は複数のデータフェッチング戦略を提供：

- ビルド時レンダリング（SSG）
- サーバーサイドレンダリング（SSR）
- クライアントサイドフェッチング（CSR）
- Incremental Static Regeneration（ISR）

## Next.js の追加機能

- **Middleware サポート**: リクエストの前処理
- **組み込み最適化**: 画像、フォント、スクリプト
- **Server と Client Components**: 柔軟なレンダリング
- **React Suspense によるストリーミング**: インクリメンタルレンダリング
- **意図的なローディング状態**: UX の改善

## 移行手順

### ステップ 1: Next.js のインストール

```bash
npm install next@latest
```

### ステップ 2: Next.js 設定ファイルの作成

プロジェクトルートに `next.config.js` を作成：

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的エクスポート（Vite と同等）
  distDir: './dist', // ビルド出力先を Vite と同じに
}

module.exports = nextConfig
```

### ステップ 3: TypeScript 設定の更新

`tsconfig.json` を Next.js 用に更新：

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ステップ 4: ルートレイアウトの作成

`app/layout.tsx` を作成して、`index.html` を置き換えます。

#### Before (Vite)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <meta name="description" content="My Vite App" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### After (Next.js)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vite App',
  description: 'My Vite App',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

### ステップ 5: エントリーポイントページの作成

SPA ルーティング用の catch-all ルートを作成：

```typescript
// app/[[...slug]]/page.tsx
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../src/App'), { ssr: false })

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <App />
}
```

このアプローチにより、既存の Vite アプリケーション構造を維持できます。

### ステップ 6: 画像インポートの更新

#### Before (Vite)

```typescript
import logo from './logo.svg'

export function Header() {
  return <img src={logo} className="logo" alt="Logo" />
}
```

#### After (Next.js)

##### オプション 1: 静的インポート

```typescript
import logo from './logo.svg'

export function Header() {
  return <img src={logo.src} className="logo" alt="Logo" />
}
```

##### オプション 2: Next.js Image コンポーネント（推奨）

```typescript
import Image from 'next/image'
import logo from './logo.svg'

export function Header() {
  return <Image src={logo} className="logo" alt="Logo" />
}
```

### ステップ 7: 環境変数の移行

#### Before (Vite)

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_API_KEY=secret
```

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

#### After (Next.js)

```bash
# .env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_KEY=secret
```

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

**変更点**:
- `VITE_` → `NEXT_PUBLIC_`
- `import.meta.env` → `process.env`

### ステップ 8: package.json スクリプトの更新

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### ステップ 9: Vite ファイルのクリーンアップ

不要なファイルを削除：

```bash
# 削除するファイル
index.html
vite.config.ts
src/main.tsx (App.tsx を直接使用する場合)
src/vite-env.d.ts

# 削除する依存関係
npm uninstall vite @vitejs/plugin-react
```

## React Router からの移行

Vite アプリで React Router を使用している場合、Next.js のファイルベースルーティングに移行できます。

### Before (React Router + Vite)

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### After (Next.js)

ファイルベースルーティング：

```
app/
├── page.tsx              # /
├── about/
│   └── page.tsx          # /about
└── blog/
    └── [slug]/
        └── page.tsx      # /blog/:slug
```

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <div>ブログ記事: {params.slug}</div>
}
```

## CSS の移行

### CSS Modules

Vite と同じように CSS Modules を使用できます。

```typescript
// app/components/Button.tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.button}>クリック</button>
}
```

### PostCSS

`postcss.config.js` はそのまま使用できます。

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Tailwind CSS

Tailwind の設定を更新：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Vite プラグインからの移行

### @vitejs/plugin-react

Next.js には React サポートが組み込まれているため、不要です。

### vite-plugin-svgr

Next.js で SVG をコンポーネントとして使用：

```javascript
// next.config.js
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}
```

```bash
npm install @svgr/webpack
```

```typescript
import Logo from './logo.svg'

export function Header() {
  return <Logo />
}
```

## パフォーマンス最適化

### 動的インポート

#### Before (Vite)

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

#### After (Next.js)

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
})

function App() {
  return <HeavyComponent />
}
```

### 画像最適化

```typescript
import Image from 'next/image'

export function Gallery() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      priority // LCP 画像の場合
    />
  )
}
```

## 段階的な移行戦略

### フェーズ 1: 基本セットアップ（1日）

1. Next.js をインストール
2. 設定ファイルを作成
3. エントリーポイントを設定
4. 開発サーバーを起動

### フェーズ 2: ルーティングの移行（1-2週間）

1. React Router を Next.js ルーティングに置き換え
2. ページを `app` ディレクトリに移行
3. リンクとナビゲーションを更新

### フェーズ 3: 最適化（継続的）

1. Server Components を活用
2. 画像を最適化
3. データフェッチングを改善

## よくある問題と解決策

### 問題 1: import.meta.env が undefined

**原因**: Vite の環境変数構文を使用している

**解決策**: `process.env` に変更

```typescript
// Before
const apiUrl = import.meta.env.VITE_API_URL

// After
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### 問題 2: グローバル CSS がエラー

**原因**: グローバル CSS のインポート場所が正しくない

**解決策**: レイアウトでインポート

```typescript
// app/layout.tsx
import './globals.css'
```

### 問題 3: 絶対インポートが機能しない

**原因**: パスエイリアスの設定が異なる

**解決策**: `tsconfig.json` を更新

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Turbopack の活用

Next.js 15 では Turbopack がデフォルトで有効です。Vite と同等以上の高速な開発体験を提供します。

```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

## まとめ

Vite から Next.js への移行により、以下のメリットがあります：

1. **柔軟なレンダリング**: SSR、SSG、ISR をサポート
2. **自動最適化**: 画像、フォント、コード分割
3. **SEO 改善**: サーバーサイドレンダリング
4. **エンタープライズ対応**: スケーラブルな機能
5. **高速な開発体験**: Turbopack によるHMR

段階的な移行により、Vite の高速な開発体験を維持しながら、Next.js の強力な機能を活用できます。
