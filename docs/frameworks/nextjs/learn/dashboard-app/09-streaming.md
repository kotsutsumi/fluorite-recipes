# ストリーミング

前の章では、Next.jsの異なるレンダリング方法について学びました。また、遅いデータフェッチがアプリケーションのパフォーマンスにどのような影響を与えるかについても説明しました。遅いデータリクエストがある場合のユーザーエクスペリエンスを改善する方法を見ていきましょう。

この章では...

以下のトピックを扱います

- ストリーミングとは何か、いつ使用するか
- `loading.tsx`とSuspenseを使用してストリーミングを実装する方法
- ローディングスケルトンとは何か
- Next.jsルートグループとは何か、いつ使用するか
- アプリケーションのどこにReact Suspenseバウンダリを配置するか

## ストリーミングとは

ストリーミングは、ルートをより小さな「チャンク」に分割し、準備ができたものから順次サーバーからクライアントに段階的にストリーミングするデータ転送技術です。

![シーケンシャルデータフェッチと並列データフェッチを示す図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fserver-rendering-with-streaming.png&w=3840&q=75)

ストリーミングにより、遅いデータリクエストがページ全体をブロックすることを防げます。これにより、ユーザーは全てのデータが読み込まれる前にUIが表示されるのを待つことなく、ページの一部を見て操作することができます。

![シーケンシャルデータフェッチと並列データフェッチを示すチャート](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fserver-rendering-with-streaming-chart.png&w=3840&q=75)

ストリーミングはReactのコンポーネントモデルとよく連携します。各コンポーネントをチャンクとして考えることができるからです。

Next.jsでストリーミングを実装する方法は2つあります：

1. ページレベルで、`loading.tsx`ファイルを使用する（これが`<Suspense>`を自動的に作成します）
2. コンポーネントレベルで、`<Suspense>`を使用してより細かい制御を行う

これがどのように動作するか見てみましょう。

## loading.tsxでページ全体をストリーミング

`/app/dashboard`フォルダ内に、`loading.tsx`という新しいファイルを作成します：

