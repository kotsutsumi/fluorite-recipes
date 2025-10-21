# OrioleDB概要

## はじめに

OrioleDBは、PostgreSQLのスケーラビリティとパフォーマンスを向上させるために設計されたドロップイン代替ストレージエンジンを提供するPostgres拡張機能です。主な特徴:

- PostgreSQLのスケーラビリティの制限に対処
- 共有メモリキャッシュのボトルネックを解消
- 先行書き込みログ（WAL）挿入を最適化
- TPC-Cベンチマークで3.3倍のパフォーマンス向上を実証

## 概念

### 1. インデックス構成テーブル

- テーブルデータをインデックス構造に直接保存
- 個別のヒープストレージを排除
- オーバーヘッドを削減
- プライマリキークエリのパフォーマンスを向上

### 2. バッファマッピングなし

- メモリ内ページとストレージページ間の直接リンク
- PostgreSQLの共有バッファプールをバイパス
- バッファマッピングの複雑さと競合を排除

### 3. アンドゥログ

- マルチバージョン同時実行制御（MVCC）を実装
- 以前の行バージョンとトランザクション情報を保存
- 一貫した読み取りを可能にします
- テーブルのバキューム処理の必要性を排除

### 4. Copy-on-Writeチェックポイント

- データを効率的に永続化
- チェックポイント時に変更されたデータのみを書き込む
- I/Oオーバーヘッドを削減
- 行レベルのWALロギングを可能にします

## 使用方法

### OrioleDBプロジェクトの作成

- Supabaseダッシュボードで拡張機能を有効にします
- 「OrioleDB Public Alpha」Postgresバージョンで新しいプロジェクトを作成

### テーブルの作成

テーブル作成の例:

```sql
create table blog_post (
  id int8 not null,
  title text not null,
  body text not null,
  author text not null,
  published_at timestamptz not null default CURRENT_TIMESTAMP,
  views bigint not null,
  primary key (id)
);
```

### インデックスの作成

- 常にプライマリキーが必要です
- 現在、B-treeインデックスのみをサポート
- 部分インデックスがサポートされています

### データ操作

標準的なSQL操作が機能します:
- SELECT
- INSERT
- UPDATE
- DELETE
- INSERT ... ON CONFLICT

## 制限事項

- 現在、B-treeインデックスのみがサポートされています
- 一部の高度なインデックスタイプはまだ利用できません

## リソース

- [公式OrioleDBドキュメント](https://www.orioledb.com/)
