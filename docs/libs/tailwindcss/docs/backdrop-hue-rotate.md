# Backdrop Filter: Hue Rotate

要素に背景色相回転フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-hue-rotate-<number>` | `backdrop-filter: hue-rotate(<number>deg);` |
| `-backdrop-hue-rotate-<number>` | `backdrop-filter: hue-rotate(calc(<number>deg * -1));` |
| `backdrop-hue-rotate-(<custom-property>)` | `backdrop-filter: hue-rotate(var(<custom-property>));` |
| `backdrop-hue-rotate-[<value>]` | `backdrop-filter: hue-rotate(<value>);` |

## 基本的な使い方

### 背景色相の回転

`backdrop-hue-rotate-{degrees}`ユーティリティを使用して、要素の背後にある背景の色相を回転させます。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-hue-rotate-90 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-hue-rotate-180 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-hue-rotate-270 ..."></div>
</div>
```

### 負の値の使用

負の値を使用して、色相環を逆方向に回転させます。

```html
<div class="backdrop-hue-rotate-[-15deg] ...">...</div>
<div class="backdrop-hue-rotate-[-45deg] ...">...</div>
<div class="backdrop-hue-rotate-[-90deg] ...">...</div>
```

または、プレフィックス付きのクラスを使用します。

```html
<div class="-backdrop-hue-rotate-15 ...">...</div>
<div class="-backdrop-hue-rotate-45 ...">...</div>
<div class="-backdrop-hue-rotate-90 ...">...</div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない背景色相回転値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-hue-rotate-[3.142rad] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景色相回転値をカスタマイズできます。

```html
<div class="backdrop-hue-rotate-(--my-backdrop-hue-rotate) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景色相回転ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-hue-rotate-90 md:backdrop-hue-rotate-0 ...">
  <!-- ... -->
</div>
```

## 実践例

### カラーシフトオーバーレイ

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/20 backdrop-hue-rotate-180 backdrop-blur-sm">
    <p class="text-white">色相が反転した背景</p>
  </div>
</div>
```

## 関連ユーティリティ

- [Backdrop Grayscale](/docs/backdrop-grayscale)
- [Backdrop Invert](/docs/backdrop-invert)
- [Hue Rotate](/docs/hue-rotate)
