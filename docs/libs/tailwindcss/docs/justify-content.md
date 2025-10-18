# Justify Content

フレックスおよびグリッドアイテムがコンテナの主軸に沿ってどのように配置されるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `justify-start` | `justify-content: flex-start;` |
| `justify-end` | `justify-content: flex-end;` |
| `justify-end-safe` | `justify-content: safe flex-end;` |
| `justify-center` | `justify-content: center;` |
| `justify-center-safe` | `justify-content: safe center;` |
| `justify-between` | `justify-content: space-between;` |
| `justify-around` | `justify-content: space-around;` |
| `justify-evenly` | `justify-content: space-evenly;` |
| `justify-stretch` | `justify-content: stretch;` |
| `justify-baseline` | `justify-content: baseline;` |
| `justify-normal` | `justify-content: normal;` |

## 基本的な使い方

### Start（開始位置）

`justify-start` を使用して、アイテムをコンテナの主軸の開始位置に揃えます。

```html
<div class="flex justify-start ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Center（中央）

`justify-center` または `justify-center-safe` を使用して、アイテムをコンテナの主軸の中央に揃えます。

```html
<div class="flex justify-center ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

注: `justify-center-safe` は、十分なスペースがない場合にアイテムを開始位置に揃えます。

### End（終了位置）

`justify-end` または `justify-end-safe` を使用して、アイテムをコンテナの主軸の終了位置に揃えます。

```html
<div class="flex justify-end ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

注: `justify-end-safe` は、十分なスペースがない場合にアイテムを開始位置に揃えます。

### Space Between（間隔均等）

`justify-between` を使用して、アイテム間の間隔を均等にします。

```html
<div class="flex justify-between ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Space Around（周囲に間隔）

`justify-around` を使用して、各アイテムの周囲に均等な間隔を配置します。

```html
<div class="flex justify-around ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Space Evenly（完全均等）

`justify-evenly` を使用して、すべてのアイテムとその間隔を完全に均等に配置します。

```html
<div class="flex justify-evenly ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="flex justify-start md:justify-between ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
