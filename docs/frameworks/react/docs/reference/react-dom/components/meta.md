# `<meta>`

ブラウザ組み込みの `<meta>` コンポーネントを利用することで、ドキュメントにメタデータを追加できます。

```jsx
<meta name="author" content="John Smith" />
```

## リファレンス

### `<meta>`

ドキュメントメタデータを追加するには、ブラウザ組み込みの `<meta>` コンポーネントをレンダーします。コンポーネントの任意の場所から `<meta>` をレンダーでき、React は常に対応する DOM 要素をドキュメントの `<head>` に配置します。

```jsx
<meta name="keywords" content="React, JavaScript, tutorial" />
```

#### Props

`<meta>` は、すべての一般的な要素の props をサポートしています。

**以下のうち正確に1つの prop が必要です:**

- **`name`**: 文字列。ドキュメントに添付するメタデータのタイプを指定します。
- **`charset`**: 文字列。ドキュメントで使用される文字セットを指定します。有効な値は `"utf-8"` のみです。
- **`httpEquiv`**: 文字列。ドキュメントの処理指示を提供します。
- **`itemProp`**: 文字列。ドキュメント全体ではなく、ドキュメント内の特定の項目に関するメタデータを指定します。

**その他の Props:**

- **`content`**: 文字列。`name` または `itemProp` と共に使用する場合はメタデータの内容を、`httpEquiv` と共に使用する場合はディレクティブの動作を指定します。

#### 特別なレンダリング動作

React は、React ツリーのどこにレンダーされても、`<meta>` コンポーネントに対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<meta>` が存在できる唯一の有効な場所ですが、特定のページを表すコンポーネントが自身で `<meta>` コンポーネントをレンダーできると便利で、コンポーザビリティが保たれます。

**1つの例外があります:** `<meta>` に `itemProp` prop がある場合、特別な動作はありません。この場合、ドキュメント全体に関するメタデータではなく、ページの特定の部分に関するメタデータを表すためです。

## 使用法

### ドキュメントに注釈を付ける

キーワード、要約、著者名などのメタデータを使用してドキュメントに注釈を付けることができます。React は、React ツリーのどこに配置されていても、このメタデータをドキュメントの `<head>` 内に配置します。

```jsx
export default function BlogPost() {
  return (
    <>
      <meta name="author" content="John Smith" />
      <meta name="keywords" content="React, JavaScript, semantic markup, html" />
      <meta name="description" content="React の <meta> コンポーネントの API リファレンス" />
      <h1>私のブログ投稿</h1>
      <p>...</p>
    </>
  );
}
```

### 一般的なメタデータの例

#### 文字セットの指定

ドキュメントの文字エンコーディングを指定します:

```jsx
<meta charset="utf-8" />
```

#### ビューポート設定

レスポンシブデザインのためのビューポート設定:

```jsx
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

#### 説明とキーワード

検索エンジン最適化(SEO)のための説明とキーワード:

```jsx
<meta name="description" content="React を使った最新の Web アプリケーション開発について学びます" />
<meta name="keywords" content="React, JavaScript, Web 開発, チュートリアル" />
```

#### 著者情報

ページの著者を指定:

```jsx
<meta name="author" content="Jane Doe" />
```

### Open Graph メタデータ

ソーシャルメディアでの共有時の表示を制御:

```jsx
export default function ArticlePage() {
  return (
    <>
      <meta property="og:title" content="React の基礎" />
      <meta property="og:description" content="React の基本概念を学びます" />
      <meta property="og:image" content="https://example.com/image.jpg" />
      <meta property="og:url" content="https://example.com/article" />
      <meta property="og:type" content="article" />

      <article>
        <h1>React の基礎</h1>
        <p>...</p>
      </article>
    </>
  );
}
```

### Twitter Card メタデータ

Twitter での共有時の表示をカスタマイズ:

```jsx
export default function ProductPage() {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@username" />
      <meta name="twitter:title" content="素晴らしい製品" />
      <meta name="twitter:description" content="この製品の説明" />
      <meta name="twitter:image" content="https://example.com/product.jpg" />

      <div>
        <h1>素晴らしい製品</h1>
        <p>...</p>
      </div>
    </>
  );
}
```

