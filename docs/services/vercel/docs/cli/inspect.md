# vercel inspect

`vercel inspect` コマンドは、デプロイメントのURLまたはIDを参照して、そのデプロイメントに関する情報を取得するために使用されます。

このコマンドを使用して、デプロイメントの情報または[ビルドログ](/docs/cli/inspect#logs)を表示できます。

## 使用方法

```bash
vercel inspect [deployment-id or url]
```

特定のデプロイメントに関する情報を取得するための `vercel inspect` コマンドの使用。

## ユニークなオプション

以下は `vercel inspect` コマンドにのみ適用されるオプションです。

### タイムアウト

`--timeout` オプションは、デプロイメント完了を待つ時間を設定します。デフォルトは3分です。

[ms](https://www.npmjs.com/package/ms) パッケージの有効な時間文字列を使用できます。

```bash
vercel inspect https://example-app-6vd6bhoqt.vercel.app --timeout=5m
```

`--timeout` オプションを使用した `vercel inspect` コマンド。

### 待機

`--wait` オプションは、指定されたデプロイメントが完了するまでCLIをブロックします。

```bash
vercel inspect https://example-app-6vd6bhoqt.vercel.app --wait
```

`--wait` オプションを使用した `vercel inspect` コマンド。

### ログ

`--logs` オプション（省略形 `-l`）は、デプロイメント情報の代わりにビルドログを印刷します。

```bash
vercel inspect https://example-app-6vd6bhoqt.vercel.app --logs
```

利用可能なビルドログを表示するための `--logs` オプションを使用した `vercel inspect` コマンド。

## 出力情報

このコマンドは以下の情報を表示します：

- デプロイメントID
- デプロイメントURL
- デプロイメント状態
- 作成日時
- ビルド設定
- 環境変数（機密情報は除く）

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel inspect`コマンドで使用できます。
