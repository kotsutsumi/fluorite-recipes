# vercel rolling-release

`vercel rolling-release` コマンドは、ローリングリリース機能を管理するために使用します。

## 概要

ローリングリリースは、新しいデプロイメントへのトラフィックを段階的に増やすことで、リスクを軽減しながら本番環境を更新する機能です。

## 使用方法

### ローリングリリースの開始

```bash
vercel rolling-release start [deployment-url] --percentage 10
```

指定したデプロイメントへのトラフィックを10%から開始します。

### トラフィック割合の更新

```bash
vercel rolling-release update [deployment-url] --percentage 50
```

トラフィックを50%に増やします。

### ローリングリリースの完了

```bash
vercel rolling-release complete [deployment-url]
```

すべてのトラフィックを新しいデプロイメントに切り替えます。

### ローリングリリースのキャンセル

```bash
vercel rolling-release cancel
```

ローリングリリースをキャンセルし、以前の状態に戻します。

## オプション

### --percentage

トラフィックの割合を指定します（1-99）。

```bash
vercel rolling-release start my-deployment --percentage 25
```

## 使用シナリオ

- 新機能のカナリアリリース
- リスクの高い変更の段階的な展開
- パフォーマンスの影響を監視しながらのアップデート

## グローバルオプション

以下のグローバルオプションを使用できます：

- `--cwd`
- `--debug`
- `--help`
- など、標準的なCLIグローバルオプションに対応

## 関連コマンド

- [`vercel promote`](/docs/cli/promote) - デプロイメントを本番環境に昇格
- [`vercel rollback`](/docs/cli/rollback) - 以前のデプロイメントにロールバック
