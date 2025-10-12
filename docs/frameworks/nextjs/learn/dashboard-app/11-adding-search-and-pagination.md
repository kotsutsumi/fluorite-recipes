# 検索とページネーションの追加

前の章では、ストリーミングを使用してダッシュボードの初期読み込みパフォーマンスを改善しました。今度は `/invoices` ページに移り、検索とページネーションの追加方法を学習しましょう。

この章では...

ここでカバーするトピック

🔍 **Next.js APIの使用方法を学ぶ**: `useSearchParams`、`usePathname`、`useRouter`

📄 **URL検索パラメータを使用した検索とページネーションの実装**

## 初期コード

`/dashboard/invoices/page.tsx` ファイル内に、以下のコードを貼り付けてください：

```tsx
// /app/dashboard/invoices/page.tsx
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

ページと、これから作業するコンポーネントに慣れるために時間をかけてください：

1. `<Search/>` では、ユーザーが特定の請求書を検索できます。
2. `<Pagination/>` では、ユーザーが請求書のページ間を移動できます。
3. `<Table/>` では、請求書が表示されます。

検索機能は、クライアントとサーバーにまたがります。ユーザーがクライアント上で請求書を検索すると、URLパラメータが更新され、サーバー上でデータが取得され、新しいデータでサーバー上でテーブルが再レンダリングされます。

## なぜURL検索パラメータを使用するのか？

上述したように、検索状態を管理するためにURL検索パラメータを使用します。クライアントサイドの状態で行うことに慣れている場合は、このパターンは新しいかもしれません。

URL パラメータで検索を実装することには、いくつかの利点があります：

• **ブックマークと共有可能なURL**: 検索パラメータがURLに含まれているため、ユーザーは検索クエリやフィルターを含むアプリケーションの現在の状態をブックマークして、将来の参照や共有のために使用できます。

• **サーバーサイドレンダリング**: URLパラメータはサーバー上で直接使用して初期状態をレンダリングできるため、サーバーレンダリングの処理が簡単になります。

• **分析と追跡**: 検索クエリとフィルターが直接URLに含まれているため、追加のクライアントサイドロジックを必要とせずに、ユーザーの行動を追跡することが簡単になります。

## 検索機能の追加

これらは、検索機能を実装するために使用するNext.jsクライアントフックです：

• **`useSearchParams`** - 現在のURLのパラメータにアクセスできます。例えば、このURL `/dashboard/invoices?page=1&query=pending` の検索パラメータは次のようになります：`{page: '1', query: 'pending'}`。

• **`usePathname`** - 現在のURLのパス名を読み取ることができます。例えば、ルート `/dashboard/invoices` の場合、`usePathname` は `'/dashboard/invoices'` を返します。

• **`useRouter`** - クライアントコンポーネント内でプログラム的にルート間のナビゲーションを可能にします。使用できる[複数のメソッド](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)があります。

実装手順の簡単な概要は次のとおりです：

1. ユーザーの入力をキャプチャする。
2. 検索パラメータでURLを更新する。
3. URLを入力フィールドと同期させる。
4. 検索クエリを反映するようにテーブルを更新する。

### 1. ユーザーの入力をキャプチャ

`<Search>` コンポーネント（`/app/ui/search.tsx`）に移動すると、次のことに気がつくでしょう：

• **`"use client"`** - これはクライアントコンポーネントです。つまり、イベントリスナーとフックを使用できます。
• **`<input>`** - これは検索入力です。

新しい `handleSearch` 関数を作成し、`<input>` 要素に `onChange` リスナーを追加します。`onChange` は入力値が変更されるたびに `handleSearch` を呼び出します。

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search({ placeholder }: { placeholder: string }) {
  function handleSearch(term: string) {
    console.log(term);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
```

ブラウザの開発者ツールでコンソールを開き、検索フィールドに入力して正しく動作していることを確認してください。検索語がブラウザコンソールにログ出力されるはずです。

素晴らしい！ユーザーの検索入力をキャプチャしています。今度は、検索語でURLを更新する必要があります。

### 2. 検索パラメータでURLを更新

`next/navigation` から `useSearchParams` フックをインポートし、変数に割り当てます：

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    console.log(term);
  }
  // ...
}
```

`handleSearch` 内で、新しい `searchParams` 変数を使用して新しい [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) インスタンスを作成します：

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
  }
  // ...
}
```

`URLSearchParams` は、URL クエリパラメータを操作するためのユーティリティメソッドを提供するWeb APIです。複雑な文字列リテラルを作成する代わりに、これを使用して `?page=1&query=a` のようなパラメータ文字列を取得できます。

次に、ユーザーの入力に基づいて params 文字列を `set` します。入力が空の場合は、それを `delete` したいです：

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
  }
  // ...
}
```

クエリ文字列ができたので、Next.jsの `useRouter` と `usePathname` フックを使用してURLを更新できます。

`'next/navigation'` から `useRouter` と `usePathname` をインポートし、`handleSearch` 内で `useRouter()` の `replace` メソッドを使用します：

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }
}
```

