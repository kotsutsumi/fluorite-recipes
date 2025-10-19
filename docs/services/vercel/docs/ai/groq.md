# Vercel Groq 統合

[Groq](https://groq.com/) は、高性能な AI 推論サービスで、超高速な言語処理ユニット (LPU) アーキテクチャを持っています。低レイテンシが必要なアプリケーションに最適な、高速な言語モデル推論を可能にします。

## ユースケース

[Vercel と Groq の統合](https://vercel.com/marketplace/groq)を使用して、以下のことができます：

- 音声処理用の Whisper-large-v3 や、テキスト生成用の Llama モデルなどの AI モデルを Vercel プロジェクトに接続する
- 最適化されたパフォーマンスで推論をデプロイおよび実行する

## 利用可能なモデル

Groq は、高性能なタスク用に設計された多様な AI モデルを提供しています。

### DeepSeek R1 Distill Llama 70B
- **タイプ**: チャット
- 生成テキストモデル

### Distil Whisper Large V3 English
- **タイプ**: 音声
- OpenAI の Whisper モデルの圧縮版。英語音声認識を高速かつ低コストで提供

### Llama 3.1 8B Instant
- **タイプ**: チャット
- テキスト生成用の高速で効率的な言語モデル

### Mistral Saba 24B
- **タイプ**: チャット
- アラビア語、ペルシャ語、ウルドゥー語、ヘブライ語、インド系言語に特化したモデル

## はじめに

### 前提条件

- 既存のVercelプロジェクト
- 最新のVercel CLI

### プロバイダーの追加

```bash
pnpm i @ai-sdk/groq
```

### 環境変数の設定

```env
GROQ_API_KEY=your-groq-api-key
```

## 使用例

### チャット

```typescript
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const result = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'Explain quantum computing',
});
```

### 音声認識

```typescript
import { groq } from '@ai-sdk/groq';

const result = await transcribeAudio({
  model: groq('whisper-large-v3'),
  audio: audioFile,
  language: 'en',
});
```

### ストリーミング

```typescript
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const result = streamText({
  model: groq('llama-3.1-8b-instant'),
  prompt: 'Tell me a story',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

## パフォーマンス

Groqの主な利点は、その超高速な推論速度です：

- **低レイテンシ**: 最初のトークンまでのミリ秒単位の時間
- **高スループット**: 秒あたり数百トークン
- **効率的**: コスト効率の高い推論

## 関連リンク

- [Groq ドキュメント](https://groq.com/docs)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