```tsx
// /app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

[http://localhost:3000/dashboard](http://localhost:3000/dashboard)を更新すると、次のように表示されるはずです：

![「Loading...」テキストを表示するダッシュボードページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Floading-page.png&w=1920&q=75)

ここでは以下のことが起こっています：

1. `loading.tsx`は、React Suspenseの上に構築されたNext.jsの特別なファイルです。ページコンテンツの読み込み中の代替として表示するフォールバックUIを作成できます。
2. `<SideNav>`は静的なので、すぐに表示されます。ユーザーは動的コンテンツが読み込まれている間も`<SideNav>`を操作できます。
3. ユーザーはページの読み込みが完了するのを待つことなく、別の場所にナビゲートできます（これは中断可能なナビゲーションと呼ばれます）。

おめでとうございます！ストリーミングを実装しました。しかし、ユーザーエクスペリエンスを改善するためにできることはもっとあります。`Loading…`テキストの代わりにローディングスケルトンを表示しましょう。

### ローディングスケルトンの追加

ローディングスケルトンは、UIの簡略版です。多くのWebサイトでは、コンテンツが読み込まれていることをユーザーに示すプレースホルダー（またはフォールバック）として使用しています。`loading.tsx`に追加するUIは、静的ファイルの一部として埋め込まれ、最初に送信されます。その後、残りの動的コンテンツがサーバーからクライアントにストリーミングされます。

`loading.tsx`ファイル内で、`<DashboardSkeleton>`という新しいコンポーネントをインポートします：

```tsx
// /app/dashboard/loading.tsx
import DashboardSkeleton from "@/app/ui/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}
```

その後、[http://localhost:3000/dashboard](http://localhost:3000/dashboard)を更新すると、次のように表示されるはずです：

![ローディングスケルトンを表示するダッシュボードページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Floading-page-with-skeleton.png&w=1920&q=75)

### ルートグループでローディングスケルトンのバグを修正

現在、ローディングスケルトンはinvoicesにも適用されています。

`loading.tsx`はファイルシステム内で`/invoices/page.tsx`と`/customers/page.tsx`よりも上位レベルにあるため、これらのページにも適用されています。

これを[ルートグループ](https://nextjs.org/docs/app/building-your-application/routing/route-groups)で変更できます。dashboardフォルダ内に`/(overview)`という新しいフォルダを作成します。その後、`loading.tsx`と`page.tsx`ファイルをフォルダ内に移動します：

![括弧を使用してルートグループを作成する方法を示すフォルダ構造](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Froute-group.png&w=3840&q=75)

これで、`loading.tsx`ファイルはダッシュボードの概要ページにのみ適用されます。

ルートグループを使用すると、URLパス構造に影響を与えることなく、ファイルを論理グループに整理できます。括弧`()`を使用して新しいフォルダを作成すると、その名前はURLパスに含まれません。つまり、`/dashboard/(overview)/page.tsx`は`/dashboard`になります。

ここでは、ルートグループを使用して`loading.tsx`がダッシュボードの概要ページにのみ適用されるようにしています。ただし、ルートグループを使用してアプリケーションをセクション（例：`(marketing)`ルートと`(shop)`ルート）やより大きなアプリケーションのチーム別に分離することもできます。

### コンポーネントのストリーミング

これまで、ページ全体をストリーミングしていました。しかし、React Suspenseを使用して、より細かく特定のコンポーネントをストリーミングすることもできます。

Suspenseを使用すると、何らかの条件が満たされるまで（例：データが読み込まれるまで）、アプリケーションの一部のレンダリングを延期できます。動的コンポーネントをSuspenseでラップできます。その後、動的コンポーネントが読み込まれている間に表示するフォールバックコンポーネントを渡します。

遅いデータリクエスト`fetchRevenue()`を覚えているなら、これがページ全体を遅くしているリクエストです。ページ全体をブロックする代わりに、Suspenseを使用してこのコンポーネントのみをストリーミングし、ページのUIの残りの部分をすぐに表示できます。

そのためには、データフェッチをコンポーネントに移動する必要があります。コードを更新して、どのようになるか見てみましょう：

`/dashboard/(overview)/page.tsx`から`fetchRevenue()`とそのデータのすべてのインスタンスを削除します：

```tsx
// /app/dashboard/(overview)/page.tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // fetchRevenueを削除

export default async function Page() {
  // const revenue = await fetchRevenue() この行を削除
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    // ...
  );
}
```

次に、Reactから`<Suspense>`をインポートし、`<RevenueChart />`をラップします。`<RevenueChartSkeleton>`というフォールバックコンポーネントを渡すことができます。

```tsx
// /app/dashboard/(overview)/page.tsx
import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestInvoices, fetchCardData } from "@/app/lib/data";
import { Suspense } from "react";
import { RevenueChartSkeleton } from "@/app/ui/skeletons";

