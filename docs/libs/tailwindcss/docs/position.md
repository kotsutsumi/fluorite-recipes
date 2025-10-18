# Position

## クイックリファレンス

- `static`：`position: static;`
- `fixed`：`position: fixed;`
- `absolute`：`position: absolute;`
- `relative`：`position: relative;`
- `sticky`：`position: sticky;`

## 主要概念

### Static Positioning（静的配置）

- デフォルトのドキュメントフロー配置
- オフセットは無視されます
- 子要素の参照として機能しません

### Relative Positioning（相対配置）

- 通常のドキュメントフローに従って配置
- 要素の通常位置を基準にオフセットを計算
- 絶対配置された子要素の参照として機能

### Absolute Positioning（絶対配置）

- 通常のドキュメントフローから削除
- 最も近い非staticの親要素を基準に配置
- 隣接する要素は、この要素が存在しないかのように動作

### Fixed Positioning（固定配置）

- ブラウザウィンドウを基準に配置
- スクロール時も同じ場所に留まります
- 絶対配置された子要素の参照として機能

### Sticky Positioning（スティッキー配置）

- 指定されたしきい値を超えるまで`relative`のように動作
- その後`fixed`のように動作
- 親要素が画面外になるまで配置を維持

## レスポンシブデザイン

`md:absolute`のようなブレークポイントバリアントを使用して、特定の画面サイズで適用できます。

例：

```html
<div class="relative md:absolute ...">
  <!-- 中サイズ画面で配置が変更されます -->
</div>
```

このドキュメントは、各配置ユーティリティがさまざまなコンテキストでどのように機能するかについて、詳細な説明と視覚的な例を提供しています。
