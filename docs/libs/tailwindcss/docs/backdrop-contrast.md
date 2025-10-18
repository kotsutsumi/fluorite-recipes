# Backdrop Filter: Contrast

要素に背景コントラストフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-contrast-<number>` | `backdrop-filter: contrast(<number>%);` |
| `backdrop-contrast-(<custom-property>)` | `backdrop-filter: contrast(var(<custom-property>));` |
| `backdrop-contrast-[<value>]` | `backdrop-filter: contrast(<value>);` |

## 基本的な使い方

### 背景コントラストの調整

`backdrop-contrast-{percentage}`ユーティリティを使用して、要素の背後にある背景のコントラストを調整します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-contrast-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-contrast-200 ..."></div>
</div>
```

- `backdrop-contrast-50` - 低コントラスト
- `backdrop-contrast-100` - 元のコントラスト
- `backdrop-contrast-200` - 高コントラスト

## カスタム値の適用

### 任意の値

テーマに含まれていない背景コントラスト値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-contrast-[.25] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景コントラスト値をカスタマイズできます。

```html
<div class="backdrop-contrast-(--my-backdrop-contrast) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景コントラストユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-contrast-50 md:backdrop-contrast-150 ...">
  <!-- ... -->
</div>
```

## 実践例

### 強調されたオーバーレイ

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/30 backdrop-contrast-150 backdrop-blur-sm">
    <h2 class="text-gray-900">高コントラストの背景</h2>
  </div>
</div>
```

## 関連ユーティリティ

- [Backdrop Brightness](/docs/backdrop-brightness)
- [Backdrop Grayscale](/docs/backdrop-grayscale)
