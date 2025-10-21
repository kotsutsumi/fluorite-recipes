# Vercel CLI グローバルオプション

グローバルオプションは、複数のVercel CLIコマンドで共通して使用できるオプションです。

## 作業ディレクトリ

`--cwd`オプションを使用して、現在のディレクトリとは異なる作業ディレクトリを指定できます。

相対パスまたは絶対パスで指定可能です。

```bash
vercel --cwd ~/path-to/project
```

## デバッグ

`--debug`オプション（短縮形 `-d`）は、Vercel CLIコマンド実行時により詳細な出力を提供します。

```bash
vercel --debug
```

## グローバル設定

`--global-config`オプション（短縮形 `-Q`）は、[グローバル設定ディレクトリ](/docs/project-configuration/global-configuration)のパスを設定するために使用します。

```bash
vercel --global-config /path-to/global-config-directory
```

## ヘルプ

`--help`オプション（短縮形 `-h`）は、[Vercel CLI](/cli)コマンドに関する詳細情報を表示するために使用します。

```bash
vercel --help
```

特定のコマンドのヘルプを表示：

```bash
vercel alias --help
```

## ローカル設定

`--local-config`オプション（短縮形 `-A`）は、`vercel.json`ファイルのパスを設定するために使用します。

```bash
vercel --local-config /path-to/vercel.json
```

## スコープ

`--scope`オプション（短縮形 `-S`）は、現在アクティブでないスコープからVercel CLIコマンドを実行するために使用します。

```bash
vercel --scope my-team-slug
```

## トークン

`--token`オプション（短縮形 `-t`）は、認証トークンを指定するために使用します。CI/CD環境で特に便利です。

```bash
vercel --token YOUR_TOKEN
```

## バージョン

`--version`オプション（短縮形 `-v`）は、Vercel CLIのバージョンを表示します。

```bash
vercel --version
```

## その他のオプション

各コマンドには、特定のオプションがあります。詳細は各コマンドのドキュメントを参照してください。
