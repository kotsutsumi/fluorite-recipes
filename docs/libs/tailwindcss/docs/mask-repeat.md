# Mask Repeat

要素のマスク画像の繰り返しを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-repeat` | `mask-repeat: repeat;` |
| `mask-no-repeat` | `mask-repeat: no-repeat;` |
| `mask-repeat-x` | `mask-repeat: repeat-x;` |
| `mask-repeat-y` | `mask-repeat: repeat-y;` |
| `mask-repeat-space` | `mask-repeat: space;` |
| `mask-repeat-round` | `mask-repeat: round;` |

## 基本的な使い方

### 基本的な繰り返し

`mask-repeat`を使用して、マスク画像を水平方向と垂直方向の両方に繰り返します。

```html
<div class="mask-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

### 水平方向の繰り返し

`mask-repeat-x`を使用して、マスク画像を水平方向にのみ繰り返します。

```html
<div class="mask-repeat-x mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

### 垂直方向の繰り返し

`mask-repeat-y`を使用して、マスク画像を垂直方向にのみ繰り返します。

```html
<div class="mask-repeat-y mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

### クリッピングの防止

`mask-repeat-space`を使用して、マスク画像を繰り返しながら、画像が切り取られないように均等に間隔を空けます。

```html
<div class="mask-repeat-space mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

最初と最後のマスク画像はコンテナの両端に固定され、残りのスペースは画像間に均等に分配されます。

### クリッピングと隙間の防止

`mask-repeat-round`を使用して、マスク画像を繰り返し、切り取りや隙間がないようにサイズを調整します。

```html
<div class="mask-repeat-round mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像はコンテナを完全に埋めるために、必要に応じて拡大または縮小されます。

### 繰り返しの無効化

`mask-no-repeat`を使用して、マスク画像を繰り返さずに一度だけ表示します。

```html
<div class="mask-no-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクリピートユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-repeat md:mask-no-repeat ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Position](/docs/mask-position)
- [Mask Size](/docs/mask-size)
