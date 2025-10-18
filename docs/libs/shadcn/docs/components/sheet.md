# シート (Sheet)

画面の主要コンテンツを補完するコンテンツを表示するために、ダイアログコンポーネントを拡張したものです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/dialog) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add sheet
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```jsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        この操作は取り消せません。アカウントを完全に削除し、サーバーからデータを削除します。
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## 例

### サイド

`side` プロパティを使用して、シートが表示される画面の端を指定できます。値は `top`、`right`、`bottom`、`left` のいずれかです。

```jsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="top">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        この操作は取り消せません。アカウントを完全に削除し、サーバーからデータを削除します。
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

### サイズ

CSSクラスを使用してシートのサイズを調整できます：

```jsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        この操作は取り消せません。アカウントを完全に削除し、サーバーからデータを削除します。
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

または、最大幅を設定することもできます：

```jsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent className="sm:max-w-[425px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        この操作は取り消せません。アカウントを完全に削除し、サーバーからデータを削除します。
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
