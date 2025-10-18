# Grid Auto Rows

暗黙的に作成されるグリッド行のサイズを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `auto-rows-auto` | `grid-auto-rows: auto;` |
| `auto-rows-min` | `grid-auto-rows: min-content;` |
| `auto-rows-max` | `grid-auto-rows: max-content;` |
| `auto-rows-fr` | `grid-auto-rows: minmax(0, 1fr);` |
| `auto-rows-(<custom-property>)` | `grid-auto-rows: var(<custom-property>);` |
| `auto-rows-[<value>]` | `grid-auto-rows: <value>;` |

## 基本的な使い方

### 基本例

`auto-rows-min` や `auto-rows-max` などのユーティリティを使用して、暗黙的に作成されるグリッド行のサイズを制御します。

```html
<div class="grid grid-flow-row auto-rows-max">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="auto-rows-[minmax(0,2fr)] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="auto-rows-(--my-auto-rows) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="grid grid-flow-row auto-rows-max md:auto-rows-min ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [grid-auto-flow](/docs/grid-auto-flow)
- [grid-auto-columns](/docs/grid-auto-columns)
