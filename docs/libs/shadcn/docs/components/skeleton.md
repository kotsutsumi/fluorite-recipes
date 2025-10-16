# スケルトン

コンテンツの読み込み中にプレースホルダーを表示するために使用します。

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add skeleton
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Skeleton } from "@/components/ui/skeleton"
```

```jsx
<Skeleton className="h-[20px] w-[100px] rounded-full" />
```

## 例

### カード

```jsx
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

この例では、コンテンツの読み込み中に、カードの形状と同じスケルトンローディングUIを表示します。スケルトンコンポーネントは、幅、高さ、角の丸みなどをCSSクラスでカスタマイズできます。
