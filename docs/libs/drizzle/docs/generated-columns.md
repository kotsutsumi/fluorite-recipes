# 生成カラム

Drizzle ORMにおける生成カラムの包括的なガイドです。

## 概要

生成カラムは、同じテーブルの他のカラムを含む式に基づいて値が自動的に計算されるデータベースカラムです。データの一貫性を確保し、データベース設計を簡素化し、クエリのパフォーマンスを向上させることができます。

## 2つの主要なタイプ

### 1. 仮想（非永続）カラム
- クエリ中に動的に計算
- ストレージスペースを占有しない

### 2. 格納（永続）カラム
- 行の挿入/更新中に計算
- 値はデータベースに保存される
- パフォーマンス最適化のためにインデックス化可能

## データベース固有の実装

### PostgreSQL

`STORED`生成カラムのみをサポートします。

```typescript
export const test = pgTable("test", {
  content: text("content"),
  contentSearch: tsVector("content_search").generatedAlwaysAs(
    (): SQL => sql`to_tsvector('english', ${test.content})`
  )
});
```

制限事項：
- デフォルト値を指定できない
- 他の生成カラムを参照できない
- プライマリ/外部キーで使用できない

### MySQL

`STORED`と`VIRTUAL`の両方の生成カラムをサポートします。

```typescript
export const users = mysqlTable("users", {
  id: int("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  fullName: varchar("full_name", { length: 200 }).generatedAlwaysAs(
    (): SQL => sql`concat(${users.firstName}, ' ', ${users.lastName})`
  )
});
```

### SQLite

MySQLと同様に、`STORED`と`VIRTUAL`をサポートします。

```typescript
export const users = sqliteTable("users", {
  id: int("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name").generatedAlwaysAs(
    (): SQL => sql`${users.firstName} || ' ' || ${users.lastName}`
  )
});
```

## 主要な機能

- 文字列、SQLタグ、コールバック生成メソッドをサポート
- 異なるデータベース間で柔軟なカラム生成
- データの整合性を維持し、複雑な計算を簡素化するのに役立つ

制限事項はデータベースによって異なるため、特定のデータベース機能を慎重に検討することをお勧めします。
