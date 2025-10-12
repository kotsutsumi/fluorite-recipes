# Next.js Components API リファレンス

Next.js が提供する最適化されたコンポーネントの包括的なAPIリファレンスです。これらのコンポーネントを使用することで、パフォーマンス、SEO、ユーザビリティを大幅に向上させることができます。

## コンポーネント一覧

### 1. [Font](./components/01-font.md)

**対象**: Webフォントの最適化

フォントモジュール (`next/font`) を使用して、Webフォントを最適化し、プライバシーとパフォーマンスを向上させます。

**主な機能**:

- **自動最適化**: フォントファイルの自動最適化とセルフホスティング
- **プライバシー保護**: 外部ネットワークリクエストの削除
- **レイアウトシフト防止**: カスタムフォントロジックによる安定化
- **Google Fontsサポート**: 全てのGoogle Fontsに対応
- **ローカルフォント対応**: カスタムフォントファイルの使用

**基本的な使用例**:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**主要な設定オプション**:

- `weight`: フォントウェイト（可変フォント以外は必須）
- `style`: フォントスタイル（'normal', 'italic'）
- `subsets`: フォントサブセット（例: ['latin', 'latin-ext']）
- `display`: フォント表示戦略（'auto', 'block', 'swap', 'fallback', 'optional'）
- `variable`: CSS変数名（CSS変数として使用する場合）

**ローカルフォント**:

```typescript
import localFont from "next/font/local";

const myFont = localFont({
  src: "./my-font.woff2",
  display: "swap",
});
```

---

### 2. [Form](./components/02-form.md)

**対象**: フォーム送信の最適化

`<Form>`コンポーネントは、HTMLの`<form>`要素を拡張し、プリフェッチ、クライアントサイドナビゲーション、プログレッシブエンハンスメントを提供します。

**主な機能**:

- **プリフェッチ**: ローディングUIの事前読み込み
- **クライアントサイドナビゲーション**: フォーム送信時のページ遷移最適化
- **プログレッシブエンハンスメント**: JavaScriptが無効でも動作
- **2つのアクションタイプ**: 文字列アクション（ナビゲーション）と関数アクション（Server Action）

**基本的な使用例**:

#### 検索フォーム（文字列アクション）

```typescript
import Form from 'next/form'

export default function SearchPage() {
  return (
    <Form action="/search">
      <input name="query" placeholder="検索..." />
      <button type="submit">検索</button>
    </Form>
  )
}
```

#### Server Action（関数アクション）

```typescript
import Form from 'next/form'
import { createPost } from '@/app/actions'

export default function CreatePostPage() {
  return (
    <Form action={createPost}>
      <input name="title" placeholder="タイトル" />
      <textarea name="content" placeholder="内容" />
      <button type="submit">投稿を作成</button>
    </Form>
  )
}
```

**主要なProps**:

- `action`: ナビゲート先のURLまたはServer Action（必須）
- `replace`: 履歴エントリの置き換え（デフォルト: false）
- `scroll`: ナビゲーション後のスクロール動作（デフォルト: true）

---

### 3. [Image](./components/03-image.md)

**対象**: 画像の最適化

`<Image>`コンポーネントは、HTMLの`<img>`要素を拡張し、自動画像最適化機能を提供します。

**主な機能**:

- **サイズ最適化**: 各デバイスに適したサイズの画像を自動提供
- **視覚的安定性**: 画像読み込み時のレイアウトシフト防止
- **高速ページ読み込み**: 遅延読み込みとぼかしプレースホルダー
- **アセットの柔軟性**: リモートサーバー上の画像でもオンデマンドサイズ変更

**基本的な使用例**:

#### ローカル画像

```typescript
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="著者の写真"
    />
  )
}
```

#### リモート画像

```typescript
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://example.com/profile.png"
      alt="著者の写真"
      width={500}
      height={500}
    />
  )
}
```

**必須Props**:

- `src`: 画像のソース（静的インポート、外部URL、内部パス）
- `alt`: 代替テキスト（アクセシビリティとSEOに重要）
- `width` / `height`: リモート画像の場合は必須

**主要な最適化Props**:

