# Empty

## 概要

空の状態を表示するには、Emptyコンポーネントを使用します。

## プレビュー

プロジェクトがまだありません

まだプロジェクトを作成していません。最初のプロジェクトを作成して始めましょう。

プロジェクトを作成／インポートプロジェクト

## インストール

CLIを使用してインストールします：

```
pnpm dlx shadcn@latest add empty
```

## 使用方法

```typescript
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```typescript
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
    <EmptyTitle>データなし</EmptyTitle>
    <EmptyDescription>データが見つかりません</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>データを追加</Button>
  </EmptyContent>
</Empty>
```

## 例

### アウトライン

`border`ユーティリティクラスを使用して、アウトラインの空の状態を作成します。

### 背景

`bg-*`と`bg-gradient-*`ユーティリティを使用して、空の状態に背景を追加します。

### アバター

`EmptyMedia`コンポーネントを使用して、空の状態にアバターを表示します。

### アバターグループ

`EmptyMedia`コンポーネントを使用して、空の状態にアバターグループを表示します。
