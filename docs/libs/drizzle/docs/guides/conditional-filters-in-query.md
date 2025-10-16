# Drizzle ORM: クエリでの条件付きフィルター

## 概要
このガイドでは、PostgreSQL、MySQL、SQLiteデータベースでDrizzle ORMのクエリに条件付きフィルターを作成する方法を説明します。

## 基本的な条件付きフィルタリング

### シンプルな条件付きフィルター
```typescript
import { ilike } from 'drizzle-orm';

const searchPosts = async (term?: string) => {
  await db
    .select()
    .from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};

// 使用例
await searchPosts();
await searchPosts('AI');
```

## 複合条件付きフィルター

### `and()`演算子による複数条件
```typescript
import { and, gt, ilike, inArray } from 'drizzle-orm';

const searchPosts = async (term?: string, categories: string[] = [], views = 0) => {
  await db
    .select()
    .from(posts)
    .where(
      and(
        term ? ilike(posts.title, term) : undefined,
        categories.length > 0 ? inArray(posts.category, categories) : undefined,
        views > 100 ? gt(posts.views, views) : undefined,
      ),
    );
};

// 使用例
await searchPosts();
await searchPosts('AI', ['Tech', 'Art', 'Science'], 200);
```

## 柔軟なフィルター構成

### フィルターの動的作成
```typescript
import { SQL, and } from 'drizzle-orm';

const searchPosts = async (filters: SQL[]) => {
  await db
    .select()
    .from(posts)
    .where(and(...filters));
};

const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));

await searchPosts(filters);
```

## カスタムフィルター演算子

### カスタム長さフィルターの作成
```typescript
import { AnyColumn, sql, and } from 'drizzle-orm';

// カスタムlength演算子
const length = (column: AnyColumn) => {
  return sql<number>`length(${column})`;
};

// 使用例
const searchPosts = async (term?: string, minLength?: number) => {
  await db
    .select()
    .from(posts)
    .where(
      and(
        term ? ilike(posts.title, term) : undefined,
        minLength ? gt(length(posts.content), minLength) : undefined,
      ),
    );
};
```

## 主なポイント
- 条件付きフィルターは、オプショナルなクエリパラメータに基づいて動的にクエリを構築可能
- `and()`と`or()`演算子で複数の条件を組み合わせ可能
- カスタムSQL演算子を作成して、より複雑なフィルタリングロジックを実装可能
- `undefined`値は自動的にフィルターから除外される
