# TypeScript

Next.jsは、Reactアプリケーションを構築するためのTypeScriptファーストな開発体験を提供します。

TypeScriptの設定とファイルを自動的にインストールするための組み込みTypeScriptサポートが付属しています。

## 新しいプロジェクト

`create-next-app`は、デフォルトでTypeScriptが付属しています。

```bash
npx create-next-app@latest
```

## 既存のプロジェクト

ファイルの名前を`.ts` / `.tsx`に変更することで、プロジェクトにTypeScriptを追加します。`next dev`と`next build`を実行すると、必要な依存関係が自動的にインストールされ、推奨される設定オプションを含む`tsconfig.json`ファイルが追加されます。

すでに`jsconfig.json`ファイルがある場合は、古い`jsconfig.json`から`paths`コンパイラオプションを新しい`tsconfig.json`ファイルにコピーし、古い`jsconfig.json`ファイルを削除してください。

## TypeScript Plugin

Next.jsには、VSCodeや他のコードエディターで使用できるカスタムTypeScriptプラグインと型チェッカーが含まれており、高度な型チェックと自動補完を提供します。

VSCodeでプラグインを有効にするには:

1. コマンドパレット（`Ctrl/⌘` + `Shift` + `P`）を開く
2. "TypeScript: Select TypeScript Version"を検索
3. "Use Workspace Version"を選択

<img width="600" height="300" alt="TypeScript Command Palette" src="/_next/image?url=%2Fdocs%2Fdark%2Ftypescript-command-palette.png&w=1920&q=75" loading="lazy" decoding="async">

これで、ファイルを編集する際にカスタムプラグインが有効になります。`next build`を実行すると、カスタム型チェッカーが使用されます。

### プラグインの機能

TypeScriptプラグインは以下のことに役立ちます:

- [セグメント設定オプション](/docs/app/api-reference/file-conventions/route-segment-config)の無効な値が渡された場合に警告します。
- 利用可能なオプションとコンテキスト内のドキュメントを表示します。
- `use client`ディレクティブが正しく使用されていることを確認します。
- クライアントフック（`useState`など）がクライアントコンポーネントでのみ使用されていることを確認します。

> **知っておくと良いこと**: 今後、さらに機能が追加される予定です。

## 最小限のTypeScriptバージョン

少なくともTypeScript `v4.5.2`を使用することを強くお勧めします。これにより、[インポート名の型修飾子](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#type-on-import-names)や[パフォーマンスの向上](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#real-path-sync-native)などの構文機能を利用できます。

## 静的に型付けされたリンク

Next.jsは、`next/link`を使用する際のタイプミスやその他のエラーを防ぐために、リンクを静的に型付けすることができ、ページ間をナビゲートする際の型安全性を向上させます。

この機能を有効にするには、`experimental.typedRoutes`を有効にし、プロジェクトがTypeScriptを使用している必要があります。

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
```

Next.jsは`.next/types`に、アプリケーション内のすべての既存のルートに関する情報を含むリンク定義を生成します。これにより、TypeScriptは、無効なリンクについてエディターでフィードバックを提供できます。

現在、実験的なサポートには、動的セグメントを含むあらゆる文字列リテラルが含まれています。リテラル文字列でない場合は、現在、`href`を`as Route`で手動でキャストする必要があります:

```tsx
import type { Route } from 'next'
import Link from 'next/link'

// hrefが有効なルートの場合、TypeScriptエラーなし
<Link href="/about" />
<Link href="/blog/nextjs" />
<Link href={`/blog/${slug}`} />
<Link href={('/blog' + slug) as Route} />

// hrefが有効なルートでない場合、TypeScriptエラー
<Link href="/aboot" />
```

`next/link`をラップするカスタムコンポーネントで`href`を受け入れるには、ジェネリックを使用します:

```tsx
import type { Route } from 'next'
import Link from 'next/link'

function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>My Card</div>
    </Link>
  )
}
```

> **どのように機能するか?**
>
> `next dev`または`next build`を実行すると、Next.jsは`.next`内に隠しファイル`.d.ts`ファイルを生成し、アプリケーション内のすべての既存のルートに関する情報を含みます（`Link`の`href`型としてのすべての有効なルート）。この`.d.ts`ファイルは`tsconfig.json`に含まれており、TypeScriptコンパイラーはその`.d.ts`をチェックし、エディターで無効なリンクについてフィードバックを提供します。

## エンドツーエンドの型安全性

Next.js App Routerは、**強化された型安全性**を持っています。これには以下が含まれます:

1. **データのシリアライゼーションなし** フェッチと`getServerSideProps`、`getStaticProps`、およびコンポーネント間でデータを直接フェッチできます。このデータは、サーバー上で使用するためにシリアライゼーション（文字列への変換）する必要は**ありません**。代わりに、`app`はデフォルトでサーバーコンポーネントを使用するため、`Date`、`Map`、`Set`などの値を追加のステップなしで使用できます。以前は、Next.js固有の型でサーバーとクライアントの境界を手動で型付けする必要がありました。
2. **コンポーネント間のデータフローの効率化**: ルートレイアウトのために`_app`を削除したことで、コンポーネントとページ間のデータフローを視覚化しやすくなりました。以前は、個々の`pages`と`_app`間でデータをフローさせることは型付けが困難で、混乱を招くバグを引き起こす可能性がありました。App Routerでの[コロケーションされたデータフェッチ](/docs/app/building-your-application/data-fetching)により、これはもはや問題ではありません。

[Next.jsでのデータフェッチ](/docs/app/building-your-application/data-fetching)は、データベースまたはコンテンツプロバイダーの選択を規定することなく、可能な限りエンドツーエンドの型安全性を提供します。

通常のTypeScriptで期待されるように、レスポンスデータを型付けできます。例えば:

```tsx filename="app/page.tsx"
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // 戻り値は*シリアライズされていません*
  // Date、Map、Setなどを返すことができます
  return res.json()
}

