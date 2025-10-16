# テーブル

レスポンシブなテーブルコンポーネントです。

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add table
```

</TabsContent>

</Tabs>

## 使用方法

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```jsx
<Table>
  <TableCaption>最近の請求書のリスト</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">請求書</TableHead>
      <TableHead>状態</TableHead>
      <TableHead>方法</TableHead>
      <TableHead className="text-right">金額</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>支払済</TableCell>
      <TableCell>クレジットカード</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 例

### 基本的なテーブル

```jsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "支払済",
    totalAmount: "$250.00",
    paymentMethod: "クレジットカード",
  },
  {
    invoice: "INV002",
    paymentStatus: "保留中",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "未払い",
    totalAmount: "$350.00",
    paymentMethod: "銀行振込",
  },
  {
    invoice: "INV004",
    paymentStatus: "支払済",
    totalAmount: "$450.00",
    paymentMethod: "クレジットカード",
  },
  {
    invoice: "INV005",
    paymentStatus: "支払済",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "保留中",
    totalAmount: "$200.00",
    paymentMethod: "銀行振込",
  },
  {
    invoice: "INV007",
    paymentStatus: "未払い",
    totalAmount: "$300.00",
    paymentMethod: "クレジットカード",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>最近の請求書のリスト</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">請求書</TableHead>
          <TableHead>状態</TableHead>
          <TableHead>方法</TableHead>
          <TableHead className="text-right">金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## データテーブル

より高度なデータテーブルの実装については、[データテーブル](/docs/components/data-table)のドキュメントを参照してください。ソート、フィルタリング、ページネーションなどの機能が含まれています。
