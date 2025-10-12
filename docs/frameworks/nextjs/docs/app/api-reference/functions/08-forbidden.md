# forbidden

この機能は現在実験的であり、変更される可能性があるため、本番環境での使用は推奨されません。

## 概要

`forbidden` 関数は、Next.js の 403 エラーページをレンダリングするエラーを投げます。アプリケーション内の認証エラーを処理するのに役立ちます。[`forbidden.js` ファイル](/docs/app/api-reference/file-conventions/forbidden)を使用して、UIをカスタマイズできます。

使用を開始するには、`next.config.js` ファイルで実験的な [`authInterrupts`](/docs/app/api-reference/config/next-config-js/authInterrupts) 設定オプションを有効にします：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

`forbidden` は、[サーバーコンポーネント](/docs/app/getting-started/server-and-client-components)、[サーバーアクション](/docs/app/getting-started/updating-data)、[ルートハンドラ](/docs/app/api-reference/file-conventions/route)で呼び出すことができます。

## 使用例

### ロールベースのルート保護

```typescript
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // ユーザーが 'admin' ロールを持っているかチェック
  if (session.role !== 'admin') {
    forbidden()
  }

  // 承認されたユーザー用の管理ページをレンダリング
  return (
    <main>
      <h1>管理ダッシュボード</h1>
      <p>ようこそ、{session.user.name}さん</p>
    </main>
  )
}
```

### サーバーアクションでの使用

```typescript
'use server'

import { forbidden } from 'next/navigation'
import { verifySession } from '@/app/lib/dal'

export async function updateSettings(formData: FormData) {
  const session = await verifySession()

  // ユーザーに設定を更新する権限があるかチェック
  if (!session.permissions.includes('update:settings')) {
    forbidden()
  }

  // 設定を更新
  // ...
}
```

## リファレンス

### パラメータ

`forbidden` 関数はパラメータを受け取りません。

### 戻り値

`forbidden` 関数は値を返しません。

## 注意点

- `forbidden` はエラーをスローするため、`try/catch` ブロックの外で呼び出す必要があります。
- [クライアントコンポーネント](/docs/app/getting-started/server-and-client-components)では `forbidden` を直接使用できませんが、サーバーアクションを介して呼び出すことができます。

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.1.0` | `forbidden` が導入されました（実験的） |
