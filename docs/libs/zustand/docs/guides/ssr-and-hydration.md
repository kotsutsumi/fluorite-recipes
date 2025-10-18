# SSRとHydration

## サーバーサイドレンダリング（SSR）

サーバーサイドレンダリング（SSR）は、サーバー上でコンポーネントをHTML文字列にレンダリングし、それらを直接ブラウザに送信し、最終的に静的マークアップをクライアント上で完全にインタラクティブなアプリに「ハイドレート」する技術です。

### ステートレスアプリのためのReact実装

ステートレスアプリには以下が必要です：
- `express`
- `react`
- `react-dom/server`

主要なステップは以下の通りです：
1. `tsconfig.json`を設定する
2. `App`コンポーネントを作成する
3. Expressを使用してサーバーを設定する
4. `ReactDOMServer.renderToPipeableStream()`を使用してアプリをレンダリングする

サーバー設定の例：
```tsx
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { App } from './app.tsx'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const app = express()

app.get('/', (_, res) => {
  const { pipe } = ReactDOMServer.renderToPipeableStream(<App />, {
    onShellReady() {
      res.setHeader('content-type', 'text/html')
      pipe(res)
    },
  })
})

app.listen(port, () => {
  console.log(`Server is listening at ${port}`)
})
```

## Hydration

Hydrationは、サーバーからの初期HTMLスナップショットを、ブラウザで動作する完全にインタラクティブなアプリに変換します。推奨される方法は`hydrateRoot()`を使用することです。

### ステートフルアプリのためのReact実装

ステートフルアプリには以下が必要です：
- `express`
- `react`
- `react-dom/server`
- `react-dom/client`

主要なステップは以下の通りです：
1. `tsconfig.json`を設定する
2. `App`コンポーネントを作成する
3. `ReactDOMClient.hydrateRoot()`を使用してクライアントサイドのハイドレーションを設定する
4. ブートストラップスクリプトを含めるようにサーバーを設定する

> **注意**: このガイドは進行中です。完全な実装の詳細については、Zustandの公式ドキュメントを参照してください。
