# セパレーター

コンテンツを視覚的または意味的に分離するコンポーネントです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/separator) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/separator#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add separator
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Separator } from "@/components/ui/separator"
```

```jsx
<Separator />
```

## 例

```jsx
import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          オープンソースのUIコンポーネントライブラリ。
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

このコンポーネントは、水平または垂直の向きで配置可能で、コンテンツを分割するために使用できます。