- `fill`: 親要素を埋めるレスポンシブ画像
- `sizes`: レスポンシブ画像のサイズ指定
- `priority`: 重要な画像の優先読み込み
- `placeholder`: 読み込み中のプレースホルダー
- `quality`: 画像品質（1-100、デフォルト: 75）

---

### 4. [Link](./components/04-link.md)

**対象**: ナビゲーションの最適化

`<Link>`は、HTMLの`<a>`要素を拡張し、ルート間のプリフェッチとクライアントサイドナビゲーションを提供するReactコンポーネントです。

**主な機能**:

- **プリフェッチ**: リンク先ページの事前読み込み
- **クライアントサイドナビゲーション**: 高速なページ遷移
- **動的ルート対応**: パラメータ付きルートのサポート
- **プログラマティックナビゲーション**: コードからのナビゲーション制御

**基本的な使用例**:

#### 基本的なリンク

```typescript
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">ダッシュボード</Link>
}
```

#### 動的ルート

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

#### クエリパラメータ

```typescript
<Link
  href={{
    pathname: '/search',
    query: { q: 'next.js', category: 'docs' },
  }}
>
  検索
</Link>
// 生成されるURL: /search?q=next.js&category=docs
```

**主要なProps**:

- `href`: ナビゲート先のパスまたはURL（必須）
- `replace`: 履歴の置き換え（デフォルト: false）
- `scroll`: スクロール動作の制御（デフォルト: true）
- `prefetch`: プリフェッチの制御（デフォルト: true）

---

### 5. [Script](./components/05-script.md)

**対象**: サードパーティスクリプトの最適化

`<Script>`コンポーネントは、HTMLの`<script>`要素を拡張し、サードパーティスクリプトの読み込みと実行を最適化します。

**主な機能**:

- **最適化された読み込み**: 複数の読み込み戦略をサポート
- **パフォーマンス向上**: スクリプト読み込みタイミングの制御
- **イベントハンドリング**: スクリプト読み込み状態の監視
- **Web Worker対応**: メインスレッド負荷の軽減（実験的）

**基本的な使用例**:

```typescript
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

**読み込み戦略**:

#### `beforeInteractive`

```typescript
<Script
  src="https://example.com/critical-script.js"
  strategy="beforeInteractive"
/>
```

- Next.jsコードとハイドレーション前に読み込み
- ルートレイアウト内でのみ使用可能
- 重要なスクリプト（Bot検出、Cookie同意等）に使用

#### `afterInteractive`（デフォルト）

```typescript
<Script
  src="https://example.com/script.js"
  strategy="afterInteractive"
/>
```

- ページハイドレーション後に読み込み
- 一般的なサードパーティスクリプトに使用

#### `lazyOnload`

```typescript
<Script
  src="https://example.com/analytics.js"
  strategy="lazyOnload"
/>
```

- ブラウザのアイドル時間に読み込み
- 分析スクリプトや非重要なスクリプトに使用

**主要なProps**:

- `src`: スクリプトのURL（必須、インラインスクリプトの場合は不要）
- `strategy`: 読み込み戦略（'beforeInteractive', 'afterInteractive', 'lazyOnload'）
- `onLoad`: 読み込み完了時のコールバック
- `onError`: エラー発生時のコールバック

## コンポーネント選択指針

### パフォーマンス重視の場合

#### Core Web Vitals の最適化

- **Image**: レイアウトシフト（CLS）の防止
- **Font**: テキストの安定表示とCLS改善
- **Script**: JavaScriptによるブロッキング最小化
- **Link**: ナビゲーション体験の向上

#### 画像最適化の戦略

```typescript
// 重要な画像（Above the fold）
<Image
  src="/hero.jpg"
  alt="ヒーロー画像"
  width={1200}
  height={600}
  priority
/>

// 一般的な画像
<Image
  src="/content.jpg"
  alt="コンテンツ画像"
  width={800}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### ユーザビリティ重視の場合

#### アクセシビリティ対応

```typescript
// 適切なalt属性
<Image
  src="/chart.png"
  alt="2024年第1四半期の売上グラフ：前年同期比15%増"
  width={600}
  height={400}
/>

// セマンティックなリンク
<Link href="/article/123">
  記事のタイトル全文をリンクテキストに
</Link>
```

