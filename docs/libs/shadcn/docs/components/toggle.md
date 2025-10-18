# トグル

2つの状態（オンまたはオフ）を持つボタン。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/toggle) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/toggle#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add toggle
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Toggle } from "@/components/ui/toggle"
```

```jsx
<Toggle>トグル</Toggle>
```

## 例

### デフォルト

```jsx
import { Bold } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle aria-label="太字を切り替え">
      <Bold className="h-4 w-4" />
    </Toggle>
  )
}
```

### アウトライン

```jsx
import { Italic } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="斜体を切り替え">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
```

### テキスト付き

```jsx
import { Italic } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleWithText() {
  return (
    <Toggle aria-label="斜体を切り替え">
      <Italic className="mr-2 h-4 w-4" />
      斜体
    </Toggle>
  )
}
```

### 小サイズ

```jsx
import { Italic } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="斜体を切り替え">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
```

### 大サイズ

```jsx
import { Italic } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleLg() {
  return (
    <Toggle size="lg" aria-label="斜体を切り替え">
      <Italic className="h-4 w-4" />
    </Toggle>
  )
}
```

### 無効化

```jsx
import { Underline } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleDisabled() {
  return (
    <Toggle aria-label="下線を切り替え" disabled>
      <Underline className="h-4 w-4" />
    </Toggle>
  )
}
```
