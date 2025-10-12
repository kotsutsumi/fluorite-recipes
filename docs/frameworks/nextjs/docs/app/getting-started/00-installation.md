# インストール

## システム要件

開始する前に、システムが以下の要件を満たしていることを確認してください：

- [Node.js 18.18](https://nodejs.org/) 以降
- macOS、Windows（WSL含む）、またはLinux

## 自動インストール

新しいNext.jsアプリを作成する最も早い方法は、すべてを自動的に設定してくれる [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を使用することです。プロジェクトを作成するには、以下を実行してください：

```terminal
npx create-next-app@latest
```

インストール時に、以下のプロンプトが表示されます：

```terminal
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to use Turbopack? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

プロンプトの後、[create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) がプロジェクト名のフォルダを作成し、必要な依存関係をインストールします。

## 手動インストール

新しいNext.jsアプリを手動で作成するには、必要なパッケージをインストールします：

```terminal
pnpm i next@latest react@latest react-dom@latest
```

> **知っておくべきこと**: App RouterはReact 19の安定版の変更とフレームワークで検証中の新機能を含むReact canaryリリースを組み込んで使用しています。Pages Routerはあなたがpackage.jsonにインストールするReactバージョンを使用します。

次に、`package.json` ファイルに以下のスクリプトを追加します：

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

これらのスクリプトは、アプリケーション開発の異なるステージを指します：

- `next dev --turbopack`: Turbopackを使用して開発サーバーを起動します
- `next build`: 本番用にアプリケーションをビルドします
- `next start`: 本番サーバーを起動します
- `eslint`: ESLintを実行します

Turbopackは `dev` で安定しています。本番ビルドでは、Turbopackはベータ版です。試すには、`next build --turbopack` を実行してください。ステータスと注意事項については [Turbopackドキュメント](https://nextjs.org/docs/app/api-reference/turbopack) を参照してください。

### appディレクトリの作成

Next.jsはファイルシステムルーティングを使用しており、アプリケーションのルートはファイルの構造によって決定されます。

`app` フォルダを作成します。次に、`app` 内に `layout.tsx` ファイルを作成します。このファイルは[ルートレイアウト](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)です。これは必須であり、`<html>` と `<body>` タグを含む必要があります。

```tsx
// app/layout.tsx
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

初期コンテンツを含むホームページ `app/page.tsx` を作成します：

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

`layout.tsx` と `page.tsx` の両方は、ユーザーがアプリケーションのルート（`/`）にアクセスしたときにレンダリングされます。

> **知っておくべきこと**:
>
> - ルートレイアウトの作成を忘れた場合、Next.jsは `next dev` で開発サーバーを実行するときに自動的にこのファイルを作成します。
> - 設定ファイルからアプリケーションのコードを分離するために、プロジェクトのルートで[srcフォルダ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)をオプションで使用できます。

### publicフォルダの作成（オプション）

画像、フォントなどの静的アセットを保存するために、プロジェクトのルートに[publicフォルダ](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)を作成します。`public` 内のファイルは、ベースURL（`/`）から始まるコードで参照できます。

その後、ルートパス（`/`）を使用してこれらのアセットを参照できます。例えば、`public/profile.png` は `/profile.png` として参照できます：

```tsx
// app/page.tsx
import Image from "next/image";

export default function Page() {
  return <Image src="/profile.png" alt="Profile" width={100} height={100} />;
}
```

## 開発サーバーの実行

1. `npm run dev` を実行して開発サーバーを起動します
2. `http://localhost:3000` にアクセスしてアプリケーションを表示します
3. `app/page.tsx` ファイルを編集して保存し、ブラウザで更新された結果を確認します

## TypeScriptのセットアップ

> **最小TypeScriptバージョン**: `v4.5.2`

Next.jsには組み込みのTypeScriptサポートが付属しています。プロジェクトにTypeScriptを追加するには、ファイルを `.ts` / `.tsx` にリネームし、`next dev` を実行します。Next.jsは自動的に必要な依存関係をインストールし、推奨設定オプションで `tsconfig.json` ファイルを追加します。

### IDEプラグイン

Next.jsには、VSCodeやその他のコードエディターが高度な型チェックと自動補完に使用できるカスタムTypeScriptプラグインと型チェッカーが含まれています。

VS Codeでプラグインを有効にするには：

1. コマンドパレットを開く（`Ctrl/⌘` + `Shift` + `P`）
2. "TypeScript: Select TypeScript Version" を検索
3. "Use Workspace Version" を選択

詳細については、[TypeScriptリファレンス](https://nextjs.org/docs/app/api-reference/config/next-config-js/typescript)ページを参照してください。

## ESLintのセットアップ

Next.jsには組み込みのESLintが付属しています。`create-next-app` で新しいプロジェクトを作成するときに、必要なパッケージを自動的にインストールし、適切な設定を構成します。

既存のプロジェクトにESLintを手動で追加するには、`package.json` にスクリプトとして `next lint` を追加します：

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

次に、`npm run lint` を実行すると、インストールと設定プロセスが案内されます。

```terminal
npm run lint
```

次のようなプロンプトが表示されます：

> **どのようにESLintを設定しますか？**
>
> ❯ Strict (推奨)
> Base
> Cancel

- **Strict**: Next.jsのベースESLint設定と、より厳密なCore Web Vitalsルールセットを含みます。初めてESLintをセットアップする開発者に推奨される設定です。
- **Base**: Next.jsのベースESLint設定を含みます。
- **Cancel**: 設定をスキップします。独自のカスタムESLint設定をセットアップする予定の場合は、このオプションを選択してください。

`Strict` または `Base` が選択された場合、Next.jsは自動的に `eslint` と `eslint-config-next` をアプリケーションの依存関係としてインストールし、プロジェクトのルートに設定ファイルを作成します。

`next lint` によって生成されるESLint設定は、古い `.eslintrc.json` 形式を使用します。ESLintは[レガシーの .eslintrc.json と新しい eslint.config.mjs 形式](https://eslint.org/docs/latest/use/configure/configuration-files#configuring-eslint)の両方をサポートしています。

[ESLint APIリファレンス](https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals)で推奨されるセットアップを使用し、[@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc)パッケージをインストールして、`.eslintrc.json` を `eslint.config.mjs` ファイルに手動で置き換えることができます。これは `create-next-app` で使用されるESLintセットアップとより密接に一致します。

エラーをキャッチするためにESLintを実行したいときはいつでも `next lint` を実行できます。ESLintがセットアップされると、すべてのビルド（`next build`）中にも自動的に実行されます。エラーはビルドを失敗させますが、警告は失敗させません。

詳細については、[ESLintプラグイン](https://nextjs.org/docs/app/api-reference/config/next-config-js/eslint)ページを参照してください。

## 絶対インポートとモジュールパスエイリアスのセットアップ

Next.jsには、`tsconfig.json` と `jsconfig.json` ファイルの `"paths"` と `"baseUrl"` オプションの組み込みサポートがあります。

これらのオプションを使用すると、プロジェクトディレクトリを絶対パスにエイリアスして、モジュールのインポートをより簡単でクリーンにすることができます。例えば：

```javascript
// Before
import { Button } from "../../../components/button";

// After
import { Button } from "@/components/button";
```

絶対インポートを設定するには、`tsconfig.json` または `jsconfig.json` ファイルに `baseUrl` 設定オプションを追加します。例えば：

```json
{
  "compilerOptions": {
    "baseUrl": "src/"
  }
}
```

`baseUrl` パスの設定に加えて、`"paths"` オプションを使用してモジュールパスを「エイリアス」することができます。

例えば、次の設定は `@/components/*` を `components/*` にマップします：

```json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

各 `"paths"` は `baseUrl` の場所に対して相対的です。