#### プログレッシブエンハンスメント

```typescript
// JavaScriptが無効でも動作するフォーム
<Form action="/search" method="get">
  <input name="q" type="search" required />
  <button type="submit">検索</button>
</Form>
```

### SEO重視の場合

#### フォント読み込み最適化

```typescript
// 重要なフォントの最適化
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
```

#### 画像SEO

```typescript
<Image
  src="/product.jpg"
  alt="プロダクト名 - 詳細な説明"
  width={400}
  height={300}
  // 構造化データと組み合わせて使用
/>
```

## 統合例

### E-commerce製品ページ

```typescript
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import Form from 'next/form'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function ProductPage({ product }) {
  return (
    <div className={inter.className}>
      {/* 重要な製品画像 */}
      <Image
        src={product.image}
        alt={`${product.name} - ${product.description}`}
        width={600}
        height={600}
        priority
      />

      {/* ナビゲーション */}
      <Link href="/products" replace>
        商品一覧に戻る
      </Link>

      {/* 購入フォーム */}
      <Form action={addToCart}>
        <input type="hidden" name="productId" value={product.id} />
        <button type="submit">カートに追加</button>
      </Form>

      {/* アナリティクス */}
      <Script
        src="https://analytics.example.com/track.js"
        strategy="lazyOnload"
        onLoad={() => {
          // 製品ビュー追跡
          analytics.track('product_view', { id: product.id })
        }}
      />
    </div>
  )
}
```

### ブログ記事ページ

```typescript
import { Source_Code_Pro } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function BlogPost({ post }) {
  return (
    <article className={sourceCodePro.variable}>
      {/* アイキャッチ画像 */}
      <Image
        src={post.featuredImage}
        alt={post.title}
        width={1200}
        height={630}
        priority
        placeholder="blur"
        blurDataURL={post.blurDataURL}
      />

      {/* 関連記事ナビゲーション */}
      <nav>
        {post.previousPost && (
          <Link href={`/blog/${post.previousPost.slug}`}>
            前の記事: {post.previousPost.title}
          </Link>
        )}
        {post.nextPost && (
          <Link href={`/blog/${post.nextPost.slug}`}>
            次の記事: {post.nextPost.title}
          </Link>
        )}
      </nav>
    </article>
  )
}
```

## ベストプラクティス

### パフォーマンス最適化

1. **重要なリソースの優先読み込み**

   ```typescript
   // 重要な画像
   <Image priority />

   // 重要なフォント
   const font = Inter({ preload: true })

   // 重要なスクリプト
   <Script strategy="beforeInteractive" />
   ```

2. **適切な読み込み戦略**

   ```typescript
   // Above the fold: priority
   // Below the fold: 遅延読み込み（デフォルト）
   // 非重要: lazyOnload
   ```

3. **リソースサイズの最適化**
   ```typescript
   // 適切な画像サイズとフォーマット
   <Image
     src="/image.webp"
     sizes="(max-width: 768px) 100vw, 50vw"
   />
   ```

### アクセシビリティ

1. **意味のある代替テキスト**

   ```typescript
   <Image alt="具体的で情報価値のある説明" />
   ```

2. **キーボードナビゲーション対応**
   ```typescript
   <Link href="/page">
     クリック可能な要素全体をリンクに
   </Link>
   ```

### SEO最適化

1. **構造化データとの連携**

   ```typescript
   // JSON-LDと組み合わせた画像最適化
   <Image src="/product.jpg" alt="製品名と詳細" />
   ```

2. **適切なフォント表示戦略**
   ```typescript
   const font = Inter({ display: "swap" }); // FOUT防止
   ```

## 追加リソース

### 公式ドキュメント

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js Script Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)

### パフォーマンス分析ツール

- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Analytics](https://nextjs.org/analytics)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 実装例とベストプラクティス

- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Web.dev Best Practices](https://web.dev/learn-web-vitals/)

---

各コンポーネントには詳細なAPI仕様、実装例、およびベストプラクティスが含まれています。プロジェクトの要件に応じて、適切なコンポーネントと設定を選択してください。
