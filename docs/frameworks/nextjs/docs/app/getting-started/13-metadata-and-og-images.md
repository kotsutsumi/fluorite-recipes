# メタデータとOG画像

Next.jsには、SEO（検索エンジン最適化）とウェブの共有性を向上させるために、アプリケーションのメタデータ（例：HTMLのheadタグ内のmetaタグやlinkタグ）を定義するために使用できるMetadata APIがあります。

このページでは、Next.jsアプリケーションでメタデータを追加する方法を学びます。

## メタデータの定義

アプリケーションにメタデータを追加するには、2つの方法があります：

1. **設定ベースのメタデータ**: `layout.js`または`page.js`ファイルで[静的な`metadata`オブジェクト](/docs/app/api-reference/functions/generate-metadata#metadata-object)または動的な[`generateMetadata`関数](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)をエクスポートします。

2. **ファイルベースのメタデータ**: 特別なファイルをルートセグメントに追加します。

これらのオプションを使用すると、Next.jsは自動的にページの関連する`<head>`要素を生成します。また、[`ImageResponse`](/docs/app/api-reference/functions/image-response)コンストラクタを使用して動的なOG画像を作成することもできます。

## 静的メタデータ

静的メタデータを定義するには、`layout.js`または`page.js`ファイルから[`Metadata`オブジェクト](/docs/app/api-reference/functions/generate-metadata#metadata-object)をエクスポートします。

```tsx title="layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'My personal blog about tech and life',
}

export default function Page() {
  return <div>My Blog</div>
}
```

利用可能なすべてのオプションについては、[Metadata APIリファレンス](/docs/app/api-reference/functions/generate-metadata)を参照してください。

## 動的メタデータ

`generateMetadata`関数を使用して、動的な値が必要なメタデータを`fetch`できます。

```tsx title="app/blog/[slug]/page.tsx"
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </article>
  )
}
```

> **知っておくと良いこと**: `generateMetadata`と`Page`コンポーネントの両方で同じデータを`fetch`する場合、Next.jsは自動的にリクエストを[メモ化](/docs/app/building-your-application/caching#request-memoization)します。これは、同じデータに対して複数のリクエストを行う心配がないことを意味します。

利用可能なすべてのパラメータとメタデータオプションについては、[`generateMetadata` APIリファレンス](/docs/app/api-reference/functions/generate-metadata)を参照してください。

## ファイルベースのメタデータ

メタデータには、以下の特別なファイルが使用できます：

- [favicon.ico、apple-icon.jpg、icon.jpg](/docs/app/api-reference/file-conventions/metadata/app-icons)
- [opengraph-image.jpg、twitter-image.jpg](/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [robots.txt](/docs/app/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](/docs/app/api-reference/file-conventions/metadata/sitemap)

これらは静的メタデータに使用できます。また、コードを使用してこれらのファイルをプログラム的に生成することもできます。

実装と例については、[Metadata Files APIリファレンス](/docs/app/api-reference/functions/generate-metadata)および[Dynamic Image Generation](#動的画像生成)を参照してください。

## デフォルトフィールド

ルートがメタデータを定義していない場合でも、常に追加される2つのデフォルトの`meta`タグがあります：

- [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset)はウェブサイトの文字エンコーディングを設定します。
- [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)はウェブサイトのビューポート幅とスケールを設定し、さまざまなデバイスに合わせて調整します。

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> **知っておくと良いこと**: デフォルトの[`viewport`](/docs/app/api-reference/functions/generate-metadata#viewport) metaタグを上書きすることができます。

## 動的画像生成

`ImageResponse`コンストラクタを使用すると、JSXとCSSを使用して動的画像を生成できます。これは、Open GraphやTwitterカードなどのソーシャルメディア画像を作成するのに役立ちます。

`ImageResponse`は[Edge Runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime)を使用し、Next.jsは自動的に正しいヘッダーをキャッシュされた画像に追加し、エッジでのパフォーマンスを向上させ、再計算を減らすのに役立ちます。

これを使用するには、`next/og`から`ImageResponse`をインポートできます：

```tsx title="app/blog/[slug]/opengraph-image.tsx"
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.vercel.app/blog/${params.slug}`).then(
    (res) => res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

`ImageResponse`は、[Route Handlers](/docs/app/building-your-application/routing/route-handlers)や[ファイルベースのメタデータ](/docs/app/api-reference/file-conventions/metadata/opengraph-image)を含む他のNext.js APIとうまく統合されます。たとえば、`ImageResponse`を`opengraph-image.tsx`ファイルで使用して、ビルド時またはリクエスト時に動的にOpen Graph画像を生成できます。

`ImageResponse`は、flexboxや絶対位置指定、カスタムフォント、テキストの折り返し、中央揃え、ネストされた画像などの一般的なCSSプロパティをサポートしています。[サポートされているCSSプロパティの完全なリストを参照](/docs/app/api-reference/functions/image-response)してください。

> **知っておくと良いこと**:
>
> - 例は[Vercel OG Playground](https://og-playground.vercel.app/)で利用できます。
> - `ImageResponse`は[@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)、[Satori](https://github.com/vercel/satori)、およびReactdomを使用してHTMLとCSSをPNGに変換します。
> - Edge Runtimeのみがサポートされています。デフォルトのNode.js runtimeは動作しません。
> - flexboxと一部のCSSプロパティのみがサポートされています。高度なレイアウト（例：`display: grid`）は動作しません。
> - 最大バンドルサイズは`500KB`です。バンドルサイズには、JSX、CSS、フォント、画像、その他のアセットが含まれます。制限を超える場合は、アセットのサイズを減らすか、ランタイムでフェッチすることを検討してください。
> - `ttf`、`otf`、および`woff`フォント形式のみがサポートされています。フォント解析速度を最大化するために、`ttf`または`otf`が`woff`よりも優先されます。

## 次のステップ

これで、Next.jsでメタデータを設定する方法を理解できました。次のステップでは、さらに高度なメタデータトピックについて学びます：

- **[Metadata API Reference](/docs/app/api-reference/functions/generate-metadata)**: すべてのメタデータオプションの完全なリファレンスを参照してください。
- **[File-based Metadata](/docs/app/api-reference/file-conventions/metadata)**: ファイルベースのメタデータの規則について学びます。
