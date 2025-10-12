# useSearchParams

`useSearchParams` は、現在の URL のクエリ文字列パラメータを読み取ることができる Client Component フックです。

## 使用方法

```typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  return <>検索: {search}</>
}
```

## パラメータ

このフックはパラメータを受け取りません。

## 戻り値

`URLSearchParams` の読み取り専用バージョンを返します。

### 主要なメソッド

#### `get(name: string)`

指定されたパラメータの最初の値を取得します。

```typescript
const searchParams = useSearchParams()
const query = searchParams.get('query')
// URL が /?query=hello の場合、query は 'hello' になります
```

#### `has(name: string)`

指定されたパラメータが存在するかどうかをチェックします。

```typescript
const searchParams = useSearchParams()
const hasQuery = searchParams.has('query')
// URL が /?query=hello の場合、hasQuery は true になります
```

#### `getAll(name: string)`

指定されたパラメータのすべての値を配列として取得します。

```typescript
const searchParams = useSearchParams()
const tags = searchParams.getAll('tag')
// URL が /?tag=a&tag=b の場合、tags は ['a', 'b'] になります
```

#### その他のメソッド

- `keys()`: すべてのパラメータキーのイテレータを返します
- `values()`: すべてのパラメータ値のイテレータを返します
- `entries()`: すべてのキーと値のペアのイテレータを返します
- `forEach(callback)`: 各パラメータに対してコールバックを実行します
- `toString()`: クエリ文字列表現を返します

## 重要な動作

### Client Components でのみ使用可能

このフックは Client Components でのみ機能します。Server Components では使用できません。

```typescript
'use client' // この行が必要です

import { useSearchParams } from 'next/navigation'
```

### 静的レンダリングへの影響

静的にレンダリングされるルートで `useSearchParams` を使用すると、そのコンポーネントはクライアントサイドでレンダリングされるようになります。

### Suspense 境界の推奨

`<Suspense>` 境界でラップすることを推奨します：

```typescript
import { Suspense } from 'react'
import SearchBar from './search-bar'

export default function Page() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SearchBar />
    </Suspense>
  )
}
```

## レンダリングシナリオ

### 静的レンダリング

静的レンダリングの場合、`useSearchParams` を使用するとクライアントサイドレンダリングがトリガーされます。

```typescript
// app/search/page.tsx
import { Suspense } from 'react'
import SearchResults from './search-results'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SearchResults />
    </Suspense>
  )
}
```

### 動的レンダリング

動的レンダリングの場合、初期サーバーレンダリング時に `searchParams` が利用可能です。

```typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchResults() {
  const searchParams = useSearchParams()
  // 動的レンダリングでは、サーバーレンダリング時に利用可能
}
```

### Layout での使用

Layouts では `searchParams` に直接アクセスできません。代わりに、ページレベルで使用します。

## 検索パラメータの更新

### useRouter を使用する方法

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('query', term)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <input
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

### Link コンポーネントを使用する方法

```typescript
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function FilterLinks() {
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('filter') || 'all'

  return (
    <nav>
      <Link
        href="/products?filter=all"
        className={currentFilter === 'all' ? 'active' : ''}
      >
        すべて
      </Link>
      <Link
        href="/products?filter=new"
        className={currentFilter === 'new' ? 'active' : ''}
      >
        新着
      </Link>
    </nav>
  )
}
```

## 実用的な例

### 検索フィルター

```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <select onChange={(e) => updateFilter('category', e.target.value)}>
        <option value="">カテゴリを選択</option>
        <option value="electronics">電子機器</option>
        <option value="clothing">衣類</option>
      </select>

      <select onChange={(e) => updateFilter('sort', e.target.value)}>
        <option value="">並び替え</option>
        <option value="price">価格</option>
        <option value="name">名前</option>
      </select>
    </div>
  )
}
```

### ページネーション

```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        前へ
      </button>

      <span>ページ {currentPage} / {totalPages}</span>

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        次へ
      </button>
    </div>
  )
}
```

## TypeScript での使用

TypeScript では、`URLSearchParams` の型が自動的に推論されます：

```typescript
'use client'

import { useSearchParams } from 'next/navigation'

export default function Component() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()

  // TypeScript は searchParams のメソッドを認識します
  const query: string | null = searchParams.get('query')
}
```

## パフォーマンスの考慮事項

### 不要な再レンダリングの回避

検索パラメータが変更されるたびに、コンポーネントは再レンダリングされます。必要な場合にのみ `useSearchParams` を使用してください。

### メモ化の使用

```typescript
'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function Component() {
  const searchParams = useSearchParams()

  const filters = useMemo(() => {
    return {
      category: searchParams.get('category'),
      sort: searchParams.get('sort'),
      page: Number(searchParams.get('page')) || 1,
    }
  }, [searchParams])

  return <div>{/* フィルターを使用 */}</div>
}
```

## 注意事項

> **Good to know**:
> - Client Components でのみ使用できます
> - `'use client'` ディレクティブが必要です
> - Server Components では使用できません
> - `<Suspense>` 境界でラップすることを推奨します
> - 読み取り専用の `URLSearchParams` インスタンスを返します

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `useSearchParams` が導入されました |
