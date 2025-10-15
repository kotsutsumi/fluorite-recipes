# `<link>`

ブラウザ組み込みの `<link>` コンポーネントを利用することで、スタイルシートなどの外部リソースにリンクしたり、リンクメタデータでドキュメントに注釈を付けたりすることができます。

```jsx
<link rel="icon" href="favicon.ico" />
```

## リファレンス

### `<link>`

スタイルシート、フォント、アイコンなどの外部リソースにリンクするには、ブラウザ組み込みの `<link>` コンポーネントをレンダーします。コンポーネントの任意の場所から `<link>` をレンダーでき、React は常に対応する DOM 要素をドキュメントの `<head>` に配置します。

```jsx
<link rel="icon" href="favicon.ico" />
<link rel="stylesheet" href="styles.css" />
```

#### Props

`<link>` は、すべての一般的な要素の props をサポートしています。

**すべての `<link>` で必須:**

- **`rel`**: 文字列、必須。リソースとの関係を指定します。React は、`rel="stylesheet"` を持つリンクを他のリンクとは異なる方法で扱います。

**`rel="stylesheet"` のリンクの Props:**

- **`precedence`**: 文字列。ドキュメント `<head>` 内で `<link>` DOM ノードを他のノードに対してどこにランク付けするかを React に伝え、どのスタイルシートが他のスタイルシートを上書きできるかを決定します。値は `"reset"`、`"low"`、`"medium"`、`"high"` のいずれかです。同じ precedence を持つスタイルシートは、`<link>` または `<style>` タグであるか、`preload` または `preinit` 関数でロードされたかにかかわらず、一緒にグループ化されます。
- **`media`**: 文字列。スタイルシートを特定のメディアクエリに制限します。
- **`title`**: 文字列。代替スタイルシートの名前を指定します。

**`rel="stylesheet"` のリンクで推奨されない Props:**

これらの props は React によって設定されるため、渡すべきではありません:

- `blocking`: 文字列。`"render"` に設定すると、スタイルシートがロードされるまでページをレンダーしないようブラウザに指示します。React は Suspense を使用してより細かい制御を提供します。
- `onLoad`: 関数。React は Suspense を使用してより細かい制御を提供します。
- `onError`: 関数。React は Suspense を使用してより細かい制御を提供します。

**リソースプリロード/プリコネクト用の Props:**

- **`rel="preload"`**: 近い将来にリソースが必要になることをブラウザに通知し、早期にロードを開始できるようにします。
- **`rel="dns-prefetch"`**: ドメインの DNS ルックアップを事前に実行します。
- **`rel="preconnect"`**: リソースがどこから来るかわからないが、接続を確立したい場合に使用します。

これらのタイプのリンクの Props:

- **`as`**: 文字列。リソースのタイプを指定します。可能な値は `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video`、`worker` です。
- **`crossOrigin`**: 文字列。使用する CORS ポリシーです。可能な値は `anonymous` と `use-credentials` です。`as` が `"fetch"` に設定されている場合は必須です。
- **`referrerPolicy`**: 文字列。フェッチ時に送信する Referrer ヘッダーです。
- **`fetchPriority`**: 文字列。リソースのフェッチの相対的な優先順位を示唆します。
- **`href`**: 文字列。リンクするリソースの URL です。
- **`integrity`**: 文字列。リソースの暗号化ハッシュで、その信頼性を検証します。
- **`type`**: 文字列。リソースの MIME タイプです。

**React で使用が推奨されない Props:**

- **`as`**: `rel="preload"` または `rel="modulepreload"` の場合、`as` は推奨されません。代わりに `preinit` または `preload` を使用してください。

**他のリンクのための Props:**

- **`href`**: 文字列。リンクするリソースの URL です。
- **`crossOrigin`**: 文字列。使用する CORS ポリシーです。
- **`referrerPolicy`**: 文字列。フェッチ時に送信する Referrer ヘッダーです。
- **`fetchPriority`**: 文字列。リソースのフェッチの相対的な優先順位を示唆します。
- **`hrefLang`**: 文字列。リンクされたリソースの言語です。
- **`integrity`**: 文字列。リソースの暗号化ハッシュで、その信頼性を検証します。
- **`type`**: 文字列。リソースの MIME タイプです。

#### 特別なレンダリング動作

