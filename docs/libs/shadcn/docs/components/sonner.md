# Sonner

React 用の独自の Toast コンポーネントです。

[emilkowalski_](https://twitter.com/emilkowalski_) によって構築および管理されています。

[ドキュメント](https://sonner.emilkowal.ski/)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add sonner
```

</TabsContent>

</Tabs>

## 使用方法

### Toaster コンポーネントを追加

```typescript
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

### Toastを表示

```typescript
import { toast } from "sonner"

toast("イベントが作成されました。")
```

## 例

### デフォルト

```typescript
import { toast } from "sonner"

toast("イベントが作成されました。")
```

### 説明付き

```typescript
import { toast } from "sonner"

toast("イベントが作成されました。", {
  description: "月曜日、2024年1月3日 午後4:30",
})
```

### 成功

```typescript
import { toast } from "sonner"

toast.success("イベントが作成されました。")
```

### 情報

```typescript
import { toast } from "sonner"

toast.info("準備してください")
```

### 警告

```typescript
import { toast } from "sonner"

toast.warning("イベントには200文字の制限があります。")
```

### エラー

```typescript
import { toast } from "sonner"

toast.error("イベントが作成されませんでした。")
```

### アクション

```typescript
import { toast } from "sonner"

toast("イベントが作成されました。", {
  action: {
    label: "元に戻す",
    onClick: () => console.log("元に戻す"),
  },
})
```

### Promise

```typescript
import { toast } from "sonner"

toast.promise(() => new Promise((resolve) => setTimeout(resolve, 2000)), {
  loading: "読み込み中...",
  success: "データが読み込まれました",
  error: "エラー",
})
```

## 更新履歴

### 2025-10-13 アイコン

Sonner コンポーネントを `lucide-react` のアイコンを使用するように更新しました。`sonner.tsx` ファイルを新しいアイコンを使用するように更新してください。
