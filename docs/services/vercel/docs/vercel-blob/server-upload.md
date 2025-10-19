# Vercel Blobを使用したサーバーアップロード

## 前提条件

Vercel Blobは[すべてのプラン](/docs/plans)で利用可能です。

[所有者、メンバー、開発者](/docs/rbac/access-roles#owner-member-developer-role)の役割を持つユーザーがこの機能にアクセスできます。

このガイドでは、以下の方法を学びます：

- Vercelダッシュボードを使用してプロジェクトに接続されたBlobストアを作成する
- Blob SDKを使用してサーバーからファイルをアップロードする

> Vercelには、Vercelファンクションで4.5 MBのリクエストボディサイズ制限があります。

## 前提条件

任意のフロントエンドフレームワークでVercel Blobを使用できます。まず、パッケージをインストールします：

```bash
pnpm i @vercel/blob
```

## Blobストアの作成

1. [プロジェクト](/docs/projects/overview)に移動し、ストレージタブを選択
2. 「データベースに接続」ボタンを選択
3. 「新規作成」タブで「Blob」を選択し、「続行」ボタンをクリック
4. 名前を「Images」とし、新しいBlobストアを作成
5. 読み書きトークンを含める環境を選択

## ローカルプロジェクトの準備

自動的に以下の環境変数が作成されます：
- `BLOB_READ_WRITE_TOKEN`

ローカルで使用するには、Vercel CLIで環境変数をプルすることをお勧めします：

```bash
vercel env pull
```

## サーバーからのアップロード

### API ルートの作成

サーバーサイドでファイルをアップロードする例：

```typescript
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
```

## セキュリティに関する注意事項

- サーバーサイドでのアップロードは、`BLOB_READ_WRITE_TOKEN`を使用します
- このトークンは環境変数として安全に保管してください
- クライアントに直接トークンを公開しないでください

## 次のステップ

- [クライアントアップロード](/docs/vercel-blob/client-upload)の実装
- [Blob SDK](/docs/vercel-blob/using-blob-sdk)の詳細な使用方法
- [セキュリティ](/docs/vercel-blob/security)のベストプラクティス
