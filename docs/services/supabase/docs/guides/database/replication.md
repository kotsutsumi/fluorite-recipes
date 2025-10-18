# レプリケーションと変更データキャプチャ

## 概要

レプリケーションは、データベースから別の場所に変更をコピーするプロセスです。これは変更データキャプチャ（CDC: Change Data Capture）とも呼ばれ、データに発生するすべての変更をキャプチャすることを指します。

## ユースケース

レプリケーションは以下のような用途で使用されます:

- **アナリティクスとデータウェアハウス**: アプリケーションのパフォーマンスに影響を与えることなく、運用データベースをアナリティクスプラットフォームにレプリケート
- **データ統合**: 異なるシステムやサービス間でデータを同期
- **バックアップと災害復旧**: 異なる場所に最新のデータコピーを維持
- **読み取りスケーリング**: 複数のデータベースインスタンス間で読み取り操作を分散

## Postgresにおけるレプリケーション

Postgresは、パブリケーション（publication）とレプリケーションスロット（replication slot）を通じてレプリケーションをサポートしています。

## 主要な概念

### Write-Ahead Log (WAL)

Postgresは、Write-Ahead Log（WAL）と呼ばれるシステムを使用してデータベースへの変更を管理します。変更を行うと、それらはWALに追記されます。WALファイル（セグメント）は変更を記録し、チェックポイント後にPostgresはWALをデータベースと同期します。

### 論理レプリケーション

論理レプリケーションは、PostgresがWALファイルを使用して、それらの変更を別のPostgresデータベースまたは互換性のあるシステムに送信するレプリケーション方法です。

### LSN（Log Sequence Number）

LSNは、WALディレクトリ内のWALファイルの位置を識別するために使用されるLog Sequence Numberです。これは、レプリケーションの進行状況を追跡し、レプリケーションスロットのラグを計算するのに役立ちます。

## 論理レプリケーションアーキテクチャ

論理レプリケーションには3つの主要なコンポーネントがあります:

- **publication（パブリケーション）**: パブリッシュされるテーブルのセット
- **replication slot（レプリケーションスロット）**: データ変更の出力形式を指定
- **subscription（サブスクリプション）**: 外部システムから作成され、パブリケーションを指定

## レプリケーション出力形式

Postgresは以下のレプリケーション出力形式をサポートしています:

- **pgoutput**: Postgresのネイティブな論理レプリケーション形式
- **wal2json**: WAL変更をJSON形式に変換

## レプリケーション設定

論理レプリケーションを使用する場合、Postgresはレプリケーションスロットの非アクティブ問題を防ぐために、WALファイルを長く保持します。

### レプリケーション設定項目

| 設定項目 | 説明 | ユーザー公開 | デフォルト |
|---------|------|-------------|----------|
| `max_replication_slots` | 許可される最大レプリケーションスロット数 | いいえ | 10 |
| `wal_keep_size` | レプリケーション用に保持する最小WALファイルサイズ | いいえ | 0 |
| `max_slot_wal_keep_size` | レプリケーションスロット用の最大WALサイズ | いいえ | -1（無制限） |
| `checkpoint_timeout` | WALチェックポイント間の最大時間 | いいえ | 5分 |

**注意**: これらの設定はSupabaseで管理されており、ユーザーが直接変更することはできません。

## レプリケーションスロットの管理

### レプリケーションスロットの作成

```sql
-- 論理レプリケーションスロットの作成
SELECT pg_create_logical_replication_slot('my_slot', 'pgoutput');
```

### レプリケーションスロットの確認

```sql
-- アクティブなレプリケーションスロットを確認
SELECT * FROM pg_replication_slots;
```

### レプリケーションスロットの削除

```sql
-- レプリケーションスロットの削除
SELECT pg_drop_replication_slot('my_slot');
```

## パブリケーションの作成

```sql
-- すべてのテーブルをパブリッシュ
CREATE PUBLICATION my_publication FOR ALL TABLES;

-- 特定のテーブルのみパブリッシュ
CREATE PUBLICATION my_publication FOR TABLE users, posts;

-- 特定の操作のみパブリッシュ（INSERT、UPDATE、DELETE）
CREATE PUBLICATION my_publication FOR TABLE users
WITH (publish = 'insert,update');
```

## モニタリングとトラブルシューティング

### レプリケーションラグの確認

```sql
-- レプリケーションスロットのラグを確認
SELECT
  slot_name,
  pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) as replication_lag
FROM pg_replication_slots;
```

### WALディスク使用量の確認

```sql
-- WALディレクトリのサイズを確認
SELECT pg_size_pretty(sum(size)) as wal_size
FROM pg_ls_waldir();
```

## ベストプラクティス

1. **アクティブな監視**: レプリケーションスロットのラグとWAL使用量を定期的に監視
2. **不要なスロットの削除**: 使用していないレプリケーションスロットは削除してディスク容量を節約
3. **適切なパブリケーション設定**: 必要なテーブルと操作のみをパブリッシュ
4. **エラー処理**: レプリケーションエラーを適切に処理し、必要に応じて再接続

## セキュリティ考慮事項

- レプリケーションは機密データを含む可能性があるため、適切なアクセス制御を実装
- SSL/TLS接続を使用してレプリケーション接続を暗号化
- レプリケーションユーザーに最小限の権限のみを付与

## 制限事項

- DDL（スキーマ変更）は自動的にレプリケートされません
- シーケンス値は論理レプリケーションでレプリケートされません
- 大規模なトランザクションはレプリケーションのパフォーマンスに影響を与える可能性があります

## 関連リソース

- [レプリケーションの設定](./replication/setting-up-replication.md)
- [レプリケーションFAQ](./replication/faq.md)
- [PostgreSQL公式ドキュメント: 論理レプリケーション](https://www.postgresql.org/docs/current/logical-replication.html)

## 次のステップ

- [レプリケーションのセットアップ方法を学ぶ](./replication/setting-up-replication.md)
- [よくある質問を確認する](./replication/faq.md)
- [Supabaseのリアルタイム機能を探索する](../realtime/overview.md)
