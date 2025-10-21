# 帯域幅とStorageエグレス

## 概要

Supabaseの無料プラン組織には、10GBの帯域幅制限（キャッシュ5GB + 非キャッシュ5GB）があります。この制限は、データベース、ストレージ、関数からのデータを含む、Supabaseサーバーからクライアントに転送されるすべてのデータの合計で計算されます。

## Storageエグレスリクエストの確認

Logs Explorerのテンプレートクエリを使用して、各オブジェクトのリクエスト数を取得できます:

```sql
select
  request.method as http_verb,
  request.path as filepath,
  (responseHeaders.cf_cache_status = 'HIT') as cached,
  count(*) as num_requests
from
  edge_logs
  cross join unnest(metadata) as metadata
  cross join unnest(metadata.request) as request
  cross join unnest(metadata.response) as response
  cross join unnest(response.headers) as responseHeaders
where
  (path like '%storage/v1/object/%' or path like '%storage/v1/render/%')
  and request.method = 'GET'
group by 1, 2, 3
order by num_requests desc
limit 100;
```

## エグレスの計算

エグレスを計算するには、リクエスト数にファイルサイズを掛けます。cURLを使用してファイルのサイズを取得できます:

```bash
curl -s -w "%{size_download}\n" -o /dev/null "https://my_project.supabase.co/storage/v1/object/large%20bucket/20230902_200037.gif"
```

計算例:
- 100リクエスト × 3MB = 300MB
- 168リクエスト × 570KB = 95.76MB
- 合計エグレス = 395.76MB

## エグレスの最適化

エグレスを最適化するためのスケーリングのヒントについては、[scaling tips for egress](/docs/guides/storage/production/scaling#egress)のドキュメントを参照してください。
