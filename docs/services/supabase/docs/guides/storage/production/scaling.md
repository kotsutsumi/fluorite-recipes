# Storageの最適化

## Storageのスケーリング

このドキュメントは、Supabase Storageのスケーリング時にパフォーマンスを向上させ、コストを削減するためのいくつかの最適化戦略を提供します:

## エグレスの最適化

### 1. 画像のリサイズ
- 画像は通常、エグレス帯域幅の大部分を消費します
- Supabaseの「画像変換」サービスを使用して、画像をオンザフライで最適化

**実装例**:
```javascript
// 画像変換を使用して画像をリサイズ
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-avatar.jpg', {
    transform: {
      width: 400,
      height: 400,
      resize: 'cover',
      quality: 80
    }
  });

// さまざまなサイズのレスポンシブ画像
const sizes = [
  { width: 400, name: 'thumbnail' },
  { width: 800, name: 'medium' },
  { width: 1200, name: 'large' }
];

const images = sizes.map(size => ({
  name: size.name,
  url: supabase.storage
    .from('photos')
    .getPublicUrl('photo.jpg', {
      transform: { width: size.width }
    }).data.publicUrl
}));
```

### 2. 高いCache-Control値を設定
- ブラウザキャッシングを活用して繰り返しのダウンロードを削減
- 初回ダウンロード後、アセットをユーザーのブラウザに保存

**実装例**:
```javascript
// 長期キャッシュ - 静的アセット用
const { data, error } = await supabase.storage
  .from('public-assets')
  .upload('logo.png', file, {
    cacheControl: '31536000',  // 1年 = 365日 * 24時間 * 60分 * 60秒
    upsert: false
  });

// 中期キャッシュ - 時々更新されるコンテンツ用
await supabase.storage
  .from('blog-images')
  .upload('header.jpg', file, {
    cacheControl: '86400',  // 1日
  });

// 短期キャッシュ - 頻繁に更新されるコンテンツ用
await supabase.storage
  .from('dynamic-content')
  .upload('news-banner.jpg', file, {
    cacheControl: '3600',  // 1時間
  });
```

### 3. アップロードサイズを制限
- バケットレベルで最大アップロードサイズを設定
- ユーザーが過度に大きなファイルをアップロードおよびダウンロードすることを防止

**実装例**:
```javascript
// バケット作成時にファイルサイズ制限を設定
const { data, error } = await supabase.storage.createBucket('user-uploads', {
  public: false,
  fileSizeLimit: 10485760,  // 10MB in bytes
  allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
});

// 既存のバケットを更新
const { data: updateData, error: updateError } = await supabase.storage
  .updateBucket('existing-bucket', {
    fileSizeLimit: 5242880,  // 5MB
  });

// クライアントサイドでアップロード前にファイルサイズを検証
async function uploadWithSizeCheck(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE) {
    return {
      error: {
        message: 'File size exceeds 10MB limit',
        status: 413
      }
    };
  }

  return await supabase.storage
    .from('user-uploads')
    .upload(`${Date.now()}-${file.name}`, file);
}
```

### 4. Smart CDN
- より高いキャッシュヒット率を実現
- CDNでコンテンツをキャッシュすることでエグレスコストを削減

**注意**: Smart CDNはProプラン以上で自動的に有効になります。

```javascript
// Smart CDNは自動的に動作しますが、最適化できます:

// 1. 適切なCache-Controlヘッダーを設定
await supabase.storage
  .from('static-files')
  .upload('asset.js', file, {
    cacheControl: '31536000',  // 長期キャッシュ
    contentType: 'application/javascript'
  });

// 2. バージョン管理されたURLを使用してキャッシュをバスト
const version = Date.now();
const { data } = supabase.storage
  .from('scripts')
  .getPublicUrl(`app.js?v=${version}`);

// 3. 頻繁に更新されるアセットには新しいパスを使用
const fileName = `user-profile-${userId}-${Date.now()}.jpg`;
await supabase.storage
  .from('avatars')
  .upload(fileName, file);
```

## オブジェクトリストの最適化

