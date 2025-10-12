# Next.js CLI

Next.js CLIを使用すると、アプリケーションを起動、ビルド、エクスポートなどができます。

使用可能なCLIコマンドのリストを取得するには、プロジェクトディレクトリ内で次のコマンドを実行してください:

```bash
npx next -h
```

出力は次のようになります:

```bash
Usage: next [options] [command]

Next.js CLIを使用すると、アプリケーションを開発、ビルド、起動などができます。

Options:
  -v, --version  Next.jsバージョンを出力
  -h, --help     コマンドのヘルプを表示

Commands:
  build [options] [directory]
    本番ビルド用にアプリケーションをビルド
  dev [options] [directory]
    開発モードでアプリケーションを起動
  info [options]
    システムの関連情報を出力
  lint [options] [directory]
    ページとコンポーネントでESLintを実行
  start [options] [directory]
    本番モードでアプリケーションを起動
  telemetry [options]
    Next.jsが収集する匿名テレメトリデータの詳細情報
  typegen [options]
    Next.jsが生成した型を再生成
```

任意の[node引数](https://nodejs.org/api/cli.html#cli_node_options_options)を`next`コマンドに渡すことができます:

```bash
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

> **知っておくと良いこと**: `package.json`のscriptsフィールドにないコマンドを実行する場合は`next`の前に`npx`を付ける必要があります（例: `npx next info`）

## Build

`next build`は、アプリケーションの最適化された本番ビルドを作成します。出力には、各ルートに関する情報が表示されます:

```bash
Route (app)                               Size     First Load JS
┌ ○ /_not-found                           0 B                0 kB
└ ƒ /products/[id]                        0 B                0 kB

ƒ   Middleware

○  (Static)   ビルド時にHTMLとしてレンダリング
ƒ  (Dynamic)  リクエスト時にレンダリング
```

- **Size**: ページへクライアント側でナビゲートする際にダウンロードされるアセットの数。各ルートのサイズには、その依存関係のみが含まれます。
- **First Load JS**: サーバーからページにアクセスする際にダウンロードされるアセットの数。すべての人が共有するJSの量は、別のメトリックとして表示されます。

これらの値は両方とも**gzipで圧縮されています**。First Load JSは緑、黄色、または赤で示されます。パフォーマンスの高いアプリケーションには緑を目指してください。

`next build`で`--profile`フラグを使用して、React本番プロファイリングを有効にできます。これには[Next.js 9.5](https://nextjs.org/blog/next-9-5)が必要です:

```bash
next build --profile
```

その後、開発時と同じ方法でプロファイラーを使用できます。

`next build`で`--debug`フラグを使用して、より詳細なビルド出力を有効にできます。これには[Next.js 9.5.3](https://nextjs.org/blog/next-9-5-3)が必要です:

```bash
next build --debug
```

このフラグを有効にすると、リライト、リダイレクト、ヘッダーなどの追加のビルド出力が表示されます。

## Development

`next dev`は、ホットコードリローディング、エラー報告などを備えた開発モードでアプリケーションを起動します。

デフォルトでは、アプリケーションは`http://localhost:3000`で起動します。`-p`を使用してデフォルトのポートを変更できます:

```bash
npx next dev -p 4000
```

または、`PORT`環境変数を使用できます:

```bash
PORT=4000 npx next dev
```

> **知っておくと良いこと**:
>
> - `PORT`は`.env`では設定できません。HTTPサーバーのブートストラップは他のコードが初期化される前に行われるためです。
> - [App Router](/docs/app)を使用している場合は、[Fast Refresh](/docs/architecture/fast-refresh)がデフォルトで有効になっています。

### ホスト名の設定

`next dev`のデフォルトのホストは`localhost`です。他のホストでアプリケーションを起動したい場合は、`-H`フラグを使用できます:

```bash
npx next dev -H 192.168.1.2
```

または、`HOSTNAME`環境変数を使用できます:

```bash
HOSTNAME=192.168.1.2 npx next dev
```

### Turbopackを使用した開発

[Turbopack](/docs/app/api-reference/turbopack) (ベータ版)は、開発を高速化するためのNext.js用の新しいバンドラーです。`next dev --turbopack`を使用して、開発サーバーをTurbopackで起動できます:

```bash
next dev --turbopack
```

### HTTPSを使用した開発

Next.jsは、デフォルトで`http://localhost:3000`を使用します。特定の使用例では、`https://localhost:3000`などのローカルでHTTPSを使用することが望ましい場合があります。たとえば、デフォルトでHTTPS URLを使用するサービスフックや、Service Workerのカスタムサーバーをローカルでテストしたい場合などです。

Next.jsは、`next dev`で`--experimental-https`フラグを使用して、自己署名証明書を生成できます:

```bash
next dev --experimental-https
```

`--experimental-https-key`と`--experimental-https-cert`を使用して、カスタム証明書とキーを提供することもできます:

```bash
next dev --experimental-https --experimental-https-key ./certificates/localhost-key.pem --experimental-https-cert ./certificates/localhost.pem
```

`next dev --experimental-https`は開発のみを目的としており、`mkcert`を使用してローカルで信頼された証明書を作成します。本番環境では、信頼できる機関から正しく発行された証明書を使用してください。Vercelにデプロイする場合、HTTPSはNext.jsアプリケーション用に[自動的に設定](https://vercel.com/docs/security/encryption)されます。

## Production

`next start`は、アプリケーションを本番モードで起動します。アプリケーションは最初に[`next build`](#build)でコンパイルする必要があります。

デフォルトでは、アプリケーションは`http://localhost:3000`で起動します。`-p`を使用してデフォルトのポートを変更できます:

```bash
npx next start -p 4000
```

または、`PORT`環境変数を使用できます:

```bash
PORT=4000 npx next start
```

> **知っておくと良いこと**:
>
> - `PORT`は`.env`では設定できません。HTTPサーバーのブートストラップは他のコードが初期化される前に行われるためです。
>
> - `next start`は`output: 'standalone'`または`output: 'export'`では使用できません。

### Keep Alive Timeout

Next.jsをダウンストリームプロキシ（例：AWS ELB/ALBなどのロードバランサー）の背後にデプロイする場合、Next.jsの基盤となるHTTPサーバーに、ダウンストリームプロキシのタイムアウトより*大きい*[keep-alive timeout](https://nodejs.org/api/http.html#http_server_keepalivetimeout)を設定することが重要です。そうしないと、特定のTCP接続でkeep-aliveタイムアウトに達すると、Node.jsはダウンストリームプロキシに通知せずにその接続を即座に終了します。これにより、Node.jsがすでに終了した接続をプロキシが再利用しようとするたびに、プロキシエラーが発生します。

本番Next.jsサーバーのタイムアウト値を設定するには、`next start`に`--keepAliveTimeout`（ミリ秒単位）を渡します。例えば:

```bash
npx next start --keepAliveTimeout 70000
```

## Info

`next info`は、Next.jsのバグを報告するために使用できる、現在のシステムに関する関連詳細を出力します。この情報には、オペレーティングシステムのプラットフォーム/アーキテクチャ/バージョン、バイナリ（Node.js、npm、Yarn、pnpm）、およびnpm パッケージのバージョン（`next`、`react`、`react-dom`）が含まれます。

プロジェクトのルートディレクトリで次を実行します:

```bash
next info
```

以下のような情報が表示されます:

```bash
Operating System:
  Platform: linux
  Arch: x64
  Version: #22-Ubuntu SMP Fri Nov 5 13:21:36 UTC 2021
Binaries:
  Node: 16.13.0
  npm: 8.1.0
  Yarn: 1.22.17
  pnpm: 6.24.2
Relevant Packages:
  next: 14.1.1-canary.61
  eslint-config-next: 14.1.1-canary.61
  react: 18.2.0
  react-dom: 18.2.0
  typescript: 5.3.3
Next.js Config:
  output: N/A
```

この情報は、GitHubのIssuesに貼り付ける必要があります。

`next info --verbose`を実行して、システムとNext.jsに関連するパッケージのインストールに関する追加情報を出力することもできます。

## Lint

`next lint`は、`pages/`、`app/`、`components/`、`lib/`、`src/`ディレクトリ内のすべてのファイルに対してESLintを実行します。また、アプリケーションにESLintがまだ設定されていない場合は、必要な依存関係をインストールするためのガイド付きセットアップも提供します。

> **知っておくと良いこと**: Next.js 16以降、`next lint`コマンドは廃止されました。代わりに、[Biome](/docs/app/building-your-application/configuring/linters/biome)または[ESLint](/docs/app/building-your-application/configuring/linters/eslint)を直接使用してください。

他のディレクトリをリントしたい場合は、`--dir`フラグを使用してそれらを指定できます:

```bash
next lint --dir utils
```

詳細については、[ESLint](/docs/app/api-reference/config/eslint)ドキュメントを参照してください。

## Telemetry

Next.jsは、一般的な使用状況に関する**完全に匿名の**テレメトリデータを収集します。この匿名プログラムへの参加は任意であり、情報を共有したくない場合はオプトアウトできます。

テレメトリの詳細については、[次のドキュメント](/telemetry/)を参照してください。

## Type Generation

`next typegen`は、Next.jsが生成する型を再生成します。これは、静的に型付けされたリンクを有効にするために実験的な`typedRoutes`を使用している場合に便利です。

詳細については、[静的に型付けされたリンク](/docs/app/api-reference/config/typescript#静的に型付けされたリンク)のドキュメントを参照してください。

## Next.js CLI

Next.js CLIは、コマンドのヘルプメッセージを表示するための`--help`フラグをサポートしています。

```bash
npx next --help
```

出力は次のようになります:

```bash
Usage: next [options] [command]

Next.js CLIを使用すると、アプリケーションを開発、ビルド、起動などができます。

Options:
  -v, --version  Next.jsバージョンを出力
  -h, --help     コマンドのヘルプを表示

Commands:
  build [options] [directory]
    本番ビルド用にアプリケーションをビルド
  dev [options] [directory]
    開発モードでアプリケーションを起動
  info [options]
    システムの関連情報を出力
  lint [options] [directory]
    ページとコンポーネントでESLintを実行
  start [options] [directory]
    本番モードでアプリケーションを起動
  telemetry [options]
    Next.jsが収集する匿名テレメトリデータの詳細情報
  typegen [options]
    Next.jsが生成した型を再生成
```

任意のコマンドに`--help`フラグを渡して、詳細なヘルプメッセージを表示できます:

```bash
npx next build --help
```

出力は次のようになります:

```bash
Usage: next build [directory] [options]

アプリケーションの本番ビルドを作成します。
ビルド出力は、指定されたディレクトリに保存されます。
指定されていない場合、.next ディレクトリが使用されます。

Arguments:
  [directory]                           Next.jsアプリケーションのディレクトリへのパス。指定されていない場合、現在のディレクトリが使用されます。

Options:
  -d, --debug                           より詳細なビルド出力を有効にする
  --profile                             React本番プロファイリングを有効にする
  --no-lint                             リントを無効にする
  --no-mangling                         マングリングを無効にする
  --experimental-build-mode [mode]      実験的なビルドモードを使用する (choices: "compile" または "generate", default: "default")
  --experimental-turbopack-root <path>  Turbopackのベースアセットディレクトリを設定
  -h, --help                            オプションのヘルプを表示
```
