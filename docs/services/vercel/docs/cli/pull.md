# vercel pull

`vercel pull` コマンドは、ローカルプロジェクトのリモート環境変数とプロジェクト設定をキャッシュに保存するCLIコマンドです。

## 主な機能

- リモートの環境変数とプロジェクト設定を `.vercel/.env.$target.local` にダウンロード
- デフォルトで「development」環境の設定を取得

## 使用方法

### デフォルト（development環境）

```bash
vercel pull
```

### preview環境

```bash
vercel pull --environment=preview
```

### 特定のGitブランチ

```bash
vercel pull --environment=preview --git-branch=feature-branch
```

### production環境

```bash
vercel pull --environment=production
```

## オプション

### --yes

セットアップ時の質問をスキップし、デフォルトのスコープと現在のディレクトリを使用します。

```bash
vercel pull --yes
```

### --environment

環境変数を取得する環境を指定します。

- `production` - 本番環境
- `preview` - プレビュー環境
- カスタム環境

```bash
vercel pull --environment=staging
```

### --git-branch

特定のGitブランチの環境変数を取得します。

```bash
vercel pull --git-branch=main
```

## 保存場所

環境変数とプロジェクト設定は `.vercel` ディレクトリに保存されます：

- `.vercel/.env.development.local`
- `.vercel/.env.preview.local`
- `.vercel/.env.production.local`
- `.vercel/project.json`

## 使用シナリオ

- `vercel build` を実行する前に最新の設定を取得
- `vercel dev` を使用する前に環境変数を同期
- チーム間で設定を共有

## グローバルオプション

以下のグローバルオプションを使用できます：

- `--cwd`
- `--debug`
- `--help`
- など、標準的なCLIグローバルオプションに対応
