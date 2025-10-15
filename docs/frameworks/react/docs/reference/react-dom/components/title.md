# `<title>`

ブラウザ組み込みの `<title>` コンポーネントを利用することで、ドキュメントのタイトルを指定できます。

```jsx
<title>私のブログ</title>
```

## リファレンス

### `<title>`

ドキュメントのタイトルを指定するには、ブラウザ組み込みの `<title>` コンポーネントをレンダーします。コンポーネントの任意の場所から `<title>` をレンダーでき、React は常に対応する DOM 要素をドキュメントの `<head>` に配置します。

```jsx
<title>私のブログ</title>
```

#### Props

`<title>` は、すべての一般的な要素の props をサポートしています。

**`children`**: `<title>` は子要素としてテキストのみを受け入れます。このテキストがドキュメントのタイトルになります。テキストのみをレンダーする限り、独自のコンポーネントを渡すこともできます。

#### 特別なレンダリング動作

React は、React ツリーのどこにレンダーされても、`<title>` コンポーネントに対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<title>` が存在できる唯一の有効な場所ですが、特定のページを表すコンポーネントが自身で `<title>` コンポーネントをレンダーできると便利で、コンポーザビリティが保たれます。

**2つの例外があります:**

1. `<title>` が `<svg>` コンポーネント内にある場合、特別な動作はありません。このコンテキストでは、ドキュメントのタイトルではなく、そのグラフィックのアクセシビリティ注釈を表すためです。

2. `<title>` に `itemProp` prop がある場合、特別な動作はありません。この場合、ドキュメントのタイトルではなく、ページの特定の部分に関するメタデータを表すためです。

#### 注意点

**一度にひとつの `<title>` のみをレンダー:**

一度にひとつの `<title>` だけがレンダーされるようにしてください。複数のコンポーネントが同時に `<title>` タグをレンダーすると、React はそれらのタイトルをすべてドキュメントの head に配置します。これが発生すると、ブラウザと検索エンジンの動作は未定義です。

## 使用法

### ドキュメントタイトルを設定する

コンポーネントから子要素としてテキストを持つ `<title>` コンポーネントをレンダーします。React は `<title>` DOM ノードをドキュメントの `<head>` に配置します。

```jsx
export default function ContactPage() {
  return (
    <>
      <title>私のサイト: お問い合わせ</title>
      <h1>お問い合わせ</h1>
      <p>support@example.com までメールをお送りください</p>
    </>
  );
}
```

### ページごとに異なるタイトルを設定

各ページコンポーネントで独自の `<title>` をレンダーできます:

```jsx
// HomePage.js
export function HomePage() {
  return (
    <>
      <title>ホーム | 私のウェブサイト</title>
      <h1>ようこそ</h1>
    </>
  );
}

// AboutPage.js
export function AboutPage() {
  return (
    <>
      <title>私たちについて | 私のウェブサイト</title>
      <h1>私たちについて</h1>
    </>
  );
}

