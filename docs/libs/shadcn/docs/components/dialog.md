# ダイアログ

## 概要
ダイアログは、プライマリウィンドウまたは別のダイアログウィンドウに重ねて表示され、背後のコンテンツを非アクティブにするウィンドウです。

## インストール

CLIを使用してインストール：

```
pnpm dlx shadcn@latest add dialog
```

## 使用方法

```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>開く</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>本当に実行しますか？</DialogTitle>
      <DialogDescription>
        この操作は取り消せません。アカウントを完全に削除し、
        サーバーからデータを削除します。
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## 例：カスタムクローズボタン

コンポーネントには、共有リンクなどを表示するカスタムクローズボタンの例も含まれています。

## 注意点

コンテキストメニューまたはドロップダウンメニュー内でダイアログを使用する場合、それらのコンポーネントをDialogコンポーネント内に配置する必要があります。
