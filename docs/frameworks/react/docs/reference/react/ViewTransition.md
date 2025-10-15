# `<ViewTransition>` (実験的)

`<ViewTransition>` は、トランジション内で更新される要素をアニメーション化できるようにする実験的な React 機能です。

## 注意

この機能は実験的であり、安定版の React ではまだ利用できません。

```jsx
import {unstable_ViewTransition as ViewTransition} from 'react';
```

## リファレンス

```jsx
<ViewTransition>
  <Component />
</ViewTransition>
```

### Props

- **`name`** (オプション): 共有要素のアニメーションに使用する一意の名前
- **`enter`** (オプション): 要素が入るときのアニメーションタイプ
- **`exit`** (オプション): 要素が出るときのアニメーションタイプ
- **`update`** (オプション): 要素が更新されるときのアニメーションタイプ

## 使用法

### 要素の入退場アニメーション

```jsx
function Component() {
  const [show, setShow] = useState(false);
  return (
    <ViewTransition>
      {show && <div>Hi</div>}
    </ViewTransition>
  );
}
```

デフォルトでは、滑らかなクロスフェードアニメーションが適用されます。

### 共有要素のアニメーション

```jsx
<ViewTransition name="unique-name">
  <Child />
</ViewTransition>
```

同じ `name` を持つ要素間でアニメーションが適用されます。

### リスト内のアイテム並べ替えアニメーション

```jsx
{orderedVideos.map((video) => (
  <ViewTransition key={video.title}>
    <Video video={video} />
  </ViewTransition>
))}
```

## アニメーションのカスタマイズ

### CSS クラスを使用

```css
.my-transition-class::view-transition-old(root) {
  animation: fade-out 0.3s;
}

.my-transition-class::view-transition-new(root) {
  animation: fade-in 0.3s;
}
```

### enter/exit/update プロップを使用

```jsx
<ViewTransition
  enter={{
    'my-transition-type': 'my-transition-class',
  }}
  exit={{
    'my-transition-type': 'my-exit-class',
  }}
>
  <div>Hello</div>
</ViewTransition>
```

## 重要な注意事項

### デフォルトでは setState の更新をアニメーション化しない

明示的にトランジションとしてマークする必要があります:

```jsx
startTransition(() => {
  setShow(!show);
});
```

### ユーザーのアニメーション設定を考慮

```jsx
<ViewTransition respectUserMotionPreference>
  <Component />
</ViewTransition>
```

### 現在は DOM でのみ動作

React Native などの非 DOM 環境では動作しません。

## トラブルシューティング

### アニメーションが機能しない

- トランジション内で state を更新しているか確認
- `ViewTransition` が正しくラップされているか確認
- ブラウザが View Transitions API をサポートしているか確認

## ベストプラクティス

- 一意の `name` プロップを使用して共有要素を識別
- アクセシビリティのためにアニメーションの設定を尊重
- パフォーマンスのために適度に使用
- フォールバックを提供(古いブラウザ対応)
