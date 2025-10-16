# Navigation Menu

ウェブサイトのナビゲーションに使用するリンクのコレクション。

[Radix UI Docs](https://www.radix-ui.com/docs/primitives/components/navigation-menu) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/navigation-menu#api-reference)

## インストール

CLIを使用してナビゲーションメニューコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add navigation-menu
```

## 使用方法

必要なコンポーネントをインポートし、以下のように使用します：

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>項目1</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>リンク</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## リンク

`asChild`プロパティを使用して、別のコンポーネントをナビゲーションメニュートリガーのように見せることができます。

```tsx
import Link from "next/link"

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href="/docs">ドキュメント</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
```
