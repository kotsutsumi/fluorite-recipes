# `<progress>`

ブラウザ組み込みの `<progress>` コンポーネントを利用することで、プログレスインジケータをレンダーできます。

```jsx
<progress value={0.5} />
```

## リファレンス

### `<progress>`

プログレスインジケータを表示するには、ブラウザ組み込みの `<progress>` コンポーネントをレンダーします。

```jsx
<progress value={0.5} />
```

#### Props

`<progress>` は、すべての一般的な要素の props をサポートしています。

さらに、`<progress>` は以下の props をサポートします:

**`max`**: 数値。最大値を指定します。デフォルトは `1` です。

**`value`**: `0` から `max` の間の数値、または不定のプログレスの場合は `null`。完了した量を指定します。

## 使用法

### プログレスインジケータを制御する

プログレスインジケータを表示するには、`<progress>` コンポーネントをレンダーします。`0` から指定した `max` 値の間の数値 `value` を渡すことができます。`max` 値を渡さない場合、デフォルトで `1` と見なされます。

操作が進行中でない場合は、`value={null}` を渡して、プログレスインジケータを不定状態にします。

```jsx
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

### プログレス値の表示例

以下は、さまざまなプログレス状態を示す実用的な例です:

```jsx
import { useState } from 'react';

export default function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  function handleStart() {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.1;
      });
    }, 500);
  }

  return (
    <>
      <progress value={progress} />
      <p>{Math.round(progress * 100)}% 完了</p>
      <button onClick={handleStart}>開始</button>
    </>
  );
}
```

### ファイルアップロードのプログレス表示

ファイルアップロードの進捗状況を表示する実用的な例:

```jsx
import { useState } from 'react';

export default function FileUploader() {
  const [uploadProgress, setUploadProgress] = useState(null);

  function handleUpload() {
    setUploadProgress(0);

    // シミュレートされたアップロード
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }

  return (
    <div>
      {uploadProgress !== null && (
        <>
          <progress value={uploadProgress} max={100} />
          <p>アップロード中: {uploadProgress}%</p>
        </>
      )}
      <button onClick={handleUpload} disabled={uploadProgress !== null && uploadProgress < 100}>
        ファイルをアップロード
      </button>
    </div>
  );
}
```

### 不定のプログレス状態

操作の進捗が不明な場合、`value={null}` を使用して不定のプログレス状態を表示できます:

```jsx
export default function LoadingSpinner() {
  const [isLoading, setIsLoading] = useState(false);

  function handleLoad() {
    setIsLoading(true);

    // 3秒後に完了
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <>
      {isLoading && (
        <>
          <progress value={null} />
          <p>読み込み中...</p>
        </>
      )}
      <button onClick={handleLoad} disabled={isLoading}>
        データを読み込む
      </button>
    </>
  );
}
```

## 重要な注意事項

### プログレス値の範囲

- `value` は `0` から `max` の間である必要があります
- `max` を指定しない場合、デフォルトは `1` です
- パーセンテージ表示の場合は `max={100}` を使用します
- 不定状態の場合は `value={null}` を使用します

### スタイリング

ブラウザによって `<progress>` 要素のデフォルトスタイルが異なる場合があります。一貫したスタイルを適用するには、CSS でカスタマイズできます:

```css
progress {
  width: 100%;
  height: 20px;
}

progress::-webkit-progress-bar {
  background-color: #f0f0f0;
  border-radius: 10px;
}

progress::-webkit-progress-value {
  background-color: #4caf50;
  border-radius: 10px;
}

progress::-moz-progress-bar {
  background-color: #4caf50;
  border-radius: 10px;
}
```

### アクセシビリティ

プログレスインジケータにアクセシブルなラベルを提供することを検討してください:

```jsx
<div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
  <progress value={progress} max={100} />
  <span className="sr-only">{progress}% 完了</span>
</div>
```
