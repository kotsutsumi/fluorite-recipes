# Vercel CLI の概要

Vercelは、プロジェクトを操作するための複数の方法を提供しています。コマンドラインインターフェース（CLI）を使用すると、ターミナルまたは自動システムを通じてVercelプラットフォームと対話できます。これにより、以下のような操作が可能になります：

- [ログの取得](/docs/cli/logs)
- [証明書の管理](/docs/cli/certs)
- [ローカル環境でのデプロイメント環境の複製](/docs/cli/dev)
- [DNSレコードの管理](/docs/cli/dns)

プログラム的にプラットフォームと連携したい場合は、[REST API ドキュメント](/docs/rest-api)を確認してください。

## Vercel CLIのインストール

Vercel CLIをダウンロードしてインストールするには、以下のコマンドを実行します：

```bash
pnpm i -g vercel
```

または、npmやyarnを使用することもできます：

```bash
npm i -g vercel
```

```bash
yarn global add vercel
```

## Vercel CLIの更新

新しいリリースがある場合、任意のコマンドを実行すると更新可能であることを示すメッセージが表示されます。

npmまたはYarnでインストールした場合、更新は再度インストールコマンドを実行することで可能です：

```bash
pnpm i -g vercel@latest
```

権限エラーが発生した場合は、npmの[公式ガイド](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)を参照してください。

## バージョンの確認

Vercel CLIの現在のバージョンを確認するには、`--version`オプションを使用します：

```bash
vercel --version
```

## CI/CD環境での使用

CI/CD環境でVercel CLIを使用する場合は、認証トークンを環境変数として設定することが推奨されます。

## 関連ドキュメント

- [CLIからのデプロイ](/docs/cli/deploying-from-cli)
- [プロジェクトのリンク](/docs/cli/project-linking)
- [グローバルオプション](/docs/cli/global-options)
- [テレメトリーについて](/docs/cli/about-telemetry)
