# Link

`<Link>`は、HTMLの`<a>`要素を拡張し、ルート間のプリフェッチとクライアントサイドナビゲーションを提供するReactコンポーネントです。Next.jsでルート間を移動する主な方法です。

## インポート

```typescript
import Link from 'next/link'
```

## 基本的な使い方

```typescript
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">ダッシュボード</Link>
}
```

## Props

### `href` (必須)

ナビゲート先のパスまたはURLを指定します。

#### 文字列

```typescript
<Link href="/dashboard">ダッシュボード</Link>
```

#### オブジェクト

パスとクエリパラメータをオブジェクトで指定:

```typescript
<Link
  href={{
    pathname: '/blog',
    query: { id: '123' },
  }}
>
  ブログ投稿
</Link>
```

#### 動的ルート

動的ルートセグメントを含むパス:

```typescript
// /blog/[slug]へのリンク
<Link href={`/blog/${post.slug}`}>
  {post.title}
</Link>

// またはオブジェクト形式
<Link
  href={{
    pathname: '/blog/[slug]',
    query: { slug: post.slug },
  }}
>
  {post.title}
</Link>
```

#### URL オブジェクト

```typescript
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href={{
        pathname: '/search',
        query: { q: 'next.js', category: 'docs' },
      }}
    >
      検索
    </Link>
  )
}
// 生成されるURL: /search?q=next.js&category=docs
```

### `replace`

- **型**: `boolean`
- **デフォルト**: `false`
- **説明**: `true`の場合、ブラウザ履歴スタックに新しいURLを追加する代わりに、現在の履歴状態を置き換えます。

```typescript
<Link href="/dashboard" replace>
  ダッシュボード
</Link>
```

### `scroll`

- **型**: `boolean`
- **デフォルト**: `true`
- **説明**: ナビゲーション後のスクロール動作を制御します。

```typescript
// ページトップへのスクロールを無効化
<Link href="/dashboard" scroll={false}>
  ダッシュボード
</Link>
```

### `prefetch`

- **型**: `boolean | null`
- **デフォルト**: `null`
- **説明**: ルートのプリフェッチ動作を制御します。

```typescript
// 積極的にプリフェッチ
<Link href="/dashboard" prefetch={true}>
  ダッシュボード
</Link>

// プリフェッチを無効化
<Link href="/dashboard" prefetch={false}>
  ダッシュボード
</Link>
```

プリフェッチの動作:
- `null` (デフォルト): 自動プリフェッチ。静的ルートはフルページをプリフェッチ、動的ルートは共有レイアウトをプリフェッチ
- `true`: 静的ルートと動的ルートの両方をフルプリフェッチ
- `false`: プリフェッチを無効化

### `onNavigate`

- **型**: `(event: MouseEvent) => void`
- **説明**: クライアントサイドナビゲーション中に呼び出されるコールバック関数

```typescript
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // ナビゲーションをブロックする場合
        if (!confirm('本当に移動しますか?')) {
          e.preventDefault()
          return
        }
        // カスタムロジック
        console.log('ダッシュボードに移動中...')
      }}
    >
      ダッシュボード
    </Link>
  )
}
```

## 使用例

### 基本的なナビゲーション

```typescript
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/">ホーム</Link>
      <Link href="/about">会社概要</Link>
      <Link href="/blog">ブログ</Link>
      <Link href="/contact">お問い合わせ</Link>
    </nav>
  )
}
```

### 動的ルートへのリンク

```typescript
import Link from 'next/link'

export default function BlogList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

### クエリパラメータ付きリンク

```typescript
import Link from 'next/link'

export default function SearchFilters() {
  return (
    <div>
      <Link
        href={{
          pathname: '/search',
          query: { category: 'electronics', sort: 'price' },
        }}
      >
        家電製品を価格順で表示
      </Link>
    </div>
  )
}
```

### アクティブリンクの検出

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      <Link
        href="/"
        className={pathname === '/' ? 'active' : ''}
      >
        ホーム
      </Link>
      <Link
        href="/about"
        className={pathname === '/about' ? 'active' : ''}
      >
        会社概要
      </Link>
    </nav>
  )
}
```

CSSの例:

```css
.active {
  font-weight: bold;
  color: blue;
}
```

### ページの特定セクションへのスクロール

```typescript
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      {/* 同じページ内 */}
      <Link href="#section-1">セクション1へ</Link>

      {/* 別ページの特定セクション */}
      <Link href="/about#team">チームセクションへ</Link>
    </div>
  )
}
```

### 条件付きリンク

