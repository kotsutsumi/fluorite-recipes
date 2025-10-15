# `<Profiler>`

React ツリーのレンダリングパフォーマンスをプログラムで測定するためのコンポーネントです。

## リファレンス

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

### Props

- **`id`**: UI の測定対象部分を識別する文字列
- **`onRender`**: コンポーネント更新時に呼び出されるコールバック関数

## `onRender` コールバック

React は、プロファイルされたツリー内のコンポーネントが更新されるたびに、`onRender` コールバックを呼び出します。

### コールバックの引数

```javascript
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  // パフォーマンスデータを処理
}
```

- **`id`**: プロファイラの識別子
- **`phase`**: `"mount"` または `"update"` - マウントか更新かを示す
- **`actualDuration`**: 現在の更新のレンダリングに費やした時間(ミリ秒)
- **`baseDuration`**: 最適化なしでサブツリー全体を再レンダーするのにかかると推定される時間(ミリ秒)
- **`startTime`**: React が現在の更新のレンダリングを開始した時刻のタイムスタンプ
- **`commitTime`**: React が現在の更新をコミットした時刻のタイムスタンプ

## 使用法

### レンダリングパフォーマンスの測定

```jsx
import { Profiler } from 'react';

function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <Navigation />
      <Main />
      <Sidebar />
    </Profiler>
  );
}

function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log(`${id} の ${phase} フェーズにかかった時間: ${actualDuration}ms`);
}
```

### 複数の Profiler をネスト

アプリケーションの異なる部分を個別に測定できます。

```jsx
<Profiler id="App" onRender={onRender}>
  <Profiler id="Navigation" onRender={onRender}>
    <Navigation />
  </Profiler>
  <Profiler id="Main" onRender={onRender}>
    <Main />
  </Profiler>
</Profiler>
```

## 重要な注意事項

### パフォーマンスオーバーヘッド

`<Profiler>` はパフォーマンス測定のためにわずかなオーバーヘッドを追加します。本番ビルドではデフォルトで無効になっています。

### 本番環境での有効化

本番環境でプロファイリングを有効にする必要がある場合は、特別な本番ビルドを使用する必要があります。

## ベストプラクティス

- 開発中のパフォーマンス調査に使用
- 必要な部分にのみ Profiler を配置
- パフォーマンスデータを分析ツールに送信して集計
- 本番環境では通常無効のままにする
