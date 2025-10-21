# vercel redeploy

`vercel redeploy`コマンドは、既存のデプロイメントを再ビルドおよび再デプロイするために使用します。

## 使用方法

```bash
vercel redeploy [deployment-id or url]
```

指定したデプロイメントを再デプロイします。

## オプション

### --no-wait

デプロイメントの完了を待たずにコマンドを終了します。

```bash
vercel redeploy https://example-app-6vd6bhoqt.vercel.app --no-wait
```

### --target

デプロイ先の環境を指定します（production、preview、カスタム環境）。

```bash
vercel redeploy https://example-app-6vd6bhoqt.vercel.app --target=staging
```

## 出力

- **標準出力（stdout）**：常にデプロイメントのURLを返します
- **標準エラー（stderr）**：エラー発生時にエラーメッセージを返します

## 使用シナリオ

- 外部依存関係の更新後に再デプロイ
- ビルドエラーの修正後に再実行
- キャッシュをクリアして完全再ビルド

## 動作

1. 元のデプロイメント設定を使用
2. ソースコードを再ビルド
3. 新しいデプロイメントURLを生成

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

- [`vercel deploy`](/docs/cli/deploy) - 新規デプロイメント
- [`vercel rollback`](/docs/cli/rollback) - 以前のデプロイメントにロールバック
