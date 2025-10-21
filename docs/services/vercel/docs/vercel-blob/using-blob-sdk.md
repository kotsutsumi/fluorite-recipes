# @vercel/blob

Vercel Blobは、すべてのプランで利用可能なストレージサービスです。オーナー、メンバー、開発者の役割を持つユーザーがこの機能にアクセスできます。

## はじめに

### Blob ストアの作成

1. プロジェクトの「ストレージ」タブに移動
2. 「データベースに接続」ボタンを選択
3. 「新規作成」タブで「Blob」を選択
4. ストア名を入力し、読み書きトークンを含める環境を選択

### ローカルプロジェクトの準備

環境変数 `BLOB_READ_WRITE_TOKEN` が自動的に作成されます。ローカルで使用するには、Vercel CLIで環境変数をプルします：

```bash
vercel env pull
```

## 読み書きトークン

読み書きトークンは、Blob SDKと対話するために必要です。以下のデプロイメントオプションがあります：

- 同じVercelプロジェクト内でデプロイする場合、トークンパラメータは不要
- 異なるVercelプロジェクトの場合、環境変数を作成
- Vercel外でデプロイする場合、トークン値を直接渡す

## SDKメソッド

### ブロブのアップロード

`put()` メソッドを使用してブロブをアップロードします：

```typescript
import { put } from '@vercel/blob';

const blob = await put(file.name, file, {
  access: 'public',
  addRandomSuffix: true,
});
```

### パラメータ

- `pathname`: ブロブのパス名（文字列）
- `body`: アップロードするコンテンツ
- `options`: オプション設定
  - `access`: 'public' または 'private'
  - `addRandomSuffix`: ランダムなサフィックスを追加（推奨）
  - `contentType`: コンテンツタイプの指定
  - `cacheControlMaxAge`: キャッシュの最大期間（秒）

### ブロブの読み取り

```typescript
import { head } from '@vercel/blob';

const blob = await head('https://your-blob-url.com/file.png');
console.log(blob.size);
console.log(blob.uploadedAt);
```

### ブロブのリスト表示

```typescript
import { list } from '@vercel/blob';

const { blobs } = await list();
console.log(blobs);
```

### ブロブの削除

```typescript
import { del } from '@vercel/blob';

await del('https://your-blob-url.com/file.png');
```

### マルチパートアップロード

大きなファイルをアップロードする場合、3つの方法があります：

1. **シンプルアップロード**: 4.5MB以下のファイル
2. **マルチパートアップロード**: 大きなファイルを分割してアップロード
3. **クライアントアップロード**: ブラウザから直接アップロード

```typescript
import { put } from '@vercel/blob';

// マルチパートアップロードは自動的に処理されます
const blob = await put('large-file.mp4', file, {
  access: 'public',
  multipart: true,
});
```

## ベストプラクティス

- `addRandomSuffix: true` を使用して、ファイル名の競合を避ける
- 適切な `contentType` を指定する
- 大きなファイルにはマルチパートアップロードを使用する
- 不要なブロブは定期的に削除する

## エラーハンドリング

```typescript
try {
  const blob = await put('file.png', file, { access: 'public' });
} catch (error) {
  console.error('Upload failed:', error);
}
```

## 次のステップ

- [使用量と料金](/docs/vercel-blob/usage-and-pricing)
- [セキュリティ](/docs/vercel-blob/security)
- [例](/docs/vercel-blob/examples)
