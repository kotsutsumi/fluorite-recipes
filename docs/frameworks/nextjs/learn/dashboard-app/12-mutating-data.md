# データの変更

前の章では、URL検索パラメータとNext.js APIを使用して検索とページネーションを実装しました。請求書ページで請求書の作成、更新、削除機能を追加して作業を続けましょう！

この章では...

ここで扱うトピック

[Image: Image]

React Server Actionsとは何か、データの変更にどう使用するか

[Image: Image]

フォームとサーバーコンポーネントの使い方

[Image: Image]

タイプ検証を含む、ネイティブ`FormData`オブジェクトの使用におけるベストプラクティス

[Image: Image]

`revalidatePath` APIを使用してクライアントキャッシュを再検証する方法

[Image: Image]

特定のIDを持つ動的ルートセグメントの作成方法

## Server Actionsとは何か？

React Server Actionsを使用すると、サーバー上で直接非同期コードを実行できます。
データを変更するためのAPIエンドポイントを作成する必要がありません。代わりに、
サーバー上で実行され、クライアントまたはサーバーコンポーネントから呼び出すことができる非同期関数を書きます。

Webアプリケーションは様々な脅威に対して脆弱であるため、セキュリティは最重要事項です。ここでServer Actionsが活躍します。暗号化クロージャ、厳密な入力チェック、エラーメッセージのハッシュ化、ホスト制限など、これらすべてが連携してアプリケーションのセキュリティを大幅に向上させます。

## Server Actionsでフォームを使用する

Reactでは、`<form>`要素の`action`属性を使用してアクションを呼び出すことができます。アクションは自動的にキャプチャされたデータを含む、ネイティブ[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)オブジェクトを受け取ります。

例：

```tsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    "use server";
    // データを変更するロジック...
  }

  // "action"属性を使用してアクションを呼び出す
  return <form action={create}>...</form>;
}
```

サーバーコンポーネント内でServer Actionを呼び出すことの利点は、プログレッシブエンハンスメントです - フォームはJavaScriptがクライアントにまだ読み込まれていなくても動作します。
例えば、インターネット接続が遅い場合でも。

## Next.jsとServer Actions