大量のオブジェクトを扱う場合、標準の`supabase.storage.list()`メソッドは遅くなる可能性があります。このドキュメントでは、オブジェクトリストを最適化するためのカスタムPostgres関数を提供します:

```sql
create or replace function list_objects(
    bucketid text,
    prefix text,
    limits int default 100,
    offsets int default 0
) returns table (
    name text,
    id uuid,
    updated_at timestamptz,
    created_at timestamptz,
    last_accessed_at timestamptz,
    metadata jsonb
) as $$
begin
    return query SELECT
        objects.name,
        objects.id,
        objects.updated_at,
        objects.created_at,
        objects.last_accessed_at,
        objects.metadata
    FROM storage.objects
    WHERE objects.name like prefix || '%'
    AND bucket_id = bucketid
    ORDER BY name ASC
    LIMIT limits
    OFFSET offsets;
end;
$$ language plpgsql stable;
```

**使用例**:

```javascript
// カスタム関数を使用してオブジェクトをリスト
const { data, error } = await supabase.rpc('list_objects', {
  bucketid: 'my-bucket',
  prefix: 'folder/subfolder/',
  limits: 100,
  offsets: 0
});

// ページネーション付きリスト
async function listObjectsPaginated(bucket, prefix, pageSize = 100) {
  let page = 0;
  let allObjects = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.rpc('list_objects', {
      bucketid: bucket,
      prefix: prefix,
      limits: pageSize,
      offsets: page * pageSize
    });

    if (error) {
      console.error('Error listing objects:', error);
      break;
    }

    allObjects = allObjects.concat(data);
    hasMore = data.length === pageSize;
    page++;
  }

  return allObjects;
}

// 使用例
const objects = await listObjectsPaginated('user-files', 'uploads/', 50);
console.log(`Total objects: ${objects.length}`);
```

## RLS(行レベルセキュリティ)の最適化

- ストレージテーブルのRLSポリシーで使用されるカラムにインデックスを追加
- ルックアップパフォーマンスの高速化に役立ちます

**実装例**:

```sql
-- 所有者ベースのクエリを高速化
CREATE INDEX IF NOT EXISTS idx_storage_objects_owner
ON storage.objects(owner);

-- バケットとパスベースのクエリを高速化
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name
ON storage.objects(bucket_id, name);

-- パストークンベースの検索を高速化(フォルダアクセス用)
CREATE INDEX IF NOT EXISTS idx_storage_objects_path_tokens
ON storage.objects USING gin(path_tokens);

-- メタデータベースのクエリを高速化
CREATE INDEX IF NOT EXISTS idx_storage_objects_metadata
ON storage.objects USING gin(metadata);

-- よく使用される特定のメタデータフィールドにインデックス
CREATE INDEX IF NOT EXISTS idx_storage_objects_mimetype
ON storage.objects((metadata->>'mimetype'));

-- 作成日時でソートする場合
CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at
ON storage.objects(bucket_id, created_at DESC);
```

**最適化されたRLSポリシーの例**:

```sql
-- インデックスを活用する最適化されたポリシー
create policy "Optimized user file access"
on storage.objects
for select
using (
  bucket_id = 'user-files'
  and owner = auth.uid()  -- idx_storage_objects_ownerを使用
);

create policy "Optimized folder access"
on storage.objects
for select
using (
  bucket_id = 'shared-files'
  and auth.uid()::text = ANY(path_tokens)  -- idx_storage_objects_path_tokensを使用
);

create policy "Optimized image access"
on storage.objects
for select
using (
  bucket_id = 'media'
  and metadata->>'mimetype' like 'image/%'  -- idx_storage_objects_mimetypeを使用
);
```

## 追加の最適化戦略

### 並列アップロード

```javascript
// 並列アップロードを制限して最適化
import pLimit from 'p-limit';

async function uploadMultipleFiles(files, bucketName) {
  const limit = pLimit(5);  // 最大5つの同時アップロード

  const uploads = files.map(file =>
    limit(async () => {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return { file: file.name, error };
      }

      return { file: file.name, data };
    })
  );

  return await Promise.all(uploads);
}

// 使用例
const files = document.getElementById('file-input').files;
const results = await uploadMultipleFiles(Array.from(files), 'user-uploads');
console.log('Upload results:', results);
```

