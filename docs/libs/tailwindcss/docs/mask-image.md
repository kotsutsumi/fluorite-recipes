# Mask Image

要素のマスク画像を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-[<value>]` | `mask-image: <value>;` |
| `mask-none` | `mask-image: none;` |
| `mask-linear-<angle>` | `mask-image: linear-gradient(<angle>, ...);` |
| `mask-radial-from-<value>` | `mask-image: radial-gradient(...);` |
| `mask-conic-from-<value>` | `mask-image: conic-gradient(...);` |

## 基本的な使い方

### 画像マスク

`mask-[url(...)]`を使用して、画像をマスクとして適用します。

```html
<div class="mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ...">
  <!-- ... -->
</div>
```

### マスクの削除

`mask-none`を使用して、マスク画像を削除します。

```html
<div class="mask-[url(/img/mask.png)] md:mask-none ...">
  <!-- ... -->
</div>
```

## グラデーションマスク

### リニアグラデーント

`mask-linear-{angle}`と方向ユーティリティを使用して、リニアグラデーントマスクを作成します。

```html
<div class="mask-linear-to-b mask-from-black mask-to-transparent ...">
  <!-- 上から下へのグラデーント -->
</div>
```

### エッジマスキング

特定の方向からフェードアウトするマスクを作成します。

```html
<div class="mask-t-from-50% bg-[url(/img/mountains.jpg)] ...">
  <!-- 上部50%からマスク -->
</div>
<div class="mask-b-from-50% bg-[url(/img/mountains.jpg)] ...">
  <!-- 下部50%からマスク -->
</div>
```

### ラジアルグラデーント

`mask-radial-from-{value}`を使用して、ラジアルグラデーントマスクを作成します。

```html
<div class="mask-radial-from-75% mask-radial-at-left ...">
  <!-- 左から75%の位置からラジアルマスク -->
</div>
```

### コニカルグラデーント

`mask-conic-from-{value}`を使用して、コニカルグラデーントマスクを作成します。

```html
<div class="mask-conic-from-black mask-conic-at-center ...">
  <!-- 中心からのコニカルマスク -->
</div>
```

## カスタム値の適用

### 任意の値

角括弧を使用して、カスタムマスク画像を適用します。

```html
<div class="mask-[url(/custom-mask.svg)] ...">
  <!-- カスタムSVGマスク -->
</div>
```

### 複数のマスク

複数のマスク画像を組み合わせることができます。

```html
<div class="mask-[url(/mask1.png),url(/mask2.png)] ...">
  <!-- 複数のマスク -->
</div>
```

### グラデーントのカスタマイズ

カスタムグラデーント値を使用できます。

```html
<div class="mask-[linear-gradient(45deg,black,transparent)] ...">
  <!-- カスタムグラデーント -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスク画像ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-linear-to-b md:mask-radial-from-50% ...">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、マスク画像のカスタム値を定義できます。

```css
@theme {
  --mask-image-fade: linear-gradient(to bottom, black, transparent);
}
```

## 関連ユーティリティ

- [Mask Composite](/docs/mask-composite)
- [Mask Position](/docs/mask-position)
- [Mask Size](/docs/mask-size)
