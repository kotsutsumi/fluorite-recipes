# Justify Items

グリッドアイテムがインライン軸に沿ってどのように整列されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `justify-items-start` | `justify-items: start;` |
| `justify-items-end` | `justify-items: end;` |
| `justify-items-end-safe` | `justify-items: safe end;` |
| `justify-items-center` | `justify-items: center;` |
| `justify-items-center-safe` | `justify-items: safe center;` |
| `justify-items-stretch` | `justify-items: stretch;` |
| `justify-items-normal` | `justify-items: normal;` |

## 基本的な使い方

### Start（開始位置）

`justify-items-start` を使用して、グリッドアイテムをインライン軸の開始位置に揃えます。

```html
<div class="grid justify-items-start ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### End（終了位置）

`justify-items-end` または `justify-items-end-safe` を使用して、グリッドアイテムをインライン軸の終了位置に揃えます。

```html
<div class="grid grid-flow-col justify-items-end ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

注: `justify-items-end-safe` では、十分なスペースがない場合、アイテムは開始位置に揃えられます。

### Center（中央）

`justify-items-center` または `justify-items-center-safe` を使用して、グリッドアイテムを中央に揃えます。

```html
<div class="grid grid-flow-col justify-items-center ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

注: `justify-items-center-safe` では、十分なスペースがない場合、アイテムは開始位置に揃えられます。

### Stretch（引き伸ばし）

`justify-items-stretch` を使用して、グリッドアイテムをインライン軸全体に引き伸ばします。

```html
<div class="grid grid-flow-col justify-items-stretch ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="grid justify-items-start md:justify-items-center ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
