# unstable_cache

`unstable_cache`を使用すると、データベースクエリなどの高コストな操作の結果をキャッシュし、複数のリクエスト間で再利用できます。

```jsx
import { getUser } from './data'
import { unstable_cache } from 'next/cache'

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
)

export default async function Component({ userID }) {
  const user = await getCachedUser(userID)
  // ...
}
```

> **警告**: このAPIは、安定化に向けて進化しています。これから追加される可能性のある破壊的な変更を認識した上で使用してください。

> **Good to know**:
>
> - `unstable_cache`のスコープ内で`headers`や`cookies`のような動的データソースにアクセスすることはサポートされていません。キャッシュされた関数内でこのデータが必要な場合は、キャッシュされた関数の外で`headers`を使用し、必要な動的データを引数として渡してください。
> - このAPIは、将来のNext.jsリリースで安定化される予定の`use cache`ディレクティブに置き換えられる予定です。

## パラメータ

```jsx
const data = unstable_cache(fetchData, keyParts, options)()
```

- `fetchData`: これは、キャッシュしたいデータを取得する非同期関数です。`Promise`を返す関数である必要があります。
- `keyParts`: これは、キャッシュされたキーを識別する追加のキーを持つ配列です。デフォルトでは、`unstable_cache`は既に引数とその文字列表現を使用してキャッシュキーを作成します。これは、閉包で使用される追加のデータに基づいてキャッシュ内の一意性を識別する必要がある場合にのみ使用されます。グローバルに一意である必要があります。関数で使用される引数が利用できない場合は、空の配列`[]`を渡すことができます。
- `options`: これは、キャッシュの動作を制御するオプションを持つオブジェクトです。以下のプロパティを含めることができます：
  - `tags`: キャッシュの無効化を制御するために使用できるタグの配列。Next.jsはこれを使用して、[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)が呼び出されたときにどの項目を消去するかを識別します。
  - `revalidate`: キャッシュを再検証する秒数。オンデマンドで再検証する場合は省略するか、`false`を渡して、`revalidateTag()`または`revalidatePath()`が呼び出されるまでキャッシュします。

## 戻り値

`unstable_cache`は、呼び出されるとキャッシュされたデータに解決されるPromiseを返す関数を返します。データがキャッシュにない場合、提供された関数が呼び出され、その結果がキャッシュされて返されます。

## 例

```tsx filename="app/page.tsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  const cachedData = await unstable_cache(
    async () => {
      const data = await fetch(`/api/data/${id}`)
      return data
    },
    [id],
    {
      tags: [`data-${id}`],
      revalidate: 60,
    }
  )()

  return <div>{cachedData}</div>
}
```

```jsx filename="app/page.jsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({ params }) {
  const { id } = await params
  const cachedData = await unstable_cache(
    async () => {
      const data = await fetch(`/api/data/${id}`)
      return data
    },
    [id],
    {
      tags: [`data-${id}`],
      revalidate: 60,
    }
  )()

  return <div>{cachedData}</div>
}
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v14.0.0` | `unstable_cache`が導入されました |
