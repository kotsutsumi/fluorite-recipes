# Vercel Blob の例

Vercel Blob は[すべてのプラン](/docs/plans)で利用可能です。

[所有者、メンバー、開発者](/docs/rbac/access-roles#owner, member, developer-role)の役割を持つユーザーがこの機能にアクセスできます。

## レンジリクエスト

Vercel Blob は部分的なダウンロードのための[レンジリクエスト](https://developer.mozilla.org/docs/Web/HTTP/Range_requests)をサポートしています。

ターミナルでの例：

```bash
# 最初の4バイト
curl -r 0-3 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 3.14

# 最後の5バイト
curl -r -5 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 58151

# 3-6バイト
curl -r 3-6 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 4159
```

## アップロード進捗の追跡

アップロード中の進捗を `onUploadProgress` コールバックで追跡できます：

```javascript
const blob = await upload('big-file.mp4', file, {
  access: 'public',
  handleUploadUrl: '/api/upload',
  onUploadProgress: (progressEvent) => {
    console.log(`Loaded ${progressEvent.loaded} bytes`);
    console.log(`Total ${progressEvent.total} bytes`);
    console.log(`Percentage ${progressEvent.percentage}%`);
  },
});
```

## リクエストの中止

すべての Vercel Blob 操作は、fetch 呼び出しと同様に中止できます：

```typescript
const abortController = new AbortController();

const blob = await put('file.txt', 'content', {
  access: 'public',
  abortSignal: abortController.signal,
});

// リクエストを中止
abortController.abort();
```

## 画像のアップロードと表示

### アップロード

```typescript
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return Response.json({ url: blob.url });
}
```

### 表示

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    setImageUrl(url);
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" required />
        <button type="submit">Upload</button>
      </form>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Uploaded image"
          width={500}
          height={500}
        />
      )}
    </div>
  );
}
```

## 複数ファイルのアップロード

```typescript
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll('files') as File[];

  const blobs = await Promise.all(
    files.map((file) =>
      put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      })
    )
  );

  return Response.json({ blobs });
}
```

## ファイルのコピー

```typescript
import { copy } from '@vercel/blob';

const blob = await copy(
  'https://source-blob-url.com/file.png',
  'new-file-name.png',
  {
    access: 'public',
  }
);
```

## ファイルの一覧取得

```typescript
import { list } from '@vercel/blob';

// すべてのブロブを取得
const { blobs } = await list();

// プレフィックスでフィルタリング
const { blobs: imageBlobs } = await list({
  prefix: 'images/',
});

// 制限付きで取得
const { blobs: limitedBlobs } = await list({
  limit: 10,
});
```

## ファイルのメタデータ取得

```typescript
import { head } from '@vercel/blob';

const blobDetails = await head('https://your-blob-url.com/file.png');

console.log(blobDetails.size); // ファイルサイズ（バイト）
console.log(blobDetails.uploadedAt); // アップロード日時
console.log(blobDetails.contentType); // コンテンツタイプ
console.log(blobDetails.pathname); // パス名
```

## 条件付き削除

```typescript
import { list, del } from '@vercel/blob';

// 古いファイルを削除
const { blobs } = await list();
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

const oldBlobs = blobs.filter(
  (blob) => new Date(blob.uploadedAt).getTime() < thirtyDaysAgo
);

await Promise.all(oldBlobs.map((blob) => del(blob.url)));
```

## カスタムメタデータの保存

```typescript
import { put } from '@vercel/blob';

const blob = await put('file.txt', 'content', {
  access: 'public',
  addRandomSuffix: true,
  metadata: {
    userId: '12345',
    uploadDate: new Date().toISOString(),
  },
});
```

## 次のステップ

- [Blob SDK](/docs/vercel-blob/using-blob-sdk)の詳細
- [セキュリティ](/docs/vercel-blob/security)のベストプラクティス
- [使用量と料金](/docs/vercel-blob/usage-and-pricing)
