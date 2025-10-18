# スカラーリスト/配列の操作

スカラーリストは、データベースがサポートする場合に`[]`修飾子で表現されます。

## 概要

- モデル例: `model User { pets String[] }`
- 値例: `['Fido', 'Snoopy', 'Brian']`
- スカラーリストをサポートするデータベースでのみ利用可能

## スカラーリスト値の設定

```typescript
const createdUser = await prisma.user.create({
  data: {
    email: 'eloise@prisma.io',
    coinflips: [true, true, true, false, true],
  },
})
```

## スカラーリスト値の設定解除（MongoDBのみ、v3.11.1以降）

```typescript
const createdUser = await prisma.user.create({
  data: {
    email: 'eloise@prisma.io',
    coinflips: {
      unset: true,
    },
  },
})
```

## スカラーリストへのアイテム追加

PostgreSQL、CockroachDB、MongoDBでサポート:

```typescript
const userUpdate = await prisma.user.update({
  where: { id: 9 },
  data: {
    coinflips: {
      push: true,
    },
  },
})
```

## スカラーリストのフィルタリング

```typescript
const posts = await prisma.post.findMany({
  where: {
    tags: {
      hasEvery: ['databases', 'typescript'],
    },
  },
})
```

### フィルタオプション

- `hasEvery`: すべての値を含む
- `hasSome`: いくつかの値を含む
- `isEmpty`: 空の配列
- `equals`: 正確に一致

## 重要な考慮事項

- 配列内の`NULL`値は特定のフィルタ条件で考慮されません
- フィルタリング問題を避けるために、デフォルト配列値を`[]`に設定することを推奨
- 機能の可用性はデータベースとPrismaバージョンに依存

ドキュメントは、異なるデータベースタイプとPrismaバージョン間でスカラーリストを操作するための詳細なガイダンスを提供します。
