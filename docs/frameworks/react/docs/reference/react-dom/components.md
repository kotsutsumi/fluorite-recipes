# React DOM コンポーネント

React は、ブラウザ組み込みのすべての HTML と SVG コンポーネントをサポートしています。

---

## 📋 コンポーネントカテゴリ

| カテゴリ | 概要 | 主なコンポーネント |
|---------|------|-------------------|
| 共通 | すべての HTML 要素で利用可能な props | `ref`, `className`, `style`, etc. |
| フォーム | ユーザー入力を受け付けるコンポーネント | `<input>`, `<select>`, `<textarea>`, `<form>` |
| リソース・メタデータ | ドキュメントの設定とリソース | `<link>`, `<meta>`, `<script>`, `<style>`, `<title>` |
| HTML 標準 | すべての標準 HTML 要素 | `<div>`, `<span>`, `<button>`, etc. |
| SVG | すべての SVG 要素 | `<svg>`, `<circle>`, `<path>`, etc. |

---

## 一般的なコンポーネント

**概要**: すべてのブラウザ組み込みコンポーネントは、共通の props とイベントをサポートしています。

### React 固有の重要な Props

| Prop | 説明 | 使用例 |
|------|------|--------|
| `ref` | DOM ノードへの参照を取得 | `<div ref={myRef} />` |
| `dangerouslySetInnerHTML` | 生の HTML を設定（XSS 注意） | `<div dangerouslySetInnerHTML={{__html: html}} />` |
| `className` | CSS クラス名を設定 | `<div className="container" />` |
| `style` | インラインスタイルを設定 | `<div style={{color: 'red'}} />` |
| `children` | 子要素を指定 | `<div>{children}</div>` |
| `key` | リスト内の要素を識別 | `<li key={id}>{item}</li>` |

**使用例**:

```javascript
function MyComponent() {
  const divRef = useRef(null);

  return (
    <div
      ref={divRef}
      className="my-component"
      style={{ padding: '20px' }}
      onClick={() => console.log('clicked')}
    >
      <h1>Hello, React!</h1>
    </div>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/common)

---

## フォームコンポーネント

**概要**: ユーザー入力を受け付けるためのインタラクティブなフォームコンポーネント。

### 主なフォーム要素

#### 入力コンポーネント

| コンポーネント | 用途 | 制御/非制御 | 詳細リンク |
|--------------|------|-----------|-----------|
| `<input>` | テキスト、チェックボックス、ラジオなど | 両方サポート | [詳細](/reference/react-dom/components/input) |
| `<textarea>` | 複数行テキスト入力 | 両方サポート | [詳細](/reference/react-dom/components/textarea) |
| `<select>` | ドロップダウン選択 | 両方サポート | [詳細](/reference/react-dom/components/select) |

**制御されたコンポーネント**: `value` prop を渡すと、React が値を管理します。

```javascript
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**非制御コンポーネント**: `defaultValue` を使用し、DOM が値を管理します。

```javascript
function UncontrolledInput() {
  const inputRef = useRef(null);

  return (
    <input
      defaultValue="initial"
      ref={inputRef}
    />
  );
}
```

#### フォーム送信

**`<form>` コンポーネント**: インタラクティブなフォームを作成します。

