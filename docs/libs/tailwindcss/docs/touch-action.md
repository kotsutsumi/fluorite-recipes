# Touch Action

タッチスクリーンで要素をスクロールおよびズームする方法を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `touch-auto` | `touch-action: auto;` |
| `touch-none` | `touch-action: none;` |
| `touch-pan-x` | `touch-action: pan-x;` |
| `touch-pan-left` | `touch-action: pan-left;` |
| `touch-pan-right` | `touch-action: pan-right;` |
| `touch-pan-y` | `touch-action: pan-y;` |
| `touch-pan-up` | `touch-action: pan-up;` |
| `touch-pan-down` | `touch-action: pan-down;` |
| `touch-pinch-zoom` | `touch-action: pinch-zoom;` |
| `touch-manipulation` | `touch-action: manipulation;` |

## 基本的な使い方

### すべてのタッチアクションを許可

`touch-auto`を使用して、デフォルトのブラウザタッチ動作を有効にします。

```html
<div class="h-48 w-full touch-auto overflow-auto">
  <img class="h-auto w-[150%] max-w-none" src="/img/beach.jpg" />
</div>
```

### すべてのタッチアクションを無効化

`touch-none`を使用して、すべてのタッチインタラクションを無効にします。

```html
<div class="h-48 w-full touch-none overflow-auto">
  <img class="h-auto w-[150%] max-w-none" src="/img/beach.jpg" />
</div>
```

### 水平方向のパンのみ

`touch-pan-x`を使用して、水平方向のパンのみを許可します。

```html
<div class="h-48 w-full touch-pan-x overflow-x-auto">
  <img class="h-auto w-[150%] max-w-none" src="/img/beach.jpg" />
</div>
```

### 垂直方向のパンのみ

`touch-pan-y`を使用して、垂直方向のパンのみを許可します。

```html
<div class="h-96 w-full touch-pan-y overflow-y-auto">
  <img class="h-auto w-full" src="/img/tall-image.jpg" />
</div>
```

### ピンチズームを許可

`touch-pinch-zoom`を使用して、ピンチズームを有効にします。

```html
<div class="touch-pinch-zoom">
  <img src="/img/photo.jpg" class="w-full" />
</div>
```

### マニピュレーション

`touch-manipulation`を使用して、パンとズームのみを許可し、ダブルタップズームなどの他のジェスチャーを無効にします。

```html
<div class="touch-manipulation">
  <button>クリックしてください</button>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみタッチアクションを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="touch-auto md:touch-pan-x">
  <!-- ... -->
</div>
```

## 使用例

### 画像ビューア

水平方向にのみスクロール可能な画像ビューア。

```html
<div class="touch-pan-x overflow-x-auto flex gap-4">
  <img src="/img/1.jpg" class="h-96 w-auto shrink-0" />
  <img src="/img/2.jpg" class="h-96 w-auto shrink-0" />
  <img src="/img/3.jpg" class="h-96 w-auto shrink-0" />
</div>
```

### インタラクティブマップ

パンとズームが可能なマップ。

```html
<div class="touch-pan-x touch-pan-y touch-pinch-zoom overflow-auto h-96 w-full">
  <div class="h-[200%] w-[200%]">
    <!-- マップコンテンツ -->
  </div>
</div>
```

### ボタンのダブルタップ無効化

ダブルタップズームを防ぐボタン。

```html
<button class="touch-manipulation bg-blue-500 text-white px-6 py-3 rounded-lg">
  送信
</button>
```

## 注意事項

`touch-action`は、タッチスクリーンデバイスでのみ効果があります。デスクトップブラウザでは通常の動作に影響しません。
