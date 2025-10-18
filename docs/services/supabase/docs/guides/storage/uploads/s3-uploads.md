# S3アップロード

## 概要

S3プロトコルを使用してSupabase Storageにファイルをアップロードできます。S3プロトコルは2種類のファイルアップロードをサポートしています:

1. 単一リクエスト
2. マルチパートアップロードによる複数リクエスト

## 単一リクエストアップロード

`PutObject`アクションは、単一のリクエストでファイルをアップロードします。これはSupabase SDKの標準アップロードと同様です。この方法は小さなファイルに適しており、有料プランでは最大500GBまでのファイルサイズに対応しています。

JavaScriptと`aws-sdk`クライアントを使用した例:

```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({...})

const file = fs.createReadStream('path/to/file')

const uploadCommand = new PutObjectCommand({
  Bucket: 'bucket-name',
  Key: 'path/to/file',
  Body: file,
  ContentType: 'image/jpeg',
})

await s3Client.send(uploadCommand)
```

## マルチパートアップロード

マルチパートアップロードは、ファイルを小さな部分に分割し、並列でアップロードすることで、高速ネットワークでのアップロード速度を最大化します。この方法では、ネットワークの問題が発生した場合に個別のパートを再試行できます。

再開可能性よりも速度を優先する場合のサーバーサイドアップロードに推奨されます。有料プランでは最大500GBまでのファイルサイズに対応しています。

JavaScriptを使用した例:

```javascript
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const s3Client = new S3Client({...})

const file = fs.createReadStream('path/to/very-large-file')

const upload = new Upload(s3Client, {
  Bucket: 'bucket-name',
  Key: 'path/to/file',
  ContentType: 'image/jpeg',
  Body: file,
})

await uploader.done()
```

### マルチパートアップロードの中止

マルチパートアップロードは24時間後に自動的に中止されます。[`AbortMultipartUpload`](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html)を使用して、手動でアップロードを中止することもできます。