### HTTP 相当のメタタグ

HTTP ヘッダーと同様の動作を指定:

```jsx
export default function App() {
  return (
    <>
      {/* コンテンツタイプと文字セット */}
      <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />

      {/* X-UA-Compatible (IE 互換性モード) */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* リフレッシュ/リダイレクト */}
      <meta httpEquiv="refresh" content="30" />

      <HomePage />
    </>
  );
}
```

### 特定の項目に注釈を付ける

`itemProp` を使用して、ドキュメント内の特定の項目に関するメタデータを指定できます。この場合、React は `<meta>` を `<head>` に配置せず、他の React コンポーネントと同様に配置します。

```jsx
export default function ProductPage() {
  return (
    <section itemScope itemType="https://schema.org/Product">
      <h1 itemProp="name">高品質ヘッドフォン</h1>
      <meta itemProp="description" content="最高の音質を提供するヘッドフォン" />
      <meta itemProp="brand" content="AudioTech" />
      <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="price" content="299.99" />
        <meta itemProp="priceCurrency" content="USD" />
      </span>
    </section>
  );
}
```

### 構造化データ(Schema.org)

検索エンジンのための構造化データを提供:

```jsx
export default function RecipePage() {
  return (
    <article itemScope itemType="https://schema.org/Recipe">
      <h1 itemProp="name">チョコレートケーキ</h1>
      <meta itemProp="description" content="美味しいチョコレートケーキのレシピ" />
      <img itemProp="image" src="cake.jpg" alt="チョコレートケーキ" />

      <div itemProp="author" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content="シェフ 田中" />
      </div>

      <time itemProp="datePublished" dateTime="2024-01-15">
        2024年1月15日
      </time>

      <div itemProp="recipeInstructions">
        <p>1. オーブンを180度に予熱します</p>
        <p>2. 材料を混ぜ合わせます</p>
      </div>
    </article>
  );
}
```

### ロボットメタタグ

検索エンジンクローラーの動作を制御:

```jsx
export default function PrivatePage() {
  return (
    <>
      {/* このページをインデックスしない */}
      <meta name="robots" content="noindex, nofollow" />

      {/* または、特定のボットのみ */}
      <meta name="googlebot" content="noindex" />

      <div>
        <h1>プライベートコンテンツ</h1>
        <p>このページは検索結果に表示されません</p>
      </div>
    </>
  );
}
```

### テーマカラー

モバイルブラウザのテーマカラーを指定:

```jsx
export default function App() {
  return (
    <>
      {/* Android Chrome のアドレスバーの色 */}
      <meta name="theme-color" content="#4285f4" />

      {/* iOS Safari のステータスバーの色 */}
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      <HomePage />
    </>
  );
}
```

## 重要な注意事項

### 注意点

**一度にひとつの `<meta>` のみをレンダー:**

同じ `name` または `httpEquiv` を持つ複数の `<meta>` タグが同時にレンダーされると、React はそれらすべてをドキュメントの `<head>` に配置します。これは予期しない動作を引き起こす可能性があります。

```jsx
// 🔴 避けるべき: 同じ name を持つ複数の meta タグ
<meta name="description" content="説明 1" />
<meta name="description" content="説明 2" />

// ✅ 推奨: 条件付きレンダリングを使用
{isArticle ? (
  <meta name="description" content="記事の説明" />
) : (
  <meta name="description" content="一般的な説明" />
)}
```

### SEO のベストプラクティス

- 各ページに一意の `description` メタタグを提供
- タイトルは 50-60 文字、説明は 150-160 文字に保つ
- Open Graph と Twitter Card メタデータを含める
- ビューポートメタタグを常に含める
- 適切な文字セット(UTF-8)を指定する

### パフォーマンスへの影響

`<meta>` タグはページのロードやレンダリングをブロックしませんが、適切に設定することでユーザ体験を向上させることができます:

- ビューポート設定はモバイル体験に不可欠
- テーマカラーはネイティブアプリのような外観を提供
- 適切な文字セット宣言は文字化けを防ぐ
