# Drawer

## 概要
Drawerは、Reactのためのドロワーコンポーネントです。[Vaul](https://github.com/emilkowalski/vaul)ライブラリに基づいて構築されており、[@emilkowalski_](https://twitter.com/emilkowalski_)によって開発されています。

## インストール
CLIを使用してDrawerコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add drawer
```

## 使用方法
コンポーネントをインポートし、以下のように使用します：

```jsx
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## レスポンシブダイアログの例
デスクトップとモバイルで異なるコンポーネントを表示するレスポンシブな実装も可能です。サンプルコードでは、デスクトップではDialogを、モバイルではDrawerを使用しています。

## 特徴
- Vaulライブラリに基づいて構築
- レスポンシブデザイン
- カスタマイズ可能
