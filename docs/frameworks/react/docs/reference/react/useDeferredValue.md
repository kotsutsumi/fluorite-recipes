# useDeferredValue

`useDeferredValue` は、UI の一部の更新を遅延させるための React フックです。

## リファレンス

```javascript
const deferredValue = useDeferredValue(value, initialValue?)
```

### パラメータ

- **`value`**: 遅延させたい値。任意の型を指定可能
- **`initialValue`** (オプション): 初回レンダー時に使用する値

### 返り値

- **初回レンダー時**: `initialValue` が指定されていればその値、なければ `value` と同じ値
- **更新時**: React はまず古い値で再レンダーし、その後バックグラウンドで新しい値での再レンダーを試みる

## 使用法

### 読み込み中に古いコンテンツを表示

```javascript
function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

新しい検索結果が読み込まれている間、既存の結果を表示し続けることができます。

### コンテンツが古いことを示す

視覚的なインジケーター(不透明度など)を追加して、コンテンツが最新でないことを示すことができます。

```javascript
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

### UI の一部の再レンダーを遅延

再レンダーが遅いコンポーネントのパフォーマンスを最適化できます。

```javascript
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

これにより、入力フィールドが応答不能になるのを防ぎ、ユーザ入力をリスト更新より優先させます。

## 主な利点

- **ユーザのデバイスパフォーマンスに適応**: 高速なデバイスでは遅延がほぼ即座、低速なデバイスでは入力に比例して遅延
- **中断可能なレンダリング**: React は新しい値でのレンダリングを中断し、最新のキー入力を処理可能
- **データ更新中のスムーズなユーザ体験**: 古いコンテンツを表示しながら新しいコンテンツを準備

## 独自の特性

- デバウンスやスロットリングとは異なる
- React に深く統合されている
- デバイスのパフォーマンスに動的に調整
- 固定された遅延時間がない

## ベストプラクティス

`useDeferredValue` は以下の場合に使用:
- 重い計算を伴うコンポーネントの最適化
- ユーザ入力の応答性を保ちながら、UIの一部を遅延更新
- ローディング状態の代わりに既存コンテンツを表示