### 再開可能なアップロード

```javascript
// 大きなファイルの再開可能なアップロード
async function resumableUpload(file, bucketName) {
  const chunkSize = 6 * 1024 * 1024; // 6MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(
        `${file.name}.part${i}`,
        chunk,
        {
          upsert: true,
          contentType: file.type
        }
      );

    if (error) {
      console.error(`Chunk ${i} failed:`, error);
      // リトライロジックを実装
      continue;
    }

    console.log(`Uploaded chunk ${i + 1}/${totalChunks}`);
  }

  // すべてのチャンクを結合(サーバーサイドで実装)
}
```

### プログレッシブ画像ローディング

```javascript
// プレースホルダー画像を使用したプログレッシブローディング
function getProgressiveImageUrls(imagePath) {
  const bucket = supabase.storage.from('images');

  return {
    // 小さなぼかしプレースホルダー(~5KB)
    placeholder: bucket.getPublicUrl(imagePath, {
      transform: {
        width: 50,
        quality: 50,
        resize: 'cover'
      }
    }).data.publicUrl,

    // 中サイズのプレビュー(~50KB)
    preview: bucket.getPublicUrl(imagePath, {
      transform: {
        width: 400,
        quality: 70
      }
    }).data.publicUrl,

    // フルサイズ画像
    full: bucket.getPublicUrl(imagePath).data.publicUrl
  };
}

// React コンポーネントでの使用
function ProgressiveImage({ imagePath }) {
  const [currentSrc, setCurrentSrc] = useState(null);
  const urls = getProgressiveImageUrls(imagePath);

  useEffect(() => {
    // プレースホルダーから開始
    setCurrentSrc(urls.placeholder);

    // プレビュー画像をプリロード
    const previewImg = new Image();
    previewImg.src = urls.preview;
    previewImg.onload = () => setCurrentSrc(urls.preview);

    // フル画像をプリロード
    const fullImg = new Image();
    fullImg.src = urls.full;
    fullImg.onload = () => setCurrentSrc(urls.full);
  }, [imagePath]);

  return <img src={currentSrc} alt="Progressive loading" />;
}
```

### ストレージメトリクスの監視

```javascript
// ストレージ使用状況の監視
async function getStorageMetrics(bucketName) {
  const { data, error } = await supabase.rpc('get_storage_metrics', {
    bucket: bucketName
  });

  return data;
}

// Postgres関数
```

```sql
create or replace function get_storage_metrics(bucket text)
returns table (
  total_files bigint,
  total_size_mb numeric,
  avg_file_size_mb numeric,
  largest_file_mb numeric
) as $$
begin
  return query
  select
    count(*)::bigint as total_files,
    round((sum((metadata->>'size')::bigint) / 1048576.0)::numeric, 2) as total_size_mb,
    round((avg((metadata->>'size')::bigint) / 1048576.0)::numeric, 2) as avg_file_size_mb,
    round((max((metadata->>'size')::bigint) / 1048576.0)::numeric, 2) as largest_file_mb
  from storage.objects
  where bucket_id = bucket;
end;
$$ language plpgsql;
```

## パフォーマンスのベストプラクティス

このガイドでは、以下のテクニックがストレージのパフォーマンスを向上させ、アプリケーションのスケールに伴うコストを削減するのに役立つことを強調しています:

1. **画像最適化**: 常に適切なサイズと品質で画像を提供
2. **キャッシュ戦略**: アセットタイプに基づいて適切なCache-Controlヘッダーを設定
3. **サイズ制限**: 不必要に大きなアップロードを防止
4. **Smart CDN**: Proプラン以上でCDNキャッシングを活用
5. **効率的なクエリ**: 大規模なリストにはカスタムPostgres関数を使用
6. **インデックス最適化**: RLSポリシーで使用されるカラムにインデックスを追加
7. **並列化**: 同時操作を制御して最適なパフォーマンスを実現
8. **監視**: メトリクスを追跡してボトルネックを特定

これらの最適化を実装することで、コストを管理しながらSupabase Storageを効果的にスケールできます。