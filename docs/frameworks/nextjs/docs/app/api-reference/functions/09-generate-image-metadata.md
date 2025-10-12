# generateImageMetadata

`generateImageMetadata`は、1つのルートセグメントに対して複数の画像を生成したり、異なるバージョンの画像を作成したりするために使用できる関数です。これは、アイコンなどのメタデータ値をハードコーディングしたくない場合に便利です。

## パラメーター

`generateImageMetadata`関数は、以下のパラメーターを受け取ります：

### `params`（オプション）

ルートセグメントから`generateImageMetadata`が呼び出されるセグメントまでの、[動的ルートパラメーター](/docs/app/api-reference/file-conventions/dynamic-routes)を含むオブジェクト。

```typescript
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  // ...
}
```

| ルート | URL | `params` |
|-------|------|----------|
| `app/shop/icon.js` | `/shop` | `undefined` |
| `app/shop/[slug]/icon.js` | `/shop/1` | `{ slug: '1' }` |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |

## 戻り値

`generateImageMetadata`関数は、画像のメタデータを含むオブジェクトの配列を返す必要があります。各アイテムには必ず`id`値を含める必要があり、これは画像生成関数のプロップスに渡されます。

画像メタデータオブジェクト:

| プロパティ | タイプ | 説明 |
|-----------|--------|------|
| `id` | `string`（必須） | 画像の一意の識別子 |
| `alt` | `string` | 画像の代替テキスト |
| `size` | `object` | 画像のサイズ（幅と高さ） |
| `contentType` | `string` | 画像のMIMEタイプ |

## 使用例

### 複数のアイコンの生成

```typescript
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        {id}
      </div>
    )
  )
}
```

### 動的ルートパラメーターの使用

```typescript
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: `${params.slug}-small`,
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: `${params.slug}-medium`,
    },
  ]
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v13.3.0` | `generateImageMetadata` が導入されました |
