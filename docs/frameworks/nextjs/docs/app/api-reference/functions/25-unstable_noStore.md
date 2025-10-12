# unstable_noStore

`unstable_noStore`は、静的レンダリングをオプトアウトし、特定のコンポーネントがキャッシュされないようにするために使用できます。

```jsx
import { unstable_noStore as noStore } from 'next/cache'

export default async function Component() {
  noStore()
  const result = await db.query(...)
  // ...
}
```

> **Good to know**:
>
> - `unstable_noStore`は、`fetch`の`cache: 'no-store'`と同等です
> - `unstable_noStore`は、`export const dynamic = 'force-dynamic'`よりも優先されます。なぜなら、より細かい粒度で、コンポーネントごとに使用できるからです
> - `unstable_cache`内で`unstable_noStore`を使用しても、静的生成からオプトアウトされません。代わりに、キャッシュの動作を決定するためにキャッシュ設定に従います。

## 使用法

`fetch`に追加のオプションを渡したくない場合（例：`cache: 'no-store'`または`next: { revalidate: 0 }`）、これらすべてのユースケースの代替として`noStore()`を使用できます。

```jsx
import { unstable_noStore as noStore } from 'next/cache'

export default async function Component() {
  noStore()
  const result = await db.query(...)
  // ...
}
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v15.0.0` | `unstable_noStore`は`connection`に取って代わられました |
| `v14.0.0` | `unstable_noStore`が導入されました |