React は、React ツリーのどこにレンダーされても、`<link>` コンポーネントに対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<link>` が存在できる唯一の有効な場所ですが、特定のページを表すコンポーネントが自身で `<link>` コンポーネントをレンダーできると便利で、コンポーザビリティが保たれます。

**いくつかの例外があります:**

- `<link>` に `rel="stylesheet"` prop がある場合、この特別な動作を得るには `precedence` prop も必要です。これは、ドキュメント内のスタイルシートの順序が重要であり、React がこれらのスタイルシートを他のスタイルシートに対してどのように順序付けるかを知る必要があるためです。`precedence` prop が省略されている場合、特別な動作はありません。

- `<link>` に `itemProp` prop がある場合、特別な動作はありません。この場合、ドキュメント全体に適用されるのではなく、ページの特定の部分に関するメタデータを表すためです。

- `<link>` に `onLoad` または `onError` prop がある場合、React 内でリソースのロードを手動で管理しているためです。

#### 注意点

**スタイルシート:**

- 同じスタイルシート(同じ `href` を持つ)への複数のリンクは、重複排除されます。
- React は、スタイルシートのロード中にコンポーネントをサスペンドさせることができます。
- コンポーネントがマウント解除された後も、React はスタイルシートを DOM とブラウザキャッシュに残すことがあります。

**その他のリソース:**

- React は、同じ `href` と `rel` を持つリンクを重複排除します。
- `<link>` がレンダーされた後に props が変更されても、React は DOM を更新しません。

## 使用法

### 関連リソースへのリンク

アイコン、正規 URL、ピンバックなどの関連リソースへのリンクを使用してドキュメントに注釈を付けることができます。React は、React ツリーのどこに配置されていても、このメタデータをドキュメントの `<head>` 内に配置します。

```jsx
export default function BlogPage() {
  return (
    <>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </>
  );
}
```

### スタイルシートへのリンク

コンポーネントが正しく表示されるために特定のスタイルシートに依存している場合、そのコンポーネント内でそのスタイルシートへのリンクをレンダーできます。React は、スタイルシートのロード中にコンポーネントをサスペンドします。`precedence` prop を提供する必要があります。これは、このスタイルシートを他のスタイルシートに対してどこに配置するかを React に伝えます。優先順位の高いスタイルシートは、優先順位の低いスタイルシートを上書きできます。

```jsx
export default function SiteMapPage() {
  return (
    <>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <h1>サイトマップ</h1>
      <p>...</p>
    </>
  );
}
```

**スタイルシート precedence の例:**

```jsx
export default function App() {
  return (
    <>
      {/* リセットスタイル - 最も低い優先順位 */}
      <link rel="stylesheet" href="reset.css" precedence="reset" />

      {/* 基本スタイル */}
      <link rel="stylesheet" href="base.css" precedence="low" />

      {/* コンポーネントスタイル */}
      <link rel="stylesheet" href="components.css" precedence="medium" />

      {/* ユーティリティスタイル - 最も高い優先順位 */}
      <link rel="stylesheet" href="utilities.css" precedence="high" />

      <h1>アプリケーション</h1>
    </>
  );
}
```

### スタイルシートの重複排除

同じスタイルシートを複数のコンポーネントからレンダーする場合、React はドキュメントの `<head>` に単一の `<link>` のみを配置します。

```jsx
function ComponentA() {
  return (
    <>
      <link rel="stylesheet" href="shared.css" precedence="medium" />
      <article>コンテンツ A</article>
    </>
  );
}

function ComponentB() {
  return (
    <>
      <link rel="stylesheet" href="shared.css" precedence="medium" />
      <article>コンテンツ B</article>
    </>
  );
}

// 両方のコンポーネントがレンダーされても、shared.css は一度だけロードされます
export default function App() {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}
```

### Suspense 統合

スタイルシートがロード中の間、コンポーネントはサスペンドできます:

```jsx
import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <link rel="stylesheet" href="styles.css" precedence="medium" />
      <Article />
    </Suspense>
  );
}

function LoadingSpinner() {
  return <div>スタイルシートを読み込み中...</div>;
}

function Article() {
  // styles.css がロードされた後にのみレンダーされます
  return <article>記事コンテンツ</article>;
}
```

### リソースプリロード

特定のリソースが後で必要になることがわかっている場合、ブラウザに早期にロードを開始するよう通知できます:

```jsx
export default function App() {
  return (
    <>
      {/* フォントをプリロード */}
      <link
        rel="preload"
        href="/fonts/my-font.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* 画像をプリロード */}
      <link
        rel="preload"
        href="/images/hero.jpg"
        as="image"
      />

      <h1>Welcome</h1>
    </>
  );
}
```

### DNS プリフェッチとプリコネクト

外部ドメインへの接続を最適化するには、DNS プリフェッチまたはプリコネクトを使用します:

```jsx
export default function App() {
  return (
    <>
      {/* DNS ルックアップのみを事前実行 */}
      <link rel="dns-prefetch" href="https://api.example.com" />

      {/* DNS + TCP + TLS を事前実行 */}
      <link rel="preconnect" href="https://api.example.com" />

      <HomePage />
    </>
  );
}
```

## 重要な注意事項

### スタイルシートの優先順位

`precedence` prop は、スタイルシートの適用順序を制御します。一般的なパターン:

- `"reset"`: リセット/ノーマライズスタイル
- `"low"`: 基本的なテーマスタイル
- `"medium"`: コンポーネントスタイル(デフォルト)
- `"high"`: ユーティリティクラスや上書き

### パフォーマンスのベストプラクティス

- クリティカルな CSS には `precedence` 付きの `<link>` を使用
- 非クリティカルなリソースには `rel="preload"` を使用
- 外部ドメインには `rel="dns-prefetch"` または `rel="preconnect"` を使用
- 同じスタイルシートには常に同じ `href` を使用して重複排除を活用
