# LangFuse

[LangFuse](https://langfuse.com/) は、チームが AI アプリケーションを共同で開発、監視、評価、デバッグするのを支援する LLM エンジニアリングプラットフォームです。このガイドでは、[Vercel AI Gateway](/docs/ai-gateway) と LangFuse を統合して、さまざまな AI モデルとプロバイダにアクセスする方法を説明します。

## はじめに

### 新しいプロジェクトの作成

まず、プロジェクト用の新しいディレクトリを作成し、初期化します：

```bash
mkdir langfuse-ai-gateway
cd langfuse-ai-gateway
pnpm dlx init -y
```

### 依存関係のインストール

必要な LangFuse パッケージと `dotenv`、`@types/node` パッケージをインストールします：

```bash
pnpm i langfuse openai dotenv @types/node
```

### 環境変数の設定

`.env` ファイルに [Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key) と LangFuse API キーを追加します：

```env
AI_GATEWAY_API_KEY=your-api-key-here

LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

[Vercel デプロイメント内から AI Gateway を使用](/docs/ai-gateway#using-the-ai-gateway-with-a-vercel-oidc-token)する場合は、`VERCEL_OIDC_TOKEN` 環境変数も使用できます。

### LangFuse アプリケーションの作成

`index.ts` という新しいファイルを作成し、以下のコードを追加します：

```typescript
import 'dotenv/config';
import { Langfuse } from 'langfuse';
import OpenAI from 'openai';

async function main() {
  const langfuse = new Langfuse();

  const openai = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  });

  const trace = langfuse.trace({
    name: 'ai-gateway-demo',
  });

  const generation = trace.generation({
    name: 'chat-completion',
    model: 'anthropic/claude-sonnet-4',
    input: [{ role: 'user', content: 'What is the capital of France?' }],
  });

  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'What is the capital of France?',
      },
    ],
  });

  generation.end({
    output: response.choices[0].message.content,
  });

  await langfuse.flushAsync();

  console.log(response.choices[0].message.content);
}

main();
```

### アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
npx tsx index.ts
```

## ストリーミング

LangFuse でストリーミングレスポンスをトレースするには：

```typescript
import 'dotenv/config';
import { Langfuse } from 'langfuse';
import OpenAI from 'openai';

async function main() {
  const langfuse = new Langfuse();
  const openai = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  });

  const trace = langfuse.trace({
    name: 'streaming-demo',
  });

  const generation = trace.generation({
    name: 'streaming-chat',
    model: 'anthropic/claude-sonnet-4',
    input: [{ role: 'user', content: 'Tell me a story.' }],
  });

  const stream = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'Tell me a story.',
      },
    ],
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    process.stdout.write(content);
  }

  generation.end({
    output: fullResponse,
  });

  await langfuse.flushAsync();
}

main();
```

## 複数の生成をトレース

LangFuse を使用して、複数の AI リクエストを1つのトレースにまとめることができます：

```typescript
import 'dotenv/config';
import { Langfuse } from 'langfuse';
import OpenAI from 'openai';

async function main() {
  const langfuse = new Langfuse();
  const openai = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  });

  const trace = langfuse.trace({
    name: 'multi-step-agent',
  });

  // ステップ1: トピックを生成
  const generation1 = trace.generation({
    name: 'generate-topic',
    model: 'anthropic/claude-sonnet-4',
  });

  const response1 = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'Generate a random interesting topic.',
      },
    ],
  });

  const topic = response1.choices[0].message.content;
  generation1.end({ output: topic });

  // ステップ2: トピックについての質問を生成
  const generation2 = trace.generation({
    name: 'generate-question',
    model: 'anthropic/claude-sonnet-4',
  });

  const response2 = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: `Generate an interesting question about: ${topic}`,
      },
    ],
  });

  generation2.end({ output: response2.choices[0].message.content });

  await langfuse.flushAsync();

  console.log('Topic:', topic);
  console.log('Question:', response2.choices[0].message.content);
}

main();
```

## ユーザーフィードバックの記録

LangFuse を使用して、ユーザーフィードバックを記録できます：

```typescript
import 'dotenv/config';
import { Langfuse } from 'langfuse';
import OpenAI from 'openai';

async function main() {
  const langfuse = new Langfuse();
  const openai = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  });

  const trace = langfuse.trace({
    name: 'user-feedback-demo',
    userId: 'user-123',
  });

  const generation = trace.generation({
    name: 'chat-completion',
    model: 'anthropic/claude-sonnet-4',
  });

  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'What is the capital of France?',
      },
    ],
  });

  generation.end({ output: response.choices[0].message.content });

  // ユーザーフィードバックを記録
  trace.score({
    name: 'user-feedback',
    value: 1, // 1 = positive, 0 = negative
    comment: 'Accurate and helpful response',
  });

  await langfuse.flushAsync();

  console.log(response.choices[0].message.content);
}

main();
```

## モデルの切り替え

AI Gateway を使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます：

```typescript
// Anthropic Claude を使用
const response1 = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// OpenAI GPT に切り替え
const response2 = await openai.chat.completions.create({
  model: 'openai/gpt-5',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## ベストプラクティス

### トレースの整理

意味のある名前を使用して、トレースを整理します：

```typescript
const trace = langfuse.trace({
  name: 'customer-support-chat',
  userId: 'user-123',
  sessionId: 'session-456',
  metadata: {
    environment: 'production',
    feature: 'chat',
  },
});
```

### エラーハンドリング

エラーを LangFuse に記録します：

```typescript
try {
  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  generation.end({ output: response.choices[0].message.content });
} catch (error) {
  generation.end({
    output: null,
    statusMessage: error.message,
  });
  throw error;
} finally {
  await langfuse.flushAsync();
}
```

### 観測性の活用

LangFuse ダッシュボードと AI Gateway の[観測性機能](/docs/ai-gateway/observability)の両方を使用して、包括的な監視を実現します。

## 関連リンク

- [LangFuse ドキュメント](https://langfuse.com/docs)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
