# LangChain

[LangChain](https://js.langchain.com) は、エージェント開発ライフサイクルの各ステップのためのツールを提供します。このガイドでは、[Vercel AI Gateway](/docs/ai-gateway) と LangChain を統合して、さまざまな AI モデルとプロバイダにアクセスする方法を説明します。

## はじめに

### 新しいプロジェクトの作成

まず、プロジェクト用の新しいディレクトリを作成し、初期化します：

```bash
mkdir langchain-ai-gateway
cd langchain-ai-gateway
pnpm dlx init -y
```

### 依存関係のインストール

必要な LangChain パッケージと `dotenv`、`@types/node` パッケージをインストールします：

```bash
pnpm i langchain @langchain/core @langchain/openai dotenv @types/node
```

### 環境変数の設定

[Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key)を使用して `.env` ファイルを作成します：

```env
AI_GATEWAY_API_KEY=your-api-key-here
```

[Vercel デプロイメント内から AI Gateway を使用](/docs/ai-gateway#using-the-ai-gateway-with-a-vercel-oidc-token)する場合は、`VERCEL_OIDC_TOKEN` 環境変数も使用できます。

### LangChain アプリケーションの作成

`index.ts` という新しいファイルを作成し、以下のコードを追加します：

```typescript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

async function main() {
  const model = new ChatOpenAI({
    model: 'anthropic/claude-sonnet-4',
    temperature: 0.7,
    configuration: {
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      apiKey: process.env.AI_GATEWAY_API_KEY,
    },
  });

  const response = await model.invoke([
    new HumanMessage('What is the capital of France?'),
  ]);

  console.log(response.content);
}

main();
```

### アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
npx tsx index.ts
```

## ストリーミング

LangChain でストリーミングレスポンスを使用するには：

```typescript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

async function main() {
  const model = new ChatOpenAI({
    model: 'anthropic/claude-sonnet-4',
    configuration: {
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      apiKey: process.env.AI_GATEWAY_API_KEY,
    },
    streaming: true,
  });

  const stream = await model.stream([
    new HumanMessage('Tell me a long story about AI.'),
  ]);

  for await (const chunk of stream) {
    process.stdout.write(chunk.content.toString());
  }
}

main();
```

## 会話チェーン

LangChain の会話チェーンを使用して、コンテキストを保持した会話を構築できます：

```typescript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

async function main() {
  const model = new ChatOpenAI({
    model: 'anthropic/claude-sonnet-4',
    configuration: {
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      apiKey: process.env.AI_GATEWAY_API_KEY,
    },
  });

  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory });

  const response1 = await chain.call({ input: 'Hi, my name is John.' });
  console.log(response1.response);

  const response2 = await chain.call({ input: 'What is my name?' });
  console.log(response2.response);
}

main();
```

## ツールの使用

LangChain でツールを使用して、AI エージェントを構築できます：

```typescript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { DynamicTool } from '@langchain/core/tools';
import { ChatPromptTemplate } from '@langchain/core/prompts';

async function main() {
  const model = new ChatOpenAI({
    model: 'anthropic/claude-sonnet-4',
    configuration: {
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      apiKey: process.env.AI_GATEWAY_API_KEY,
    },
  });

  const weatherTool = new DynamicTool({
    name: 'get_weather',
    description: 'Get the weather for a location',
    func: async (location: string) => {
      // 実際の天気APIを呼び出す
      return `The weather in ${location} is sunny and 72°F`;
    },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful assistant.'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = await createToolCallingAgent({
    llm: model,
    tools: [weatherTool],
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools: [weatherTool],
  });

  const result = await executor.invoke({
    input: 'What is the weather in San Francisco?',
  });

  console.log(result.output);
}

main();
```

## モデルの切り替え

AI Gateway を使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます：

```typescript
// Anthropic Claude を使用
const model1 = new ChatOpenAI({
  model: 'anthropic/claude-sonnet-4',
  configuration: {
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_API_KEY,
  },
});

// OpenAI GPT に切り替え
const model2 = new ChatOpenAI({
  model: 'openai/gpt-5',
  configuration: {
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_API_KEY,
  },
});
```

## プロバイダオプション

AI Gateway の[プロバイダオプション](/docs/ai-gateway/provider-options)を使用するには、カスタムヘッダーを追加します：

```typescript
const model = new ChatOpenAI({
  model: 'anthropic/claude-sonnet-4',
  configuration: {
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_API_KEY,
    defaultHeaders: {
      'x-gateway-order': 'bedrock,anthropic',
    },
  },
});
```

## ベストプラクティス

### エラーハンドリング

```typescript
try {
  const response = await model.invoke([
    new HumanMessage('What is the capital of France?'),
  ]);
  console.log(response.content);
} catch (error) {
  console.error('Error:', error);
  // フォールバックロジックまたはエラー処理
}
```

### 環境変数の使用

API キーをコードに直接埋め込まず、環境変数を使用します：

```typescript
const model = new ChatOpenAI({
  model: 'anthropic/claude-sonnet-4',
  configuration: {
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: process.env.AI_GATEWAY_API_KEY,
  },
});
```

### 観測性の活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

## 関連リンク

- [LangChain ドキュメント](https://js.langchain.com)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
