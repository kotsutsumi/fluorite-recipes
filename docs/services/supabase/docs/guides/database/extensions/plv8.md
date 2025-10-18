# plv8: JavaScript言語

## 非推奨の通知

> `plv8`拡張機能は、Postgres 17を使用するプロジェクトでは非推奨です。Postgres 15を使用するプロジェクトでは引き続きサポートされていますが、これらのプロジェクトをPostgres 17にアップグレードする前に削除する必要があります。

## 概要

`plv8`拡張機能を使用すると、PostgreSQL内でJavaScriptを使用できます。PostgresはネイティブでSQLを実行しますが、他の手続き型言語も実行できます。`plv8`は、特にV8 JavaScriptエンジンを使用してJavaScriptコードを実行できるようにします。

以下の用途に使用できます:
- データベース関数
- トリガー
- クエリ
- その他

## 拡張機能を有効化する

### ダッシュボードを使用する方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの**Extensions**をクリック
3. "plv8"を検索して拡張機能を有効化

### SQLを使用する方法
```sql
create extension plv8;
```

## plv8関数の作成

関数は他のPostgres関数と同じように記述されますが、`language`を`plv8`に設定します:

```sql
create or replace function function_name()
returns void as $$
    // V8 JavaScript
    // ここにコードを記述
$$ language plv8;
```

## 例

### スカラー関数

スカラー関数は入力を受け取り、単一の結果を返します:

```sql
create or replace function hello_world(name text)
returns text as $$
    let output = `Hello, ${name}!`;
    return output;
$$ language plv8;
```

### SQLの実行

`plv8.execute()`を使用して、`plv8`内でSQLを実行できます:

```sql
create or replace function update_user(id bigint, first_name text)
returns smallint as $$
    var num_affected = plv8.execute(
        'update profiles set first_name = $1 where id = $2',
        [first_name, id]
    );
    return num_affected;
$$ language plv8;
```

### セット返却関数

セット返却関数は複数の行を返します:

```sql
create or replace function get_messages()
returns setof messages as $$
    var json_result = plv8.execute('select * from messages');
    return json_result;
$$ language plv8;
```