何が起こっているかの詳細は次のとおりです：

• `${pathname}` は現在のパスで、あなたの場合は `"/dashboard/invoices"` です。
• ユーザーが検索バーに入力すると、`params.toString()` はこの入力をURL対応の形式に変換します。
• `replace(${pathname}?${params.toString()})` は、ユーザーの検索データでURLを更新します。例えば、ユーザーが "Lee" を検索した場合は `/dashboard/invoices?query=lee` になります。
• Next.jsのクライアントサイドナビゲーション（[ページ間のナビゲーション](https://nextjs.org/learn/dashboard-app/navigating-between-pages)の章で学んだ）のおかげで、ページをリロードせずにURLが更新されます。

### 3. URLと入力を同期させる

入力フィールドがURLと同期され、共有時に設定されるようにするには、`searchParams` から読み取って入力に `defaultValue` を渡すことができます：

```tsx
<input
  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  placeholder={placeholder}
  onChange={(e) => {
    handleSearch(e.target.value);
  }}
  defaultValue={searchParams.get("query")?.toString()}
/>
```

**`defaultValue` vs. `value` / 制御 vs. 非制御**

入力の値を管理するために状態を使用している場合は、`value` 属性を使用して制御されたコンポーネントにします。これは、Reactが入力の状態を管理することを意味します。

しかし、状態を使用していないため、`defaultValue` を使用できます。これは、ネイティブ入力が独自の状態を管理することを意味します。状態ではなくURLに検索クエリを保存しているため、これで問題ありません。

### 4. テーブルの更新

最後に、検索クエリを反映するようにテーブルコンポーネントを更新する必要があります。

請求書ページに戻ります。

ページコンポーネントは[searchParams という props を受け取る](https://nextjs.org/docs/app/api-reference/file-conventions/page)ため、現在のURL パラメータを `<Table>` コンポーネントに渡すことができます。

```tsx
// /app/dashboard/invoices/page.tsx
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

`<Table>` コンポーネントに移動すると、2つのprops である `query` と `currentPage` が、クエリにマッチする請求書を返す `fetchFilteredInvoices()` 関数に渡されていることがわかります。

```tsx
// /app/ui/invoices/table.tsx
// ...
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}
```

これらの変更により、テストしてみてください。語句を検索すると、URLが更新され、サーバーに新しいリクエストが送信され、サーバー上でデータが取得され、クエリにマッチする請求書のみが返されます。

> **`useSearchParams()` フックと `searchParams` prop のどちらを使用するか？**
>
> 検索パラメータを抽出するために2つの異なる方法を使用したことに気づいたかもしれません。どちらを使用するかは、クライアントまたはサーバーで作業しているかによって異なります。
>
> • `<Search>` はクライアントコンポーネントなので、クライアントからパラメータにアクセスするために `useSearchParams()` フックを使用しました。
> • `<Table>` は独自のデータを取得するサーバーコンポーネントなので、ページからコンポーネントに `searchParams` prop を渡すことができます。
>
> 一般的なルールとして、クライアントからパラメータを読み取りたい場合は、サーバーに戻る必要がないため、`useSearchParams()` フックを使用してください。

### ベストプラクティス：デバウンス

おめでとうございます！Next.jsで検索を実装しました！しかし、最適化できることがあります。

`handleSearch` 関数内に、次の `console.log` を追加してください：

```tsx
// /app/ui/search.tsx
function handleSearch(term: string) {
  console.log(`Searching... ${term}`);

  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set("query", term);
  } else {
    params.delete("query");
  }
  replace(`${pathname}?${params.toString()}`);
}
```

次に、検索バーに "Delba" と入力し、開発ツールのコンソールを確認してください。何が起こっているでしょうか？

```
Dev Tools Console
Searching... D
Searching... De
Searching... Del
Searching... Delb
Searching... Delba
```

キーストロークごとにURLを更新しているため、キーストロークごとにデータベースをクエリしています！アプリケーションが小さいので問題ありませんが、アプリケーションに数千人のユーザーがいて、それぞれがキーストロークごとにデータベースに新しいリクエストを送信している場合を想像してください。

**デバウンス**は、関数が発火できる速度を制限するプログラミングプラクティスです。私たちの場合、ユーザーが入力を停止したときにのみデータベースをクエリしたいです。

> **デバウンスの仕組み：**
>
> 1. **トリガーイベント**: デバウンスすべきイベント（検索ボックスのキーストロークなど）が発生すると、タイマーが開始されます。
> 2. **待機**: タイマーが期限切れになる前に新しいイベントが発生した場合、タイマーはリセットされます。
> 3. **実行**: タイマーがカウントダウンの終了に達した場合、デバウンスされた関数が実行されます。

独自のデバウンス関数を手動で作成することを含め、いくつかの方法でデバウンスを実装できます。シンプルに保つために、[use-debounce](https://www.npmjs.com/package/use-debounce) というライブラリを使用します。

`use-debounce` をインストールします：

```bash
pnpm i use-debounce
```

`<Search>` コンポーネントで、`useDebouncedCallback` という関数をインポートします：

```tsx
// /app/ui/search.tsx
// ...
import { useDebouncedCallback } from "use-debounce";

