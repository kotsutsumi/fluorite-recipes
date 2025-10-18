# Textarea

フォームのテキストエリアまたはテキストエリアのように見えるコンポーネントを表示します。

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add textarea
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Textarea } from "@/components/ui/textarea"
```

```jsx
<Textarea />
```

## 例

### デフォルト

```tsx
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return <Textarea placeholder="メッセージを入力してください。" />
}
```

### 無効化

```tsx
import { Textarea } from "@/components/ui/textarea"

export function TextareaDisabled() {
  return <Textarea placeholder="メッセージを入力してください。" disabled />
}
```

### ラベル付き

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message">メッセージ</Label>
      <Textarea placeholder="メッセージを入力してください。" id="message" />
    </div>
  )
}
```

### テキスト付き

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithText() {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message-2">メッセージ</Label>
      <Textarea placeholder="メッセージを入力してください。" id="message-2" />
      <p className="text-sm text-muted-foreground">
        メッセージはダッシュボードで確認できます。
      </p>
    </div>
  )
}
```

### ボタン付き

```tsx
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithButton() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="message-3">メッセージ</Label>
      <Textarea placeholder="メッセージを入力してください。" id="message-3" />
      <Button className="w-fit">送信</Button>
    </div>
  )
}
```

## フォームとの統合

```tsx
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
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "自己紹介は最低10文字必要です。",
    })
    .max(160, {
      message: "自己紹介は160文字以下にしてください。",
    }),
})

export function TextareaForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "以下の値を送信しました:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>自己紹介</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="自己紹介を教えてください"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                プロフィールに表示される簡単な自己紹介を追加できます。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">送信</Button>
      </form>
    </Form>
  )
}
```
