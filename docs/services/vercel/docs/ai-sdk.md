# AI SDK

[AI SDK](https://sdk.vercel.ai) は、[Next.js](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)、[Vue](https://sdk.vercel.ai/docs/getting-started/nuxt)、[Svelte](https://sdk.vercel.ai/docs/getting-started/svelte)、[Node.js](https://sdk.vercel.ai/docs/getting-started/nodejs) などで AI 対応アプリケーションを構築するための TypeScript ツールキットです。LLM をアプリケーションに統合することは複雑で、使用するモデルプロバイダに大きく依存します。

AI SDK は、モデルプロバイダ間の違いを抽象化し、チャットボット構築のための定型コードを排除し、テキスト出力を超えて豊かでインタラクティブなコンポーネントを生成することを可能にします。

## テキスト生成

AI SDK のコアは [AI SDK Core](https://sdk.vercel.ai/docs/ai-sdk-core/overview) で、任意の LLM を呼び出すための統一された API を提供します。

OpenAI の GPT-5 を使用してテキストを生成する例：

```typescript
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: '量子もつれの概念を説明してください。',
});
```

プロバイダを簡単に切り替えられます。例えば、Anthropic の Claude Sonnet 3.7 を使用する場合：

```typescript
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const { text } = await generateText({
  model: anthropic('claude-3-7-sonnet-20250219'),
  prompt: '量子もつれの概念を説明してください。',
});
```

## ストリーミング

AI SDK は、テキストをチャンク単位でストリーミングし、より応答性の高いユーザーエクスペリエンスを実現します。

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt: '量子もつれの概念を説明してください。',
});

for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

## 構造化データの生成

AI SDK を使用すると、LLM から JSON などの構造化データを生成できます。これは、フォームの自動入力、データ抽出、構造化された出力が必要なその他のタスクに役立ちます。

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'チョコレートチップクッキーのレシピを生成してください。',
});
```

## UI の生成

AI SDK UI は、React、Next.js、Vue、Svelte で AI チャットボットとジェネレーティブユーザーインターフェースを構築するためのフレームワーク固有のフックを提供します。

```typescript
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? 'ユーザー: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">送信</button>
      </form>
    </>
  );
}
```

## AI エージェント

AI SDK は、ツールを使用して複雑なタスクを実行できる AI エージェントの構築をサポートしています。

```typescript
import { generateText, tool } from 'ai';
import { z } from 'zod';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  tools: {
    weather: tool({
      description: '場所の天気を取得します',
      parameters: z.object({ location: z.string() }),
      execute: async ({ location }) => {
        // 天気 API を呼び出す
        return { temperature: 72, condition: '晴れ' };
      },
    }),
  },
  prompt: 'サンフランシスコの天気はどうですか？',
});
```

## 詳細情報

詳細については、[AI SDK ドキュメント](https://sdk.vercel.ai)をご覧ください。
