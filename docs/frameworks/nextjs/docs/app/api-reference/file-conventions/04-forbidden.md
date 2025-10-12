# forbidden.js

> **実験的機能**: `forbidden.js`ファイル規約は現在実験的であり、変更される可能性があります。本番環境での使用はまだ推奨されていません。この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを提供することを検討してください。

`forbidden.js`ファイルは、認証中に[`forbidden`](/docs/frameworks/nextjs/docs/app/api-reference/functions/forbidden)関数が呼び出されたときにUIをレンダリングするために使用されます。

Next.jsは`forbidden`関数が呼び出されると、`403`ステータスコードを返します。

## Props

`forbidden.js`コンポーネントはpropsを受け取りません。

## 例

```tsx
// app/forbidden.tsx
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>アクセス禁止</h2>
      <p>このリソースへのアクセスは許可されていません。</p>
      <Link href="/">ホームに戻る</Link>
    </div>
  )
}
```

## 使用ケース

`forbidden.js`は、以下のようなシナリオで役立ちます：

1. **認証エラー**: ユーザーが特定のリソースにアクセスする権限を持っていない場合
2. **ロールベースのアクセス制御**: ユーザーの役割が必要な権限レベルを満たしていない場合
3. **カスタムアクセス制限**: アプリケーション固有のアクセス制御ロジック

## 実装の詳細

### 基本的な実装

```tsx
// app/forbidden.tsx
import Link from 'next/link'

export default function Forbidden() {
  return (
    <main>
      <h1>403 - アクセス禁止</h1>
      <p>このページを表示する権限がありません。</p>
      <Link href="/">ホームページに戻る</Link>
    </main>
  )
}
```

### スタイル付きの実装

```tsx
// app/forbidden.tsx
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">アクセス禁止</h2>
        <p className="text-gray-600 mb-8">
          このリソースにアクセスする権限がありません。
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
```

## 関連機能

### `forbidden()`関数との連携

```tsx
// app/admin/page.tsx
import { forbidden } from 'next/navigation'
import { verifySession } from '@/lib/auth'

export default async function AdminPage() {
  const session = await verifySession()

  if (!session.isAdmin) {
    forbidden() // これがforbidden.jsをトリガーします
  }

  return <div>管理者専用コンテンツ</div>
}
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v15.1.0` | `forbidden.js`が導入されました（実験的） |

## 重要な注意点

1. **実験的機能**: この機能は現在実験的であり、将来のバージョンで変更される可能性があります
2. **本番環境**: 本番環境での使用は慎重に行ってください
3. **HTTPステータス**: Next.jsは自動的に`403`ステータスコードを返します
4. **カスタマイズ**: 必要に応じてUIを完全にカスタマイズできます

## ベストプラクティス

1. **明確なメッセージ**: ユーザーがアクセスできない理由を明確に伝えます
2. **代替アクション**: ホームページへのリンクやログインページへの誘導を提供します
3. **一貫したデザイン**: アプリケーションの他のエラーページと一貫したデザインを維持します
4. **セキュリティ**: 不要な技術的詳細を公開しないようにします

## 関連ドキュメント

- [forbidden() function](/docs/frameworks/nextjs/docs/app/api-reference/functions/forbidden)
- [Authentication](/docs/frameworks/nextjs/docs/app/building-your-application/authentication)
- [not-found.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/not-found)
- [unauthorized.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/unauthorized)
