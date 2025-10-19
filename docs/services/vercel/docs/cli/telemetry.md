# vercel telemetry

`vercel telemetry` コマンドは、Vercel CLIのテレメトリー設定を管理します。

## 使用方法

### テレメトリーのステータス確認

```bash
vercel telemetry status
```

現在のテレメトリーの有効/無効状態を表示します。

### テレメトリーの有効化

```bash
vercel telemetry enable
```

テレメトリーを有効にします。

### テレメトリーの無効化

```bash
vercel telemetry disable
```

テレメトリーを無効にします。

## テレメトリーとは

Vercel CLIのテレメトリーは、以下の情報を収集します：

- 使用されたコマンド
- CLIのバージョン
- 基本的なマシン情報（OS、CPUコア数など）
- エラー情報

収集される情報の詳細については、[テレメトリーについて](/docs/cli/about-telemetry)を参照してください。

## プライバシー

- 個人を特定できる情報は収集されません
- ソースコードは収集されません
- プロジェクト名やファイル名は収集されません

## オプトアウト

テレメトリーはいつでも無効にできます：

```bash
vercel telemetry disable
```

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

詳細は[グローバルオプションセクション](/docs/cli/global-options)を参照してください。

## 関連ドキュメント

- [テレメトリーについて](/docs/cli/about-telemetry) - テレメトリーの詳細情報
