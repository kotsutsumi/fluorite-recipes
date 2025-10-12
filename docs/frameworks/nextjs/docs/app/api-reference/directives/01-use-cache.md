# use cache

`use cache`ディレクティブを使用すると、ルート、Reactコンポーネント、または関数をキャッシュ可能としてマークできます。

## 概要

`use cache`は、サーバー側でのデータキャッシュを可能にする実験的な機能です。このディレクティブを使用することで、ルート全体、コンポーネントの出力、または関数の結果をキャッシュし、パフォーマンスを向上させることができます。

> **注意:** この機能は現在実験的です。使用するには`next.config.ts`で有効化する必要があります。

## 設定

`use cache`を使用するには、`next.config.ts`で実験的機能を有効化します:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useCache: true
  }
}

export default nextConfig
```

## 使用方法

### 関数レベルのキャッシュ

関数の結果をキャッシュする最も基本的な使用例:

```typescript
'use cache'

export async function getData() {
  const data = await fetch('/api/data')
  return data
}
```

### コンポーネントレベルのキャッシュ

Reactコンポーネントの出力をキャッシュする:

```typescript
'use cache'

export default async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### ルートレベルのキャッシュ

ルート全体をキャッシュする:

```typescript
'use cache'

export default async function Page() {
  const posts = await fetchPosts()

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

## キャッシュの仕組み

キャッシュキーは以下の要素から生成されます:

1. **ビルドID**: Next.jsアプリケーションのビルド識別子
2. **関数ID**: キャッシュされる関数またはコンポーネントの識別子
3. **シリアライズ可能な関数引数**: 関数に渡される引数

```typescript
'use cache'

async function getUser(userId: string) {
  // キャッシュキーは: buildId + functionId + userId
  const user = await db.user.findUnique({ where: { id: userId } })
  return user
}
```

## キャッシュの再検証

デフォルトでは、サーバー側のキャッシュエントリは**15分間**有効です。この期間後、キャッシュは自動的に再検証されます。

### カスタム再検証期間

再検証期間をカスタマイズすることも可能です（機能が安定版になった際に詳細なドキュメントが提供されます）。

## 重要な制約事項

### シリアライズ可能な戻り値

キャッシュされる関数やコンポーネントの戻り値は、シリアライズ可能である必要があります:

```typescript
// ✅ 良い例: シリアライズ可能
'use cache'
async function getData() {
  return {
    name: 'John',
    age: 30,
    tags: ['developer', 'next.js']
  }
}

// ❌ 悪い例: 関数はシリアライズできない
'use cache'
async function getBadData() {
  return {
    name: 'John',
    callback: () => console.log('Hello') // エラー!
  }
}
```

### リクエスト時APIとの併用不可

`use cache`は、以下のようなリクエスト時APIと併用できません:

- `cookies()`
- `headers()`
- `searchParams`（動的な値として使用する場合）

```typescript
// ❌ エラー: use cacheとcookiesは併用できない
'use cache'
import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = cookies() // エラー!
  const token = cookieStore.get('token')
  return fetchUser(token)
}
```

### シリアライズ不可能な引数

関数に渡される引数がシリアライズ不可能な場合、それらは参照として扱われます:

```typescript
'use cache'
async function processData(callback: () => void) {
  // callbackはシリアライズできないため、参照として扱われる
  // これはキャッシュキーに影響を与える可能性がある
}
```

### 静的エクスポートでの制約

`use cache`は静的エクスポート（`output: 'export'`）ではサポートされていません。

## プラットフォームサポート

### Node.jsサーバー

`use cache`はNode.jsサーバーで完全にサポートされています。

### Dockerコンテナ

Dockerコンテナ環境でも動作します。

### プラットフォーム固有のアダプター

Vercelなどのプラットフォームでは、プラットフォーム固有のアダプターを通じてサポートされる場合があります。

## キャッシュレベルの詳細

### 1. ルート全体のキャッシュ

ページファイルの先頭に`use cache`を配置することで、ルート全体がキャッシュされます:

```typescript
// app/posts/page.tsx
'use cache'

export default async function PostsPage() {
  const posts = await fetchAllPosts()
  return <PostList posts={posts} />
}
```

### 2. コンポーネント出力のキャッシュ

個々のコンポーネントの出力をキャッシュできます:

```typescript
// components/UserCard.tsx
'use cache'

export async function UserCard({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  )
}
```

### 3. 関数出力のキャッシュ

データ取得関数の結果をキャッシュできます:

```typescript
// lib/data.ts
'use cache'

export async function getProductById(id: string) {
  const product = await db.product.findUnique({ where: { id } })
  return product
}
```

## ベストプラクティス

1. **粒度の適切な選択**: ルート全体ではなく、個々の関数やコンポーネントにキャッシュを適用することで、より細かい制御が可能になります。

2. **シリアライズ可能性の確認**: キャッシュされるデータが常にシリアライズ可能であることを確認してください。

3. **再検証戦略の考慮**: データの更新頻度に応じて、適切な再検証期間を設定してください。

4. **パフォーマンスの測定**: キャッシュ導入前後でパフォーマンスを測定し、実際の改善効果を確認してください。

5. **実験的機能の認識**: この機能は実験的であるため、本番環境での使用には注意が必要です。

## まとめ

`use cache`ディレクティブは、Next.jsアプリケーションのパフォーマンスを向上させる強力なツールです。ルート、コンポーネント、関数の各レベルでキャッシュを適用できる柔軟性により、アプリケーションのニーズに合わせた最適化が可能です。

ただし、現在は実験的機能であるため、APIが変更される可能性があることを念頭に置いてください。本番環境での使用前に、十分なテストを行うことをお勧めします。

## 関連リンク

- [データフェッチングとキャッシング](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [再検証](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
