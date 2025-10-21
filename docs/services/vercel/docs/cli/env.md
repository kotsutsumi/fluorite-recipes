# vercel env

`vercel env` コマンドは、Vercelプロジェクトの[環境変数](/docs/environment-variables)を管理するために使用され、リスト、追加、削除、エクスポートの機能を提供します。

ローカルツール（`next dev` や `gatsby dev` など）で環境変数をファイル（`.env`など）で使用するには、`vercel env pull <file>` を実行します。これにより、プロジェクトの環境変数が指定されたファイルにエクスポートされます。Vercel上で環境変数を更新した後（ダッシュボード、`vercel env add`、または `vercel env rm` を通じて）、更新された値を取得するには、再度 `vercel env pull <file>` を実行する必要があります。

## 開発環境変数のエクスポート

一部のフレームワークは、`next dev` や `gatsby dev` などのCLIコマンドを通じて、ローカル開発中に環境変数を使用します。`vercel env pull` サブコマンドは、開発環境変数をローカルの `.env` ファイルまたは任意のファイルにエクスポートします。

```bash
vercel env pull [file]
```

一時的に環境変数の値を上書きするには:

```bash
MY_ENV_VAR="temporary value" next dev
```

`vercel build` または `vercel dev` を使用している場合は、代わりに [`vercel pull`](/docs/cli/pull) を使用する必要があります。これらのコマンドは、`.vercel/` 以下に保存されているローカルの環境変数とプロジェクト設定のコピーで動作し、`vercel pull` によって提供されます。

## 使用方法

### 環境変数の一覧表示

```bash
vercel env ls
```

### 環境変数の追加

```bash
vercel env add [name]
```

### 環境変数の削除

```bash
vercel env rm [name]
```

### 環境変数のプル

```bash
vercel env pull [file]
```

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel env`コマンドで使用できます。
