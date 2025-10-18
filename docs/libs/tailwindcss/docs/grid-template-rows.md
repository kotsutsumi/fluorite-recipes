# Grid Template Rows

グリッドレイアウトの行を指定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `grid-rows-<number>` | `grid-template-rows: repeat(<number>, minmax(0, 1fr));` |
| `grid-rows-none` | `grid-template-rows: none;` |
| `grid-rows-subgrid` | `grid-template-rows: subgrid;` |
| `grid-rows-[<value>]` | `grid-template-rows: <value>;` |
| `grid-rows-(<custom-property>)` | `grid-template-rows: var(<custom-property>);` |

## 基本的な使い方

### グリッド行の指定

`grid-rows-<number>` ユーティリティ（`grid-rows-2` や `grid-rows-4` など）を使用して、n個の等しいサイズの行を持つグリッドを作成します。

```html
<div class="grid grid-flow-col grid-rows-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>09</div>
</div>
```

### サブグリッドの実装

`grid-rows-subgrid` ユーティリティを使用して、アイテムの親によって定義された行トラックを継承します。

```html
<div class="grid grid-flow-col grid-rows-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>05</div>
  <div class="row-span-3 grid grid-rows-subgrid gap-4">
    <div class="row-start-2">06</div>
  </div>
  <div>07</div>
  <!-- ... -->
  <div>10</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="grid grid-rows-[200px_minmax(900px,1fr)_100px] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="grid grid-rows-(--my-grid-rows) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

ブレークポイントプレフィックスを使用してレスポンシブバリアントを適用できます。

```html
<div class="grid grid-rows-2 md:grid-rows-4 ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
