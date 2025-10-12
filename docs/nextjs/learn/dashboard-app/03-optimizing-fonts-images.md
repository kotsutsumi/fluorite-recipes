# フォントと画像の最適化

前章では、Next.jsアプリケーションのスタイリング方法を学びました。引き続きホームページの作業を進め、カスタムフォントとヒーロー画像を追加していきましょう。

## この章で学ぶこと

このトピックを扱います：

- `next/font`でカスタムフォントを追加する方法
- `next/image`で画像を追加する方法
- Next.jsでフォントと画像がどのように最適化されるか

## なぜフォントを最適化するのか？

フォントはWebサイトのデザインにおいて重要な役割を果たしますが、プロジェクトでカスタムフォントを使用すると、フォントファイルの取得と読み込みが必要になるため、パフォーマンスに影響を与える可能性があります。

[累積レイアウトシフト（Cumulative Layout Shift）](https://vercel.com/blog/how-core-web-vitals-affect-seo)は、Googleがウェブサイトのパフォーマンスとユーザーエクスペリエンスを評価するために使用する指標です。フォントに関しては、ブラウザが最初にフォールバックフォントやシステムフォントでテキストをレンダリングし、その後カスタムフォントが読み込まれると置き換えるときにレイアウトシフトが発生します。この置き換えにより、テキストサイズ、間隔、レイアウトが変更され、周囲の要素がシフトする可能性があります。

Next.jsは、`next/font`モジュールを使用すると、アプリケーション内のフォントを自動的に最適化します。ビルド時にフォントファイルをダウンロードし、他の静的アセットと一緒にホストします。これにより、ユーザーがアプリケーションにアクセスしたときに、パフォーマンスに影響を与えるフォントの追加ネットワークリクエストが発生しなくなります。

## プライマリフォントの追加

これがどのように動作するか確認するために、アプリケーションにカスタムGoogle フォントを追加してみましょう。

`/app/ui`フォルダ内に、`fonts.ts`という新しいファイルを作成します。このファイルは、アプリケーション全体で使用されるフォントを保持するために使用します。

`next/font/google`モジュールから`Inter`フォントをインポートします。これがプライマリフォントになります。次に、読み込む[サブセット](https://fonts.google.com/knowledge/glossary/subsetting)を指定します。この場合は`'latin'`です：

```typescript
// /app/ui/fonts.ts
import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
```

最後に、`/app/layout.tsx`の`<body>`要素にフォントを追加します：

```typescript
// /app/layout.tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

`Inter`を`<body>`要素に追加することで、フォントがアプリケーション全体に適用されます。ここでは、フォントを滑らかにするTailwindの[antialiased](https://tailwindcss.com/docs/font-smoothing)クラスも追加しています。このクラスを使用する必要はありませんが、見た目を良くします。

ブラウザに移動し、開発者ツールを開いて`body`要素を選択します。スタイルの下に`Inter`と`Inter_Fallback`が適用されているのが確認できるはずです。

## 練習：セカンダリフォントの追加

アプリケーションの特定の要素にフォントを追加することもできます。

今度はあなたの番です！`fonts.ts`ファイルで、`Lusitana`というセカンダリフォントをインポートし、`/app/page.tsx`ファイルの`<p>`要素に渡してください。前と同様にサブセットを指定することに加えて、異なるフォントウェイトも指定する必要があります。例えば、`400`（通常）と`700`（太字）です。

準備ができたら、以下のコードスニペットを展開して解答を確認してください。

ヒント：

- フォントに渡すウェイトオプションが不明な場合は、コードエディタのTypeScriptエラーを確認してください
- [Google Fonts](https://fonts.google.com/)のウェブサイトにアクセスして`Lusitana`を検索し、利用可能なオプションを確認してください
- [複数フォントの追加](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#using-multiple-fonts)と[オプションの完全なリスト](https://nextjs.org/docs/app/api-reference/components/font#font-function-arguments)のドキュメントを参照してください

```typescript
// /app/ui/fonts.ts
import { Inter, Lusitana } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});
```

```typescript
// /app/page.tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , built with App Router.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* ヒーロー画像をここに追加 */}
        </div>
      </div>
    </main>
  );
}
```

最後に、`<AcmeLogo />`コンポーネントもLusitanaを使用しています。エラーを防ぐためにコメントアウトされていましたが、今はコメントを外すことができます。

素晴らしい！アプリケーションに2つのカスタムフォントを追加しました。次に、ホームページにヒーロー画像を追加しましょう。

## なぜ画像を最適化するのか？

Next.jsは、トップレベルの[/public](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)フォルダの下で、画像などの静的アセットを提供できます。`/public`内のファイルは、アプリケーション内で参照できます。

通常のHTMLでは、次のように画像を追加します：

```html
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

