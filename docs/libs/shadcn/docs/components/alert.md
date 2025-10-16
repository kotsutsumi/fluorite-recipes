# Alert

ユーザーの注意を引くために使用されるコールアウトを表示します。

## プレビュー

成功！変更が保存されました

このアイコン、タイトル、説明付きのアラートです。

このアラートにはタイトルとアイコンがあります。説明はありません。

支払いを処理できませんでした。

請求情報を確認し、再度お試しください。

- カード詳細を確認
- 十分な資金があることを確認
- 請求先住所を確認

## インストール

CLIを使用してアラートコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add alert
```

## 使用方法

```jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert variant="default | destructive">
  <Terminal />
  <AlertTitle>注意！</AlertTitle>
  <AlertDescription>
    CLIを使用してコンポーネントと依存関係をアプリに追加できます。
  </AlertDescription>
</Alert>
```
