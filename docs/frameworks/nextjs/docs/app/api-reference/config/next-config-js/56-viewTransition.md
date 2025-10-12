# viewTransition

> **警告**: この機能は実験的であり、本番環境での使用は推奨されません。

ReactでView Transitions APIを使用するための実験的な機能です。

## 重要な注意事項

> **警告**: この機能はNext.jsチームによって開発またはメンテナンスされていません

- まだ初期段階です
- 将来のReactリリースで動作が変更される可能性があります

## 設定

`next.config.js`で有効にします：

```javascript filename="next.config.js"
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
}

module.exports = nextConfig
```

TypeScriptの場合：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
```

## 使用方法

```typescript
import { unstable_ViewTransition as ViewTransition } from 'react'

export default function Page() {
  return (
    <ViewTransition>
      <div>
        <h1>ページコンテンツ</h1>
      </div>
    </ViewTransition>
  )
}
```

## View Transitions APIとは

View Transitions APIは、ページ間の遷移をスムーズにアニメーション化するためのWeb標準です。

### 基本的な概念

```typescript
'use client'

import { unstable_ViewTransition as ViewTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()

  const handleNavigation = () => {
    // View Transitionを使用したナビゲーション
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push('/other-page')
      })
    } else {
      router.push('/other-page')
    }
  }

  return (
    <button onClick={handleNavigation}>
      他のページへ
    </button>
  )
}
```

## CSSアニメーション

View Transitionsをカスタマイズするには、CSSを使用します：

```css filename="styles.css"
/* デフォルトのトランジション */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
}

/* カスタムアニメーション */
@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

::view-transition-new(root) {
  animation-name: slide-in;
}
```

## 高度な使用例

### 特定の要素のトランジション

```css filename="styles.css"
/* 特定の要素に名前を付ける */
.hero-image {
  view-transition-name: hero-image;
}

/* その要素のトランジションをカスタマイズ */
::view-transition-old(hero-image),
::view-transition-new(hero-image) {
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
}
```

```typescript filename="component.tsx"
export default function Hero() {
  return (
    <div className="hero-image">
      <img src="/hero.jpg" alt="Hero" />
    </div>
  )
}
```

### 条件付きトランジション

```typescript
'use client'

import { unstable_ViewTransition as ViewTransition } from 'react'
import { useState } from 'react'

export default function Page() {
  const [enableTransition, setEnableTransition] = useState(true)

  const content = (
    <div>
      <h1>コンテンツ</h1>
    </div>
  )

  if (enableTransition) {
    return <ViewTransition>{content}</ViewTransition>
  }

  return content
}
```

## ブラウザサポート

View Transitions APIは、すべてのブラウザでサポートされているわけではありません：

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [supportsViewTransition, setSupportsViewTransition] = useState(false)

  useEffect(() => {
    setSupportsViewTransition('startViewTransition' in document)
  }, [])

  if (!supportsViewTransition) {
    return <div>お使いのブラウザはView Transitionsをサポートしていません</div>
  }

  return <div>View Transitionsが有効です</div>
}
```

## パフォーマンスの考慮事項

- トランジションは、パフォーマンスに影響を与える可能性があります
- 複雑なアニメーションは、低速なデバイスで問題を引き起こす可能性があります
- `prefers-reduced-motion`メディアクエリを尊重してください

```css filename="styles.css"
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms !important;
  }
}
```

## デモ

Next.jsチームは、View Transitionsのデモを提供しています：

- [Next.js View Transition Demo](https://view-transitions-demo.vercel.app/)

## ドキュメントと例

現在、ドキュメントと例は限られています。開発者は、以下を参照することをお勧めします：

- [Reactのソースコード](https://github.com/facebook/react)
- [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

## トラブルシューティング

### トランジションが機能しない

1. ブラウザがView Transitions APIをサポートしていることを確認
2. `experimental.viewTransition`が有効になっていることを確認
3. CSS構文が正しいことを確認

### パフォーマンスの問題

1. アニメーション期間を短縮
2. トランジションを簡素化
3. `prefers-reduced-motion`を実装

## フィードバック

この機能はまだ初期段階にあります。[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v14.0.0` | `experimental.viewTransition`が導入されました |

## 関連項目

- [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [ルーティングとナビゲーション](/docs/app/building-your-application/routing)
