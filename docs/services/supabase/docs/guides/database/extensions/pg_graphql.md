# pg_graphql: PostgreSQL用GraphQL

## 概要
pg_graphqlは、「SQLの代わりにGraphQLを使用してデータベースと対話する」ためのPostgres拡張機能です。主な機能は以下の通りです:

- 既存のSQLスキーマからGraphQLスキーマを反映
- `graphql.resolve(...)`関数を通じてデータベースクエリを公開
- Postgresに接続する任意の言語でGraphQLクエリを有効化
- PostgRESTと連携するように設計

## 拡張機能の有効化
pg_graphqlは以下の方法で有効化できます:

### ダッシュボードによる方法
1. Databaseページに移動
2. サイドバーの「Extensions」をクリック
3. 「pg_graphql」を検索して有効化

### SQLによる方法
```sql
create extension pg_graphql;
```

## 使用例

### サンプルテーブルの作成
```sql
create table "Blog" (
  id serial primary key,
  name text not null,
  description text
);

insert into "Blog"(name) values ('My Blog');
```

### GraphQLクエリの実行
```sql
select graphql.resolve($$
  {
    blogCollection(first: 1) {
      edges {
        node {
          id,
          name
        }
      }
    }
  }
  $$);
```

## 主な機能
- 完全なスキーマイントロスペクションのサポート
- 追加のサーバーやライブラリが不要
- PostgRESTとのシームレスな統合

## リソース
- [公式pg_graphqlドキュメント](https://github.com/supabase/pg_graphql)
