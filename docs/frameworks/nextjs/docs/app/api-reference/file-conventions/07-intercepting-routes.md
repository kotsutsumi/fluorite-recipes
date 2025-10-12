# インターセプティングルート（Intercepting Routes）

インターセプティングルートを使用すると、現在のレイアウト内でアプリケーションの別の部分からルートをロードできます。このルーティングパラダイムは、ユーザーが異なるコンテキストに切り替えることなくルートの内容を表示したい場合に便利です。

## 概念

インターセプティングルートは、ブラウザのURLをマスクしながら、アプリケーション内の別の場所からコンテンツを表示できるようにします。これにより、ユーザーが現在のコンテキストを失わずに新しいコンテンツにアクセスできます。

### 主な特徴

1. **コンテキストの保持**: ユーザーが現在のページから離れることなく、新しいコンテンツを表示
2. **URLマスキング**: ナビゲーション中にブラウザのURLを適切にマスク
3. **柔軟な動作**: ソフトナビゲーションとハードナビゲーションの両方をサポート

### ナビゲーションシナリオ

- **ソフトナビゲーション**: アプリ内のナビゲーション（例：`<Link>`コンポーネントを使用）→ インターセプトされたルートを表示
- **ハードナビゲーション**: ページリフレッシュまたは直接URL入力 → 元のルートを表示

## 規約

インターセプティングルートは`(..)`規約で定義できます。これは相対パス規約`../`に似ていますが、セグメント用です。

以下の規約を使用できます：

- `(.)` - **同じレベル**のセグメントにマッチ
- `(..)` - **1つ上のレベル**のセグメントにマッチ
- `(..)(..)` - **2つ上のレベル**のセグメントにマッチ
- `(...)` - **ルート**`app`ディレクトリからのセグメントにマッチ

### パス規約の例

```
app/
├── feed/
│   ├── page.tsx
│   └── (..)photo/
│       └── [id]/
│           └── page.tsx  # /feed内で/photo/[id]をインターセプト
└── photo/
    └── [id]/
        └── page.tsx      # 直接アクセス時のオリジナルルート
```

> **Note**: `(..)`規約は、ファイルシステムではなく**ルートセグメント**に基づいています。

## 例

### モーダル実装

インターセプティングルートは、モーダルを作成するために[並行ルート（Parallel Routes）](/docs/frameworks/nextjs/docs/app/building-your-application/routing/parallel-routes)と組み合わせて使用できます。

これにより、モーダルを構築する際の一般的な課題を解決できます：

- モーダルコンテンツを**URLを通じて共有可能**にする
- ページがリフレッシュされたときに、モーダルを閉じる代わりに**コンテキストを保持**する
- 後方ナビゲーションでモーダルを閉じる代わりに、**前のルートに戻る**
- 前方ナビゲーションで**モーダルを再度開く**

#### フォルダ構造例

```
app/
├── @modal/
│   ├── (.)photo/
│   │   └── [id]/
│   │       └── page.tsx
│   └── default.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── layout.tsx
```

#### レイアウトの実装

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
```

#### モーダルコンポーネント

```tsx
// app/@modal/(.)photo/[id]/page.tsx
import { Modal } from '@/components/modal'
import { getPhoto } from '@/lib/photos'

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
      <p>{photo.description}</p>
    </Modal>
  )
}
```

#### オリジナルページ

```tsx
// app/photo/[id]/page.tsx
import { getPhoto } from '@/lib/photos'

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <div>
      <h1>{photo.title}</h1>
      <img src={photo.url} alt={photo.title} />
      <p>{photo.description}</p>
    </div>
  )
}
```

### 実用例：画像ギャラリー

#### フィードページ

```tsx
// app/feed/page.tsx
import Link from 'next/link'
import { getPhotos } from '@/lib/photos'

export default async function FeedPage() {
  const photos = await getPhotos()

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/photo/${photo.id}`}>
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            className="cursor-pointer hover:opacity-80"
          />
        </Link>
      ))}
    </div>
  )
}
```

#### モーダルラッパー

```tsx
// components/modal.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  function onDismiss() {
    router.back()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      className="fixed inset-0 z-50 backdrop:bg-black/50"
    >
      <div className="relative bg-white p-6 rounded-lg">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>
  )
}
```

### デフォルトフォールバック

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

## 使用ケース

インターセプティングルートは以下のような場合に特に有効です：

### 1. 画像ギャラリー
- フィード内で画像をモーダルで開く
- 直接URLアクセス時は専用ページで表示

### 2. ログインモーダル
- アプリ内からはモーダルで表示
- 直接アクセス時は通常のページとして表示

### 3. ショッピングカート
- カートをオーバーレイで表示
- 直接アクセス時は専用ページで表示

### 4. 詳細ビュー
- リスト内でクイックプレビュー
- 直接アクセス時は完全な詳細ページ

## 並行ルートとの組み合わせ

インターセプティングルートは、並行ルートと組み合わせることで、より強力になります。

```
app/
├── @modal/
│   ├── (.)login/
│   │   └── page.tsx     # ログインモーダル
│   └── default.tsx
├── @sidebar/
│   └── page.tsx         # サイドバーコンテンツ
├── login/
│   └── page.tsx         # 通常のログインページ
└── layout.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside className="w-64">{sidebar}</aside>
      <main className="flex-1">
        {children}
        {modal}
      </main>
    </div>
  )
}
```

## ベストプラクティス

1. **適切なフォールバック**: `default.tsx`を提供して、インターセプトされないケースを処理します
2. **アクセシビリティ**: モーダルには適切なARIA属性を設定します
3. **キーボードサポート**: ESCキーでモーダルを閉じられるようにします
4. **URL共有**: モーダル内のコンテンツをURLで共有可能にします
5. **パフォーマンス**: 必要に応じて動的インポートを使用します

## 重要な注意点

1. **ルートセグメントベース**: `(..)`規約はファイルシステムではなくルートセグメントに基づきます
2. **並行ルートとの相性**: モーダル実装には並行ルートとの組み合わせが推奨されます
3. **ナビゲーションの動作**: ソフトナビゲーションとハードナビゲーションで異なる動作をします
4. **URLの扱い**: インターセプト時もURLは適切に更新されます

## 関連機能

- [並行ルート（Parallel Routes）](/docs/frameworks/nextjs/docs/app/building-your-application/routing/parallel-routes)
- [モーダル例](/docs/frameworks/nextjs/docs/app/building-your-application/routing/parallel-routes#modals)
- [default.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/default)
- [レイアウト](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/layout)

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v13.0.0` | インターセプティングルートが導入されました |

インターセプティングルートは、Next.jsの強力なルーティング機能であり、複雑なUIパターンを実装する際に非常に有用です。適切に使用することで、ユーザーエクスペリエンスを大幅に向上させることができます。
