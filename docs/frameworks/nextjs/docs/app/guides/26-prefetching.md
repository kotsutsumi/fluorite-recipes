# プリフェッチ

Next.jsにおけるプリフェッチは、ルート間のナビゲーションを瞬時に感じさせるための技術です。

## プリフェッチの概要

プリフェッチは、Next.jsアプリケーション内のルート間のナビゲーションを瞬時に感じさせる技術です。Next.jsは、アプリケーションコード内のリンクに基づいて、インテリジェントにプリフェッチを行います。

### プリフェッチの仕組み

- ブラウザが新しいルートのアセット（HTML、JavaScriptファイルなど）を事前に読み込む
- アプリケーションをルートごとに小さなJavaScriptチャンクに分割
- クライアント側の遷移を実行し、ページ遷移を瞬時に感じさせる

## プリフェッチの種類

### 1. 自動プリフェッチ

`Link`コンポーネントは、デフォルトでビューポート内に表示されたときに自動的にプリフェッチを実行します。

```typescript
import Link from 'next/link'

export default function NavLink() {
  return <Link href="/about">About</Link>
}
```

**特徴:**
- 本番環境でのみ実行されます
- `prefetch={false}`で無効化可能
- ビューポート内にリンクが表示されると自動的に実行されます

### 2. 手動プリフェッチ

`useRouter`フックを使用して、プログラム的にプリフェッチを実行できます。

```typescript
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/pricing')
  }, [router])

  return (
    <button onClick={() => router.push('/pricing')}>
      料金ページへ
    </button>
  )
}
```

**使用ケース:**
- 条件付きプリフェッチ
- ユーザーの行動予測に基づくプリフェッチ
- カスタムタイミングでのプリフェッチ

### 3. ホバー時プリフェッチ

ホバーイベントをトリガーにしてプリフェッチを実行する例：

```typescript
'use client'
import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

**特徴:**
- ユーザーがリンクにホバーしたときにのみプリフェッチ
- 不要なプリフェッチを削減
- ユーザーエクスペリエンスとパフォーマンスのバランス

## プリフェッチの最適化

### プリフェッチを無効化する

リソースを節約するために、特定のリンクでプリフェッチを無効化できます：

```typescript
<Link href="/about" prefetch={false}>
  About
</Link>
```

### プリフェッチのタイミング制御

```typescript
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OptimizedPage() {
  const router = useRouter()

  useEffect(() => {
    // ページロード後1秒待ってからプリフェッチ
    const timer = setTimeout(() => {
      router.prefetch('/next-page')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return <div>最適化されたページ</div>
}
```

## 静的ルートと動的ルート

### 静的ルート

静的ルートは、完全なルートデータがプリフェッチされ、キャッシュされます。

```typescript
<Link href="/about">About</Link>
```

### 動的ルート

動的ルートは、共有レイアウトのみがプリフェッチされ、特定のデータは遷移時に取得されます。

```typescript
<Link href="/blog/[slug]" as="/blog/my-post">
  My Post
</Link>
```

## ベストプラクティス

### 1. 適切なプリフェッチ戦略を選択

- **重要なページ**: 自動プリフェッチを有効化
- **あまり使われないページ**: プリフェッチを無効化
- **条件付きページ**: 手動プリフェッチを使用

### 2. プリフェッチのパフォーマンスへの影響を監視

```typescript
'use client'
import { useEffect } from 'react'

export default function MonitoredPage() {
  useEffect(() => {
    // プリフェッチのパフォーマンスを監視
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection.saveData) {
        // データセーバーモードではプリフェッチを無効化
        console.log('Data saver mode: prefetch disabled')
      }
    }
  }, [])

  return <div>監視されたページ</div>
}
```

### 3. ネットワーク条件を考慮

```typescript
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdaptiveLink({ href, children }) {
  const [shouldPrefetch, setShouldPrefetch] = useState(true)

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      // 遅いネットワークではプリフェッチを無効化
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        setShouldPrefetch(false)
      }
    }
  }, [])

  return (
    <Link href={href} prefetch={shouldPrefetch}>
      {children}
    </Link>
  )
}
```

## 次のステップ

- [ルーティング](/docs/app/building-your-application/routing)
- [Linkコンポーネント](/docs/app/api-reference/components/link)
- [useRouter](/docs/app/api-reference/functions/use-router)
