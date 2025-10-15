# React DOM コンポーネント

React は、ブラウザ組み込みのすべての HTML と SVG コンポーネントをサポートしています。

## 一般的なコンポーネント

すべてのブラウザ組み込みコンポーネントは、いくつかの共通の props とイベントをサポートしています。

これには以下のような React 固有の props が含まれます:
- `ref`: DOM ノードへの参照
- `dangerouslySetInnerHTML`: 生の HTML を設定
- `className`: CSS クラス名
- `style`: インラインスタイル

詳細については、[共通コンポーネント](/reference/react-dom/components/common)を参照してください。

## フォームコンポーネント

これらのブラウザ組み込みのフォームコンポーネントは、React でサポートされています:

- [`<input>`](/reference/react-dom/components/input)
- [`<select>`](/reference/react-dom/components/select)
- [`<textarea>`](/reference/react-dom/components/textarea)

props として `value` を渡すと、「制御されたコンポーネント」になります。

### フォーム送信

[`<form>`](/reference/react-dom/components/form) コンポーネントを使用して、インタラクティブなフォームを作成できます。

その他のフォーム関連コンポーネント:
- [`<option>`](/reference/react-dom/components/option)
- [`<progress>`](/reference/react-dom/components/progress)

## リソース・メタデータ関連コンポーネント

以下のコンポーネントを使用して、ドキュメントにリソースやメタデータを追加できます:

- [`<link>`](/reference/react-dom/components/link): スタイルシートやアイコンなどの外部リソースにリンク
- [`<meta>`](/reference/react-dom/components/meta): ドキュメントにメタデータを追加
- [`<script>`](/reference/react-dom/components/script): ドキュメントにスクリプトを追加
- [`<style>`](/reference/react-dom/components/style): インライン CSS スタイルシートを追加
- [`<title>`](/reference/react-dom/components/title): ドキュメントのタイトルを設定

React はこれらのコンポーネントを特別な方法で処理し、常にドキュメントの `<head>` に配置します。

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
