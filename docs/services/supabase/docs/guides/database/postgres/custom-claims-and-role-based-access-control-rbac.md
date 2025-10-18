# カスタムクレームとロールベースアクセス制御（RBAC）

## 概要

- カスタムクレームは、アプリケーションアクセスを制御するためにユーザーに付与される特別な属性です
- Auth Hooksを使用してロールベースアクセス制御（RBAC）を実装します

## 主な概念

### カスタムクレームの例

```json
{
  "user_role": "admin",
  "plan": "TRIAL",
  "user_level": 100,
  "group_name": "Super Guild!"
}
```

### ユーザーロールの実装

2つのロール例:
- **"moderator"**: メッセージを削除できる
- **"admin"**: メッセージとチャンネルを削除できる

## 実装手順

1. ユーザーロールと権限のためのデータベーステーブルを作成
2. カスタムアクセストークンAuth Hookを使用してユーザーロールを適用
3. 行レベルセキュリティ（RLS）ポリシー用の`authorize`関数を作成
4. アクセストークンをデコードしてアプリケーションでカスタムクレームにアクセス

## 使用技術

- PostgreSQL
- PL/pgSQL
- JWT（JSON Web Token）
- Auth Hooks

## コード例

- ロールと権限テーブルを作成するSQL
- カスタムアクセストークンフック用のPL/pgSQL関数
- RLSポリシー認可関数

## JWTデコード用の推奨ライブラリ

- jwt-decode（JavaScript）
- express-jwt
- koa-jwt
- PyJWT
- dart_jsonwebtoken

このドキュメントは、Supabaseアプリケーション内でロールベースアクセス制御を実装するための包括的なガイドを提供します。
