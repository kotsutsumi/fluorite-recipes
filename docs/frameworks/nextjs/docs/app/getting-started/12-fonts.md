# フォント

Next.jsには、フォントを最適化し、外部ネットワークリクエストを削除してプライバシーとパフォーマンスを向上させる\`next/font\`と呼ばれる組み込みの自動フォント最適化機能があります。

\`next/font\`には、**あらゆるフォントファイルの自動セルフホスティング**が含まれています。これは、レイアウトシフトなしで、基礎となるCSSの\`size-adjust\`プロパティを使用してWebフォントを最適に読み込むことができることを意味します。

この新しいフォントシステムを使用すると、パフォーマンスとプライバシーを考慮して、すべてのGoogle Fontsを便利に使用できます。CSSとフォントファイルはビルド時にダウンロードされ、他の静的アセットとともにセルフホストされます。**ブラウザからGoogleにリクエストは送信されません。**

このページでは、Next.jsアプリケーションでフォントを使用する方法について学びます。

## Google Fonts

任意のGoogle Fontを自動的にセルフホストします。フォントはデプロイメントに含まれ、デプロイメントと同じドメインから提供されます。**ブラウザからGoogleにリクエストは送信されません。**

使用したいフォントを\`next/font/google\`から関数としてインポートすることから始めます。最高のパフォーマンスと柔軟性のために、[可変フォント](https://fonts.google.com/variablefonts)を使用することをお勧めします。

\`\`\`tsx title="app/layout.tsx"
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

可変フォントが使用できない場合は、**ウェイトを指定する必要があります**：

\`\`\`tsx title="app/layout.tsx"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

配列を使用して複数のウェイトやスタイルを指定できます：

\`\`\`tsx title="app/layout.tsx"
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
\`\`\`

> **知っておくと良いこと**: 複数の単語を含むフォント名にはアンダースコア（\_）を使用してください。例：\`Roboto Mono\`は\`Roboto_Mono\`としてインポートする必要があります。

### サブセットの指定

Google Fontsは自動的に[サブセット化](https://fonts.google.com/knowledge/glossary/subsetting)されます。これにより、フォントファイルのサイズが削減され、パフォーマンスが向上します。これらのサブセットのどれをプリロードするかを定義する必要があります。[\`preload\`](/docs/app/api-reference/components/font#preload)が\`true\`の状態でサブセットを指定しないと、警告が表示されます。

これは、関数呼び出しに追加することで実行できます：

\`\`\`tsx title="app/layout.tsx"
const geist = Geist({
  subsets: ['latin'],
})
\`\`\`

詳細については、[Font API Reference](/docs/app/api-reference/components/font)を参照してください。

### 複数のフォントの使用

アプリケーションで複数のフォントをインポートして使用できます。取ることができるアプローチは2つあります。

最初のアプローチは、フォントをエクスポートし、インポートし、必要に応じて\`className\`を適用するユーティリティ関数を作成することです。これにより、フォントはレンダリングされたときにのみプリロードされます：

\`\`\`ts title="app/fonts.ts"
import { Geist, Roboto_Mono } from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
\`\`\`

\`\`\`tsx title="app/layout.tsx"
import { geist } from './fonts'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

\`\`\`tsx title="app/page.tsx"
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
\`\`\`

上記の例では、\`Geist\`はグローバルに適用され、\`Roboto Mono\`は必要に応じてインポートして適用できます。

または、[CSSカスタムプロパティ](/docs/app/api-reference/components/font#variable)を作成し、好みのCSSソリューションと一緒に使用できます：

\`\`\`tsx title="app/layout.tsx"
import { Geist, Roboto_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={\`\${geist.variable} \${roboto_mono.variable}\`}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

\`\`\`css title="app/global.css"
html {
  font-family: var(--font-geist);
}

h1 {
  font-family: var(--font-roboto-mono);
}
\`\`\`

上記の例では、\`Geist\`はグローバルに適用され、すべての\`<h1>\`タグは\`Roboto Mono\`でスタイル設定されます。

> **推奨事項**: 各新しいフォントはクライアントがダウンロードする必要がある追加のリソースであるため、複数のフォントを控えめに使用してください。

## ローカルフォント

\`next/font/local\`をインポートし、ローカルフォントファイルの\`src\`を指定します。最高のパフォーマンスと柔軟性のために、[可変フォント](https://fonts.google.com/variablefonts)を使用することをお勧めします。

\`\`\`tsx title="app/layout.tsx"
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

単一のフォントファミリーで複数のファイルを使用したい場合、\`src\`は配列にできます：

\`\`\`tsx title="app/layout.tsx"
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
})
\`\`\`

詳細については、[Font API Reference](/docs/app/api-reference/components/font)を参照してください。

## Tailwindとの使用

\`next/font\`は、[CSSカスタムプロパティ](/docs/app/api-reference/components/font#variable)を介して[Tailwind CSS](https://tailwindcss.com/)と一緒に使用できます。

次の例では、\`next/font/google\`のフォント\`Geist\`を使用しています（Google Fontsまたはローカルフォントからの任意のフォントを使用できます）。\`variable\`オプションを使用してフォントをロードし、CSS変数名を定義し、\`geist.variable\`に割り当てます。次に、\`geist.variable\`を使用してHTMLドキュメントにCSS変数を追加します。

\`\`\`tsx title="app/layout.tsx"
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

最後に、CSS変数を[Tailwind CSS設定](/docs/app/building-your-application/styling/tailwind-css#configuring-tailwind)に追加します：

\`\`\`ts title="tailwind.config.ts"
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)'],
      },
    },
  },
  plugins: [],
}
export default config
\`\`\`

これで、\`font-sans\`ユーティリティクラスを使用して、要素にフォントを適用できます。

## プリロード

サイトのページでフォント関数が呼び出されると、すべてのルートでグローバルに利用可能で、プリロードされるわけではありません。代わりに、フォントは使用されるファイルの種類に基づいて、関連するルートでのみプリロードされます：

- [一意のページ](/docs/app/building-your-application/routing/layouts-and-pages#pages)の場合、そのページの一意のルートにプリロードされます。
- [レイアウト](/docs/app/building-your-application/routing/layouts-and-pages#layouts)の場合、レイアウトでラップされたすべてのルートにプリロードされます。
- [ルートレイアウト](/docs/app/building-your-application/routing/layouts-and-pages#root-layout-required)の場合、すべてのルートにプリロードされます。

## フォントの再利用

\`localFont\`または\`Google\`フォント関数を呼び出すたびに、そのフォントはアプリケーション内の1つのインスタンスとしてホストされます。したがって、同じフォント関数を複数のファイルで読み込む場合、同じフォントの複数のインスタンスがホストされます。この状況では、次のことをお勧めします：

- 1つの共有ファイルでフォントローダー関数を呼び出します
- 定数としてエクスポートします
- このフォントを使用したい各ファイルで定数をインポートします

## 次のステップ

これで、Next.jsでフォントを最適化する方法を理解できました。次のステップでは、さらに高度な最適化トピックについて学びます：

- **[Metadata](/docs/app/building-your-application/optimizing/metadata)**: SEOのためのメタデータを設定する方法を学びます。
- **[Static Assets](/docs/app/building-your-application/optimizing/static-assets)**: 静的アセットの提供方法を学びます。
