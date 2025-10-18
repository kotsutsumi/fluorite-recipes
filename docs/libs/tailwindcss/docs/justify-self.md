# Justify Self

個々のグリッドアイテムがインライン軸に沿ってどのように整列されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `justify-self-auto` | `justify-self: auto;` |
| `justify-self-start` | `justify-self: start;` |
| `justify-self-center` | `justify-self: center;` |
| `justify-self-center-safe` | `justify-self: safe center;` |
| `justify-self-end` | `justify-self: end;` |
| `justify-self-end-safe` | `justify-self: safe end;` |
| `justify-self-stretch` | `justify-self: stretch;` |

## 基本的な使い方

### Auto（自動）

`justify-self-auto` を使用して、グリッドの `justify-items` プロパティに基づいてアイテムを揃えます。

```html
<div class="grid justify-items-stretch ...">
  <div class="justify-self-auto ...">02</div>
</div>
```

### Start（開始位置）

`justify-self-start` を使用して、グリッドアイテムをインライン軸の開始位置に揃えます。

```html
<div class="grid justify-items-stretch ...">
  <div class="justify-self-start ...">02</div>
</div>
```

### Center（中央）

`justify-self-center` または `justify-self-center-safe` を使用して、グリッドアイテムをインライン軸の中央に揃えます。

```html
<div class="grid justify-items-stretch ...">
  <div class="justify-self-center ...">02</div>
</div>
```

注: `justify-self-center-safe` は、十分なスペースがない場合、コンテナの開始位置に揃えられます。

### End（終了位置）

`justify-self-end` または `justify-self-end-safe` を使用して、グリッドアイテムをインライン軸の終了位置に揃えます。

```html
<div class="grid justify-items-stretch ...">
  <div class="justify-self-end ...">02</div>
</div>
```

注: `justify-self-end-safe` は、十分なスペースがない場合、コンテナの開始位置に揃えられます。

### Stretch（引き伸ばし）

`justify-self-stretch` を使用して、グリッドアイテムをインライン軸全体に引き伸ばします。

```html
<div class="grid justify-items-start ...">
  <div class="justify-self-stretch ...">02</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="justify-self-start md:justify-self-end ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
