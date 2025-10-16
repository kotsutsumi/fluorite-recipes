# データテーブル

## 紹介

データテーブルは、TanStack Tableを使用して構築された強力なテーブルとデータグリッドです。

## インストール

1. テーブルコンポーネントをプロジェクトに追加：

```
pnpm dlx shadcn@latest add table
```

2. TanStack Table依存関係を追加：

```
pnpm add @tanstack/react-table
```

## 前提条件

支払い情報を表示するテーブルを構築します。データの形は次のようになります：

```typescript
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
```

## プロジェクト構造

以下のファイル構造を作成します：

```
app/payments/
├── columns.tsx
├── data-table.tsx
└── page.tsx
```

## 基本的なテーブル

### カラム定義

まず、カラムを定義します：

```typescript
"use client"
import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```

このドキュメントは、データテーブルの作成方法について詳細なガイドを提供しており、ソート、フィルタリング、ページネーション、行選択などの高度な機能の実装方法を説明しています。
