# Supabaseエッジファンクションを使ったOG画像の生成

## 概要

このドキュメントでは、DenoとSupabaseエッジファンクションを使用してOpen Graph（OG）画像を生成する方法について説明します。このガイドでは、Webページ用の動的なOG画像を作成するステップバイステップのアプローチを提供しています。

## コード例

### `handler.tsx`

```typescript
import React from 'https://esm.sh/react@18.2.0'
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.4/mod.ts'

export default function handler(req: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 128,
          background: 'lavender',
        }}
      >
        Hello OG Image!
      </div>
    )
  )
}
```

### `index.ts`

```typescript
import handler from './handler.tsx'

console.log('Hello from og-image Function!')
Deno.serve(handler)
```

## 重要なポイント

- 画像生成にはReactとDenoを使用
- カスタマイズ可能なスタイリングで柔軟なOG画像を作成
- デプロイにはSupabaseエッジファンクションを活用
- シンプルで分かりやすい実装

この例では、ラベンダー色の背景に中央揃えのテキストを配置した基本的なOG画像を生成する方法を示しており、さまざまなユースケースに合わせて簡単にカスタマイズできます。
