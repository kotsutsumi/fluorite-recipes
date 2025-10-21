# @vercel/functions APIリファレンス

## パッケージのインストールと使用

### パッケージのインストール

```bash
pnpm i @vercel/functions
```

### 他のフレームワーク向けのインポート

```typescript
import { waitUntil, attachDatabasePool } from '@vercel/functions';

export default {
  fetch(request: Request) {
    // ...
  },
};
```

## Next.jsでの使用(バージョン15.1以上)

Next.js 15.1以上では、`next/server`の`after()`関数を推奨:

```typescript
import { after } from 'next/server';

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') || 'unknown';

  // レスポンスを即座に返す
  const response = new Response(`You're visiting from ${country}`);

  // レスポンス送信後にバックグラウンドで実行
  after(async () => {
    await fetch(
      `https://my-analytics-service.example.com/log?country=${country}`,
    );
  });

  return response;
}
```

## ヘルパーメソッド

### `waitUntil`

リクエストハンドラーの有効期間を指定されたPromiseの有効期間まで延長します。

```typescript
import { waitUntil } from '@vercel/functions';

async function getBlog() {
  const res = await fetch('https://my-analytics-service.example.com/blog/1');
  return res.json();
}

export default {
  fetch(request: Request) {
    waitUntil(getBlog().then((json) => console.log({ json })));
    return new Response(`Hello from ${request.url}, I'm a Vercel Function!`);
  },
};
```

### その他のヘルパーメソッド

`@vercel/functions`パッケージは、関数の実行と管理を支援する追加のヘルパーメソッドを提供します。