Server ActionsはNext.jsの[キャッシュ](https://nextjs.org/docs/app/building-your-application/caching)とも深く統合されています。Server Actionを通じてフォームが送信されると、データを変更するためにアクションを使用できるだけでなく、`revalidatePath`や`revalidateTag`などのAPIを使用して関連するキャッシュを再検証することもできます。

すべてがどのように連携するかを見てみましょう！

## 請求書の作成

新しい請求書を作成するために従う手順は次のとおりです：

1. ユーザーの入力をキャプチャするフォームを作成する。
2. Server Actionを作成し、フォームから呼び出す。
3. Server Action内で、`formData`オブジェクトからデータを抽出する。
4. データベースに挿入するためにデータを検証し、準備する。
5. データを挿入し、エラーを処理する。
6. キャッシュを再検証し、ユーザーを請求書ページにリダイレクトする。

### 1. 新しいルートとフォームの作成

開始するには、`/invoices`フォルダ内で、`page.tsx`ファイルを含む`/create`という新しいルートセグメントを追加します：

![Create invoice route structure](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fcreate-invoice-route.png&w=3840&q=75)

このルートを使用して新しい請求書を作成します。`page.tsx`ファイル内に、以下のコードを貼り付けて、しばらく研究してください：

```tsx
// /dashboard/invoices/create/page.tsx
import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```

このページは`customers`を取得して`<Form>`コンポーネントに渡すサーバーコンポーネントです。時間を節約するために、`<Form>`コンポーネントはすでに作成されています。

`<Form>`コンポーネントに移動すると、フォームが次のようになっていることがわかります：

• 顧客のリストを含む1つの`<select>`（ドロップダウン）要素。
• `type="number"`の金額用の1つの`<input>`要素。
• `type="radio"`のステータス用の2つの`<input>`要素。
• `type="submit"`の1つのボタン。

[http://localhost:3000/dashboard/invoices/create](http://localhost:3000/dashboard/invoices/create)で、次のUIが表示されるはずです：

![Create invoices page](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fcreate-invoice-page.png&w=1920&q=75)

### 2. Server Actionの作成

素晴らしい！今度は、フォームが送信されたときに呼び出されるServer Actionを作成しましょう。

`lib/`ディレクトリに移動し、`actions.ts`という新しいファイルを作成します。このファイルの先頭に、React [use server](https://react.dev/reference/react/use-server)ディレクティブを追加します：

```tsx
// /app/lib/actions.ts
"use server";
```

`'use server'`を追加することで、ファイル内でエクスポートされるすべての関数をServer Actionsとしてマークします。これらのサーバー関数は、クライアントとサーバーコンポーネントでインポートして使用できます。
このファイルに含まれる、使用されていない関数は、最終的なアプリケーションバンドルから自動的に削除されます。

`"use server"`をアクション内に追加することで、サーバーコンポーネント内に直接Server Actionsを書くこともできます。しかし、このコースでは、すべてを別のファイルに整理しておきます。アクション用に別のファイルを持つことをお勧めします。

`actions.ts`ファイルで、`formData`を受け取る新しい非同期関数を作成します：

```tsx
// /app/lib/actions.ts
"use server";

export async function createInvoice(formData: FormData) {}
```

次に、`<Form>`コンポーネントで、`actions.ts`ファイルから`createInvoice`をインポートします。`<form>`要素に`action`属性を追加し、`createInvoice`アクションを呼び出します。

```tsx
// /app/ui/invoices/create-form.tsx
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';

export default function Form({
  customers,
}: {
  customers: CustomerField[];
}) {
  return (
    <form action={createInvoice}>
      // ...
  )
}
```

**覚えておきたいこと：** HTMLでは、`action`属性にURLを渡します。このURLは、フォームデータが送信される宛先（通常はAPIエンドポイント）になります。

しかし、Reactでは、`action`属性は特別なpropと見なされます - つまり、Reactはその上に構築してアクションを呼び出すことができます。

舞台裏では、Server ActionsはPOST APIエンドポイントを作成します。これが、Server Actionsを使用するときに手動でAPIエンドポイントを作成する必要がない理由です。

### 3. formDataからデータを抽出する

`actions.ts`ファイルに戻って、`formData`の値を抽出する必要があります。使用できる[いくつかの方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData)があります。この例では、[.get(name)](https://developer.mozilla.org/en-US/docs/Web/API/FormData/get)メソッドを使用しましょう。

```tsx
// /app/lib/actions.ts
"use server";

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  // テストしてみる：
  console.log(rawFormData);
}
```

**ヒント：** 多くのフィールドを持つフォームを扱っている場合、JavaScriptの[Object.fromEntries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)と[entries()](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries)メソッドの使用を検討してみてください。

すべてが正しく接続されているかを確認するために、フォームを試してみてください。送信後、フォームに入力したデータがターミナル（ブラウザではなく）に記録されているはずです。

データがオブジェクトの形になったので、作業がはるかに簡単になります。

### 4. データの検証と準備

#### タイプ検証と強制

フォームからのデータがデータベースで期待されるタイプと一致することを検証することが重要です。例えば、アクション内に`console.log`を追加すると：

```tsx
console.log(typeof rawFormData.amount);
```

`amount`が`number`ではなく`string`タイプであることがわかります。これは、`type="number"`の`input`要素が実際には数値ではなく文字列を返すためです！

タイプ検証を処理するために、いくつかのオプションがあります。手動でタイプを検証することもできますが、タイプ検証ライブラリを使用すると時間と労力を節約できます。この例では、このタスクを簡素化できるTypeScriptファーストの検証ライブラリである[Zod](https://zod.dev/)を使用します。

`actions.ts`ファイルで、Zodをインポートし、フォームオブジェクトの形と一致するスキーマを定義します。このスキーマは、データベースに保存する前に`formData`を検証します。

```tsx
// /app/lib/actions.ts
"use server";

import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // ...
}
```

`amount`フィールドは、タイプを検証しながら文字列から数値に強制的に変更（変換）するように特別に設定されています。

次に、`rawFormData`を`CreateInvoice`に渡してタイプを検証できます：

```tsx
// /app/lib/actions.ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
}
```

#### 値をセント単位で保存する

JavaScriptの浮動小数点エラーを排除し、より高い精度を確保するために、通常データベースでは金銭的価値をセント単位で保存することが良い慣行です。

金額をセントに変換しましょう：

```tsx
// /app/lib/actions.ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
}
```

#### 新しい日付の作成

最後に、請求書の作成日用に「YYYY-MM-DD」形式の新しい日付を作成しましょう：

```tsx
// /app/lib/actions.ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
}
```

フォームデータをデータベースに送信する前に、正しい形式と正しいタイプであることを確認したいと思います。コースの前半を思い出すと、請求書テーブルは次の形式のデータを期待しています：

```tsx
// /app/lib/definitions.ts
export type Invoice = {
  id: string; // データベースで作成される
  customer_id: string;
  amount: number; // セント単位で保存される
  status: "pending" | "paid";
  date: string;
};
```

これまでのところ、フォームから`customer_id`、`amount`、`status`のみを取得しています。

### 5. データベースへのデータ挿入

データベースに必要なすべての値ができたので、新しい請求書をデータベースに挿入するSQLクエリを作成し、変数を渡すことができます：

```tsx
// /app/lib/actions.ts
import { z } from "zod";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}
```

現在、エラーは処理していません。次の章でこれについて説明します。今のところ、次のステップに進みましょう。

### 6. 再検証とリダイレクト

Next.jsには、ユーザーのブラウザにルートセグメントを一定時間保存するクライアントサイドルーターキャッシュがあります。[プリフェッチング](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-prefetching)と共に、このキャッシュにより、ユーザーはサーバーへのリクエスト数を減らしながらルート間をすばやくナビゲートできます。

請求書ルートに表示されるデータを更新しているため、このキャッシュをクリアし、サーバーへの新しいリクエストをトリガーしたいと思います。Next.jsの[revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)関数でこれを行うことができます：

```tsx
// /app/lib/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");
}
```

データベースが更新されると、`/dashboard/invoices`パスが再検証され、新しいデータがサーバーから取得されます。

この時点で、ユーザーを`/dashboard/invoices`ページにリダイレクトすることも必要です。Next.jsの[redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)関数でこれを行うことができます：

```tsx
// /app/lib/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...

export async function createInvoice(formData: FormData) {
  // ...
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
```

おめでとうございます！最初のServer Actionを実装しました。新しい請求書を追加してテストしてください。すべてが正しく動作している場合：

1. 送信時に`/dashboard/invoices`ルートにリダイレクトされるはずです。
2. テーブルの上部に新しい請求書が表示されるはずです。

## 請求書の更新

請求書の更新フォームは、請求書の作成フォームに似ていますが、データベースのレコードを更新するために請求書の`id`を渡す必要があります。請求書の`id`を取得して渡す方法を見てみましょう。

請求書を更新するために実行する手順は次のとおりです：

1. 請求書`id`を持つ新しい動的ルートセグメントを作成する。
2. ページパラメータから請求書`id`を読み取る。
3. データベースから特定の請求書を取得する。
4. 請求書データでフォームを事前入力する。
5. データベースの請求書データを更新する。

### 1. 請求書idを持つ動的ルートセグメントの作成

Next.jsでは、正確なセグメント名がわからず、データに基づいてルートを作成したい場合に[動的ルートセグメント](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)を作成できます。これは、ブログ投稿のタイトル、商品ページなどです。フォルダ名を角括弧で囲むことで動的ルートセグメントを作成できます。例えば、`[id]`、`[post]`、または`[slug]`です。

`/invoices`フォルダで、`[id]`という新しい動的ルートを作成し、次に`page.tsx`ファイルを含む`edit`という新しいルートを作成します。ファイル構造は次のようになります：

![Edit invoice route structure](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fedit-invoice-route.png&w=3840&q=75)

`<Table>`コンポーネントで、テーブルレコードから請求書の`id`を受け取る`<UpdateInvoice />`ボタンがあることに注意してください。

```tsx
// /app/ui/invoices/table.tsx
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...
    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
      <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}
```

`<UpdateInvoice />`コンポーネントに移動し、`id` propを受け取るように`Link`の`href`を更新します。テンプレートリテラルを使用して動的ルートセグメントにリンクできます：

```tsx
// /app/ui/invoices/buttons.tsx
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// ...

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
```

### 2. ページパラメータから請求書idを読み取る

`<Page>`コンポーネントに戻って、次のコードを貼り付けます：

```tsx
// /app/dashboard/invoices/[id]/edit/page.tsx
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
```

これは`/create`請求書ページに似ていますが、異なるフォーム（`edit-form.tsx`ファイルから）をインポートしていることに注意してください。このフォームは、顧客名、請求書金額、ステータスの`defaultValue`で事前入力されているはずです。フォームフィールドを事前入力するには、`id`を使用して特定の請求書を取得する必要があります。

`searchParams`に加えて、ページコンポーネントは`id`にアクセスするために使用できる`params`というpropも受け取ります。propを受け取るように`<Page>`コンポーネントを更新します：

```tsx
// /app/dashboard/invoices/[id]/edit/page.tsx
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // ...
}
```

### 3. 特定の請求書を取得する

次に：

• `fetchInvoiceById`という新しい関数をインポートし、引数として`id`を渡します。
• ドロップダウンの顧客名を取得するために`fetchCustomers`をインポートします。

`Promise.all`を使用して、請求書と顧客の両方を並行して取得できます：

```tsx
// /dashboard/invoices/[id]/edit/page.tsx
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  // ...
}
```

`invoice`が潜在的に`undefined`である可能性があるため、ターミナルで`invoice` propに対して一時的なTypeScriptエラーが表示されます。今のところ心配しないでください。次の章でエラー処理を追加するときに解決します。

素晴らしい！すべてが正しく接続されていることをテストしてください。[http://localhost:3000/dashboard/invoices](http://localhost:3000/dashboard/invoices)にアクセスし、鉛筆アイコンをクリックして請求書を編集します。ナビゲーション後、請求書の詳細で事前入力されたフォームが表示されるはずです：

![Edit invoice page](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fedit-invoice-page.png&w=1920&q=75)

URLも次のように`id`で更新されているはずです：`http://localhost:3000/dashboard/invoice/uuid/edit`

> **UUIDs vs. 自動インクリメントキー**
>
> インクリメントキー（例：1、2、3など）の代わりにUUIDを使用します。これによりURLが長くなりますが、UUIDはID衝突のリスクを排除し、グローバルに一意で、列挙攻撃のリスクを軽減するため、大規模なデータベースに理想的です。
>
> ただし、よりクリーンなURLを好む場合は、自動インクリメントキーを好むかもしれません。

### 4. Server Actionにidを渡す

最後に、データベースの正しいレコードを更新できるように、`id`をServer Actionに渡したいと思います。次のように引数として`id`を渡すことはできません：

```tsx
// /app/ui/invoices/edit-form.tsx
// 引数としてidを渡すことは機能しない
<form action={updateInvoice(id)}>
```

代わりに、JS `bind`を使用してServer Actionに`id`を渡すことができます。これにより、Server Actionに渡されるすべての値が確実にエンコードされます。

```tsx
// /app/ui/invoices/edit-form.tsx
// ...
import { updateInvoice } from "@/app/lib/actions";

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return <form action={updateInvoiceWithId}>{/* ... */}</form>;
}
```

**注意：** フォームでhidden入力フィールドを使用することも機能します（例：`<input type="hidden" name="id" value={invoice.id} />`）。ただし、値はHTMLソースで完全なテキストとして表示されるため、機密データには理想的ではありません。

次に、`actions.ts`ファイルで新しいアクション`updateInvoice`を作成します：

```tsx
// /app/lib/actions.ts
// Zodを使用して期待されるタイプを更新
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
```

`createInvoice`アクションと同様に、ここでは：

1. `formData`からデータを抽出しています。
2. Zodでタイプを検証しています。
3. 金額をセントに変換しています。
4. 変数をSQLクエリに渡しています。
5. クライアントキャッシュをクリアし、新しいサーバーリクエストを行うために`revalidatePath`を呼び出しています。
6. ユーザーを請求書ページにリダイレクトするために`redirect`を呼び出しています。

請求書を編集してテストしてください。フォームを送信した後、請求書ページにリダイレクトされ、請求書が更新されているはずです。

## 請求書の削除

Server Actionを使用して請求書を削除するには、削除ボタンを`<form>`要素で囲み、`bind`を使用して`id`をServer Actionに渡します：

```tsx
// /app/ui/invoices/buttons.tsx
import { deleteInvoice } from "@/app/lib/actions";

// ...

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
```

`actions.ts`ファイル内で、`deleteInvoice`という新しいアクションを作成します。

```tsx
// /app/lib/actions.ts
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
```

このアクションは`/dashboard/invoices`パスで呼び出されているため、`redirect`を呼び出す必要はありません。`revalidatePath`を呼び出すと新しいサーバーリクエストがトリガーされ、テーブルが再レンダリングされます。

## さらなる学習

この章では、Server Actionsを使用してデータを変更する方法を学びました。また、Next.jsキャッシュを再検証するために`revalidatePath` APIを使用し、ユーザーを新しいページにリダイレクトするために`redirect`を使用する方法も学びました。

追加の学習として、[Server Actionsのセキュリティ](https://nextjs.org/blog/security-nextjs-server-components-actions)についても読むことができます。

## 第12章を完了しました

おめでとうございます！フォームとReact Server Actionsを使用してデータを変更する方法を学びました。

**次へ**

13: エラー処理

エラー処理とアクセシビリティを含む、フォームでのデータ変更のベストプラクティスを探りましょう。

[第13章を開始](https://nextjs.org/learn/dashboard-app/error-handling)
