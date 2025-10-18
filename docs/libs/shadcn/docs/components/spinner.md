# スピナー

ローディング状態を示すスピナーコンポーネントです。

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add spinner
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Spinner } from "@/components/ui/spinner"
```

```jsx
<Spinner />
```

## カスタマイズ

デフォルトのスピナーアイコンを別のアイコンに置き換えることができます。

## 例

### サイズ

`size-*` ユーティリティクラスを使用してスピナーのサイズを変更できます。

```jsx
<Spinner className="size-4" />
<Spinner className="size-6" />
<Spinner className="size-8" />
```

### 色

`text-` ユーティリティクラスを使用してスピナーの色を変更できます。

```jsx
<Spinner className="text-primary" />
<Spinner className="text-muted-foreground" />
<Spinner className="text-destructive" />
```

### ボタン

ローディング状態を示すためにボタンにスピナーを追加できます。

```jsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

<Button disabled>
  <Spinner className="mr-2 size-4" />
  読み込み中...
</Button>
```

### バッジ

バッジ内でスピナーを使用できます。

```jsx
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

<Badge>
  <Spinner className="mr-2 size-3" />
  処理中
</Badge>
```

### 空の状態

リクエスト処理中の空の状態を表示できます。

```jsx
import { Spinner } from "@/components/ui/spinner"

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Spinner className="size-12" />
      <p className="text-muted-foreground">データを読み込み中...</p>
    </div>
  )
}
```

## APIリファレンス

### スピナー

| プロパティ | 型 | デフォルト |
| --- | --- | --- |
| `className` | `string` | `` |
