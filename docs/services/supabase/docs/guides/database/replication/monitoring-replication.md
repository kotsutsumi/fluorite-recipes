# レプリケーションの監視

レプリケーションラグの監視は重要であり、これを行うには3つの方法があります：

1. **ダッシュボード** - ダッシュボードの[レポート](/docs/guides/platform/reports)で、プロジェクトのレプリケーションラグを確認できます
2. **データベース** -
   * `pg_stat_subscription`（サブスクライバー） - PIDがnullの場合、サブスクリプションはアクティブではありません
   * `pg_stat_subscription_stats` - error_countを確認して、適用または同期の問題があったかどうかを確認します（ある場合は、ログで理由を確認してください）
   * `pg_replication_slots` - これを使用してスロットがアクティブかどうかを確認でき、ここからラグを計算することもできます
3. **[メトリクス](/docs/guides/telemetry/metrics)** - プロジェクトのPrometheusエンドポイントを使用
   * `replication_slots_max_lag_bytes` - これがより重要なメトリクスです
   * `pg_stat_replication_replay_lag` - ソースDBからターゲットDBへのWALファイルの再生ラグ（ディスクまたは高いアクティビティによって制限されます）
   * `pg_stat_replication_send_lag` - ソースDBからのWALファイル送信のラグ（高いラグは、パブリッシャーが新しいWALファイルの送信を要求されていないか、ネットワークの問題があることを意味します）

## プライマリ

### レプリケーションステータスとラグ

`pg_stat_replication`テーブルは、プライマリデータベースに接続されているレプリカのステータスを表示します。

```sql
select pid, application_name, state, sent_lsn, write_lsn, flush_lsn, replay_lsn, sync_state
from pg_stat_replication;
```

### レプリケーションスロットのステータス

レプリケーションスロットは、次の3つの状態のいずれかになります：

* `active` - スロットはアクティブで、データを受信しています
* `inactive` - スロットはアクティブではなく、データを受信していません
* `lost` - スロットが失われ、データを受信していません

状態は`pg_replication_slots`テーブルを使用して確認できます：

```sql
select slot_name, active, state from pg_replication_slots;
```

### WALサイズ

WALサイズは`pg_ls_waldir()`関数を使用して確認できます：

```sql
select * from pg_ls_waldir();
```

### LSNの確認

```sql
select pg_current_wal_lsn();
```

## サブスクライバー

### サブスクリプションステータス

- `pg_subscription`テーブルはサブスクリプションステータスを表示します
- `pg_subscription_rel`テーブルはテーブルレベルのサブスクリプションステータスを表示します

サブスクリプション状態の意味：
- `i`: 初期化中
- `d`: データ同期中（初期データコピー）
- `s`: 同期済み
- `r`: データレプリケーション中

サブスクリプションステータスの詳細なSQLクエリ：

```sql
SELECT
    sub.subname AS subscription_name,
    relid::regclass AS table_name,
    srel.srsubstate AS replication_state,
    CASE srel.srsubstate
        WHEN 'i' THEN 'Initializing'
        WHEN 'd' THEN 'Data Synchronizing'
        WHEN 's' THEN 'Synchronized'
        WHEN 'r' THEN 'Replicating'
        ELSE 'Unknown'
    END AS state_description,
    srel.srsyncedlsn AS last_synced_lsn
FROM pg_subscription sub
JOIN pg_subscription_rel srel ON sub.oid = srel.srsubid
ORDER BY table_name;
```

### サブスクライバーのLSN確認

```sql
select pg_last_wal_replay_lsn();
```
