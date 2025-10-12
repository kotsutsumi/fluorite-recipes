# Next.js Version 15 へのアップグレード

このガイドは、Next.js アプリケーションをバージョン 15 にアップグレードする方法を説明します。

## アップグレードコマンド

自動アップグレードを使用する場合:

```bash
npx @next/codemod@canary upgrade latest
```

手動でアップグレードする場合:

```bash
npm install next@latest react@latest react-dom@latest
```

> **注意:** React 19 の最小バージョン要件が追加されました。

## バージョン 15 の主な変更点

### 1. React 19 への移行

Next.js 15 では React 19 が必須になりました。

#### `useFormState` から `useActionState` への変更

**変更前:**

```javascript
import { useFormState } from 'react-dom'

const [state, formAction] = useFormState(fn, initialState)
```

**変更後:**

```javascript
import { useActionState } from 'react'

const [state, formAction] = useActionState(fn, initialState)
```

**自動移行:**

```bash
npx @next/codemod@canary react-19 .
```

#### TypeScript 型定義の更新

React 19 に対応するため、TypeScript 型定義を更新してください:

```bash
npm install @types/react@latest @types/react-dom@latest
```

### 2. 非同期 Request API

以下の API が非同期になりました:

- `cookies()`
- `headers()`
- `draftMode()`
- `params` (レイアウト、ページ、ルートハンドラー、generateMetadata)
- `searchParams` (ページ)

#### cookies() の使用例

**変更前:**

```javascript
import { cookies } from 'next/headers'

const token = cookies().get('token')
```

**変更後:**

```javascript
import { cookies } from 'next/headers'

const cookieStore = await cookies()
const token = cookieStore.get('token')
```

#### headers() の使用例

**変更前:**

```javascript
import { headers } from 'next/headers'

const headersList = headers()
const userAgent = headersList.get('user-agent')
```

**変更後:**

```javascript
import { headers } from 'next/headers'

const headersList = await headers()
const userAgent = headersList.get('user-agent')
```

#### params の使用例

**変更前:**

```javascript
// app/blog/[slug]/page.tsx
export default function Page({ params }) {
  const { slug } = params
  return <h1>{slug}</h1>
}
```

**変更後:**

```javascript
// app/blog/[slug]/page.tsx
export default async function Page({ params }) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

#### searchParams の使用例

**変更前:**

```javascript
// app/page.tsx
export default function Page({ searchParams }) {
  const { query } = searchParams
  return <div>Search: {query}</div>
}
```

**変更後:**

```javascript
// app/page.tsx
export default async function Page({ searchParams }) {
  const { query } = await searchParams
  return <div>Search: {query}</div>
}
```

**自動移行:**

```bash
npx @next/codemod@canary next-async-request-api .
```

#### 一時的な同期アクセス (推奨されません)

段階的な移行のため、一時的に同期的にアクセスすることもできます:

```javascript
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'

const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies
const token = cookieStore.get('token')
```

### 3. fetch リクエストのキャッシュ変更

**変更点:**
- `fetch` リクエストはデフォルトでキャッシュされなくなりました
- 以前は自動的にキャッシュされていました

**キャッシュを有効にする場合:**

```javascript
fetch('https://example.com', { cache: 'force-cache' })
```

**または、レイアウトやページレベルで設定:**

```javascript
// layout.tsx または page.tsx
export const fetchCache = 'default-cache'
```

### 4. Route Handlers の GET メソッド

**変更点:**
- `GET` メソッドはデフォルトでキャッシュされなくなりました

**キャッシュを有効にする場合:**

```javascript
export const dynamic = 'force-static'

export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

### 5. クライアント側ルーターキャッシュ

**変更点:**
- ページコンポーネントはデフォルトでキャッシュされなくなりました
- `loading.js` は引き続き 5 分間キャッシュされます

**以前の動作に戻す場合:**

```javascript
// next.config.js
module.exports = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}
```

### 6. `next/font` の変更

**変更点:**
- `@next/font` パッケージは完全に削除されました
- 組み込みの `next/font` を使用してください

**変更前:**

```javascript
import { Inter } from '@next/font/google'
```

**変更後:**

```javascript
import { Inter } from 'next/font/google'
```

### 7. 設定オプションの名前変更

#### `bundlePagesRouterDependencies`

**変更前:**

```javascript
// next.config.js
module.exports = {
  experimental: {
    bundlePagesExternals: true,
  },
}
```

**変更後:**

```javascript
// next.config.js
module.exports = {
  bundlePagesRouterDependencies: true,
}
```

#### `serverExternalPackages`

**変更前:**

```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['package-name'],
  },
}
```

**変更後:**

```javascript
// next.config.js
module.exports = {
  serverExternalPackages: ['package-name'],
}
```

### 8. Speed Insights の自動インストルメンテーション

Vercel にデプロイする場合、Speed Insights が自動的に設定されます。ローカルでは `--experimental-test-proxy` フラグを使用してテストできます。

### 9. `NextRequest` の `geo` と `ip` プロパティ

**変更点:**
- `NextRequest` の `geo` と `ip` プロパティは非推奨になりました
- `@vercel/functions` パッケージを使用してください

**変更前:**

```javascript
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const { geo, ip } = request
}
```

**変更後:**

```javascript
import { geolocation, ipAddress } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const geo = geolocation(request)
  const ip = ipAddress(request)
}
```

**自動移行:**

```bash
npx @next/codemod@canary next-request-geo-ip .
```

## アップグレード手順

### ステップ 1: 自動アップグレードの実行

```bash
npx @next/codemod@canary upgrade latest
```

このコマンドは以下を実行します:
- 依存関係の更新
- Codemod の実行
- 設定ファイルの更新

### ステップ 2: 非同期 API への移行

```bash
npx @next/codemod@canary next-async-request-api .
```

### ステップ 3: React 19 への移行

```bash
npx @next/codemod@canary react-19 .
```

### ステップ 4: アプリケーションのテスト

```bash
npm run dev
```

### ステップ 5: 型エラーの確認と修正

```bash
npm run type-check
```

### ステップ 6: 本番ビルドの確認

```bash
npm run build
```

## 既知の問題と対処法

### React 19 の互換性エラー

一部のライブラリは React 19 とまだ互換性がない場合があります。

**対処法:**
- ライブラリの更新を待つ
- 代替ライブラリを検討する
- `npm overrides` を使用して一時的に対処する

### TypeScript エラー

React 19 の型定義変更により、TypeScript エラーが発生する可能性があります。

**対処法:**
- `@types/react` と `@types/react-dom` を最新版に更新
- 型定義を手動で調整

### キャッシュ動作の変更

`fetch` のキャッシュ動作が変更されたため、パフォーマンスに影響がある可能性があります。

**対処法:**
- 必要に応じて `cache: 'force-cache'` を明示的に指定
- レイアウトやページレベルで `fetchCache` を設定

## 追加のリソース

- [Next.js 15 リリースブログ](https://nextjs.org/blog/next-15)
- [React 19 アップグレードガイド](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Next.js ドキュメント](https://nextjs.org/docs)

## まとめ

Next.js 15 への移行には、以下の主要な変更が含まれます:

- **React 19**: 最小バージョン要件
- **非同期 API**: `cookies()`, `headers()`, `params`, `searchParams` が非同期に
- **キャッシュ動作**: `fetch` と Route Handlers のデフォルト動作変更
- **設定オプション**: 一部の実験的機能が安定版に

自動 Codemod を使用することで、多くの変更を効率的に適用できます。ただし、すべての変更を確認し、テストすることを強く推奨します。