export default async function Page() {
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
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

最後に、`<RevenueChart>`コンポーネントを更新して独自のデータをフェッチし、渡されたプロパティを削除します：

```tsx
// /app/ui/dashboard/revenue-chart.tsx
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

// ...

export default async function RevenueChart() { // コンポーネントを非同期にし、propsを削除
  const revenue = await fetchRevenue(); // コンポーネント内でデータをフェッチ

  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    // ...
  );
}
```

ページを更新すると、ダッシュボード情報がほぼ即座に表示され、`<RevenueChart>`にはフォールバックスケルトンが表示されるはずです：

![収益チャートスケルトンとロードされたCardおよびLatest Invoicesコンポーネントを表示するダッシュボードページ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Floading-revenue-chart.png&w=1920&q=75)

### 練習：`<LatestInvoices>`のストリーミング

今度はあなたの番です！学んだことを実践して、`<LatestInvoices>`コンポーネントをストリーミングしてください。

`fetchLatestInvoices()`をページから`<LatestInvoices>`コンポーネントに移動します。コンポーネントを`<LatestInvoicesSkeleton>`というフォールバックを持つ`<Suspense>`バウンダリでラップします。

## コンポーネントのグループ化

素晴らしい！もう少しです。今度は`<Card>`コンポーネントをSuspenseでラップする必要があります。各個別カードのデータをフェッチできますが、これはカードが読み込まれる際にポッピング効果を引き起こす可能性があり、ユーザーにとって視覚的に不快になる可能性があります。

では、この問題にどのように取り組みますか？

よりスタガード効果を作成するために、ラッパーコンポーネントを使用してカードをグループ化できます。これは、静的な`<SideNav/>`が最初に表示され、その後にカードなどが続くことを意味します。

`page.tsx`ファイルで：

1. `<Card>`コンポーネントを削除します。
2. `fetchCardData()`関数を削除します。
3. `<CardWrapper />`という新しいラッパーコンポーネントをインポートします。
4. `<CardsSkeleton />`という新しいスケルトンコンポーネントをインポートします。
5. `<CardWrapper />`をSuspenseでラップします。

```tsx
// /app/dashboard/(overview)/page.tsx
import CardWrapper from "@/app/ui/dashboard/cards";
// ...
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      // ...
    </main>
  );
}
```

次に、ファイル`/app/ui/dashboard/cards.tsx`に移動し、`fetchCardData()`関数をインポートして、`<CardWrapper/>`コンポーネント内で呼び出します。このコンポーネントで必要なコードのコメントアウトを解除することを確認してください。

```tsx
// /app/ui/dashboard/cards.tsx
// ...
import { fetchCardData } from "@/app/lib/data";

// ...

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}
```

ページを更新すると、すべてのカードが同時に読み込まれるのが見えるはずです。複数のコンポーネントを同時に読み込みたい場合に、このパターンを使用できます。

## Suspenseバウンダリの配置場所を決める

Suspenseバウンダリをどこに配置するかは、いくつかの要因によって決まります：

1. ページがストリーミングされる際に、ユーザーにどのような体験をしてもらいたいか
2. 優先したいコンテンツは何か
3. コンポーネントがデータフェッチに依存しているか

ダッシュボードページを見て、何か違うことをしたでしょうか？

心配しないでください。正解はありません。

- `loading.tsx`で行ったようにページ全体をストリーミングできます...しかし、コンポーネントの1つが遅いデータフェッチを持っている場合、読み込み時間が長くなる可能性があります。
- 各コンポーネントを個別にストリーミングできます...しかし、準備ができたときにUIが画面にポップアップする可能性があります。
- ページセクションをストリーミングしてスタガード効果を作成することもできます。しかし、ラッパーコンポーネントを作成する必要があります。

Suspenseバウンダリを配置する場所は、アプリケーションによって異なります。一般的に、データフェッチを必要とするコンポーネントに移動し、それらのコンポーネントをSuspenseでラップすることが良い習慣です。しかし、アプリケーションが必要とするなら、セクションやページ全体をストリーミングしても問題ありません。

Suspenseで実験することを恐れず、何が最適に機能するかを確認してください。これは、より楽しいユーザーエクスペリエンスを作成するのに役立つ強力なAPIです。

## 今後の展望

ストリーミングとサーバーコンポーネントは、データフェッチと読み込み状態を処理する新しい方法を提供し、最終的にエンドユーザーエクスペリエンスの改善を目標としています。

次の章では、ストリーミングを念頭に置いて構築された新しいNext.jsレンダリングモデルである部分的プリレンダリングについて学びます。

## 第9章を完了しました

Suspenseとローディングスケルトンでコンポーネントをストリーミングする方法を学びました。

次は

**10: 部分的プリレンダリング**

ストリーミングを念頭に置いて構築された新しい実験的レンダリングモデルである部分的プリレンダリングの早期概要。
