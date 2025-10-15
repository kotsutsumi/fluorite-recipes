# captureOwnerStack

`captureOwnerStack` は、開発環境で現在のオーナスタック (Owner Stack) を読み取り、利用可能な場合は文字列として返します。

## リファレンス

```javascript
const ownerStack = React.captureOwnerStack();
```

### パラメータ

`captureOwnerStack` は引数を取りません。

### 返り値

- **開発環境**: オーナスタックを表す文字列、または利用不可の場合は `null`
- **本番環境**: 常に `null`

## 使用法

### カスタムエラーオーバーレイの強化

エラーがどこで発生したかについての追加のコンテキストをキャプチャします。

```javascript
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }

  return <div>My Component</div>;
}
```

### エラーハンドリングでの使用

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      const ownerStack = React.captureOwnerStack();

      // カスタムエラーレポートに追加情報を含める
      this.logError({
        error,
        errorInfo,
        ownerStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## 使用コンテキスト

`captureOwnerStack` は以下のコンテキストでのみ動作します:

- コンポーネントのレンダリング中
- Effect 内(`useEffect` など)
- React イベントハンドラ内
- React エラーハンドラ内

## 重要な注意事項

### 開発環境でのみ使用可能

本番環境では常に `null` を返します。

```javascript
// ✅ 正しい: 開発環境でのみ使用
if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
}

// ❌ 間違い: 本番環境で呼び出すと null が返る
const ownerStack = React.captureOwnerStack();
```

### 名前空間インポートの使用

クロス環境の互換性のため、名前空間インポートを使用することを推奨します。

```javascript
// ✅ 推奨
import * as React from 'react';
const stack = React.captureOwnerStack();

// ❌ 避ける(ビルド時の問題が発生する可能性)
import { captureOwnerStack } from 'react';
const stack = captureOwnerStack();
```

### React 管理外のコンテキストでは null

非 React イベントハンドラでは `null` を返します。

```javascript
// ❌ React 管理外のイベント - null が返る
window.addEventListener('click', () => {
  const stack = React.captureOwnerStack(); // null
});

// ✅ React イベントハンドラ - スタック情報が返る
<button onClick={() => {
  const stack = React.captureOwnerStack(); // スタック情報
}}>
  Click
</button>
```

## トラブルシューティング

### 常に null が返される

以下を確認してください:

1. 開発環境で実行しているか
2. React 管理下のコンテキストで呼び出しているか
3. React のバージョンがこの機能をサポートしているか

## ベストプラクティス

- デバッグツールやエラーレポートの強化に使用
- 開発環境でのみ呼び出す
- 本番ビルドから除外されるようにコードを構成
- 名前空間インポートを使用してビルドの問題を回避

## 使用例: カスタムデバッグツール

```javascript
function DebugTools() {
  const [stack, setStack] = React.useState(null);

  const captureStack = () => {
    if (process.env.NODE_ENV !== 'production') {
      const ownerStack = React.captureOwnerStack();
      setStack(ownerStack);
    }
  };

  return (
    <div>
      <button onClick={captureStack}>Capture Stack</button>
      {stack && <pre>{stack}</pre>}
    </div>
  );
}
```