```typescript
import Link from 'next/link'

export default function ConditionalLink({ href, children, condition }) {
  return condition ? (
    <Link href={href}>{children}</Link>
  ) : (
    <span>{children}</span>
  )
}
```

### ボタンスタイルのリンク

```typescript
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/signup"
      className="btn btn-primary"
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: 'blue',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
      }}
    >
      新規登録
    </Link>
  )
}
```

### 外部リンク

外部URLへのリンクには、通常の`<a>`タグを使用します:

```typescript
export default function Page() {
  return (
    <div>
      {/* 外部リンク */}
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        外部サイト
      </a>

      {/* 内部リンク */}
      <Link href="/about">会社概要</Link>
    </div>
  )
}
```

### カスタムコンポーネントでのLink

```typescript
import Link from 'next/link'

function CustomLink({ href, children, ...props }) {
  return (
    <Link href={href} {...props}>
      <span className="custom-link-style">{children}</span>
    </Link>
  )
}

export default function Page() {
  return (
    <CustomLink href="/about">
      会社概要
    </CustomLink>
  )
}
```

### ナビゲーションのブロック

```typescript
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FormPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  return (
    <div>
      <form>
        <input
          type="text"
          onChange={() => setHasUnsavedChanges(true)}
        />
      </form>

      <Link
        href="/other-page"
        onNavigate={(e) => {
          if (hasUnsavedChanges) {
            if (!confirm('変更が保存されていません。本当に移動しますか?')) {
              e.preventDefault()
            }
          }
        }}
      >
        別のページへ
      </Link>
    </div>
  )
}
```

### Middlewareとの連携

```typescript
import Link from 'next/link'

export default function ProtectedPage() {
  return (
    <div>
      {/* Middlewareで保護されたルートへのリンク */}
      <Link href="/admin/dashboard">
        管理画面
      </Link>

      {/* 認証が必要なページ */}
      <Link href="/profile">
        プロフィール
      </Link>
    </div>
  )
}
```

## パフォーマンスの最適化

### プリフェッチの最適化

```typescript
// 重要なページは積極的にプリフェッチ
<Link href="/important-page" prefetch={true}>
  重要なページ
</Link>

// あまり訪問されないページはプリフェッチしない
<Link href="/rarely-visited" prefetch={false}>
  あまり訪問されないページ
</Link>
```

### スクロール位置の保持

```typescript
// 長いリストでスクロール位置を維持
<Link href="/products/[id]" scroll={false}>
  商品詳細
</Link>
```

## ベストプラクティス

### 1. 内部リンクには常にLinkを使用

```typescript
// ✅ 良い
<Link href="/about">会社概要</Link>

// ❌ 悪い
<a href="/about">会社概要</a>
```

### 2. 外部リンクには<a>を使用

```typescript
// ✅ 良い
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  外部サイト
</a>

// ❌ 悪い
<Link href="https://example.com">外部サイト</Link>
```

### 3. アクセシビリティを考慮

```typescript
// ✅ 良い: 意味のあるリンクテキスト
<Link href="/products">商品一覧を見る</Link>

// ❌ 悪い: 意味のないテキスト
<Link href="/products">こちら</Link>
```

### 4. SEOのためのprefetch

```typescript
// 重要なページはプリフェッチを有効化
<Link href="/about" prefetch={true}>
  会社概要
</Link>
```

### 5. 動的ルートの型安全性

```typescript
// TypeScriptで型安全なリンク
interface Post {
  id: string
  slug: string
  title: string
}

function BlogLink({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      {post.title}
    </Link>
  )
}
```

## トラブルシューティング

### リンクが機能しない

1. **hrefの確認**: `href`プロパティが正しく指定されているか
2. **Linkコンポーネントの使用**: `next/link`からインポートしているか
3. **子要素**: `<Link>`の直接の子要素は1つだけにする

### プリフェッチが機能しない

1. **開発環境**: プリフェッチは本番ビルドでのみ完全に機能
2. **表示領域**: リンクがビューポートに表示されているか
3. **prefetch設定**: `prefetch={false}`になっていないか確認

### スタイルが適用されない

```typescript
// ✅ 良い: 子要素にclassNameを適用
<Link href="/about">
  <span className="link-style">会社概要</span>
</Link>

// または直接Linkに適用
<Link href="/about" className="link-style">
  会社概要
</Link>
```

## まとめ

`<Link>`コンポーネントは、Next.jsアプリケーションでのナビゲーションを最適化するための重要なツールです。プリフェッチとクライアントサイドナビゲーションにより、ページ遷移が高速になり、ユーザーエクスペリエンスが向上します。適切なプロパティを使用して、パフォーマンスとアクセシビリティを最大化してください。
