# ログ

このドキュメントでは、Supabase Storageのログにアクセスしてクエリする方法を説明します。

主なポイント:
- Storage Logsを使用すると「Storageサービスへのすべての受信リクエストログを調べる」ことができます
- 様々なSQLクエリを使用してログをフィルタリングおよび分析できます

## 一般的なログクエリ

### 1. 5XXエラーでフィルタ
```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.statusCode,
  e.message as errorMessage,
  e.raw as rawError
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.res) as r
cross join unnest(m.error) as e
where r.statusCode >= 500
order by timestamp desc
limit 100;
```

### 2. 4XXエラーでフィルタ
```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.statusCode,
  e.message as errorMessage,
  e.raw as rawError
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.res) as r
cross join unnest(m.error) as e
where r.statusCode >= 400 and r.statusCode < 500
order by timestamp desc
limit 100;
```

### 3. メソッドでフィルタ
```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.method
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
where r.method in ("POST")
order by timestamp desc
limit 100;
```

### 4. IPアドレスでフィルタ
```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.remoteAddress
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
where r.remoteAddress in ("IP_ADDRESS")
order by timestamp desc
limit 100;
```

## 追加のログクエリ

### 5. 特定のバケットへのアクセスをフィルタ

```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.path,
  r.method,
  res.statusCode
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
where r.path like '/object/public/bucket-name/%'
order by timestamp desc
limit 100;
```

### 6. アップロード操作の監視

```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.path,
  r.method,
  res.statusCode,
  req.headers.content_length as file_size
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.req) as req
cross join unnest(m.res) as res
where r.method = 'POST'
  and starts_with(r.path, '/object/')
order by timestamp desc
limit 100;
```

### 7. 遅いリクエストの特定

```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.path,
  r.method,
  res.statusCode,
  m.response_time_ms
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
where m.response_time_ms > 1000  -- 1秒以上
order by m.response_time_ms desc
limit 100;
```

### 8. 失敗したアップロードの分析

```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.path,
  res.statusCode,
  e.message as error_message,
  e.raw as error_details
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
cross join unnest(m.error) as e
where r.method in ('POST', 'PUT')
  and res.statusCode >= 400
order by timestamp desc
limit 100;
```

### 9. ユーザーアクティビティの追跡

```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.path,
  r.method,
  res.statusCode,
  auth.user_id
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
cross join unnest(m.auth) as auth
where auth.user_id = 'USER_ID_HERE'
order by timestamp desc
limit 100;
```

### 10. バケット別のリクエスト統計

```sql
select
  regexp_extract(r.path, r'/object/[^/]+/([^/]+)') as bucket_name,
  r.method,
  count(*) as request_count,
  countif(res.statusCode >= 400) as error_count,
  avg(m.response_time_ms) as avg_response_time
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
where starts_with(r.path, '/object/')
group by bucket_name, r.method
order by request_count desc;
```

## ログ分析のベストプラクティス

### 時間範囲の指定

特定の時間範囲でログをフィルタ:
```sql
select
  id,
  storage_logs.timestamp,
  event_message,
  r.method,
  r.path
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
where timestamp >= timestamp_sub(current_timestamp(), interval 1 hour)
  and timestamp <= current_timestamp()
order by timestamp desc;
```

### エラーパターンの特定

```sql
select
  res.statusCode,
  e.message as error_message,
  count(*) as occurrence_count
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.res) as res
cross join unnest(m.error) as e
where res.statusCode >= 400
group by res.statusCode, e.message
order by occurrence_count desc
limit 20;
```

### パフォーマンスメトリクス

```sql
select
  timestamp_trunc(timestamp, hour) as hour,
  count(*) as total_requests,
  countif(res.statusCode >= 500) as server_errors,
  countif(res.statusCode >= 400 and res.statusCode < 500) as client_errors,
  avg(m.response_time_ms) as avg_response_time,
  max(m.response_time_ms) as max_response_time
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.res) as res
group by hour
order by hour desc
limit 24;
```

## トラブルシューティングのヒント

### 1. エラー率の監視
定期的にエラー率を確認して問題を早期に発見:
```sql
select
  timestamp_trunc(timestamp, hour) as hour,
  count(*) as total_requests,
  countif(res.statusCode >= 400) as errors,
  round(countif(res.statusCode >= 400) * 100.0 / count(*), 2) as error_rate_percentage
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.res) as res
group by hour
order by hour desc
limit 24;
```

### 2. 大きなファイルのアップロードの追跡
```sql
select
  id,
  storage_logs.timestamp,
  r.path,
  cast(req.headers.content_length as int64) / 1048576 as size_mb,
  res.statusCode,
  m.response_time_ms / 1000 as duration_seconds
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.req) as req
cross join unnest(m.res) as res
where r.method = 'POST'
  and cast(req.headers.content_length as int64) > 10485760  -- 10MB以上
order by timestamp desc
limit 50;
```

### 3. 認証エラーの診断
```sql
select
  id,
  storage_logs.timestamp,
  r.path,
  r.method,
  res.statusCode,
  e.message as error_message
from storage_logs
cross join unnest(metadata) as m
cross join unnest(m.req) as r
cross join unnest(m.res) as res
cross join unnest(m.error) as e
where res.statusCode = 401 or res.statusCode = 403
order by timestamp desc
limit 100;
```

## ログの保持とエクスポート

- Supabaseはプランに応じて異なる期間ログを保持します
- 長期保存が必要な場合は、ログを外部システムにエクスポートすることを検討してください
- 重要なメトリクスにはアラートとモニタリングを設定してください

## まとめ

Storage Logsは、以下のために強力なツールです:
- パフォーマンスの問題の診断
- エラーとその原因の特定
- 使用パターンの理解
- セキュリティインシデントの監視
- システムの健全性の追跡

これらのクエリをLogs Explorerで使用して、Storageサービスの包括的な洞察を得てください。
