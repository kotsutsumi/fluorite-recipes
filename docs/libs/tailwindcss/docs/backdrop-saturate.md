# Backdrop Filter: Saturate

要素に背景彩度フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-saturate-<number>` | `backdrop-filter: saturate(<number>%);` |
| `backdrop-saturate-(<custom-property>)` | `backdrop-filter: saturate(var(<custom-property>));` |
| `backdrop-saturate-[<value>]` | `backdrop-filter: saturate(<value>);` |

## 基本的な使い方

### 背景彩度の調整

`backdrop-saturate-{percentage}`ユーティリティを使用して、要素の背後にある背景の彩度を調整します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-saturate-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-saturate-100 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-saturate-200 ..."></div>
</div>
```

- `backdrop-saturate-50` - 50%の彩度(低彩度)
- `backdrop-saturate-100` - 100%の彩度(元の状態)
- `backdrop-saturate-200` - 200%の彩度(高彩度)

## カスタム値の適用

### 任意の値

テーマに含まれていない背景彩度値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-saturate-[.25] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景彩度値をカスタマイズできます。

```html
<div class="backdrop-saturate-(--my-backdrop-saturate) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景彩度ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-saturate-50 md:backdrop-saturate-150 ...">
  <!-- ... -->
</div>
```

## 実践例

### 鮮やかなオーバーレイ

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/20 backdrop-saturate-200 backdrop-blur-sm">
    <p class="text-gray-900">高彩度の背景</p>
  </div>
</div>
```

### 低彩度エフェクト

```html
<div class="backdrop-saturate-0 hover:backdrop-saturate-100 transition-all ...">
  <!-- ホバー時に彩度が戻ります -->
</div>
```

## 関連ユーティリティ

- [Backdrop Opacity](/docs/backdrop-opacity)
- [Backdrop Sepia](/docs/backdrop-sepia)
- [Saturate](/docs/saturate)
