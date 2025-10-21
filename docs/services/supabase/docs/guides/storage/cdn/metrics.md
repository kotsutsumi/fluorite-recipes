# キャッシュメトリクス

このドキュメントでは、Logs Explorerを使用してSupabase Storageのキャッシュヒットを判断する方法を説明します。

## 主なポイント

### 1. キャッシュヒットの識別
- キャッシュヒットは`metadata.response.headers.cf_cache_status`キーで判断されます
- キャッシュヒットの値には: `HIT`、`STALE`、`REVALIDATED`、または`UPDATING`が含まれます

### 2. トップキャッシュミスクエリ
`edge_logs`からトップキャッシュミスを表示するSQLクエリ:

```sql
select
  r.path as path,
  r.search as search,
  count(id) as count
from
  edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where
  starts_with(r.path, '/storage/v1/object')
  and r.method = 'GET'
  and h.cf_cache_status in ('MISS', 'NONE/UNKNOWN', 'EXPIRED', 'BYPASS', 'DYNAMIC')
group by path, search
order by count desc
limit 50;
```

### 3. キャッシュヒット率クエリ
時間経過によるキャッシュヒット率を判断するSQLクエリ:

```sql
select
  timestamp_trunc(timestamp, hour) as timestamp,
  countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) / count(f.id) as ratio
from
  edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where starts_with(r.path, '/storage/v1/object') and r.method = 'GET'
group by timestamp
order by timestamp desc;
```

このドキュメントでは、Logs Explorerでこれらのクエリを試してキャッシュパフォーマンスを分析することを推奨しています。

## キャッシュステータスの理解

### キャッシュヒットステータス

| ステータス | 説明 | パフォーマンスへの影響 |
|-----------|------|---------------------|
| `HIT` | コンテンツがCDNキャッシュから提供 | 最高のパフォーマンス |
| `STALE` | 古いコンテンツが提供中、バックグラウンドで更新 | 良好なパフォーマンス |
| `REVALIDATED` | キャッシュされたコンテンツが再検証され、まだ有効 | 良好なパフォーマンス |
| `UPDATING` | コンテンツ更新中、古いバージョンを提供 | 良好なパフォーマンス |

### キャッシュミスステータス

| ステータス | 説明 | パフォーマンスへの影響 |
|-----------|------|---------------------|
| `MISS` | コンテンツがキャッシュにない、オリジンから取得 | 低いパフォーマンス |
| `EXPIRED` | キャッシュされたコンテンツが期限切れ | 低いパフォーマンス |
| `BYPASS` | キャッシュがバイパスされた | 最低のパフォーマンス |
| `DYNAMIC` | 動的コンテンツ、キャッシュ不可 | 低いパフォーマンス |
| `NONE/UNKNOWN` | キャッシュステータス不明 | 変動 |

## メトリクスの分析

### キャッシュヒット率の計算

理想的なキャッシュヒット率は通常80%以上です:

```
キャッシュヒット率 = (HIT + STALE + REVALIDATED + UPDATING) / 総リクエスト数
```

### パフォーマンス最適化の指標

**優れたキャッシュパフォーマンス:**
- キャッシュヒット率 > 80%
- ミス率が低い
- バイパスが最小限

**改善が必要:**
- キャッシュヒット率 < 60%
- 高いミス率
- 頻繁なバイパス

## 実用的な分析例

### 時間帯別のキャッシュヒット率

```sql
select
  timestamp_trunc(timestamp, hour) as hour,
  countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) as hits,
  count(f.id) as total_requests,
  round(countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) * 100.0 / count(f.id), 2) as hit_rate_percentage
from
  edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where
  starts_with(r.path, '/storage/v1/object')
  and r.method = 'GET'
group by hour
order by hour desc
limit 24;
```

### バケット別のキャッシュパフォーマンス

```sql
select
  regexp_extract(r.path, r'/storage/v1/object/[^/]+/([^/]+)') as bucket,
  countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) as hits,
  countif(h.cf_cache_status in ('MISS', 'EXPIRED', 'BYPASS')) as misses,
  count(f.id) as total,
  round(countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) * 100.0 / count(f.id), 2) as hit_rate
from
  edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where
  starts_with(r.path, '/storage/v1/object')
  and r.method = 'GET'
group by bucket
order by total desc;
```

### ファイルタイプ別のキャッシュ効率

```sql
select
  regexp_extract(r.path, r'\.([^.]+)$') as file_extension,
  countif(h.cf_cache_status = 'HIT') as hits,
  countif(h.cf_cache_status = 'MISS') as misses,
  count(f.id) as total_requests,
  round(countif(h.cf_cache_status = 'HIT') * 100.0 / count(f.id), 2) as hit_rate
from
  edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where
  starts_with(r.path, '/storage/v1/object')
  and r.method = 'GET'
group by file_extension
order by total_requests desc
limit 20;
```

## キャッシュパフォーマンスの改善

### 低いキャッシュヒット率の診断

1. **トップミスURLを確認**
   - 上記のトップキャッシュミスクエリを実行
   - 頻繁にミスするパターンを特定

2. **キャッシュ設定を確認**
   - `Cache-Control`ヘッダーが適切に設定されているか確認
   - バケットがパブリックかプライベートか確認

3. **アクセスパターンを分析**
   - リクエストの分布を確認
   - ホットスポットとコールドスポットを特定

### 最適化戦略

**静的コンテンツの場合:**
```javascript
await supabase.storage
  .from('static-assets')
  .upload('logo.png', file, {
    cacheControl: '31536000' // 1年
  });
```

**動的コンテンツの場合:**
```javascript
await supabase.storage
  .from('dynamic-content')
  .upload('data.json', file, {
    cacheControl: '300' // 5分
  });
```

**頻繁に更新されるコンテンツの場合:**
- バージョン管理されたファイル名を使用
- クエリパラメータでキャッシュをバスト
- Smart CDN機能を活用(Proプラン以上)

## 継続的な監視

### ダッシュボードの作成

定期的にキャッシュメトリクスを監視:
1. 時間ごとのキャッシュヒット率
2. トップキャッシュミスURL
3. バケット別のパフォーマンス
4. ファイルタイプ別の効率

### アラートの設定

キャッシュヒット率が閾値を下回った場合の通知:
```sql
-- キャッシュヒット率が60%未満の場合にアラート
select
  timestamp_trunc(timestamp, hour) as hour,
  countif(h.cf_cache_status in ('HIT', 'STALE', 'REVALIDATED', 'UPDATING')) * 100.0 / count(f.id) as hit_rate
from edge_logs as f
  cross join unnest(f.metadata) as m
  cross join unnest(m.request) as r
  cross join unnest(m.response) as res
  cross join unnest(res.headers) as h
where starts_with(r.path, '/storage/v1/object') and r.method = 'GET'
group by hour
having hit_rate < 60
order by hour desc;
```

## ベストプラクティス

1. **定期的な監視**: 毎週キャッシュメトリクスをレビュー
2. **トレンド分析**: 時間経過によるパターンを特定
3. **プロアクティブな最適化**: 問題が発生する前に対処
4. **ドキュメント化**: キャッシュ戦略と設定を文書化
5. **テスト**: 変更後にキャッシュパフォーマンスをテスト
