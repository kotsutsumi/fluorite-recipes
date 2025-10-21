# OpenAI互換API

AI Gateway は OpenAI 互換の API を提供しており、OpenAI SDK を使用する既存のアプリケーションを最小限の変更で統合できます。

## ベースURL

OpenAI SDK を AI Gateway と使用するには、ベース URL を AI Gateway エンドポイントに変更します：

```
https://ai-gateway.vercel.sh/v1
```

## 認証

AI Gateway API キーを使用して認証します。[認証ガイド](/docs/ai-gateway/authentication)を参照して、API キーを作成してください。

## サポートされているエンドポイント

AI Gateway は以下の OpenAI API エンドポイントをサポートしています：

- チャット補完 (`/chat/completions`)
- 埋め込み (`/embeddings`)
- モデル一覧 (`/models`)

## 既存のツールとの統合

### TypeScript / JavaScript

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
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

console.log(response.choices[0].message.content);
```

### Python

```python
import os
from openai import OpenAI

client = OpenAI(
  api_key=os.getenv('AI_GATEWAY_API_KEY'),
  base_url='https://ai-gateway.vercel.sh/v1',
)

response = client.chat.completions.create(
  model='anthropic/claude-sonnet-4',
  messages=[
    {
      'role': 'user',
      'content': 'What is the capital of France?',
    }
  ],
)

print(response.choices[0].message.content)
```

## モデルリスト

利用可能なモデルのリストを取得するには、`/models` エンドポイントを使用します：

```typescript
const models = await openai.models.list();
console.log(models);
```

## チャット補完

### 基本的な使用

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: 'Tell me a joke about programming.',
    },
  ],
});
```

### ストリーミング

```typescript
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

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### 画像添付

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is in this image?',
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.jpg',
          },
        },
      ],
    },
  ],
});
```

### ツールコール

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: 'What is the weather in San Francisco?',
    },
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The location to get weather for',
            },
          },
          required: ['location'],
        },
      },
    },
  ],
});
```

## 構造化出力

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: 'Generate a recipe for chocolate chip cookies.',
    },
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'recipe',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          ingredients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                amount: { type: 'string' },
              },
            },
          },
          steps: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
});
```

## 推論設定

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: 'Tell me a story.',
    },
  ],
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.9,
});
```

## プロバイダオプション

OpenAI 互換 API を使用する場合でも、[プロバイダオプション](/docs/ai-gateway/provider-options)を指定できます。これには、カスタムヘッダーを使用します：

```typescript
const response = await openai.chat.completions.create(
  {
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'Hello, world!',
      },
    ],
  },
  {
    headers: {
      'x-gateway-order': 'bedrock,anthropic',
    },
  }
);
```

利用可能なヘッダー：

- `x-gateway-order`: プロバイダの順序をカンマ区切りで指定
- `x-gateway-only`: 使用するプロバイダをカンマ区切りで指定
- `x-gateway-exclude`: 除外するプロバイダをカンマ区切りで指定
- `x-gateway-max-retries`: 最大リトライ回数

## 関連リンク

- [はじめに](/docs/ai-gateway/getting-started)
- [認証](/docs/ai-gateway/authentication)
- [プロバイダオプション](/docs/ai-gateway/provider-options)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
