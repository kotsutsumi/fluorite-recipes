# Backdrop Filter: Grayscale

要素に背景グレースケールフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-grayscale` | `backdrop-filter: grayscale(100%);` |
| `backdrop-grayscale-<number>` | `backdrop-filter: grayscale(<number>%);` |
| `backdrop-grayscale-(<custom-property>)` | `backdrop-filter: grayscale(var(<custom-property>));` |
| `backdrop-grayscale-[<value>]` | `backdrop-filter: grayscale(<value>);` |

## 基本的な使い方

### 背景グレースケールの適用

`backdrop-grayscale-{percentage}`ユーティリティを使用して、要素の背後にある背景にグレースケール効果を適用します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-grayscale-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-grayscale ..."></div>
</div>
```

- `backdrop-grayscale-0` - グレースケールなし
- `backdrop-grayscale` - 100%グレースケール

### 背景グレースケールの削除

`backdrop-grayscale-0`を使用して、背景グレースケールフィルタを削除します。

```html
<div class="backdrop-grayscale md:backdrop-grayscale-0 ...">
  <!-- ... -->
</div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない背景グレースケール値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-grayscale-[0.5] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景グレースケール値をカスタマイズできます。

```html
<div class="backdrop-grayscale-(--my-backdrop-grayscale) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景グレースケールユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-grayscale md:backdrop-grayscale-0 ...">
  <!-- ... -->
</div>
```

## 実践例

### モノクロオーバーレイ

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/20 backdrop-grayscale backdrop-blur-sm">
    <p class="text-gray-900">モノクロ背景</p>
  </div>
</div>
```

### ホバー効果

```html
<div class="backdrop-grayscale hover:backdrop-grayscale-0 transition-all ...">
  <!-- ホバー時にカラーに戻ります -->
</div>
```

## 関連ユーティリティ

- [Backdrop Contrast](/docs/backdrop-contrast)
- [Backdrop Hue Rotate](/docs/backdrop-hue-rotate)
- [Grayscale](/docs/grayscale)
