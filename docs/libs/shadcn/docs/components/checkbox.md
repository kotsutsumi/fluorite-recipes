# チェックボックス

チェックボックスは、ユーザーがオンとオフを切り替えることができるコントロールです。

## プレビュー

### 利用例

1. 利用規約の同意
   - チェックボックスをクリックすることで、利用規約に同意します。

2. 通知の有効化
   - いつでも通知を有効または無効にできます。

## インストール

CLIを使用してチェックボックスコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add checkbox
```

## 使用方法

コンポーネントをインポートして使用します：

```jsx
import { Checkbox } from "@/components/ui/checkbox"
```

基本的な使用例：

```jsx
<Checkbox />
```

## コード例

```jsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* チェックボックスの様々な状態を示す例 */}
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">利用規約に同意</Label>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">利用規約に同意</Label>
          <p className="text-muted-foreground text-sm">
            このチェックボックスをクリックすることで、利用規約に同意します。
          </p>
        </div>
      </div>
    </div>
  )
}
```
