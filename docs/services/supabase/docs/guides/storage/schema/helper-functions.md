# Storageヘルパー関数

## Storageスキーマについて学ぶ

Supabase Storageは、RLSポリシーを記述する際に使用できるSQLヘルパー関数を提供します。

## ヘルパー関数

### `storage.filename()`

ファイルの名前を返します。例えば、ファイルが`public/subfolder/avatar.png`に保存されている場合、`'avatar.png'`を返します。

**使用方法**:
```sql
create policy "Allow public downloads"
on storage.objects
for select
to public
using (
 storage.filename(name) = 'favicon.ico'
);
```

**実用例**:

```sql
-- 特定のファイル名のみダウンロードを許可
create policy "Allow specific file download"
on storage.objects
for select
to public
using (
  bucket_id = 'public-assets' and
  storage.filename(name) in ('logo.png', 'favicon.ico', 'banner.jpg')
);

-- PDFファイルのみダウンロードを許可
create policy "Allow PDF downloads"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents' and
  storage.filename(name) like '%.pdf'
);
```

### `storage.foldername()`

ファイルが属するすべてのサブフォルダを含む配列パスを返します。例えば、ファイルが`public/subfolder/avatar.png`に保存されている場合、`[ 'public', 'subfolder' ]`を返します。

**使用方法**:
```sql
create policy "Allow authenticated uploads"
on storage.objects
for insert
to authenticated
with check (
 (storage.foldername(name))[1] = 'private'
);
```

**実用例**:

```sql
-- ユーザーは自分のフォルダにのみアップロード可能
create policy "Users can upload to own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-files' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 特定のフォルダ構造を強制
create policy "Enforce folder structure"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'organized-files' and
  (storage.foldername(name))[1] = 'uploads' and
  (storage.foldername(name))[2] = auth.uid()::text
);

-- publicフォルダへの読み取りアクセスを許可
create policy "Allow public folder access"
on storage.objects
for select
to public
using (
  bucket_id = 'shared' and
  (storage.foldername(name))[1] = 'public'
);

-- 複数レベルのフォルダパスをチェック
create policy "Department folder access"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'company-files' and
  (storage.foldername(name))[1] = 'departments' and
  (storage.foldername(name))[2] = current_setting('request.jwt.claim.department', true)
);
```

### `storage.extension()`

ファイルの拡張子を返します。例えば、ファイルが`public/subfolder/avatar.png`に保存されている場合、`'png'`を返します。

**使用方法**:
```sql
create policy "Only allow PNG uploads"
on storage.objects
for insert
to authenticated
with check (
 bucket_id = 'cats' and storage.extension(name) = 'png'
);
```

**実用例**:

```sql
-- 画像ファイルのみ許可
create policy "Only allow image uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'images' and
  storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- ドキュメントファイルのみ許可
create policy "Only allow document uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents' and
  storage.extension(name) in ('pdf', 'doc', 'docx', 'txt', 'md')
);

-- 動画ファイルのアップロードを制限
create policy "Restrict video uploads to premium users"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media' and
  (
    storage.extension(name) not in ('mp4', 'mov', 'avi', 'mkv') or
    (select is_premium from public.users where id = auth.uid())
  )
);

-- 実行可能ファイルを禁止
create policy "Block executable uploads"
on storage.objects
for insert
to authenticated
with check (
  storage.extension(name) not in ('exe', 'bat', 'sh', 'cmd', 'bin')
);
```

## 組み合わせた例

### 複数のヘルパー関数を使用した複雑なポリシー

```sql
-- ユーザーは自分のフォルダに画像のみアップロード可能
create policy "User folder image uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-uploads' and
  (storage.foldername(name))[1] = auth.uid()::text and
  storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- publicフォルダの画像は誰でもダウンロード可能
create policy "Public image downloads"
on storage.objects
for select
to public
using (
  bucket_id = 'shared-media' and
  (storage.foldername(name))[1] = 'public' and
  storage.extension(name) in ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- 管理者は特定のフォルダにPDFをアップロード可能
create policy "Admin PDF uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'company-docs' and
  (storage.foldername(name))[1] = 'official' and
  storage.extension(name) = 'pdf' and
  (select role from public.users where id = auth.uid()) = 'admin'
);

-- ユーザーは自分のプロフィール画像のみ更新可能
create policy "Update own profile picture"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text and
  storage.filename(name) = 'profile.jpg'
);
```

### ファイルサイズとタイプの検証

```sql
-- 小さな画像ファイルのみ許可(メタデータと組み合わせ)
create policy "Small images only"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'thumbnails' and
  storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp') and
  (metadata->>'size')::int < 5242880  -- 5MB未満
);
```

### フォルダレベルの権限

