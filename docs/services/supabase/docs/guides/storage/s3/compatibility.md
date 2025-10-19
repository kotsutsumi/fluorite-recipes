# S3互換性

## 概要

Supabase StorageはS3プロトコルと互換性があり、以下が可能です:
- 任意のS3クライアントを使用してStorageオブジェクトとやり取り
- 複数のアップロードプロトコルを活用(標準、再開可能、S3)
- 異なるアップロード方式間での相互運用
- 署名付きURLにAWS Signature Version 4を使用

### 主な機能
- プロトコルは相互に交換可能(例: S3経由でアップロード、REST API経由でリスト)
- 署名付きURL生成をサポート
- 現在パブリックアルファ版

## 実装されているエンドポイント

このドキュメントでは、以下の詳細な互換性テーブルを提供しています:

### バケット操作
以下をサポート:
- ListBuckets
- HeadBucket
- CreateBucket
- DeleteBucket
- GetBucketLocation

### オブジェクト操作
以下のような様々な操作をサポート:
- HeadObject
- ListObjects
- GetObject
- PutObject
- DeleteObject
- マルチパートアップロード
- CopyObject

### 制限事項
以下のような多くの高度な機能はまだ実装されていません:
- サーバーサイド暗号化
- アクセスコントロールリスト(ACL)
- オブジェクトロック
- リクエストペイヤー設定

## 重要な注意事項

「S3プロトコルは現在パブリックアルファ版です。問題が発生した場合や機能リクエストがある場合は、[お問い合わせ](/dashboard/support/new)ください。」

## 使用例

### S3クライアントでのバケット一覧取得

```javascript
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  forcePathStyle: true,
  region: 'project_region',
  endpoint: 'https://project_ref.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'your_access_key_id',
    secretAccessKey: 'your_secret_access_key',
  }
});

const command = new ListBucketsCommand({});
const response = await client.send(command);
```

### オブジェクトのアップロード

```javascript
import { PutObjectCommand } from '@aws-sdk/client-s3';

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.txt',
  Body: fileContent,
});

const response = await client.send(command);
```

## プロトコル間の相互運用性

Supabase Storageでは、異なるプロトコル間でシームレスに作業できます:

1. S3プロトコルでファイルをアップロード
2. REST APIでファイルをリスト
3. 署名付きURLでファイルにアクセス

この柔軟性により、開発者は各ユースケースに最適なツールとプロトコルを選択できます。
