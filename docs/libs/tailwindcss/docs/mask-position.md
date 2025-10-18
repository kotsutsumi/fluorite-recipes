# Mask Position

要素のマスク画像の位置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-top-left` | `mask-position: top left;` |
| `mask-top` | `mask-position: top;` |
| `mask-top-right` | `mask-position: top right;` |
| `mask-left` | `mask-position: left;` |
| `mask-center` | `mask-position: center;` |
| `mask-right` | `mask-position: right;` |
| `mask-bottom-left` | `mask-position: bottom left;` |
| `mask-bottom` | `mask-position: bottom;` |
| `mask-bottom-right` | `mask-position: bottom right;` |
| `mask-position-(<custom-property>)` | `mask-position: var(<custom-property>);` |
| `mask-position-[<value>]` | `mask-position: <value>;` |

## 基本的な使い方

### マスク位置の設定

`mask-{position}`ユーティリティを使用して、要素のマスク画像の位置を制御します。

```html
<div class="mask-center mask-[url(/img/circle.png)] ..."></div>
<div class="mask-top-left mask-[url(/img/circle.png)] ..."></div>
<div class="mask-top-right mask-[url(/img/circle.png)] ..."></div>
<div class="mask-bottom-left mask-[url(/img/circle.png)] ..."></div>
<div class="mask-bottom-right mask-[url(/img/circle.png)] ..."></div>
```

### 位置オプション

#### 中央配置

`mask-center`を使用して、マスク画像を中央に配置します。

```html
<div class="mask-center ..."></div>
```

#### 上部配置

`mask-top`を使用して、マスク画像を上部中央に配置します。

```html
<div class="mask-top ..."></div>
```

#### 右側配置

`mask-right`を使用して、マスク画像を右側中央に配置します。

```html
<div class="mask-right ..."></div>
```

#### 下部配置

`mask-bottom`を使用して、マスク画像を下部中央に配置します。

```html
<div class="mask-bottom ..."></div>
```

#### 左側配置

`mask-left`を使用して、マスク画像を左側中央に配置します。

```html
<div class="mask-left ..."></div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない位置値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="mask-position-[center_top_1rem] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用してマスク位置をカスタマイズできます。

```html
<div class="mask-position-(--my-mask-position) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクポジションユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-center md:mask-top ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Origin](/docs/mask-origin)
- [Mask Repeat](/docs/mask-repeat)
