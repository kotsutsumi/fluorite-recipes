# 組み込みの React フック

フックを用いると、コンポーネントから様々な React の機能を使えるようになります。組み込みのフックを使うこともできますし、組み合わせて自分だけのものを作ることもできます。

## State フック

State を使うことで、コンポーネントはユーザ入力などの情報を「記憶」できます。

- **`useState`**: 直接更新できる state 変数を定義
- **`useReducer`**: リデューサ関数内に更新ロジックを持つ state 変数を定義

```javascript
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
}
```

## Context フック

Context を使うことで、コンポーネントは props を渡さずに遠くの親から情報を受け取れます。

- **`useContext`**: context 値を読み取り、変更を受信

```javascript
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

## Ref フック

Ref を使うことで、DOM ノードやタイムアウト ID など、レンダーに使用されない情報を保持できます。

- **`useRef`**: 任意の値を格納できる ref を宣言(最も一般的)
- **`useImperativeHandle`**: 公開する ref をカスタマイズ(滅多に使用しない)

## Effect フック

Effect を使うことで、コンポーネントを外部システムに接続し、同期できます。

- **`useEffect`**: コンポーネントを外部システムに接続
- **`useLayoutEffect`**: ブラウザが再描画する前に発火
- **`useInsertionEffect`**: React が DOM を変更する前に発火

## パフォーマンスフック

再レンダー時の不要な処理を減らすことで、パフォーマンスを最適化できます。

- **`useMemo`**: 重い計算結果をキャッシュ
- **`useCallback`**: 関数定義をキャッシュ
- **`useTransition`**: state の遷移を非ブロッキングとしてマーク
- **`useDeferredValue`**: UI の重要でない部分の更新を遅延

## リソースフック

- **`use`**: Promise や context などのリソースから値を読み取る

## その他のフック

主にライブラリ開発者向けのフックです。

- **`useDebugValue`**: カスタムフックに React DevTools のラベルを追加
- **`useId`**: コンポーネントに一意の ID を関連付け
- **`useSyncExternalStore`**: 外部ストアを購読

## 独自のフック

JavaScript 関数として独自のカスタムフックを定義することもできます。
