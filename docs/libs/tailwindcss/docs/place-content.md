# Place Content

コンテンツの配置と整列を同時に制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `place-content-center` | `place-content: center;` |
| `place-content-center-safe` | `place-content: safe center;` |
| `place-content-start` | `place-content: start;` |
| `place-content-end` | `place-content: end;` |
| `place-content-end-safe` | `place-content: safe end;` |
| `place-content-between` | `place-content: space-between;` |
| `place-content-around` | `place-content: space-around;` |
| `place-content-evenly` | `place-content: space-evenly;` |
| `place-content-baseline` | `place-content: baseline;` |
| `place-content-stretch` | `place-content: stretch;` |

## 基本的な使い方

### Center（中央）

アイテムをインライン軸とブロック軸の中央に詰めます。

```html
<div class="grid h-48 grid-cols-2 place-content-center gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### Start（開始位置）

アイテムをインライン軸とブロック軸の開始位置に詰めます。

```html
<div class="grid h-48 grid-cols-2 place-content-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### End（終了位置）

アイテムをインライン軸とブロック軸の終了位置に詰めます。

```html
<div class="grid h-48 grid-cols-2 place-content-end gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### Space Between（間隔均等）

アイテム間に均等な間隔を配置します。

```html
<div class="grid h-48 grid-cols-2 place-content-between gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### Space Around（周囲に間隔）

各アイテムの周囲に均等な間隔を配置します。

```html
<div class="grid h-48 grid-cols-2 place-content-around gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### Space Evenly（完全均等）

すべてのアイテムとその間隔を完全に均等に配置します。

```html
<div class="grid h-48 grid-cols-2 place-content-evenly gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="grid place-content-start md:place-content-center ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
