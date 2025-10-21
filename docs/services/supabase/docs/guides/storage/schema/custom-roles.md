# カスタムロール

## 概要
「このガイドでは、Storageでカスタムロールを作成および使用して、オブジェクトとバケットへのロールベースのアクセスを管理する方法を学びます。」Supabase Storageはアクセス制御に行レベルセキュリティ(RLS)を使用します。

## カスタムロールの作成
特定のバケットへの読み取りアクセスを提供するために`manager`というカスタムロールを作成します:

```sql
create role 'manager';

-- authenticatorとanonロールにロールを付与することが重要
grant manager to authenticator;
grant anon to manager;
```

## ポリシーの作成
`manager`ロールに`teams`バケット内のオブジェクトへの完全な読み取り権限を与えるポリシーを作成します:

```sql
create policy "Manager can view all files in the bucket 'teams'"
on storage.objects
for select
to manager
using (
 bucket_id = 'teams'
);
```

## ポリシーのテスト
ポリシーをテストするには、`manager`ロールを持つJWTトークンを生成します:

```javascript
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'your-jwt-secret' // これを安全に保管してください
const USER_ID = '' // managerロールを与えたいユーザーID

const token = jwt.sign({ role: 'manager', sub: USER_ID }, JWT_SECRET, {
 expiresIn: '1h',
})

// トークンを使用してStorage APIにアクセス
const { StorageClient } = require('@supabase/storage-js')
const PROJECT_URL = 'https://your-project-id.supabase.co/storage/v1'
const storage = new StorageClient(PROJECT_URL, {
  authorization: `Bearer ${token}`,
})
```

**注意**: JWTシークレットは安全に保管し、フロントエンドコードに決して公開しないでください。

## 詳細な例

### 複数のロールとポリシー

```sql
-- 様々な権限レベルを持つ複数のロールを作成
create role 'viewer';
create role 'editor';
create role 'admin';

-- これらのロールをauthenticatorに付与
grant viewer to authenticator;
grant editor to authenticator;
grant admin to authenticator;
grant anon to viewer;
grant anon to editor;
grant anon to admin;

-- ビューアー: 読み取り専用アクセス
create policy "Viewers can read team files"
on storage.objects
for select
to viewer
using (
  bucket_id = 'team-documents'
);

-- エディター: 読み取りと書き込みアクセス
create policy "Editors can read team files"
on storage.objects
for select
to editor
using (
  bucket_id = 'team-documents'
);

create policy "Editors can upload team files"
on storage.objects
for insert
to editor
with check (
  bucket_id = 'team-documents'
);

create policy "Editors can update team files"
on storage.objects
for update
to editor
using (
  bucket_id = 'team-documents'
);

-- 管理者: フルアクセス
create policy "Admins have full access"
on storage.objects
for all
to admin
using (
  bucket_id = 'team-documents'
);

create policy "Admins can delete team files"
on storage.objects
for delete
to admin
using (
  bucket_id = 'team-documents'
);
```

### 部門ベースのアクセス制御

```sql
-- 部門別のロールを作成
create role 'sales_dept';
create role 'marketing_dept';
create role 'engineering_dept';

grant sales_dept to authenticator;
grant marketing_dept to authenticator;
grant engineering_dept to authenticator;
grant anon to sales_dept;
grant anon to marketing_dept;
grant anon to engineering_dept;

-- 営業部門は営業ファイルにのみアクセス可能
create policy "Sales department access"
on storage.objects
for all
to sales_dept
using (
  bucket_id = 'company-files' and
  (storage.foldername(name))[1] = 'sales'
);

-- マーケティング部門はマーケティングファイルにのみアクセス可能
create policy "Marketing department access"
on storage.objects
for all
to marketing_dept
using (
  bucket_id = 'company-files' and
  (storage.foldername(name))[1] = 'marketing'
);

-- エンジニアリング部門はエンジニアリングファイルにのみアクセス可能
create policy "Engineering department access"
on storage.objects
for all
to engineering_dept
using (
  bucket_id = 'company-files' and
  (storage.foldername(name))[1] = 'engineering'
);
```

## JWTトークンの生成

### Node.jsでの実装

```javascript
const jwt = require('jsonwebtoken');

function generateStorageToken(userId, role, jwtSecret) {
  return jwt.sign(
    {
      role: role,  // カスタムロール名
      sub: userId,  // ユーザーID
      aud: 'authenticated',
      iat: Math.floor(Date.now() / 1000),
    },
    jwtSecret,
    {
      expiresIn: '1h',
      algorithm: 'HS256',
    }
  );
}

// 使用例
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const token = generateStorageToken('user-uuid-123', 'manager', JWT_SECRET);

// Storage Clientで使用
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  token,  // カスタムトークンを使用
  {
    auth: {
      persistSession: false,
    },
  }
);
```

### Pythonでの実装

```python
import jwt
import datetime
import os

def generate_storage_token(user_id, role, jwt_secret):
    payload = {
        'role': role,
        'sub': user_id,
        'aud': 'authenticated',
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    return jwt.encode(payload, jwt_secret, algorithm='HS256')

# 使用例
JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')
token = generate_storage_token('user-uuid-123', 'manager', JWT_SECRET)

# Supabaseクライアントで使用
from supabase import create_client

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    token
)
```

## 動的なロール割り当て

### データベーステーブルでロールを管理

