# Vercel MCPサーバーの使用

Vercel MCPは、[ベータ](/docs/release-phases#beta)版で[すべてのプラン](/docs/plans)で利用可能であり、[Vercelの公開ベータ契約](/docs/release-phases/public-beta-agreement)と[AIプロダクト利用規約](/legal/ai-product-terms)が適用されます。

[モデルコンテキストプロトコル（MCP）](https://modelcontextprotocol.io)を使用して、AIツールをVercelプロジェクトに接続します。

## Vercel MCPとは

Vercel MCPは、Vercelの公式MCPサーバーです。OAuthを備えたリモートMCPで、以下のURLで利用可能です：

```
https://mcp.vercel.com
```

以下のような機能を提供します：

- Vercelドキュメントの検索とナビゲーション
- プロジェクトと展開の管理
- 展開ログの分析

最新の[MCP認証](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)と[ストリーマブルHTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http)仕様を実装しています。

## 利用可能なツール

Vercelは、ドキュメント検索とプロジェクト管理のための包括的なツールセットを提供します。詳細は[ツールリファレンス](/docs/mcp/vercel-mcp/tools)を参照してください。

主なツールカテゴリ：

- **ドキュメンテーションツール**: Vercelドキュメントの検索
- **プロジェクト管理ツール**: プロジェクトと展開の管理
- **ログ分析ツール**: 展開ログの確認

## Vercel MCPへの接続

セキュアなアクセスのため、Vercel MCPはVercelによって審査・承認されたAIクライアントのみをサポートしています。

### サポートされているクライアント

現在、以下のクライアントがVercel MCPをサポートしています：

- **Claude Desktop**: AnthropicのClaudeデスクトップアプリケーション
- **その他の承認済みクライアント**: Vercelによって審査されたMCP互換クライアント

### Claude Desktopでの設定

1. Claude Desktopアプリケーションを開く
2. 設定 > MCPサーバーに移動
3. 「サーバーを追加」をクリック
4. サーバーURL を入力：`https://mcp.vercel.com`
5. OAuth認証フローを完了

## OAuth認証

Vercel MCPは、安全なアクセスのためにOAuth認証を使用します。

### 認証フロー

1. MCPクライアントがVercel MCPへの接続を開始
2. ユーザーがVercelアカウントでログイン
3. アクセス権限を承認
4. MCPクライアントがアクセストークンを受け取る

### 権限

Vercel MCPは、以下へのアクセスを要求します：

- Vercelプロジェクトの読み取り
- 展開情報の読み取り
- ログの読み取り
- ドキュメントの検索

## 使用例

### ドキュメントの検索

```
ユーザー: Vercelでカスタムドメインを設定する方法は？

AI (Vercel MCPを使用):
[search_documentation ツールを呼び出し]
Vercelでカスタムドメインを設定するには...
[ドキュメントからの詳細な手順]
```

### プロジェクトの管理

```
ユーザー: 私の最新のプロジェクトの展開状況を確認してください。

AI (Vercel MCPを使用):
[list_projects と get_deployments ツールを呼び出し]
プロジェクト "my-app" の最新展開:
- 状態: READY
- URL: my-app-xyz.vercel.app
- デプロイ時刻: 2025-10-20 10:30 UTC
```

### 展開ログの分析

```
ユーザー: 最新の展開でエラーはありましたか？

AI (Vercel MCPを使用):
[get_deployment_logs ツールを呼び出し]
最新の展開ログを確認しました。以下のエラーが見つかりました:
[エラーの詳細とスタックトレース]
```

## ベストプラクティス

### 効率的なクエリ

明確で具体的な質問をすることで、より良い結果が得られます：

```
良い例: "Next.js アプリケーションの環境変数の設定方法は？"
悪い例: "環境変数"
```

### プライバシー

Vercel MCPは、あなたのVercelアカウントデータにのみアクセスします。他のユーザーのデータにはアクセスできません。

### セキュリティ

- OAuth トークンを安全に保管
- 不要になったアクセス権限を取り消す
- 定期的にアクセス権限を確認

## トラブルシューティング

### 接続できない

**症状**: Vercel MCPに接続できない

**解決策**:
- インターネット接続を確認
- MCPクライアントが最新バージョンか確認
- Vercelアカウントにログインしているか確認

### 認証エラー

**症状**: OAuth認証が失敗する

**解決策**:
- ブラウザのキャッシュをクリア
- 別のブラウザで試す
- Vercelサポートに連絡

### ツールが動作しない

**症状**: 特定のツールが期待通りに動作しない

**解決策**:
- ツールの入力パラメータを確認
- [ツールリファレンス](/docs/mcp/vercel-mcp/tools)を参照
- Vercelサポートに連絡

## 制限事項

- Vercel MCPは、承認済みMCPクライアントでのみ動作します
- レート制限が適用される場合があります
- 一部の機能はベータ版です

## フィードバック

Vercel MCPに関するフィードバックや機能リクエストがある場合は、以下から連絡してください：

- [Vercelコミュニティ](https://vercel.com/community)
- [GitHubディスカッション](https://github.com/vercel/vercel/discussions)

## 関連リンク

- [ツールリファレンス](/docs/mcp/vercel-mcp/tools)
- [モデルコンテキストプロトコル](/docs/mcp)
- [MCPサーバーのデプロイ](/docs/mcp/deploy-mcp-servers-to-vercel)
- [MCP仕様](https://modelcontextprotocol.io)
