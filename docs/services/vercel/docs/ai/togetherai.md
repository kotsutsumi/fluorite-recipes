# Vercel Together AI 統合

[Together AI](https://www.together.ai/) は、対話型AIエクスペリエンスのためのモデルを提供し、コラボレーティブでリアルタイムな関与に焦点を当てています。Vercelとの統合により、アプリケーションにユーザーインタラクションと共創機能を強化できます。

## ユースケース

Together AIは以下のようなアプリケーションに活用できます：

- **共創プラットフォーム**: デザインや執筆における協働的な創造プロセスをサポート
- **インタラクティブ学習環境**: 適応的で対話的な学習ツールの開発
- **リアルタイム対話ツール**: ユーザーとのリアルタイムな対話とエンゲージメントを実現

## 利用可能なモデル

Together AIは、以下のようなモデルを提供しています：

### 1. Nous Hermes 2 - Mixtral 8x7B-DPO
- **タイプ**: チャット
- Mixtral 8x7B MoEモデル上でトレーニングされた最新のNous Researchモデル

### 2. Llama 3.1 70B Instruct Turbo
- **タイプ**: チャット
- 最適化されたトランスフォーマーアーキテクチャを使用する自己回帰言語モデル

### 3. Llama 3.1 8B Instruct Turbo
- **タイプ**: チャット
- 効率的な推論のための軽量モデル

### 4. Llama 3.1 405B Instruct Turbo
- **タイプ**: チャット
- 最大のパフォーマンスモデル

### 5. Llama 3.2 3B Instruct Turbo
- **タイプ**: チャット
- 超高速推論のための小型モデル

## はじめに

### 依存関係のインストール

```bash
pnpm i @ai-sdk/openai
```

### 環境変数の設定

```env
TOGETHER_API_KEY=your-together-api-key
```

## 使用例

### 基本的なチャット

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const together = createOpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
});

const result = await generateText({
  model: together('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
  prompt: 'Explain quantum computing',
});

console.log(result.text);
```

### ストリーミング

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: together('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
  prompt: 'Tell me a story',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### 会話履歴の保持

```typescript
const result = await generateText({
  model: together('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is AI?' },
    { role: 'assistant', content: 'AI stands for Artificial Intelligence...' },
    { role: 'user', content: 'Can you explain more?' },
  ],
});
```

### パラメータのカスタマイズ

```typescript
const result = await generateText({
  model: together('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
  prompt: 'Write a creative story',
  temperature: 0.8,
  maxTokens: 1000,
  topP: 0.9,
});
```

## モデルの選択

### Llama 3.1 8B
- 高速で効率的
- リアルタイムアプリケーションに最適
- 低コスト

### Llama 3.1 70B
- バランスの取れたパフォーマンスとコスト
- ほとんどのユースケースに適している
- 高品質な出力

### Llama 3.1 405B
- 最高のパフォーマンス
- 複雑なタスクに最適
- より高いコスト

## 料金

Together AIの料金は、使用したトークン数とモデルサイズに基づきます。

## ベストプラクティス

### パフォーマンス最適化

- 適切なモデルサイズを選択
- ストリーミングを使用してユーザーエクスペリエンスを向上
- プロンプトを最適化してトークン使用量を削減

### エラーハンドリング

```typescript
try {
  const result = await generateText({
    model: together('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
    prompt: 'Hello!',
  });
  return Response.json({ text: result.text });
} catch (error) {
  console.error('Together AI error:', error);
  return Response.json({ error: 'Failed to generate text' }, { status: 500 });
}
```

### コスト管理

- 使用状況を監視
- 適切なモデルサイズを選択
- プロンプトを最適化

## 関連リンク

- [Together AI ドキュメント](https://docs.together.ai/)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
