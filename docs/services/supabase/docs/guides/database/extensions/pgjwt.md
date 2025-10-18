# pgjwt: JSON Web Tokens

## 概要

`pgjwt`拡張機能は、データベース内でJSON Web Tokens（JWT）を作成および解析するためのPostgres拡張機能です。

> pgjwt拡張機能は、Postgres 17を使用するプロジェクトでは非推奨となっています。Postgres 15を使用するプロジェクトでは引き続きサポートされていますが、これらのプロジェクトをPostgres 17にアップグレードする前に削除する必要があります。

## 拡張機能の有効化

### ダッシュボードを使用する方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの"Extensions"をクリック
3. `pgjwt`を検索して拡張機能を有効化

### SQLを使用する方法
```sql
-- "pgjwt"拡張機能を有効化
create extension pgjwt schema extensions;

-- "pgjwt"拡張機能を無効化
drop extension if exists pgjwt;
```

## API関数

- `sign(payload json, secret text, algorithm text default 'HSA256')`: JWTに署名
- `verify(token text, secret text, algorithm text default 'HSA256')`: JWTをデコード

## 使用例

### JWTへの署名
```sql
select extensions.sign(
  payload := '{"sub":"1234567890","name":"John Doe","iat":1516239022}',
  secret := 'secret',
  algorithm := 'HS256'
);
```

### JWTの検証
```sql
select extensions.verify(
  token := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRm9vIn0.Q8hKjuadCEhnCPuqIj9bfLhTh_9QSxshTRsA5Aq4IuM',
  secret := 'secret',
  algorithm := 'HS256'
);
```

## リソース
- [pgjwt公式ドキュメント](https://github.com/michelp/pgjwt)
