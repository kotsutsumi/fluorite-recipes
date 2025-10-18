以下は、shadcn/ui CLIのドキュメントページの日本語訳です：

# shadcn CLI

shadcnのCLIを使用して、プロジェクトにコンポーネントを追加します。

## インストール

CLIはグローバルにインストールする必要はありません。`npx`を使用して実行できます：

```bash
npx shadcn@latest init
```

## init

`init`コマンドを使用して、新しいプロジェクトの設定と依存関係を初期化します。

`init`コマンドは依存関係をインストールし、`cn`ユーティリティを追加し、プロジェクトのCSS変数を設定します。

### 使用方法

```bash
npx shadcn@latest init
```

### オプション

```bash
npx shadcn@latest init [options]
```

#### -t, --template
使用するテンプレートを選択します。

```bash
npx shadcn@latest init --template next
```

利用可能なテンプレート：
- `next` - Next.jsプロジェクト
- `next-monorepo` - Next.jsモノレポプロジェクト

#### -c, --color
ベースカラーを選択します。

```bash
npx shadcn@latest init --color zinc
```

利用可能なカラー：
- `neutral`
- `gray`
- `zinc`
- `slate`
- `stone`

#### -y, --yes
すべての確認プロンプトをスキップします。

```bash
npx shadcn@latest init --yes
```

#### -f, --force
既存の設定を上書きします。

```bash
npx shadcn@latest init --force
```

#### -d, --cwd
作業ディレクトリを指定します。

```bash
npx shadcn@latest init --cwd ./my-project
```

#### --css-variables
CSS変数を使用します（推奨）。

```bash
npx shadcn@latest init --css-variables
```

#### --no-css-variables
Tailwindユーティリティクラスを使用します。

```bash
npx shadcn@latest init --no-css-variables
```

## add

`add`コマンドを使用して、コンポーネントと依存関係をプロジェクトに追加します。

### 使用方法

```bash
npx shadcn@latest add [component]
```

### 例

```bash
# 単一のコンポーネントを追加
npx shadcn@latest add button

# 複数のコンポーネントを追加
npx shadcn@latest add button card dialog

# すべてのコンポーネントを追加
npx shadcn@latest add --all
```

### オプション

#### -y, --yes
確認プロンプトをスキップします。

```bash
npx shadcn@latest add button --yes
```

#### -o, --overwrite
既存ファイルを上書きします。

```bash
npx shadcn@latest add button --overwrite
```

#### -d, --cwd
作業ディレクトリを指定します。

```bash
npx shadcn@latest add button --cwd ./my-project
```

#### -a, --all
すべてのコンポーネントを追加します。

```bash
npx shadcn@latest add --all
```

#### -p, --path
コンポーネントの追加パスを指定します。

```bash
npx shadcn@latest add button --path ./components/custom
```

## view

`view`コマンドを使用して、インストール前にレジストリからアイテムを表示します。

### 使用方法

```bash
npx shadcn@latest view [item]
```

### 例

```bash
# 単一のアイテムを表示
npx shadcn@latest view button

# 複数のアイテムを表示
npx shadcn@latest view button card

# 名前空間付きレジストリからアイテムを表示
npx shadcn@latest view acme:button
```

## search

`search`コマンドを使用して、レジストリからアイテムを検索します。

### 使用方法

```bash
npx shadcn@latest search [query]
```

### 例

```bash
# "button"を検索
npx shadcn@latest search button

# 検索結果を制限
npx shadcn@latest search button --limit 5

# オフセットを指定
npx shadcn@latest search button --offset 10
```

### オプション

#### -l, --limit
検索結果の最大数を指定します。

```bash
npx shadcn@latest search button --limit 10
```

#### -o, --offset
検索結果のオフセットを指定します。

```bash
npx shadcn@latest search button --offset 5
```

## list

`list`コマンドを使用して、レジストリ内のすべてのアイテムを一覧表示します。

### 使用方法

```bash
npx shadcn@latest list
```

### 例

```bash
# すべてのアイテムを一覧表示
npx shadcn@latest list

# 特定のレジストリのアイテムを一覧表示
npx shadcn@latest list --registry acme
```

### オプション

#### -r, --registry
レジストリ名を指定します。

```bash
npx shadcn@latest list --registry acme
```

## diff

`diff`コマンドを使用して、ローカルコンポーネントとレジストリの差分を確認します。

### 使用方法

```bash
npx shadcn@latest diff [component]
```

### 例

```bash
# 単一のコンポーネントの差分を確認
npx shadcn@latest diff button

# すべてのコンポーネントの差分を確認
npx shadcn@latest diff
```

## update

`update`コマンドを使用して、コンポーネントを最新バージョンに更新します。

### 使用方法

```bash
npx shadcn@latest update [component]
```

### 例

```bash
# 単一のコンポーネントを更新
npx shadcn@latest update button

# すべてのコンポーネントを更新
npx shadcn@latest update --all
```

### オプション

#### -a, --all
すべてのコンポーネントを更新します。

```bash
npx shadcn@latest update --all
```

#### -y, --yes
確認プロンプトをスキップします。

```bash
npx shadcn@latest update button --yes
```

## グローバルオプション

すべてのコマンドで使用できるグローバルオプション：

### -h, --help
ヘルプメッセージを表示します。

```bash
npx shadcn@latest --help
npx shadcn@latest add --help
```

### -v, --version
CLIのバージョンを表示します。

```bash
npx shadcn@latest --version
```

## 使用例

### 新しいプロジェクトのセットアップ

```bash
# プロジェクトを初期化
npx shadcn@latest init

# コンポーネントを追加
npx shadcn@latest add button card dialog
```

### 既存プロジェクトへの追加

```bash
# 特定のコンポーネントを追加
npx shadcn@latest add button

# 既存ファイルを上書き
npx shadcn@latest add button --overwrite
```

### モノレポでの使用

```bash
# 特定のワークスペースで実行
cd apps/web
npx shadcn@latest init

# または、cwdオプションを使用
npx shadcn@latest init --cwd ./apps/web
```

### プライベートレジストリの使用

```bash
# 名前空間付きコンポーネントを追加
npx shadcn@latest add acme:button

# 名前空間付きコンポーネントを検索
npx shadcn@latest search acme:
```

## トラブルシューティング

### コマンドが見つからない
`npx`が正しくインストールされているか確認してください。Node.js 5.2.0以降が必要です。

### コンポーネントが見つからない
- レジストリURLが正しいか確認
- ネットワーク接続を確認
- `components.json`の設定を確認

### インストールエラー
- Node.jsのバージョンを確認（推奨：18.x以降）
- `package.json`が存在するか確認
- 書き込み権限を確認

## ベストプラクティス

1. **バージョン管理:** コンポーネントを追加した後、変更をコミット
2. **レビュー:** 新しいコンポーネントのコードをレビュー
3. **カスタマイズ:** プロジェクトのニーズに合わせてコンポーネントをカスタマイズ
4. **更新:** 定期的に`diff`コマンドで更新を確認
5. **ドキュメント:** カスタム変更を文書化

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。