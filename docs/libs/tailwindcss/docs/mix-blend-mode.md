# Mix Blend Mode

要素が背景とどのようにブレンドされるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mix-blend-normal` | `mix-blend-mode: normal;` |
| `mix-blend-multiply` | `mix-blend-mode: multiply;` |
| `mix-blend-screen` | `mix-blend-mode: screen;` |
| `mix-blend-overlay` | `mix-blend-mode: overlay;` |
| `mix-blend-darken` | `mix-blend-mode: darken;` |
| `mix-blend-lighten` | `mix-blend-mode: lighten;` |
| `mix-blend-color-dodge` | `mix-blend-mode: color-dodge;` |
| `mix-blend-color-burn` | `mix-blend-mode: color-burn;` |
| `mix-blend-hard-light` | `mix-blend-mode: hard-light;` |
| `mix-blend-soft-light` | `mix-blend-mode: soft-light;` |
| `mix-blend-difference` | `mix-blend-mode: difference;` |
| `mix-blend-exclusion` | `mix-blend-mode: exclusion;` |
| `mix-blend-hue` | `mix-blend-mode: hue;` |
| `mix-blend-saturation` | `mix-blend-mode: saturation;` |
| `mix-blend-color` | `mix-blend-mode: color;` |
| `mix-blend-luminosity` | `mix-blend-mode: luminosity;` |
| `mix-blend-plus-darker` | `mix-blend-mode: plus-darker;` |
| `mix-blend-plus-lighter` | `mix-blend-mode: plus-lighter;` |

## 基本的な使い方

### ブレンドモードの設定

`mix-blend-{mode}`ユーティリティを使用して、要素のコンテンツが背景とどのようにブレンドされるかを制御します。

```html
<div class="flex justify-center ...">
  <div class="mix-blend-multiply ..."></div>
  <div class="mix-blend-screen ..."></div>
  <div class="mix-blend-overlay ..."></div>
</div>
```

### 一般的なブレンドモード

#### Multiply
暗い色を作成し、黒いピクセルは黒のまま、白いピクセルは変化しません。

```html
<div class="mix-blend-multiply ..."></div>
```

#### Screen
明るい色を作成し、白いピクセルは白のまま、黒いピクセルは変化しません。

```html
<div class="mix-blend-screen ..."></div>
```

#### Overlay
暗い色を暗くし、明るい色を明るくします。

```html
<div class="mix-blend-overlay ..."></div>
```

#### Difference
2つの色の差を表示します。

```html
<div class="mix-blend-difference ..."></div>
```

## レスポンシブデザイン

特定のブレークポイントでのみミックスブレンドモードユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mix-blend-multiply md:mix-blend-darken ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Background Blend Mode](/docs/background-blend-mode)
- [Opacity](/docs/opacity)
