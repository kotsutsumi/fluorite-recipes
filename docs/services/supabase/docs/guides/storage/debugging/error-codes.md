# Supabase Storageエラーコード

このドキュメントでは、Storageサービスのエラーを処理するための2つの主要なエラーコードシステム(新しいシステムとレガシーシステム)について説明します。

## 新しいエラーコードシステム

新しいエラーコード形式:
```json
{
  "code": "error_code",
  "message": "error_message"
}
```

### 主要なエラーコード

注目すべきエラーコードには以下が含まれます:

#### 1. `NoSuchBucket` (404)
**説明**: バケットが存在しません

**原因**:
- バケット名のスペルミス
- バケットが削除されたまたは作成されていない
- 誤ったプロジェクトを参照

**解決方法**:
```javascript
// バケットの存在を確認
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Available buckets:', buckets.map(b => b.name));
```

#### 2. `NoSuchKey` (404)
**説明**: 指定されたキーが存在しません

**原因**:
- ファイルパスが正しくない
- ファイルが削除された
- 誤ったバケット名

**解決方法**:
```javascript
// ファイルの存在を確認
const { data: files } = await supabase.storage
  .from('bucket-name')
  .list('folder-path');
console.log('Available files:', files);
```

#### 3. `InvalidJWT` (401)
**説明**: 無効なJSON Web Token

**原因**:
- トークンの有効期限切れ
- 無効なトークン署名
- トークンが正しくフォーマットされていない

**解決方法**:
```javascript
// セッションを更新
const { data: { session }, error } = await supabase.auth.refreshSession();
if (error) console.error('Session refresh failed:', error);
```

#### 4. `EntityTooLarge` (413)
**説明**: アップロードがファイルサイズ制限を超えています

**原因**:
- ファイルがバケットのサイズ制限を超えている
- プランの制限を超えている

**解決方法**:
```javascript
// ファイルサイズを確認
const maxSize = 50 * 1024 * 1024; // 50MB
if (file.size > maxSize) {
  console.error('File too large. Maximum size is 50MB');
  return;
}

// または、バケットの制限を増やす
const { data, error } = await supabase.storage.updateBucket('bucket-name', {
  fileSizeLimit: 100 * 1024 * 1024 // 100MB
});
```

#### 5. `AccessDenied` (403)
**説明**: リソースへのアクセス権限が不足しています

**原因**:
- RLSポリシーがアクセスをブロック
- 無効な認証情報
- バケットが非公開で認証されていない

**解決方法**:
```javascript
// ユーザーが認証されているか確認
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  console.error('User not authenticated');
  return;
}

// RLSポリシーを確認
// ダッシュボードまたはSQLエディタでポリシーをレビュー
```

### その他の新しいエラーコード

| コード | HTTPステータス | 説明 |
|------|---------------|------|
| `InvalidBucketName` | 400 | バケット名が無効 |
| `BucketAlreadyExists` | 409 | バケットが既に存在 |
| `InvalidRange` | 416 | 無効な範囲ヘッダー |
| `MethodNotAllowed` | 405 | HTTPメソッドが許可されていない |
| `PreconditionFailed` | 412 | 前提条件が失敗 |

## レガシーエラーコード

レガシーエラー形式:
```json
{
  "httpStatusCode": 400,
  "code": "error_code",
  "message": "error_message"
}
```

### 一般的なレガシーエラーコード

#### 1. `not_found` (404)
**説明**: リソースが見つかりません

**例**:
```json
{
  "httpStatusCode": 404,
  "code": "not_found",
  "message": "Object not found"
}
```

**解決方法**:
- リソースパスを確認
- バケットとファイル名を検証
- リソースが削除されていないか確認

#### 2. `already_exists` (409)
**説明**: リソースが既に存在します

**例**:
```json
{
  "httpStatusCode": 409,
  "code": "already_exists",
  "message": "Bucket already exists"
}
```

**解決方法**:
```javascript
// 存在する場合は更新、存在しない場合は作成
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('file-path', file, {
    upsert: true // 既存のファイルを上書き
  });
```

#### 3. `unauthorized` (403)
**説明**: 権限が拒否されました

**例**:
```json
{
  "httpStatusCode": 403,
  "code": "unauthorized",
  "message": "Permission denied"
}
```

