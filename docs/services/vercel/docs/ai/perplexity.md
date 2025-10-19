# Vercel Perplexity 統合

## 概要

[Perplexity API](https://perplexity.ai/) は、AIを活用した検索と大規模言語モデルを組み合わせて、ユーザーの質問に正確でリアルタイムな回答を提供するサービスです。Vercelとの統合により、アプリケーションに以下の機能を追加できます。

## ユースケース

- **リアルタイムで引用付きの回答**: 検索結果に基づく正確な情報提供
- **カスタマイズ可能な検索とデータソーシング**: 特定のドメインやソースから情報を取得
- **複雑な多段階クエリの処理**: 複数の質問を組み合わせた複雑なクエリに対応
- **高速で効率的な回答**: 低レイテンシーで応答を生成
- **細かな出力制御**: レスポンス形式のカスタマイズが可能

## 利用可能なモデル

### Sonar Pro
- **タイプ**: チャット
- 高度なクエリとフォローアップをサポートする最上位モデル

### Sonar
- **タイプ**: チャット
- 軽量で、検索に基づいた回答を提供

## 始め方

### 前提条件

- Vercelプロジェクト
- 最新のVercel CLI

### プロジェクトへのプロバイダー追加

#### ダッシュボードを使用する場合

1. Vercelダッシュボードの「AI」タブに移動
2. Perplexity APIを選択
3. プロバイダー情報を確認
4. プロジェクトを選択
5. 接続を完了

## コード例

### Next.js での使用

```typescript
// app/api/chat/route.ts
import { perplexity } from '@ai-sdk/perplexity';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: perplexity('sonar-pro'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 検索ベースの回答

```typescript
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

const result = await generateText({
  model: perplexity('sonar-pro'),
  prompt: '最新のAI技術のトレンドは何ですか？',
});

console.log(result.text);
// 検索結果に基づく最新情報を含む回答
```

### 引用付き回答

```typescript
const result = await generateText({
  model: perplexity('sonar-pro'),
  prompt: '気候変動の最新の科学的知見は？',
  searchDomainFilter: ['*.edu', '*.gov'],
});

// 結果には信頼できるソースからの引用が含まれます
```

### ストリーミング

```typescript
const result = streamText({
  model: perplexity('sonar'),
  prompt: '人工知能の歴史について教えてください',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

## 機能

### リアルタイム検索

Perplexityは、リアルタイムでウェブを検索し、最新の情報を提供します。

### ドメインフィルタリング

特定のドメインからの情報のみを検索：

```typescript
const result = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'AI倫理について',
  searchDomainFilter: ['*.edu', '*.org'],
});
```

### 引用とソース

すべての回答には、信頼できるソースへの引用が含まれます。

## 料金

Perplexityの料金は、使用したトークン数に基づきます。モデルによって料金が異なります。

## ベストプラクティス

### 検索最適化

- 明確で具体的な質問をする
- 必要に応じてドメインフィルタを使用
- リアルタイム情報が必要なタスクに使用

### エラーハンドリング

```typescript
try {
  const result = await generateText({
    model: perplexity('sonar-pro'),
    prompt: 'Query',
  });
  return Response.json({ text: result.text });
} catch (error) {
  console.error('Perplexity error:', error);
  return Response.json({ error: 'Failed to generate response' }, { status: 500 });
}
```

## 関連リンク

- [Perplexity ドキュメント](https://docs.perplexity.ai/)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
