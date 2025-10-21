# セキュリティ

Vercel Blobは[すべてのプラン](/docs/plans)で利用可能です。

[オーナー、メンバー、開発者](/docs/rbac/access-roles#owner, member, developer-role)ロールを持つユーザーがこの機能にアクセスできます。

## セキュリティの特徴

### URL アクセス

Vercel Blob URLは、`addRandomSuffix: true`オプションを使用すると、公開アクセス可能で、推測が困難な一意のURLになります。これらのURLは以下で構成されます：

- 一意のストアID
- パス名
- ファイル作成時に生成される一意のランダムBlobID

これは、Google Docsの「[ファイルを公開で共有](https://support.google.com/drive/answer/2494822?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Cshare-a-file-publicly)」に似ています。URLは承認されたユーザーにのみ共有されるべきです。

### セキュリティヘッダー

各Blobに対して、不正なダウンロードを防ぎ、外部コンテンツの埋め込みをブロックし、悪意のあるファイルタイプの操作から保護するヘッダーが適用されます：

- `content-security-policy`: `default-src "none"`
- `x-frame-options`: `DENY`
- `x-content-type-options`: `nosniff`
- `content-disposition`: `attachment/inline; filename="filename.extension"`

### 暗号化

Vercel Blobに保存されるすべてのファイルは、AES-256暗号化で保護されています。この暗号化プロセスは透過的で、追加の設定は不要です。

## アクセス制御

### Public vs Private

```typescript
// パブリックアクセス（URLを知っている人なら誰でもアクセス可能）
const publicBlob = await put('public-file.png', file, {
  access: 'public',
});

// プライベートアクセス（読み取りトークンが必要）
const privateBlob = await put('private-file.png', file, {
  access: 'private',
});
```

### 読み取りトークン

プライベートBlobにアクセスするには、読み取りトークンが必要です：

```typescript
import { head } from '@vercel/blob';

const blob = await head('https://your-blob-url.com/file.png', {
  token: process.env.BLOB_READ_WRITE_TOKEN,
});
```

## ベストプラクティス

### トークンの管理

- 読み書きトークンは環境変数として安全に保管
- クライアントに直接トークンを公開しない
- 定期的にトークンをローテーション

### ファイルバリデーション

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      // 許可するコンテンツタイプを制限
      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
        tokenPayload: JSON.stringify({}),
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      // アップロード完了後のバリデーション
      console.log('Upload completed:', blob);
    },
  });

  return NextResponse.json(jsonResponse);
}
```

### ファイルサイズ制限

- クライアントアップロードでファイルサイズを制限
- サーバーサイドでもバリデーションを実施

### コンテンツタイプの検証

- アップロード前にファイルタイプを検証
- `allowedContentTypes`で許可するタイプを明示的に指定

## セキュリティインシデントへの対応

### 不正なファイルの削除

```typescript
import { del } from '@vercel/blob';

// 不正なファイルを削除
await del('https://your-blob-url.com/malicious-file.png');
```

### アクセスログの確認

Vercelダッシュボードで、Blobストレージのアクセスログを定期的に確認します。

## コンプライアンス

Vercel Blobは、以下のセキュリティ標準に準拠しています：

- SOC 2 Type II
- GDPR
- CCPA

## 次のステップ

- [例](/docs/vercel-blob/examples)を参照
- [使用量と料金](/docs/vercel-blob/usage-and-pricing)
- [Blob SDK](/docs/vercel-blob/using-blob-sdk)の詳細
