# Scripts（スクリプト）

Next.jsでは、`next/script`コンポーネントを使用してサードパーティスクリプトを最適化して読み込むことができます。このガイドでは、スクリプトを効率的に読み込む方法について説明します。

## スクリプト読み込みの主要な戦略

### レイアウトでのスクリプト読み込み

複数のルートでスクリプトを読み込むには、レイアウトコンポーネントで`next/script`をインポートします。スクリプトは、ネストされたルート全体で一度だけ読み込まれます。

```typescript filename="app/dashboard/layout.tsx" switcher
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```javascript filename="app/dashboard/layout.js" switcher
import Script from 'next/script'

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

### アプリケーション全体でのスクリプト読み込み

アプリケーション全体でスクリプトを読み込むには、ルートレイアウトにスクリプトを追加します。スクリプトは、アプリケーション内のすべてのルートが読み込まれるときに一度だけ読み込まれます。

```typescript filename="app/layout.tsx" switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

```javascript filename="app/layout.js" switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

> **推奨事項**: パフォーマンスへの影響を最小限に抑えるため、特定のページやレイアウトにのみサードパーティスクリプトを含めることをお勧めします。

## スクリプト読み込み戦略

`next/script`コンポーネントの`strategy`プロパティを使用して、スクリプトの読み込みタイミングを制御できます。

### `beforeInteractive`

Next.jsコードとページのハイドレーションが行われる前にスクリプトを読み込みます。

```tsx filename="app/layout.tsx"
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
      <Script
        src="https://example.com/script.js"
        strategy="beforeInteractive"
      />
    </html>
  )
}
```

### `afterInteractive`（デフォルト）

初期ページのハイドレーション後に早期にスクリプトを読み込みます。これはデフォルトの戦略です。

```tsx filename="app/page.tsx"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

### `lazyOnload`

ブラウザのアイドル時間中にスクリプトを読み込みます。

```tsx filename="app/page.tsx"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

### `worker`（実験的機能）

Webワーカーでスクリプトを読み込みます。

```tsx filename="app/page.tsx"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

## Webワーカーでのスクリプト読み込み（実験的機能）

> **警告**: `worker`戦略はまだ安定しておらず、App Routerではまだ動作しません。注意して使用してください。

`worker`戦略を使用するスクリプトは、[Partytown](https://partytown.builder.io/)を使用してWebワーカーにオフロードされ、実行されます。これにより、メインスレッドをアプリケーションコードの残りの部分に専念させることで、サイトのパフォーマンスを向上させることができます。

この戦略はまだ実験的であり、`next.config.js`で`nextScriptWorkers`フラグが有効になっている場合にのみ使用できます。

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

その後、`next`（通常は`npm run dev`または`yarn dev`）を実行すると、Next.jsがセットアップを完了するために必要なパッケージのインストールをガイドします。

```bash filename="Terminal"
npm run dev
```

次のような指示が表示されます: `npm install @builder.io/partytown`を実行して Partytown をインストールしてください。

セットアップが完了したら、`strategy="worker"`を定義すると、アプリケーションで自動的に Partytown がインスタンス化され、スクリプトがWebワーカーにオフロードされます。

```tsx filename="app/page.tsx"
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

Webワーカーでサードパーティスクリプトを読み込む際には、考慮すべきトレードオフがいくつかあります。詳細については、Partytownの[トレードオフ](https://partytown.builder.io/trade-offs)ドキュメントを参照してください。

## インラインスクリプト

インラインスクリプト、または外部ファイルから読み込まれないスクリプトも、Scriptコンポーネントでサポートされています。JavaScriptを中括弧内に配置することで記述できます。

```tsx filename="app/page.tsx"
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

または、`dangerouslySetInnerHTML`プロパティを使用します。

```tsx filename="app/page.tsx"
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **警告**: Next.jsがスクリプトを追跡し最適化するために、インラインスクリプトには`id`プロパティを割り当てる必要があります。

## イベントハンドラ

Scriptコンポーネントを使用して、特定のイベントが発生した後に追加のコードを実行するために、いくつかの異なるイベントハンドラを使用できます。

- `onLoad`: スクリプトの読み込みが完了した後にコードを実行します。
- `onReady`: スクリプトの読み込みが完了した後、およびコンポーネントがマウントされるたびにコードを実行します。
- `onError`: スクリプトの読み込みに失敗した場合にコードを実行します。

これらのハンドラは、`"use client"`が定義され、コードの最初の行として使用されている[クライアントコンポーネント](https://nextjs.org/docs/app/building-your-application/rendering/client-components)内で使用された場合にのみ機能します。

```tsx filename="app/page.tsx" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('スクリプトが読み込まれました')
        }}
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('スクリプトが読み込まれました')
        }}
      />
    </>
  )
}
```

各イベントハンドラについて詳しく知り、例を表示するには、[`next/script`](https://nextjs.org/docs/app/api-reference/components/script#onload) APIリファレンスを参照してください。

## 追加属性

Scriptコンポーネントで使用されない[`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script)要素に割り当てることができる多くのDOM属性があります。例えば、[`nonce`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce)やカスタムデータ属性などです。追加属性を含めると、最終的に最適化されたHTMLに含まれる`<script>`要素に自動的に転送されます。

```tsx filename="app/page.tsx" switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

## ベストプラクティス

- パフォーマンスへの影響を最小限に抑えるため、特定のページやレイアウトにのみサードパーティスクリプトを含める
- 適切な読み込み戦略（`strategy`）を使用する
- Webワーカーの使用には潜在的なトレードオフがあることに注意する
- インラインスクリプトには必ず`id`属性を割り当てる
- イベントハンドラはクライアントコンポーネント内でのみ使用する
