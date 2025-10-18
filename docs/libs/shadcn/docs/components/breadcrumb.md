# パンくずリスト

## 概要

パンくずリストは、現在のリソースへのパスを階層的なリンクで表示するコンポーネントです。

## インストール

CLIを使用してパンくずリストコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add breadcrumb
```

## 使用方法

以下のようにインポートして使用します：

```jsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

基本的な使用例：

```jsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## 高度な例

### カスタムセパレーター

スラッシュアイコンなどのカスタムセパレーターを使用できます。

### ドロップダウン

パンくずリストにドロップダウンメニューを追加できます。

### 省略表示

長いパンくずリストを省略記号で表示できます。

### レスポンシブ対応

デスクトップではドロップダウン、モバイルではドロワーとして表示できます。
