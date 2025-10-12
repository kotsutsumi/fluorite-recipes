# error.js

`error.js`ファイル規約を使用すると、[ネストされたルート](/docs/frameworks/nextjs/docs/app/building-your-application/routing#nested-routes)で予期しないランタイムエラーを適切に処理できます。

## 機能

- ルートセグメントとそのネストされた子を[React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)で自動的にラップします
- ファイルシステム階層を使用して粒度を調整し、特定のセグメントに合わせたエラーUIを作成します
- 影響を受けたセグメントにエラーを分離し、残りのアプリケーションを機能させ続けます
- ページ全体をリロードせずにエラーからの回復を試みる機能を追加します

ルートセグメント内に`error.js`ファイルを追加し、Reactコンポーネントをエクスポートすることで、エラーUIを作成します。

```tsx
// app/dashboard/error.tsx
'use client' // エラーバウンダリはクライアントコンポーネントである必要があります

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログサービスに記録
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>問題が発生しました！</h2>
      <button
        onClick={
          // セグメントを再レンダリングして回復を試みる
          () => reset()
        }
      >
        もう一度試す
      </button>
    </div>
  )
}
```

## Props

### `error`

[`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)オブジェクトのインスタンスで、`error.js`クライアントコンポーネントに転送されます。

#### `error.message`

エラーメッセージ。

- クライアントコンポーネントから転送されたエラーの場合、これは元のエラーのメッセージになります
- サーバーコンポーネントから転送されたエラーの場合、これは機密情報の漏洩を避けるための一般的なエラーメッセージになります。`errors.digest`を使用して、サーバー側のログで対応するエラーを照合できます

#### `error.digest`

サーバーコンポーネントでスローされたエラーの自動生成されたハッシュ。サーバー側のログで対応するエラーを照合するために使用できます。

### `reset`

エラーバウンダリをリセットする関数。実行されると、関数はエラーバウンダリの内容を再レンダリングしようとします。成功すると、フォールバックエラーコンポーネントは再レンダリングの結果に置き換えられます。

ユーザーにエラーからの回復を試みるよう促すために使用できます。

> **Good to know:**
>
> - `error.js`バウンダリは[クライアントコンポーネント](/docs/frameworks/nextjs/docs/app/building-your-application/rendering/client-components)である必要があります
> - 本番ビルドでは、サーバーコンポーネントから転送されたエラーは、機密情報の漏洩を避けるために特定のエラーの詳細が削除されます
> - `error.js`バウンダリは、**同じ**セグメントの`layout.js`コンポーネントでスローされたエラーを処理**しません**。これは、エラーバウンダリがそのレイアウトコンポーネントの**内側**にネストされているためです
>   - 特定のレイアウトのエラーを処理するには、レイアウトの親セグメントに`error.js`ファイルを配置します
>   - ルートレイアウトまたはテンプレート内のエラーを処理するには、`global-error.js`という`error.js`のバリエーションを使用します

## `global-error.js`

ルート`layout.js`でエラーを処理するには、`app`ディレクトリのルートに配置される`global-error.js`という`error.js`のバリエーションを使用します。

```tsx
// app/global-error.tsx
'use client' // グローバルエラーはクライアントコンポーネントである必要があります

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-errorはhtmlとbodyタグを定義する必要があります
    <html>
      <body>
        <h2>問題が発生しました！</h2>
        <button onClick={() => reset()}>もう一度試す</button>
      </body>
    </html>
  )
}
```

> **Good to know:**
>
> - `global-error.js`は、アクティブになると、ルート`layout.js`を置き換えるため、独自の`<html>`および`<body>`タグを定義**する必要があります**
> - エラーUIを設計する際は、[React Developer Tools](https://react.dev/learn/react-developer-tools)を使用してエラーバウンダリを手動で切り替えると便利です

## not-found.js

[`not-found`](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/not-found)ファイルは、ルートセグメント全体内で[`notFound()`](/docs/frameworks/nextjs/docs/app/api-reference/functions/not-found)関数がスローされたときにUIをレンダリングします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v13.1.0` | `global-error`が導入されました |
| `v13.0.0` | `error`が導入されました |

## ベストプラクティス

1. **ユーザーフレンドリーなメッセージ**: 技術的な詳細を避け、わかりやすいエラーメッセージを表示します
2. **回復オプション**: `reset`関数を使用してユーザーが問題を解決できるようにします
3. **エラーログ**: 本番環境では、エラーを適切にログに記録してモニタリングします
4. **段階的なエラーハンドリング**: 異なる階層にエラーバウンダリを配置して、きめ細かい制御を実現します

## 関連機能

- [Error Handling](/docs/frameworks/nextjs/docs/app/building-your-application/routing/error-handling)
- [global-error.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/error#global-errorjs)
- [not-found.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/not-found)
