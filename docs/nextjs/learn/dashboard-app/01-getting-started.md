# はじめに

## 新しいプロジェクトの作成

パッケージマネージャーとして[pnpm](https://pnpm.io/)を使用することをお勧めします。`npm`や`yarn`よりも高速で効率的だからです。`pnpm`がインストールされていない場合は、次のコマンドでグローバルにインストールできます：

```terminal
npm install -g pnpm
```

Next.jsアプリを作成するには、ターミナルを開き、プロジェクトを保存したいフォルダに[cd](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line#basic_built-in_terminal_commands)で移動し、次のコマンドを実行します：

```terminal
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
```

このコマンドは[create-next-app](https://nextjs.org/docs/app/api-reference/create-next-app)を使用します。これはNext.jsアプリケーションをセットアップするコマンドラインインターフェース（CLI）ツールです。上記のコマンドでは、このコースの[スターター例](https://github.com/vercel/next-learn/tree/main/dashboard/starter-example)で`--example`フラグも使用しています。

## プロジェクトの探索

コードを一から書くチュートリアルとは異なり、このコースのコードの多くはすでに書かれています。これは実際の開発をより良く反映しており、既存のコードベースで作業することが多いでしょう。

私たちの目標は、すべてのアプリケーションコードを書くことなく、Next.jsの主要機能の学習に集中できるよう支援することです。

インストール後、コードエディターでプロジェクトを開き、`nextjs-dashboard`に移動します。

```terminal
cd nextjs-dashboard
```

プロジェクトの探索に時間をかけましょう。

### フォルダ構造

プロジェクトには次のフォルダ構造があることがわかります：

![ダッシュボードプロジェクトのフォルダ構造。app、public、設定ファイルのメインフォルダとファイルを表示。](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-folder-structure.png&w=3840&q=75)

• `/app`: アプリケーションのすべてのルート、コンポーネント、ロジックが含まれています。主にここで作業することになります。
• `/app/lib`: アプリケーションで使用される関数が含まれています。再利用可能なユーティリティ関数やデータ取得関数などです。
• `/app/ui`: アプリケーションのすべてのUIコンポーネントが含まれています。カード、テーブル、フォームなどです。時間を節約するため、これらのコンポーネントは事前にスタイル設定されています。
• `/public`: アプリケーションのすべての静的アセットが含まれています。画像などです。
• 設定ファイル: アプリケーションのルートに`next.config.ts`などの設定ファイルもあります。これらのファイルのほとんどは、`create-next-app`を使用して新しいプロジェクトを開始するときに作成され、事前に設定されています。このコースでは変更する必要はありません。

これらのフォルダを自由に探索してください。コードが何をしているのかまだすべて理解できなくても心配ありません。

### プレースホルダーデータ

ユーザーインターフェースを構築するとき、プレースホルダーデータがあると役立ちます。データベースやAPIがまだ利用できない場合は、次のことができます：

• JSON形式またはJavaScriptオブジェクトとしてプレースホルダーデータを使用する。
• [mockAPI](https://mockapi.io/)などのサードパーティサービスを使用する。

このプロジェクトでは、`app/lib/placeholder-data.ts`にプレースホルダーデータを提供しています。ファイル内の各JavaScriptオブジェクトは、データベース内のテーブルを表しています。例えば、invoicesテーブルの場合：

```typescript
// /app/lib/placeholder-data.ts
const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  },
  // ...
];
```

[データベースのセットアップ](https://nextjs.org/learn/dashboard-app/setting-up-your-database)の章では、このデータを使用してデータベースをシード（初期データで設定）します。

### TypeScript

ほとんどのファイルに`.ts`または`.tsx`の拡張子が付いていることにも気づくでしょう。これは、プロジェクトがTypeScriptで書かれているためです。現代のWebランドスケープを反映したコースを作成したかったのです。

TypeScriptを知らなくても大丈夫です。必要に応じてTypeScriptコードスニペットを提供します。

今のところ、`/app/lib/definitions.ts`ファイルを見てみましょう。ここでは、データベースから返される型を手動で定義しています。例えば、invoicesテーブルには次の型があります：

```typescript
// /app/lib/definitions.ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // TypeScriptでは、これは文字列ユニオン型と呼ばれます。
  // 「status」プロパティが「pending」または「paid」という2つの文字列のいずれかのみになることを意味します。
  status: "pending" | "paid";
};
```

TypeScriptを使用することで、コンポーネントやデータベースに間違ったデータ形式を誤って渡すことを防げます。例えば、invoice `amount`に`number`の代わりに`string`を渡すことを防げます。

> **TypeScript開発者の場合：**
>
> • データ型を手動で宣言していますが、より良い型安全性のために、データベーススキーマに基づいて型を自動生成する[Prisma](https://www.prisma.io/)や[Drizzle](https://orm.drizzle.team/)をお勧めします。
> • Next.jsはプロジェクトがTypeScriptを使用しているかどうかを検出し、必要なパッケージと設定を自動的にインストールします。Next.jsには、自動補完と型安全性を支援するコードエディター用の[TypeScriptプラグイン](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)も付属しています。

## 開発サーバーの実行

`pnpm i`を実行してプロジェクトのパッケージをインストールします。

```terminal
pnpm i
```

次に`pnpm dev`を実行して開発サーバーを起動します。

```terminal
pnpm dev
```

`pnpm dev`はNext.js開発サーバーをポート`3000`で起動します。動作しているかどうか確認してみましょう。

ブラウザで[http://localhost:3000](http://localhost:3000/)を開きます。ホームページは次のように表示されるはずです（意図的にスタイルが設定されていません）：

![タイトル「Acme」、説明、ログインリンクがあるスタイル未設定のページ。](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Facme-unstyled.png&w=3840&q=75)

## 第1章を完了しました

おめでとうございます！スターター例を使用してNext.jsアプリケーションを作成し、開発サーバーを実行しました。

### 次へ

**第2章：CSSスタイリング**

ホームページで作業し、アプリケーションをスタイリングするさまざまな方法について説明しましょう。

[第2章を開始](https://nextjs.org/learn/dashboard-app/css-styling)
