# Create React App から Next.js への移行

既存の Create React App (CRA) プロジェクトを Next.js に移行する方法を説明します。段階的なアプローチにより、スムーズな移行を実現できます。

## 移行する理由

###初期ページ読み込みの遅さ

CRA はクライアントサイドレンダリングのみを使用するため、以下の問題があります：

- アプリケーション全体のバンドルをダウンロードして実行する必要がある
- データリクエストを開始する前に、JavaScript の実行を待つ必要がある
- 機能や依存関係が増えるたびに、アプリケーションコードが増大する

### コード分割の複雑さ

CRA では手動でコード分割を実装する必要があり、以下の問題が発生します：

- データフェッチングでネットワークウォーターフォールが発生
- 複雑な実装と保守

## Next.js の利点

- **サーバーとクライアントの両方でレンダリング**: SSR、SSG、ISR をサポート
- **組み込みの最適化**: 画像、フォント、スクリプトの最適化
- **Middleware サポート**: リクエストの前処理
- **ストリーミング**: React Suspense によるインクリメンタルレンダリング
- **柔軟なデータフェッチング**: 複数の戦略をサポート
- **自動コード分割**: ルートベースの自動分割

## 移行手順

### ステップ 1: Next.js のインストール

```bash
npm install next@latest
```

### ステップ 2: Next.js 設定ファイルの作成

プロジェクトルートに `next.config.ts` を作成：

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // 静的エクスポート（CRA と同等）
  distDir: './build', // ビルド出力先を CRA と同じに
}

export default nextConfig
```

**注意**: `output: 'export'` は、CRA と同様の静的サイト生成を行います。

### ステップ 3: ルートレイアウトの作成

`app/layout.tsx` を作成して、`public/index.html` を置き換えます。

#### Before (CRA)

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="My React App" />
    <title>React App</title>
  </head>
  <body>
    <noscript>JavaScript を有効にしてください。</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### After (Next.js)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'My React App',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <noscript>JavaScript を有効にしてください。</noscript>
        {children}
      </body>
    </html>
  )
}
```

### ステップ 4: メタデータの処理

Next.js の Metadata API を使用します。

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'My React App',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  manifest: '/manifest.json',
}
```

### ステップ 5: スタイルの移行

#### CSS Modules

CRA と同じように CSS Modules を使用できます。

```typescript
// app/components/Button.tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.button}>クリック</button>
}
```

#### グローバル CSS

```typescript
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

#### Tailwind CSS

Tailwind CSS を使用している場合：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```typescript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### ステップ 6 & 7: エントリーポイントの作成

CRA の既存アプリケーション構造を維持するために、動的インポートとクライアントコンポーネントを使用します。

```typescript
// app/[[...slug]]/page.tsx
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <App />
}
```

```typescript
// app/[[...slug]]/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
```

### ステップ 8: 画像インポートの更新

#### Before (CRA)

```typescript
import logo from './logo.svg'

export function Header() {
  return <img src={logo} alt="Logo" />
}
```

#### After (Next.js)

##### オプション 1: 静的インポート

```typescript
import logo from './logo.svg'

export function Header() {
  return <img src={logo.src} alt="Logo" />
}
```

##### オプション 2: Image コンポーネント（推奨）

```typescript
import Image from 'next/image'
import logo from './logo.svg'

export function Header() {
  return <Image src={logo} alt="Logo" width={100} height={100} />
}
```

### ステップ 9: 環境変数の更新

#### Before (CRA)

```bash
# .env
REACT_APP_API_URL=https://api.example.com
```

```typescript
const apiUrl = process.env.REACT_APP_API_URL
```

#### After (Next.js)

```bash
# .env
NEXT_PUBLIC_API_URL=https://api.example.com
```

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### ステップ 10: package.json スクリプトの更新

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "npx serve@latest ./build",
    "lint": "next lint"
  }
}
```

### ステップ 11: CRA 固有のファイルのクリーンアップ

不要なファイルを削除します：

```bash
# 削除するファイル
public/index.html
src/index.tsx
src/index.css (グローバルスタイルを app/globals.css に移行済みの場合)

# 削除する依存関係
npm uninstall react-scripts
npm uninstall @testing-library/react @testing-library/jest-dom
```

## React Router からの移行

React Router を使用している場合、Next.js のファイルベースルーティングに移行できます。

### Before (React Router)

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts/:id" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### After (Next.js)

ファイルベースルーティング：

```
app/
├── page.tsx           # /
├── about/
│   └── page.tsx       # /about
└── posts/
    └── [id]/
        └── page.tsx   # /posts/:id
```

```typescript
// app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  return <div>投稿 ID: {params.id}</div>
}
```

## カスタム homepage の設定

CRA で `homepage` フィールドを使用していた場合：

### Before (CRA)

```json
{
  "homepage": "/my-app"
}
```

### After (Next.js)

```typescript
// next.config.ts
const nextConfig = {
  basePath: '/my-app',
  output: 'export',
  distDir: './build',
}
```

## 段階的な移行戦略

### フェーズ 1: 基本セットアップ

1. Next.js をインストール
2. ルートレイアウトを作成
3. エントリーポイントを設定

### フェーズ 2: ルーティングの移行

1. React Router を Next.js ルーティングに置き換え
2. ページを `app` ディレクトリに移行

### フェーズ 3: 最適化

1. Server Components を活用
2. Image コンポーネントで画像を最適化
3. データフェッチングを改善

## よくある問題と解決策

### 問題 1: 環境変数が undefined

**原因**: `REACT_APP_` プレフィックスが使用されている

**解決策**: `NEXT_PUBLIC_` に変更

```bash
# Before
REACT_APP_API_KEY=xxx

# After
NEXT_PUBLIC_API_KEY=xxx
```

### 問題 2: window is not defined

**原因**: Server Components で `window` にアクセスしている

**解決策**: Client Component を使用

```typescript
'use client'

export function Component() {
  if (typeof window !== 'undefined') {
    // window にアクセス
  }
}
```

### 問題 3: CSS が読み込まれない

**原因**: CSS のインポート場所が正しくない

**解決策**: レイアウトまたはページでインポート

```typescript
// app/layout.tsx
import './globals.css'
```

## パフォーマンス最適化

### 画像の最適化

```typescript
import Image from 'next/image'

export function Gallery() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### フォントの最適化

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

## まとめ

CRA から Next.js への移行により、以下のメリットがあります：

1. **パフォーマンス向上**: SSR、ISR、自動コード分割
2. **SEO 改善**: サーバーサイドレンダリングによる改善
3. **開発者体験**: 組み込みの最適化とツール
4. **柔軟性**: 複数のレンダリング戦略
5. **スケーラビリティ**: エンタープライズ対応

段階的な移行により、既存の機能を維持しながら、Next.js の利点を活用できます。
