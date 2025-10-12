# データの取得

データベースを作成してシードしたので、アプリケーションのデータを取得するさまざまな方法について説明し、ダッシュボード概要ページを構築しましょう。

この章では...

ここで扱うトピックは次のとおりです

- データ取得のいくつかのアプローチについて学ぶ：API、ORM、SQLなど
- Server Components がバックエンドリソースにより安全にアクセスするのにどのように役立つか
- ネットワークウォーターフォールとは何か
- JavaScript パターンを使用して並列データ取得を実装する方法

## データの取得方法を選択する

### API レイヤー

APIは、アプリケーションコードとデータベースの間の中間レイヤーです。APIを使用するケースがいくつかあります：

• サードパーティサービスがAPIを提供している場合
• クライアントからデータを取得する場合、データベースシークレットをクライアントに公開しないように、サーバー上で実行されるAPIレイヤーが必要

Next.js では、[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) を使用してAPIエンドポイントを作成できます。

### データベースクエリ

フルスタックアプリケーションを作成する際、データベースとやり取りするロジックも書く必要があります。Postgres のような[リレーショナルデータベース](https://aws.amazon.com/relational-database/)の場合、SQL や [ORM](https://vercel.com/docs/storage/vercel-postgres/using-an-orm) でこれを行うことができます。

データベースクエリを書く必要があるケースがいくつかあります：

• APIエンドポイントを作成する際、データベースとやり取りするロジックを書く必要がある
• React Server Components を使用している場合（サーバー上でデータを取得）、APIレイヤーをスキップして、データベースシークレットをクライアントに公開するリスクなしに直接データベースにクエリできる

React Server Components について詳しく学びましょう。

### Server Components を使用したデータの取得

デフォルトで、Next.js アプリケーションは React Server Components を使用します。Server Components でのデータ取得は比較的新しいアプローチで、それらを使用することにはいくつかの利点があります：

• Server Components は JavaScript の Promise をサポートし、データ取得などの非同期タスクの解決策をネイティブに提供します。`useEffect`、`useState`、またはその他のデータ取得ライブラリを必要とせずに、`async/await` 構文を使用できます
• Server Components はサーバー上で実行されるため、高価なデータ取得とロジックをサーバー上に保持し、結果のみをクライアントに送信できます
• Server Components はサーバー上で実行されるため、追加のAPIレイヤーなしに直接データベースにクエリできます。これにより、追加のコードを書いて維持する手間が省けます

### SQL の使用

ダッシュボードアプリケーションでは、[postgres.js](https://github.com/porsager/postgres) ライブラリと SQL を使用してデータベースクエリを書きます。SQL を使用する理由がいくつかあります：

• SQL はリレーショナルデータベースをクエリする業界標準です（例：ORMは内部でSQLを生成します）
• SQL の基本的な理解は、リレーショナルデータベースの基礎を理解するのに役立ち、他のツールにも知識を応用できます
• SQL は汎用性があり、特定のデータを取得して操作できます
• `postgres.js` ライブラリは [SQL インジェクション](https://github.com/porsager/postgres?tab=readme-ov-file#query-parameters) から保護します

SQL を使用したことがなくても心配ありません - クエリを提供しています。

`/app/lib/data.ts` に移動してください。ここで `postgres` を使用していることがわかります。`sql` [関数](https://github.com/porsager/postgres) を使用してデータベースにクエリできます：

```typescript
// /app/lib/data.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...
```

Server Component のようなサーバー上のどこでも `sql` を呼び出すことができます。しかし、コンポーネントをより簡単にナビゲートできるように、すべてのデータクエリを `data.ts` ファイルに保持し、コンポーネントにインポートできます。

> **注意：** 第6章で独自のデータベースプロバイダーを使用した場合、プロバイダーで動作するようにデータベースクエリを更新する必要があります。クエリは `/app/lib/data.ts` にあります。

## ダッシュボード概要ページのデータ取得

データを取得するさまざまな方法を理解したので、ダッシュボード概要ページのデータを取得しましょう。`/app/dashboard/page.tsx` に移動し、以下のコードを貼り付けて、時間をかけて探索してください：

```tsx
// /app/dashboard/page.tsx
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
```

上記のコードは意図的にコメントアウトされています。これから各部分を例を示して説明します。

• `page` は async server component です。これにより、`await` を使用してデータを取得できます
• データを受け取る3つのコンポーネントもあります：`<Card>`、`<RevenueChart>`、`<LatestInvoices>`。これらは現在コメントアウトされており、まだ実装されていません

## `<RevenueChart/>` のデータ取得

`<RevenueChart/>` コンポーネントのデータを取得するために、`data.ts` から `fetchRevenue` 関数をインポートし、コンポーネント内で呼び出します：

```tsx
// /app/dashboard/page.tsx
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { fetchRevenue } from "@/app/lib/data";

export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```

次に、以下を行います：

1. `<RevenueChart/>` コンポーネントのコメントアウトを解除します
2. コンポーネントファイル（`/app/ui/dashboard/revenue-chart.tsx`）に移動し、その中のコードのコメントアウトを解除します
3. `localhost:3000` を確認すると、`revenue` データを使用したチャートが表示されるはずです

![過去12ヶ月の総収益を表示する収益チャート](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Frecent-revenue.png&w=1920&q=75)

より多くのデータをインポートして、ダッシュボードに表示し続けましょう。

## `<LatestInvoices/>` のデータ取得

`<LatestInvoices />` コンポーネントでは、日付でソートされた最新の5つの請求書を取得する必要があります。

すべての請求書を取得してJavaScriptを使用してそれらをソートすることもできます。データが小さいので問題ありませんが、アプリケーションが成長するにつれて、各リクエストで転送されるデータ量とそれをソートするために必要なJavaScriptが大幅に増加する可能性があります。

メモリ内で最新の請求書をソートする代わりに、SQLクエリを使用して最新の5つの請求書のみを取得できます。例えば、これは `data.ts` ファイルからのSQLクエリです：

```typescript
// /app/lib/data.ts
// 最新の5つの請求書を日付でソートして取得
const data = await sql<LatestInvoiceRaw[]>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;
```

ページで、`fetchLatestInvoices` 関数をインポートします：

```tsx
// /app/dashboard/page.tsx
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { fetchRevenue, fetchLatestInvoices } from "@/app/lib/data";

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // ...
}
```

次に、`<LatestInvoices />` コンポーネントのコメントアウトを解除します。`/app/ui/dashboard/latest-invoices` にある `<LatestInvoices />` コンポーネント自体の関連するコードのコメントアウトも解除する必要があります。

localhost にアクセスすると、データベースから最新の5つのみが返されることが確認できるはずです。データベースに直接クエリする利点が見え始めているはずです！

![収益チャートと一緒の最新請求書コンポーネント](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flatest-invoices.png&w=1920&q=75)

## 練習：`<Card>` コンポーネントのデータ取得

今度はあなたの番です。`<Card>` コンポーネントのデータを取得しましょう。カードには以下のデータが表示されます：

• 回収された請求書の総額
• 保留中の請求書の総額
• 請求書の総数
• 顧客の総数

再び、すべての請求書と顧客を取得し、JavaScriptを使用してデータを操作したくなるかもしれません。例えば、`Array.length` を使用して請求書と顧客の総数を取得できます：

```javascript
const totalInvoices = allInvoices.length;
const totalCustomers = allCustomers.length;
```

しかし、SQLを使用すれば、必要なデータのみを取得できます。`Array.length` を使用するより少し長くなりますが、リクエスト中に転送する必要があるデータが少なくなります。これがSQLの代替案です：

```typescript
// /app/lib/data.ts
const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
```

インポートする必要がある関数は `fetchCardData` と呼ばれます。関数から返される値を分割代入する必要があります。

> **ヒント：**
>
> • カードコンポーネントをチェックして、必要なデータを確認してください
> • `data.ts` ファイルをチェックして、関数が何を返すかを確認してください

準備ができたら、以下のトグルを展開して最終的なコードを確認してください：

**解答：**

```tsx
// /app/dashboard/page.tsx
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from "@/app/lib/data";

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

素晴らしい！ダッシュボード概要ページのすべてのデータを取得しました。ページは次のようになるはずです：

![すべてのデータが取得されたダッシュボードページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fcomplete-dashboard.png&w=1920&q=75)

しかし...注意すべき2つのことがあります：

1. データリクエストが意図せずお互いをブロックし、リクエストウォーターフォールを作成している
2. デフォルトで、Next.js はパフォーマンスを向上させるためにルートを事前レンダリングしますが、これは静的レンダリングと呼ばれます。そのため、データが変更されても、ダッシュボードに反映されません

この章では1番について説明し、次の章で2番について詳しく見ていきます。

## リクエストウォーターフォールとは

「ウォーターフォール」とは、前のリクエストの完了に依存するネットワークリクエストのシーケンスを指します。データ取得の場合、前のリクエストがデータを返した後にのみ、各リクエストが開始できます。

![シーケンシャルデータ取得と並列データ取得の時間を示す図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fsequential-parallel-data-fetching.png&w=3840&q=75)

例えば、`fetchLatestInvoices()` が実行を開始する前に `fetchRevenue()` の実行を待つ必要があり、以下同様です。

```tsx
// /app/dashboard/page.tsx
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // fetchRevenue() の完了を待つ
const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData(); // fetchLatestInvoices() の完了を待つ
```

このパターンは必ずしも悪いものではありません。次のリクエストを行う前に条件を満たしたい場合など、ウォーターフォールが必要な場合があります。例えば、まずユーザーのIDとプロフィール情報を取得したい場合があります。IDを取得したら、友達のリストを取得することに進むかもしれません。この場合、各リクエストは前のリクエストから返されたデータに依存しています。

しかし、この動作は意図しないものである場合もあり、パフォーマンスに影響を与える可能性があります。

## 並列データ取得

ウォーターフォールを避ける一般的な方法は、すべてのデータリクエストを同時に - 並列で開始することです。

JavaScript では、[Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) または [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 関数を使用して、すべてのプロミスを同時に開始できます。例えば、`data.ts` で、`fetchCardData()` 関数で `Promise.all()` を使用しています：

```typescript
// /app/lib/data.ts
export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // ...
  }
}
```

このパターンを使用することで：

• ウォーターフォールで各リクエストの完了を待つよりも高速な、すべてのデータ取得の実行を同時に開始できます
• 任意のライブラリやフレームワークに適用できるネイティブJavaScriptパターンを使用できます

しかし、このJavaScriptパターンのみに依存することには1つの欠点があります：1つのデータリクエストが他のすべてよりも遅い場合はどうなるでしょうか？次の章で詳しく見ていきましょう。

## 第7章を完了しました

Next.js でデータを取得するさまざまな方法について学びました。

次は

**第8章：静的および動的レンダリング**

Next.js の異なるレンダリングモードについて学びます。

[第8章を開始](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering)
