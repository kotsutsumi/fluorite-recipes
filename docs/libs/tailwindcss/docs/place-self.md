# Place Self

個々のアイテムの配置と整列を同時に制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `place-self-auto` | `place-self: auto;` |
| `place-self-start` | `place-self: start;` |
| `place-self-end` | `place-self: end;` |
| `place-self-end-safe` | `place-self: safe end;` |
| `place-self-center` | `place-self: center;` |
| `place-self-center-safe` | `place-self: safe center;` |
| `place-self-stretch` | `place-self: stretch;` |

## 基本的な使い方

### Auto（自動）

`place-self-auto` を使用して、コンテナの `place-items` プロパティに基づいてアイテムを揃えます。

```html
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-auto ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### Start（開始位置）

`place-self-start` を使用して、両方の軸でアイテムを開始位置に揃えます。

```html
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-start ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### Center（中央）

`place-self-center` を使用して、両方の軸でアイテムを中央に揃えます。

```html
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-center ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### End（終了位置）

`place-self-end` を使用して、両方の軸でアイテムを終了位置に揃えます。

```html
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-end ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

### Stretch（引き伸ばし）

`place-self-stretch` を使用して、両方の軸でアイテムを引き伸ばします。

```html
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-stretch ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="place-self-start md:place-self-center ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
