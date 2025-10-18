# Box Shadow

要素のボックスシャドウを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `shadow-2xs` | `box-shadow: 0px 1px 0px 0px rgb(0 0 0 / 0.05);` |
| `shadow-xs` | `box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 0.05);` |
| `shadow-sm` | `box-shadow: 0px 1px 2px 0px rgb(0 0 0 / 0.05);` |
| `shadow-md` | `box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 0.06), 0px 4px 6px -1px rgb(0 0 0 / 0.1);` |
| `shadow-lg` | `box-shadow: 0px 4px 6px -2px rgb(0 0 0 / 0.05), 0px 10px 15px -3px rgb(0 0 0 / 0.1);` |
| `shadow-xl` | `box-shadow: 0px 10px 10px -5px rgb(0 0 0 / 0.04), 0px 20px 25px -5px rgb(0 0 0 / 0.1);` |
| `shadow-2xl` | `box-shadow: 0px 25px 50px -12px rgb(0 0 0 / 0.25);` |
| `shadow-none` | `box-shadow: none;` |
| `shadow-[<value>]` | `box-shadow: <value>;` |

### インセットシャドウ

| クラス | スタイル |
|--------|---------|
| `inset-shadow-2xs` | `box-shadow: inset 0px 1px 0px 0px rgb(0 0 0 / 0.05);` |
| `inset-shadow-xs` | `box-shadow: inset 0px 1px 1px 0px rgb(0 0 0 / 0.05);` |
| `inset-shadow-sm` | `box-shadow: inset 0px 1px 2px 0px rgb(0 0 0 / 0.05);` |
| `inset-shadow-md` | `box-shadow: inset 0px 2px 4px 0px rgb(0 0 0 / 0.06);` |
| `inset-shadow-lg` | `box-shadow: inset 0px 4px 6px 0px rgb(0 0 0 / 0.05);` |
| `inset-shadow-xl` | `box-shadow: inset 0px 10px 10px 0px rgb(0 0 0 / 0.04);` |
| `inset-shadow-2xl` | `box-shadow: inset 0px 25px 50px 0px rgb(0 0 0 / 0.25);` |
| `inset-shadow-none` | `box-shadow: inset 0 0 #0000;` |

### リングシャドウ

| クラス | スタイル |
|--------|---------|
| `ring` | `box-shadow: 0 0 0 3px var(--color-ring);` |
| `ring-inset` | `box-shadow: inset 0 0 0 3px var(--color-ring);` |

## 基本的な使い方

### 外側のシャドウ

`shadow-sm`、`shadow-md`、`shadow-lg`などのユーティリティを使用して、要素に異なるサイズのドロップシャドウを適用します。

```html
<div class="shadow-sm ..."></div>
<div class="shadow-md ..."></div>
<div class="shadow-lg ..."></div>
<div class="shadow-xl ..."></div>
<div class="shadow-2xl ..."></div>
```

### インセットシャドウ

要素の内側にシャドウを適用するには、`inset-shadow-*`ユーティリティを使用します。

```html
<div class="inset-shadow-sm ..."></div>
<div class="inset-shadow-md ..."></div>
<div class="inset-shadow-lg ..."></div>
```

### シャドウの削除

要素から既存のボックスシャドウを削除するには、`shadow-none`を使用します。

```html
<div class="shadow-lg md:shadow-none ..."></div>
```

## シャドウの色

シャドウの色を変更するには、`shadow-{color}`ユーティリティを使用します。

```html
<div class="shadow-lg shadow-blue-500 ..."></div>
<div class="shadow-lg shadow-red-500/50 ..."></div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていないボックスシャドウ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用してシャドウ値をカスタマイズできます。

```html
<div class="shadow-(--my-shadow) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみボックスシャドウユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="shadow-md md:shadow-lg ...">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、ボックスシャドウのスケールをカスタマイズできます。

```css
@theme {
  --shadow-3xl: 0 35px 60px -15px rgb(0 0 0 / 0.3);
}
```
