# ボタングループ

## 概要

ボタングループは、関連するボタンを一貫したスタイルでグループ化するコンテナです。

## インストール

```
pnpm dlx shadcn@latest add button-group
```

## 使用方法

```jsx
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"

<ButtonGroup>
  <Button>ボタン 1</Button>
  <Button>ボタン 2</Button>
</ButtonGroup>
```

## アクセシビリティ

- `ButtonGroup` コンポーネントには `role` 属性が `group` に設定されています
- タブキーでグループ内のボタン間を移動できます
- `aria-label` または `aria-labelledby` を使用してボタングループにラベルを付けることができます

## ボタングループとトグルグループの違い

- `ButtonGroup`: アクションを実行するボタンをグループ化
- `ToggleGroup`: 状態を切り替えるボタンをグループ化

## 主な機能と例

- 水平・垂直方向のレイアウト
- サイズ調整
- ネストされたグループ
- セパレータの追加
- 分割ボタン
- 入力フィールドとの統合
- ドロップダウンメニューとの連携

各機能は豊富なコード例と共に詳細に説明されています。
