# ツール

Vercel MCP サーバーは、以下の [MCP ツール](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) を提供します。セキュリティを強化するため、ツール実行時に人間の確認を有効にし、プロンプトインジェクション攻撃を防ぐために、他のサーバーと併用する際は注意してください。

## ドキュメンテーションツール

| 名前 | 説明 | パラメータ | サンプルプロンプト |
|------|------|------------|-------------------|
| `search_documentation` | Vercelドキュメントで特定のトピックや情報を検索 | `topic` (文字列、必須): 検索対象のトピック（例：'routing'、'data-fetching'）<br>`tokens` (数値、オプション、デフォルト: 2500): 結果に含める最大トークン数 | "Vercelでカスタムドメインを設定する方法は？" |

### 使用例

```
ユーザー: Next.jsアプリケーションでAPI Routesを作成する方法は？

AI: search_documentation ツールを使用して検索します...
[ツール呼び出し: search_documentation(topic="API Routes")]

検索結果に基づいて:
Next.jsでAPI Routesを作成するには、`pages/api` または `app/api` ディレクトリにファイルを作成します...
```

## プロジェクト管理ツール

| 名前 | 説明 | パラメータ | サンプルプロンプト |
|------|------|------------|-------------------|
| `list_teams` | 認証されたユーザーが所属するすべての[チーム](/docs/accounts)をリスト | なし | "私が所属しているすべてのチームを表示" |
| `list_projects` | ユーザーに関連するすべてのVercel[プロジェクト](/docs/projects)をリスト | `teamId` (文字列、必須): プロジェクトをリストするチームID | "個人アカウントのすべてのプロジェクトを表示" |
| `get_project` | プロジェクトの詳細情報を取得 | `projectId` (文字列、必須): プロジェクトID<br>`teamId` (文字列、オプション): チームID | "my-app プロジェクトの詳細を表示" |
| `list_deployments` | プロジェクトの展開をリスト | `projectId` (文字列、必須): プロジェクトID<br>`teamId` (文字列、オプション): チームID<br>`limit` (数値、オプション、デフォルト: 20): 取得する展開数 | "my-app の最新の展開を表示" |
| `get_deployment` | 特定の展開の詳細を取得 | `deploymentId` (文字列、必須): 展開ID<br>`teamId` (文字列、オプション): チームID | "展開 xyz の詳細を表示" |

### 使用例

#### チームのリスト

```
ユーザー: 私が所属しているチームをすべて表示してください。

AI: list_teams ツールを使用します...
[ツール呼び出し: list_teams()]

あなたは以下のチームに所属しています:
1. Personal Account (ID: personal-123)
2. Acme Corporation (ID: team-456)
3. Startup Inc (ID: team-789)
```

#### プロジェクトのリスト

```
ユーザー: Acme Corporationチームのプロジェクトをすべて表示してください。

AI: list_projects ツールを使用します...
[ツール呼び出し: list_projects(teamId="team-456")]

Acme Corporationチームのプロジェクト:
1. acme-website (ID: prj-abc)
2. acme-blog (ID: prj-def)
3. acme-api (ID: prj-ghi)
```

#### 展開のリスト

```
ユーザー: acme-website の最新の展開を確認してください。

AI: list_deployments ツールを使用します...
[ツール呼び出し: list_deployments(projectId="prj-abc", limit=5)]

acme-website の最新の展開:
1. dpl-xyz123 - READY - 2025-10-20 10:30 UTC
2. dpl-xyz122 - READY - 2025-10-19 15:20 UTC
3. dpl-xyz121 - ERROR - 2025-10-19 14:45 UTC
```

## ログ分析ツール

| 名前 | 説明 | パラメータ | サンプルプロンプト |
|------|------|------------|-------------------|
| `get_deployment_logs` | 展開のログを取得 | `deploymentId` (文字列、必須): 展開ID<br>`teamId` (文字列、オプション): チームID<br>`limit` (数値、オプション、デフォルト: 100): 取得するログエントリ数 | "最新の展開のログを表示" |

### 使用例

```
ユーザー: 最新の展開でエラーが発生しましたか？

AI: まず展開をリストし、その後ログを確認します...
[ツール呼び出し: list_deployments(projectId="prj-abc", limit=1)]
[ツール呼び出し: get_deployment_logs(deploymentId="dpl-xyz123")]

最新の展開 dpl-xyz123 のログを確認しました。
以下のエラーが見つかりました:

[ERROR] Build failed: Module not found: 'react-dom'
  at line 23 in src/app/page.tsx

このエラーは、react-dom パッケージが見つからないことを示しています。
package.json に react-dom を追加する必要があります。
```

## ツールの組み合わせ

複数のツールを組み合わせて、より複雑なタスクを実行できます：

### 例：プロジェクトの完全な状態確認

```
ユーザー: my-app プロジェクトの現在の状態を完全に確認してください。

AI: 複数のツールを使用して包括的な情報を取得します...

[ツール呼び出し: get_project(projectId="prj-abc")]
プロジェクト情報:
- 名前: my-app
- フレームワーク: Next.js
- ドメイン: my-app.vercel.app

[ツール呼び出し: list_deployments(projectId="prj-abc", limit=3)]
最近の展開:
1. dpl-xyz123 - READY - 2025-10-20 10:30 UTC
2. dpl-xyz122 - READY - 2025-10-19 15:20 UTC
3. dpl-xyz121 - ERROR - 2025-10-19 14:45 UTC

[ツール呼び出し: get_deployment_logs(deploymentId="dpl-xyz123")]
最新の展開のログ:
[ログの詳細...]

プロジェクトは正常に動作しています。最新の展開は成功し、エラーは検出されませんでした。
```

## セキュリティの考慮事項

### 人間の確認

重要な操作（展開の削除、設定の変更など）については、ツール実行前に人間の確認を求めることをお勧めします。

### アクセス権限

各ツールは、ユーザーのVercelアカウントの権限に基づいてアクセスを制限します。ユーザーがアクセス権を持たないプロジェクトやチームには、ツールはアクセスできません。

### レート制限

Vercel MCPツールには、レート制限が適用される場合があります。大量のリクエストを行う場合は、適切な間隔を空けてください。

## ベストプラクティス

### 効率的なツール使用

1. **必要最小限のデータを取得**: `limit` パラメータを使用して、必要な量のデータのみを取得
2. **キャッシュを活用**: 同じデータを何度も取得しない
3. **エラーハンドリング**: ツールが失敗した場合の適切な処理

### プロンプトの最適化

明確で具体的なプロンプトを使用することで、AIがツールを適切に選択できます：

```
良い例: "my-app プロジェクトの本番環境の最新3つの展開を表示してください"
悪い例: "展開"
```

## トラブルシューティング

### ツールが見つからない

**症状**: 特定のツールが利用できない

**解決策**:
- Vercel MCPが最新バージョンか確認
- 適切な権限があるか確認
- MCPクライアントを再起動

### パラメータエラー

**症状**: ツール呼び出しでパラメータエラーが発生

**解決策**:
- 必須パラメータがすべて提供されているか確認
- パラメータの型が正しいか確認
- このドキュメントのツール仕様を確認

## 関連リンク

- [Vercel MCP](/docs/mcp/vercel-mcp)
- [モデルコンテキストプロトコル](/docs/mcp)
- [MCP仕様 - ツール](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