// Search コンポーネント内で...
const handleSearch = useDebouncedCallback((term) => {
  console.log(`Searching... ${term}`);

  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set("query", term);
  } else {
    params.delete("query");
  }
  replace(`${pathname}?${params.toString()}`);
}, 300);
```

この関数は `handleSearch` の内容をラップし、ユーザーが入力を停止した後の特定の時間（300ms）後にのみコードを実行します。

今度は検索バーに再度入力し、開発ツールでコンソールを開いてください。次のように表示されるはずです：

```
Dev Tools Console
Searching... Delba
```

デバウンスにより、データベースに送信されるリクエスト数を減らし、リソースを節約できます。

## ページネーションの追加

検索機能を導入した後、テーブルには一度に6つの請求書のみが表示されることに気づくでしょう。これは、`data.ts` の `fetchFilteredInvoices()` 関数がページあたり最大6つの請求書を返すからです。

ページネーションを追加することで、ユーザーがさまざまなページを移動してすべての請求書を表示できます。検索と同様に、URLパラメータを使用してページネーションを実装する方法を見てみましょう。

`<Pagination/>` コンポーネントに移動すると、それがクライアントコンポーネントであることがわかります。データベースの秘密を公開することになるため（APIレイヤーを使用していないことを思い出してください）、クライアント上でデータを取得したくありません。代わりに、サーバー上でデータを取得し、propとしてコンポーネントに渡すことができます。

`/dashboard/invoices/page.tsx` で、`fetchInvoicesPages` という新しい関数をインポートし、`searchParams` からの `query` を引数として渡します：

```tsx
// /app/dashboard/invoices/page.tsx
// ...
import { fetchInvoicesPages } from '@/app/lib/data';

export default async function Page(
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    // ...
  );
}
```

`fetchInvoicesPages` は検索クエリに基づいた総ページ数を返します。例えば、検索クエリにマッチする請求書が12個あり、各ページに6個の請求書が表示される場合、総ページ数は2になります。

次に、`totalPages` propを `<Pagination/>` コンポーネントに渡します：

```tsx
// /app/dashboard/invoices/page.tsx
// ...

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
```

`<Pagination/>` コンポーネントに移動し、`usePathname` と `useSearchParams` フックをインポートします。これを使用して現在のページを取得し、新しいページを設定します。このコンポーネントのコードのコメントアウトも解除してください。`<Pagination/>` ロジックをまだ実装していないため、アプリケーションは一時的に壊れます。今すぐそれを行いましょう！

```tsx
// /app/ui/invoices/pagination.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // ...
}
```

次に、`<Pagination>` コンポーネント内で `createPageURL` という新しい関数を作成します。検索と同様に、`URLSearchParams` を使用して新しいページ番号を設定し、`pathName` を使用してURL文字列を作成します。

```tsx
// /app/ui/invoices/pagination.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // ...
}
```

何が起こっているかの詳細は次のとおりです：

• `createPageURL` は現在の検索パラメータのインスタンスを作成します。
• 次に、"page" パラメータを提供されたページ番号に更新します。
• 最後に、パス名と更新された検索パラメータを使用して完全なURLを構築します。

`<Pagination>` コンポーネントの残りの部分は、スタイリングとさまざまな状態（最初、最後、アクティブ、無効など）を扱います。このコースでは詳しく説明しませんが、`createPageURL` が呼び出されている場所を確認してください。

最後に、ユーザーが新しい検索クエリを入力したときに、ページ番号を1にリセットしたいです。`<Search>` コンポーネントの `handleSearch` 関数を更新することでこれを行うことができます：

```tsx
// /app/ui/search.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // ...
}
```

## まとめ

おめでとうございます！URL検索パラメータとNext.js APIを使用して検索とページネーションを実装しました。

この章をまとめると：

• クライアント状態の代わりにURL検索パラメータで検索とページネーションを処理しました。
• サーバー上でデータを取得しました。
• よりスムーズなクライアントサイド遷移のために `useRouter` ルーターフックを使用しました。

これらのパターンは、クライアントサイドReactで作業する際に慣れ親しんでいるものとは異なるかもしれませんが、URL検索パラメータを使用してこの状態をサーバーに移すことの利点をよりよく理解できたでしょう。

## 第11章を完了しました

ダッシュボードに検索とページネーション機能が追加されました！

次に

**第12章：データの変更**

Server Actionsを使用してデータを変更する方法を学習します。

[第12章を開始](https://nextjs.org/learn/dashboard-app/mutating-data)
