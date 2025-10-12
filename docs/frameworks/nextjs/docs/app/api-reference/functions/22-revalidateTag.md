# revalidateTag

`revalidateTag`を使用すると、特定のキャッシュタグに対して[キャッシュされたデータ](/docs/app/building-your-application/caching)をオンデマンドで無効化できます。

> **Good to know**:
>
> - `revalidateTag`は、[Node.jsおよびEdge runtimes](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)の両方で使用できます。
> - `revalidateTag`は、パスが次にアクセスされたときにのみキャッシュを無効化します。これは、動的ルートセグメントで`revalidateTag`を呼び出しても、多数のパスが一度に無効化されることはないことを意味します。無効化は、パスが次にアクセスされたときにのみ発生します。

## パラメータ

```tsx
revalidateTag(tag: string): void;
```

- `tag`: 再検証したいデータに関連付けられたキャッシュタグを表す文字列。256文字以下である必要があります。この値は大文字と小文字を区別します。

次のように`fetch`にタグを追加できます：

```tsx
fetch(url, { next: { tags: [...] } });
```

## 戻り値

`revalidateTag`は値を返しません。

## 例

### Server Action

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

### Route Handler

```ts filename="app/api/revalidate/route.ts" switcher
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

```js filename="app/api/revalidate/route.js" switcher
import { revalidateTag } from 'next/cache'

export async function GET(request) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```
