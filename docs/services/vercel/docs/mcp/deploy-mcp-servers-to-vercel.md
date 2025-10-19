# Vercelへのモデルコンテキストプロトコル（MCP）サーバーのデプロイ

Vercelの機能を活用して、[Vercel Functions](/docs/functions)、OAuth、[効率的なスケーリング](/docs/fluid-compute)を備えたAIアプリケーション用のMCPサーバーをデプロイします。

## すぐに始められます

### テンプレートをデプロイ

以下のテンプレートを使用して、すぐにMCPサーバーを開始できます：

- [Next.jsでChatGPTアプリ](https://vercel.com/templates/next.js/chatgpt-app-with-next-js)
- [x402 AIスターター](https://vercel.com/templates/next.js/x402-ai-starter)
- [Next.jsでのMCP](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

[すべてのテンプレートを表示](https://vercel.com/templates/)

## MCPサーバーを効率的にデプロイ

Vercelは、本番環境のMCPデプロイメントに以下の機能を提供します：

- **最適化されたコストとパフォーマンス**: [Vercel Functions](/docs/functions)と[Fluid compute](/docs/fluid-compute)
- **インスタントロールバック**: 問題が発生した場合、すぐに以前のバージョンに戻せます
- **デプロイメント保護**: [デプロイメント保護](/docs/deployment-protection)で安全性を確保
- **ファイアウォール**: [Vercelファイアウォール](/docs/vercel-firewall)でセキュリティを強化
- **ローリングリリース**: [ローリングリリース](/docs/rolling-releases)で段階的にデプロイ

## Vercelへのデプロイ

サイコロを振るツールを提供するMCPサーバーのAPI例：

### プロジェクトのセットアップ

```bash
mkdir mcp-dice-server
cd mcp-dice-server
pnpm init
```

### 依存関係のインストール

```bash
pnpm i @modelcontextprotocol/sdk next
```

### APIルートの作成

`app/api/mcp/route.ts` ファイルを作成：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const server = new Server(
  {
    name: 'dice-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツールリストハンドラー
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'roll_dice',
        description: 'Roll a dice with a specified number of sides',
        inputSchema: {
          type: 'object',
          properties: {
            sides: {
              type: 'number',
              description: 'Number of sides on the dice',
              default: 6,
            },
          },
        },
      },
    ],
  };
});

// ツール呼び出しハンドラー
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'roll_dice') {
    const sides = request.params.arguments?.sides || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    return {
      content: [
        {
          type: 'text',
          text: `Rolled a ${sides}-sided dice: ${result}`,
        },
      ],
    };
  }
  throw new Error('Unknown tool');
});

export async function POST(request: Request) {
  const transport = new SSEServerTransport('/api/mcp', request);
  await server.connect(transport);
  return transport.response;
}
```

### Vercelにデプロイ

```bash
vercel
```

## OAuthの有効化

MCPサーバーにOAuth認証を追加して、ユーザー固有のデータにアクセスできます。

### OAuth設定

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server(
  {
    name: 'oauth-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// OAuth設定を追加
server.setRequestHandler('oauth/authorize', async (request) => {
  // OAuth認証フローを実装
  return {
    authorization_url: 'https://example.com/oauth/authorize',
  };
});
```

## ストリーマブルHTTPトランスポート

MCPは、ストリーマブルHTTPトランスポートをサポートしており、リアルタイムの通信を可能にします：

```typescript
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

export async function POST(request: Request) {
  const transport = new SSEServerTransport('/api/mcp', request);
  await server.connect(transport);
  return transport.response;
}
```

## 環境変数の設定

Vercelダッシュボードで環境変数を設定します：

1. プロジェクトの設定に移動
2. 「Environment Variables」セクションを選択
3. 必要な変数を追加（例：APIキー、OAuth設定）

## 監視とデバッグ

### ログの確認

Vercelダッシュボードの「Logs」タブで、MCPサーバーのログを確認できます。

### パフォーマンスの監視

[観測性ダッシュボード](/docs/observability)を使用して、以下を監視します：

- リクエスト数
- レイテンシ
- エラー率
- リソース使用量

## ベストプラクティス

### エラーハンドリング

適切なエラーハンドリングを実装します：

```typescript
server.setRequestHandler('tools/call', async (request) => {
  try {
    // ツールロジック
    return { content: [{ type: 'text', text: 'Success' }] };
  } catch (error) {
    console.error('Tool execution error:', error);
    throw new Error(`Tool execution failed: ${error.message}`);
  }
});
```

### セキュリティ

- 入力を検証
- 機密データを適切に処理
- レート制限を実装

### パフォーマンス

- レスポンスをキャッシュ
- 非同期処理を使用
- 適切なタイムアウトを設定

## 例

### 天気MCPサーバー

```typescript
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_weather') {
    const { location } = request.params.arguments;
    // 実際の天気APIを呼び出す
    const weatherData = await fetchWeather(location);
    return {
      content: [
        {
          type: 'text',
          text: `Weather in ${location}: ${weatherData.condition}, ${weatherData.temperature}°F`,
        },
      ],
    };
  }
});
```

### データベースクエリMCPサーバー

```typescript
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'query_database') {
    const { query } = request.params.arguments;
    const results = await database.query(query);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results),
        },
      ],
    };
  }
});
```

## 関連リンク

- [モデルコンテキストプロトコル](/docs/mcp)
- [Vercel MCP](/docs/mcp/vercel-mcp)
- [Vercel Functions](/docs/functions)
- [デプロイメント](/docs/deployments)
