# Scroll Snap Align

要素のスクロールスナップ配置を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `snap-start` | `scroll-snap-align: start;` |
| `snap-end` | `scroll-snap-align: end;` |
| `snap-center` | `scroll-snap-align: center;` |
| `snap-align-none` | `scroll-snap-align: none;` |

## 基本的な使い方

### 中央にスナップ

`snap-center`を使用して、要素をスクロールコンテナの中央にスナップします。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-center shrink-0">
    <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-center shrink-0">
    <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-center shrink-0">
    <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

### 開始位置にスナップ

`snap-start`を使用して、要素をスクロールコンテナの開始位置にスナップします。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-start shrink-0">
    <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-start shrink-0">
    <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-start shrink-0">
    <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

### 終了位置にスナップ

`snap-end`を使用して、要素をスクロールコンテナの終了位置にスナップします。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-end shrink-0">
    <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-end shrink-0">
    <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-end shrink-0">
    <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみスナップ配置を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="snap-start md:snap-center">
  <!-- ... -->
</div>
```

## 使用例

### 画像ギャラリー

中央にスナップする水平スクロール可能な画像ギャラリー。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4 p-4">
  <div class="snap-center shrink-0 first:pl-4 last:pr-4">
    <img src="/img/1.jpg" class="w-80 h-60 object-cover rounded-lg shadow-lg" />
  </div>
  <div class="snap-center shrink-0">
    <img src="/img/2.jpg" class="w-80 h-60 object-cover rounded-lg shadow-lg" />
  </div>
  <div class="snap-center shrink-0">
    <img src="/img/3.jpg" class="w-80 h-60 object-cover rounded-lg shadow-lg" />
  </div>
</div>
```

## 関連ユーティリティ

- [Scroll Snap Type](/docs/scroll-snap-type)
- [Scroll Margin](/docs/scroll-margin)
- [Scroll Padding](/docs/scroll-padding)
