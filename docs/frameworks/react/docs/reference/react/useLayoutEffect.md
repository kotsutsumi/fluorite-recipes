# useLayoutEffect

`useLayoutEffect` は、ブラウザが画面を再描画する前に発火する `useEffect` のバージョンです。

## リファレンス

```javascript
useLayoutEffect(setup, dependencies?)
```

### パラメータ

- **`setup`**: Effect のロジックを含む関数。オプションでクリーンアップ関数を返すことができる
- **`dependencies`** (オプション): `setup` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

`useLayoutEffect` は `undefined` を返します。

## 使用法

### ブラウザが再描画する前にレイアウトを測定

ほとんどのコンポーネントは、レンダー内容を決定するためにスクリーン上の位置やサイズを知る必要はありません。しかし、要素のサイズや位置に基づいて配置を調整する必要がある場合があります(例: ツールチップ)。

```javascript
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  // 測定した高さを使用して位置を計算
  let tooltipX = 0;
  let tooltipY = 0;
  if (tooltipHeight !== null) {
    // 位置計算ロジック
  }

  return (
    <div ref={ref} style={{ position: 'absolute', left: tooltipX, top: tooltipY }}>
      ツールチップの内容
    </div>
  );
}
```

### 動作の流れ

1. ツールチップを初期の `tooltipHeight = 0` でレンダー(位置が誤っている可能性)
2. React がそれを DOM に配置し、`useLayoutEffect` のコードを実行
3. `useLayoutEffect` がツールチップの高さを測定
4. React が測定結果で即座に再レンダー
5. ツールチップを実際の `tooltipHeight` でレンダー(位置が正しい)
6. React がそれを DOM で更新し、ブラウザが最終的にツールチップを表示

## 重要な考慮事項

### パフォーマンスへの影響

`useLayoutEffect` はブラウザの描画をブロックします。過度に使用するとアプリケーションが遅くなる可能性があります。可能な限り `useEffect` を使用してください。

### サーバーサイドレンダリング

`useLayoutEffect` はサーバで実行されません。サーバレンダリング時の問題を解決する戦略:

1. **`useEffect` に置き換える**: 初回描画前に実行する必要がない場合
2. **コンポーネントをクライアント専用にする**: サーバレンダリングから除外
3. **ハイドレーション後にフォールバックコンテンツをレンダー**: サーバでプレースホルダーを表示
4. **`useSyncExternalStore` を使用**: サーバとクライアントで異なる値を表示する必要がある場合

## トラブルシューティング

### サーバレンダリング時のエラー

React 18.2以前:
```
useLayoutEffect does nothing on the server
```

戦略に応じて上記の4つの解決方法のいずれかを使用してください。

## ベストプラクティス

- 可能な限り `useEffect` を優先
- レイアウト測定が必要な場合のみ使用
- パフォーマンスへの影響を考慮
- サーバーサイドレンダリングの互換性を確認