```sql
-- ユーザーロールを保存するテーブルを作成
create table public.user_roles (
  user_id uuid references auth.users primary key,
  role text not null,
  department text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLSを有効化
alter table public.user_roles enable row level security;

-- ユーザーは自分のロール情報を読み取れる
create policy "Users can view own role"
on public.user_roles
for select
using (auth.uid() = user_id);

-- ロール情報に基づいてストレージポリシーを作成
create policy "Role-based storage access"
on storage.objects
for select
using (
  bucket_id = 'protected' and
  (
    select role from public.user_roles where user_id = auth.uid()
  ) in ('manager', 'admin')
);
```

### アプリケーションでのロール取得

```javascript
// ユーザーのロールを取得してカスタムトークンを生成
async function getStorageClientWithRole(userId) {
  // データベースからユーザーのロールを取得
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !roleData) {
    throw new Error('Could not fetch user role');
  }

  // カスタムロールでトークンを生成
  const token = generateStorageToken(
    userId,
    roleData.role,
    process.env.SUPABASE_JWT_SECRET
  );

  // カスタムトークンでStorageクライアントを作成
  const { StorageClient } = require('@supabase/storage-js');
  return new StorageClient(
    process.env.SUPABASE_URL + '/storage/v1',
    {
      authorization: `Bearer ${token}`,
    }
  );
}

// 使用例
const storageClient = await getStorageClientWithRole('user-uuid-123');
const { data: files } = await storageClient.from('teams').list();
```

## 高度なロールベースのポリシー

### 時間ベースのアクセス制御

```sql
-- 営業時間中のみアクセスを許可
create policy "Business hours only access"
on storage.objects
for select
to manager
using (
  bucket_id = 'work-files' and
  extract(hour from now()) between 9 and 17 and
  extract(dow from now()) between 1 and 5  -- 月曜日から金曜日
);
```

### 条件付きアップロード制限

```sql
-- マネージャーはPDFのみアップロード可能
create policy "Managers upload PDFs only"
on storage.objects
for insert
to manager
with check (
  bucket_id = 'documents' and
  storage.extension(name) = 'pdf'
);

-- エディターは画像のみアップロード可能
create policy "Editors upload images only"
on storage.objects
for insert
to editor
with check (
  bucket_id = 'media' and
  storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);
```

### クォータベースのアクセス制御

```sql
-- ユーザーのストレージ使用量を追跡するテーブル
create table public.storage_quotas (
  user_id uuid references auth.users primary key,
  role text not null,
  max_storage_mb integer not null,
  used_storage_mb integer default 0
);

-- クォータに基づいてアップロードを制限
create policy "Quota-based upload limit"
on storage.objects
for insert
to manager
with check (
  bucket_id = 'user-files' and
  (
    select used_storage_mb < max_storage_mb
    from public.storage_quotas
    where user_id = auth.uid()
  )
);
```

## セキュリティのベストプラクティス

### 1. JWTシークレットの保護

```javascript
// ❌ 悪い: フロントエンドでJWTシークレットを公開
const token = jwt.sign({ role: 'admin' }, 'my-secret');

// ✅ 良い: バックエンドでのみトークンを生成
// API エンドポイント (Node.js/Express)
app.post('/api/get-storage-token', authenticateUser, async (req, res) => {
  const { data: user } = await getUserRole(req.user.id);

  const token = jwt.sign(
    { role: user.role, sub: req.user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});
```

### 2. ロール検証

```sql
-- ロールが有効であることを確認
create policy "Validate role before access"
on storage.objects
for select
using (
  bucket_id = 'secure-files' and
  current_setting('request.jwt.claim.role', true) in ('manager', 'admin', 'viewer')
);
```

### 3. 監査ログ

```sql
-- アクセスを追跡するためのログテーブル
create table public.storage_access_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  role text,
  bucket_id text,
  object_name text,
  action text,
  accessed_at timestamptz default now()
);

-- トリガーでアクセスをログ記録
create or replace function log_storage_access()
returns trigger as $$
begin
  insert into public.storage_access_logs (user_id, role, bucket_id, object_name, action)
  values (
    auth.uid(),
    current_setting('request.jwt.claim.role', true),
    NEW.bucket_id,
    NEW.name,
    TG_OP
  );
  return NEW;
end;
$$ language plpgsql;

create trigger storage_access_trigger
after insert or update or delete on storage.objects
for each row execute function log_storage_access();
```

## トラブルシューティング

### 一般的な問題

#### 1. ロールが機能しない

```sql
-- ロールが正しく設定されているか確認
select rolname from pg_roles where rolname in ('manager', 'viewer', 'editor');

-- ロールがauthenticatorに付与されているか確認
select * from pg_auth_members where roleid in (
  select oid from pg_roles where rolname in ('manager', 'viewer', 'editor')
);
```

#### 2. トークンが無効

```javascript
// トークンをデコードして検証
const jwt = require('jsonwebtoken');

try {
  const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
  console.log('Token is valid:', decoded);
} catch (error) {
  console.error('Token is invalid:', error.message);
}
```

#### 3. ポリシーが適用されない

```sql
-- ポリシーがテーブルに存在するか確認
select * from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%manager%';

-- RLSが有効になっているか確認
select tablename, rowsecurity
from pg_tables
where schemaname = 'storage' and tablename = 'objects';
```

## まとめ

カスタムロールを使用すると以下が可能になります:
- きめ細かいアクセス制御の実装
- 部門またはチームベースの権限の管理
- ユーザーの役割に基づいたストレージアクセスの分離
- 複雑な組織構造のサポート

重要な注意点:
- JWTシークレットを安全に保管
- バックエンドでのみトークンを生成
- ロールと権限を定期的に監査
- 適切なセキュリティポリシーを実装
- アクセスパターンを監視して異常を検出
