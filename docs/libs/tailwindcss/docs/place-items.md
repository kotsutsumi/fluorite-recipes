# Place Items

アイテムの配置と整列を同時に制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `place-items-start` | `place-items: start;` |
| `place-items-end` | `place-items: end;` |
| `place-items-end-safe` | `place-items: safe end;` |
| `place-items-center` | `place-items: center;` |
| `place-items-center-safe` | `place-items: safe center;` |
| `place-items-baseline` | `place-items: baseline;` |
| `place-items-stretch` | `place-items: stretch;` |

## 基本的な使い方

### Start（開始位置）

`place-items-start` を使用して、グリッドアイテムを両方の軸でグリッド領域の開始位置に配置します。

```html
<div class="grid grid-cols-3 place-items-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### End（終了位置）

`place-items-end` を使用して、グリッドアイテムを両方の軸でグリッド領域の終了位置に配置します。

```html
<div class="grid h-56 grid-cols-3 place-items-end gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### Center（中央）

`place-items-center` を使用して、グリッドアイテムを両方の軸でグリッド領域の中央に配置します。

```html
<div class="grid h-56 grid-cols-3 place-items-center gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### Stretch（引き伸ばし）

`place-items-stretch` を使用して、グリッドアイテムを両方の軸でグリッド領域全体に引き伸ばします。

```html
<div class="grid grid-cols-3 place-items-stretch gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="grid place-items-start md:place-items-center ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
