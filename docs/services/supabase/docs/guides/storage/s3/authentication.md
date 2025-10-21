# S3認証

Supabase Storage S3での認証について学びます。

## 認証オプション

Supabase Storage S3で認証するための2つの主要な方法があります:

1. プロジェクト設定から生成されたS3アクセスキーを使用(サーバーサイドのみ)
2. ユーザーのJWTトークンを使用したセッショントークンで、行レベルセキュリティ(RLS)による制限付きアクセスを提供

## S3アクセスキー

### 重要なセキュリティ警告
「S3アクセスキーは、すべてのバケットにわたってすべてのS3操作への完全なアクセスを提供し、RLSポリシーをバイパスします。これらはサーバー上でのみ使用することを意図しています。」

### 認証プロセス
- アクセスキーIDとシークレットアクセスキーを生成
- プロジェクト設定ページからエンドポイントとリージョンをコピー
- これらの認証情報を使用してS3互換サービスに接続

#### 設定例(aws-sdk-js):
```javascript
import { S3Client } from '@aws-sdk/client-s3';
const client = new S3Client({
  forcePathStyle: true,
  region: 'project_region',
  endpoint: 'https://project_ref.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'your_access_key_id',
    secretAccessKey: 'your_secret_access_key',
  }
})
```

### パフォーマンスのヒント
「大きなファイルをアップロードする際の最適なパフォーマンスのために、常に直接のストレージホスト名を使用する必要があります。」

## セッショントークン認証

### 主な機能
- ユーザーのJWTトークンで認証
- RLSによる制限付きアクセスを提供
- サーバーサイドまたはクライアントサイドのS3クライアント初期化に有用

### 認証情報
- `access_key_id`: プロジェクトリファレンス
- `secret_access_key`: 匿名キー
- `session_token`: 有効なJWTトークン

#### 例(aws-sdk):
```javascript
const { data: { session } } = await supabase.auth.getSession()
const client = new S3Client({
  forcePathStyle: true,
  region: 'project_region',
  endpoint: 'https://project_ref.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'project_ref',
    secretAccessKey: 'anon_key',
    sessionToken: session.access_token,
  }
})
```

## セキュリティのベストプラクティス

- S3アクセスキーは決してクライアントサイドで公開しないでください
- サーバーサイドの操作にのみS3アクセスキーを使用
- クライアントサイドのアクセスにはセッショントークン認証を使用
- 定期的にアクセスキーをローテーション
- 適切なRLSポリシーを設定して不正アクセスを防止
