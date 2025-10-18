# タブ

コンテンツの複数のレイヤーセクション（タブパネルと呼ばれる）を一度に1つずつ表示するセットです。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/tabs) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/tabs#api-reference)

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add tabs
```

</TabsContent>

</Tabs>

## 使用方法

```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

```jsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">アカウント</TabsTrigger>
    <TabsTrigger value="password">パスワード</TabsTrigger>
  </TabsList>
  <TabsContent value="account">アカウントを変更します。</TabsContent>
  <TabsContent value="password">パスワードを変更します。</TabsContent>
</Tabs>
```

## 例

```jsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="password">パスワード</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>アカウント</CardTitle>
            <CardDescription>
              ここでアカウントの変更を行います。完了したら保存をクリックしてください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">名前</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>変更を保存</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>パスワード</CardTitle>
            <CardDescription>
              ここでパスワードを変更します。保存後、ログアウトされます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">現在のパスワード</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">新しいパスワード</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>パスワードを保存</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

このコンポーネントは、ユーザーが異なるコンテンツセクション間を簡単に切り替えることができる対話型のインターフェースを提供します。
