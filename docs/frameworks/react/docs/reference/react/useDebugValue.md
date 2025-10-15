# useDebugValue

`useDebugValue` は、React DevTools でカスタムフックにラベルを追加するための React フックです。

## リファレンス

```javascript
useDebugValue(value, format?)
```

### パラメータ

- **`value`**: React DevTools に表示したい値。任意の型を指定可能
- **`format`** (オプション): フォーマット関数。コンポーネントが検査されたときに、React は `value` を引数として format 関数を呼び出し、返されたフォーマット済みの値を表示

### 返り値

`useDebugValue` は何も返しません。

## 使用法

### カスタムフックにラベルを追加

```javascript
function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

このカスタムフックを使用するコンポーネントを検査すると、React DevTools に `OnlineStatus: "Online"` のように表示されます。

### デバッグ値のフォーマットを遅延

デバッグ値のフォーマットが高コストの場合、2番目の引数としてフォーマット関数を渡せます。

```javascript
useDebugValue(date, date => date.toDateString());
```

これにより、コンポーネントが実際に検査されるまでフォーマット処理が遅延され、不要な計算を避けられます。

## 重要な注意事項

- すべてのカスタムフックにデバッグ値が必要なわけではない
- 共有ライブラリの一部で、複雑な内部データ構造を持つカスタムフックに最も有用
- 開発者がカスタムフックの動作を理解し、検査するのに役立つ
- 本番コードには影響しない開発ツール

## ベストプラクティス

主に以下の場合に使用:
- 複雑な内部状態を持つカスタムフック
- 共有ライブラリとして提供されるフック
- デバッグ時に内部状態の可視化が有用なフック
