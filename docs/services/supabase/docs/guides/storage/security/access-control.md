# Storage アクセス制御

Supabase Storageは、Postgresの[行レベルセキュリティ](/docs/guides/database/postgres/row-level-security)（RLS）と完璧に連携するように設計されています。

RLSを使用して[セキュリティアクセスポリシー](https://www.postgresql.org/docs/current/sql-createpolicy.html)を作成できます。これは「非常に強力で柔軟性があり、ビジネスニーズに基づいてアクセスを制限できます。」

## アクセスポリシー

デフォルトでは、StorageはRLSポリシーなしでバケットへのアップロードを許可しません。`storage.objects`テーブルにRLSポリシーを作成することで、特定の操作を選択的に許可します。

ストレージスキーマのドキュメントは[こちら](/docs/guides/storage/schema/design)で確認でき、ポリシー作成を簡素化するために、これらの[ヘルパー関数](/docs/guides/storage/schema/helper-functions)を利用できます。

### ポリシーの要件

- オブジェクトをアップロードするには、`storage.objects`テーブルに`INSERT`権限を付与します
- `upsert`を使用してファイルを上書きするには、さらに`SELECT`と`UPDATE`権限を付与します

## ポリシーの例

以下はRLSポリシーの例です:

1. 基本的なINSERTポリシー:
```sql
create policy "policy_name"
ON storage.objects
for insert with check (
 true
);
```

2. 特定のバケット内の認証済みユーザーへのアップロードを制限:
```sql
create policy "policy_name"
on storage.objects
for insert to authenticated
with check (
 bucket_id = 'my_bucket_id'
);
```

3. 特定のフォルダへのアップロードを許可:
```sql
create policy "Allow authenticated uploads"
on storage.objects
for insert to authenticated
with check (
 bucket_id = 'my_bucket_id' and
 (storage.foldername(name))[1] = 'private'
);
```

4. ユーザーが自分のアップロードしたファイルにアクセスできるようにする:
```sql
create policy "Individual user Access"
on storage.objects
for select
to authenticated
using ( (select auth.uid()) = owner_id::uuid );
```

## アクセス制御のバイパス

独自のサーバーなどの信頼できるクライアントからStorageを使用する場合、アクセス制御をバイパスできます。
