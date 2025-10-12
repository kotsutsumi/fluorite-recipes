# create-next-app

新しいNext.jsアプリケーションを開始する最も簡単な方法は、`create-next-app`を使用することです。このCLIツールを使用すると、すべてがセットアップされた新しいNext.jsアプリケーションをすばやく構築できます。

デフォルトのNext.jsテンプレートを使用して新しいアプリを作成することも、[公式Next.jsの例](https://github.com/vercel/next.js/tree/canary/examples)のいずれかを使用することもできます。

### インタラクティブ

引数なしで`create-next-app`を実行すると、インタラクティブな体験が開始されます:

```bash
npx create-next-app@latest
```

```bash
yarn create next-app
```

```bash
pnpm create next-app
```

```bash
bun create next-app
```

次のようなプロンプトが表示されます:

```txt
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to use Turbopack for `next dev`? No / Yes
Would you like to customize the import alias (@/* by default)? No / Yes
```

プロンプトに応答すると、回答に基づいて正しい設定で新しいプロジェクトが作成されます。

### 非インタラクティブ

コマンドライン引数を渡すことで、非インタラクティブに新しいプロジェクトをセットアップすることもできます。

さらに、デフォルトオプションをプレフィックス `--no-` で無効化できます（例: `--no-eslint`）。

`create-next-app --help`を参照してください:

```bash
Usage: create-next-app [project-directory] [options]

Options:
  -V, --version                        出力バージョン番号
  --ts, --typescript

    TypeScriptプロジェクトとして初期化します。（デフォルト）

  --js, --javascript

    JavaScriptプロジェクトとして初期化します。

  --tailwind

    Tailwind CSS設定で初期化します。（デフォルト）

  --eslint

    ESLint設定で初期化します。

  --app

    App Routerプロジェクトとして初期化します。

  --src-dir

    `src/`ディレクトリ内で初期化します。

  --turbopack

    `next dev`でTurbopackを有効にします。

  --import-alias <alias-to-configure>

    インポートエイリアスを指定して使用します（デフォルト "@/*"）。

  --empty

    空のプロジェクトを初期化します。

  --use-npm

    コマンドが `npm` を使用して実行された場合でも、明示的に `npm` を使用するようブートストラッパーに指示します。

  --use-pnpm

    明示的に `pnpm` を使用するようブートストラッパーに指示します。

  --use-yarn

    明示的に `yarn` を使用するようブートストラッパーに指示します。

  --use-bun

    明示的に `bun` を使用するようブートストラッパーに指示します。

  -e, --example [name]|[github-url]

    アプリケーションをブートストラップする例。公式Next.jsリポジトリから
    の例の名前、またはGitHubのURLを使用できます。URLは任意のブランチ
    および/またはサブディレクトリを使用できます。

  --example-path <path-to-example>

    まれなケースでは、GitHubのURLに `/` を含むブランチ名が含まれる場合があり
    （例: bug/fix-1）、例のパスを個別に指定する必要があります:
    --example-path foo/bar

  --reset-preferences

    保存された設定をすべてリセットします。

  --skip-install

    依存関係のインストールをスキップします。

  -h, --help                           使用情報を表示
```

### なぜcreate-next-appを使用するのか？

`create-next-app`を使用すると、数秒で新しいNext.jsアプリを作成できます。Next.jsのクリエーターによって公式にメンテナンスされており、多くの利点があります:

- **インタラクティブ体験**: 引数なしで`npx create-next-app@latest`を実行すると、プロジェクトをセットアップするためのインタラクティブな体験が開始されます。
- **ゼロ依存関係**: プロジェクトの初期化は1秒で完了します。Create Next Appには依存関係がありません。
- **オフラインサポート**: Create Next Appは、オフラインであることを自動的に検出し、ローカルパッケージキャッシュを使用してプロジェクトをブートストラップします。
- **サンプルのサポート**: Create Next Appは、Next.jsサンプルコレクション（例: `npx create-next-app --example api-routes`）または任意のパブリックGitHubリポジトリからサンプルを使用してアプリケーションをブートストラップできます。
- **テスト済み**: パッケージはNext.jsモノレポの一部であり、Next.js自体と同じ統合テストスイートを使用してテストされており、すべてのリリースで動作することが保証されています。
