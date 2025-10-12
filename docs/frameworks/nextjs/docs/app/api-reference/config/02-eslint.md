# ESLint

Next.jsは、箱から出してすぐに統合された[ESLint](https://eslint.org/)体験を提供します。`package.json`に`next lint`をスクリプトとして追加します:

```json filename="package.json"
{
  "scripts": {
    "lint": "next lint"
  }
}
```

次に、`npm run lint`または`yarn lint`を実行します:

```bash
yarn lint
```

アプリケーションでESLintがまだ設定されていない場合、インストールと設定プロセスがガイドされます。

```bash
yarn lint
```

> 次のようなプロンプトが表示されます:
>
> ? ESLintをどのように設定しますか?
>
> ❯ Strict (推奨)
> Base
> Cancel

次の3つのオプションのいずれかを選択できます:

- **Strict**: Next.jsの基本ESLint設定と、より厳格な[Core Web Vitals ルールセット](#core-web-vitals)が含まれます。ESLintを初めて設定する開発者に推奨される設定です。

  ```json filename=".eslintrc.json"
  {
    "extends": "next/core-web-vitals"
  }
  ```

- **Base**: Next.jsの基本ESLint設定が含まれます。

  ```json filename=".eslintrc.json"
  {
    "extends": "next"
  }
  ```

- **Cancel**: ESLint設定は含まれません。独自のカスタムESLint設定をセットアップする予定がある場合にのみこのオプションを選択してください。

2つの設定オプションのいずれかが選択されると、Next.jsは自動的に`eslint`と`eslint-config-next`を依存関係としてインストールし、選択した設定を含むプロジェクトのルートに`.eslintrc.json`ファイルを作成します。

ESLintを使用してエラーをキャッチしたい場合は、いつでも`next lint`を実行できます。ESLintがセットアップされると、ビルド（`next build`）のたびに自動的に実行されます。エラーはビルドを失敗させますが、警告は失敗させません。

> `next build`中にESLintを実行したくない場合は、[ESLintの無視](/docs/app/api-reference/config/next-config-js/eslint)のドキュメントを参照してください。

開発中に適切な[統合](https://eslint.org/docs/user-guide/integrations#editors)を使用して、コードエディターで警告とエラーを直接表示することをお勧めします。

## ESLint 設定

デフォルトの設定（`eslint-config-next`）には、Next.jsで最適な箱から出してすぐのリント体験を実現するために必要なすべてが含まれています。アプリケーションでESLintがまだ設定されていない場合は、`next lint`を使用してこの設定と一緒にESLintをセットアップすることをお勧めします。

> `eslint-config-next`を他のESLint設定と一緒に使用したい場合は、競合を引き起こさずにこれを行う方法を学ぶために[追加の設定](#追加の設定)セクションを参照してください。

次のESLintプラグインからの推奨ルールセットはすべて`eslint-config-next`内で使用されています:

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

これは`next.config.js`の設定よりも優先されます。

## ESLint Plugin

Next.jsは、ESLintプラグイン[`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)を提供しており、基本設定にすでにバンドルされているため、Next.jsアプリケーションの一般的な問題や問題をキャッチできます。ルールの完全なセットは以下のとおりです:

| - | ルール | 説明 |
| --- | --- | --- |
| ✔️ | [@next/next/google-font-display](/docs/messages/google-font-display) | Google Fontsでのfont-displayの動作を強制します。 |
| ✔️ | [@next/next/google-font-preconnect](/docs/messages/google-font-preconnect) | Google Fontsで`preconnect`の使用を確認します。 |
| ✔️ | [@next/next/inline-script-id](/docs/messages/inline-script-id) | インラインコンテンツを持つ`next/script`コンポーネントに`id`属性を強制します。 |
| ✔️ | [@next/next/next-script-for-ga](/docs/messages/next-script-for-ga) | Google AnalyticsのインラインスクリプトでNext.jsの`<Script>`コンポーネントを使用することを優先します。 |
| ✔️ | [@next/next/no-assign-module-variable](/docs/messages/no-assign-module-variable) | `module`変数への代入を防ぎます。 |
| ✔️ | [@next/next/no-async-client-component](/docs/messages/no-async-client-component) | クライアントコンポーネントが非同期関数であることを防ぎます。 |
| ✔️ | [@next/next/no-before-interactive-script-outside-document](/docs/messages/no-before-interactive-script-outside-document) | `pages/_document.js`の外で`next/script`の`beforeInteractive`戦略の使用を防ぎます。 |
| ✔️ | [@next/next/no-css-tags](/docs/messages/no-css-tags) | 手動のスタイルシートタグを防ぎます。 |
| ✔️ | [@next/next/no-document-import-in-page](/docs/messages/no-document-import-in-page) | `pages/_document.js`の外での`next/document`のインポートを防ぎます。 |
| ✔️ | [@next/next/no-duplicate-head](/docs/messages/no-duplicate-head) | `pages/_document.js`での`<Head>`の重複使用を防ぎます。 |
| ✔️ | [@next/next/no-head-element](/docs/messages/no-head-element) | `<head>`要素の使用を防ぎます。 |
| ✔️ | [@next/next/no-head-import-in-document](/docs/messages/no-head-import-in-document) | `pages/_document.js`での`next/head`の使用を防ぎます。 |
| ✔️ | [@next/next/no-html-link-for-pages](/docs/messages/no-html-link-for-pages) | 内部Next.jsページへのナビゲートに`<a>`要素の使用を防ぎます。 |
| ✔️ | [@next/next/no-img-element](/docs/messages/no-img-element) | LCPの遅延とより高い帯域幅による`<img>`要素の使用を防ぎます。 |
| ✔️ | [@next/next/no-page-custom-font](/docs/messages/no-page-custom-font) | ページのみのカスタムフォントを防ぎます。 |
| ✔️ | [@next/next/no-script-component-in-head](/docs/messages/no-script-component-in-head) | `next/head`コンポーネントでの`next/script`の使用を防ぎます。 |
| ✔️ | [@next/next/no-styled-jsx-in-document](/docs/messages/no-styled-jsx-in-document) | `pages/_document.js`での`styled-jsx`の使用を防ぎます。 |
| ✔️ | [@next/next/no-sync-scripts](/docs/messages/no-sync-scripts) | 同期スクリプトを防ぎます。 |
| ✔️ | [@next/next/no-title-in-document-head](/docs/messages/no-title-in-document-head) | `next/document`の`Head`コンポーネントでの`<title>`の使用を防ぎます。 |
| ✔️ | @next/next/no-typos | [Next.jsのデータフェッチ関数](/docs/pages/building-your-application/data-fetching)での一般的なタイプミスを防ぎます。 |
| ✔️ | [@next/next/no-unwanted-polyfillio](/docs/messages/no-unwanted-polyfillio) | Polyfill.ioからの重複ポリフィルを防ぎます。 |

アプリケーションでESLintがすでに設定されている場合は、いくつかの条件が満たされない限り、`eslint-config-next`を含める代わりに、このプラグインから直接拡張することをお勧めします。詳細については、[推奨されるプラグインルールセット](#推奨されるプラグインルールセット)を参照してください。

### カスタム設定

#### `rootDir`

`eslint-plugin-next`をNext.jsがルートディレクトリにインストールされていないプロジェクト（monorepoなど）で使用している場合、`.eslintrc`の`settings`プロパティを使用して、Next.jsアプリケーションがどこにあるかを`eslint-plugin-next`に伝えることができます:

```json filename=".eslintrc.json"
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

`rootDir`は、パス（相対または絶対）、glob（例: `"packages/*/"`）、またはパスやglobの配列を指定できます。

## カスタムディレクトリとファイルのリント

デフォルトでは、Next.jsは`pages/`、`app/`、`components/`、`lib/`、および`src/`ディレクトリ内のすべてのファイルに対してESLintを実行します。ただし、`next.config.js`の`eslint`設定で`dirs`オプションを使用して、本番ビルド用のディレクトリを指定できます:

```js filename="next.config.js"
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // 本番ビルド時（next build）にこれらのディレクトリでのみESLintを実行
  },
}
```

同様に、`next lint`の`--dir`および`--file`フラグを使用して、特定のディレクトリとファイルをリントできます:

```bash
next lint --dir pages --dir utils --file bar.js
```

## キャッシング

パフォーマンスを向上させるために、ESLintによって処理されたファイルの情報はデフォルトでキャッシュされます。これは`.next/cache`または定義された[ビルドディレクトリ](/docs/app/api-reference/config/next-config-js/distDir)に保存されます。単一のソースファイルのコンテンツ以上に依存するESLintルールを含めていて、キャッシュを無効にする必要がある場合は、`next lint`で`--no-cache`フラグを使用してください。

```bash
next lint --no-cache
```

## ルールの無効化

サポートされているプラグイン（`react`、`react-hooks`、`next`）によって提供されるルールを変更または無効にしたい場合は、`.eslintrc`の`rules`プロパティを使用して直接変更できます:

```json filename=".eslintrc.json"
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### Core Web Vitals

`next lint`を初めて実行し、**strict**オプションが選択されると、`next/core-web-vitals`ルールセットが有効になります。

```json filename=".eslintrc.json"
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vitals`は、[Core Web Vitals](https://web.dev/vitals/)に影響を与える場合、デフォルトで警告となるいくつかのルールについて`eslint-plugin-next`をエラーに更新します。

> `next/core-web-vitals`エントリポイントは、[Create Next App](/docs/app/api-reference/cli/create-next-app)で構築された新しいアプリケーションに自動的に含まれます。

### TypeScript

Next.js ESLintルールに加えて、`create-next-app --typescript`はTypeScript固有のリントルールを`next/typescript`設定に追加します:

```json filename=".eslintrc.json"
{
  "extends": "next/typescript"
}
```

これらのルールは、[`plugin:@typescript-eslint/recommended`](https://typescript-eslint.io/linting/configs#recommended)に基づいています。

詳細については、[typescript-eslint > Configs](https://typescript-eslint.io/linting/configs)を参照してください。

## 他のツールとの使用

### Prettier

ESLintには、既存の[Prettier](https://prettier.io/)セットアップと競合する可能性のあるコードフォーマットルールも含まれています。ESLintとPrettierが連携できるようにするために、ESLint設定に[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)を含めることをお勧めします。

まず、依存関係をインストールします:

```bash
npm install --save-dev eslint-config-prettier

yarn add --dev eslint-config-prettier

pnpm add --save-dev eslint-config-prettier

bun add --dev eslint-config-prettier
```

次に、既存のESLint設定に`prettier`を追加します:

```json filename=".eslintrc.json"
{
  "extends": ["next", "prettier"]
}
```

### lint-staged

`next lint`を[lint-staged](https://github.com/okonet/lint-staged)と一緒に使用して、ステージングされたgitファイルでリンターを実行したい場合は、`--file`フラグの使用法を指定するために、プロジェクトのルートにある`.lintstagedrc.js`ファイルに以下を追加する必要があります。

```js filename=".lintstagedrc.js"
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## 既存の設定の移行

### 推奨されるプラグインルールセット

アプリケーションですでにESLintが設定されていて、次の条件のいずれかに該当する場合:

- 次のプラグインの1つまたは複数がすでにインストールされている（個別にまたは`airbnb`や`react-app`などの別の設定を通じて）:
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- Babelがどのように設定されているかを定義する特定の`parserOptions`を定義している（Next.jsは[Babelの設定をカスタマイズ](/docs/pages/building-your-application/configuring/babel)していない限り、これは必要ありません）
- Node.jsおよび/またはTypeScript[リゾルバー](https://github.com/benmosher/eslint-plugin-import#resolvers)がインポートを処理するために定義されている`eslint-plugin-import`がインストールされている

これらのプロパティが[`eslint-config-next`](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js)内でどのように設定されているかを優先する場合は、これらの設定を削除するか、代わりにNext.js ESLintプラグインから直接拡張することをお勧めします:

```js
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

プラグインは、`next lint`を実行する必要なく、プロジェクトに通常どおりインストールできます:

```bash
npm install --save-dev @next/eslint-plugin-next

yarn add --dev @next/eslint-plugin-next

pnpm add --save-dev @next/eslint-plugin-next

bun add --dev @next/eslint-plugin-next
```

これにより、複数の設定間で同じプラグインまたはパーサーをインポートしたことで発生する可能性のある競合やエラーのリスクが排除されます。

### 追加の設定

すでに別のESLint設定を使用していて、`eslint-config-next`を含めたい場合は、他の設定の後に最後に拡張されるようにしてください。例えば:

```json filename=".eslintrc.json"
{
  "extends": ["eslint:recommended", "next"]
}
```

`next`設定はすでに`parser`、`plugins`、および`settings`プロパティのデフォルト値の設定を処理しています。使用例に対して異なる設定が必要でない限り、これらのプロパティのいずれかを手動で再宣言する必要はありません。

他の共有可能な設定を含める場合は、**これらのプロパティが上書きまたは変更されないことを確認する必要があります**。そうでない場合は、上記のように`next`設定と動作を共有する設定を削除するか、Next.js ESLintプラグインから直接拡張することをお勧めします。
