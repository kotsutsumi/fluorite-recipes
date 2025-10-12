# template.js

`template.js`ファイルは、レイアウトに似ていますが、ナビゲーション時に新しいインスタンスを作成する特別なファイルです。

## 概要

`template`は、レイアウトや子ページをラップするという点でレイアウトに似ていますが、重要な違いがあります：

- レイアウトは複数のページ間で永続化され、状態を保持します
- テンプレートはナビゲーション時に各子に対して新しいインスタンスを作成します

## 規約

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```jsx
// app/template.jsx
export default function Template({ children }) {
  return <div>{children}</div>
}
```

## 動作

### レイアウトとの違い

テンプレートがレイアウトと異なる主な点：

1. **新しいインスタンスの作成**：ナビゲーション時に、テンプレートの新しいインスタンスが作成されます
2. **状態のリセット**：子コンポーネントの状態がリセットされます
3. **エフェクトの再実行**：`useEffect`などのエフェクトが再実行されます
4. **DOM要素の再作成**：DOM要素が完全に再作成されます

### ネストの順序

ルートセグメントにレイアウトとテンプレートの両方がある場合、テンプレートはレイアウトの内側にネストされます：

```tsx
<Layout>
  {/* テンプレートにはナビゲーション時に一意のキーが自動的に付与されます */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

## 使用例

### 基本的なテンプレート

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Welcome</h1>
      {children}
    </div>
  )
}
```

### CSS Transitionsを使用したアニメーション

ナビゲーション時にエントランスアニメーションを追加：

```tsx
// app/template.tsx
'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### useEffectの再同期

ナビゲーション時に`useEffect`を再実行：

```tsx
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ナビゲーション時に毎回実行されます
    console.log('Page loaded')

    // アナリティクスの追跡
    trackPageView()

    return () => {
      console.log('Page unloaded')
    }
  }, [])

  return <div>{children}</div>
}
```

### 状態のリセット

ナビゲーション時にClient Componentの状態をリセット：

```tsx
// app/search/template.tsx
'use client'

import { SearchForm } from '@/components/SearchForm'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* ナビゲーション時にフォームの状態がリセットされます */}
      <SearchForm />
      {children}
    </div>
  )
}
```

## 実用的なシナリオ

### ページビューのトラッキング

```tsx
// app/template.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return <div>{children}</div>
}
```

### ページトランジション

```tsx
// app/template.tsx
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: 'linear' }}
    >
      {children}
    </motion.div>
  )
}
```

### スクロール位置のリセット

```tsx
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ナビゲーション時にスクロール位置をトップにリセット
    window.scrollTo(0, 0)
  }, [])

  return <div>{children}</div>
}
```

### フォーカス管理

```tsx
// app/template.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ナビゲーション時にメインコンテンツにフォーカスを移動
    mainRef.current?.focus()
  }, [])

  return (
    <div ref={mainRef} tabIndex={-1}>
      {children}
    </div>
  )
}
```

## テンプレートとレイアウトの使い分け

### テンプレートを使用すべき場合

以下の場合にテンプレートを使用します：

- ナビゲーション時に`useEffect`を再実行する必要がある
- ナビゲーション時にClient Componentの状態をリセットしたい
- ページトランジションやアニメーションを実装したい
- ページビューのトラッキングを実装したい
- ナビゲーション時にスクロール位置やフォーカスをリセットしたい

### レイアウトを使用すべき場合

以下の場合にレイアウトを使用します：

- ナビゲーション間で状態を保持したい
- UIの共通部分を共有したい（ヘッダー、フッターなど）
- パフォーマンスを最適化したい（不要な再レンダリングを避ける）

## ファイル構造の例

### シンプルな構造

```
app/
├── layout.tsx      # ルートレイアウト
├── template.tsx    # ルートテンプレート
├── page.tsx        # ホームページ
└── blog/
    ├── layout.tsx  # ブログレイアウト
    ├── template.tsx # ブログテンプレート
    ├── page.tsx    # ブログ一覧
    └── [slug]/
        └── page.tsx # ブログ記事
```

### 複雑な構造

```
app/
├── layout.tsx
├── template.tsx
├── page.tsx
├── (marketing)/
│   ├── layout.tsx
│   ├── template.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
└── (dashboard)/
    ├── layout.tsx
    ├── template.tsx
    ├── overview/
    │   └── page.tsx
    └── analytics/
        └── page.tsx
```

## パフォーマンスへの影響

### 注意事項

テンプレートはナビゲーション時に新しいインスタンスを作成するため、以下の影響があります：

1. **追加の再レンダリング**：コンポーネントツリー全体が再レンダリングされます
2. **状態の喪失**：Client Componentの状態がリセットされます
3. **エフェクトの再実行**：すべてのエフェクトが再実行されます
4. **パフォーマンスコスト**：レイアウトと比較してわずかなパフォーマンスコストがあります

### ベストプラクティス

- 必要な場合にのみテンプレートを使用する
- 重い計算や初期化処理は避ける
- 可能な限りレイアウトを使用して状態を保持する
- パフォーマンスクリティカルな部分では使用を避ける

## Server ComponentとClient Component

### Server Component（デフォルト）

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

### Client Component

```tsx
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // クライアント側のロジック
  }, [])

  return <div>{children}</div>
}
```

ほとんどの場合、テンプレートでClient Component機能（`useEffect`、`useState`など）を使用する必要があるため、`'use client'`ディレクティブを追加します。

## Props

### `children`

テンプレートは、`children` propを受け取ります。これは、ページまたは子セグメントがレンダリングされる場所です。

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

## Good to Know

- テンプレートには、ナビゲーション時に一意のキーが自動的に付与されます
- テンプレートとレイアウトの両方が定義されている場合、テンプレートはレイアウトの内側にネストされます
- テンプレートはデフォルトでServer Componentですが、`'use client'`ディレクティブでClient Componentとして使用できます

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v13.0.0` | `template` が導入 |
