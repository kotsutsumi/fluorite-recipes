# Vercel xAI 統合

[xAI](https://x.ai/) は、Vercelを通じて統合された課金機能を持つ、言語、チャット、ビジョンAIの機能を提供します。

## ユースケース

[Vercelと xAI の統合](https://vercel.com/marketplace/xai)を使用して、以下のことができます：

- Vercelプロジェクトでテキスト生成、翻訳、質問応答を実行する
- 高度な言語理解と視覚処理のための言語とビジョンモデルを使用する

## 利用可能なモデル

xAIは、言語モデルと言語・ビジョンAIモデルを提供しています。

### 1. Grok-2
- **タイプ**: チャット
- テキスト生成、翻訳、質問応答などのタスクに使用可能な大規模言語モデル

### 2. Grok-2 Vision
- **タイプ**: 画像
- 高度な言語理解と強力な視覚処理機能を組み合わせたマルチモーダルAIモデル

### 3. Grok 2 Image
- **タイプ**: 画像
- 他の画像生成モデルが苦手な複数のドメインで高品質な画像を生成可能

### 4. Grok-3 Beta
- **タイプ**: チャット
- データ抽出、コーディング、テキスト要約に優れたエンタープライズ向けモデル

### 5. Grok-3 Fast Beta
- **タイプ**: チャット
- 低レイテンシーと高速な最初のトークン生成時間を実現

## はじめに

### 前提条件

- 既存の[Vercelプロジェクト](/docs/projects/overview#creating-a-project)
- 最新バージョンの[Vercel CLI](/docs/cli#installing-vercel-cli)

```bash
pnpm i -g vercel@latest
```

### プロジェクトにプロバイダーを追加する

#### ダッシュボードを使用する

1. [Vercelダッシュボード](/dashboard)のAIタブに移動
2. 「AIプロバイダをインストール」をクリック
3. xAIを選択
4. プランを選択してインストール
5. プロジェクトに接続

#### CLI を使用する

```bash
vercel env add XAI_API_KEY
```

## 使用例

### 基本的なチャット

```typescript
import { generateText } from 'ai';
import { xai } from '@ai-sdk/xai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateText({
    model: xai('grok-3-beta'),
    prompt,
  });

  return Response.json({ text: result.text });
}
```

### ストリーミング

```typescript
import { streamText } from 'ai';
import { xai } from '@ai-sdk/xai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: xai('grok-3-beta'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### ビジョン（画像理解）

```typescript
import { generateText } from 'ai';
import { xai } from '@ai-sdk/xai';

const result = await generateText({
  model: xai('grok-2-vision'),
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

### 画像生成

```typescript
import { xai } from '@ai-sdk/xai';

const result = await generateImage({
  model: xai('grok-2-image'),
  prompt: '美しい夕焼けの風景',
});
```

## モデル別の機能

### Grok-2

```typescript
const result = await generateText({
  model: xai('grok-2'),
  prompt: '量子コンピューティングを説明してください',
  temperature: 0.7,
  maxTokens: 1000,
});
```

### Grok-3 Beta

```typescript
const result = await generateText({
  model: xai('grok-3-beta'),
  prompt: 'このコードをPythonからTypeScriptに変換してください',
});
```

### Grok-3 Fast Beta

```typescript
const result = await generateText({
  model: xai('grok-3-fast-beta'),
  prompt: '簡潔な回答を提供してください',
});
```

## 料金

xAIの料金は、使用したトークン数に基づいて課金されます。各モデルには異なる料金設定があります。

詳細は、[xAI料金ページ](https://x.ai/pricing)を参照してください。

## ベストプラクティス

### モデルの選択

- **Grok-2**: 汎用タスク
- **Grok-2 Vision**: 画像理解が必要なタスク
- **Grok-3 Beta**: 複雑な推論とコーディング
- **Grok-3 Fast Beta**: 低レイテンシーが必要なタスク

### パフォーマンス最適化

- 適切なモデルを選択してコストを削減
- ストリーミングを使用してユーザーエクスペリエンスを向上
- プロンプトを最適化してトークン使用量を削減

### エラーハンドリング

```typescript
try {
  const result = await generateText({
    model: xai('grok-3-beta'),
    prompt: 'Hello!',
  });
  return Response.json({ text: result.text });
} catch (error) {
  console.error('xAI error:', error);
  return Response.json({ error: 'Failed to generate text' }, { status: 500 });
}
```

## 関連リンク

- [xAI ドキュメント](https://docs.x.ai/)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
- [モデルの追加](/docs/ai/adding-a-model)
