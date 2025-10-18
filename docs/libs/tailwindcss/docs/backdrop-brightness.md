# Backdrop Filter: Brightness

要素に背景明るさフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-brightness-<number>` | `backdrop-filter: brightness(<number>%);` |
| `backdrop-brightness-(<custom-property>)` | `backdrop-filter: brightness(var(<custom-property>));` |
| `backdrop-brightness-[<value>]` | `backdrop-filter: brightness(<value>);` |

## 基本的な使い方

### 背景明るさの調整

`backdrop-brightness-{percentage}`ユーティリティを使用して、要素の背後にある背景の明るさを調整します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-brightness-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-brightness-150 ..."></div>
</div>
```

- `backdrop-brightness-50` - 背景を暗くします
- `backdrop-brightness-100` - 元の明るさ
- `backdrop-brightness-150` - 背景を明るくします

## カスタム値の適用

### 任意の値

テーマに含まれていない背景明るさ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-brightness-[1.75] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景明るさ値をカスタマイズできます。

```html
<div class="backdrop-brightness-(--my-backdrop-brightness) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景明るさユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-brightness-50 md:backdrop-brightness-150 ...">
  <!-- ... -->
</div>
```

## 実践例

### オーバーレイの明るさ調整

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-black/20 backdrop-brightness-75">
    <p class="text-white">暗くされた背景</p>
  </div>
</div>
```

## 関連ユーティリティ

- [Backdrop Blur](/docs/backdrop-blur)
- [Backdrop Contrast](/docs/backdrop-contrast)
