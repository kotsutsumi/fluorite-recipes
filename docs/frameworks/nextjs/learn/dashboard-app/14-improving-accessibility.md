# アクセシビリティの改善

前の章では、エラーをキャッチし（404エラーを含む）、ユーザーにフォールバックを表示する方法を見ました。しかし、パズルのもう一つの重要な要素であるフォーム検証について議論する必要があります。Server Actionsを使用してサーバーサイド検証を実装する方法と、Reactの[useActionState](https://react.dev/reference/react/useActionState)フックを使用してフォームエラーを表示する方法を見てみましょう - アクセシビリティを念頭に置いて！

この章では...

ここで扱うトピック

[Image: Image]

Next.jsで`eslint-plugin-jsx-a11y`を使用してアクセシビリティのベストプラクティスを実装する方法。

[Image: Image]

サーバーサイドフォーム検証の実装方法。

[Image: Image]

React `useActionState`フックを使用してフォームエラーを処理し、ユーザーに表示する方法。

## アクセシビリティとは何か？

アクセシビリティとは、障害を持つ人々を含めて、誰もが使用できるWebアプリケーションを設計・実装することを指します。これは、キーボードナビゲーション、セマンティックHTML、画像、色、動画など、多くの領域をカバーする広大なトピックです。

このコースではアクセシビリティについて深く掘り下げることはありませんが、Next.jsで利用可能なアクセシビリティ機能と、アプリケーションをよりアクセシブルにするための一般的なプラクティスについて説明します。

> アクセシビリティについてさらに学びたい場合は、[web.dev](https://web.dev/)の[Learn Accessibility](https://web.dev/learn/accessibility/)コースをお勧めします。

## Next.jsでESLintアクセシビリティプラグインを使用する

Next.jsは、アクセシビリティの問題を早期にキャッチするために、ESLint設定に[eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)プラグインを含めています。例えば、このプラグインは、`alt`テキストのない画像がある場合、`aria-*`や`role`属性を正しく使用していない場合などに警告します。

オプションとして、これを試してみたい場合は、`package.json`ファイルのスクリプトに`next lint`を追加してください：

```json
// /package.json
"scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start",
    "lint": "next lint"
},
```

次に、ターミナルで`pnpm lint`を実行します：

```bash
pnpm lint
```

これにより、プロジェクトでESLintをインストールし、設定するプロセスがガイドされます。

今`pnpm lint`を実行すると、次の出力が表示されるはずです：

```bash
✔ No ESLint warnings or errors
```

しかし、`alt`テキストのない画像があった場合はどうなるでしょうか？試してみましょう！

`/app/ui/invoices/table.tsx`に移動し、画像から`alt` propを削除します。エディタの検索機能を使用して`<Image>`を素早く見つけることができます：

```tsx
// /app/ui/invoices/table.tsx
<Image
  src={invoice.image_url}
  className="rounded-full"
  width={28}
  height={28}
  alt={`${invoice.name}'s profile picture`} // この行を削除
/>
```

再び`pnpm lint`を実行すると、次の警告が表示されるはずです：

```bash
./app/ui/invoices/table.tsx
45:25  Warning: Image elements must have an alt prop,
either with meaningful text, or an empty string for decorative images.
jsx-a11y/alt-text
```

リンターの追加と設定は必須の手順ではありませんが、開発プロセスでアクセシビリティの問題をキャッチするのに役立ちます。

## フォームアクセシビリティの改善

フォームのアクセシビリティを改善するために既に行っている3つのことがあります：

• **セマンティックHTML**: `<div>`の代わりにセマンティック要素（`<input>`、`<option>`など）を使用しています。これにより、支援技術（AT）が入力要素にフォーカスし、ユーザーに適切なコンテキスト情報を提供でき、フォームをナビゲートしやすく理解しやすくします。

• **ラベル付け**: `<label>`と`htmlFor`属性を含めることで、各フォームフィールドに説明的なテキストラベルがあることを保証します。これにより、コンテキストを提供することでAT支援を改善し、ユーザーがラベルをクリックして対応する入力フィールドにフォーカスできるようにすることでユーザビリティも向上します。

• **フォーカスアウトライン**: フィールドがフォーカス状態にあるときにアウトラインを表示するよう適切にスタイル設定されています。これは、ページ上のアクティブな要素を視覚的に示すため、アクセシビリティにとって重要であり、キーボードユーザーとスクリーンリーダーユーザーの両方がフォーム上のどこにいるかを理解するのに役立ちます。`tab`を押すことでこれを確認できます。

これらのプラクティスは、フォームを多くのユーザーにとってよりアクセシブルにするための良い基盤を築きます。しかし、フォーム検証とエラーについてはまだ対処していません。

## フォーム検証

### クライアントサイド検証

クライアントでフォームを検証する方法はいくつかあります。最も簡単なのは、フォームの`<input>`と`<select>`要素に`required`属性を追加することで、ブラウザが提供するフォーム検証に依存することです。例えば：

```tsx
// /app/ui/invoices/create-form.tsx
<input
  id="amount"
  name="amount"
  type="number"
  placeholder="Enter USD amount"
  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  required
/>
```

フォームを再度送信してください。空の値でフォームを送信しようとすると、ブラウザが警告を表示します。

このアプローチは、一部のATがブラウザ検証をサポートしているため、一般的に問題ありません。

クライアントサイド検証の代替案はサーバーサイド検証です。次のセクションでそれを実装する方法を見てみましょう。今のところ、追加した場合は`required`属性を削除してください。

### サーバーサイド検証

サーバーでフォームを検証することで、次のことができます：

• データベースに送信する前に、データが期待される形式であることを保証する。
• 悪意のあるユーザーがクライアントサイド検証をバイパスするリスクを軽減する。
• 有効なデータとして何が考慮されるかについて単一の信頼できるソースを持つ。

`create-form.tsx`コンポーネントで、`react`から`useActionState`フックをインポートします。`useActionState`はフックなので、`"use client"`ディレクティブを使用してフォームをクライアントコンポーネントに変換する必要があります：

```tsx
// /app/ui/invoices/create-form.tsx
"use client";

// ...
import { useActionState } from "react";
```

フォームコンポーネント内で、`useActionState`フック：

• 2つの引数を取ります：`(action, initialState)`。
• 2つの値を返します：`[state, formAction]` - フォームの状態と、フォームが送信されたときに呼び出される関数。

`useActionState`の引数として`createInvoice`アクションを渡し、`<form action={}>`属性内で`formAction`を呼び出します。

```tsx
// /app/ui/invoices/create-form.tsx
// ...
import { useActionState } from "react";

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [state, formAction] = useActionState(createInvoice, initialState);

  return <form action={formAction}>...</form>;
}
```

`initialState`は定義する任意のものにできます。この場合、`message`と`errors`の2つの空のキーを持つオブジェクトを作成し、`actions.ts`ファイルから`State`タイプをインポートします。`State`はまだ存在しませんが、次に作成します：

```tsx
// /app/ui/invoices/create-form.tsx
// ...
import { createInvoice, State } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);

  return <form action={formAction}>...</form>;
}
```

これは最初は混乱するかもしれませんが、サーバーアクションを更新すればより理解できるようになります。今すぐそれを行いましょう。

`action.ts`ファイルで、Zodを使用してフォームデータを検証できます。次のように`FormSchema`を更新してください：

```tsx
// /app/lib/actions.ts
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
```

• `customerId` - 顧客フィールドが空の場合、Zodは既にエラーをスローします（`string`タイプを期待しているため）。しかし、ユーザーが顧客を選択しない場合のフレンドリーなメッセージを追加しましょう。

• `amount` - `string`から`number`への金額タイプを強制しているため、文字列が空の場合はゼロにデフォルトされます。`.gt()`関数で、金額が常に0より大きいことをZodに伝えましょう。

• `status` - ステータスフィールドが空の場合、Zodは既にエラーをスローします（"pending"または"paid"を期待しているため）。ユーザーがステータスを選択しない場合のフレンドリーなメッセージも追加しましょう。

次に、2つのパラメータ - `prevState`と`formData`を受け取るように`createInvoice`アクションを更新します：

```tsx
// /app/lib/actions.ts
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // ...
}
```

• `formData` - 以前と同様です。
• `prevState` - `useActionState`フックから渡される状態を含みます。この例ではアクション内でそれを使用しませんが、必須のpropです。

次に、Zodの`parse()`関数を`safeParse()`に変更します：

```tsx
// /app/lib/actions.ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zodを使用してフォームフィールドを検証
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // ...
}
```

`safeParse()`は、`success`または`error`フィールドのいずれかを含むオブジェクトを返します。これにより、このロジックを`try/catch`ブロック内に置くことなく、検証をより適切に処理できます。

データベースに情報を送信する前に、フォームフィールドが正しく検証されたかを条件文でチェックします：

```tsx
// /app/lib/actions.ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zodを使用してフォームフィールドを検証
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // フォーム検証が失敗した場合、早期にエラーを返す。そうでなければ、続行。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // ...
}
```

`validatedFields`が成功していない場合、Zodからのエラーメッセージと共に関数を早期に返します。

> **ヒント：** `validatedFields`をコンソールログに出力し、空のフォームを送信して、その形状を確認してください。

最後に、フォーム検証を`try/catch`ブロックの外で別々に処理しているため、データベースエラーに対して特定のメッセージを返すことができます。最終的なコードは次のようになるはずです：

```tsx
// /app/lib/actions.ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zodを使用してフォームを検証
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // フォーム検証が失敗した場合、早期にエラーを返す。そうでなければ、続行。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // データベースに挿入するためのデータを準備
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // データベースにデータを挿入
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // データベースエラーが発生した場合、より具体的なエラーを返す。
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // 請求書ページのキャッシュを再検証し、ユーザーをリダイレクト。
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
```

素晴らしい！フォームコンポーネントでエラーを表示しましょう。`create-form.tsx`コンポーネントに戻って、フォーム`state`を使用してエラーにアクセスできます。

各特定のエラーをチェックする三項演算子を追加します。例えば、顧客フィールドの後に次を追加できます：

```tsx
// /app/ui/invoices/create-form.tsx
<form action={formAction}>
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* Customer Name */}
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        Choose customer
      </label>
      <div className="relative">
        <select
          id="customer"
          name="customerId"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
          aria-describedby="customer-error"
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((name) => (
            <option key={name.id} value={name.id}>
              {name.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.customerId &&
          state.errors.customerId.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>
    // ...
  </div>
</form>
```

> **ヒント：** コンポーネント内で`state`をコンソールログに出力し、すべてが正しく接続されているかを確認できます。フォームが今クライアントコンポーネントになったため、開発者ツールのコンソールをチェックしてください。

上記のコードでは、次のariaラベルも追加しています：

• `aria-describedby="customer-error"`: これは、`select`要素とエラーメッセージコンテナとの関係を確立します。`id="customer-error"`を持つコンテナが`select`要素を説明することを示します。スクリーンリーダーは、ユーザーが`select`ボックスと対話するときにこの説明を読み上げ、エラーを通知します。

• `id="customer-error"`: この`id`属性は、`select`入力のエラーメッセージを保持するHTML要素を一意に識別します。これは、`aria-describedby`が関係を確立するために必要です。

• `aria-live="polite"`: `div`内のエラーが更新されたときに、スクリーンリーダーはユーザーに丁寧に通知する必要があります。コンテンツが変更されたとき（例：ユーザーがエラーを修正したとき）、スクリーンリーダーはこれらの変更を発表しますが、ユーザーを中断しないよう、ユーザーがアイドル状態のときのみです。

## 練習: ariaラベルの追加

上記の例を使用して、残りのフォームフィールドにエラーを追加してください。フィールドが不足している場合は、フォームの下部にメッセージも表示する必要があります。UIは次のようになるはずです：

![Create invoice form showing error messages](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fform-validation-page.png&w=1920&q=75)

準備ができたら、`pnpm lint`を実行して、ariaラベルを正しく使用しているかを確認してください。

自分自身に挑戦したい場合は、この章で学んだ知識を活用して、`edit-form.tsx`コンポーネントにフォーム検証を追加してください。

必要なことは：

• `edit-form.tsx`コンポーネントに`useActionState`を追加する。
• Zodからの検証エラーを処理するように`updateInvoice`アクションを編集する。
• コンポーネントでエラーを表示し、アクセシビリティを改善するためにariaラベルを追加する。

準備ができたら、以下のコードスニペットを展開して解決策を確認してください：

[Image: Image]

解決策を表示

## 第14章を完了しました

素晴らしい！React Form StatusとサーバーサイドValidationを使用してフォームのアクセシビリティを改善する方法を学びました。

**次へ**

15: 認証の追加

アプリケーションはほぼ準備完了です。次の章では、NextAuth.jsを使用してアプリケーションに認証を追加する方法を学びます。

[第15章を開始](https://nextjs.org/learn/dashboard-app/adding-authentication)
