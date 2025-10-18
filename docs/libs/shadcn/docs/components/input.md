# 入力コンポーネント

## 概要

フォーム入力フィールドまたは入力フィールドのように見えるコンポーネントを表示します。

## インストール

CLIを使用してインストールします：

```
pnpm dlx shadcn@latest add input
```

## 使用方法

```jsx
import { Input } from "@/components/ui/input"
```

```jsx
<Input />
```

## 例

### デフォルト

```jsx
import { Input } from "@/components/ui/input"

export function InputDemo() {
  return <Input type="email" placeholder="Email" />
}
```

### ファイル

```jsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  )
}
```

### 無効化

```jsx
import { Input } from "@/components/ui/input"

export function InputDisabled() {
  return <Input disabled type="email" placeholder="Email" />
}
```

### ラベル付き

```jsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputWithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>
  )
}
```

## プロパティ

Inputコンポーネントは、標準のHTML inputエレメントのすべてのプロパティをサポートしています。
