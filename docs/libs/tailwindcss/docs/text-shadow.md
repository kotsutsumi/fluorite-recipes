# Text Shadow

要素のテキストシャドウを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `text-shadow-2xs` | `text-shadow: 0px 1px 0px rgb(0 0 0 / 0.15);` |
| `text-shadow-xs` | `text-shadow: 0px 1px 1px rgb(0 0 0 / 0.2);` |
| `text-shadow-sm` | `text-shadow: 0px 1px 2px rgb(0 0 0 / 0.3), 0px 1px 3px rgb(0 0 0 / 0.15);` |
| `text-shadow-md` | `text-shadow: 0px 2px 4px rgb(0 0 0 / 0.3), 0px 2px 3px rgb(0 0 0 / 0.15);` |
| `text-shadow-lg` | `text-shadow: 0px 4px 6px rgb(0 0 0 / 0.3), 0px 2px 3px rgb(0 0 0 / 0.15);` |
| `text-shadow-none` | `text-shadow: none;` |
| `text-shadow-[<value>]` | `text-shadow: <value>;` |

## 基本的な使い方

### テキストシャドウの追加

`text-shadow-sm`、`text-shadow-md`、`text-shadow-lg`などのユーティリティを使用して、テキストにシャドウを適用します。

```html
<p class="text-shadow-2xs ...">微かなシャドウ</p>
<p class="text-shadow-sm ...">柔らかなシャドウ</p>
<p class="text-shadow-md ...">中程度のシャドウ</p>
<p class="text-shadow-lg ...">顕著なシャドウ</p>
```

### シャドウの削除

テキストシャドウを削除するには、`text-shadow-none`を使用します。

```html
<p class="text-shadow-lg md:text-shadow-none ...">
  <!-- ... -->
</p>
```

## 不透明度の変更

`text-shadow-{size}/{opacity}`修飾子を使用して、テキストシャドウの不透明度を制御します。

```html
<p class="text-shadow-lg/20 ...">より薄いシャドウ</p>
<p class="text-shadow-lg/30 ...">やや濃いシャドウ</p>
<p class="text-shadow-lg/50 ...">中程度の濃さのシャドウ</p>
```

## シャドウの色

シャドウの色を変更するには、`text-shadow-{color}`ユーティリティを使用します。

```html
<button class="text-sky-950 text-shadow-2xs text-shadow-sky-300 ...">
  デモを予約
</button>
```

色と不透明度を組み合わせることもできます。

```html
<p class="text-shadow-lg text-shadow-indigo-500/50 ...">
  <!-- ... -->
</p>
```

## カスタム値の適用

### 任意の値

テーマに含まれていないテキストシャドウ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<p class="text-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ...">
  <!-- ... -->
</p>
```

### CSS変数の使用

CSS変数を使用してテキストシャドウ値をカスタマイズできます。

```html
<p class="text-shadow-(--my-text-shadow) ...">
  <!-- ... -->
</p>
```

## レスポンシブデザイン

特定のブレークポイントでのみテキストシャドウユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<p class="text-shadow-sm md:text-shadow-lg ...">
  <!-- ... -->
</p>
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、テキストシャドウのスケールをカスタマイズできます。

```css
@theme {
  --text-shadow-3xl: 0 10px 20px rgb(0 0 0 / 0.5);
}
```
