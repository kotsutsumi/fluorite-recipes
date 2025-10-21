# TimescaleDB: 時系列データ

## 非推奨のお知らせ

`timescaledb` 拡張機能は、Postgres 17を使用するプロジェクトでは非推奨となっています。Postgres 15を使用するプロジェクトでは引き続きサポートされますが、それらのプロジェクトをPostgres 17にアップグレードする前に削除する必要があります。

## 概要

TimescaleDBは、時系列データの処理を改善するために設計されたPostgres拡張機能です。標準的なPostgresデータベース上で、時系列データの保存とクエリのためのスケーラブルで高性能なソリューションを提供します。

## 主な機能

- 時系列対応のストレージモデル
- パフォーマンス向上のためのインデックス技術
- 時間間隔に基づいてチャンクに分割されたデータ
- 大規模データセットの効率的なスケーリング
- 書き込み負荷の高いワークロードの圧縮と最適化
- 並列処理のためのパーティショニング

## インストール

### ダッシュボードからの有効化

1. ダッシュボードのDatabaseページに移動
2. サイドバーの「Extensions」をクリック
3. `timescaledb` を検索して拡張機能を有効化

### SQLでの有効化

```sql
create extension timescaledb with schema extensions;
```

## 使用例

### ハイパーテーブルの作成

```sql
create table temperatures (
  time timestamptz not null,
  sensor_id int not null,
  temperature double precision not null
);

select create_hypertable('temperatures', 'time');
```

### データの挿入

```sql
insert into temperatures (time, sensor_id, temperature)
values
  ('2023-02-14 09:00:00', 1, 23.5),
  ('2023-02-14 09:00:00', 2, 21.2)
  -- さらにデータポイントを追加
```

### 時間バケットを使用したクエリ

```sql
select
  time_bucket('1 hour', time) AS hour,
  avg(temperature) AS average_temperature
from temperatures
where sensor_id = 1 and time > NOW() - interval '1 hour'
group by hour;
```

## 追加の注意事項

Supabaseは「TimescaleDB Apache 2 Edition」を提供しており、Community Editionの一部の機能は利用できません。
