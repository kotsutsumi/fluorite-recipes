# vercel dev

`vercel dev` コマンドは、Vercelデプロイメント環境をローカルで再現し、デプロイするたびに変更を確認する必要なく、[Vercelファンクション](/docs/functions)と[ミドルウェア](/docs/routing-middleware)をテストできるようにするCLIコマンドです。

## いつこのコマンドを使用するか

フレームワークの[開発コマンド](/docs/deployments/configure-a-build#development-command)がすでに必要な機能をすべて提供している場合は、`vercel dev` の使用は推奨されません。

例えば、[Next.js](/docs/frameworks/nextjs)の開発コマンド（`next dev`）は、ファンクション、[リダイレクト](/docs/redirects#configuration-redirects)、書き換え、ヘッダーなどをネイティブでサポートしています。

## 使用方法

```bash
vercel dev
```

Vercelプロジェクトディレクトリのルートから`vercel dev`コマンドを使用します。

## ユニークなオプション

### リッスン

`--listen`オプション（省略形 `-l`）を使用して、`vercel dev`が実行されるポートを指定できます。

```bash
vercel dev --listen 5005
```

### Yes

`--yes`オプションを使用すると、新しいVercelプロジェクトの設定時に表示される質問をスキップできます。質問はデフォルトのスコープと現在のディレクトリでプロジェクト名と場所に対して回答されます。

```bash
vercel dev --yes
```

## 機能

`vercel dev` は以下の機能をローカルで再現します：

- Vercelファンクション
- ミドルウェア
- リダイレクト
- リライト
- ヘッダー
- 環境変数

## フレームワークとの互換性

多くの最新フレームワークは、独自の開発サーバーでVercelの機能をネイティブサポートしています。そのような場合、フレームワークの開発コマンドの使用が推奨されます。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel dev`コマンドで使用できます。
