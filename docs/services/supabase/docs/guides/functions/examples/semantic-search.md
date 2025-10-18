# セマンティック検索

## 概要

セマンティック検索は、「正確なキーワードではなく、ユーザークエリの背後にある意味を解釈する」ことで、機械学習を使用して意図とコンテキストを捉え、同義語や単語の関係などの言語のニュアンスを処理します。

## 主要な機能

Supabase Edge Runtime v1.36.0以降、外部依存関係なしでSupabaseエッジファンクション内で `gte-small` モデルをネイティブに実行できるようになりました。

## 実装コンポーネント

このチュートリアルでは、3つの主要な部分の実装が含まれます：

1. `public.embeddings` テーブルにコンテンツが追加/更新されたときに埋め込みを生成する `generate-embedding` データベースウェブフックエッジファンクション。

2. Remote Procedure Call（RPC）を介して類似性検索を実行するための `query_embeddings` Postgresファンクション。

3. 次の処理を行う `search` エッジファンクション：
   - 検索用語の埋め込みを生成
   - RPCを介して類似性検索を実行
   - 検索結果を返す

## データベースのセットアップ

### テーブル作成

```sql
create extension if not exists vector with schema extensions;

create table embeddings (
  id bigint primary key generated always as identity,
  content text not null,
  embedding vector (384)
);

alter table embeddings enable row level security;
create index on embeddings using hnsw (embedding vector_ip_ops);
```

## エッジファンクションの例

```typescript
const model = new Supabase.ai.Session('gte-small')

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()
  const { content, id } = payload.record

  // 埋め込みを生成
  const embedding = await model.run(content, {
    mean_pool: true,
    normalize: true,
  })

  // データベースに保存
  const { error } = await supabase
    .from('embeddings')
    .update({ embedding: JSON.stringify(embedding) })
    .eq('id', id)

  if (error) console.warn(error.message)
  return new Response('ok')
})
```

## まとめ

このアプローチにより、pgvectorとSupabaseエッジファンクションを使用して「外部依存関係なしでAI搭載のセマンティック検索」を実現できます。
