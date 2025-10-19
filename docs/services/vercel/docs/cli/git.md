# vercel git

`vercel git` コマンドは、VercelプロジェクトのためのGitプロバイダーリポジトリを管理するために使用されます。これにより、Gitを通じてVercelへのデプロイが可能になります。

## 使用方法

コマンドを実行すると、Vercel CLIはローカルの `.git` 設定ファイルを検索し、少なくとも1つのリモートURLを見つけます。見つかった場合、そのディレクトリにリンクされたVercelプロジェクトに接続できます。

### Git接続

```bash
vercel git connect
```

現在のプロジェクトをGitリポジトリに接続します。

### Git切断

```bash
vercel git disconnect
```

現在のプロジェクトからGitリポジトリを切断します。

## ユニークなオプション

### Yes

`--yes` オプションを使用すると、接続確認をスキップできます。

```bash
vercel git connect --yes
```

## Gitインテグレーションの利点

- プッシュ時の自動デプロイ
- プルリクエストのプレビュー
- 本番ブランチの自動昇格

## グローバルオプション

以下のグローバルオプションを `vercel git` コマンドで使用できます：

- `--cwd`
- `--debug`
- `--global-config`
- `--help`
- `--local-config`
- `--no-color`
- `--scope`
- `--token`

詳細については、[オプションセクション](/docs/cli/global-options)を参照してください。

[詳細情報: Vercelでのgitの使用](/docs/git)
