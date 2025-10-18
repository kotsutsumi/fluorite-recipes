# Grid Row

グリッド行にわたって要素のサイズと配置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `row-span-<number>` | `grid-row: span <number> / span <number>;` |
| `row-span-full` | `grid-row: 1 / -1;` |
| `row-start-<number>` | `grid-row-start: <number>;` |
| `row-end-<number>` | `grid-row-end: <number>;` |
| `row-auto` | `grid-row: auto;` |

## 基本的な使い方

### 行のスパン

`row-span-<number>` ユーティリティを使用して、要素を複数の行にまたがらせます。

```html
<div class="grid grid-flow-col grid-rows-3 gap-4">
  <div class="row-span-3 ...">01</div>
  <div class="col-span-2 ...">02</div>
  <div class="col-span-2 row-span-2 ...">03</div>
</div>
```

### 開始ラインと終了ライン

`row-start-<number>` または `row-end-<number>` を使用して、特定のグリッドラインに要素を配置します。

```html
<div class="grid grid-flow-col grid-rows-3 gap-4">
  <div class="row-span-2 row-start-2 ...">01</div>
  <div class="row-span-2 row-end-3 ...">02</div>
  <div class="row-start-1 row-end-4 ...">03</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="row-[span_16_/_span_16] ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

レスポンシブレイアウトのためにブレークポイントバリアントをプレフィックスとして使用できます。

```html
<div class="row-span-3 md:row-span-4 ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
