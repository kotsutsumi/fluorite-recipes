# Storageスキーマ

## Storageスキーマについて学ぶ

StorageはPostgresを使用してバケットとオブジェクトに関するメタデータを保存します。ユーザーはアクセス制御にRLS(行レベルセキュリティ)ポリシーを使用できます。このデータは、プロジェクト内の`storage`という専用スキーマに保存されます。

> SQLを扱う際は、Storageテーブルのすべてのレコードを読み取り専用と見なすことが重要です。すべての操作は**APIを通じてのみ**行う必要があります。

重要な注意事項:
- storageスキーマはメタデータのみを保存
- 実際のオブジェクトはS3などのプロバイダーに保存
- メタデータの削除は基礎となるオブジェクトを削除しません
- メタデータの削除により、オブジェクトにアクセスできなくなる可能性がありますが、課金は継続されます

## スキーマ表現

Storageサービス構造を示すスキーマ設計図が提供されています。

## Storageのクエリ

APIを使用せずに、ストレージテーブルを直接クエリしてファイル情報を取得できます。

### 基本的なクエリ例

```sql
-- すべてのバケットをリスト
SELECT * FROM storage.buckets;

-- 特定のバケット内のオブジェクトをリスト
SELECT * FROM storage.objects
WHERE bucket_id = 'my-bucket';

-- オブジェクトのメタデータを取得
SELECT
  name,
  bucket_id,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'avatars' AND name LIKE 'user_%';
```

### 高度なクエリ例

```sql
-- バケット別のファイル数と合計サイズ
SELECT
  bucket_id,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::bigint) as total_size_bytes,
  SUM((metadata->>'size')::bigint) / 1048576 as total_size_mb
FROM storage.objects
GROUP BY bucket_id;

-- 最近アップロードされたファイル
SELECT
  name,
  bucket_id,
  created_at,
  (metadata->>'mimetype') as mime_type,
  (metadata->>'size')::bigint as size_bytes
FROM storage.objects
ORDER BY created_at DESC
LIMIT 10;

-- 特定のユーザーのファイルを検索
SELECT
  o.name,
  o.bucket_id,
  o.created_at,
  (o.metadata->>'size')::bigint as size_bytes
FROM storage.objects o
WHERE o.owner = 'user-uuid-here'
ORDER BY o.created_at DESC;

-- ファイル拡張子別の統計
SELECT
  regexp_replace(name, '.*\.', '') as extension,
  COUNT(*) as count,
  SUM((metadata->>'size')::bigint) as total_size
FROM storage.objects
WHERE name ~ '\.'
GROUP BY extension
ORDER BY count DESC;
```

## スキーマの変更

**推奨事項:**
- `storage`スキーマを読み取り専用として扱う
- 将来の更新との潜在的な競合を防ぐため、スキーマの変更を避ける
- RLSポリシーのパフォーマンスを向上させるためのカスタムインデックスは推奨されます

このドキュメントは、すべてのストレージ操作にSupabase APIを使用することの重要性を強調し、直接的なスキーマ変更に対して警告しています。

## Storageスキーマの構造

### 主要なテーブル

#### 1. storage.buckets

バケットのメタデータを保存します。

```sql
-- バケットテーブルの構造
CREATE TABLE storage.buckets (
  id text PRIMARY KEY,
  name text UNIQUE NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false,
  avif_autodetection boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[]
);
```

**主要なカラム:**
- `id`: バケットの一意の識別子
- `name`: バケット名
- `owner`: バケットの所有者(ユーザーUUID)
- `public`: バケットが公開アクセス可能かどうか
- `file_size_limit`: 最大ファイルサイズ(バイト)
- `allowed_mime_types`: 許可されるMIMEタイプの配列

#### 2. storage.objects

個々のファイルオブジェクトのメタデータを保存します。

```sql
-- objectsテーブルの主要な構造
CREATE TABLE storage.objects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_id text REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz,
  metadata jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  version text
);
```

**主要なカラム:**
- `id`: オブジェクトの一意の識別子
- `bucket_id`: 親バケットの参照
- `name`: オブジェクトのフルパス
- `owner`: オブジェクトの所有者
- `metadata`: ファイルメタデータ(サイズ、MIMEタイプなど)を含むJSON
- `path_tokens`: パス操作用の生成カラム

### メタデータフィールド

`metadata` JSONBカラムには以下が含まれます:

```json
{
  "size": 1048576,
  "mimetype": "image/jpeg",
  "cacheControl": "max-age=3600",
  "contentLength": 1048576,
  "httpStatusCode": 200,
  "eTag": "\"abc123\"",
  "lastModified": "2024-01-15T10:30:00Z"
}
```

### メタデータのクエリ

```sql
-- 特定のMIMEタイプのファイルを検索
SELECT name, bucket_id, metadata->>'size' as size
FROM storage.objects
WHERE metadata->>'mimetype' = 'image/jpeg';

-- 特定のサイズより大きいファイルを検索
SELECT name, bucket_id, (metadata->>'size')::bigint as size_bytes
FROM storage.objects
WHERE (metadata->>'size')::bigint > 10485760  -- 10MB以上
ORDER BY (metadata->>'size')::bigint DESC;

-- 最近アクセスされたファイル
SELECT name, bucket_id, last_accessed_at
FROM storage.objects
WHERE last_accessed_at IS NOT NULL
ORDER BY last_accessed_at DESC
LIMIT 20;
```

