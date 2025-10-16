# その他の便利機能

Drizzle ORMのその他の便利機能のガイドです。

## 1. 型API

`select`と`insert`クエリの型を取得：

```typescript
type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
```

## 2. ログ

データベース初期化時に`{ logger: true }`を渡してクエリログを有効化：

```typescript
const db = drizzle(client, { logger: true });
```

カスタムログライターとロガーをサポートし、ログの送信先と形式をカスタマイズできます。

## 3. マルチプロジェクトスキーマ

テーブル名をカスタマイズするためのテーブルクリエーターAPIを提供：

```typescript
const createTable = pgTableCreator((name) => `myapp_${name}`);

const users = createTable('users', {
  id: serial('id').primaryKey(),
  name: text('name')
});
```

異なるプロジェクトのスキーマを1つのデータベースに保持するのに便利です。

## 4. SQLクエリの出力

`toSQL()`メソッドを使用してSQLクエリを出力：

```typescript
const query = db.select().from(users).toSQL();
console.log(query.sql); // SQL文字列
console.log(query.params); // パラメータ
```

## 5. 生のSQLクエリ

`db.execute()`を使用して生のパラメータ化されたクエリを実行：

```typescript
await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`);
```

異なるクエリメソッドをサポート：
- `all()`: すべての行を返す
- `get()`: 最初の行を返す
- `values()`: 値の配列を返す
- `run()`: 実行のみ

## 6. スタンドアロンクエリビルダー

データベースインスタンスを作成せずにクエリを構築：

```typescript
import { queryBuilder as qb } from 'drizzle-orm/pg-core';

const query = qb.select().from(users).where(eq(users.id, 1));
const { sql, params } = query.toSQL();
```

## 7. 追加ユーティリティ

- 型付きテーブルカラムの取得
- テーブル情報の取得
- オブジェクト型の比較
- テスト用のモックドライバー

このセクションは、さまざまなデータベースエンジン全体でデータベースと連携するための柔軟で型安全なメソッドを提供します。
