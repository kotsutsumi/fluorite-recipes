# サポートされているブラウザ

Next.jsは、**設定なし**でモダンブラウザをサポートします。

- Chrome 64+
- Edge 79+
- Firefox 67+
- Opera 51+
- Safari 12+

## Browserslist

特定のブラウザやフィーチャーをターゲットにしたい場合、Next.jsは`package.json`ファイルで[Browserslist](https://browsersl.ist)設定をサポートしています。Next.jsはデフォルトで次のBrowserslist設定を使用します:

```json filename="package.json"
{
  "browserslist": [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
  ]
}
```

## ポリフィル

[広く使用されているポリフィル](https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js)を含む、以下を含みます:

- [**fetch()**](https://developer.mozilla.org/docs/Web/API/Fetch_API) — `whatwg-fetch`と`unfetch`を置き換えます。
- [**URL**](https://developer.mozilla.org/docs/Web/API/URL) — [`url`パッケージ（Node.js API）](https://nodejs.org/api/url.html)を置き換えます。
- [**Object.assign()**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — `object-assign`、`object.assign`、および`core-js/object/assign`を置き換えます。

依存関係のいずれかにこれらのポリフィルが含まれている場合、本番ビルドでの重複を避けるために自動的に削除されます。

さらに、バンドルサイズを削減するために、Next.jsはそれらを必要とするブラウザに対してのみこれらのポリフィルをロードします。世界中のWebトラフィックの大部分は、これらのポリフィルをダウンロードしません。

### カスタムポリフィル

自分のコードまたは外部npm依存関係が、ターゲットブラウザでサポートされていない機能（IE 11など）を必要とする場合は、自分でポリフィルを追加する必要があります。

この場合、[カスタム`<App>`](/docs/pages/building-your-application/routing/custom-app)または個々のコンポーネントで必要な**特定のポリフィル**の最上位のインポートを追加する必要があります。

## JavaScript言語機能

Next.jsは、最新のJavaScript機能を箱から出してすぐに使用できます。[ES6機能](https://github.com/lukehoban/es6features)に加えて、Next.jsは以下もサポートしています:

- [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017)
- [オブジェクトのRest/Spreadプロパティ](https://github.com/tc39/proposal-object-rest-spread) (ES2018)
- [動的`import()`](https://github.com/tc39/proposal-dynamic-import) (ES2020)
- [オプショナルチェーン](https://github.com/tc39/proposal-optional-chaining) (ES2020)
- [Null合体演算子](https://github.com/tc39/proposal-nullish-coalescing) (ES2020)
- [クラスフィールド](https://github.com/tc39/proposal-class-fields)および[静的プロパティ](https://github.com/tc39/proposal-static-class-features) (ステージ3の提案の一部)
- などなど！

### サーバーサイドポリフィル

クライアント側の`fetch()`に加えて、Next.jsはNode.js環境で`fetch()`をポリフィルします。`isomorphic-unfetch`や`node-fetch`などのポリフィルを使用せずに、サーバーコード（`getStaticProps` / `getServerSideProps`など）で`fetch()`を使用できます。

### TypeScript機能

Next.jsには組み込みのTypeScriptサポートがあります。[詳細はこちら](/docs/app/building-your-application/configuring/typescript)。

### Babelの設定のカスタマイズ（高度）

Babelの設定をカスタマイズできます。[詳細はこちら](/docs/pages/building-your-application/configuring/babel)。
