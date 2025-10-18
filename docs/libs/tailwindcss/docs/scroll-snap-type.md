# Scroll Snap Type

スナップコンテナでスナップポイントがどれだけ厳密に適用されるかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `snap-none` | `scroll-snap-type: none;` |
| `snap-x` | `scroll-snap-type: x var(--tw-scroll-snap-strictness);` |
| `snap-y` | `scroll-snap-type: y var(--tw-scroll-snap-strictness);` |
| `snap-both` | `scroll-snap-type: both var(--tw-scroll-snap-strictness);` |
| `snap-mandatory` | `--tw-scroll-snap-strictness: mandatory;` |
| `snap-proximity` | `--tw-scroll-snap-strictness: proximity;` |

## 基本的な使い方

### 水平スクロールスナップ

`snap-x`を使用して、水平スクロールスナップを有効にします。子要素にスクロールスナップ配置を設定する必要があります。

```html
<div class="snap-x overflow-x-auto flex gap-4">
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

### 必須スクロールスナップ

`snap-mandatory`を使用して、コンテナが常にスナップポイントで停止するようにします。

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

### 近接スクロールスナップ

`snap-proximity`を使用して、近くのポイントへのスナップを許可します。より柔軟なスクロール動作を提供します。

```html
<div class="snap-x snap-proximity overflow-x-auto flex gap-4">
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

### 垂直スクロールスナップ

`snap-y`を使用して、垂直スクロールスナップを有効にします。

```html
<div class="snap-y snap-mandatory overflow-y-auto h-96">
  <div class="snap-start">
    <img src="/img/vacation-01.jpg" class="w-full h-80 object-cover" />
  </div>
  <div class="snap-start">
    <img src="/img/vacation-02.jpg" class="w-full h-80 object-cover" />
  </div>
  <div class="snap-start">
    <img src="/img/vacation-03.jpg" class="w-full h-80 object-cover" />
  </div>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみスナップタイプを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="snap-none md:snap-x md:snap-mandatory">
  <!-- ... -->
</div>
```

## 使用例

### フルスクリーンカルーセル

必須スナップを使用したフルスクリーンの画像カルーセル。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex">
  <div class="snap-start shrink-0 w-full">
    <img src="/img/hero-1.jpg" class="w-full h-screen object-cover" />
  </div>
  <div class="snap-start shrink-0 w-full">
    <img src="/img/hero-2.jpg" class="w-full h-screen object-cover" />
  </div>
  <div class="snap-start shrink-0 w-full">
    <img src="/img/hero-3.jpg" class="w-full h-screen object-cover" />
  </div>
</div>
```

### カードグリッド

近接スナップを使用した柔軟なカードグリッド。

```html
<div class="snap-x snap-proximity overflow-x-auto flex gap-4 p-4">
  <div class="snap-start shrink-0 w-64">
    <div class="bg-white rounded-lg shadow-lg p-4">
      <h3 class="text-lg font-semibold">カード 1</h3>
      <p class="text-gray-600">説明...</p>
    </div>
  </div>
  <div class="snap-start shrink-0 w-64">
    <div class="bg-white rounded-lg shadow-lg p-4">
      <h3 class="text-lg font-semibold">カード 2</h3>
      <p class="text-gray-600">説明...</p>
    </div>
  </div>
</div>
```

## 関連ユーティリティ

- [Scroll Snap Align](/docs/scroll-snap-align)
- [Scroll Snap Stop](/docs/scroll-snap-stop)
