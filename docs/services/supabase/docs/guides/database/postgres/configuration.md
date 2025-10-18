# データベース設定

## 概要

Postgresは、データベースサイズに対して妥当なデフォルト設定のセットを提供します。場合によっては、これらのデフォルト設定を更新できます。

## 主なセクション

### タイムアウト

詳細については、[タイムアウト](/docs/guides/database/postgres/timeouts)セクションを参照してください。

### ステートメントの最適化

- すべてのSupabaseプロジェクトには`pg_stat_statements`拡張機能が含まれています
- 計画と実行の統計を追跡します
- Postgresの`explain`機能と組み合わせて、パフォーマンスを最適化できます

### タイムゾーンの管理

- ホストされたSupabaseデータベースのデフォルトタイムゾーンはUTCです
- タイムゾーン計算を簡単にするため、UTCのままにすることを推奨します
- セルフホストデータベースの場合、ローカルタイムゾンがデフォルトです

#### タイムゾーンの変更

SQL例:

```sql
alter database postgres set timezone to 'America/New_York';
```

#### タイムゾーンの表示

次の列を含むタイムゾーンの完全なリストを取得:
- `name`: タイムゾーン名
- `abbrev`: タイムゾーン略称
- `utc_offset`: UTCからのオフセット
- `is_dst`: 夏時間のステータス

タイムゾーンをリストするSQL:

```sql
select name, abbrev, utc_offset, is_dst
from pg_timezone_names()
order by name;
```

#### タイムゾーンの検索

大文字と小文字を区別しないタイムゾーン検索には`ilike`を使用:

```sql
select *
from pg_timezone_names()
where name ilike '%york%';
```

## 追加のノート

- 影響を理解せずにデフォルト設定を変更することは推奨されません
- データベース設定を変更する前にドキュメントを参照してください