しかし、これは手動で以下を行う必要があることを意味します：

- 画像が異なる画面サイズでレスポンシブであることを確保する
- 異なるデバイス用の画像サイズを指定する
- 画像が読み込まれる際のレイアウトシフトを防ぐ
- ユーザーのビューポートの外にある画像を遅延読み込みする

画像最適化は、Web開発における大きなトピックであり、それ自体が専門分野と考えられる可能性があります。これらの最適化を手動で実装する代わりに、`next/image`コンポーネントを使用して画像を自動的に最適化できます。

## `<Image>`コンポーネント

`<Image>`コンポーネントは、HTML `<img>`タグの拡張であり、次のような自動画像最適化機能が付属しています：

- 画像の読み込み時にレイアウトシフトを自動的に防ぐ
- より小さなビューポートを持つデバイスに大きな画像を送信することを避けるために画像をリサイズする
- デフォルトで画像を遅延読み込みする（画像がビューポートに入るときに読み込まれる）
- ブラウザがサポートしている場合、[WebP](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp)や[AVIF](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image)などのモダンな形式で画像を提供する

## デスクトップヒーロー画像の追加

`<Image>`コンポーネントを使用してみましょう。`/public`フォルダ内を見ると、`hero-desktop.png`と`hero-mobile.png`という2つの画像があります。これら2つの画像は完全に異なり、ユーザーのデバイスがデスクトップかモバイルかによって表示されます。

`/app/page.tsx`ファイルで、[next/image](https://nextjs.org/docs/api-reference/next/image)からコンポーネントをインポートします。次に、コメントの下に画像を追加します：

```typescript
// /app/page.tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* ヒーロー画像をここに追加 */}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
    </div>
    // ...
  );
}
```

ここでは、`width`を`1000`、`height`を`760`ピクセルに設定しています。レイアウトシフトを避けるために、画像の`width`と`height`を設定するのは良い習慣です。これらは、ソース画像と同じアスペクト比である必要があります。これらの値は、画像がレンダリングされるサイズではなく、アスペクト比を理解するために使用される実際の画像ファイルのサイズです。

また、モバイル画面でDOMから画像を削除する`hidden`クラス、デスクトップ画面で画像を表示する`md:block`クラスも確認できます。

これで、ホームページは次のようになります：

![カスタムフォントとヒーロー画像を持つスタイル付きホームページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fhome-page-with-hero.png&w=1920&q=75)

## 練習：モバイルヒーロー画像の追加

今度はあなたの番です！今追加した画像の下に、`hero-mobile.png`用の別の`<Image>`コンポーネントを追加してください。

- 画像は`width`が`560`、`height`が`620`ピクセルである必要があります
- モバイル画面で表示され、デスクトップでは非表示にする必要があります - 開発者ツールを使用して、デスクトップとモバイルの画像が正しく交換されているかを確認できます

準備ができたら、以下のコードスニペットを展開して解答を確認してください。

```typescript
// /app/page.tsx
<div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
  {/* ヒーロー画像をここに追加 */}
  <Image
    src="/hero-desktop.png"
    width={1000}
    height={760}
    className="hidden md:block"
    alt="Screenshots of the dashboard project showing desktop version"
  />
  <Image
    src="/hero-mobile.png"
    width={560}
    height={620}
    className="block md:hidden"
    alt="Screenshot of the dashboard project showing mobile version"
  />
</div>
```

素晴らしい！ホームページにカスタムフォントとヒーロー画像が追加されました。

## 推奨読み物

リモート画像の最適化やローカルフォントファイルの使用など、これらのトピックについて学ぶことはたくさんあります。フォントと画像についてさらに深く掘り下げたい場合は、以下を参照してください：

- [画像最適化ドキュメント](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [フォント最適化ドキュメント](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [画像によるWeb パフォーマンスの改善（MDN）](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
- [Webフォント（MDN）](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
- [Core Web VitalsがSEOに与える影響](https://vercel.com/blog/how-core-web-vitals-affect-seo)
- [Googleがインデックス化プロセス全体でJavaScriptを処理する方法](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process)

## 第3章を完了しました

Next.jsを使用してフォントと画像を最適化する方法を学びました。

### 次へ

4: レイアウトとページの作成

ネストされたレイアウトとページを使用してダッシュボードルートを作成しましょう！

[第4章を開始](https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages)
