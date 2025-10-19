# ファイルストレージ

## 概要

Edge Functionsは2種類のファイルストレージを提供します:

1. **永続ストレージ**
   - S3プロトコルでバックアップ
   - Supabase Storageを含む、任意のS3互換バケットから読み書き可能

2. **エフェメラルストレージ**
   - `/tmp`ディレクトリへのファイルの読み書き
   - 一時的な操作にのみ適しています

## ユースケース

ファイルストレージは以下の用途で使用できます:
- 複雑なファイル変換とワークフローの処理
- プロジェクト間のデータ移行の実行
- ユーザーがアップロードしたファイルの処理
- アーカイブの解凍と、データベースに保存する前のコンテンツの処理

## 永続ストレージ

### 設定

S3バケットにアクセスするには、Edge Function Secretsに次の環境変数を設定します:
- `S3FS_ENDPOINT_URL`
- `S3FS_REGION`
- `S3FS_ACCESS_KEY_ID`
- `S3FS_SECRET_ACCESS_KEY`

```bash
supabase secrets set S3FS_ENDPOINT_URL=https://your-endpoint.com
supabase secrets set S3FS_REGION=us-east-1
supabase secrets set S3FS_ACCESS_KEY_ID=your-access-key
supabase secrets set S3FS_SECRET_ACCESS_KEY=your-secret-key
```

### 使用例

```typescript
// S3バケットから読み取り
const data = await Deno.readFile('/s3/my-bucket/results.csv')

// ディレクトリを作成
await Deno.mkdir('/s3/my-bucket/sub-dir')

// S3バケットに書き込み
await Deno.writeTextFile('/s3/my-bucket/demo.txt', 'hello world')
```

### Supabase Storageとの使用

Supabase Storage バケットにアクセスする場合:

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // S3ファイルシステムを介してStorageバケットにアクセス
  const fileContent = await Deno.readFile('/s3/storage/public/avatars/user.png')

  // または、Supabaseクライアントを使用
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabase.storage
    .from('public')
    .download('avatars/user.png')

  return new Response(fileContent)
})
```

## エフェメラルストレージ

- 各関数の呼び出しごとにリセットされます
- ファイルは同じ呼び出し内でのみ読み取り可能です
- Deno File System APIまたは`node:fs`モジュールを使用します

### 使用例

```typescript
Deno.serve(async (req) => {
  if (req.headers.get('content-type') !== 'application/zip') {
    return new Response('file must be a zip file', { status: 400 })
  }

  const uploadId = crypto.randomUUID()
  await Deno.writeFile('/tmp/' + uploadId, req.body)

  // /tmpのファイルを処理
  const zipFile = await Deno.readFile('/tmp/' + uploadId)

  // ZIPファイルを解凍して処理
  // ... 処理ロジック ...

  // クリーンアップ（オプション - 次の呼び出しで自動的にクリアされます）
  await Deno.remove('/tmp/' + uploadId)

  return new Response('Processed successfully')
})
```

### Node.js互換性

Node.js `fs`モジュールも使用できます:

```typescript
import { writeFile, readFile } from 'node:fs/promises'

Deno.serve(async (req) => {
  const tempPath = '/tmp/temp-file.txt'

  // ファイルを書き込み
  await writeFile(tempPath, 'temporary content')

  // ファイルを読み取り
  const content = await readFile(tempPath, 'utf-8')

  return new Response(content)
})
```

## ベストプラクティス

1. **永続ストレージ**
   - 関数の呼び出し間で保持する必要があるデータに使用
   - 適切なエラー処理を実装
   - S3認証情報を安全に保管

2. **エフェメラルストレージ**
   - 一時的なファイル処理にのみ使用
   - ファイルは次の呼び出しで利用できないことを想定
   - 大きなファイルはメモリ制限に注意

3. **パフォーマンス**
   - 大きなファイルはストリーミング処理を検討
   - ファイル操作を最小限に抑える
   - 可能な限りメモリ内処理を使用

## 制限事項

- エフェメラルストレージは関数のメモリ制限（256MB）の一部です
- `/tmp`ディレクトリのファイルは関数の呼び出し間で永続化されません
- 永続ストレージはS3互換バケットのみサポート