## パフォーマンスの最適化

### カスタムインデックスの追加

RLSポリシーで頻繁に使用されるカラムにインデックスを作成します:

```sql
-- バケットとパスに基づくクエリを高速化
CREATE INDEX idx_objects_bucket_name
ON storage.objects(bucket_id, name);

-- 所有者ベースのクエリを高速化
CREATE INDEX idx_objects_owner
ON storage.objects(owner);

-- パストークンベースの検索を高速化
CREATE INDEX idx_objects_path_tokens
ON storage.objects USING gin(path_tokens);

-- メタデータベースの検索を高速化
CREATE INDEX idx_objects_metadata
ON storage.objects USING gin(metadata);

-- MIMEタイプベースのクエリを高速化
CREATE INDEX idx_objects_mimetype
ON storage.objects((metadata->>'mimetype'));
```

### インデックスの使用例

```sql
-- パスパターンによる効率的な検索
SELECT * FROM storage.objects
WHERE bucket_id = 'avatars'
  AND 'users' = ANY(path_tokens);

-- 所有者による効率的なフィルタリング
SELECT * FROM storage.objects
WHERE owner = 'user-uuid'
  AND bucket_id = 'private-files';

-- MIMEタイプによる効率的な検索
SELECT * FROM storage.objects
WHERE metadata->>'mimetype' LIKE 'image/%'
  AND bucket_id = 'media';
```

## スキーマのベストプラクティス

### 1. 読み取り専用アクセス

```sql
-- 良い: クエリでメタデータを読み取る
SELECT name, metadata FROM storage.objects WHERE bucket_id = 'my-bucket';

-- 悪い: 直接テーブルを変更
-- UPDATE storage.objects SET name = 'new-name' WHERE id = 'some-id';
-- 代わりにAPI経由で操作を行う
```

### 2. RLSポリシーとの統合

```sql
-- ストレージスキーマを活用するRLSポリシー
CREATE POLICY "Users see own files"
ON storage.objects FOR SELECT
USING (auth.uid() = owner);

CREATE POLICY "Users in folder"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'shared'
  AND path_tokens[1] = auth.uid()::text
);
```

### 3. 分析クエリ

```sql
-- バケット使用状況レポート
SELECT
  b.name as bucket_name,
  b.public,
  COUNT(o.id) as file_count,
  SUM((o.metadata->>'size')::bigint) as total_size_bytes,
  AVG((o.metadata->>'size')::bigint) as avg_file_size,
  MAX(o.created_at) as last_upload
FROM storage.buckets b
LEFT JOIN storage.objects o ON b.id = o.bucket_id
GROUP BY b.id, b.name, b.public
ORDER BY total_size_bytes DESC;

-- ユーザー別のストレージ使用状況
SELECT
  owner,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::bigint) / 1048576 as total_mb
FROM storage.objects
WHERE owner IS NOT NULL
GROUP BY owner
ORDER BY total_mb DESC;

-- ファイルタイプの分布
SELECT
  metadata->>'mimetype' as mime_type,
  COUNT(*) as count,
  SUM((metadata->>'size')::bigint) / 1048576 as total_mb
FROM storage.objects
GROUP BY metadata->>'mimetype'
ORDER BY count DESC;
```

## 警告と制限事項

### 直接変更を避ける

```sql
-- これらの操作は避けてください:

-- ❌ オブジェクトメタデータの直接更新
UPDATE storage.objects SET metadata = '{}' WHERE id = 'some-id';

-- ❌ レコードの直接削除
DELETE FROM storage.objects WHERE id = 'some-id';

-- ❌ バケット設定の直接変更
UPDATE storage.buckets SET public = true WHERE id = 'my-bucket';

-- ✅ 代わりにSupabase APIを使用:
-- supabase.storage.from('bucket').remove(['file.txt'])
-- supabase.storage.updateBucket('bucket', { public: true })
```

### データの整合性

- メタデータの削除は実際のファイルを削除しません
- 孤立したオブジェクト(メタデータなし)が課金される可能性があります
- 常にAPI操作を使用してメタデータと実際のファイルの同期を確保

### スキーマの進化

- Supabaseの更新により`storage`スキーマが変更される可能性があります
- カスタム変更は将来のマイグレーションで競合する可能性があります
- パフォーマンスインデックスは安全ですが、文書化してください

## まとめ

Storageスキーマは以下を理解するために重要です:
- Supabase Storageがメタデータを保存する方法
- 効率的なクエリとレポートの作成方法
- RLSポリシーの適切な実装方法
- パフォーマンスの最適化方法

常にSupabase APIを使用して操作を行い、読み取り専用のクエリにのみ直接スキーマアクセスを使用し、システムの整合性を維持するためにカスタム変更を避けてください。
