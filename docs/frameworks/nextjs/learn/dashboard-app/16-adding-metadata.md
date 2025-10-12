# メタデータの追加

メタデータはSEOと共有可能性にとって重要です。この章では、Next.jsアプリケーションにメタデータを追加する方法について説明します。

この章で学ぶこと...

以下のトピックを扱います

🎯 メタデータとは何か

🎯 メタデータの種類

🎯 メタデータを使用してOpen Graphイメージを追加する方法

🎯 メタデータを使用してファビコンを追加する方法

## メタデータとは？

ウェブ開発において、メタデータはウェブページに関する追加の詳細情報を提供します。メタデータは、ページを訪問するユーザーには見えません。代わりに、通常は`<head>`要素内で、ページのHTMLに埋め込まれて舞台裏で動作します。この隠れた情報は、検索エンジンやウェブページのコンテンツをより良く理解する必要がある他のシステムにとって重要です。

## メタデータが重要な理由は？

メタデータは、ウェブページのSEOを向上させ、検索エンジンやソーシャルメディアプラットフォームにとってより理解しやすくアクセスしやすくする重要な役割を果たします。適切なメタデータは、検索エンジンがウェブページを効果的にインデックス化するのに役立ち、検索結果でのランキングを向上させます。さらに、Open Graphのようなメタデータは、ソーシャルメディアで共有されるリンクの見た目を改善し、ユーザーにとってコンテンツをより魅力的で情報豊富にします。

## メタデータの種類

さまざまな種類のメタデータがあり、それぞれが独自の目的を果たします。一般的な種類には以下があります：

**タイトルメタデータ**: ブラウザのタブに表示されるウェブページのタイトルを担当します。SEOにとって重要で、検索エンジンがウェブページの内容を理解するのに役立ちます。

```html
<title>ページタイトル</title>
```

**説明メタデータ**: このメタデータはウェブページのコンテンツの簡潔な概要を提供し、検索エンジンの結果で表示されることがよくあります。

```html
<meta name="description" content="ページコンテンツの簡潔な説明。" />
```

**キーワードメタデータ**: このメタデータには、ウェブページのコンテンツに関連するキーワードが含まれ、検索エンジンがページをインデックス化するのに役立ちます。

```html
<meta name="keywords" content="キーワード1, キーワード2, キーワード3" />
```

**Open Graphメタデータ**: このメタデータは、ソーシャルメディアプラットフォームで共有されるときのウェブページの表現方法を改善し、タイトル、説明、プレビュー画像などの情報を提供します。

```html
<meta property="og:title" content="タイトルここ" />
<meta property="og:description" content="説明ここ" />
<meta property="og:image" content="画像URLここ" />
```

**ファビコンメタデータ**: このメタデータは、ファビコン（小さなアイコン）をウェブページにリンクし、ブラウザのアドレスバーやタブに表示されます。

```html
<link rel="icon" href="path/to/favicon.ico" />
```

## メタデータの追加

Next.jsには、アプリケーションのメタデータを定義するために使用できるメタデータAPIがあります。アプリケーションにメタデータを追加する方法は2つあります：

• **設定ベース**: `layout.js`または`page.js`ファイルで[静的メタデータオブジェクト](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-object)または動的[generateMetadata関数](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)をエクスポートします。

• **ファイルベース**: Next.jsには、メタデータの目的で特別に使用される特別なファイルがあります：
• `favicon.ico`、`apple-icon.jpg`、`icon.jpg`: ファビコンとアイコンに使用
• `opengraph-image.jpg`と`twitter-image.jpg`: ソーシャルメディア画像に使用
• `robots.txt`: 検索エンジンクローリングの指示を提供
• `sitemap.xml`: ウェブサイトの構造に関する情報を提供

これらのファイルを静的メタデータに使用したり、プロジェクト内でプログラム的に生成したりする柔軟性があります。

両方のオプションにより、Next.jsはページの関連する`<head>`要素を自動的に生成します。

### ファビコンとOpen Graphイメージ

`/public`フォルダには、`favicon.ico`と`opengraph-image.jpg`の2つの画像があることに気付くでしょう。

これらの画像を`/app`フォルダのルートに移動してください。

これを行った後、Next.jsは自動的にこれらのファイルを認識し、ファビコンとOGイメージとして使用します。開発ツールでアプリケーションの`<head>`要素を確認することで、これを確認できます。

> 💡 **知っておくべきこと**: [ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)コンストラクターを使用して動的OGイメージを作成することもできます。

### ページタイトルと説明

任意の`layout.js`または`page.js`ファイルから[メタデータオブジェクト](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields)を含めて、タイトルや説明などの追加ページ情報を追加することもできます。`layout.js`のメタデータは、それを使用するすべてのページに継承されます。

ルートレイアウトで、以下のフィールドを含む新しい`metadata`オブジェクトを作成してください：

```typescript
// /app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Dashboard",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout() {
  // ...
}
```

Next.jsは自動的にタイトルとメタデータをアプリケーションに追加します。

しかし、特定のページにカスタムタイトルを追加したい場合はどうすればよいでしょうか？ページ自体に`metadata`オブジェクトを追加することでこれを行うことができます。ネストされたページのメタデータは、親のメタデータを上書きします。

例えば、`/dashboard/invoices`ページで、ページタイトルを更新できます：

```typescript
// /app/dashboard/invoices/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices | Acme Dashboard",
};
```

これは機能しますが、すべてのページでアプリケーションのタイトルを繰り返しています。会社名のような何かが変更された場合、すべてのページで更新する必要があります。

代わりに、`metadata`オブジェクトの`title.template`フィールドを使用して、ページタイトルのテンプレートを定義できます。このテンプレートには、ページタイトルと含めたい他の情報を含めることができます。

ルートレイアウトで、テンプレートを含むように`metadata`オブジェクトを更新してください：

```typescript
// /app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};
```

テンプレートの`%s`は、特定のページタイトルに置き換えられます。

今度は、`/dashboard/invoices`ページで、ページタイトルを追加できます：

```typescript
// /app/dashboard/invoices/page.tsx
export const metadata: Metadata = {
  title: "Invoices",
};
```

`/dashboard/invoices`ページに移動し、`<head>`要素を確認してください。ページタイトルが`Invoices | Acme Dashboard`になっているはずです。

## 練習: メタデータの追加

メタデータについて学んだので、他のページにタイトルを追加する練習をしてください：

1. `/login`ページ
2. `/dashboard/`ページ
3. `/dashboard/customers`ページ
4. `/dashboard/invoices/create`ページ
5. `/dashboard/invoices/[id]/edit`ページ

Next.jsメタデータAPIは強力で柔軟性があり、アプリケーションのメタデータを完全にコントロールできます。ここでは、基本的なメタデータを追加する方法を示しましたが、`keywords`、`robots`、`canonical`などの複数のフィールドを追加できます。[ドキュメント](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)を自由に探索し、アプリケーションに追加したい任意の追加メタデータを追加してください。

## 第16章完了

おめでとうございます！アプリケーションにメタデータを追加し、メタデータAPIについて学びました。

### 次へ

**17: 次のステップ**

Next.jsの探索を続ける

[第17章を開始](https://nextjs.org/learn/dashboard-app/next-steps)
