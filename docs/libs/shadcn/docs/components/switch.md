# スイッチ

ユーザーがオンとオフを切り替えることができるコントロールコンポーネントです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/switch) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/switch#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add switch
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Switch } from "@/components/ui/switch"
```

```jsx
<Switch />
```

## 例

```jsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">機内モード</Label>
    </div>
  )
}
```

このコンポーネントは、ラベル付きのスイッチを作成し、機内モードの切り替えなどに使用できます。

## フォームとの統合

```jsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
})

export function SwitchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketing_emails: false,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      マーケティングメール
                    </FormLabel>
                    <FormDescription>
                      製品、機能、その他についてのメールを受け取ります。
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">送信</Button>
      </form>
    </Form>
  )
}
```
