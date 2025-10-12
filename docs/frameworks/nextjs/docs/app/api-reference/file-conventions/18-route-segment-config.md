# Route Segment Config（ルートセグメント設定）

ルートセグメント設定を使用すると、ページ、レイアウト、Route Handlerの動作を直接エクスポートされた変数で設定できます。

## 概要

ルートセグメント設定オプションを使用すると、以下の設定が可能です：

- ページ、レイアウト、Route Handlerの動作の設定
- デフォルトの`fetch()`リクエストのキャッシング動作の上書き
- ランタイム環境の指定
- 再検証時間の設定

## 設定オプション

### `experimental_ppr`

Partial Prerendering（部分的な事前レンダリング）を有効にします。

```tsx
// layout.tsx | page.tsx | route.ts
export const experimental_ppr = true
// true | false
```

### `dynamic`

レイアウトまたはページの動的レンダリング動作を変更します。

```tsx
// layout.tsx | page.tsx | route.ts
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

**オプション：**

- `'auto'`（デフォルト）：可能な限りキャッシュし、コンポーネントが動的関数を使用したり、キャッシュされていないデータリクエストを行ったりするのを防ぎません
- `'force-dynamic'`：動的レンダリングを強制し、リクエスト時にルートをレンダリングします。キャッシュされていないデータの`fetch()`リクエストに`{ cache: 'no-store', next: { revalidate: 0 } }`を設定するのと同等です
- `'error'`：レイアウトまたはページで動的関数やキャッシュされていないデータを使用している場合にエラーを発生させ、静的レンダリングを強制します
- `'force-static'`：レイアウトまたはページを静的にレンダリングすることを強制し、`cookies()`、`headers()`、`searchParams`が空の値を返すようにします

**Good to know:**

- `dynamic = 'error'`と`dynamic = 'force-static'`の動作は、`fetch()`リクエストのキャッシング動作を`{ cache: 'force-cache' }`に変更することで変わります

### `dynamicParams`

`generateStaticParams`で生成されなかった動的セグメントが訪問された場合の動作を制御します。

```tsx
// layout.tsx | page.tsx
export const dynamicParams = true
// true | false
```

**オプション：**

- `true`（デフォルト）：`generateStaticParams`に含まれていない動的セグメントはオンデマンドで生成されます
- `false`：`generateStaticParams`に含まれていない動的セグメントは404を返します

**Good to know:**

- このオプションは`generateStaticParams`を使用するルートにのみ適用されます
- `true`に設定すると、静的サイト生成（SSG）と増分静的再生成（ISR）の組み合わせを有効にします

**例：**

```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

### `revalidate`

レイアウトまたはページのデフォルトの再検証時間を設定します。

```tsx
// layout.tsx | page.tsx | route.ts
export const revalidate = false
// false | 0 | number（秒）
```

**オプション：**

- `false`：（デフォルト）無期限にキャッシュします。`fetch()`で`{ cache: 'force-cache' }`を設定するのと同等ですが、個々の`fetch()`リクエストで`revalidate`や`cache: 'no-store'`を使用できます
- `0`：動的関数やキャッシュされていないデータフェッチが使用されていなくても、常に動的にレンダリングされます
- `number`：（秒単位）レイアウトまたはページのデフォルトの再検証頻度を`n`秒に設定します

**Good to know:**

- 同じルート内の個々の`fetch()`リクエストで設定された`revalidate`値が`revalidate`のルートデフォルト値よりも低い場合、ルート全体の再検証間隔が短くなります
- 同じルート内の2つの異なるレイアウトまたはページで異なる`revalidate`値が設定されている場合、低い方の値がルート全体に適用されます
- 開発を簡素化するために、開発モードでは`revalidate`は常に`0`に設定されます

**例：**

```tsx
// app/blog/page.tsx
export const revalidate = 3600 // 1時間ごとに再検証

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### `fetchCache`

**これは高度なオプションで、デフォルトの動作を上書きする特定のユースケースにのみ使用してください。**

デフォルトでは、Next.jsは動的関数が使用される前に到達可能なすべての`fetch()`リクエストをキャッシュし、動的関数が使用された後に検出された`fetch()`リクエストはキャッシュしません。

`fetchCache`を使用すると、レイアウトまたはページ内のすべての`fetch()`リクエストのデフォルトの`cache`オプションを上書きできます。

```tsx
// layout.tsx | page.tsx | route.ts
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

**オプション：**

- `'auto'`（デフォルト）：動的関数の前の`fetch()`リクエストを提供された`cache`オプションでキャッシュし、動的関数の後の`fetch()`リクエストを`{ cache: 'no-store' }`でキャッシュします
- `'default-cache'`：任意の`cache`オプションを`fetch()`に渡すことを許可しますが、オプションが提供されていない場合は`cache`オプションを`'force-cache'`に設定します。つまり、動的関数の後の`fetch()`リクエストでも静的と見なされます
- `'only-cache'`：すべての`fetch()`リクエストがキャッシュにオプトインすることを保証します。オプションが提供されていない場合はデフォルトを`{ cache: 'force-cache' }`に変更し、任意の`fetch()`リクエストが`{ cache: 'no-store' }`を使用している場合はエラーを発生させます
- `'force-cache'`：すべての`fetch()`リクエストの`cache`オプションを`'force-cache'`に設定することで、すべての`fetch()`リクエストがキャッシュにオプトインすることを保証します
- `'default-no-store'`：任意の`cache`オプションを`fetch()`に渡すことを許可しますが、オプションが提供されていない場合は`cache`オプションを`'no-store'`に設定します。つまり、動的関数の前の`fetch()`リクエストでも動的と見なされます
- `'only-no-store'`：すべての`fetch()`リクエストがキャッシュにオプトアウトすることを保証します。オプションが提供されていない場合はデフォルトを`{ cache: 'no-store' }`に変更し、任意の`fetch()`リクエストが`{ cache: 'force-cache' }`を使用している場合はエラーを発生させます
- `'force-no-store'`：すべての`fetch()`リクエストの`cache`オプションを`'no-store'`に設定することで、すべての`fetch()`リクエストがキャッシュにオプトアウトすることを保証します。これにより、`{ cache: 'force-cache' }`オプションを提供する`fetch()`リクエストでも強制的に毎回データを再取得します

