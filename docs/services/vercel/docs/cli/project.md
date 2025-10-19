# vercel project

`vercel project` コマンドは、Vercelプロジェクトを管理するためのCLIコマンドです。

## 使用方法

### プロジェクトの一覧表示

```bash
vercel project ls
```

現在のスコープ内のすべてのプロジェクトを一覧表示します。

JSON形式で出力：

```bash
vercel project ls --json
```

### 更新が必要なプロジェクトの一覧

```bash
vercel project ls --update-required
```

フレームワークやランタイムの更新が必要なプロジェクトを表示します。

JSON形式で出力：

```bash
vercel project ls --update-required --json
```

### プロジェクトの追加

```bash
vercel project add
```

新しいVercelプロジェクトを作成します。

### プロジェクトの削除

```bash
vercel project rm
```

既存のVercelプロジェクトを削除します。

## オプション

### --json

出力をJSON形式にします。スクリプトやツールでの使用に便利です。

### --update-required

フレームワークやランタイムの更新が必要なプロジェクトのみを表示します。

## グローバルオプション

以下のグローバルオプションを使用できます：

- `--cwd`
- `--debug`
- `--global-config`
- `--help`
- `--local-config`
- `--no-color`
- `--scope`
- `--token`

詳細は[グローバルオプションのセクション](/docs/cli/global-options)を参照してください。
