# Pagination

ページネーションは、コンテンツを複数のページに分割し、ユーザーがページ間を移動できるようにするコンポーネントです。

## インストール

CLIを使用してページネーションコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add pagination
```

## 使用方法

必要なコンポーネントをインポートします：

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

ページネーションコンポーネントの基本的な使用例：

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Next.jsでの使用

デフォルトでは、`<PaginationLink />`コンポーネントは`<a />`タグをレンダリングします。

Next.jsの`<Link />`コンポーネントを使用する場合は、`asChild`プロパティを使用できます：

```tsx
import Link from "next/link"
import {
  PaginationLink,
} from "@/components/ui/pagination"

<PaginationLink asChild>
  <Link href="/page/1">1</Link>
</PaginationLink>
```
