# カード

ヘッダー、コンテンツ、フッターを持つカードを表示します。

## インストール

CLIを使用してインストール：

```
pnpm dlx shadcn@latest add card
```

## 使用方法

```typescript
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```jsx
<Card>
  <CardHeader>
    <CardTitle>カードタイトル</CardTitle>
    <CardDescription>カードの説明</CardDescription>
    <CardAction>カードアクション</CardAction>
  </CardHeader>
  <CardContent>
    <p>カードコンテンツ</p>
  </CardContent>
  <CardFooter>
    <p>カードフッター</p>
  </CardFooter>
</Card>
```

このコンポーネントは、様々な情報や操作を整理して表示するための柔軟なカードレイアウトを提供します。ヘッダー、コンテンツ、フッターの各セクションを自由にカスタマイズできます。
