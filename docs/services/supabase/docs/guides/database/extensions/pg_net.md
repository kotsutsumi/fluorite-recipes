# pg_net: PostgreSQL用非同期ネットワーク拡張機能

## 概要

pg_netは、SQL内で直接非同期HTTP/HTTPSリクエストを可能にするPostgreSQL拡張機能です。主な機能は以下の通りです:

- デフォルトで非同期ネットワーキング
- トリガーなどのブロッキング関数で有用
- データベース変更の継続的なポーリングを排除
- 外部リソースへのプロアクティブな通知を可能にする

## 主要な関数

### `http_get`

非同期HTTP GETリクエストを作成し、リクエストIDを返します。

```sql
select net.http_get('https://news.ycombinator.com') as request_id;
```

### `http_post`

JSONボディを持つ非同期HTTP POSTリクエストを作成します。

```sql
select net.http_post(
    url:='https://httpbin.org/post',
    body:='{"hello": "world"}'::jsonb
) as request_id;
```

### `http_delete`

非同期HTTP DELETEリクエストを作成します。

```sql
select net.http_delete(
    'https://dummy.restapiexample.com/api/v1/delete/2'
) as request_id;
```

## レスポンスの処理

- 待機中のリクエストは`net.http_request_queue`に保存されます
- レスポンスはデフォルトで6時間、`net._http_response`に保存されます
- SupabaseダッシュボードのSQLエディタでクエリおよび検査できます

## 制限事項

- アンロギングテーブル（クラッシュ時に保持されません）
- レスポンスは6時間のみ保存
- 1秒あたり最大200リクエストに制限
- JSONデータを使用したPOSTリクエストのみサポート
- PATCH/PUTリクエストのサポートなし

## 拡張機能の有効化

Supabaseダッシュボードまたはsqlで有効化できます:

```sql
create extension pg_net;
```
