# データベースWebhook

## 概要

データベースWebhookを使用すると、テーブルイベントが発生したときに、データベースから別のシステムにリアルタイムでデータを送信できます。3つのイベントにフックできます:
- `INSERT`
- `UPDATE`
- `DELETE`

すべてのイベントは、データベース行が変更された*後*に発火します。

## WebhookとトリガーとWebhooksの比較

データベースWebhookは、`pg_net`拡張機能を使用したトリガーの便利なラッパーです。この拡張機能は非同期であり、長時間実行されるネットワークリクエストがデータベースの変更をブロックするのを防ぎます。

## Webhookの作成

Webhookを作成する手順:
1. ダッシュボードで新しいデータベースWebhookを作成
2. Webhookに名前を付ける
3. ターゲットテーブルを選択
4. トリガーする1つ以上のイベントを選択

SQL文を介して直接作成することもできます。

## ペイロードタイプ

Webhookは3つのペイロードタイプをサポートしています:
- Insert ペイロード
- Update ペイロード
- Delete ペイロード

各ペイロードには次のようなメタデータが含まれます:
- イベントタイプ
- テーブル名
- スキーマ
- レコードデータ
- 古いレコードデータ（該当する場合）

## 主な機能

- HTTP Webhookをサポート（POST/GET）
- JSONペイロード生成
- 非同期処理
- `net`スキーマによる監視

## ローカル開発の考慮事項

- PostgresはDockerコンテナで実行されます
- `localhost`の代わりに`host.docker.internal`を使用します
- ローカルIPアドレスの使用が必要な場合があります

## SQLトリガーの例

```sql
create trigger "my_webhook" after insert
on "public"."my_table" for each row
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:3000',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
```

## リソース

- [pg_net拡張機能ドキュメント](/docs/guides/database/extensions/pgnet)
