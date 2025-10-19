# vercel alias

`vercel alias` コマンドを使用すると、デプロイメントに[カスタムドメイン](/docs/projects/custom-domains)を適用できます。

新しいデプロイメントが作成されると（[Gitインテグレーション](/docs/git)、Vercel CLI、または[REST API](/docs/rest-api)を通じて）、プラットフォームは自動的にプロジェクト設定で構成されているカスタムドメインを適用します。

## 推奨される本番デプロイコマンド

`vercel alias` コマンドは本番デプロイメントを特定のドメインに昇格させる推奨の方法ではありません。代わりに、以下のコマンドを使用できます：

- [`vercel --prod --skip-domain`](/docs/cli/deploy#prod)：本番環境にデプロイし、ステージングデプロイメントを作成する際にカスタムドメインの割り当てをスキップする
- [`vercel promote [deployment-id or url]`](/docs/cli/promote)：ステージングデプロイメントをカスタムドメインに昇格させる
- [`vercel rollback [deployment-id or url]`](/docs/cli/rollback)：以前の本番デプロイメントをカスタムドメインにエイリアス設定する

## 使用方法

一般的に、このコマンドは任意のデプロイメントにカスタムドメインを割り当てることができます。

`[custom-domain]` パラメータには、HTTPプロトコル（例：`https://`）を含めないでください。

```bash
vercel alias set [deployment-url] [custom-domain]
```

デプロイメントにカスタムドメインをエイリアス設定します。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel alias`コマンドで使用できます。
