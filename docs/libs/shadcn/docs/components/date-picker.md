# Date Picker

## インストール

Date Pickerは、`<Popover />`と`<Calendar />`コンポーネントを組み合わせて構築されています。

[Popover](/docs/components/popover#installation)と[Calendar](/docs/components/calendar#installation)のインストール手順を参照してください。

## 使用方法

以下は、基本的なDate Pickerの実装例です：

```tsx
"use client"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>日付を選択</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}
```

## 例

### 生年月日ピッカー

生年月日を選択するためのDate Pickerの例を提供しています。

### 入力付きピッカー

入力フィールドと組み合わせたDate Pickerの例を示しています。

### 日付と時間ピッカー

日付と時間を選択できるコンポーネントの実装例を提供しています。
