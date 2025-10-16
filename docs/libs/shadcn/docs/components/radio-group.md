# Radio Group

一度に1つのボタンのみを選択できるチェック可能なボタン（ラジオボタン）のセットです。

[Radix UI Docs](https://www.radix-ui.com/docs/primitives/components/radio-group) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/radio-group#api-reference)

## インストール

CLIを使用してRadio Groupコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add radio-group
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

## 例

```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">デフォルト</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">快適</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">コンパクト</Label>
      </div>
    </RadioGroup>
  )
}
```

このコンポーネントは、ユーザーが複数のオプションから1つだけ選択できるようにするラジオボタングループを作成します。`defaultValue`プロパティを使用して、デフォルトで選択されるオプションを指定できます。
