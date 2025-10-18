# Backdrop Filter: Sepia

要素に背景セピア調フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-sepia` | `backdrop-filter: sepia(100%);` |
| `backdrop-sepia-<number>` | `backdrop-filter: sepia(<number>%);` |
| `backdrop-sepia-(<custom-property>)` | `backdrop-filter: sepia(var(<custom-property>));` |
| `backdrop-sepia-[<value>]` | `backdrop-filter: sepia(<value>);` |

## 基本的な使い方

### 背景セピア調の適用

`backdrop-sepia-{percentage}`ユーティリティを使用して、要素の背後にある背景にセピア調の効果を適用します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-sepia-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-sepia ..."></div>
</div>
```

- `backdrop-sepia-0` - セピア調なし
- `backdrop-sepia` - 100%セピア調

### 背景セピア調の削除

`backdrop-sepia-0`を使用して、背景セピア調フィルタを削除します。

```html
<div class="backdrop-sepia md:backdrop-sepia-0 ...">
  <!-- ... -->
</div>
```

## カスタム値の適用

### 任意の値

テーマに含まれていない背景セピア値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-sepia-[.25] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景セピア値をカスタマイズできます。

```html
<div class="backdrop-sepia-(--my-backdrop-sepia) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景セピアユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-sepia md:backdrop-sepia-0 ...">
  <!-- ... -->
</div>
```

## 実践例

### ビンテージオーバーレイ

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-white/20 backdrop-sepia backdrop-blur-sm">
    <p class="text-gray-900">ビンテージ風の背景</p>
  </div>
</div>
```

### 複数フィルタの組み合わせ

```html
<div class="backdrop-sepia backdrop-contrast-125 backdrop-brightness-110 ...">
  <!-- セピア調とコントラスト、明るさを組み合わせた効果 -->
</div>
```

## 関連ユーティリティ

- [Backdrop Grayscale](/docs/backdrop-grayscale)
- [Backdrop Saturate](/docs/backdrop-saturate)
- [Sepia](/docs/sepia)
