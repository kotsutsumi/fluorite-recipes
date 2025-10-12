# useRouter

`useRouter` フックを使用すると、Client Components 内でプログラム的にルートを変更できます。

## 使用方法

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      ダッシュボード
    </button>
  )
}
```

## パラメータ

このフックはパラメータを受け取りません。

## 戻り値

`useRouter` は以下のメソッドを持つオブジェクトを返します：

### `router.push(href: string, options?: NavigateOptions)`

指定されたルートへのクライアントサイドナビゲーションを実行します。ブラウザの履歴スタックに新しいエントリを追加します。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      ダッシュボード
    </button>
  )
}
```

### `router.replace(href: string, options?: NavigateOptions)`

ブラウザの履歴スタックに新しいエントリを追加せずに、指定されたルートへのクライアントサイドナビゲーションを実行します。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.replace('/dashboard')}>
      ダッシュボード
    </button>
  )
}
```

### `router.refresh()`

現在のルートを更新します。サーバーに新しいリクエストを行い、データリクエストを再取得し、Server Components を再レンダリングします。クライアントは、影響を受けない Client Component の状態を失うことなく、更新された React Server Component のペイロードをマージします。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.refresh()}>
      更新
    </button>
  )
}
```

### `router.prefetch(href: string)`

指定されたルートをプリフェッチして、クライアントサイドの遷移を高速化します。

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/dashboard')
  }, [router])

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      ダッシュボード
    </button>
  )
}
```

### `router.back()`

ブラウザの履歴スタックで前のルートに戻ります。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      戻る
    </button>
  )
}
```

### `router.forward()`

ブラウザの履歴スタックで次のページに進みます。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.forward()}>
      進む
    </button>
  )
}
```

## NavigateOptions

`push()` と `replace()` メソッドは、オプションの `options` オブジェクトを受け取ります：

```typescript
interface NavigateOptions {
  scroll?: boolean // デフォルト: true
}
```

- `scroll`: ナビゲーション後にページの上部にスクロールするかどうかを制御します。デフォルトは `true` です。

### スクロール動作の制御

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      ダッシュボード（スクロールなし）
    </button>
  )
}
```

## 重要な考慮事項

### `<Link>` コンポーネントの優先使用

可能な限り、`<Link>` コンポーネントを使用してナビゲーションを行うことを推奨します。`<Link>` コンポーネントは自動的にルートをプリフェッチし、パフォーマンスを向上させます。

### 信頼できない URL の使用禁止

ナビゲーションメソッドに信頼できない URL を送信しないでください。ユーザー入力を検証し、サニタイズしてください。

### プリフェッチの自動化

`<Link>` コンポーネントは、ビューポート内に表示されると自動的にルートをプリフェッチします。`useRouter` を使用する場合は、手動で `prefetch()` を呼び出す必要があります。

## Pages Router からの移行

Pages Router から移行する場合：

### インポートの変更

```typescript
// Pages Router (古い)
import { useRouter } from 'next/router'

// App Router (新しい)
import { useRouter } from 'next/navigation'
```

### 代替フック

以下の Pages Router の機能は、別のフックに置き換えられました：

- `pathname`: `usePathname()` を使用
- `query`: `useSearchParams()` を使用
- `asPath`: 代替なし
- `basePath`: 代替なし
- `locale`: 代替なし
- `locales`: 代替なし
- `defaultLocale`: 代替なし
- `domainLocales`: 代替なし
- `isReady`: 不要（App Router では常に準備完了）
- `isLocaleDomain`: 代替なし
- `isPreview`: `next/headers` の `draftMode()` を使用

### イベントリスナー

App Router では、`routeChangeStart`、`routeChangeComplete` などのイベントはサポートされていません。代わりに、`usePathname` と `useSearchParams` を `useEffect` と組み合わせて使用します。

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log('URL changed to:', url)
    // ここでルート変更時の処理を実行
  }, [pathname, searchParams])

  return null
}
```

## TypeScript での使用

```typescript
'use client'

import { useRouter } from 'next/navigation'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export default function Page() {
  const router: AppRouterInstance = useRouter()

  // router のメソッドは完全に型付けされています
}
```

## 使用例

### 条件付きナビゲーション

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Form() {
  const router = useRouter()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleNavigate = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm('保存されていない変更があります。本当に移動しますか？')
      if (!confirmed) return
    }
    router.push('/dashboard')
  }

  return (
    <button type="button" onClick={handleNavigate}>
      ダッシュボードへ移動
    </button>
  )
}
```

### プログラム的なナビゲーション

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RedirectAfterTimeout() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return <p>3秒後にリダイレクトされます...</p>
}
```

## 注意事項

> **Good to know**:
> - このフックは Client Components でのみ使用できます
> - `'use client'` ディレクティブが必要です
> - Server Components では使用できません

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `useRouter` (`next/navigation`) が導入されました |
