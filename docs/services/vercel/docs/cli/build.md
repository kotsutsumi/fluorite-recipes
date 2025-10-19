# vercel build

`vercel build` コマンドは、Vercelプロジェクトをローカルまたは独自のCI環境でビルドするために使用できます。ビルド成果物は、[Build Output API](/docs/build-output-api/v3) に従って `.vercel/output` ディレクトリに配置されます。

`vercel deploy --prebuilt` コマンドと組み合わせることで、VercelプロジェクトのソースコードをVercelと共有せずに、Vercelデプロイメントを作成できます。

また、このコマンドは、ローカルでビルドエラーのメッセージを受け取ったり、Vercelがデプロイメントを作成する方法をより深く理解するために、ビルド成果物を検査したりする際に役立ちます。

`vercel build` を実行する前に、最新のプロジェクト設定と環境変数をローカルに保存するため、`vercel pull` コマンドを実行することをお勧めします。

## 使用方法

```bash
vercel build
```

Vercelプロジェクトをビルドするための `vercel build` コマンドの使用。

## ユニークなオプション

### 本番環境

`--prod` オプションは、本番環境の環境変数を使用してVercelプロジェクトをビルドする場合に指定できます。デフォルトでは、プレビュー環境の環境変数が使用されます。

```bash
vercel build --prod
```

`--prod` オプションを使用した `vercel build` コマンド。

### はい

`--yes` オプションは、確認プロンプトをスキップし、ローカルに見つからない場合に自動的に環境変数とプロジェクト設定をダウンロードします。

```bash
vercel build --yes
```

## 出力

ビルド成果物は `.vercel/output` ディレクトリに生成されます。このディレクトリには、デプロイに必要なすべてのファイルが含まれています。

## 関連コマンド

- [`vercel deploy --prebuilt`](/docs/cli/deploy) - ビルド済みプロジェクトをデプロイ
- [`vercel pull`](/docs/cli/pull) - プロジェクト設定と環境変数をダウンロード

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel build`コマンドで使用できます。
