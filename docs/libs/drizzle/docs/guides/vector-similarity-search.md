# pgvector拡張機能を使用したベクトル類似度検索

## 前提条件
以下の知識が必要です:
- PostgreSQL
- Select文
- インデックス
- sql演算子
- pgvector拡張機能
- Drizzle kit

## インストール
```bash
npm i openai
```

## セットアップ手順

### 1. pgvector拡張機能を作成
以下の内容でマイグレーションファイルを作成します:
```sql
CREATE EXTENSION vector;
```

### 2. スキーマを定義
```typescript
export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

### 3. 埋め込みを生成
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');

  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });

  return data[0].embedding;
};
```

### 4. 類似度検索を実行
```typescript
const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);

  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;

  const similarGuides = await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(4);

  return similarGuides;
};
```

## 主なポイント
- pgvector拡張機能はベクトルデータ型と操作を提供
- OpenAI APIを使用してテキストの埋め込みを生成
- コサイン距離を使用して類似度を計算
- HNSWインデックスは高速な類似度検索を提供
- 類似度のしきい値でフィルタリング可能
