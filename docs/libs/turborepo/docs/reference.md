# Turborepo APIリファレンス

TurborepoのAPIリファレンスは以下のセクションに分かれています:

## 設定

以下に関するカード:
- turbo.jsonの設定
- パッケージ設定
- システム環境変数
- ファイルglob仕様

## コマンド

以下を含むコマンドのカード:
- run
- watch
- prune
- boundaries
- ls
- query
- generate
- login
- logout
- link
- unlink
- scan
- bin
- telemetry

## パッケージ

以下に関するカード:
- create-turbo
- eslint-config-turbo
- turbo-ignore
- @turbo/gen

## フラグの構文

値を必要とするオプションは、等号を使用して渡すことができ、スペースが必要な場合は引用符を使用します:

```bash
--opt=value
--opt="value with a space"
--opt value
--opt "value with a space"
```

## グローバルフラグ

### `--color`

非インタラクティブな端末でも、カラー表示を強制します。CI環境でカラー出力を有効にするのに便利です。

### `--no-color`

インタラクティブな端末でも、端末出力のカラー表示を抑制します。

### `--no-update-notifier`

更新通知を無効にします。手動で無効にするか、`TURBO_NO_UPDATE_NOTIFIER`環境変数を使用して無効にすることができます。
