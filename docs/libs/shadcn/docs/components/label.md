# Label

コントロールに関連付けられたアクセシブルなラベルをレンダリングします。

[Radix UI Docs](https://www.radix-ui.com/docs/primitives/components/label) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/label#api-reference)

## プレビュー

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">利用規約に同意する</Label>
      </div>
    </div>
  )
}
```

## インストール

CLIを使用してLabelコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add label
```

## 使用方法

```tsx
import { Label } from "@/components/ui/label"
```

```tsx
<Label htmlFor="email">メールアドレス</Label>
```
