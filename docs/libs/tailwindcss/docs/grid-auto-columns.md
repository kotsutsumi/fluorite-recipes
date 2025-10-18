# Grid Auto Columns

暗黙的に作成されるグリッド列のサイズを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `auto-cols-auto` | `grid-auto-columns: auto;` |
| `auto-cols-min` | `grid-auto-columns: min-content;` |
| `auto-cols-max` | `grid-auto-columns: max-content;` |
| `auto-cols-fr` | `grid-auto-columns: minmax(0, 1fr);` |
| `auto-cols-(<custom-property>)` | `grid-auto-columns: var(<custom-property>);` |
| `auto-cols-[<value>]` | `grid-auto-columns: <value>;` |

## 基本的な使い方

### 基本例

`auto-cols-min` や `auto-cols-max` などのユーティリティを使用して、暗黙的に作成されるグリッド列のサイズを制御します。

```html
<div class="grid auto-cols-max grid-flow-col">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="auto-cols-[minmax(0,2fr)] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="auto-cols-(--my-auto-cols) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="grid grid-flow-col auto-cols-max md:auto-cols-min ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [grid-auto-flow](/docs/grid-auto-flow)
- [grid-auto-rows](/docs/grid-auto-rows)
