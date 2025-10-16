# 動的クエリ構築

Drizzle ORMにおける動的クエリ構築のガイドです。

## 概要

動的クエリ構築により、メソッド呼び出しの制限を解除することで、より柔軟なクエリ構築が可能になります。

## デフォルトの動作の制限

通常、`.where()`のようなメソッドは一度しか呼び出せません。これにより、動的に複数の条件を追加できません。

## 動的モードの有効化

`.$dynamic()`を使用して柔軟なクエリ構築を有効化：

```typescript
function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users);
const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // これで可能
```

## サポートされているクエリタイプ

この機能は、異なるデータベース方言全体で、select、insert、update、deleteクエリで動作します：
- Postgres
- MySQL
- SQLite

## 高度な変更

- クエリビルダータイプを汎用的に変更可能
- ジョインや他の複雑なクエリ変換の追加をサポート

## 使用例

```typescript
function withFilters<T extends PgSelect>(qb: T, filters: any) {
  if (filters.name) {
    qb = qb.where(eq(users.name, filters.name));
  }
  if (filters.age) {
    qb = qb.where(gte(users.age, filters.age));
  }
  return qb;
}

const dynamicQuery = db.select().from(users).$dynamic();
const result = await withFilters(dynamicQuery, { name: 'John', age: 25 });
```

ドキュメントは、動的モードがデータベースクエリをプログラムで構築する際により多くの柔軟性を提供することを強調しています。