export default async function Page() {
  const name = await getData()

  return '...'
}
```

_完全な_エンドツーエンドの型安全性のためには、データベースまたはコンテンツプロバイダーがTypeScriptをサポートしている必要があります。これは、[ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)や型安全なクエリビルダーを使用することで実現できます。

## Asyncサーバーコンポーネント TypeScript エラー

`async`サーバーコンポーネントをTypeScriptで使用するには、TypeScript `5.1.3`以上と`@types/react` `18.2.8`以上を使用していることを確認してください。

古いバージョンのTypeScriptを使用している場合、`'Promise<Element>' is not a valid JSX element`という型エラーが表示される場合があります。最新バージョンのTypeScriptと`@types/react`に更新すると、この問題は解決されます。

## サーバーおよびクライアントコンポーネント間でのデータ受け渡し

サーバーコンポーネントとクライアントコンポーネント間でpropsを介してデータを渡す場合、データはブラウザーで使用するためにシリアライゼーションされます（文字列に変換されます）。ただし、特別な型は必要ありません。他のコンポーネント間でpropsを渡すのと同じように型付けされます。

さらに、レンダリングされていないデータはサーバーとクライアント間を横断しないため、シリアライゼーションが少なくなります（サーバーに残ります）。これは、サーバーコンポーネントのサポートによってのみ可能になりました。

## パス エイリアスと baseUrl

Next.jsは、`tsconfig.json`の`"paths"`および`"baseUrl"`オプションを自動的にサポートします。

この機能については、[モジュールパス エイリアス ドキュメント](/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)で詳しく学ぶことができます。

## next.config.js での型チェック

### タイプ1: `next.config.js`（JavaScript）

`next.config.js`ファイルはBabelまたはTypeScriptによって解析されないため、JavaScriptファイルである必要があります。ただし、以下のようにJSDocを使用してIDEに型チェックを追加できます:

```js filename="next.config.js"
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 設定オプションをここに記載 */
}

module.exports = nextConfig
```

### タイプ2: `next.config.ts`（TypeScript）

TypeScriptを使用し、`next.config.ts`ファイルを使用できます:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* 設定オプションをここに記載 */
}

export default nextConfig
```

## 増分型チェック

`v10.2.1`以降、Next.jsは、`tsconfig.json`で有効にすると[増分型チェック](https://www.typescriptlang.org/tsconfig#incremental)をサポートし、大規模なアプリケーションで型チェックを高速化できます。

## TypeScript エラーの無視

Next.jsは、プロジェクトにTypeScriptエラーが存在する場合、**本番ビルド**（`next build`）を失敗させます。

アプリケーションにエラーがある場合でも、Next.jsに危険に本番コードを生成させたい場合は、組み込みの型チェックステップを無効にすることができます。

無効にする場合は、ビルドまたはデプロイプロセスの一部として型チェックを実行していることを確認してください。そうでない場合、これは非常に危険です。

`next.config.js`を開き、`typescript`設定で`ignoreBuildErrors`オプションを有効にします:

```js filename="next.config.js"
module.exports = {
  typescript: {
    // !! 警告 !!
    // プロジェクトに型エラーがある場合でも、本番ビルドを正常に完了することを危険に許可します。
    // !! 警告 !!
    ignoreBuildErrors: true,
  },
}
```

## カスタム型宣言

カスタム型を宣言する必要がある場合、`next-env.d.ts`を変更したくなるかもしれません。しかし、このファイルは自動的に生成されるため、行った変更はすべて上書きされます。代わりに、新しいファイル、例えば`new-types.d.ts`を作成し、`tsconfig.json`でそれを参照する必要があります:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "skipLibCheck": true
    //...省略...
  },
  "include": [
    "new-types.d.ts",
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

## バージョンの変更

| バージョン | 変更内容                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `v15.0.0`  | [カスタムTypeScriptプラグイン](https://github.com/vercel/next.js/pull/65538)と[型チェッカー](https://github.com/vercel/next.js/pull/65944)が追加されました。 |
| `v13.2.0`  | 静的に型付けされたリンクがベータ版として利用可能になりました。                                                                                    |
| `v12.0.0`  | より高速なビルドのために[SWC](/docs/architecture/nextjs-compiler)がデフォルトでTypeScriptファイルをコンパイルするようになりました。                            |
| `v10.2.1`  | `tsconfig.json`で有効にすると[増分型チェック](https://www.typescriptlang.org/tsconfig#incremental)のサポートが追加されました。                      |
