# http: RESTfulクライアント

`http`拡張機能を使用すると、PostgreSQL内から直接RESTfulエンドポイントを呼び出すことができます。

## 概要

REST（Representational State Transfer）は、外部サービスからデータをリクエストする方法です。RESTful APIは、通常以下を含むHTTP「呼び出し」を受け入れます:

- `GET` - リソースへの読み取り専用アクセス
- `POST` - 新しいリソースを作成
- `DELETE` - リソースを削除
- `PUT` - 既存のリソースを更新、または新しいリソースを作成

## 使い方

### 拡張機能を有効化する

拡張機能は以下の方法で有効化できます:
- ダッシュボード: Database > Extensions > "http"を検索
- SQL: `create extension http with schema extensions;`

### 利用可能な関数

この拡張機能は以下のラッパー関数を提供します:
- `http_get()`
- `http_post()`
- `http_put()`
- `http_delete()`
- `http_head()`

### 返却値

成功したWebリクエストは、以下を含むレコードを返します:
- `status`: integer
- `content_type`: character varying
- `headers`: http_header[]
- `content`: character varying（通常は`jsonb`にキャスト）

## 例

### GETリクエスト

```sql
select "status", "content"::jsonb
from http_get('https://jsonplaceholder.typicode.com/todos/1');
```

### POSTリクエスト

```sql
select "status", "content"::jsonb
from http_post(
  'https://jsonplaceholder.typicode.com/posts',
  '{ "title": "foo", "body": "bar", "userId": 1 }',
  'application/json'
);
```

## リソース

- [公式GitHubリポジトリ](https://github.com/pramsey/pgsql-http)
