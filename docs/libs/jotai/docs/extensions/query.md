# Query

## 概要

Jotai Queryは、TanStack Queryを使用してReactアプリケーションで非同期状態を管理するための拡張ライブラリです。外部データの取得、キャッシュ、同期を処理するためのプリミティブで柔軟な状態管理機能を提供します。

## 主な機能

- TanStack Query v5をサポート
- 段階的な導入が可能
- 複数のクエリ関連アトムクリエーター
- Suspenseサポート
- サーバーサイドレンダリング（SSR）互換性

## インストール

```bash
npm install jotai-tanstack-query @tanstack/query-core
```

## エクスポートされる関数

- `atomWithQuery`: `useQuery`と同様のクエリアトムを作成
- `atomWithInfiniteQuery`: 無限クエリアトムを作成
- `atomWithMutation`: ミューテーションアトムを作成
- `atomWithSuspenseQuery`: Suspense互換のクエリアトムを作成
- `atomWithSuspenseInfiniteQuery`: Suspense互換の無限クエリアトムを作成
- `atomWithMutationState`: ミューテーションキャッシュへのアクセスを提供

## 基本的な使用例

### クエリアトム

```javascript
const userAtom = atomWithQuery((get) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json()
  },
}))
```

### 無限クエリアトム

```javascript
const postsAtom = atomWithInfiniteQuery(() => ({
  queryKey: ['posts'],
  queryFn: async ({ pageParam }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`)
    return res.json()
  },
  getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
  initialPageParam: 1,
}))
```

### ミューテーションアトム

```javascript
const postAtom = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: async ({ title }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    })
    return res.json()
  },
}))
```

## v0.8.0での注目すべき変更点

- アトムシグネチャの簡素化
- タプルの代わりに単一のアトムを返す
- TanStack Queryの動作とより一貫性のある動作
