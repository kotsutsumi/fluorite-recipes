# アイテム

## 概要

`Item`コンポーネントは、任意のコンテンツを表示するための多用途のコンポーネントです。メディア、タイトル、説明、アクションを含むフレキシブルなコンテナとして機能します。

## インストール

CLIを使用してコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add item
```

## 使用方法

```jsx
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

<Item>
  <ItemContent>
    <ItemTitle>アイテム</ItemTitle>
    <ItemDescription>アイテムの説明</ItemDescription>
  </ItemContent>
  <ItemActions />
</Item>
```

## Item vs Field

- `Field`：フォーム入力（チェックボックス、入力、ラジオ、選択）を表示する場合に使用
- `Item`：タイトル、説明、アクションなどのコンテンツを表示する場合に使用

## 主な機能

### バリアント
- デフォルト
- アウトライン
- ミュート

### サイズ
- デフォルト
- 小（sm）

### 拡張機能
- アイコン
- アバター
- 画像
- リンク
- ドロップダウン

## APIリファレンス

各サブコンポーネント（`ItemMedia`、`ItemContent`、`ItemTitle`など）は、柔軟なカスタマイズを提供します。

## 注意事項

このコンポーネントは、リストやカード、メニューアイテムなど、さまざまなUIパターンに適応できる汎用的なコンテナです。
