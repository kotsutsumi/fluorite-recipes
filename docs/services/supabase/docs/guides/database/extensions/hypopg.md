# HypoPG: 仮想インデックス

`HypoPG`は、仮想/ハイポセティカルインデックスを作成するためのPostgres拡張機能です。主な目的は、「サーバーリソースを消費したり構築を待つことなく、遅いクエリを改善するためのインデックスを素早く検索できるようにすること」です。

## 拡張機能を有効化する

HypoPGは以下の方法で有効化できます。
- ダッシュボード: Database > Extensions > "hypopg"を検索して有効化
- SQL:
```sql
create extension hypopg with schema extensions;
```

## クエリを高速化する

ワークフローの例:

1. サンプルテーブルを作成:
```sql
create table account (
  id int,
  address text
);

insert into account(id, address)
select
  id,
  id || ' main street'
from generate_series(1, 10000) id;
```

2. 初期クエリプランを生成:
```sql
explain select * from account where id=1;
```

3. 仮想インデックスを作成:
```sql
select * from hypopg_create_index('create index on account(id)');
explain select * from account where id=1;
```

## 関数

HypoPGはいくつかの便利な関数を提供します:
- `hypo_create_index(text)`: 仮想インデックスを作成
- `hypopg_list_indexes`: 作成された仮想インデックスをリスト表示
- `hypopg()`: `pg_index`形式で仮想インデックスをリスト表示
- `hypopg_get_index_def(oid)`: インデックス作成文を表示
- `hypopg_get_relation_size(oid)`: 仮想インデックスのサイズを推定
- `hypopg_drop_index(oid)`: 特定の仮想インデックスを削除
- `hypopg_reset()`: すべての仮想インデックスを削除

## リソース

- [HypoPG公式ドキュメント](https://hypopg.readthedocs.io/en/rel1_stable/)
