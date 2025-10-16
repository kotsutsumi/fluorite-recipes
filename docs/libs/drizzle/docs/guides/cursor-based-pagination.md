# Drizzle ORM: SQLカーソルベースページネーションガイド

## 概要
カーソルベースのページネーションは、データベース内のページ分割されたデータを効率的に取得する技術で、特に大規模なデータセットに有用です。このガイドでは、異なるデータベースタイプ(PostgreSQL、MySQL、SQLite)でDrizzle ORMを使用したカーソルベースページネーションの実装方法を説明します。

## 基本的なカーソルベースページネーション例

```typescript
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

// 使用方法
await nextUserPage(3);
```

## 主要な概念

### 動的順序ページネーション
昇順と降順の両方をサポートできます:

```typescript
const nextUserPage = async (order: 'asc' | 'desc' = 'asc', cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? (order === 'asc' ? gt(users.id, cursor) : lt(users.id, cursor)) : undefined)
    .limit(pageSize)
    .orderBy(order === 'asc' ? asc(users.id) : desc(users.id));
};
```

### 複数カラムのカーソルページネーション
一意でないカラムや連続していないカラムの場合:

```typescript
const nextUserPage = async (
  cursor?: {
    id: number;
    firstName: string;
  },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.firstName, cursor.firstName),
            and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};
```

### パフォーマンスのためのインデックス作成
効率的なカーソルベースのページネーションのために、適切なインデックスを作成することが重要です:

```typescript
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: text('first_name').notNull(),
  },
  (table) => ({
    firstNameIdx: index('first_name_idx').on(table.firstName),
  }),
);
```

## 主なポイント
- カーソルベースページネーションは大規模なデータセットでより効率的
- limit/offsetページネーションと比較してパフォーマンスが向上
- 適切なインデックスが最適なパフォーマンスに不可欠
- 複数カラムの並び替えをサポート
- 前後へのナビゲーションが可能
