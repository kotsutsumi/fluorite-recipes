# useParams

`useParams` は、現在の URL から動的ルートパラメータを読み取ることができる Client Component フックです。

## 使用方法

```typescript
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()

  // URL が /shop/shoes/nike-air-max-97 の場合
  // params は { tag: 'shoes', item: 'nike-air-max-97' } となります

  return (
    <div>
      <p>Tag: {params.tag}</p>
      <p>Item: {params.item}</p>
    </div>
  )
}
```

## パラメータ

このフックはパラメータを受け取りません。

## 戻り値

現在の URL の動的ルートセグメントを含むオブジェクトを返します：

- プロパティはセグメント名です
- 値は入力されたセグメントです
- 値はルートタイプに応じて文字列または文字列配列になります

## ルートパラメータのシナリオ

| ルート | URL | パラメータ |
|-------|-----|-----------|
| `app/page.js` | `/` | `{}` |
| `app/shop/[slug]/page.js` | `/shop/1` | `{ slug: '1' }` |
| `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/page.js` | `/shop/1/2` | `{ slug: ['1', '2'] }` |

## TypeScript での使用

TypeScript を使用する場合、型パラメータを指定できます：

```typescript
'use client'

import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams<{ tag: string; item: string }>()

  // params.tag と params.item は string 型として認識されます
}
```

## Catch-All ルート

Catch-all ルートでは、パラメータは文字列配列として返されます：

```typescript
'use client'

import { useParams } from 'next/navigation'

export default function Page() {
  // ルート: /shop/[...slug]
  const params = useParams<{ slug: string[] }>()

  // URL が /shop/a/b/c の場合
  // params.slug は ['a', 'b', 'c'] となります
}
```

## 重要な注意事項

- Client Components でのみ使用できます
- `'use client'` ディレクティブが必要です
- Server Components では使用できません

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.3.0` | `useParams` が導入されました |
