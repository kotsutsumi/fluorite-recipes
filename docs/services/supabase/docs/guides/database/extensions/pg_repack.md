# pg_repack: 物理ストレージ最適化とメンテナンス

## 概要

pg_repackは、データベースストレージを最適化するために設計されたPostgres拡張機能です：

- テーブルとインデックスから肥大化（bloat）を除去
- クラスタ化されたインデックスの物理的な順序を復元
- データベース操作をブロックせずに「オンライン」で実行

## 主要な機能

pg_repackは物理ストレージを最適化する方法を提供します：

- **オンラインCLUSTER**: テーブルデータを非ブロッキングで並び替え
- 指定されたカラムでテーブルデータを並び替え
- **オンラインVACUUM FULL**: ブロックせずに行を詰め込む
- テーブルインデックスの再構築または再配置

## 要件

- 対象テーブルには、PRIMARY KEYまたはNOT NULLカラムのUNIQUEインデックスが必要
- 対象テーブルとインデックスのサイズの約2倍の空きディスク容量が必要
- 非スーパーユーザーでのリパックには、pg_repackバージョン1.5.2以上が必要

## 使用方法

### 拡張機能の有効化

1. Supabaseダッシュボードのデータベースページに移動
2. "Extensions"をクリック
3. "pg_repack"を検索して有効化

### CLIの構文

```
pg_repack -k [OPTION]... [DBNAME]
```

### コマンド例

```
pg_repack -k -h db.<PROJECT_REF>.supabase.co -p 5432 -U postgres -d postgres --no-order --table public.foo --table public.bar
```

## 制限事項

- 一時テーブルを再編成できない
- GiSTインデックスによるテーブルのクラスタ化ができない
- 操作中はDDLコマンドが実行できない

## リソース

- [公式pg_repackドキュメント](https://reorg.github.io/pg_repack/)
