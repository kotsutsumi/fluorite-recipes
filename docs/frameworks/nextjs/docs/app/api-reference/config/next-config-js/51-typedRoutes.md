# typedRoutes

`typedRoutes`設定オプションは、Next.jsアプリケーションで「静的に型付けされたリンク」をサポートします。

## 要件

- プロジェクトでTypeScriptを使用する必要があります
- この機能は安定版になりました（実験的機能ではなくなりました）

## 設定例

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
}

module.exports = nextConfig
```

TypeScript設定の場合：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
}

export default nextConfig
```

## 機能

`typedRoutes`を有効にすると：

1. Next.jsは`app`ディレクトリ内のすべてのルートを分析します
2. アプリケーション内の利用可能なルートの型定義を生成します
3. `Link`コンポーネントと`useRouter`フックで型安全性が提供されます

## 使用例

### 型安全なLinkコンポーネント

```typescript
import Link from 'next/link'

export default function Page() {
  return (
    <>
      {/* TypeScriptが有効なルートを提案します */}
      <Link href="/dashboard">ダッシュボード</Link>

      {/* 無効なルートはTypeScriptエラーになります */}
      {/* <Link href="/invalid-route">無効</Link> */}
    </>
  )
}
```

### 型安全なuseRouter

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleClick = () => {
    // TypeScriptが有効なルートを提案します
    router.push('/dashboard')

    // 無効なルートはTypeScriptエラーになります
    // router.push('/invalid-route')
  }

  return <button onClick={handleClick}>ダッシュボードへ</button>
}
```

## 動的ルートの型安全性

動的ルートパラメータも型チェックされます：

```typescript
// app/blog/[slug]/page.tsx が存在する場合
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href={{
        pathname: '/blog/[slug]',
        params: { slug: 'my-post' },
      }}
    >
      ブログ記事
    </Link>
  )
}
```

## 重要な注意事項

- `experimental.typedRoutes`の代わりに`typedRoutes`を使用してください
- この機能により、Next.jsアプリケーションで型安全なルーティングが有効になります
- TypeScriptプロジェクト専用に設計されています
- 開発者体験と型安全性を向上させます

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.0.0` | `typedRoutes`が安定版になりました |
| `v13.2.0` | `experimental.typedRoutes`が導入されました |

## 関連項目

- [リンクとナビゲーション](/docs/app/building-your-application/routing/linking-and-navigating)
- [TypeScript](/docs/app/building-your-application/configuring/typescript)
