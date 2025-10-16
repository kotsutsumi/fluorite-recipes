# SQLテンプレート

Drizzle ORMの`sql`テンプレートの包括的なガイドです。

## 概要

`sql`テンプレートは、型安全でパラメータ化されたSQLクエリを記述するための強力な機能です。

## 主要な機能

- SQLインジェクションの脆弱性を防止
- 型安全なクエリ構築
- 部分的なクエリカスタマイズを許可
- ランタイム値のマッピングを有効化
- 複数のヘルパーメソッドを提供

## 主なメソッド

### 1. `sql` 基本使用法

テーブルとカラム名を自動的にエスケープ：

```typescript
const result = await db.execute(
  sql`select * from ${usersTable} where ${usersTable.id} = ${id}`
);
```

### 2. `sql<T>`: 型定義

クエリ結果のカスタム型を定義：

```typescript
const lowerName = sql<string>`lower(${usersTable.name})`;
```

### 3. `.mapWith()`: ランタイム値マッピング

データベース値のカスタムランタイムマッピング：

```typescript
const result = sql`...`.mapWith(usersTable.name);
```

### 4. `.as<T>()`: フィールドエイリアス

クエリでカスタムフィールドに明示的に名前を付ける：

```typescript
const lowerName = sql`lower(${usersTable.name})`.as('lower_name');
```

### 5. `sql.raw()`: エスケープされないSQLの挿入

処理なしで生のSQLを含める：

```typescript
const result = sql.raw('SELECT * FROM users');
```

## 高度な使用法

`sql`テンプレートは、以下の句で使用できます：
- SELECT
- WHERE
- ORDER BY
- GROUP BY
- HAVING

複雑なクエリ構築メソッド：
- `sql.fromList()`
- `sql.join()`
- `sql.append()`
- `sql.empty()`

ドキュメントは、型安全性を維持し、一般的なSQLインジェクションのリスクを防ぎながら、データベースクエリを処理する際の`sql`テンプレートの柔軟性を強調しています。
