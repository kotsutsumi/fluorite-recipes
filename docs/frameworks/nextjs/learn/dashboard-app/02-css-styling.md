# CSSスタイリング

現在、ホームページにはスタイルが設定されていません。Next.jsアプリケーションをスタイリングするさまざまな方法を見てみましょう。

この章では...

扱うトピックは以下の通りです

• アプリケーションにグローバルCSSファイルを追加する方法。

• 2つの異なるスタイリング方法：TailwindとCSSモジュール。

• `clsx`ユーティリティパッケージを使用してクラス名を条件付きで追加する方法。

## グローバルスタイル

`/app/ui`フォルダ内を見ると、`global.css`というファイルがあります。このファイルを使用して、アプリケーションのすべてのルートにCSSルールを追加できます。例えば、CSSリセットルール、リンクなどのHTML要素のサイト全体のスタイルなどです。

`global.css`はアプリケーション内の任意のコンポーネントでインポートできますが、通常はトップレベルのコンポーネントに追加するのが良い慣例です。Next.jsでは、これは[ルートレイアウト](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts)です（これについては後で詳しく説明します）。

`/app/layout.tsx`に移動して`global.css`ファイルをインポートし、アプリケーションにグローバルスタイルを追加します：

```typescript
// /app/layout.tsx
import '@/app/ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

開発サーバーがまだ実行されている状態で、変更を保存してブラウザでプレビューします。ホームページは次のように表示されるはずです：

![ロゴ「Acme」、説明、ログインリンクがあるスタイル設定されたページ。](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fhome-page-with-tailwind.png&w=1920&q=75)

でも少し待ってください。CSSルールを追加していないのに、スタイルはどこから来たのでしょうか？

`global.css`の中を見ると、いくつかの`@tailwind`ディレクティブがあることがわかります：

```css
/* /app/ui/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Tailwind

[Tailwind](https://tailwindcss.com/)は、Reactコード内で直接[ユーティリティクラス](https://tailwindcss.com/docs/utility-first)を素早く書くことを可能にし、開発プロセスを高速化するCSSフレームワークです。

Tailwindでは、クラス名を追加することで要素をスタイリングします。例えば、`"text-blue-500"`を追加すると、`<h1>`テキストが青くなります：

```jsx
<h1 className="text-blue-500">I'm blue!</h1>
```

CSSスタイルはグローバルに共有されますが、各クラスは各要素に個別に適用されます。これは、要素を追加または削除しても、別々のスタイルシートの保守、スタイルの衝突、またはアプリケーションの拡張に伴うCSSバンドルのサイズの増大を心配する必要がないことを意味します。

`create-next-app`を使用して新しいプロジェクトを開始するとき、Next.jsはTailwindを使用するかどうかを尋ねます。`yes`を選択すると、Next.jsは自動的に必要なパッケージをインストールし、アプリケーションでTailwindを設定します。

`/app/page.tsx`を見ると、例でTailwindクラスを使用していることがわかります。

```typescript
// /app/page.tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    // これらはTailwindクラスです：
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
```

Tailwindを初めて使用する場合でも心配しないでください。時間を節約するため、使用するすべてのコンポーネントのスタイルはすでに設定されています。

Tailwindで遊んでみましょう！以下のコードをコピーして、`/app/page.tsx`の`<p>`要素の上に貼り付けてください：

```jsx
// /app/page.tsx
<div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" />
```

従来のCSSルールを書くか、スタイルをJSXから分離することを好む場合は、CSSモジュールが優れた代替手段です。

## CSSモジュール

[CSSモジュール](https://nextjs.org/docs/basic-features/built-in-css-support)では、一意のクラス名を自動的に作成することで、コンポーネントにCSSをスコープでき、スタイルの衝突を心配する必要がありません。

このコースではTailwindを使い続けますが、CSSモジュールを使用して上記のクイズと同じ結果を達成する方法を少し見てみましょう。

`/app/ui`内に、`home.module.css`という新しいファイルを作成し、次のCSSルールを追加します：

```css
/* /app/ui/home.module.css */
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

次に、`/app/page.tsx`ファイル内でスタイルをインポートし、追加した`<div>`のTailwindクラス名を`styles.shape`に置き換えます：

```typescript
// /app/page.tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className={styles.shape} />
    // ...
  )
}
```

変更を保存してブラウザでプレビューします。以前と同じ形状が表示されるはずです。

TailwindとCSSモジュールは、Next.jsアプリケーションをスタイリングする最も一般的な2つの方法です。どちらを使用するかは好みの問題で、同じアプリケーション内で両方を使用することも可能です！

## clsxライブラリを使用したクラス名の切り替え

状態やその他の条件に基づいて要素を条件付きでスタイリングする必要がある場合があります。

[clsx](https://www.npmjs.com/package/clsx)は、クラス名を簡単に切り替えることができるライブラリです。詳細については[ドキュメント](https://github.com/lukeed/clsx)をご覧になることをお勧めしますが、基本的な使用方法は次のとおりです：

• `status`を受け取る`InvoiceStatus`コンポーネントを作成したいとします。ステータスは`'pending'`または`'paid'`です。
• `'paid'`の場合は色を緑にし、`'pending'`の場合は色をグレーにしたいとします。

次のように`clsx`を使用してクラスを条件付きで適用できます：

```typescript
// /app/ui/invoices/status.tsx
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
  )
}
```

## その他のスタイリングソリューション

これまで説明したアプローチに加えて、Next.jsアプリケーションを次の方法でスタイリングすることもできます：

• `.css`および`.scss`ファイルをインポートできるSass
• [styled-jsx](https://github.com/vercel/styled-jsx)、[styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)、[emotion](https://github.com/vercel/next.js/tree/canary/examples/with-emotion)などのCSS-in-JSライブラリ

詳細については、[CSSドキュメント](https://nextjs.org/docs/app/building-your-application/styling)をご覧ください。

## 第2章を完了しました

よくできました！Next.jsアプリケーションをスタイリングするさまざまな方法について学習しました。

### 次へ

**第3章：フォントと画像の最適化**

ヒーロー画像とカスタムフォントを追加して、ホームページの作業を続けましょう。

[第3章を開始](https://nextjs.org/learn/dashboard-app/optimizing-fonts-images)
