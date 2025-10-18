# フォーム

## 特徴

フォーム コンポーネントは、`react-hook-form` ライブラリのラッパーです。以下の機能を提供します：

- フォームを構築するための構成可能なコンポーネント
- `<FormField>` コンポーネントによる制御されたフォームフィールドの構築
- `zod` を使用したフォームバリデーション
- アクセシビリティとエラーメッセージの処理
- 一意のIDを生成するための `React.useId()` の使用
- フォームフィールドの状態に基づく適切な `aria` 属性の適用
- すべての Radix UI コンポーネントと連携
- スキーマライブラリは自由に選択可能（デフォルトは `zod`）
- **マークアップとスタイリングを完全にコントロール**

## 解剖学

```jsx
<Form>
  <FormField
    control={...}
    name="..."
    render={() => (
      <FormItem>
        <FormLabel />
        <FormControl>
          { /* Your form field */}
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

## 例

```jsx
const form = useForm()
  <FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="shadcn" {...field} />
      </FormControl>
      <FormDescription>This is your public display name.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## インストール

```
pnpm dlx shadcn@latest add form
```

## 使用方法

```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
```

## 注意事項

このコンポーネントは、React Hook Formとzodを使用したフォームバリデーションをサポートしています。詳細については、公式ドキュメントを参照してください。
