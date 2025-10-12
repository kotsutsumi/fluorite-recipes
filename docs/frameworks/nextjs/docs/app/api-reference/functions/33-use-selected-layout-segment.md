# useSelectedLayoutSegment

`useSelectedLayoutSegment` は、現在の Layout から1レベル下のアクティブなルートセグメントを読み取ることができる Client Component フックです。

## 使用方法

```typescript
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>アクティブなセグメント: {segment}</p>
}
```

## パラメータ

```typescript
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment` は、オプションで `parallelRoutesKey` を受け取ります。これにより、そのスロット内のアクティブなルートセグメントを読み取ることができます。

## 戻り値

アクティブなセグメントの文字列を返します。セグメントが存在しない場合は `null` を返します。

## 重要な考慮事項

- Client Component フックです
- 通常、Layout にインポートされた Client Component 経由で呼び出されます
- 1レベル下のセグメントのみを返します

## セグメント戻り値の例

| Layout | 訪問した URL | 返されるセグメント |
|--------|-------------|-------------------|
| `app/layout.js` | `/` | `null` |
| `app/layout.js` | `/dashboard` | `'dashboard'` |
| `app/dashboard/layout.js` | `/dashboard` | `null` |
| `app/dashboard/layout.js` | `/dashboard/settings` | `'settings'` |
| `app/dashboard/layout.js` | `/dashboard/analytics` | `'analytics'` |

## 実用例: アクティブリンクコンポーネント

現在のルートセグメントに基づいてスタイルを変更するナビゲーションコンポーネントを作成できます。

```typescript
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

### Layout での使用例

```typescript
// app/blog/layout.tsx
import { BlogNavLink } from './blog-nav-link'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>
        <BlogNavLink slug="news">ニュース</BlogNavLink>
        <BlogNavLink slug="tutorials">チュートリアル</BlogNavLink>
        <BlogNavLink slug="guides">ガイド</BlogNavLink>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

## 並列ルートでの使用

並列ルート（スロット）のアクティブなセグメントを読み取るには、`parallelRoutesKey` パラメータを使用します。

```typescript
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')

  // @auth スロット内のアクティブなセグメントを取得
  return <div>{/* Layout コンテンツ */}</div>
}
```

## TypeScript での使用

TypeScript では、戻り値の型は自動的に推論されます：

```typescript
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Component() {
  const segment: string | null = useSelectedLayoutSegment()

  // segment は string または null です
}
```

## 複数レベルのセグメント

複数レベルのセグメントを取得する必要がある場合は、`useSelectedLayoutSegments` を使用してください。

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function Component() {
  const segments = useSelectedLayoutSegments()
  // 例: ['dashboard', 'settings', 'profile']
}
```

## ナビゲーションメニューの例

```typescript
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const navItems = [
  { slug: 'dashboard', label: 'ダッシュボード' },
  { slug: 'settings', label: '設定' },
  { slug: 'profile', label: 'プロフィール' },
]

export default function Navigation() {
  const activeSegment = useSelectedLayoutSegment()

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.slug}`}
              className={activeSegment === item.slug ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

## 条件付きレンダリング

アクティブなセグメントに基づいてコンテンツを条件付きでレンダリングできます：

```typescript
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function LayoutHeader() {
  const segment = useSelectedLayoutSegment()

  return (
    <header>
      <h1>
        {segment === 'dashboard' && 'ダッシュボード'}
        {segment === 'settings' && '設定'}
        {segment === 'profile' && 'プロフィール'}
        {!segment && 'ホーム'}
      </h1>
    </header>
  )
}
```

## 注意事項

> **Good to know**:
> - Client Component フックです
> - `'use client'` ディレクティブが必要です
> - 通常、Layout にインポートされた Client Component 経由で呼び出されます
> - 1レベル下のセグメントのみを返します
> - すべてのセグメントを取得するには `useSelectedLayoutSegments` を使用します

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `useSelectedLayoutSegment` が導入されました |
