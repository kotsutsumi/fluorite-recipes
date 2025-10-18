# Clerk Wrapper for Supabase

## 概要

「Clerkは、ユーザーを認証および管理するための、埋め込み可能なUI、柔軟なAPI、管理ダッシュボードの完全なスイートです。」Clerk WrapperはWebAssembly（Wasm）外部データラッパーで、Postgresデータベース内でClerkのデータを読み取ることができます。

## 利用可能なバージョン

| バージョン | Wasmパッケージ URL | チェックサム | 必要なWrappersバージョン |
|---------|-----------------|----------|------------------------|
| 0.2.0 | `https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.2.0/clerk_fdw.wasm` | `89337bb11779d4d654cd3e54391aabd02509d213db6995f7dd58951774bf0e37` | >=0.5.0 |
| 0.1.0 | `https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.1.0/clerk_fdw.wasm` | `613be26b59fa4c074e0b93f0db617fcd7b468d4d02edece0b1f85fdb683ebdc4` | >=0.4.0 |

## 準備

### Wrappersの有効化

```sql
create extension if not exists wrappers with schema extensions;
```

### Clerk Wrapperの有効化

```sql
create foreign data wrapper wasm_wrapper
  handler wasm_fdw_handler
  validator wasm_fdw_validator;
```

### 認証情報の保存（オプション）

セキュアな認証情報の保存にはVaultの使用を推奨します:

```sql
select vault.create_secret(
  '<Clerk API key>',
  'clerk',
  'Clerk API key for Wrappers'
);
```

### Clerkへの接続

#### Vaultを使用してサーバーを作成:

```sql
create server clerk_server
  foreign data wrapper wasm_wrapper
  options (
    fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.2.0/clerk_fdw.wasm',
    fdw_package_name 'supabase:clerk-fdw',
    fdw_package_version '0.2.0',
    fdw_package_checksum '89337bb11779d4d654cd3e54391aabd02509d213db6995f7dd58951774bf0e37',
    api_key_id 'clerk'
  );
```

#### APIキーを直接使用してサーバーを作成:

```sql
create server clerk_server
  foreign data wrapper wasm_wrapper
  options (
    fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.2.0/clerk_fdw.wasm',
    fdw_package_name 'supabase:clerk-fdw',
    fdw_package_version '0.2.0',
    fdw_package_checksum '89337bb11779d4d654cd3e54391aabd02509d213db6995f7dd58951774bf0e37',
    api_key '<Clerk API key>'
  );
```

注: Clerk APIキーは、[Clerk Dashboard](https://dashboard.clerk.com/)から取得できます。

### スキーマの作成

```sql
create schema if not exists clerk;
```

## 利用可能なオブジェクト

Clerk Wrapperは、以下のClerkオブジェクトにアクセスできます:

- Users（ユーザー）
- Organizations（組織）

## 外部テーブルオプション

完全なオプションリストは、Wrapperメタデータで利用可能です:

```sql
select
  *
from
  wrappers.wrappers_fdw_meta
where
  name = 'supabase:clerk-fdw';
```

### Users（ユーザー）

Clerk Usersオブジェクトの外部テーブル。

参照: [Clerk Users API](https://clerk.com/docs/reference/backend-api/tag/Users)

#### オプション

- `object`: `users`に設定（必須）
- `limit`: 取得するレコード数の制限（オプション、デフォルト: 10）
- `offset`: オフセット（オプション）
- `email_address`: メールアドレスでフィルタリング（オプション）
- `phone_number`: 電話番号でフィルタリング（オプション）
- `username`: ユーザー名でフィルタリング（オプション）
- `user_id`: ユーザーIDでフィルタリング（オプション）
- `organization_id`: 組織IDでフィルタリング（オプション）
- `order_by`: 並び替えフィールド（オプション、例: `created_at`、`-created_at`）

#### 使用例

```sql
create foreign table clerk.users (
  id text,
  first_name text,
  last_name text,
  email_addresses jsonb,
  phone_numbers jsonb,
  username text,
  profile_image_url text,
  created_at bigint,
  updated_at bigint,
  last_sign_in_at bigint,
  attrs jsonb
)
  server clerk_server
  options (
    object 'users',
    limit '100'
  );
```

#### クエリ例

すべてのユーザーを取得:

```sql
select * from clerk.users;
```

特定のメールアドレスでフィルタリング:

```sql
select * from clerk.users where email_addresses @> '[{"email_address": "user@example.com"}]';
```

### Organizations（組織）

Clerk Organizationsオブジェクトの外部テーブル。

参照: [Clerk Organizations API](https://clerk.com/docs/reference/backend-api/tag/Organizations)

#### オプション

- `object`: `organizations`に設定（必須）
- `limit`: 取得するレコード数の制限（オプション、デフォルト: 10）
- `offset`: オフセット（オプション）
- `query`: 検索クエリ（オプション）
- `order_by`: 並び替えフィールド（オプション）

#### 使用例

```sql
create foreign table clerk.organizations (
  id text,
  name text,
  slug text,
  members_count bigint,
  max_allowed_memberships bigint,
  admin_delete_enabled boolean,
  public_metadata jsonb,
  private_metadata jsonb,
  created_at bigint,
  updated_at bigint,
  attrs jsonb
)
  server clerk_server
  options (
    object 'organizations',
    limit '100'
  );
```

#### クエリ例

すべての組織を取得:

```sql
select * from clerk.organizations;
```

特定の名前で検索:

```sql
select * from clerk.organizations where name ilike '%acme%';
```

## クエリのプッシュダウン

Clerk Wrapperは現在、クエリのプッシュダウンをサポートしていません。すべてのフィルタリングはPostgres側で実行されます。

## サポートされているデータ型

| Postgres型 | Clerk型 |
|-----------|---------|
| text | String |
| bigint | Number |
| boolean | Boolean |
| jsonb | Object/Array |

## 制限事項

- 読み取り専用のラッパーです（挿入、更新、削除は不可）
- クエリのプッシュダウンはサポートされていません
- `limit`オプションで指定した件数までしか取得できません
- 大量のデータを取得する場合は、ページネーションが必要です

## トラブルシューティング

### APIキーエラー

エラー: `Invalid API key`

Clerk APIキーが正しいこと、およびClerk Dashboardから取得した最新のキーであることを確認してください。

### Wasmパッケージのダウンロードエラー

エラー: `Failed to download Wasm package`

- インターネット接続を確認してください
- `fdw_package_url`が正しいことを確認してください
- チェックサムが一致することを確認してください

### データが取得できない

- `limit`オプションを調整してください
- Clerk Dashboardでデータが存在することを確認してください
- APIキーに適切な権限があることを確認してください

## ベストプラクティス

1. **Vaultを使用する**: APIキーはVaultに保存することを推奨します
2. **適切なlimit設定**: 必要な件数のみを取得するよう`limit`を設定します
3. **定期的な同期**: Clerkのデータを定期的にローカルテーブルに同期することを検討してください
4. **エラーハンドリング**: APIレート制限を考慮したエラーハンドリングを実装します

## 関連リンク

- [Clerk公式ドキュメント](https://clerk.com/docs)
- [Clerk API リファレンス](https://clerk.com/docs/reference/backend-api)
- [Supabase Wrappers](https://supabase.github.io/wrappers/)
