# プロバイダオプション

## 概要

Vercel AI Gatewayは、複数のAIプロバイダ間でAIモデルリクエストをルーティングできます。デフォルトでは、最近の稼働時間と遅延に基づいて最適なプロバイダを動的に選択します。

## 基本的なプロバイダの順序付け

`order` 配列を使用して、プロバイダの試行順序を指定できます。プロバイダは `slug` 文字列で指定します。

### 使用例

```typescript
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4',
    prompt,
    providerOptions: {
      gateway: {
        order: ['bedrock', 'anthropic'], // Amazon Bedrockを最初に試し、次にAnthropicを試す
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

## プロバイダの制限

`only` 配列を使用して、特定のプロバイダのみを使用するよう制限できます。

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      only: ['bedrock', 'anthropic'], // これらのプロバイダのみを考慮
    },
  },
});
```

## プロバイダの除外

`exclude` 配列を使用して、特定のプロバイダを除外できます。

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      exclude: ['bedrock'], // Amazon Bedrockを除外
    },
  },
});
```

## リトライ動作のカスタマイズ

`maxRetries` オプションを使用して、失敗したリクエストのリトライ回数を制御できます。

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      maxRetries: 3, // 最大3回リトライ
    },
  },
});
```

## 利用可能なプロバイダ

以下は、利用可能なプロバイダの一部です：

| Slug | 名前 | ウェブサイト |
|------|------|--------------|
| `anthropic` | Anthropic | [anthropic.com](https://anthropic.com) |
| `openai` | OpenAI | [openai.com](https://openai.com) |
| `bedrock` | Amazon Bedrock | [aws.amazon.com/bedrock](https://aws.amazon.com/bedrock) |
| `google` | Google AI | [ai.google.dev](https://ai.google.dev) |
| `groq` | Groq | [groq.com](https://groq.com) |
| `xai` | xAI | [x.ai](https://x.ai) |

完全なリストについては、[AI Gateway モデルページ](https://vercel.com/ai-gateway/models)を参照してください。

## ベストプラクティス

### フォールバック戦略

複数のプロバイダを順序付けすることで、フォールバック戦略を実装できます：

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      order: ['bedrock', 'anthropic', 'openrouter'],
    },
  },
});
```

### コスト最適化

コストが低いプロバイダを優先することで、コストを最適化できます：

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      order: ['bedrock', 'anthropic'], // Bedrockは通常より低コスト
    },
  },
});
```

### レイテンシ最適化

低レイテンシのプロバイダを優先することで、応答時間を改善できます：

```typescript
const result = streamText({
  model: 'anthropic/claude-sonnet-4',
  prompt,
  providerOptions: {
    gateway: {
      order: ['anthropic', 'bedrock'], // Anthropic directは通常より低レイテンシ
    },
  },
});
```

## 関連リンク

- [モデルとプロバイダ](/docs/ai-gateway/models-and-providers)
- [はじめに](/docs/ai-gateway/getting-started)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
