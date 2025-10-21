# Storageトラブルシューティング

提供されたWebページのコンテンツに基づいて、これはSupabase Storageのトラブルシューティングドキュメントページです。このページは、ファイルアップロードの問題、バケット設定、セキュリティポリシーなど、一般的なストレージの問題に関するトラブルシューティングガイドを検索または閲覧するための概要を提供します。

**タイトル**: "Storageトラブルシューティング"

**説明**: "ファイルアップロードの問題、バケット設定、セキュリティポリシーなど、一般的なストレージの問題に関するトラブルシューティングガイドを検索または閲覧します。"

## マッチするトラブルシューティングエントリ

### 1. "Supabaseのエグレスについて"
- **製品**: Platform、Database、Functions、Storage、Realtime、Auth、Supavisor
- **日付**: 9月16日

**概要**: Supabaseのエグレス(データ転送出力)に関する包括的なガイド。ストレージからのデータダウンロード、API呼び出し、その他のデータ転送に関連するコストと制限について説明します。

### 2. "Proプロジェクトの一時停止"
- **製品**: Platform、CLI、Storage
- **日付**: 10月10日

**概要**: Proプランのプロジェクトを一時停止する方法と、ストレージデータへの影響について説明します。プロジェクトの一時停止中もストレージデータは保持されますが、アクセスは制限されます。

### 3. "ファイルアップロードサイズの制限"
- **製品**: Storage
- **日付**: 9月9日

**概要**: ファイルアップロードのサイズ制限に関する詳細情報。バケットレベルでの制限設定方法と、大きなファイルをアップロードする際のベストプラクティスを提供します。

### 4. "パブリックバケットでアップロード/リストなどができないのはなぜですか?"
- **製品**: Storage
- **日付**: 1月15日

**概要**: パブリックバケットでの一般的な問題とその解決方法。RLS(行レベルセキュリティ)ポリシーの設定ミスや権限の問題についてのトラブルシューティングガイドを提供します。

## 追加リソース