```javascript
function MyForm() {
  const handleSubmit = async (formData) => {
    const email = formData.get('email');
    await submitToServer(email);
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/form)

#### その他のフォーム関連コンポーネント

| コンポーネント | 用途 | 詳細リンク |
|--------------|------|-----------|
| `<option>` | `<select>` の選択肢 | [詳細](/reference/react-dom/components/option) |
| `<progress>` | 進捗状況の表示 | [詳細](/reference/react-dom/components/progress) |

---

## リソース・メタデータ関連コンポーネント

**概要**: ドキュメントの `<head>` に配置されるリソースとメタデータを管理します。

### ドキュメント メタデータ

| コンポーネント | 用途 | 自動配置 | 詳細リンク |
|--------------|------|---------|-----------|
| `<title>` | ページタイトルの設定 | ✅ `<head>` | [詳細](/reference/react-dom/components/title) |
| `<meta>` | メタデータの追加 | ✅ `<head>` | [詳細](/reference/react-dom/components/meta) |
| `<link>` | 外部リソースのリンク | ✅ `<head>` | [詳細](/reference/react-dom/components/link) |
| `<script>` | スクリプトの追加 | ✅ `<head>` | [詳細](/reference/react-dom/components/script) |
| `<style>` | インライン CSS | ✅ `<head>` | [詳細](/reference/react-dom/components/style) |

**重要**: React はこれらのコンポーネントを特別な方法で処理し、コンポーネント内のどこに配置しても、自動的にドキュメントの `<head>` に移動します。

**使用例**:

```javascript
function BlogPost({ post }) {
  return (
    <article>
      {/* これらは自動的に <head> に配置される */}
      <title>{post.title} - My Blog</title>
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={post.url} />

      {/* 実際のコンテンツ */}
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### リソース管理の詳細

#### `<link>` - スタイルシートとアイコン

```javascript
function App() {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" href="/font.woff2" as="font" />
    </>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/link)

#### `<meta>` - SEO とソーシャルメディア

```javascript
function Page() {
  return (
    <>
      <meta name="description" content="ページの説明" />
      <meta property="og:title" content="OG タイトル" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/meta)

#### `<script>` - 外部スクリプトの読み込み

```javascript
function App() {
  return (
    <>
      <script src="/analytics.js" async />
      <script src="https://cdn.example.com/lib.js" />
    </>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/script)

#### `<style>` - インライン CSS

```javascript
function Component() {
  return (
    <>
      <style>{`
        .my-class {
          color: red;
          font-size: 16px;
        }
      `}</style>
      <div className="my-class">Styled content</div>
    </>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/style)

#### `<title>` - ページタイトル

```javascript
function Page() {
  return (
    <>
      <title>My Page Title</title>
      <h1>Welcome to my page</h1>
    </>
  );
}
```

[詳細ドキュメント →](/reference/react-dom/components/title)

---

## すべての HTML コンポーネント

React は、すべての標準的なブラウザ組み込み HTML コンポーネントをサポートしています。これには以下が含まれます:

### コンテンツセクション
`<article>`, `<aside>`, `<footer>`, `<header>`, `<main>`, `<nav>`, `<section>`

### テキストコンテンツ
`<blockquote>`, `<dd>`, `<div>`, `<dl>`, `<dt>`, `<figcaption>`, `<figure>`, `<hr>`, `<li>`, `<ol>`, `<p>`, `<pre>`, `<ul>`

### インラインテキスト
`<a>`, `<abbr>`, `<b>`, `<bdi>`, `<bdo>`, `<br>`, `<cite>`, `<code>`, `<data>`, `<dfn>`, `<em>`, `<i>`, `<kbd>`, `<mark>`, `<q>`, `<rp>`, `<rt>`, `<ruby>`, `<s>`, `<samp>`, `<small>`, `<span>`, `<strong>`, `<sub>`, `<sup>`, `<time>`, `<u>`, `<var>`, `<wbr>`

### 画像とメディア
`<area>`, `<audio>`, `<img>`, `<map>`, `<track>`, `<video>`

### 埋め込みコンテンツ
`<embed>`, `<iframe>`, `<object>`, `<picture>`, `<portal>`, `<source>`

### テーブル
`<caption>`, `<col>`, `<colgroup>`, `<table>`, `<tbody>`, `<td>`, `<tfoot>`, `<th>`, `<thead>`, `<tr>`

### その他
`<datalist>`, `<dialog>`, `<fieldset>`, `<legend>`, `<meter>`, `<output>`, `<summary>`, `<details>`

## カスタム HTML 要素

ダッシュを含むタグ(`<my-element>`など)をレンダーすると、React はそれをカスタム HTML 要素として扱います。

### カスタム要素の動作

- すべての props は文字列としてシリアライズされる
- `className` の代わりに `class`、`htmlFor` の代わりに `for` を使用

```jsx
<my-element class="example" for="input-id" custom-prop="value" />
```

## SVG コンポーネント

React は、すべての組み込み SVG コンポーネントをサポートしています:

`<svg>`, `<animate>`, `<circle>`, `<clipPath>`, `<defs>`, `<desc>`, `<ellipse>`, `<feBlend>`, `<feColorMatrix>`, `<feComponentTransfer>`, `<feComposite>`, `<feConvolveMatrix>`, `<feDiffuseLighting>`, `<feDisplacementMap>`, `<feDistantLight>`, `<feDropShadow>`, `<feFlood>`, `<feFuncA>`, `<feFuncB>`, `<feFuncG>`, `<feFuncR>`, `<feGaussianBlur>`, `<feImage>`, `<feMerge>`, `<feMergeNode>`, `<feMorphology>`, `<feOffset>`, `<fePointLight>`, `<feSpecularLighting>`, `<feSpotLight>`, `<feTile>`, `<feTurbulence>`, `<filter>`, `<foreignObject>`, `<g>`, `<image>`, `<line>`, `<linearGradient>`, `<marker>`, `<mask>`, `<metadata>`, `<path>`, `<pattern>`, `<polygon>`, `<polyline>`, `<radialGradient>`, `<rect>`, `<stop>`, `<switch>`, `<symbol>`, `<text>`, `<textPath>`, `<tspan>`, `<use>`, `<view>`

### SVG の注意点

- Props は camelCase 規則を使用(`viewBox`, `xmlns`)
- 名前空間付き属性はコロンなしで記述(`xlinkHref` → `xlink:href`)

## HTML/SVG から JSX への変換

既存の HTML や SVG を JSX に変換する場合、[オンラインコンバータ](https://transform.tools/html-to-jsx)を使用できます。

### 主な変更点

- props は camelCase に変換(`class` → `className`, `tabindex` → `tabIndex`)
- 自己終了タグには `/` が必要(`<br>` → `<br />`)
- JSX 予約語を避ける(`for` → `htmlFor`)
