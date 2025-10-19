# vercel rollback

`vercel rollback` コマンドは、以前のデプロイメントに本番環境をロールバックするために使用します。

## 使用方法

### ステータス確認

```bash
vercel rollback
```

現在のロールバックステータスを確認します。

### 特定のデプロイメントにロールバック

```bash
vercel rollback [deployment-id or url]
```

指定したデプロイメントに本番環境をロールバックします。

## プランによる制限

### ホビープラン

- 直前の本番デプロイメントにのみロールバック可能
- それ以前のデプロイメントにロールバックするには、プランのアップグレードが必要

### Pro/Enterpriseプラン

- 任意の以前のデプロイメントにロールバック可能

## オプション

### タイムアウト

`--timeout`オプションは、ロールバック完了を待つ時間を指定します。

- `0`を指定すると即座に終了

```bash
vercel rollback my-deployment --timeout=5m
```

### Yes

`--yes`オプションで確認プロンプトをスキップします。

```bash
vercel rollback my-deployment --yes
```

## 動作

1. 指定されたデプロイメントを選択
2. 本番環境のドメインを割り当て
3. トラフィックを以前のデプロイメントに切り替え

## 使用シナリオ

- 新しいデプロイメントに問題が発生した場合
- 緊急で以前の安定バージョンに戻す必要がある場合
- A/Bテストで以前のバージョンに戻す場合

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

## 関連コマンド

- [`vercel promote`](/docs/cli/promote) - デプロイメントを本番環境に昇格
- [`vercel list`](/docs/cli/list) - デプロイメントの一覧表示
