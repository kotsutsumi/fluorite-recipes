# Mastra

[Mastra](https://mastra.ai) は、[Vercel AI SDK](/docs/ai-sdk) を活用した最新の JavaScript スタックで AI 機能を構築およびデプロイするためのフレームワークです。AI Gateway との統合により、統一されたモデル管理とルーティング機能を提供します。

## はじめに

### 1. Mastra プロジェクトの作成

最初に、CLI を使用して新しい Mastra プロジェクトを作成します：

```bash
pnpm dlx create-mastra@latest
```

セットアップ中に、プロジェクト名、デフォルトプロバイダーなどを選択するよう求められます。デフォルト設定を使用しても構いません。

### 2. 依存関係のインストール

AI Gateway プロバイダーを使用するには、以下のパッケージをインストールします：

```bash
pnpm i @ai-sdk/gateway mastra @mastra/core @mastra/memory
```

### 3. 環境変数の設定

`.env` ファイルを作成または更新し、[Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key)を追加します：

```env
AI_GATEWAY_API_KEY=your-api-key-here
```

### 4. エージェントの AI Gateway 設定

`@ai-sdk/openai` パッケージを `@ai-sdk/gateway` パッケージに置き換えます。

エージェント設定ファイル（通常 `src/mastra/agents/weather-agent.ts`）を以下のように更新します：

```typescript
import 'dotenv/config';
import { gateway } from '@ai-sdk/gateway';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

const memory = new Memory({
  provider: 'in-memory',
});

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: 'You are a helpful weather assistant.',
  model: gateway('anthropic/claude-sonnet-4'),
  memory,
});
```

## エージェントの使用

エージェントを使用してメッセージを生成します：

```typescript
import { weatherAgent } from './agents/weather-agent';

async function main() {
  const result = await weatherAgent.generate({
    messages: [
      {
        role: 'user',
        content: 'What is the weather like today?',
      },
    ],
  });

  console.log(result.text);
}

main();
```

## ツールの追加

Mastra エージェントにツールを追加できます：

```typescript
import 'dotenv/config';
import { gateway } from '@ai-sdk/gateway';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { z } from 'zod';

const memory = new Memory({
  provider: 'in-memory',
});

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: 'You are a helpful weather assistant.',
  model: gateway('anthropic/claude-sonnet-4'),
  memory,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for'),
      }),
      execute: async ({ location }) => {
        // 実際の天気APIを呼び出す
        return { temperature: 72, condition: 'sunny', location };
      },
    },
  },
});
```

## ストリーミング

Mastra でストリーミングレスポンスを使用するには：

```typescript
import { weatherAgent } from './agents/weather-agent';

async function main() {
  const result = await weatherAgent.stream({
    messages: [
      {
        role: 'user',
        content: 'Tell me a story about the weather.',
      },
    ],
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
}

main();
```

## モデルの切り替え

AI Gateway を使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます：

```typescript
import { gateway } from '@ai-sdk/gateway';

// Anthropic Claude を使用
const agent1 = new Agent({
  name: 'Claude Agent',
  model: gateway('anthropic/claude-sonnet-4'),
});

// OpenAI GPT に切り替え
const agent2 = new Agent({
  name: 'GPT Agent',
  model: gateway('openai/gpt-5'),
});
```

## プロバイダオプションの使用

AI Gateway の[プロバイダオプション](/docs/ai-gateway/provider-options)を使用できます：

```typescript
const result = await weatherAgent.generate({
  messages: [
    {
      role: 'user',
      content: 'Hello!',
    },
  ],
  providerOptions: {
    gateway: {
      order: ['bedrock', 'anthropic'],
    },
  },
});
```

## ベストプラクティス

### メモリの使用

会話履歴を保持するために、メモリを使用します：

```typescript
const memory = new Memory({
  provider: 'in-memory',
});

const agent = new Agent({
  name: 'Conversational Agent',
  model: gateway('anthropic/claude-sonnet-4'),
  memory,
});
```

### エラーハンドリング

```typescript
try {
  const result = await agent.generate({
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  console.log(result.text);
} catch (error) {
  console.error('Error:', error);
  // フォールバックロジックまたはエラー処理
}
```

### 観測性の活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

## 関連リンク

- [Mastra ドキュメント](https://mastra.ai/docs)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
