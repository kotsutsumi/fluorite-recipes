# Menubar

メニューバーは、デスクトップアプリケーションでよく見られる、一貫したコマンドセットに素早くアクセスできる視覚的に永続的なメニューです。

## インストール

CLIを使用してメニューバーコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add menubar
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

このコンポーネントは、ファイル、編集、表示、プロファイルなど、さまざまなメニューオプションを含む柔軟な構造を提供します。キーボードショートカットや、サブメニュー、チェックボックスアイテム、ラジオグループなどの高度な機能もサポートしています。
