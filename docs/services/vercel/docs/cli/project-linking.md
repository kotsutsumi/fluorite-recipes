# Vercel CLIでのプロジェクトのリンク

初めて`vercel`コマンドをディレクトリで実行する際、Vercel CLIは、ディレクトリをデプロイする[スコープ](/docs/dashboard-features#scope-selector)と[Vercelプロジェクト](/docs/projects/overview)を知る必要があります。既存のVercelプロジェクトに[リンク](/docs/cli/link)するか、新しいプロジェクトを作成するかを選択できます。

## ターミナル例

```bash
vercel
? Set up and deploy "~/web/my-lovely-project"? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] y
? What's the name of your existing project? my-lovely-project
🔗 Linked to awesome-team/my-lovely-project (created .vercel and added it to .gitignore)
```

一度設定すると、新しい`.vercel`ディレクトリがディレクトリに追加されます。`.vercel`ディレクトリには、Vercelプロジェクトの組織と`id`が含まれています。ディレクトリを[アンリンク](/docs/cli/link)したい場合は、`.vercel`ディレクトリを削除できます。

`--yes`オプションを使用して、これらの質問をスキップできます。

## フレームワーク検出

新しいVercelプロジェクトを作成する際、Vercel CLIは[リンク](/docs/cli/link)し、使用しているフレームワークを自動的に検出し、デフォルトのプロジェクト設定を提案します。

```bash
vercel
? Set up and deploy "~/web/my-new-project"? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] n
? What's your project's name? my-new-project
? In which directory is your code located? ./
Auto-detected Project Settings (Next.js):
- Build Command: next build
- Output Directory: .next
- Development Command: next dev --port $PORT
? Want to override the settings? [y/N] n
```

## .vercelディレクトリ

`.vercel`ディレクトリには、プロジェクトとチームの情報が含まれています：

- プロジェクトID
- 組織ID（チームID）

このディレクトリは`.gitignore`に自動的に追加され、バージョン管理から除外されます。

## リンクコマンド

プロジェクトを手動でリンクまたはアンリンクするには、[linkコマンド](/docs/cli/link)を使用します。
