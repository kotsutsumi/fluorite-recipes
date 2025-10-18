# Mask Clip

要素のマスクの境界ボックスを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-clip-border` | `mask-clip: border-box;` |
| `mask-clip-padding` | `mask-clip: padding-box;` |
| `mask-clip-content` | `mask-clip: content-box;` |
| `mask-clip-fill` | `mask-clip: fill-box;` |
| `mask-clip-stroke` | `mask-clip: stroke-box;` |
| `mask-clip-view` | `mask-clip: view-box;` |
| `mask-no-clip` | `mask-clip: no-clip;` |

## 基本的な使い方

### マスククリップの設定

`mask-clip-{value}`ユーティリティを使用して、要素のマスクの境界ボックスを制御します。

```html
<div class="mask-clip-border ...">
  <!-- ボーダーボックスにクリップ -->
</div>
<div class="mask-clip-padding ...">
  <!-- パディングボックスにクリップ -->
</div>
<div class="mask-clip-content ...">
  <!-- コンテンツボックスにクリップ -->
</div>
```

### Border Box

`mask-clip-border`を使用して、マスクをボーダーボックスにクリップします。これにより、マスクは要素のボーダーを含む領域に適用されます。

```html
<div class="mask-clip-border ..."></div>
```

### Padding Box

`mask-clip-padding`を使用して、マスクをパディングボックスにクリップします。これにより、マスクはボーダーを除外してパディング領域に適用されます。

```html
<div class="mask-clip-padding ..."></div>
```

### Content Box

`mask-clip-content`を使用して、マスクをコンテンツボックスにクリップします。これにより、マスクはパディングとボーダーを除外してコンテンツ領域にのみ適用されます。

```html
<div class="mask-clip-content ..."></div>
```

### SVG要素用のオプション

#### Fill Box

`mask-clip-fill`を使用して、SVG要素のフィル領域にマスクをクリップします。

```html
<svg class="mask-clip-fill ...">
  <!-- ... -->
</svg>
```

#### Stroke Box

`mask-clip-stroke`を使用して、SVG要素のストローク領域にマスクをクリップします。

```html
<svg class="mask-clip-stroke ...">
  <!-- ... -->
</svg>
```

#### View Box

`mask-clip-view`を使用して、SVG要素のビューボックスにマスクをクリップします。

```html
<svg class="mask-clip-view ...">
  <!-- ... -->
</svg>
```

### クリップの無効化

`mask-no-clip`を使用して、マスククリップを無効にします。

```html
<div class="mask-no-clip ..."></div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスククリップユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-clip-border md:mask-clip-padding ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Background Blend Mode](/docs/background-blend-mode)
- [Mask Composite](/docs/mask-composite)
