# headers

`headers` は、[サーバーコンポーネント](/docs/app/getting-started/server-and-client-components)から HTTP 受信リクエストヘッダーを**読み取る**ことができる**非同期**関数です。

## リファレンス

### パラメータ

`headers` はパラメータを取りません。

### 戻り値

`headers` は**読み取り専用**の [Web Headers](https://developer.mozilla.org/docs/Web/API/Headers) オブジェクトを返します。

以下のメソッドが利用可能です：
- `entries()`: キー/値のペアを反復処理
- `forEach()`: ヘッダーオブジェクトの各キー/値ペアに対して関数を実行
- `get()`: 特定のヘッダー名の値を文字列として返す
- `has()`: ヘッダーの存在を確認
- `keys()`: キーを反復処理
- `values()`: 値を反復処理

## 注意点

- `headers` は非同期関数で、`async/await` または React の `use` 関数を使用する必要があります。
- 読み取り専用のため、送信リクエストヘッダーを `set` または `delete` することはできません。
- 動的 API であり、ルートを動的レンダリングにします。

## 例

### Authorization ヘッダーの使用

```typescript
import { headers } from 'next/headers'

export default async function Page() {
  const authorization = (await headers()).get('authorization')
  const res = await fetch('...', {
    headers: { authorization }, // Authorization ヘッダーを転送
  })
  const user = await res.json()

  return <h1>{user.name}</h1>
}
```

### User-Agent の取得

```typescript
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return (
    <div>
      <h1>User Agent</h1>
      <p>{userAgent}</p>
    </div>
  )
}
```

### すべてのヘッダーの反復処理

```typescript
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()

  return (
    <ul>
      {Array.from(headersList.entries()).map(([key, value]) => (
        <li key={key}>
          {key}: {value}
        </li>
      ))}
    </ul>
  )
}
```

### カスタムヘッダーの確認

```typescript
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const apiKey = headersList.get('x-api-key')

  if (!apiKey) {
    return <div>API key required</div>
  }

  return <div>Authorized</div>
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.0.0-RC` | `headers` が非同期関数になりました |
| `v13.0.0` | `headers` が導入されました |
