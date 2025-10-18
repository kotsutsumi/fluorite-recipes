# Align Items

フレックスおよびグリッドアイテムがコンテナの交差軸に沿ってどのように配置されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `items-start` | `align-items: flex-start;` |
| `items-end` | `align-items: flex-end;` |
| `items-end-safe` | `align-items: safe flex-end;` |
| `items-center` | `align-items: center;` |
| `items-center-safe` | `align-items: safe center;` |
| `items-baseline` | `align-items: baseline;` |
| `items-baseline-last` | `align-items: last baseline;` |
| `items-stretch` | `align-items: stretch;` |

## 基本的な使い方

### Stretch（引き伸ばし）

`items-stretch` を使用して、アイテムをコンテナの交差軸全体に引き伸ばします。

```html
<div class="flex items-stretch ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

### Start（開始位置）

`items-start` を使用して、アイテムをコンテナの交差軸の開始位置に揃えます。

```html
<div class="flex items-start ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

### Center（中央）

`items-center` を使用して、アイテムをコンテナの交差軸の中央に揃えます。

```html
<div class="flex items-center ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

### End（終了位置）

`items-end` を使用して、アイテムをコンテナの交差軸の終了位置に揃えます。

```html
<div class="flex items-end ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

### Baseline（ベースライン）

`items-baseline` を使用して、アイテムをベースラインに沿って揃えます。

```html
<div class="flex items-baseline ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="flex items-start md:items-center ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