```sql
-- チーム別のフォルダアクセス
create policy "Team folder access"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'team-files' and
  (storage.foldername(name))[1] = (
    select team_id::text from public.users where id = auth.uid()
  )
);

-- 階層的なフォルダ構造
create policy "Hierarchical folder structure"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'organized' and
  array_length(storage.foldername(name), 1) >= 2 and
  (storage.foldername(name))[1] = 'users' and
  (storage.foldername(name))[2] = auth.uid()::text
);
```

### 削除ポリシー

```sql
-- ユーザーは自分のファイルのみ削除可能
create policy "Delete own files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user-content' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 管理者のみ特定のファイルタイプを削除可能
create policy "Admin delete restricted files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'protected' and
  storage.extension(name) in ('pdf', 'docx') and
  (select role from public.users where id = auth.uid()) = 'admin'
);
```

## ベストプラクティス

### 1. ファイル命名規則の適用

```sql
-- ファイル名形式を検証
create policy "Enforce naming convention"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'uploads' and
  -- ファイル名はユーザーIDで始まる必要がある
  storage.filename(name) ~ ('^' || auth.uid()::text || '_')
);
```

### 2. フォルダ構造の保護

```sql
-- ルートレベルのアップロードを防止
create policy "Prevent root level uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'organized-bucket' and
  array_length(storage.foldername(name), 1) > 0
);
```

### 3. ファイルタイプのセキュリティ

```sql
-- 危険なファイルタイプをブロック
create policy "Block dangerous file types"
on storage.objects
for insert
to authenticated
with check (
  storage.extension(name) not in (
    'exe', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'js', 'jar'
  )
);
```

### 4. 条件付きアクセス

```sql
-- プレミアムユーザーのみ大きなファイルをアップロード可能
create policy "Premium users large files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'premium-content' and
  (
    (metadata->>'size')::bigint < 10485760 or  -- 10MB未満は全員OK
    (select is_premium from public.users where id = auth.uid())
  )
);
```

## パフォーマンスの考慮事項

### インデックスの最適化

ヘルパー関数を使用するポリシーのパフォーマンスを向上させるために、適切なインデックスを作成します:

```sql
-- パスベースのクエリを高速化
CREATE INDEX idx_objects_path_tokens
ON storage.objects USING gin(path_tokens);

-- ファイル名パターンマッチングを高速化
CREATE INDEX idx_objects_name
ON storage.objects(name text_pattern_ops);
```

### 効率的なポリシー設計

```sql
-- 良い: 最も制限的なチェックを最初に
create policy "Efficient policy"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'specific-bucket' and  -- 高速なチェック
  (storage.foldername(name))[1] = auth.uid()::text and  -- 中程度
  storage.extension(name) in ('jpg', 'png')  -- 低速なチェック
);

-- 悪い: 複雑なチェックが最初
create policy "Inefficient policy"
on storage.objects
for insert
to authenticated
with check (
  storage.extension(name) in ('jpg', 'png') and  -- 最初に評価
  (storage.foldername(name))[1] = auth.uid()::text and
  bucket_id = 'specific-bucket'  -- 最後に評価
);
```

## トラブルシューティング

### ポリシーのテスト

```sql
-- 特定のファイルパスでヘルパー関数をテスト
SELECT
  'users/123/documents/report.pdf' as full_path,
  storage.filename('users/123/documents/report.pdf') as filename,
  storage.foldername('users/123/documents/report.pdf') as folders,
  storage.extension('users/123/documents/report.pdf') as extension;

-- 結果:
-- filename: 'report.pdf'
-- folders: ['users', '123', 'documents']
-- extension: 'pdf'
```

### 一般的な問題

```sql
-- 問題: フォルダ名が空の配列
-- 原因: ルートレベルのファイル
SELECT storage.foldername('file.txt');  -- 結果: []

-- 解決: 配列の長さをチェック
create policy "Check folder exists"
on storage.objects
for insert
with check (
  array_length(storage.foldername(name), 1) > 0
);

-- 問題: 拡張子がないファイル
-- 原因: ファイル名にドットがない
SELECT storage.extension('README');  -- 結果: ''

-- 解決: 空の拡張子を処理
create policy "Handle no extension"
on storage.objects
for insert
with check (
  storage.extension(name) != '' and
  storage.extension(name) in ('jpg', 'png', 'pdf')
);
```

## まとめ

Storageヘルパー関数は以下のために不可欠です:
- きめ細かいアクセス制御の実装
- ファイル命名規則の適用
- フォルダベースの権限の作成
- ファイルタイプの制限の適用

これらの関数を他のRLSポリシー機能と組み合わせることで、安全で柔軟なストレージアクセス制御を構築できます。
