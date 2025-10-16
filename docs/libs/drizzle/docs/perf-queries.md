# クエリパフォーマンス

Drizzle ORMのクエリパフォーマンスの概要です。

## 概要

Drizzleは、ほぼゼロオーバーヘッドのSQL上の薄いTypeScriptレイヤーです。プリペアドステートメントを使用すると、さらに優れたパフォーマンスを実現できます。

## クエリ実行プロセス

1. クエリビルダーの設定をSQL文字列に連結
2. 文字列とパラメータをデータベースドライバーに送信
3. ドライバーがSQLクエリをバイナリ実行可能形式にコンパイル

## プリペアドステートメントの利点

- SQL連結はDrizzle ORM側で一度行われる
- データベースドライバーはプリコンパイルされたバイナリSQLを再利用可能
- 特に大規模なクエリで大幅なパフォーマンス向上を提供

## プリペアドステートメントの例（PostgreSQL）

```typescript
const prepared = db.select().from(customers).prepare("statement_name");
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

## プレースホルダーの使用

動的なランタイム値を埋め込むには`sql.placeholder()`を使用：

```typescript
const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare("p1")

await p1.execute({ id: 10 }) // ID 10の顧客を選択
```

## サポートされているデータベース

- PostgreSQL
- MySQL
- SQLite
- SingleStore

ドキュメントは、特にプリペアドステートメントとプレースホルダーを通じて、Drizzleのパフォーマンス最適化技術を強調しています。
