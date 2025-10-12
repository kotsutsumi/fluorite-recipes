# cacheTag

この機能は現在カナリーチャンネルで利用可能で、変更される可能性があります。[Next.jsをアップグレード](/docs/app/building-your-application/upgrading/canary)して試し、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有してください。

`cacheTag`関数を使用すると、オンデマンドでキャッシュを無効化するためにキャッシュされたデータにタグ付けできます。キャッシュエントリにタグを関連付けることで、他のキャッシュデータに影響を与えることなく、特定のキャッシュエントリを選択的に消去または再検証できます。

## 使用方法

`cacheTag`を使用するには、`next.config.js`ファイルで[`cacheComponents`フラグ](/docs/app/api-reference/config/next-config-js/cacheComponents)を有効にします：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
  },
}

export default nextConfig
```

`cacheTag`関数は1つ以上の文字列値を受け取ります。

```typescript
import { unstable_cacheTag as cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('my-data')
  const data = await fetch('/api/data')
  return data
}
```

その後、[ルートハンドラ](/docs/app/api-reference/file-conventions/route)または[サーバーアクション](/docs/app/getting-started/updating-data)などの別の関数で[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) APIを使用してオンデマンドでキャッシュを再検証できます。

```typescript
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('my-data')
}
```
