# エラーハンドリング

前の章では、Server Actionsを使用してデータを変更する方法を学びました。
JavaScriptの`try/catch`文とNext.js APIを使用して、キャッチされない例外に対してエラーを適切に処理する方法を見てみましょう。

この章では...

ここで扱うトピック

[Image: Image]

ルートセグメントでエラーをキャッチし、ユーザーにフォールバックUIを表示するための特別な`error.tsx`ファイルの使用方法。

[Image: Image]

404エラー（存在しないリソース）を処理するための`notFound`関数と`not-found`ファイルの使用方法。

## Server Actionsにtry/catchを追加する

まず、JavaScriptの`try/catch`文をServer Actionsに追加して、エラーを適切に処理できるようにしましょう。

これを行う方法がわかっている場合は、数分かけてServer Actionsを更新してください。または、以下のコードをコピーしてください：

[Image: Image]

解決策を表示 [Image: Image]

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
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  }
}
```

`redirect`が`try/catch`ブロックの外で呼び出されていることに注意してください。これは、`redirect`がエラーをスローすることで動作し、それが`catch`ブロックでキャッチされるためです。これを避けるために、`try/catch`の後に`redirect`を呼び出すことができます。`redirect`は`try`が成功した場合にのみ到達可能になります。

データベースの問題をキャッチし、Server Actionから有用なメッセージを返すことで、これらのエラーを適切に処理しています。

アクション内でキャッチされない例外がある場合は何が起こるでしょうか？手動でエラーをスローすることでこれをシミュレートできます。例えば、`deleteInvoice`アクションで、関数の最上部でエラーをスローします：

```tsx
// /app/lib/actions.ts
export async function deleteInvoice(id: string) {
  throw new Error("Failed to Delete Invoice");

  // 到達不可能なコードブロック
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
```

請求書を削除しようとすると、localhostでエラーが表示されるはずです。本番環境では、予期しないことが起こったときにユーザーにより適切にメッセージを表示したいと思います。

ここでNext.jsの[error.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/error)ファイルが登場します。テスト後、次のセクションに進む前に、この手動で追加されたエラーを削除することを確認してください。

## error.tsxですべてのエラーを処理する

`error.tsx`ファイルは、ルートセグメントのUI境界を定義するために使用できます。予期しないエラーに対するキャッチオールとして機能し、ユーザーにフォールバックUIを表示することができます。

`/dashboard/invoices`フォルダ内で、`error.tsx`という新しいファイルを作成し、以下のコードを貼り付けます：

```tsx
// /dashboard/invoices/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // オプションで、エラーレポートサービスにエラーをログ出力
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // 請求書ルートの再レンダリングを試行して回復を試みる
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

上記のコードについて、いくつか注意すべき点があります：

• "use client" - `error.tsx`はクライアントコンポーネントである必要があります。
• 2つのpropを受け取ります：
• `error`: このオブジェクトはJavaScriptのネイティブ[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)オブジェクトのインスタンスです。
• `reset`: これはエラー境界をリセットする関数です。実行されると、関数はルートセグメントの再レンダリングを試行します。

再び請求書を削除しようとすると、次のUIが表示されるはずです：

![Error page showing the props it accepts](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Ferror-page.png&w=1920&q=75)

## notFound関数で404エラーを処理する

エラーを適切に処理するもう一つの方法は、`notFound`関数を使用することです。`error.tsx`はキャッチされない例外をキャッチするのに便利ですが、`notFound`は存在しないリソースを取得しようとするときに使用できます。

例えば、[http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit](http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit)にアクセスしてください。

これは、データベースに存在しない偽のUUIDです。

`error.tsx`が定義されている`/invoices`の子ルートであるため、`error.tsx`が即座に起動することがわかります。

ただし、より具体的にしたい場合は、ユーザーがアクセスしようとしているリソースが見つからなかったことを伝える404エラーを表示できます。

`data.ts`の`fetchInvoiceById`関数に移動し、返された`invoice`をコンソールログに出力することで、リソースが見つからなかったことを確認できます：

```tsx
// /app/lib/data.ts
export async function fetchInvoiceById(id: string) {
  try {
    // ...
    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}
```

請求書がデータベースに存在しないことがわかったので、`notFound`を使用してそれを処理しましょう。`/dashboard/invoices/[id]/edit/page.tsx`に移動し、`'next/navigation'`から`{ notFound }`をインポートします。

次に、請求書が存在しない場合に`notFound`を呼び出す条件文を使用できます：

```tsx
// /dashboard/invoices/[id]/edit/page.tsx
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  // ...
}
```

次に、ユーザーにエラーUIを表示するために、`/edit`フォルダ内に`not-found.tsx`ファイルを作成します。

![not-found.tsx file structure](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fnot-found-file.png&w=3840&q=75)

`not-found.tsx`ファイル内に、以下のコードを貼り付けます：

```tsx
// /dashboard/invoices/[id]/edit/not-found.tsx
import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
```

ルートを更新すると、次のUIが表示されるはずです：

![404 Not Found Page](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2F404-not-found-page.png&w=1920&q=75)

覚えておくべきことは、`notFound`は`error.tsx`よりも優先されるため、より具体的なエラーを処理したい場合に使用できることです！

## さらなる学習

Next.jsでのエラーハンドリングについてさらに学ぶには、以下のドキュメントを確認してください：

• [エラーハンドリング](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
• [error.js APIリファレンス](https://nextjs.org/docs/app/api-reference/file-conventions/error)
• [notFound() APIリファレンス](https://nextjs.org/docs/app/api-reference/functions/not-found)
• [not-found.js APIリファレンス](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

## 第13章を完了しました

素晴らしい！アプリケーションでエラーを適切に処理できるようになりました。

**次へ**

14: アクセシビリティの改善

ユーザー体験を改善する方法を引き続き探りましょう。サーバーサイドフォーム検証とアクセシビリティの改善について学びます。

[第14章を開始](https://nextjs.org/learn/dashboard-app/improving-accessibility)
