# キャッシュAPI

## 概要

このドキュメントは、サンプルの`User`モデルスキーマに基づいた、Prisma PostgresキャッシングのAPIリファレンスを提供します:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String  @unique
}
```

## `cacheStrategy`

Prisma PostgresのPrismaクライアント拡張機能を使用すると、`ttl`および`swr`パラメータを持つモデルクエリに`cacheStrategy`を使用できます。

### オプション

| オプション | 例 | 型 | 必須 | 説明 |
|--------|---------|------|----------|-------------|
| `swr` | `60` | `Int` | いいえ | Stale-while-revalidate時間（秒） |
| `ttl` | `60` | `Int` | いいえ | Time-to-live時間（秒） |
| `tags` | `["user"]` | `String[]` | いいえ | キャッシュ無効化タグ |

### 例

```typescript
await prisma.user.findMany({
  where: {
    email: {
      contains: "alice@prisma.io",
    },
  },
  cacheStrategy: {
    swr: 60,
    ttl: 60,
    tags: ["emails_with_alice"],
  },
});
```

### サポートされる操作

サポートされる読み取りクエリ操作には以下が含まれます:
- `findUnique()`
- `findUniqueOrThrow()`
- `findFirst()`
- `findFirstOrThrow()`
- `findMany()`
- `count()`
- `aggregate()`
- `groupBy()`

## `withAccelerateInfo`

キャッシュされたレスポンスに関する追加情報を取得できます:

```typescript
const { data, info } = await prisma.user
  .count({
    cacheStrategy: { ttl: 60, swr: 600 },
    where: { myField: "value" },
  })
  .withAccelerateInfo();
```

### 戻り値の型

```typescript
interface AccelerateInfo {
  cacheStatus: "ttl" | "swr" | "miss" | "none";
  lastModified: Date;
  region: string;
  requestId: string;
  signature: string;
}
```

この情報を使用して、キャッシュのパフォーマンスとヒット率を監視できます。
