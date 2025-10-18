# Mask Origin

要素のマスク画像がボーダー、パディング、コンテンツに対してどのように配置されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-origin-border` | `mask-origin: border-box;` |
| `mask-origin-padding` | `mask-origin: padding-box;` |
| `mask-origin-content` | `mask-origin: content-box;` |
| `mask-origin-fill` | `mask-origin: fill-box;` |
| `mask-origin-stroke` | `mask-origin: stroke-box;` |
| `mask-origin-view` | `mask-origin: view-box;` |

## 基本的な使い方

### ボーダーボックス

`mask-origin-border`を使用して、マスク画像をボーダーボックスの左上隅を基準に配置します。

```html
<div class="mask-origin-border border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像はボーダーを含む全体の要素ボックスに対して配置されます。

### パディングボックス

`mask-origin-padding`を使用して、マスク画像をパディングボックスの左上隅を基準に配置します。

```html
<div class="mask-origin-padding border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像はボーダーを除いたパディング領域に対して配置されます。

### コンテンツボックス

`mask-origin-content`を使用して、マスク画像をコンテンツボックスの左上隅を基準に配置します。

```html
<div class="mask-origin-content border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

マスク画像はボーダーとパディングを除いたコンテンツ領域に対して配置されます。

## SVG要素用のオプション

### Fill Box

`mask-origin-fill`を使用して、SVG要素のフィル領域を基準にマスク画像を配置します。

```html
<svg class="mask-origin-fill ...">
  <!-- ... -->
</svg>
```

### Stroke Box

`mask-origin-stroke`を使用して、SVG要素のストローク領域を基準にマスク画像を配置します。

```html
<svg class="mask-origin-stroke ...">
  <!-- ... -->
</svg>
```

### View Box

`mask-origin-view`を使用して、SVG要素のビューボックスを基準にマスク画像を配置します。

```html
<svg class="mask-origin-view ...">
  <!-- ... -->
</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクオリジンユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-origin-border md:mask-origin-padding ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Mode](/docs/mask-mode)
- [Mask Position](/docs/mask-position)
