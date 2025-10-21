# Postgresロール

## 概要

- Postgresはロールを使用してデータベースアクセス権限を管理します
- 主にデータベースへのシステムアクセスを構成するためのものです
- アプリケーションアクセスには、[行レベルセキュリティ（RLS）](/docs/guides/database/postgres/row-level-security)を使用してください
- RLS上にロールベースアクセス制御（RBAC）を実装できます

## ユーザー対ロール

- ロールはユーザーまたはユーザーのグループとして機能できます
- **ユーザー**: ログイン権限を持つロール
- **グループ**: ログイン権限のないロールで、権限管理に使用されます

## ロールの作成

```sql
create role "role_name";
```

## ユーザーの作成

```sql
create role "role_name" with login password 'extremely_secure_password';
```

## パスワードのベストプラクティス

- パスワードマネージャーを使用
- 最低12文字
- 辞書の単語を避ける
- 大文字小文字、数字、特殊記号を混在
- 接続文字列で特殊記号をパーセントエンコード

## プロジェクトパスワードの変更

- データベース設定のダッシュボードで更新
- 信頼できない第三者と共有しないでください
- 異なるサービスには別々のユーザーを作成
- パスワード変更はダウンタイムを引き起こしません

## 権限の付与

- `GRANT`コマンドを使用
- 権限: SELECT、INSERT、UPDATE、DELETE
- テーブル、ビュー、関数、トリガーに対して設定可能

## 権限の取り消し

```sql
REVOKE permission_type ON object_name FROM role_name;
```

## ロールの階層

- ロールは権限を継承できます
- 権限管理を簡素化します
- `NOINHERIT`を使用して継承を防ぐことができます

## Supabaseデフォルトロール

1. **`postgres`**: 管理者権限を持つデフォルトロール
2. **`anon`**: 未認証、公開アクセス
3. **`authenticator`**: JWT検証用の特別なAPIロール
4. **`authenticated`**: 認証済みアクセス
5. **`service_role`**: 昇格されたアクセス、RLSをバイパス
6. **`supabase_auth_admin`**: 認証ミドルウェアデータベースアクセス
7. **`supabase_storage_admin`**: ストレージミドルウェアデータベースアクセス
8. **`dashboard_user`**: Supabase UIコマンド用
9. **`supabase_admin`**: 内部管理ロール

## リソース

- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/current/user-manag.html)
