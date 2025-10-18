# Background Blend Mode

要素の背景画像が背景色とどのようにブレンドされるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `bg-blend-normal` | `background-blend-mode: normal;` |
| `bg-blend-multiply` | `background-blend-mode: multiply;` |
| `bg-blend-screen` | `background-blend-mode: screen;` |
| `bg-blend-overlay` | `background-blend-mode: overlay;` |
| `bg-blend-darken` | `background-blend-mode: darken;` |
| `bg-blend-lighten` | `background-blend-mode: lighten;` |
| `bg-blend-color-dodge` | `background-blend-mode: color-dodge;` |
| `bg-blend-color-burn` | `background-blend-mode: color-burn;` |
| `bg-blend-hard-light` | `background-blend-mode: hard-light;` |
| `bg-blend-soft-light` | `background-blend-mode: soft-light;` |
| `bg-blend-difference` | `background-blend-mode: difference;` |
| `bg-blend-exclusion` | `background-blend-mode: exclusion;` |
| `bg-blend-hue` | `background-blend-mode: hue;` |
| `bg-blend-saturation` | `background-blend-mode: saturation;` |
| `bg-blend-color` | `background-blend-mode: color;` |
| `bg-blend-luminosity` | `background-blend-mode: luminosity;` |

## 基本的な使い方

### ブレンドモードの設定

`bg-blend-{mode}`ユーティリティを使用して、要素の背景画像が背景色とどのようにブレンドされるかを制御します。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-multiply ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-soft-light ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-overlay ..."></div>
```

### 一般的なブレンドモード

#### Multiply
背景画像と背景色を掛け合わせて、より暗い色を作成します。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-multiply ..."></div>
```

#### Screen
背景画像と背景色を組み合わせて、より明るい色を作成します。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-screen ..."></div>
```

#### Overlay
暗い領域はより暗く、明るい領域はより明るくなります。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-overlay ..."></div>
```

#### Difference
2つの色の差を表示します。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-difference ..."></div>
```

#### Saturation
背景色の彩度を背景画像に適用します。

```html
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-saturation ..."></div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景ブレンドモードユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="bg-blend-multiply md:bg-blend-darken ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mix Blend Mode](/docs/mix-blend-mode)
- [Mask Clip](/docs/mask-clip)
