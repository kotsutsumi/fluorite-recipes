# pg_hashids: 短いUID

## 概要

pg_hashidsは、「数値から短く、ユニークで、非連続なIDを安全に生成する方法を提供する」PostgreSQL拡張機能です。以下のことが可能です:
- コンパクトで難読化された識別子の作成
- ユーザーIDや注文番号のような連続データの隠蔽
- オプションでパスワード、アルファベット、ソルトを使用した追加のセキュリティ

## 拡張機能の有効化

### ダッシュボードによる方法
1. Databaseページに移動
2. サイドバーの「Extensions」をクリック
3. 「pg_hashids」を検索して有効化

### SQLによる方法
```sql
-- 拡張機能を有効化
create extension pg_hashids with schema extensions;

-- 拡張機能を無効化
drop extension if exists pg_hashids;
```

## 使用例

注文テーブルの例を作成:

```sql
create table orders (
  id serial primary key,
  description text,
  price_cents bigint
);

insert into orders (description, price_cents)
values ('a book', 9095);

select
  id,
  id_encode(id) as short_id,
  description,
  price_cents
from orders;

-- 結果:
--  id | short_id | description | price_cents
-- ----+----------+-------------+-------------
--   1 | jR       | a book      |        9095
```

短いIDを元のIDに戻すには、`id_decode()`関数を使用します。

## リソース
- [公式pg_hashidsドキュメント](https://github.com/iCyberon/pg_hashids)
