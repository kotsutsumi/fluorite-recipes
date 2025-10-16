# スクロールエリア

ネイティブのスクロール機能をカスタマイズし、クロスブラウザでスタイリングを拡張します。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/scroll-area) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add scroll-area
```

</TabsContent>

</Tabs>

## 使用方法

```typescript
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  ジョークスターは夜中に城に忍び込み、至る所にジョークを残し始めました：王の枕の下、スープの中、さらには王室のトイレにまで。王は激怒しましたが、ジョークスターを止めることができませんでした。そして、ある日、王国の人々はジョークスターが残したジョークがとても面白いことに気づき、笑いが止まらなくなったのです。
</ScrollArea>
```

## 例

### 水平スクロール

```typescript
import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {/* コンテンツ */}
      </div>
    </ScrollArea>
  )
}
```