**解決方法**:
- ユーザー認証を確認
- RLSポリシーをレビュー
- バケットの権限を検証

#### 4. `too many requests` (429)
**説明**: 同時クライアント制限に達しました

**例**:
```json
{
  "httpStatusCode": 429,
  "code": "too many requests",
  "message": "Too many concurrent requests"
}
```

**解決方法**:
```javascript
// リトライロジックを実装
async function uploadWithRetry(bucket, path, file, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (!error || error.statusCode !== 429) {
      return { data, error };
    }

    // 指数バックオフで待機
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
  }
}
```

## エラー処理のベストプラクティス

### 1. 包括的なエラーハンドリング

```javascript
async function handleStorageOperation() {
  try {
    const { data, error } = await supabase.storage
      .from('bucket-name')
      .upload('file-path', file);

    if (error) {
      // エラーコードに基づいて処理
      switch (error.error || error.code) {
        case 'NoSuchBucket':
        case 'not_found':
          console.error('Bucket not found');
          break;
        case 'EntityTooLarge':
          console.error('File too large');
          break;
        case 'AccessDenied':
        case 'unauthorized':
          console.error('Permission denied');
          break;
        case 'InvalidJWT':
          // トークンを更新して再試行
          await refreshAuthToken();
          break;
        default:
          console.error('Unknown error:', error);
      }
      return null;
    }

    return data;
  } catch (exception) {
    console.error('Exception occurred:', exception);
    return null;
  }
}
```

### 2. ユーザーフレンドリーなエラーメッセージ

```javascript
function getUserFriendlyMessage(error) {
  const errorMessages = {
    'NoSuchBucket': 'ストレージバケットが見つかりません。',
    'NoSuchKey': 'ファイルが見つかりません。',
    'EntityTooLarge': 'ファイルサイズが大きすぎます。',
    'AccessDenied': 'このファイルにアクセスする権限がありません。',
    'InvalidJWT': 'セッションが期限切れです。再度ログインしてください。',
    'too many requests': '現在アクセスが集中しています。しばらく待ってから再試行してください。',
  };

  return errorMessages[error.error || error.code] || 'エラーが発生しました。もう一度お試しください。';
}

// 使用例
const { data, error } = await supabase.storage.from('bucket').upload('file', file);
if (error) {
  showUserMessage(getUserFriendlyMessage(error));
}
```

### 3. エラーのログ記録と監視

```javascript
function logStorageError(operation, error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    operation,
    errorCode: error.error || error.code,
    errorMessage: error.message,
    statusCode: error.statusCode || error.httpStatusCode,
    context,
  };

  console.error('Storage Error:', errorLog);

  // 外部監視サービスに送信
  // sendToMonitoring(errorLog);
}

// 使用例
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user123.png', file);

if (error) {
  logStorageError('upload', error, {
    bucket: 'avatars',
    fileName: 'user123.png',
    fileSize: file.size,
  });
}
```

## 推奨される解決方法

### 一般的なトラブルシューティング手順

1. **権限とRLSポリシーを確認**
   ```sql
   -- storage.objectsテーブルのポリシーを確認
   SELECT * FROM pg_policies WHERE tablename = 'objects';
   ```

2. **JWTと認証ヘッダーを検証**
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session);
   console.log('Token expires at:', new Date(session?.expires_at * 1000));
   ```

3. **リソース名とパスを確認**
   ```javascript
   // すべてのバケットをリスト
   const { data: buckets } = await supabase.storage.listBuckets();

   // バケット内のファイルをリスト
   const { data: files } = await supabase.storage
     .from('bucket-name')
     .list();
   ```

4. **リクエスト率と接続プーリングを管理**
   ```javascript
   // 同時アップロードを制限
   const limit = pLimit(5); // 最大5つの同時アップロード

   const uploads = files.map(file =>
     limit(() => supabase.storage.from('bucket').upload(file.name, file))
   );

   await Promise.all(uploads);
   ```

## まとめ

Storageエラーコードを理解することは、以下のために重要です:
- 効果的なエラーハンドリングの実装
- より良いユーザーエクスペリエンスの提供
- 問題の迅速な診断とトラブルシューティング
- 堅牢なストレージ操作の構築

エラーを適切に処理し、ユーザーに明確なフィードバックを提供し、問題を監視して、信頼性の高いストレージ統合を確保してください。
