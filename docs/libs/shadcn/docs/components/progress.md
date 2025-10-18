# Progress

タスクの完了進捗を示すインジケーター（通常はプログレスバーとして表示）を表示します。

[Radix UI Docs](https://www.radix-ui.com/docs/primitives/components/progress) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/progress#api-reference)

## インストール

CLIを使用してProgressコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add progress
```

## 使用方法

コンポーネントをインポートして使用します：

```tsx
import { Progress } from "@/components/ui/progress"
```

基本的な使用例：

```tsx
<Progress value={33} />
```

## 例

```tsx
"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}
```

このコンポーネントは、タスクの進捗状況を視覚的に表現するために使用できます。プログレスバーは0から100の値を受け取り、その割合に応じて進捗を表示します。
