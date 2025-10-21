# vercel integration-resource

`vercel integration-resource` コマンドは、以下のアクションのいずれかと共に使用する必要があります：

- `vercel integration-resource remove`
- `vercel integration-resource disconnect`

以下のコマンドでは、`resource-name` には[URL スラッグ](/docs/integrations/create-integration#create-product-form-details)の値を使用します。

## vercel integration-resource remove

`vercel integration-resource remove` コマンドは、このリソースの製品を統合からアンインストールします。

```bash
vercel integration-resource remove [resource-name] (--disconnect-all)
```

`--disconnect-all` パラメータを含めると、接続されているすべてのプロジェクトが切断されます。

### 例

```bash
vercel integration-resource remove my-database
```

my-databaseリソースを削除します。

```bash
vercel integration-resource remove my-database --disconnect-all
```

my-databaseリソースを削除し、接続されているすべてのプロジェクトを切断します。

## vercel integration-resource disconnect

`vercel integration-resource disconnect` コマンドは、現在関連付けられているプロジェクトから製品のリソースを切断します。

```bash
vercel integration-resource disconnect [resource-name] (--all)
```

`--all` パラメータを含めると、すべての接続されているプロジェクトが切断されます。

特定のプロジェクトから切断する場合：

```bash
vercel integration-resource disconnect [resource-name] [project-name]
```

ここで `project-name` はプロジェクトの URL スラッグです。

### 例

```bash
vercel integration-resource disconnect my-database
```

現在のプロジェクトからmy-databaseリソースを切断します。

```bash
vercel integration-resource disconnect my-database --all
```

すべてのプロジェクトからmy-databaseリソースを切断します。

```bash
vercel integration-resource disconnect my-database my-project
```

my-projectからmy-databaseリソースを切断します。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を `vercel integration-resource` コマンドで使用できます。
