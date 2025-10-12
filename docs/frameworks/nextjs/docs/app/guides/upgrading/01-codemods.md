# Codemods

Codemod は、API が更新または非推奨になった際に Next.js コードベースをアップグレードするのに役立つプログラム的な変換です。これにより、手動介入なしで大規模なコード変更を行うことができます。

## 使用方法

ターミナルで以下のコマンドを実行して codemod を実行します:

```bash
npx @next/codemod <transform> <path>
```

- `<transform>`: 実行する変換の名前
- `<path>`: 変換を適用するファイルまたはディレクトリ

## 主な Codemod 変換

### Version 16.0

#### next lint から ESLint CLI への移行

`next lint` から ESLint CLI への移行を行います。

```bash
npx @next/codemod@canary upgrade latest
```

この変換は以下を実行します:
- `eslint.config.mjs` を作成
- `package.json` のスクリプトを更新
- 必要な ESLint 依存関係を追加

### Version 15.0

#### App Router Route Segment Config の変換

`experimental-edge` ランタイムを `edge` に変更します。

```bash
npx @next/codemod@canary app-dir-route-segment-config .
```

**変更前:**
```javascript
export const runtime = 'experimental-edge'
```

**変更後:**
```javascript
export const runtime = 'edge'
```

#### 非同期 Dynamic API への移行

`cookies()`, `headers()` などの API を非同期に更新します。

```bash
npx @next/codemod@canary next-async-request-api .
```

**変更前:**
```javascript
import { cookies } from 'next/headers'

const token = cookies().get('token')
```

**変更後:**
```javascript
import { cookies } from 'next/headers'

const token = (await cookies()).get('token')
```

#### `geo` および `ip` プロパティの置換

`NextRequest` のプロパティを `@vercel/functions` を使用するように変換します。

```bash
npx @next/codemod@canary next-request-geo-ip .
```

**変更前:**
```javascript
import type { NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const { geo, ip } = req
}
```

**変更後:**
```javascript
import { geolocation, ipAddress } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const geo = geolocation(req)
  const ip = ipAddress(req)
}
```

### Version 14.0

#### `ImageResponse` インポートの移行

`next/server` から `next/og` にインポートを移動します。

```bash
npx @next/codemod@latest next-og-import .
```

**変更前:**
```javascript
import { ImageResponse } from 'next/server'
```

**変更後:**
```javascript
import { ImageResponse } from 'next/og'
```

#### `viewport` エクスポートの使用

特定のビューポートメタデータを `viewport` エクスポートに移行します。

```bash
npx @next/codemod@latest metadata-to-viewport-export .
```

**変更前:**
```javascript
export const metadata = {
  themeColor: 'dark',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}
```

**変更後:**
```javascript
export const viewport = {
  themeColor: 'dark',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}
```

### Version 13.0

#### Image コンポーネントの移行

新しい Image コンポーネントに移行します。

```bash
npx @next/codemod@latest next-image-to-legacy-image .
```

この変換は以下を実行します:
- image インポートの名前を変更
- インラインスタイルを追加
- 非推奨のプロパティを削除

#### Link コンポーネントの更新

Link コンポーネント内の `<a>` タグを削除します。

```bash
npx @next/codemod@latest new-link .
```

**変更前:**
```jsx
<Link href="/about">
  <a>About</a>
</Link>
```

**変更後:**
```jsx
<Link href="/about">
  About
</Link>
```

自動修正できない場合は `legacyBehavior` を追加します。

#### React インポートの削除

不要な React インポートを削除します。

```bash
npx @next/codemod@latest remove-react-import .
```

**変更前:**
```javascript
import React from 'react'

export default function MyComponent() {
  return <div>Hello</div>
}
```

**変更後:**
```javascript
export default function MyComponent() {
  return <div>Hello</div>
}
```

## 追加の変換

Next.js には、さまざまなバージョンの変更に対応する多数の codemod が含まれています:

- AMP 設定の変更
- Anonymous Default Export の名前付き
- CRA (Create React App) からの移行
- `withamp` から config への移行

## 重要な推奨事項

- 常に codemod の変更をレビューしてください
- 変換後は徹底的にテストしてください
- バージョン管理システムを使用して変更を追跡してください
- 必要に応じて手動で調整してください

## カスタム変換

プロジェクト固有のニーズに合わせて、カスタム codemod を作成することもできます。詳細については、jscodeshift のドキュメントを参照してください。
