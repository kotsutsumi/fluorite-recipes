# Vercel & OpenAI 統合

Vercel は [OpenAI](https://platform.openai.com/overview) と統合し、開発者が高速で拡張性が高く、安全な [AI アプリケーション](https://vercel.com/ai)を構築できるようにします。

以下を含む、[任意の OpenAI モデル](https://platform.openai.com/docs/models/overview)を [AI SDK](https://sdk.vercel.ai) で統合できます：

- **GPT-4o**: 自然言語またはコードを理解し、生成
- **GPT-4.5**: 感情知性が強化された最新の言語モデル
- **o3-mini**: コード生成と複雑なタスクに特化した推論モデル
- **DALL·E 3**: 自然言語から画像を生成および編集
- **埋め込み**: 用語をベクトルに変換

## はじめに

OpenAI と Vercel を統合するための[さまざまな AIテンプレート](https://vercel.com/templates/ai)を用意しています。

### OpenAI API キーの取得

開始する前に、[OpenAI アカウント](https://platform.openai.com/signup)を作成してください。

1. **API キーへのナビゲート**: [OpenAI ダッシュボード](https://platform.openai.com/)にログインし、[API キー](https://platform.openai.com/account/api-keys)を表示します。

2. **API キーの生成**: 「新しい秘密鍵を作成」をクリックし、生成された API キーを安全にコピーします。

3. **環境変数の設定**: プロジェクトに `OPENAI_API_KEY` 環境変数を追加します：

```env
OPENAI_API_KEY=sk-proj-...
```

## 使用例

### 基本的なチャット

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  return Response.json({ text: result.text });
}
```

### ストリーミング

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 画像生成

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.images.generate({
  model: 'dall-e-3',
  prompt: '美しい夕焼けの風景',
  n: 1,
  size: '1024x1024',
});

const imageUrl = response.data[0].url;
```

### 埋め込み

```typescript
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'Hello, world!',
});
```

### ビジョン

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-4o'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'この画像の説明をしてください' },
        {
          type: 'image',
          image: 'https://example.com/image.jpg',
        },
      ],
    },
  ],
});
```

### ツールコール

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const result = await generateText({
  model: openai('gpt-4o'),
  tools: {
    weather: tool({
      description: '場所の天気を取得',
      parameters: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        return { temperature: 72, condition: '晴れ' };
      },
    }),
  },
  prompt: 'サンフランシスコの天気は？',
});
```

### 推論モデル (o3-mini)

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('o3-mini'),
  prompt: '複雑な数学問題を解いてください',
});
```

## モデルの選択

### GPT-4o
- 最もパフォーマンスの高いマルチモーダルモデル
- テキスト、画像、音声を理解

### GPT-4.5
- 感情知性が強化
- より自然な会話

### o3-mini
- 複雑な推論タスクに特化
- コーディングと数学に優れる

### DALL·E 3
- 高品質な画像生成
- テキストプロンプトから画像を作成

## 料金

OpenAIの料金は、使用したトークン数に基づきます。各モデルには異なる料金設定があります。

詳細は、[OpenAI料金ページ](https://openai.com/pricing)を参照してください。

## ベストプラクティス

### エラーハンドリング

```typescript
try {
  const result = await generateText({
    model: openai('gpt-4o'),
    prompt: 'Hello!',
  });
  return Response.json({ text: result.text });
} catch (error) {
  console.error('OpenAI error:', error);
  return Response.json({ error: 'Failed to generate text' }, { status: 500 });
}
```

### レート制限

OpenAIにはレート制限があります。リクエストの頻度を管理し、必要に応じてリトライロジックを実装してください。

### コスト最適化

- 適切なモデルを選択してコストを削減
- プロンプトを最適化してトークン使用量を削減
- キャッシングを活用

## 関連リンク

- [OpenAI ドキュメント](https://platform.openai.com/docs)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
- [Vercel AIテンプレート](https://vercel.com/templates/ai)