// ContactPage.js
export function ContactPage() {
  return (
    <>
      <title>お問い合わせ | 私のウェブサイト</title>
      <h1>お問い合わせ</h1>
    </>
  );
}
```

### 動的なタイトルを設定

変数や props を使用して動的にタイトルを設定できます:

```jsx
export default function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} | 私のブログ</title>
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
```

### タイトルにテンプレートリテラルを使用

複雑なタイトルを構築する場合は、テンプレートリテラルを使用します:

```jsx
export default function ProductPage({ product, category }) {
  return (
    <>
      <title>{`${product.name} - ${category} | オンラインストア`}</title>
      <div>
        <h1>{product.name}</h1>
        <p>カテゴリ: {category}</p>
        <p>価格: {product.price}円</p>
      </div>
    </>
  );
}
```

### ページ番号を含むタイトル

ページネーションされたコンテンツの場合:

```jsx
export default function SearchResults({ query, pageNumber, totalPages }) {
  return (
    <>
      <title>
        {`"${query}" の検索結果`}
        {pageNumber > 1 && ` - ページ ${pageNumber}/${totalPages}`}
        {` | 検索エンジン`}
      </title>
      <h1>"{query}" の検索結果</h1>
      <p>ページ {pageNumber} / {totalPages}</p>
    </>
  );
}
```

### 条件付きタイトル

条件に基づいてタイトルを変更:

```jsx
export default function DashboardPage({ user, notifications }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <title>
        {unreadCount > 0 ? `(${unreadCount}) ` : ''}
        ダッシュボード | マイアプリ
      </title>
      <h1>こんにちは、{user.name}さん</h1>
      {unreadCount > 0 && (
        <p>{unreadCount}件の未読通知があります</p>
      )}
    </>
  );
}
```

### SEO に最適化されたタイトル

検索エンジン最適化のためのベストプラクティス:

```jsx
export default function ArticlePage({ article }) {
  // タイトルは50-60文字が理想的
  const title = article.title.length > 60
    ? `${article.title.substring(0, 57)}...`
    : article.title;

  return (
    <>
      <title>{title} | ブログ名</title>
      <meta name="description" content={article.excerpt} />
      <article>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </article>
    </>
  );
}
```

### エラーページのタイトル

エラー状態に応じたタイトル:

```jsx
export default function ErrorPage({ error }) {
  const getErrorTitle = (errorCode) => {
    switch (errorCode) {
      case 404:
        return 'ページが見つかりません | マイサイト';
      case 500:
        return 'サーバーエラー | マイサイト';
      case 403:
        return 'アクセス拒否 | マイサイト';
      default:
        return 'エラーが発生しました | マイサイト';
    }
  };

  return (
    <>
      <title>{getErrorTitle(error.code)}</title>
      <div>
        <h1>エラー {error.code}</h1>
        <p>{error.message}</p>
      </div>
    </>
  );
}
```

### 多言語対応のタイトル

言語に応じたタイトルを設定:

```jsx
export default function MultiLanguagePage({ language }) {
  const titles = {
    ja: 'ようこそ | マイサイト',
    en: 'Welcome | My Site',
    es: 'Bienvenido | Mi Sitio',
    fr: 'Bienvenue | Mon Site'
  };

  return (
    <>
      <title>{titles[language] || titles.en}</title>
      <h1>{language === 'ja' ? 'ようこそ' : 'Welcome'}</h1>
    </>
  );
}
```

### カスタム Title コンポーネント

再利用可能なタイトルコンポーネントを作成:

```jsx
function PageTitle({ children, siteName = 'マイサイト' }) {
  return <title>{children} | {siteName}</title>;
}

export default function AboutPage() {
  return (
    <>
      <PageTitle>私たちについて</PageTitle>
      <h1>私たちについて</h1>
      <p>会社の情報...</p>
    </>
  );
}
```

### リアルタイム更新されるタイトル

状態に応じてタイトルを更新:

```jsx
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <title>
        {!isActive && unreadMessages > 0 && `(${unreadMessages}) `}
        チャット | メッセンジャー
      </title>
      <div>
        <h1>チャット</h1>
        <p>メッセージ一覧</p>
      </div>
    </>
  );
}
```

## トラブルシューティング

### タイトルに変数が表示されない

間違った例:

```jsx
// 🔴 これは動作しません
<title>Results page {pageNumber}</title>
```

正しい例:

```jsx
// ✅ 正しい: テンプレートリテラルを使用
<title>{`Results page ${pageNumber}`}</title>
```

タイトルの子要素は単一の文字列として評価される必要があります。

### 複数のタイトルがレンダーされる

一度に1つのタイトルのみがレンダーされるようにしてください。条件付きレンダリングを使用:

```jsx
// 🔴 避けるべき: 複数のタイトル
function App() {
  return (
    <>
      <title>タイトル 1</title>
      <title>タイトル 2</title>
      <Page />
    </>
  );
}

// ✅ 正しい: 条件付きレンダリング
function App({ pageType }) {
  return (
    <>
      {pageType === 'home' ? (
        <title>ホーム | マイサイト</title>
      ) : (
        <title>ページ | マイサイト</title>
      )}
      <Page />
    </>
  );
}
```

### SVG 内のタイトル

SVG 内の `<title>` は特別な動作をしません。これは SVG のアクセシビリティ注釈として機能します:

```jsx
function Icon() {
  return (
    <svg>
      <title>アイコンの説明</title>
      {/* SVG パス */}
    </svg>
  );
}
```

## 重要な注意事項

### SEO のベストプラクティス

- **長さ**: 50-60文字が理想的
- **一意性**: 各ページに一意のタイトルを提供
- **キーワード**: 重要なキーワードを前方に配置
- **ブランド**: サイト名を末尾に含める
- **記号**: パイプ(|)またはハイフン(-)で区切る

### アクセシビリティ

- タイトルはページの内容を正確に説明する必要があります
- スクリーンリーダーのユーザは、タイトルに依存してページを識別します
- 動的なタイトルは、ページの状態変化を反映すべきです

### パフォーマンス

- タイトルの変更は軽量な操作です
- 頻繁なタイトル更新(例: 毎秒)は避けてください
- React は自動的にタイトルの更新を最適化します

### ブラウザタブでの表示

- 短いタイトルはタブで完全に表示されます
- 長いタイトルは切り捨てられます
- 重要な情報は最初に配置してください
