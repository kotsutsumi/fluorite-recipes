# Grid Template Columns

グリッドレイアウトの列を指定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `grid-cols-<number>` | `grid-template-columns: repeat(<number>, minmax(0, 1fr));` |
| `grid-cols-none` | `grid-template-columns: none;` |
| `grid-cols-subgrid` | `grid-template-columns: subgrid;` |
| `grid-cols-[<value>]` | `grid-template-columns: <value>;` |
| `grid-cols-(<custom-property>)` | `grid-template-columns: var(<custom-property>);` |

## 基本的な使い方

### グリッド列の指定

`grid-cols-<number>` ユーティリティを使用して、等しいサイズの列を持つグリッドを作成します。

```html
<div class="grid grid-cols-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>09</div>
</div>
```

### サブグリッドの実装

`grid-cols-subgrid` を使用して、親の列トラックを継承します。

```html
<div class="grid grid-cols-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>05</div>
  <div class="col-span-3 grid grid-cols-subgrid gap-4">
    <div class="col-start-2">06</div>
  </div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="grid grid-cols-[200px_minmax(900px,_1fr)_100px] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="grid grid-cols-(--my-grid-cols) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

ブレークポイントプレフィックスを使用してレスポンシブバリアントを適用できます。

```html
<div class="grid grid-cols-2 md:grid-cols-4 ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