- [サポートに連絡](https://supabase.com/support)
- [変更ログ](https://supabase.com/changelog)
- [システムステータス](https://status.supabase.com/)

このページは、開発者がSupabase Storageに関連する様々な製品とシナリオにわたる一般的な問題の解決策を見つけるのを支援するために設計されています。

## よくある問題と解決方法

### ファイルアップロードの問題

#### 問題: ファイルがアップロードできない

**一般的な原因**:
1. RLSポリシーが適切に設定されていない
2. ファイルサイズがバケットの制限を超えている
3. 認証トークンが無効または期限切れ
4. バケットが存在しないまたはアクセスできない

**解決方法**:

```javascript
// 1. RLSポリシーを確認
// ダッシュボードでStorage > Policies を確認

// 2. ファイルサイズを確認
const maxSize = 50 * 1024 * 1024; // 50MB
if (file.size > maxSize) {
  console.error('File is too large');
}

// 3. 認証状態を確認
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  console.error('User not authenticated');
}

// 4. バケットの存在を確認
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Available buckets:', buckets);
```

#### 問題: アップロードが途中で失敗する

**解決方法**:
```javascript
// リトライロジックを実装
async function uploadWithRetry(path, file, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data, error } = await supabase.storage
        .from('bucket-name')
        .upload(path, file);

      if (!error) return { data, error: null };

      if (i === maxRetries - 1) return { data: null, error };

      // 指数バックオフで待機
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    } catch (exception) {
      if (i === maxRetries - 1) throw exception;
    }
  }
}
```

### バケット設定の問題

#### 問題: パブリックバケットでファイルにアクセスできない

**解決方法**:

```sql
-- パブリックバケット用のRLSポリシーを作成
-- すべてのユーザーに読み取りアクセスを許可
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'public-bucket-name' );

-- 認証されたユーザーにアップロードを許可
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'public-bucket-name' );
```

#### 問題: バケットのファイルサイズ制限を変更できない

**解決方法**:
```javascript
// バケット設定を更新
const { data, error } = await supabase.storage.updateBucket('bucket-name', {
  public: true,
  fileSizeLimit: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
});

if (error) {
  console.error('Failed to update bucket:', error);
}
```

### セキュリティポリシーの問題

#### 問題: RLSポリシーが期待通りに機能しない

**診断方法**:

```sql
-- 現在のポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 特定のユーザーのポリシーをテスト
SET ROLE authenticated;
SET request.jwt.claim.sub = 'user-uuid-here';

-- テストクエリを実行
SELECT * FROM storage.objects
WHERE bucket_id = 'test-bucket';

-- ロールをリセット
RESET ROLE;
```

**一般的なRLSポリシーパターン**:

```sql
-- パターン1: ユーザー自身のファイルのみアクセス許可
create policy "Users can access own files"
on storage.objects for all
using ( auth.uid()::text = (storage.foldername(name))[1] );

-- パターン2: 特定のフォルダへのアクセス制限
create policy "Access specific folder"
on storage.objects for select
using (
  bucket_id = 'private'
  and (storage.foldername(name))[1] = 'public'
);

-- パターン3: ファイルタイプに基づく制限
create policy "Only images allowed"
on storage.objects for insert
with check (
  bucket_id = 'images'
  and storage.extension(name) in ('jpg', 'png', 'gif')
);
```

### パフォーマンスの問題

#### 問題: ファイルリストの取得が遅い

**解決方法**:

```javascript
// ページネーションを使用
async function listFilesWithPagination(bucket, folder, limit = 100) {
  let allFiles = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        offset,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      break;
    }

    allFiles = allFiles.concat(data);
    hasMore = data.length === limit;
    offset += limit;
  }

  return allFiles;
}
```

#### 問題: ダウンロード速度が遅い

**解決方法**:

```javascript
// CDNを活用し、適切なCache-Controlヘッダーを設定
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('file.jpg', file, {
    cacheControl: '3600', // 1時間キャッシュ
    upsert: false
  });

// Smart CDNを使用(Proプラン以上)
// 自動的により高いキャッシュヒット率を実現
```

### エグレスコストの問題

#### 問題: 予期しないエグレスコスト

**診断と最適化**:

```javascript
// 1. 画像のリサイズを使用
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 800,
      height: 600,
      resize: 'cover'
    }
  });

// 2. 長いCache-Controlヘッダーを設定
await supabase.storage
  .from('static-assets')
  .upload('logo.png', file, {
    cacheControl: '31536000' // 1年
  });

// 3. アップロードサイズを制限
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  return { error: 'File too large' };
}

// 4. Smart CDNを活用(Proプラン以上)
// ダッシュボードで自動的に有効
```

### プロジェクト一時停止の問題

#### 問題: 一時停止後にストレージにアクセスできない

**理解と解決**:

1. **Freeプラン**: 7日間の非アクティブ後、プロジェクトが一時停止
2. **Proプラン**: 手動で一時停止可能
3. **影響**: 一時停止中はストレージAPIへのアクセス不可

**解決方法**:
- プロジェクトを再開
- 定期的なアクティビティでFreeプランの自動一時停止を防ぐ
- 重要なプロジェクトにはProプラン以上を使用

```javascript
// プロジェクトが一時停止されているか確認
const { data, error } = await supabase.storage.listBuckets();
if (error && error.message.includes('paused')) {
  console.error('Project is paused. Please resume in dashboard.');
}
```

## デバッグのベストプラクティス

### 1. 詳細なエラーログを有効化

```javascript
// すべてのストレージ操作をログ
async function debugStorageOperation(operation, ...args) {
  console.log(`Storage operation: ${operation}`, args);

  const startTime = Date.now();
  const result = await supabase.storage[operation](...args);
  const duration = Date.now() - startTime;

  console.log(`Operation completed in ${duration}ms`, result);

  if (result.error) {
    console.error(`Error in ${operation}:`, result.error);
  }

  return result;
}

// 使用例
await debugStorageOperation('from', 'bucket').upload('file.txt', file);
```

### 2. ネットワークリクエストを監視

ブラウザの開発者ツールのNetworkタブを使用して:
- リクエスト/レスポンスのヘッダーを確認
- ペイロードサイズを確認
- レスポンスタイムを測定
- エラーステータスコードを特定

### 3. RLSポリシーをテスト

```sql
-- 特定のユーザーとしてポリシーをテスト
DO $$
DECLARE
  test_user_id uuid := 'user-uuid-here';
BEGIN
  -- ユーザーとして設定
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);

  -- ポリシーをテスト
  PERFORM * FROM storage.objects WHERE bucket_id = 'test-bucket';

  -- 結果を確認
  RAISE NOTICE 'Policy test completed';
END $$;
```

## 追加のトラブルシューティングリソース

### 公式リソース
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage)
- [Storage Schema Documentation](https://supabase.com/docs/guides/storage/schema/design)

### コミュニティサポート
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### システムステータス
- [Supabase Status Page](https://status.supabase.com/) - リアルタイムのシステムステータスと既知の問題を確認

問題が解決しない場合は、[サポートに連絡](https://supabase.com/support)して、詳細なエラーログと再現手順を提供してください。
