# コンテキストメニュー

## 概要

コンテキストメニューは、ユーザーにアクションや機能のセットを表示するメニューです。ボタンによってトリガーされます。

## インストール

CLIを使用してコンテキストメニューをインストールします：

```
pnpm dlx shadcn@latest add context-menu
```

## 使用方法

コンポーネントをインポートします：

```typescript
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
```

基本的な使用例：

```tsx
<ContextMenu>
  <ContextMenuTrigger>右クリック</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>プロフィール</ContextMenuItem>
    <ContextMenuItem>請求</ContextMenuItem>
    <ContextMenuItem>チーム</ContextMenuItem>
    <ContextMenuItem>サブスクリプション</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

このコンポーネントは、Radix UIのプリミティブを使用して構築されており、アクセシビリティと柔軟性を提供します。
