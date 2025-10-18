# パフォーマンス問題のデバッグ

## 概要

`explain()`は、クエリのPostgres `EXPLAIN`実行プランを提供するメソッドです。Postgresが特定のクエリをどのように実行するかを示すことで、遅いクエリのデバッグに役立ちます。

## explain()の有効化

- 機密性の高いデータベース情報を保護するため、デフォルトでは無効化されています
- 非本番環境での使用を推奨
- SQLを使用して有効化:

```sql
-- explainを有効化
alter role authenticator
set pgrst.db_plan_enabled to 'true';

-- 設定を再読み込み
notify pgrst, 'reload config';
```

## explain()の使用

Supabaseクエリに`explain()`をチェーンする例:

```javascript
const { data, error } = await supabase
 .from('instruments')
 .select()
 .explain()
```

### サンプルデータ

`instruments`テーブルの作成:

```sql
create table instruments (
  id int8 primary key,
  name text
);

insert into books (id, name)
values
  (1, 'violin'),
  (2, 'viola'),
  (3, 'cello');
```

### 期待される応答

典型的な実行プラン:

```
Aggregate (cost=33.34..33.36 rows=1 width=112)
 -> Limit (cost=0.00..18.33 rows=1000 width=40)
 -> Seq Scan on instruments (cost=0.00..22.00 rows=1200 width=40)
```

## 本番環境での使用とプレリクエスト保護

本番環境で`explain()`を有効にするには:
- プレリクエスト関数を使用してアクセスを制限
- IPアドレスに基づいてリクエストをフィルタリング

プレリクエスト関数の例:

```sql
create or replace function filter_plan_requests()
returns void as $$
declare
  headers   json := current_setting('request.headers', true)::json;
  client_ip text := coalesce(headers->>'cf-connecting-ip', '');
  accept    text := coalesce(headers->>'accept', '');
  your_ip   text := '123.123.123.123'; -- 自分のIPに置き換える
begin
  if accept -- 条件を追加
```
