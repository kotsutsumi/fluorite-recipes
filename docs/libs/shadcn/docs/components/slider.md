# スライダー

ユーザーが指定された範囲内から値を選択できる入力コンポーネントです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/slider) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/slider#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add slider
```

</TabsContent>

</Tabs>

## 使用方法

```typescript
import { Slider } from "@/components/ui/slider"
```

```jsx
<Slider defaultValue={[33]} max={100} step={1} />
```

## 例

```typescript
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export function SliderDemo({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn("w-[60%]", className)}
      {...props}
    />
  )
}
```

このコンポーネントは、デフォルト値50、最大値100、ステップ1の設定で、幅60%のスライダーを作成します。
