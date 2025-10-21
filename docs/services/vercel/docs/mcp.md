# モデルコンテキストプロトコル (MCP)

[モデルコンテキストプロトコル](https://modelcontextprotocol.io/)（MCP）は、大規模言語モデル（LLM）が外部のツールやデータソースと通信するための標準インターフェースです。開発者やツールプロバイダーは、一度の統合で任意のMCP互換システムと相互運用できます。

## 外部システムへのLLMの接続

LLMは、デフォルトでリアルタイムや外部データにアクセスできません。最新の金融データ、価格、ユーザー固有のデータなどの関連コンテキストを提供するには、開発者がLLMを外部システムに接続する必要があります。

各ツールやサービスには独自のAPI、スキーマ、認証があり、統合数が増えるにつれて、これらの違いを管理することは難しく、エラーが発生しやすくなります。

## MCPによるLLMの相互作用の標準化

MCPは、LLMがツールやデータソースと対話する方法を標準化します。開発者は、MCPとの単一の統合を実装し、任意の互換サービスとの通信を管理できます。

ツールとデータプロバイダーは、MCPインターフェースを一度だけ公開する必要があります。その後、任意のMCP対応アプリケーションからそのシステムにアクセスできます。

MCPは、USB-Cの標準のようなものです：さまざまなデバイス用の異なるコネクタを用意する代わりに、1つのポートで多くの種類の接続を処理できます。

## MCPの仕組み

MCPは、クライアント-サーバーアーキテクチャを使用します：

- **MCPクライアント**: AIアプリケーション（例：Claude Desktop、カスタムAIアプリ）
- **MCPサーバー**: データソースやツールへのアクセスを提供するサービス
- **MCPホスト**: クライアントとサーバー間の通信を管理

## 主な機能

### ツール

MCPサーバーは、LLMが実行できる関数を公開できます。例えば：

- データベースクエリの実行
- APIリクエストの送信
- ファイルシステムへのアクセス
- 計算の実行

### リソース

MCPサーバーは、LLMが読み取れるデータを提供できます：

- ファイルやドキュメント
- データベースレコード
- APIレスポンス
- リアルタイムデータストリーム

### プロンプト

MCPサーバーは、特定のタスク用に最適化されたプロンプトテンプレートを提供できます。

## MCPの使用

### Vercel MCPサーバー

Vercelは、公式のMCPサーバーを提供しており、以下の機能を含みます：

- Vercelドキュメントの検索
- プロジェクトと展開の管理
- 展開ログの分析

詳細は、[Vercel MCPガイド](/docs/mcp/vercel-mcp)を参照してください。

### カスタムMCPサーバーのデプロイ

Vercelにカスタム MCPサーバーをデプロイできます。詳細は、[MCP サーバーのデプロイガイド](/docs/mcp/deploy-mcp-servers-to-vercel)を参照してください。

## MCPクライアント

以下のAIクライアントがMCPをサポートしています：

- Claude Desktop
- Cline
- Zed
- その他のMCP互換アプリケーション

## MCPサーバーの構築

### 基本的な構造

MCPサーバーは、以下の要素で構成されます：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ツールを追加
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'my_tool',
        description: 'My custom tool',
        inputSchema: {
          type: 'object',
          properties: {
            param: { type: 'string' },
          },
        },
      },
    ],
  };
});

// サーバーを起動
const transport = new StdioServerTransport();
await server.connect(transport);
```

### ツールの実装

```typescript
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'my_tool') {
    const { param } = request.params.arguments;
    // ツールのロジックを実装
    return {
      content: [
        {
          type: 'text',
          text: `Result for ${param}`,
        },
      ],
    };
  }
  throw new Error('Unknown tool');
});
```

## ベストプラクティス

### セキュリティ

- MCPサーバーへのアクセスを適切に制限
- 機密データを適切に処理
- 入力を検証

### パフォーマンス

- レスポンスをキャッシュ
- 大きなデータセットをページネーション
- 非同期処理を使用

### エラーハンドリング

- 明確なエラーメッセージを提供
- 適切にフォールバック
- エラーをログに記録

## リソース

- [MCP仕様](https://modelcontextprotocol.io/specification)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Vercel MCP](/docs/mcp/vercel-mcp)
- [MCPサーバーのデプロイ](/docs/mcp/deploy-mcp-servers-to-vercel)

## 関連リンク

- [Vercel MCP サーバー](/docs/mcp/vercel-mcp)
- [MCP サーバーのデプロイ](/docs/mcp/deploy-mcp-servers-to-vercel)
- [Vercel Functions](/docs/functions)
