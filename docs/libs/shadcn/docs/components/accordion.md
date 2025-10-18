# アコーディオン

## 概要

アコーディオンは、垂直に積み重ねられた対話型の見出しで、それぞれがコンテンツのセクションを表示する対話型コンポーネントです。

## インストール

CLIを使用してアコーディオンをインストールします：

```
pnpm dlx shadcn@latest add accordion
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```jsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

このコンポーネントは、WAI-ARIAデザインパターンに従ったアクセシビリティを備えた対話型のアコーディオンを作成できます。
