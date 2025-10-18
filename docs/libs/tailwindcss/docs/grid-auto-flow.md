# Grid Auto Flow

グリッド内の要素が自動配置される方法を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `grid-flow-row` | `grid-auto-flow: row;` |
| `grid-flow-col` | `grid-auto-flow: column;` |
| `grid-flow-dense` | `grid-auto-flow: dense;` |
| `grid-flow-row-dense` | `grid-auto-flow: row dense;` |
| `grid-flow-col-dense` | `grid-auto-flow: column dense;` |

## 基本的な使い方

### 基本例

`grid-flow-col` や `grid-flow-row-dense` などのユーティリティを使用して、グリッドレイアウトの自動配置アルゴリズムの動作を制御します。

```html
<div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
  <div class="col-span-2">01</div>
  <div class="col-span-2">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="grid grid-flow-col md:grid-flow-row ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [grid-row](/docs/grid-row)
- [grid-auto-columns](/docs/grid-auto-columns)
