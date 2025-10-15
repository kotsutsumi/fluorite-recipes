# レガシー React API

このページでは、`react` パッケージからエクスポートされているが、新しいコードでの使用が推奨されなくなった React API について説明します。

## 概要

レガシー API は引き続き React から利用可能ですが、新しいコードでは使用しないことを強く推奨します。より良い代替手段については、各 API のリンク先のページを参照してください。

## レガシー API

### `Children`
`children` プロパティとして受け取った JSX を操作および変換します。

[Children のドキュメントを見る →](./Children.md)

### `cloneElement`
別の要素を基に React 要素を作成します。

[cloneElement のドキュメントを見る →](./cloneElement.md)

### `Component`
JavaScript クラスを使用して React コンポーネントを定義します。

[Component のドキュメントを見る →](./Component.md)

### `createElement`
React 要素を作成します（JSX の使用が推奨されます）。

[createElement のドキュメントを見る →](./createElement.md)

### `createRef`
任意の値を保持する ref オブジェクトを作成します。

[createRef のドキュメントを見る →](./createRef.md)

### `forwardRef`
ref を介して親コンポーネントに DOM ノードを公開します。

[forwardRef のドキュメントを見る →](./forwardRef.md)

### `isValidElement`
値が React 要素かどうかを確認します。

[isValidElement のドキュメントを見る →](./isValidElement.md)

### `PureComponent`
`Component` と同様ですが、同じプロパティでの再レンダリングをスキップします。

[PureComponent のドキュメントを見る →](./PureComponent.md)

## React 19 で削除された API

以下の API は React 19 で削除されました：

- `createFactory` - 削除されました
- クラスコンポーネントの静的メソッド（`contextTypes`、`childContextTypes` など）
- `getChildContext`
- `propTypes`
- `this.refs`

## 推奨事項

各レガシー API について、開発者は最新の React パターンや代替手段への移行を推奨されています。関数コンポーネントとフックの使用が、現代の React 開発における標準的なアプローチです。
