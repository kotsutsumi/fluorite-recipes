# vercel deploy

`vercel deploy` コマンドは、VercelプロジェクトをデプロイするためのCLIコマンドです。プロジェクトのルートディレクトリから実行するか、パスを指定して実行できます。'deploy'を省略して単に `vercel` と入力することもできます。

## 使用方法

```bash
vercel
```

プロジェクトのルートディレクトリから `vercel` コマンドを使用します。

または、明示的に：

```bash
vercel deploy
```

## 拡張された使用方法

### パスを指定してデプロイ

```bash
vercel --cwd [path-to-project]
```

`vercel` コマンドにVercelプロジェクトのルートディレクトリへのパスを指定します。

### 事前ビルドされたプロジェクトのデプロイ

```bash
vercel deploy --prebuilt
```

事前にビルドされたVercelプロジェクトをデプロイします。詳細は [`vercel build`](/docs/cli/build) と [Build Output API](/docs/build-output-api/v3) を参照してください。

## 標準出力の使用方法

デプロイ時、`stdout` は常にデプロイメントURLになります。

```bash
vercel > deployment-url.txt
```

デプロイし、`stdout` をテキストファイルに書き込みます。

### カスタムドメインへのデプロイ

以下の例では、CI/CDワークフローに含めるBashスクリプトを作成します。すべてのプレビューデプロイメントを特定のカスタムドメインにエイリアス設定します。

```bash
# stdout と stderr をファイルに保存
vercel deploy >deployment-url.txt 2>error.txt

# 終了コードを確認
if [ $? -eq 0 ]; then
  # デプロイメント成功
  vercel alias set $(cat deployment-url.txt) preview.example.com
else
  # デプロイメント失敗
  cat error.txt
  exit 1
fi
```

## ユニークなオプション

### 本番環境

`--prod` オプションは、本番環境へのデプロイメントを作成します。

```bash
vercel --prod
```

### ドメインをスキップ

`--skip-domain` オプションは、デプロイメント時にカスタムドメインの自動割り当てをスキップします。

```bash
vercel --prod --skip-domain
```

### はい

`--yes` オプションは、インタラクティブな確認プロンプトをスキップします。

```bash
vercel --yes
```

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel deploy`コマンドで使用できます。
