# Tooltip

要素にマウスホバーまたはキーボードフォーカスがあたった際に、関連する情報を表示するポップアップコンポーネントです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/tooltip) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add tooltip
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

```jsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>
      <p>ライブラリに追加</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## 例

```jsx
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>ライブラリに追加</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

## 更新履歴

### 2025-09-22 Tooltipの色を更新

Tooltipの色を更新し、背景色と前景色を入れ替えました。

`bg-primary text-primary-foreground` を `bg-foreground text-background` に置き換えてください。
