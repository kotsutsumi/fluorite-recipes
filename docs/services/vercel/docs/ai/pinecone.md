# Vercel Pinecone 統合

[Pinecone](https://pinecone.io/) は、複雑なデータの保存と検索を処理する[ベクターデータベース](/guides/vector-databases)サービスです。Pineconeを使用すると、コンテンツ推奨システム、パーソナライズド検索、画像認識などのための機械学習モデルを活用できます。Vercel Pinecone統合により、モデルをVercelにデプロイし、アプリケーションで使用できます。

## ベクターデータベースとは

ベクターデータベースは、ベクターを保存および検索するデータベースです。この文脈では、ベクターは数学的にデータポイントを表現します。多くの場合、埋め込み（エンベディング）と呼ばれます。

埋め込みは、数値の配列（ベクター）に変換されたデータです。ベクターを構成する数値の組み合わせは、他のベクターとの類似性を判断するための多次元マップを形成します。

ベクターの例:

```python
# 猫の画像のベクター
[0.1, 0.2, 0.3, 0.4, 0.5]

# 犬の画像のベクター
[0.2, 0.3, 0.4, 0.5, 0.6]
```

## ユースケース

Vercel と Pinecone の統合により、以下のようなAIアプリケーションを強化できます：

- **パーソナライズド検索**: ユーザーの行動や好みをベクターとして分析し、興味を引く可能性の高い検索結果を提案
- **画像・動画検索**: 視覚的コンテンツをベクター化し、類似画像・動画を検索
- **レコメンデーションシステム**: ユーザーの好みに基づいて製品やコンテンツを推奨
- **検索拡張生成（RAG）**: LLMにコンテキストを提供して、より正確な回答を生成

## はじめに

### 依存関係のインストール

```bash
pnpm i @pinecone-database/pinecone
```

### 環境変数の設定

```env
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
```

## 使用例

### インデックスの作成

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

await pinecone.createIndex({
  name: 'my-index',
  dimension: 1536,
  metric: 'cosine',
  spec: {
    serverless: {
      cloud: 'aws',
      region: 'us-west-2',
    },
  },
});
```

### ベクターの挿入

```typescript
const index = pinecone.index('my-index');

await index.upsert([
  {
    id: '1',
    values: [0.1, 0.2, 0.3, ...], // 1536次元のベクター
    metadata: { text: 'Hello, world!' },
  },
  {
    id: '2',
    values: [0.2, 0.3, 0.4, ...],
    metadata: { text: 'How are you?' },
  },
]);
```

### ベクターの検索

```typescript
const results = await index.query({
  vector: [0.15, 0.25, 0.35, ...], // クエリベクター
  topK: 5,
  includeMetadata: true,
});

console.log(results.matches);
```

### OpenAI埋め込みとの統合

```typescript
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';

// テキストを埋め込みに変換
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'Hello, world!',
});

// Pineconeに保存
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.index('my-index');

await index.upsert([
  {
    id: '1',
    values: embedding,
    metadata: { text: 'Hello, world!' },
  },
]);
```

### RAG（検索拡張生成）

```typescript
import { openai } from '@ai-sdk/openai';
import { embed, generateText } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';

async function ragQuery(query: string) {
  // 1. クエリを埋め込みに変換
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // 2. Pineconeで類似ドキュメントを検索
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pinecone.index('my-index');

  const results = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });

  // 3. 検索結果をコンテキストとして使用
  const context = results.matches
    .map((match) => match.metadata.text)
    .join('\n\n');

  // 4. LLMで回答を生成
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: `以下のコンテキストに基づいて質問に答えてください:

コンテキスト:
${context}

質問: ${query}`,
  });

  return text;
}

// 使用例
const answer = await ragQuery('AIとは何ですか？');
console.log(answer);
```

## ベストプラクティス

### インデックス設計

- 適切な次元数を選択（OpenAI text-embedding-3-small は 1536次元）
- 適切な類似性メトリクスを選択（cosine、euclidean、dotproduct）
- メタデータを活用してフィルタリング

### パフォーマンス最適化

- バッチでベクターを挿入
- 適切な topK 値を設定
- インデックスをウォームアップ

### コスト管理

- 適切なインデックスサイズを選択
- 不要なベクターを削除
- 使用状況を監視

## 料金

Pineconeの料金は、インデックスのサイズと使用量に基づきます。無料プランとスケーラブルな有料プランがあります。

## 関連リンク

- [Pinecone ドキュメント](https://docs.pinecone.io/)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
- [ベクターデータベースガイド](/guides/vector-databases)
