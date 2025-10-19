# Vercel Blobを使用したクライアントアップロード

## 前提条件

Vercel Blobは[すべてのプラン](/docs/plans)で利用可能です。

[所有者、メンバー、開発者](/docs/rbac/access-roles#owner-member-developer-role)ロールを持つユーザーがこの機能にアクセスできます。

このガイドでは、以下を学習します：

- Vercelダッシュボードを使用してプロジェクトに接続されたBlobストアを作成する
- ブラウザからBlobSDKを使用してファイルをアップロードする

## 前提条件

任意のフロントエンドフレームワークで動作します。まず、パッケージをインストールします：

```bash
pnpm i @vercel/blob
```

## Blobストアの作成

1. アップロード先のプロジェクトに移動
2. ストレージタブを選択
3. 「データベースに接続」ボタンを選択
4. 「新規作成」タブで「Blob」を選択
5. 「続行」ボタンをクリック
6. 名前を「Images」に設定
7. 新しいBlobストアを作成
8. 読み書きトークンを含める環境を選択

## ローカルプロジェクトの準備

自動的に以下の環境変数が作成されます：
- `BLOB_READ_WRITE_TOKEN`

ローカルで使用するには、Vercel CLIで以下を実行：

```bash
vercel env pull
```

## クライアントアップロードの実装

4.5MB以上のファイルをアップロードする場合、クライアントアップロードを使用できます。

### API ルートの作成

```typescript
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
```

### クライアントコンポーネント

```typescript
'use client';

import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const file = inputFileRef.current?.files?.[0];

          if (file) {
            const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/avatar/upload',
            });

            setBlob(newBlob);
          }
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
```

## セキュリティに関する注意事項

- クライアントアップロードは一時的なトークンを使用します
- `onBeforeGenerateToken`で許可するコンテンツタイプを制限できます
- `onUploadCompleted`でアップロード完了後の処理を実行できます

## 次のステップ

- [Blob SDK](/docs/vercel-blob/using-blob-sdk)の詳細な使用方法
- [セキュリティ](/docs/vercel-blob/security)のベストプラクティス
- [例](/docs/vercel-blob/examples)を参照
