# Grid Column

グリッド列にわたって要素のサイズと配置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `col-span-<number>` | `grid-column: span <number> / span <number>;` |
| `col-span-full` | `grid-column: 1 / -1;` |
| `col-start-<number>` | `grid-column-start: <number>;` |
| `col-end-<number>` | `grid-column-end: <number>;` |
| `col-auto` | `grid-column: auto;` |

## 基本的な使い方

### 列のスパン

`col-span-<number>` を使用して、要素を複数の列にまたがらせます。

```html
<div class="grid grid-cols-3 gap-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div class="col-span-2">04</div>
  <div>05</div>
  <div>06</div>
  <div class="col-span-2">07</div>
</div>
```

### 開始ラインと終了ライン

`col-start-<number>` と `col-end-<number>` を使用して、グリッドの配置を制御します。

```html
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-4 col-start-2">01</div>
  <div class="col-start-1 col-end-3">02</div>
  <div class="col-span-2 col-end-7">03</div>
  <div class="col-start-1 col-end-7">04</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="col-[16_/_span_16]">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

ブレークポイントバリアントを使用してグリッド列ユーティリティを適用できます。

```html
<div class="col-span-2 md:col-span-4 ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
