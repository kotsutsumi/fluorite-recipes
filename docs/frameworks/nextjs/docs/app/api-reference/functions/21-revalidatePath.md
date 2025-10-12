# revalidatePath

`revalidatePath`を使用すると、特定のパスに対して[キャッシュされたデータ](/docs/app/building-your-application/caching)をオンデマンドで無効化できます。

> **Good to know**:
>
> - `revalidatePath`は、[Node.jsおよびEdge runtimes](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)の両方で使用できます。
> - `revalidatePath`は、含まれるパスが次にアクセスされたときにのみキャッシュを無効化します。これは、動的ルートセグメントで`revalidatePath`を呼び出しても、多数のパスが一度に無効化されることはないことを意味します。無効化は、パスが次にアクセスされたときにのみ発生します。
> - 現在、`revalidatePath`は、[クライアント側のRouter Cache](/docs/app/building-your-application/caching#client-side-router-cache)のすべてのルートを無効化します。この動作は一時的なもので、特定のパスにのみ適用されるように更新される予定です。
> - `revalidatePath`を使用すると、[サーバーサイドRoute Cache](/docs/app/building-your-application/caching#full-route-cache)の**特定のパスのみ**が無効化されます。

## パラメータ

```tsx
revalidatePath(path: string, type?: 'page' | 'layout'): void;
```

- `path`: 再検証したいデータに関連付けられたファイルシステムパス（例：`/product/[slug]/page`）を表す文字列、または文字通りのルートセグメント（例：`/product/123`）。1024文字未満である必要があります。この値は大文字と小文字を区別します。
- `type`: （オプション）再検証するパスのタイプを変更するための`'page'`または`'layout'`文字列。`path`に動的セグメントが含まれている場合（例：`/product/[slug]/page`）、このパラメータが必要です。パスが文字通りのルートセグメント、例えば動的ページの`/product/1`（例：`/product/[slug]/page`）を参照している場合、`type`を指定する必要はありません。

## 戻り値

`revalidatePath`は値を返しません。

## 例

### 特定のURLの再検証

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

これにより、次のページアクセス時に特定のURLが再検証されます。

### ページパスの再検証

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// または route group付き
revalidatePath('/(main)/blog/[slug]', 'page')
```

これにより、次のページアクセス時に提供された`page`ファイルに一致するすべてのURLが再検証されます。これは、特定のページより下のページを無効化することは**ありません**。例えば、`/blog/[slug]`は`/blog/[slug]/[author]`を無効化しません。

### レイアウトパスの再検証

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'layout')
// または route group付き
revalidatePath('/(main)/post/[slug]', 'layout')
```

これにより、次のページアクセス時に提供された`layout`ファイルに一致するすべてのURLが再検証されます。これにより、同じレイアウトを持つ下位のページが次回アクセス時に再検証されます。例えば、上記の場合、`/blog/[slug]/[another]`も次回アクセス時に再検証されます。

### すべてのデータの再検証

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/', 'layout')
```

これにより、クライアント側のRouter Cacheがパージされ、次のページアクセス時にData Cacheが再検証されます。

### Server Action

```ts filename="app/actions.ts" switcher
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

### Route Handler

```ts filename="app/api/revalidate/route.ts" switcher
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```

```js filename="app/api/revalidate/route.js" switcher
import { revalidatePath } from 'next/cache'

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```
