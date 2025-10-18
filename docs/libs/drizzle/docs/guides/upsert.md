# Drizzle ORM - Upsertクエリガイド

この包括的なガイドでは、Drizzle ORMを使用したPostgreSQL、MySQL、SQLiteのupsertクエリを説明します。主要な概念の内訳は以下の通りです:

## PostgreSQLとSQLiteのUpsert

### 基本的なUpsert
```typescript
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

### 複数行のUpsert
```typescript
await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: {
      lastLogin: sql.raw(`excluded.${users.lastLogin.name}`)
    },
  });
```

### 高度なUpsertテクニック
- カスタム競合更新カラム
- 複数のターゲット競合
- `setWhere`を使用した条件付き更新
- 特定のカラム値の保持

## MySQLのUpsert

### 基本的なUpsert
```typescript
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({
    set: { name: 'Super John' }
  });
```

### 複数行のUpsert
```typescript
await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: {
      lastLogin: sql`values(${users.lastLogin})`,
    },
  });
```

## 主な違い
- PostgreSQL/SQLiteは`onConflictDoUpdate()`を使用
- MySQLは`onDuplicateKeyUpdate()`を使用
- データベース間で競合解決戦略がわずかに異なる

このガイドは、異なるデータベースタイプ間でのupsertシナリオを処理するための柔軟な方法を提供し、Drizzle ORMのデータ競合管理における多様性を示しています。
