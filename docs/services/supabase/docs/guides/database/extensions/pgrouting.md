# pgrouting: 地理空間ルーティング

## 概要

[`pgRouting`](http://pgrouting.org)は、PostgresとPostGISの拡張機能で、地理空間ルーティング機能を追加します。

## 主な機能

主な機能には、以下のような経路探索アルゴリズムが含まれます:

- 全ペア最短経路(ジョンソンのアルゴリズム)
- 全ペア最短経路(フロイド・ワーシャルアルゴリズム)
- 最短経路A*
- 双方向ダイクストラ最短経路
- 双方向A*最短経路
- 最短経路ダイクストラ
- 運転距離
- K最短経路、複数の代替経路
- Kダイクストラ、1対多最短経路
- 巡回セールスマン問題
- 転回制限付き最短経路(TRSP)

## 拡張機能の有効化

### ダッシュボードによる方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの「Extensions」をクリック
3. `pgrouting`を検索して拡張機能を有効化

### SQLによる方法
```sql
-- "pgRouting"拡張機能を有効化
create extension pgrouting cascade;

-- "pgRouting"拡張機能を無効化
drop extension if exists pgRouting;
```

## 例: 巡回セールスマン問題

この例では、PostGISの座標を使用して`pgr_TSPeuclidean`で巡回セールスマン問題を解決する方法を示します。

### テーブルの作成とデータの挿入
```sql
create table wi29 (
  id bigint,
  x float,
  y float,
  geom geometry
);

insert into wi29 (id, x, y) values
  (1, 20833.3333, 17100.0000),
  (2, 20900.0000, 17066.6667),
  -- (追加の座標)
```

### 最適経路の検索
```sql
select * from pgr_TSPeuclidean($$select * from wi29$$)
```

## リソース

- [公式pgRoutingドキュメント](https://docs.pgrouting.org/latest/en/index.html)
