# Firebase Wrapper for Supabase

## 概要

Firebaseは、2つの主要なオブジェクトへの接続をサポートするアプリ開発プラットフォームです:
1. 認証ユーザー（読み取り専用）
2. Firestoreデータベースドキュメント（読み取り専用）

## 準備

### Wrappersを有効にする

wrappers拡張機能をインストールします:

```sql
create extension if not exists wrappers with schema extensions;
```

### Firebase Wrapperを有効にする

```sql
create foreign data wrapper firebase_wrapper
 handler firebase_fdw_handler
 validator firebase_fdw_validator;
```

### 認証情報を保存する（オプション）

安全な認証情報の保存にはVaultの使用を推奨します。

```sql
select vault.create_secret(
  '{
    "type": "service_account",
    "project_id": "your_gcp_project_id",
    ...
  }',
  'firebase',
  'Firebase API key for Wrappers'
);
```

### Firebaseに接続する

認証情報を使用してサーバーを作成します:

```sql
create server firebase_server
 foreign data wrapper firebase_wrapper
 options (
   sa_key_id '<key_ID>',
   project_id '<firebase_project_id>'
 );
```

### スキーマを作成する

```sql
create schema if not exists firebase;
```

## オプション

- `object`: 必須。Firebaseオブジェクト名を指定します
  - 認証の場合: `auth/users`
  - Firestoreの場合: `firestore/<collection_id>`

## エンティティ

### 認証ユーザー

| 操作 | サポート |
|----------|---------|
| Select   | ✅ |
| Insert   | ❌ |
| Update   | ❌ |
| Delete   | ❌ |
| Truncate | ❌ |

例:
```sql
create foreign table firebase.users (
  uid text,
  email text,
  created_at timestamp,
  attrs jsonb
) server firebase_server
options (
  object 'auth/users'
);
```

### Firestoreデータベースドキュメント

| 操作 | サポート |
|----------|---------|
| Select   | ✅ |
| Insert   | ❌ |
| Update   | ❌ |
| Delete   | ❌ |
| Truncate | ❌ |

例:
```sql
create foreign table firebase.my_collection (
  id text,
  data jsonb
) server firebase_server
options (
  object 'firestore/my_collection'
);
```

## クエリ

作成した外部テーブルに対してSQLクエリを実行できます:

```sql
select * from firebase.users;
select * from firebase.my_collection;
```

## 制限事項

- 読み取り専用のアクセスのみサポート
- Insert、Update、Delete、Truncate操作は利用不可
