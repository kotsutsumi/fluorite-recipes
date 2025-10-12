# useSelectedLayoutSegments

`useSelectedLayoutSegments` は、現在の Layout より下のアクティブなルートセグメントを読み取ることができる Client Component フックです。

## 使用方法

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

## パラメータ

```typescript
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

`useSelectedLayoutSegments` は、オプションで `parallelRoutesKey` を受け取ります。これにより、そのスロット内のアクティブなルートセグメントを読み取ることができます。

## 戻り値

アクティブなルートセグメントを表す文字列の配列を返します。セグメントが存在しない場合は空の配列を返します。

## 重要な考慮事項

- Client Component フックです
- 通常、Layout にインポートされた Client Component 経由で呼び出されます
- 親 Layouts で子セグメントの情報が必要な UI を作成するために使用されます

## セグメント戻り値の例

| Layout | 訪問した URL | 返されるセグメント |
|--------|-------------|-------------------|
| `app/layout.js` | `/` | `[]` |
| `app/layout.js` | `/dashboard` | `['dashboard']` |
| `app/layout.js` | `/dashboard/settings` | `['dashboard', 'settings']` |
| `app/dashboard/layout.js` | `/dashboard` | `[]` |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']` |
| `app/dashboard/layout.js` | `/dashboard/analytics/views` | `['analytics', 'views']` |

## パンくずリストの例

`useSelectedLayoutSegments` を使用してパンくずリストコンポーネントを作成できます：

```typescript
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments()

  return (
    <nav aria-label="パンくずリスト">
      <ol style={{ display: 'flex', listStyle: 'none', gap: '8px' }}>
        <li>
          <Link href="/">ホーム</Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1

          return (
            <li key={segment}>
              <span> / </span>
              {isLast ? (
                <span>{segment}</span>
              ) : (
                <Link href={href}>{segment}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

### Layout での使用

```typescript
// app/layout.tsx
import Breadcrumbs from './breadcrumbs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Breadcrumbs />
        {children}
      </body>
    </html>
  )
}
```

## Route Groups の処理

返されるセグメントには Route Groups（`(group-name)` のような括弧で囲まれたフォルダ）が含まれます。これらを除外したい場合は、`filter()` メソッドを使用できます：

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  // Route Groups を除外
  const filteredSegments = segments.filter((segment) => !segment.startsWith('('))

  return (
    <ul>
      {filteredSegments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

## 並列ルートでの使用

並列ルート（スロット）のアクティブなセグメントを読み取るには、`parallelRoutesKey` パラメータを使用します：

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const authSegments = useSelectedLayoutSegments('auth')

  // @auth スロット内のアクティブなセグメントを取得
  console.log(authSegments)

  return <div>{/* Layout コンテンツ */}</div>
}
```

## TypeScript での使用

TypeScript では、戻り値の型は自動的に推論されます：

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function Component() {
  const segments: string[] = useSelectedLayoutSegments()

  // segments は string[] 型です
}
```

## ナビゲーションインジケーターの例

現在の深度レベルを表示するナビゲーションインジケーター：

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function DepthIndicator() {
  const segments = useSelectedLayoutSegments()
  const depth = segments.length

  return (
    <div>
      <p>現在の深度: {depth}</p>
      <p>現在のパス: /{segments.join('/')}</p>
    </div>
  )
}
```

## アクティブナビゲーションの例

複数レベルのナビゲーションでアクティブな状態を管理：

```typescript
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/dashboard',
    children: [
      { name: '概要', href: '/dashboard/overview' },
      { name: '分析', href: '/dashboard/analytics' },
    ],
  },
  {
    name: '設定',
    href: '/settings',
    children: [
      { name: 'プロフィール', href: '/settings/profile' },
      { name: 'アカウント', href: '/settings/account' },
    ],
  },
]

export default function Navigation() {
  const segments = useSelectedLayoutSegments()

  const isActive = (href: string) => {
    const hrefSegments = href.split('/').filter(Boolean)
    return hrefSegments.every((segment, index) => segments[index] === segment)
  }

  return (
    <nav>
      {navigation.map((item) => (
        <div key={item.name}>
          <Link
            href={item.href}
            className={isActive(item.href) ? 'active' : ''}
          >
            {item.name}
          </Link>
          {item.children && (
            <ul>
              {item.children.map((child) => (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    className={isActive(child.href) ? 'active' : ''}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
```

## セグメントの変換

セグメントを人間が読める形式に変換：

```typescript
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

const segmentLabels: Record<string, string> = {
  dashboard: 'ダッシュボード',
  settings: '設定',
  profile: 'プロフィール',
  analytics: '分析',
  overview: '概要',
}

export default function ReadableSegments() {
  const segments = useSelectedLayoutSegments()

  return (
    <div>
      {segments.map((segment, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          {segmentLabels[segment] || segment}
        </span>
      ))}
    </div>
  )
}
```

## 単一セグメントの取得

1レベル下のセグメントのみが必要な場合は、`useSelectedLayoutSegment` を使用してください：

```typescript
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Component() {
  const segment = useSelectedLayoutSegment()
  // 単一のセグメントのみを返します
}
```

## 注意事項

> **Good to know**:
> - Client Component フックです
> - `'use client'` ディレクティブが必要です
> - 通常、Layout にインポートされた Client Component 経由で呼び出されます
> - 返されるセグメントには Route Groups が含まれます
> - Route Groups を除外するには `filter()` を使用します
> - 単一セグメントのみが必要な場合は `useSelectedLayoutSegment` を使用します

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `useSelectedLayoutSegments` が導入されました |
