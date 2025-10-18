# Flex Direction

フレックスアイテムの方向を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `flex-row` | `flex-direction: row;` |
| `flex-row-reverse` | `flex-direction: row-reverse;` |
| `flex-col` | `flex-direction: column;` |
| `flex-col-reverse` | `flex-direction: column-reverse;` |

## 基本的な使い方

### Row（横方向）

`flex-row` を使用して、テキストと同じ方向に水平にフレックスアイテムを配置します。

```html
<div class="flex flex-row ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Row Reversed（横方向・逆順）

`flex-row-reverse` を使用して、逆方向に水平にフレックスアイテムを配置します。

```html
<div class="flex flex-row-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Column（縦方向）

`flex-col` を使用して、垂直にフレックスアイテムを配置します。

```html
<div class="flex flex-col ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

### Column Reversed（縦方向・逆順）

`flex-col-reverse` を使用して、逆方向に垂直にフレックスアイテムを配置します。

```html
<div class="flex flex-col-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="flex flex-col md:flex-row ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [flex-basis](/docs/flex-basis)
- [flex-wrap](/docs/flex-wrap)