**クロスルートセグメント動作：**

- 単一のルート内のすべてのレイアウトとページで設定されたオプションは、互換性がある必要があります
  - `'only-cache'`と`'force-cache'`の両方が提供されている場合、`'force-cache'`が優先されます。`'only-no-store'`と`'force-no-store'`の両方が提供されている場合、`'force-no-store'`が優先されます
  - 強制オプションの意図は、ルート全体が完全に静的または完全に動的であることを保証することです。つまり：
    - `'only-cache'`と`'only-no-store'`の組み合わせは単一のルートでは許可されません
    - `'force-*'`オプションと`'only-*'`オプションの組み合わせは単一のルートでは許可されません
  - `'auto'`または`'*-cache'`を提供する子が`'force-no-store'`を提供する親がある場合、同じ`fetch()`が異なる動作をする可能性があるため、共通の親は`'default-no-store'`を使用する必要があります

**Good to know:**

- `fetch()`リクエストを共有するルート全体で一貫性を保つために、単一のルートセグメント設定オプションを使用することをお勧めします

### `runtime`

```tsx
// layout.tsx | page.tsx | route.ts
export const runtime = 'nodejs'
// 'nodejs' | 'edge'
```

**オプション：**

- `'nodejs'`（デフォルト）：Node.jsランタイムを使用します
- `'edge'`：Edgeランタイムを使用します

**ランタイムの違い：**

| 機能 | Node.js | Edge |
| --- | --- | --- |
| レスポンス時間 | 標準 | 高速 |
| Node.js API | フルサポート | 一部制限 |
| ストリーミング | サポート | サポート |
| コールドスタート | 遅い | 速い |

### `preferredRegion`

```tsx
// layout.tsx | page.tsx | route.ts
export const preferredRegion = 'auto'
// 'auto' | 'global' | 'home' | ['iad1', 'sfo1']
```

**オプション：**

- `'auto'`（デフォルト）：Next.jsが最適なリージョンを選択します
- `'global'`：すべてのリージョンにデプロイします
- `'home'`：ホームリージョンにデプロイします
- 文字列配列：特定のリージョンのリストにデプロイします（例：`['iad1', 'sfo1']`）

**Good to know:**

- `preferredRegion`のサポートと利用可能なリージョンは、デプロイプラットフォームによって異なります
- `preferredRegion`が指定されていない場合、最も近い親レイアウトのオプションを継承します
- ルートレイアウトはデフォルトですべてのリージョンになります

### `maxDuration`

デフォルトでは、Next.jsはサーバー側のロジックの実行を制限しません（ルートのレンダリングまたはRoute Handlerの計算）。

デプロイプラットフォームは、Next.jsビルド出力の`maxDuration`を使用して、実行する関数に特定の制限を追加できます。

**注意：**この設定にはNext.js `13.4.10`以降が必要です。

```tsx
// layout.tsx | page.tsx | route.ts
export const maxDuration = 5
```

**Good to know:**

- Server Actionsを使用している場合、ページレベルで`maxDuration`を設定して、ページで使用されるすべてのServer Actionsのデフォルトのタイムアウトを変更します

### `generateStaticParams`

`generateStaticParams`関数は、ビルド時に静的に生成されるルートセグメントパラメータを定義するために、動的ルートセグメントと組み合わせて使用できます。

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

詳細については、[generateStaticParams](/docs/frameworks/nextjs/docs/app/api-reference/functions/generate-static-params.md)のドキュメントを参照してください。

## 組み合わせ例

### 静的サイト生成（SSG）

完全に静的なページを生成します。

```tsx
// app/blog/page.tsx
export const dynamic = 'error'
export const revalidate = false

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',
  }).then((res) => res.json())

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 増分静的再生成（ISR）

一定時間後にページを再検証します。

```tsx
// app/blog/page.tsx
export const revalidate = 3600 // 1時間ごとに再検証

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### サーバーサイドレンダリング（SSR）

すべてのリクエストでページを動的にレンダリングします。

```tsx
// app/blog/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'no-store',
  }).then((res) => res.json())

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### エッジランタイムでの動的レンダリング

```tsx
// app/api/search/route.ts
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  const results = await performSearch(query)

  return Response.json({ results })
}
```

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v15.0.0` | `maxDuration` のデフォルト値が Vercel にデプロイされたルートの `runtime` と `preferredRegion` に基づいて決定されるようになりました |
| `v14.2.0` | `experimental_ppr` が導入 |
| `v14.1.0` | `instrumentation.js` の `register` が安定版に |
| `v14.0.0` | `export const runtime` のデフォルト値が `nodejs` に変更 |
| `v13.4.0` | `revalidate` のデフォルト値が `false` から `undefined` に変更 |
| `v13.3.0` | `preferredRegion` と `maxDuration` が導入 |
| `v13.2.0` | `runtime` が導入 |
| `v13.0.0` | `dynamic`、`dynamicParams`、`revalidate`、`fetchCache`、`generateStaticParams` が導入 |
