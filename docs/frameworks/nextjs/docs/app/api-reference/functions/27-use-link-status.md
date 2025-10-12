# useLinkStatus

`useLinkStatus` は、`<Link>` コンポーネントの保留状態を追跡する Next.js フックで、ナビゲーション中に視覚的なフィードバックを表示できます。

## 概要

- ナビゲーションが進行中かどうかを追跡します
- ローディングインジケーターの表示に便利です
- `Link` コンポーネントの `prefetch={false}` と併用すると最も効果的です

## 使用方法

```typescript
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return pending ? (
    <div role="status" aria-label="Loading" className="spinner" />
  ) : null
}
```

## パラメータ

このフックはパラメータを受け取りません。

## 戻り値

単一の `pending` ブール値プロパティを持つオブジェクトを返します：

- `pending`: `true` の場合、履歴更新前の状態。`false` の場合、履歴更新後の状態

## 重要な注意事項

- `Link` コンポーネントの子孫要素内で使用する必要があります
- 複数のリンクをクリックした場合、最後のリンクの保留状態のみが表示されます
- Pages Router ではサポートされていません

## 推奨プラクティス

### 遅延の追加

不要なローディングインジケーターのフラッシュを防ぐために遅延を追加することをお勧めします：

```typescript
'use client'

import { useLinkStatus } from 'next/link'
import { useEffect, useState } from 'react'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  const [delayedPending, setDelayedPending] = useState(false)

  useEffect(() => {
    if (pending) {
      const timeout = setTimeout(() => setDelayedPending(true), 200)
      return () => clearTimeout(timeout)
    } else {
      setDelayedPending(false)
    }
  }, [pending])

  return delayedPending ? (
    <div role="status" aria-label="Loading" className="spinner" />
  ) : null
}
```

### CSS アニメーションの使用

ユーザーエクスペリエンスを向上させるために CSS アニメーションを使用します：

```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

## 使用例

```typescript
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { pending } = useLinkStatus()

  return (
    <Link href={href} prefetch={false}>
      {children}
      {pending && <span className="loading-spinner" />}
    </Link>
  )
}

export default function Navigation() {
  return (
    <nav>
      <NavLink href="/dashboard">ダッシュボード</NavLink>
      <NavLink href="/profile">プロフィール</NavLink>
    </nav>
  )
}
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v15.3.0` | `useLinkStatus` が導入されました |
