# Align Self

個々のフレックスまたはグリッドアイテムがコンテナの交差軸に沿ってどのように配置されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `self-auto` | `align-self: auto;` |
| `self-start` | `align-self: flex-start;` |
| `self-end` | `align-self: flex-end;` |
| `self-end-safe` | `align-self: safe flex-end;` |
| `self-center` | `align-self: center;` |
| `self-center-safe` | `align-self: safe center;` |
| `self-stretch` | `align-self: stretch;` |
| `self-baseline` | `align-self: baseline;` |
| `self-baseline-last` | `align-self: last baseline;` |

## 基本的な使い方

### Auto（自動）

`self-auto` を使用して、コンテナの `align-items` プロパティに基づいてアイテムを揃えます。

```html
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-auto ...">02</div>
  <div>03</div>
</div>
```

### Start（開始位置）

`self-start` を使用して、アイテムをコンテナの交差軸の開始位置に揃えます。

```html
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-start ...">02</div>
  <div>03</div>
</div>
```

### Center（中央）

`self-center` を使用して、アイテムをコンテナの交差軸の中央に揃えます。

```html
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-center ...">02</div>
  <div>03</div>
</div>
```

### End（終了位置）

`self-end` を使用して、アイテムをコンテナの交差軸の終了位置に揃えます。

```html
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-end ...">02</div>
  <div>03</div>
</div>
```

### Stretch（引き伸ばし）

`self-stretch` を使用して、アイテムをコンテナの交差軸全体に引き伸ばします。

```html
<div class="flex items-start ...">
  <div>01</div>
  <div class="self-stretch ...">02</div>
  <div>03</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="self-auto md:self-end ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
