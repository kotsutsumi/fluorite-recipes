# Display

## 概要

Tailwind CSSのdisplayユーティリティは、要素のdisplayボックスタイプを制御し、レイアウトと要素の動作にさまざまなオプションを提供します。

## 利用可能なクラス

### 基本的なDisplayタイプ

- `inline`：`display: inline;`
- `block`：`display: block;`
- `inline-block`：`display: inline-block;`
- `flow-root`：`display: flow-root;`

### FlexboxとGrid

- `flex`：`display: flex;`
- `inline-flex`：`display: inline-flex;`
- `grid`：`display: grid;`
- `inline-grid`：`display: inline-grid;`

### 特殊タイプ

- `contents`：`display: contents;`
- `hidden`：`display: none;`
- `sr-only`：スクリーンリーダー専用の要素を作成
- `list-item`：`display: list-item;`

### テーブル関連

`table`、`table-row`、`table-cell`などの複数のテーブル固有のdisplayタイプ

## 主な例

### BlockとInlineの動作

- **Inline**：テキストが通常どおりに折り返されます
- **Inline-block**：テキストが親要素を超えて拡張されるのを防ぎます
- **Block**：要素を独自の行に配置し、親要素を埋めます

### FlexとGrid

レスポンシブレイアウトでflexとgridコンテナを作成する方法を示します

### スクリーンリーダーユーティリティ

- `sr-only`：視覚的に要素を非表示にしますが、スクリーンリーダーにはアクセス可能なままにします
- `not-sr-only`：スクリーンリーダー専用のスタイリングを元に戻します

## レスポンシブデザイン

`md:flex`のようなブレークポイントプレフィックスを使用して、特定の画面サイズでdisplayユーティリティを適用できます。

このドキュメントは、各displayタイプの詳細なコード例を提供し、さまざまなレイアウトシナリオでこれらのユーティリティを効果的に使用する方法を示しています。
