# 画像

Next.jsの\`<Image>\`コンポーネントは、HTMLの\`<img>\`要素を拡張して、以下を提供します：

- **サイズ最適化**: WebPやAVIFなどの最新の画像フォーマットを使用して、各デバイスに適したサイズの画像を自動的に提供します。
- **視覚的安定性**: 画像の読み込み時にレイアウトシフトを自動的に防止します。
- **高速なページロード**: ネイティブブラウザのレイジーローディングを使用して、ビューポートに入ったときにのみ画像を読み込みます。
- **アセットの柔軟性**: リモート画像でも、オンデマンドで画像のサイズを変更します。

このページでは、Next.jsアプリケーションで画像を使用する方法について学びます。

## \`<Image>\`コンポーネント

\`next/image\`から\`<Image>\`コンポーネントをインポートすることで、アプリケーションで画像を表示できます：

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return <Image src="/profile.png" alt="プロフィール画像" width={500} height={500} />
}
\`\`\`

## ローカル画像

ローカル画像を使用するには、\`.jpg\`、\`.png\`、または\`.webp\`画像ファイルを\`import\`します。

Next.jsは、インポートされたファイルに基づいて、画像の\`width\`と\`height\`を自動的に決定します。これらの値は、画像の読み込み中に[Cumulative Layout Shift](https://nextjs.org/learn/seo/web-performance/cls)を防ぐために使用されます。

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="著者の写真"
      // width={500} 自動的に提供されます
      // height={500} 自動的に提供されます
      // blurDataURL="data:..." 自動的に提供されます
      // placeholder="blur" オプションのぼかしプレースホルダー
    />
  )
}
\`\`\`

> **警告**: 動的\`await import()\`または\`require()\`はサポートされて**いません**。\`import\`はビルド時に分析できるように静的である必要があります。

## リモート画像

リモート画像を使用するには、\`src\`プロパティはURL文字列である必要があります。

Next.jsはビルドプロセス中にリモートファイルにアクセスできないため、\`width\`、\`height\`、およびオプションの\`blurDataURL\`プロパティを手動で提供する必要があります。

\`width\`と\`height\`属性は、画像の正しいアスペクト比を推測し、画像の読み込みによるレイアウトシフトを回避するために使用されます。\`width\`と\`height\`は、画像ファイルのレンダリングサイズを決定**しません**。[画像のサイズ設定](#画像のサイズ設定)について詳しく学びましょう。

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="著者の写真"
      width={500}
      height={500}
    />
  )
}
\`\`\`

画像の最適化を安全に許可するには、\`next.config.js\`でサポートされているURLパターンのリストを定義します。悪意のある使用を防ぐために、できるだけ具体的にしてください。たとえば、次の設定は、特定のAWS S3バケットからの画像のみを許可します：

\`\`\`js title="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
\`\`\`

[\`remotePatterns\`](/docs/app/api-reference/components/image#remotepatterns)設定について詳しく学びましょう。画像\`src\`に相対URLを使用したい場合は、[\`loader\`](/docs/app/api-reference/components/image#loader)を使用してください。

## ドメイン

リモート画像を最適化したいが、組み込みのNext.js画像最適化APIを使用したい場合があります。これを行うには、\`loader\`をデフォルト設定のままにして、Image \`src\`プロパティに絶対URLを入力します。

悪意のあるユーザーからアプリケーションを保護するには、\`next/image\`コンポーネントで使用する予定のリモートホスト名のリストを定義する必要があります。

> [\`remotePatterns\`](/docs/app/api-reference/components/image#remotepatterns)設定について詳しく学びましょう。

## Loaders

[以前の例](#リモート画像)では、リモート画像に部分的なURL（\`"/me.png"\`）が提供されていることに注目してください。これは、loaderアーキテクチャのおかげで可能です。

loaderは、画像のURLを生成する関数です。提供された\`src\`を変更し、異なるサイズで画像をリクエストするための複数のURLを生成します。これらの複数のURLは、自動[srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)生成で使用され、サイトの訪問者にビューポートに適したサイズの画像が提供されます。

Next.jsアプリケーションのデフォルトloaderは、組み込みの画像最適化APIを使用し、Web上の任意の場所から画像を最適化し、Next.jsウェブサーバーから直接提供します。画像をCDNまたは画像サーバーから直接提供したい場合は、数行のJavaScriptで独自のloader関数を記述できます。

[\`loader\`プロパティ](/docs/app/api-reference/components/image#loader)を使用して、画像ごとにloaderを定義したり、[\`loaderFile\`設定](/docs/app/api-reference/components/image#loaderfile)でアプリケーションレベルで定義したりできます。

## 優先度

各ページの[Largest Contentful Paint (LCP)要素](https://web.dev/lcp/#what-elements-are-considered)になる画像に\`priority\`プロパティを追加する必要があります。これにより、Next.jsが画像を優先的に読み込むことができ（たとえば、プリロードタグや優先度ヒントを介して）、LCPの意味のある向上をもたらします。

LCP要素は通常、ページのビューポート内に表示される最大の画像またはテキストブロックです。\`next dev\`を実行すると、LCP要素が\`priority\`プロパティのない\`<Image>\`である場合、コンソール警告が表示されます。

LCP画像を特定したら、次のようにプロパティを追加できます：

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'
import profilePic from '../public/me.png'

export default function Page() {
  return <Image src={profilePic} alt="著者の写真" priority />
}
\`\`\`

[\`next/image\`コンポーネントドキュメント](/docs/app/api-reference/components/image#priority)で優先度について詳しく学びましょう。

## 画像のサイズ設定

画像がパフォーマンスを低下させる最も一般的な方法の1つは、*レイアウトシフト*です。これは、画像が読み込まれるときにページ上の他の要素を押しのけることです。このパフォーマンスの問題は、ユーザーにとって非常に煩わしいため、[Cumulative Layout Shift](https://web.dev/cls/)と呼ばれる独自のCore Web Vitalがあります。画像ベースのレイアウトシフトを回避する方法は、[常に画像のサイズを設定する](https://web.dev/optimize-cls/#images-without-dimensions)ことです。これにより、ブラウザは画像が読み込まれる前に正確にスペースを確保できます。

\`next/image\`は、良好なパフォーマンスを保証するように設計されているため、レイアウトシフトに寄与する方法で使用することはできず、次の3つの方法のいずれかでサイズを設定する**必要があります**：

1. [静的インポート](#ローカル画像)を使用して自動的に
2. 明示的に、\`width\`と\`height\`プロパティを含めて
3. 暗黙的に、[fill](/docs/app/api-reference/components/image#fill)を使用して、画像がその親要素を埋めるように拡張させる

> **画像のサイズがわからない場合はどうすればよいですか？**
>
> 画像のサイズがわからないソースから画像にアクセスする場合、いくつかのことができます：
>
> **\`fill\`を使用する**
>
> [\`fill\`](/docs/app/api-reference/components/image#fill)プロパティを使用すると、画像が親要素によってサイズ設定されます。CSSを使用して、画像の親要素にページ上のスペースを与え、[\`sizes\`](/docs/app/api-reference/components/image#sizes)プロパティを使用してメディアクエリのブレークポイントに一致させることを検討してください。また、\`fill\`、\`contain\`、または\`cover\`とともに[\`object-fit\`](https://developer.mozilla.org/docs/Web/CSS/object-fit)、および[\`object-position\`](https://developer.mozilla.org/docs/Web/CSS/object-position)を使用して、画像がそのスペースをどのように占有するかを定義することもできます。
>
> **画像を正規化する**
>
> 制御するソースから画像を提供している場合は、画像パイプラインを変更して、画像を特定のサイズに正規化することを検討してください。
>
> **API呼び出しを変更する**
>
> アプリケーションがAPI呼び出し（CMSなど）を使用して画像URLを取得している場合、URL とともに画像のサイズを返すようにAPI呼び出しを変更できる場合があります。

提案された方法のいずれも画像のサイズ設定に機能しない場合、\`next/image\`コンポーネントは、標準の\`<img>\`要素とともにページ上で適切に機能するように設計されています。

## スタイリング

Imageコンポーネントのスタイリングは、通常の\`<img>\`要素のスタイリングに似ていますが、いくつかのガイドラインに留意する必要があります：

- \`styled-jsx\`ではなく、\`className\`または\`style\`を使用してください。
  - ほとんどの場合、\`className\`プロパティの使用をお勧めします。これは、インポートされた[CSSモジュール](/docs/app/building-your-application/styling/css#css-modules)、[グローバルスタイルシート](/docs/app/building-your-application/styling/css#global-css)などです。
  - インラインスタイルを割り当てるために\`style\`プロパティを使用することもできます。
  - [styled-jsx](/docs/app/building-your-application/styling/css-in-js)は、現在のコンポーネントにスコープされているため、使用できません（スタイルを\`global\`としてマークしない限り）。
- \`fill\`を使用する場合、親要素は\`position: relative\`を持っている必要があります
  - これは、そのレイアウトモードで画像要素を適切にレンダリングするために必要です。
- \`fill\`を使用する場合、親要素は\`display: block\`を持っている必要があります
  - これは\`<div>\`要素のデフォルトですが、それ以外の場合は指定する必要があります。

## 例

### レスポンシブ

<Image
  alt="異なる画面サイズにわたってスペースを埋めるレスポンシブ画像"
  srcLight="/docs/light/responsive-image.png"
  srcDark="/docs/dark/responsive-image.png"
  width="1600"
  height="629"
/>

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        src={mountains}
        alt="山々"
        // 画像をコンテナの幅全体に表示
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
\`\`\`

### コンテナを埋める

<Image
  alt="コンテナを埋める画像のグリッド"
  srcLight="/docs/light/fill-container.png"
  srcDark="/docs/dark/fill-container.png"
  width="1600"
  height="529"
/>

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Page() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', height: '400px' }}>
        <Image
          alt="山々"
          src={mountains}
          fill
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* グリッド内の他の画像... */}
    </div>
  )
}
\`\`\`

### 背景画像

<Image
  alt="背景画像"
  srcLight="/docs/light/background-image.png"
  srcDark="/docs/dark/background-image.png"
  width="1600"
  height="427"
/>

\`\`\`tsx title="app/page.tsx"
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Page() {
  return (
    <Image
      alt="山々"
      src={mountains}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
\`\`\`

## その他のプロパティ

[\`next/image\`コンポーネントで使用可能なすべてのプロパティを表示](/docs/app/api-reference/components/image)します。

## 設定

\`next/image\`コンポーネントとNext.js画像最適化APIは、[\`next.config.js\`ファイル](/docs/app/api-reference/next-config-js)で設定できます。これらの設定により、[リモート画像を有効にする](/docs/app/api-reference/components/image#remotepatterns)、[カスタム画像ブレークポイントを定義する](/docs/app/api-reference/components/image#devicesizes)、[キャッシング動作を変更する](/docs/app/api-reference/components/image#caching-behavior)などができます。

[詳細については、完全な画像設定ドキュメントを参照してください。](/docs/app/api-reference/components/image#configuration-options)

## 次のステップ

これで、Next.jsで画像を最適化する方法を理解できました。次のステップでは、さらに高度な最適化トピックについて学びます：

- **[Font Optimization](/docs/app/building-your-application/optimizing/fonts)**: Next.jsでフォントを最適化する方法を学びます。
- **[Metadata](/docs/app/building-your-application/optimizing/metadata)**: SEOのためのメタデータを設定する方法を学びます。
