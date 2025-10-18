# アラートダイアログ

ユーザーに重要なコンテンツを割り込ませ、応答を期待するモーダルダイアログ。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/alert-dialog) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/alert-dialog#api-reference)

## プレビュー

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に実行しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。アカウントを完全に削除し、サーバーからデータを削除します。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction>続行</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## インストール

CLIを使用してアラートダイアログをインストールします：

```
pnpm dlx shadcn@latest add alert-dialog
```
