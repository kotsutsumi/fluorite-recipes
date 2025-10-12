# レイアウトとページの作成

これまで、あなたのアプリケーションにはホームページしかありませんでした。レイアウトとページでより多くのルートを作成する方法を学びましょう。

この章では...

ここで扱うトピックは次のとおりです

- ファイルシステムルーティングを使用して `dashboard` ルートを作成する
- 新しいルートセグメントを作成する際のフォルダとファイルの役割を理解する
- 複数のダッシュボードページ間で共有できるネストしたレイアウトを作成する
- コロケーション、部分レンダリング、ルートレイアウトとは何かを理解する

## ネストしたルーティング

Next.jsは、フォルダを使ってネストしたルートを作成するファイルシステムルーティングを使用します。各フォルダは、URLセグメントにマップされるルートセグメントを表します。

![フォルダがURLセグメントにマップされる方法を示す図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Ffolders-to-url-segments.png&w=3840&q=75)

`layout.tsx` と `page.tsx` ファイルを使用して、各ルートに個別のUIを作成できます。

`page.tsx` は React コンポーネントをエクスポートする特別な Next.js ファイルで、ルートにアクセスできるようにするために必要です。あなたのアプリケーションには既にページファイルがあります：`/app/page.tsx` - これは `/` ルートに関連付けられたホームページです。

ネストしたルートを作成するには、フォルダを互いにネストし、その中に `page.tsx` ファイルを追加します。例えば：

![dashboard という名前のフォルダを追加すると新しいルート '/dashboard' が作成されることを示す図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fdashboard-route.png&w=3840&q=75)

`/app/dashboard/page.tsx` は `/dashboard` パスに関連付けられています。ページを作成して、どのように動作するかを見てみましょう！

## ダッシュボードページの作成

`/app` 内に `dashboard` という新しいフォルダを作成します。次に、`dashboard` フォルダ内に以下の内容で新しい `page.tsx` ファイルを作成します：

```tsx
// /app/dashboard/page.tsx
export default function Page() {
  return <p>Dashboard Page</p>;
}
```

開発サーバーが実行されていることを確認し、[http://localhost:3000/dashboard](http://localhost:3000/dashboard) にアクセスしてください。「Dashboard Page」のテキストが表示されるはずです。

これが Next.js で異なるページを作成する方法です：フォルダを使用して新しいルートセグメントを作成し、その中に `page` ファイルを追加します。

`page` ファイルに特別な名前を付けることで、Next.js では UI コンポーネント、テストファイル、その他の関連コードをルートと[共存](https://nextjs.org/docs/app/getting-started/project-structure#colocation)させることができます。`page` ファイル内のコンテンツのみが公開されます。例えば、`/ui` と `/lib` フォルダは、ルートと一緒に `/app` フォルダ内に共存しています。

## 練習：ダッシュボードページの作成

より多くのルートを作成する練習をしましょう。ダッシュボードで、さらに2つのページを作成します：

1. **Customers Page**: このページは [http://localhost:3000/dashboard/customers](http://localhost:3000/dashboard/customers) でアクセスできるようにします。今のところ、`<p>Customers Page</p>` 要素を返すようにします。
2. **Invoices Page**: invoices ページは [http://localhost:3000/dashboard/invoices](http://localhost:3000/dashboard/invoices) でアクセスできるようにします。今のところ、同様に `<p>Invoices Page</p>` 要素を返すようにします。

この演習に時間をかけて取り組み、準備ができたら、以下のトグルを展開して解答を確認してください：

**解答：**

以下のフォルダ構造を作成する必要があります：

```
/app/dashboard/customers/page.tsx
/app/dashboard/invoices/page.tsx
```

Customers ページ：

```tsx
// /app/dashboard/customers/page.tsx
export default function Page() {
  return <p>Customers Page</p>;
}
```

Invoices ページ：

```tsx
// /app/dashboard/invoices/page.tsx
export default function Page() {
  return <p>Invoices Page</p>;
}
```

## ダッシュボードレイアウトの作成

ダッシュボードには、複数のページ間で共有される何らかのナビゲーションがあります。Next.js では、特別な `layout.tsx` ファイルを使用して、複数のページ間で共有される UI を作成できます。ダッシュボードページのレイアウトを作成しましょう！

`/dashboard` フォルダ内に、`layout.tsx` という新しいファイルを追加し、以下のコードを貼り付けます：

```tsx
// /app/dashboard/layout.tsx
import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

このコードではいくつかのことが行われているので、詳しく見てみましょう：

まず、`<SideNav />` コンポーネントをレイアウトにインポートしています。このファイルにインポートするコンポーネントは、レイアウトの一部となります。

`<Layout />` コンポーネントは `children` プロップを受け取ります。この子は、ページまたは別のレイアウトのどちらかになります。あなたの場合、`/dashboard` 内のページは自動的に次のように `<Layout />` 内にネストされます：

![dashboard レイアウトが dashboard ページを子としてネストしているフォルダ構造](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fshared-layout.png&w=3840&q=75)

変更を保存し、localhost を確認して、すべてが正しく動作していることを確認してください。以下のように表示されるはずです：

![サイドナビとメインコンテンツエリアを持つダッシュボードページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fshared-layout-page.png&w=1920&q=75)

Next.js でレイアウトを使用する利点の1つは、ナビゲーション時にページコンポーネントのみが更新され、レイアウトは再レンダリングされないことです。これは[部分レンダリング](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)と呼ばれ、ページ間を移行する際にレイアウト内のクライアントサイド React ステートを保持します。

![dashboard レイアウトが dashboard ページをネストしているフォルダ構造を示し、ナビゲーション時にページUIのみが切り替わることを表示](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fpartial-rendering-dashboard.png&w=3840&q=75)

## ルートレイアウト

第3章で、`Inter` フォントを別のレイアウト：`/app/layout.tsx` にインポートしました。復習として：

```tsx
// /app/layout.tsx
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

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

これは[ルートレイアウト](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts)と呼ばれ、すべての Next.js アプリケーションで必要です。ルートレイアウトに追加するUIは、アプリケーション内のすべてのページで共有されます。ルートレイアウトを使用して `<html>` と `<body>` タグを変更し、メタデータを追加できます（メタデータについては[後の章](https://nextjs.org/learn/dashboard-app/adding-metadata)で詳しく学習します）。

先ほど作成した新しいレイアウト（`/app/dashboard/layout.tsx`）はダッシュボードページに固有のものなので、上記のルートレイアウトにUIを追加する必要はありません。

## 第4章を完了しました

素晴らしい、ダッシュボードアプリが徐々にまとまってきています。

次は

**第5章：ページ間のナビゲーション**

`<Link>` コンポーネントを使用してダッシュボードページ間をナビゲートする方法を学びます。

[第5章を開始](https://nextjs.org/learn/dashboard-app/navigating-between-pages)
