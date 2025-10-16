# INSERT操作

Drizzle ORMにおけるSQL INSERT操作の包括的なガイドです。

## 1行の挿入

```typescript
await db.insert(users).values({ name: 'Andrew' });
```

## 複数行の挿入

```typescript
await db.insert(users).values([
  { name: 'Andrew' },
  { name: 'Dan' }
]);
```

## 返値付きの挿入

### 完全な返値

```typescript
await db.insert(users).values({ name: "Dan" }).returning();
```

### 部分的な返値

```typescript
await db.insert(users)
  .values({ name: "Partial Dan" })
  .returning({ insertedId: users.id });
```

## 競合の処理

### On Conflict Do Nothing

```typescript
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoNothing();
```

### On Conflict Do Update

```typescript
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'John' }
  });
```

## SELECTからの挿入

```typescript
await db.insert(employees)
  .select(
    db.select({ name: users.name })
      .from(users)
      .where(eq(users.role, 'employee'))
  );
```

## 主要な機能

- 複数のデータベース方言をサポート（PostgreSQL、SQLite、MySQL）
- 型安全な挿入操作
- 柔軟な競合解決
- 挿入された行の返値をサポート
- SELECTクエリからの挿入が可能

ドキュメントは、データベーステーブルに行を挿入する「最もSQL-likeな方法」を提供するDrizzle ORMの目標を強調しています。
