# ストリーミング

## 概要

ストリーミングにより、開発者はデータが到着したときにユーザーにデータのチャンクを表示できるため、AI駆動アプリケーションの体感速度が向上します。Vercelは、AIプロバイダーからのレスポンスをストリーミングするために[Vercel AI SDK](https://sdk.vercel.ai/docs)を使用することを推奨しています。

## はじめに

### 前提条件

1. Vercel Functionのセットアップを理解する
2. ストリーミングの基本を理解する
3. Node.js 20以降を使用する
4. 最新のVercel CLIを使用する
5. OpenAI APIキーを`.env.local`にセットアップする

### インストール

```bash
pnpm i ai openai
```

### サンプルコード(Next.js /appルート)

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET() {
  const response = streamText({
    model: openai('gpt-4o-mini'),
    messages: [{ role: 'user', content: 'What is the capital of Australia?' }],
  });

  return response.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
```

## 関数の継続時間

より長いワークロードの場合、すべてのプランでより高いデフォルトの最大継続時間を提供する[fluid compute](/docs/fluid-compute)を検討してください。

## Pythonのストリーミング関数

Pythonランタイム関数もレスポンスをストリーミングできます。拡張された[ランタイムログ](/docs/functions/logs#runtime-logs)には、関数出力がリアルタイムで表示されます。

## その他のリソース

- [ストリーミングとは?](/docs/functions/streaming)
- [AI SDK](https://sdk.vercel.ai/docs/getting-started)
- [Vercel Functions](/docs/functions)
- [Fluid compute](/docs/fluid-compute)
