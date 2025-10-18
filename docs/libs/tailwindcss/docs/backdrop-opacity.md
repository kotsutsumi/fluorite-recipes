# Backdrop Filter: Opacity

要素に背景不透明度フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `backdrop-opacity-<number>` | `backdrop-filter: opacity(<number>%);` |
| `backdrop-opacity-(<custom-property>)` | `backdrop-filter: opacity(var(<custom-property>));` |
| `backdrop-opacity-[<value>]` | `backdrop-filter: opacity(<value>);` |

## 基本的な使い方

### 背景不透明度の設定

`backdrop-opacity-{percentage}`ユーティリティを使用して、要素の背後にある背景の不透明度を制御します。

```html
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-opacity-10 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-opacity-60 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
  <div class="bg-white/30 backdrop-opacity-95 ..."></div>
</div>
```

- `backdrop-opacity-10` - 10%の不透明度
- `backdrop-opacity-60` - 60%の不透明度
- `backdrop-opacity-95` - 95%の不透明度

## カスタム値の適用

### 任意の値

テーマに含まれていない背景不透明度値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<div class="backdrop-opacity-[.15] ...">
  <!-- ... -->
</div>
```

### CSS変数の使用

CSS変数を使用して背景不透明度値をカスタマイズできます。

```html
<div class="backdrop-opacity-(--my-backdrop-filter-opacity) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背景不透明度ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="backdrop-opacity-100 md:backdrop-opacity-60 ...">
  <!-- ... -->
</div>
```

## 実践例

### 透明度の段階的な変更

```html
<div class="relative">
  <img src="/img/mountains.jpg" />
  <div class="absolute inset-0 bg-black/50 backdrop-opacity-75 backdrop-blur-sm">
    <p class="text-white">部分的に透明な背景</p>
  </div>
</div>
```

### フェード効果

```html
<div class="backdrop-opacity-0 hover:backdrop-opacity-100 transition-all ...">
  <!-- ホバー時に背景が完全に不透明になります -->
</div>
```

## 注意事項

`backdrop-opacity`は背景フィルタの不透明度を制御します。要素自体の不透明度を制御するには、[Opacity](/docs/opacity)ユーティリティを使用してください。

## 関連ユーティリティ

- [Backdrop Invert](/docs/backdrop-invert)
- [Backdrop Saturate](/docs/backdrop-saturate)
- [Opacity](/docs/opacity)
