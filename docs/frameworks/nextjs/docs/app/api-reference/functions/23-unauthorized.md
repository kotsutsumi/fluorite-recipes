# unauthorized

`unauthorized`関数は、`unauthorized.js`ファイルをレンダリングするエラーをスローし、リソースへのアクセスを試みる未認証のユーザーに401エラーを表示します。

```tsx filename="app/admin/page.tsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  // 認証されたユーザーのダッシュボードをレンダリング
}
```

```jsx filename="app/admin/page.jsx" switcher
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  // 認証されたユーザーのダッシュボードをレンダリング
}
```

> **Good to know**:
>
> - `unauthorized`関数は、ルートレイアウトまたはテンプレートで呼び出すことはできません。

## 例

### カスタム未認証ページ

カスタムの未認証ページを定義できます：

```tsx filename="app/unauthorized.tsx" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

```jsx filename="app/unauthorized.jsx" switcher
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

### `unauthorized`の実装

アプリで`unauthorized`関数を使用するには、`next.config.js`ファイルで実験的な[`authInterrupts`](/docs/app/api-reference/config/next-config-js/authInterrupts)設定オプションを有効にします：

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  experimental: {
    authInterrupts: true,
  },
}
```

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v15.1.0` | `unauthorized`が導入されました |
