# Scroll Snap Stop

可能なスナップ位置をスキップできるかどうかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `snap-normal` | `scroll-snap-stop: normal;` |
| `snap-always` | `scroll-snap-stop: always;` |

## 基本的な使い方

### スナップ位置の停止を強制

`snap-always`と`snap-mandatory`を使用して、スナップコンテナが常に要素で停止するようにします。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-always snap-center shrink-0">
    <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-always snap-center shrink-0">
    <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-always snap-center shrink-0">
    <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

### スナップ位置の停止をスキップ

`snap-normal`を使用して、スナップコンテナが可能なスクロールスナップ位置をスキップできるようにします。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-normal snap-center shrink-0">
    <img src="/img/vacation-01.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-normal snap-center shrink-0">
    <img src="/img/vacation-02.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
  <div class="snap-normal snap-center shrink-0">
    <img src="/img/vacation-03.jpg" class="w-80 h-60 object-cover rounded-lg" />
  </div>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみスナップ停止動作を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="snap-normal md:snap-always">
  <!-- ... -->
</div>
```

## 使用例

### 強制スナップカルーセル

各アイテムで必ず停止するカルーセル。

```html
<div class="snap-x snap-mandatory overflow-x-auto flex gap-4">
  <div class="snap-always snap-start shrink-0 w-full">
    <img src="/img/slide-1.jpg" class="w-full h-96 object-cover rounded-lg" />
  </div>
  <div class="snap-always snap-start shrink-0 w-full">
    <img src="/img/slide-2.jpg" class="w-full h-96 object-cover rounded-lg" />
  </div>
  <div class="snap-always snap-start shrink-0 w-full">
    <img src="/img/slide-3.jpg" class="w-full h-96 object-cover rounded-lg" />
  </div>
</div>
```

### フレキシブルスクロール

ユーザーが複数のアイテムをスキップできるスクロールコンテナ。

```html
<div class="snap-x snap-proximity overflow-x-auto flex gap-4">
  <div class="snap-normal snap-start shrink-0">
    <img src="/img/1.jpg" class="w-64 h-48 object-cover rounded-lg" />
  </div>
  <div class="snap-normal snap-start shrink-0">
    <img src="/img/2.jpg" class="w-64 h-48 object-cover rounded-lg" />
  </div>
  <div class="snap-normal snap-start shrink-0">
    <img src="/img/3.jpg" class="w-64 h-48 object-cover rounded-lg" />
  </div>
</div>
```

## 関連ユーティリティ

- [Scroll Snap Align](/docs/scroll-snap-align)
- [Scroll Snap Type](/docs/scroll-snap-type)
