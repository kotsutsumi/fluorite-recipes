# Vercel Deep Infra 統合

[Deep Infra](https://deepinfra.com/) は、機械学習モデルのデプロイと管理のためのスケーラブルで費用対効果の高いインフラストラクチャを提供します。従来のクラウドプロバイダーと比較して、レイテンシの削減と低コストに最適化されています。

この統合により、利用可能な多数のAIモデルにアクセスし、Vercelから直接トークン、請求、使用状況を管理できます。

## ユースケース

[Vercel と Deep Infra の統合](https://vercel.com/marketplace/deepinfra)を使用して、以下のことができます：

- DeepSeekやLlamaなどのAIモデルをVercelプロジェクトにシームレスに接続
- 高速と効率性に最適化された高性能AIモデルでの推論のデプロイと実行

## 利用可能なモデルの例

### 1. DeepSeek R1 Turbo
- **タイプ**: チャット
- 生成テキストモデル

### 2. Llama 3.1 8B Instruct Turbo
- **タイプ**: チャット
- 最適化されたトランスフォーマーアーキテクチャを使用する自己回帰言語モデル

### 3. Llama 4 Maverick 17B 128E Instruct
- **タイプ**: チャット
- 12言語をサポートする17B パラメータの混合エキスパートアーキテクチャ

## はじめに

### 依存関係のインストール

```bash
pnpm i @ai-sdk/openai
```

### 環境変数の設定

```env
DEEPINFRA_API_KEY=your-deepinfra-api-key
```

## 使用例

### 基本的なチャット

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const deepinfra = createOpenAI({
  apiKey: process.env.DEEPINFRA_API_KEY,
  baseURL: 'https://api.deepinfra.com/v1/openai',
});

const result = await generateText({
  model: deepinfra('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
  prompt: 'Explain quantum computing',
});
```

### ストリーミング

```typescript
const result = streamText({
  model: deepinfra('deepseek/deepseek-r1'),
  prompt: 'Tell me a story',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

## 料金

Deep Infraは、従来のクラウドプロバイダーよりも低コストでモデルを提供します。料金は使用したトークン数に基づきます。

## 関連リンク

- [Deep Infra ドキュメント](https://deepinfra.com/docs)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
