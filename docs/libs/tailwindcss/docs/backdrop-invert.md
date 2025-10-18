# Backdrop Filter: Invert

要素に背景色反転フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-invert` | `backdrop-filter: invert(100%);` |
| `backdrop-invert-<number>` | `backdrop-filter: invert(<number>%);` |
| `backdrop-invert-(<custom-property>)` | `backdrop-filter: invert(var(<custom-property>));` |
| `backdrop-invert-[<value>]` | `backdrop-filter: invert(<value>);` |

## 基本的な使い方

### 背景色の反転

`backdrop-invert-{percentage}`ユーティリティを使用して、要素の背後にある背景の色を反転させます。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-invert-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-invert ..."></div>
</div>
```

- `backdrop-invert-0` - 反転なし
- `backdrop-invert` - 100%反転

### 背景反転の削除

`backdrop-invert-0`を使用して、背景色反転フィルタを削除します。

```html
<div class="backdrop-invert md:backdrop-invert-0 ...">
  <!-- ... -->
</div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない背景反転値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-invert-[.25] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景反転値をカスタマイズできます。

```html
<div class="backdrop-invert-(--my-backdrop-invert) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景反転ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-invert-0 md:backdrop-invert ...">
  <!-- ... -->
</div>
```

## 実践例

### ネガティブ効果

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/20 backdrop-invert backdrop-blur-sm">
    <p class="text-white">反転した背景</p>
  </div>
</div>
```

### ダークモード効果

```html
<div class="dark:backdrop-invert ...">
  <!-- ダークモードで背景を反転 -->
</div>
```

## 関連ユーティリティ

- [Backdrop Blur](/docs/backdrop-blur)
- [Backdrop Brightness](/docs/backdrop-brightness)
- [Backdrop Hue Rotate](/docs/backdrop-hue-rotate)
- [Invert](/docs/invert)
