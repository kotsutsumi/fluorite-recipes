# fetch

Next.jsは、サーバー側の各リクエストに対して、独自のキャッシュと再検証のセマンティクスを設定できるように、Web `fetch()` APIを拡張しています。

ブラウザでは、`cache`オプションはフェッチリクエストがブラウザのHTTPキャッシュとどのように相互作用するかを示します。この拡張により、`cache`はサーバー側のフェッチリクエストがフレームワークの永続的な[データキャッシュ](/docs/app/guides/caching#data-cache)とどのように相互作用するかを示します。

サーバーコンポーネント内で直接、`async`と`await`を使用して`fetch`を呼び出すことができます。

```typescript
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## `fetch(url, options)`

Next.jsは[Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API)を拡張しているため、[ネイティブのオプション](https://developer.mozilla.org/docs/Web/API/fetch#parameters)を使用できます。

### `options.cache`

リクエストがNext.jsの[データキャッシュ](/docs/app/guides/caching#data-cache)とどのように相互作用するかを設定します。

```typescript
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

- **`force-cache`**: Next.jsは一致するリクエストをデータキャッシュで検索します
  - 一致があり、新しい場合は、キャッシュから返されます
  - 一致がないか古い場合は、Next.jsはリモートサーバーからリソースをフェッチし、ダウンロードしたリソースでキャッシュを更新します

- **`no-store`**: Next.jsはキャッシュをチェックせずに、すべてのリクエストでリモートサーバーからリソースをフェッチし、ダウンロードしたリソースでキャッシュを更新しません

### `options.next.revalidate`

```typescript
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

リソースのキャッシュ有効期間（秒単位）を設定します。

- **`false`**: リソースを無期限にキャッシュ。`revalidate: Infinity` と意味的に同等
- **`0`**: リソースがキャッシュされないようにします
- **`number`**: リソースのキャッシュ有効期間を最大 `n` 秒に指定

### `options.next.tags`

```typescript
fetch(`https://...`, { next: { tags: ['collection'] } })
```

リソースのキャッシュタグを設定します。その後、[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)を使用してオンデマンドでデータを再検証できます。

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v13.0.0` | `fetch` が導入されました |
