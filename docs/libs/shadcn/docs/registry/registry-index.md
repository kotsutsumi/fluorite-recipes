# インデックス

## オープンソースレジストリインデックス

オープンソースレジストリインデックスは、すぐに使用できるオープンソースレジストリのリストです。

`shadcn add` または `shadcn search` を実行すると、CLIは自動的にレジストリインデックスで目的のレジストリを検索し、`components.json` ファイルに追加します。

完全なリストは [https://ui.shadcn.com/r/registries.json](https://ui.shadcn.com/r/registries.json) で確認できます。

## レジストリの追加

レジストリをインデックスに追加するには、[registries.json](https://github.com/shadcn-ui/ui/blob/main/apps/v4/public/r/registries.json) ファイルにPRを送信できます。

レジストリをインデックスに追加する例：

```json
{
   "@acme": "https://registry.acme.com/r/{name}.json",
   "@example": "https://example.com/r/{name}"
}
```

## 要件

レジストリをインデックスに追加するには、以下の要件を満たす必要があります：

### 1. オープンソースであること

レジストリはオープンソースで、公開されている必要があります。

### 2. スキーマ準拠

レジストリは[レジストリスキーマ仕様](/docs/registry/registry-json)に準拠した有効なJSONファイルである必要があります。

### 3. フラットな構造

レジストリはフラットなレジストリで、入れ子になった項目がないこと（`/registry.json` と `/component-name.json` ファイルがレジストリのルートに存在する必要があります）。

### 4. コンテンツの制限

`files` 配列（存在する場合）には `content` プロパティを含めてはいけません。

## 検証

レジストリを追加する前に、以下のコマンドで検証できます：

```bash
pnpm dlx shadcn@latest add @your-namespace/component-name
```

## 例

インデックスに登録されたレジストリの例：

```json
{
  "@shadcn": "https://ui.shadcn.com/r/{name}.json",
  "@v0": "https://v0.dev/chat/b/{name}",
  "@acme": "https://registry.acme.com/{name}.json"
}
```

## メリット

レジストリをインデックスに追加すると：

1. **発見性の向上**: ユーザーが簡単に見つけられる
2. **自動設定**: CLIが自動的に設定を追加
3. **コミュニティの成長**: オープンソースコミュニティに貢献

## サポート

質問や問題がある場合は、[GitHub Issues](https://github.com/shadcn-ui/ui/issues)で報告してください。
