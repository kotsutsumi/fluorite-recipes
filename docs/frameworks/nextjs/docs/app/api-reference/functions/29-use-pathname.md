# usePathname

`usePathname` は、現在の URL のパス名を読み取ることができる Client Component フックです。

## 使用方法

```typescript
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>現在のパス名: {pathname}</p>
}
```

## パラメータ

このフックはパラメータを受け取りません。

## 戻り値

現在の URL のパス名を表す文字列を返します。

### パス名の戻り値の例

| URL | 戻り値 |
|-----|--------|
| `/` | `'/'` |
| `/dashboard` | `'/dashboard'` |
| `/dashboard?v=2` | `'/dashboard'` |
| `/blog/hello-world` | `'/blog/hello-world'` |

## 重要な注意事項

- Server Components ではサポートされていません
- Client Components でのみ使用可能です
- `'use client'` ディレクティブが必要です
- フォールバックルートなど、特定のシナリオでは `null` を返す可能性があります

## ルート変更への応答

`usePathname` と他のフックを組み合わせて、ルート変更に応答できます：

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log('ルートが変更されました:', url)

    // ここでルート変更に応じた処理を実行できます
    // 例: アナリティクスへの送信など
  }, [pathname, searchParams])

  return null
}
```

## リライトと使用する際の注意

リライトと併用する場合、ハイドレーションミスマッチを避けるために注意が必要です：

```typescript
'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

function PathnameContent() {
  const pathname = usePathname()
  return <p>現在のパス名: {pathname}</p>
}

export default function Pathname() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <PathnameContent />
    </Suspense>
  )
}
```

## Server Components での代替案

Server Components でパス名にアクセスする必要がある場合は、ページパラメータを使用します：

```typescript
// app/dashboard/page.tsx (Server Component)
export default function Page({ params }: { params: { slug: string } }) {
  // Server Component では params を直接使用します
  return <div>Slug: {params.slug}</div>
}
```

## 互換性

- Next.js バージョン 13.0.0 で導入されました
- モダンな React および Next.js アプリケーション向けに設計されています
- App Router アーキテクチャの一部です

## TypeScript での使用

TypeScript では、戻り値の型は自動的に推論されます：

```typescript
'use client'

import { usePathname } from 'next/navigation'

export default function Component() {
  const pathname: string = usePathname()
  // pathname は string 型です
}
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `usePathname` が導入されました |
