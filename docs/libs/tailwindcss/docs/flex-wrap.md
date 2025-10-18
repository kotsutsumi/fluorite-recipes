# Flex Wrap

フレックスアイテムの折り返し方法を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `flex-nowrap` | `flex-wrap: nowrap;` |
| `flex-wrap` | `flex-wrap: wrap;` |
| `flex-wrap-reverse` | `flex-wrap: wrap-reverse;` |

## 基本的な使い方

### 折り返さない

`flex-nowrap` を使用して、フレックスアイテムの折り返しを防ぎます。必要に応じて、柔軟性のないアイテムがコンテナからオーバーフローする場合があります。

```html
<div class="flex flex-nowrap">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### 通常の折り返し

`flex-wrap` を使用して、フレックスアイテムの折り返しを許可します。

```html
<div class="flex flex-wrap">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### 逆方向に折り返し

`flex-wrap-reverse` を使用して、フレックスアイテムを逆方向に折り返します。

```html
<div class="flex flex-wrap-reverse">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="flex flex-wrap md:flex-wrap-reverse ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [flex-direction](/docs/flex-direction)
- [flex](/docs/flex)
