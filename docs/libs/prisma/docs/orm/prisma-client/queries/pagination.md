# ページネーション

Prismaは2種類のページネーション方法を提供します：オフセットページネーションとカーソルベースページネーション。

## オフセットページネーション

`skip`と`take`を使用して、結果セットの特定の範囲を取得します。

### 基本的な使用

```typescript
// 最初の3レコードをスキップし、次の4レコードを取得
const results = await prisma.post.findMany({
  skip: 3,
  take: 4,
})
```

### ページ番号による取得

```typescript
const page = 2
const pageSize = 10

const results = await prisma.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
})
```

### 総ページ数の計算

```typescript
const totalRecords = await prisma.post.count()
const pageSize = 10
const totalPages = Math.ceil(totalRecords / pageSize)
```

## カーソルベースページネーション

一意の順次列（IDやタイムスタンプ）を使用して、効率的にページネーションします。

### 基本的な使用

```typescript
// 最初の4レコードを取得
const firstPage = await prisma.post.findMany({
  take: 4,
  orderBy: {
    id: 'asc'
  }
})

// 最後のレコードのIDをカーソルとして保存
const lastPostInResults = firstPage[3]
const myCursor = lastPostInResults.id

// 次の4レコードを取得
const secondPage = await prisma.post.findMany({
  take: 4,
  skip: 1, // カーソル自体をスキップ
  cursor: {
    id: myCursor
  },
  orderBy: {
    id: 'asc'
  }
})
```

### 前後のページ移動

```typescript
// 次のページ
const nextPage = await prisma.post.findMany({
  take: 5,
  skip: 1,
  cursor: {
    id: currentCursor
  },
  orderBy: {
    id: 'asc'
  }
})

// 前のページ（逆順で取得）
const previousPage = await prisma.post.findMany({
  take: -5,
  skip: 1,
  cursor: {
    id: currentCursor
  },
  orderBy: {
    id: 'asc'
  }
})
```

## 比較

### オフセットページネーション

**利点**:
- 任意のページにジャンプ可能
- 実装が簡単
- ページ番号が必要な場合に適している

**欠点**:
- 大きな結果セットでは非効率
- データベース負荷が高い
- データが変更されるとページがずれる可能性

### カーソルベースページネーション

**利点**:
- スケーラブル
- パフォーマンスが一定
- 無限スクロールに適している
- リアルタイムデータに強い

**欠点**:
- 特定のページにジャンプできない
- 実装がやや複雑
- 一意で順次的なフィールドが必要

## 実用的な例

### 無限スクロール

```typescript
async function loadMore(cursor: number | null) {
  const pageSize = 20

  const posts = await prisma.post.findMany({
    take: pageSize,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor
      }
    }),
    orderBy: {
      id: 'asc'
    }
  })

  const lastPost = posts[posts.length - 1]
  return {
    posts,
    nextCursor: lastPost?.id
  }
}
```

### ページ番号付きリスト

```typescript
async function getPage(page: number, pageSize: number = 10) {
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.post.count()
  ])

  return {
    posts,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page
  }
}
```

## ベストプラクティス

- 無限スクロールにはカーソルベースを使用
- ページ番号が必要な場合はオフセットを使用
- 常に`orderBy`を指定して一貫性を保つ
- 大規模なデータセットではカーソルベースを優先
- ページサイズを適切に設定（通常10〜50件）
