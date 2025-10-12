# basePath

ドメインのサブパスの下にNext.jsアプリケーションをデプロイするには、`basePath` 設定オプションを使用できます。

`basePath` を使用すると、アプリケーションのパスプレフィックスを設定できます。例えば、`''`（空文字列、デフォルト）の代わりに `/docs` を使用するには、`next.config.js` を開いて `basePath` 設定を追加します：

```javascript
module.exports = {
  basePath: '/docs',
}
```

> **知っておくと良いこと**: この値はビルド時に設定する必要があり、値はクライアント側のバンドルにインライン化されるため、再ビルドせずに変更することはできません。

## リンク

`next/link` および `next/router` を使用して他のページにリンクする場合、`basePath` が自動的に適用されます。

例えば、`basePath` が `/docs` に設定されている場合、`/about` を使用すると自動的に `/docs/about` になります。

```javascript
export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

出力されるhtml：

```html
<a href="/docs/about">About Page</a>
```

これにより、`basePath` の値を変更する際にアプリケーション内のすべてのリンクを変更する必要がなくなります。

## 画像

`next/image` コンポーネントを使用する場合、`src` の前に `basePath` を追加する必要があります。

例えば、`basePath` が `/docs` に設定されている場合、`/docs/me.png` を使用すると画像が正しく提供されます。

```javascript
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```
