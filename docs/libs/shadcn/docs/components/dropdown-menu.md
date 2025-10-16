# ドロップダウンメニュー

## 概要
ドロップダウンメニューは、ボタンによってトリガーされる、ユーザーへのアクションや機能のセットを表示するメニューコンポーネントです。

## インストール
CLIを使用してインストールします：

```
pnpm dlx shadcn@latest add dropdown-menu
```

## 使用方法
コンポーネントをインポートし、基本的な構造を作成します：

```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 例

### チェックボックス
チェックボックス付きのドロップダウンメニューの例を提供しています。

### ラジオグループ
ラジオボタンを使用したドロップダウンメニューの例を示しています。

### ダイアログ
ドロップダウンメニューからダイアログを開く方法を説明しています。`modal={false}`プロパティを使用します。

## 注意点
- コンポーネントは完全にアクセシビリティに対応
- キーボードナビゲーションをサポート
- カスタマイズ可能なスタイリング
