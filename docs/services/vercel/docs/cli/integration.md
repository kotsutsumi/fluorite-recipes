# vercel integration

`vercel integration` コマンドは、以下のアクションのいずれかと共に使用する必要があります：

- `vercel integration add`
- `vercel integration open`
- `vercel integration list`
- `vercel integration remove`

以下のコマンドでは、[URL スラグ](/docs/integrations/create-integration/submit-integration#url-slug)の値を統合名として使用します。

## vercel integration add

`vercel integration add` コマンドは、統合リソースを作成するセットアップウィザードを初期化します。このコマンドは、インストールされた統合から新しいリソースを追加する際に使用します。この機能は `vercel install [integration-name]` と同じです。

統合のリソースをインストールしていない、またはWeb UIで統合の利用規約に同意していない場合、このコマンドはブラウザでVercelダッシュボードを開き、その統合のインストールフローを開始します。

```bash
vercel integration add [integration-name]
```

## vercel integration open

`vercel integration open` コマンドは、特定の統合のプロバイダーダッシュボードへのディープリンクを開きます。開発環境からプロバイダーのリソースに素早くアクセスする際に便利です。

```bash
vercel integration open [integration-name]
```

## vercel integration list

`vercel integration list` コマンドは、現在のチームまたはプロジェクトにインストールされているすべてのリソースとその関連する統合のリストを表示します。開発環境で設定されている統合の概要を把握するのに便利です。

```bash
vercel integration list
```

出力には、各統合の以下の情報が表示されます：

- 統合名
- リソース名
- インストール日
- 接続されているプロジェクト

## vercel integration remove

`vercel integration remove` コマンドは、統合を削除します。

```bash
vercel integration remove [integration-name]
```

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel integration`コマンドで使用できます。
