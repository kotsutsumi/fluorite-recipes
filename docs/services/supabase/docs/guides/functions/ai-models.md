# AIモデルの実行

組み込みのSupabase AI APIを使用して、Edge FunctionsでAIモデルを実行します。

## 概要

Edge Functionsには、AIモデルを実行するための組み込みAPIがあります。以下のことが可能です:
- 外部依存関係なしでテキスト埋め込みを生成
- OllamaまたはLlamafileを介して大規模言語モデル（LLM）を実行
- 会話型AIワークフローを構築

## セットアップ

外部依存関係は必要ありません。新しい推論セッションを作成します:

```typescript
const model = new Supabase.ai.Session('model-name')
```

型ヒントを取得するには、`functions-js`から型をインポートします:

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
```

### モデル推論の実行

セッションがインスタンス化されたら、推論を実行できます:

```typescript
// 埋め込みの場合
const embeddings = await model.run('Hello world', {
  mean_pool: true,
  normalize: true,
})

// テキスト生成（非ストリーミング）の場合
const response = await model.run('Write a haiku about coding', {
  stream: false,
  timeout: 30,
})

// ストリーミングレスポンスの場合
const stream = await model.run('Tell me a story', {
  stream: true,
  mode: 'ollama',
})
```

## テキスト埋め込み

`gte-small`モデルを使用して埋め込みを生成します:

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  const { text } = await req.json()

  const model = new Supabase.ai.Session('gte-small')

  const embeddings = await model.run(text, {
    mean_pool: true,
    normalize: true,
  })

  return new Response(
    JSON.stringify({ embeddings }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

> **注意**: `gte-small`モデルは英語テキスト専用で、長いテキストは最大512トークンに切り詰められます。

### ベクトル類似検索

埋め込みをデータベースに保存して類似検索を実行:

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  const { query } = await req.json()

  // クエリの埋め込みを生成
  const model = new Supabase.ai.Session('gte-small')
  const embedding = await model.run(query, {
    mean_pool: true,
    normalize: true,
  })

  // 類似ドキュメントを検索
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.8,
    match_count: 10,
  })

  return new Response(JSON.stringify({ results: data }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 大規模言語モデル（LLM）

OllamaとMozilla Llamafileを介してサポートされています。現在、自己管理サーバーが必要です。

### Ollamaでローカル実行

1. **Ollamaをインストールしてモデルをプル**

```bash
# Ollamaをインストール
curl -fsSL https://ollama.com/install.sh | sh

# Mistralモデルをプル
ollama pull mistral
```

2. **Ollamaサーバーを実行**

```bash
ollama serve
```

3. **関数シークレットを設定**

```bash
supabase secrets set AI_INFERENCE_API_HOST=http://host.docker.internal:11434
```

4. **Edge Functionを作成**

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  const { prompt } = await req.json()

  const model = new Supabase.ai.Session('mistral')

  const response = await model.run(prompt, {
    stream: false,
    mode: 'ollama',
  })

  return new Response(JSON.stringify({ response }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### ストリーミングレスポンス

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  const { prompt } = await req.json()

  const model = new Supabase.ai.Session('mistral')

  const stream = await model.run(prompt, {
    stream: true,
    mode: 'ollama',
  })

  // ReadableStreamとして返す
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
})
```

### クライアント側でストリームを処理

```javascript
const response = await fetch('https://your-project.supabase.co/functions/v1/llm-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ prompt: 'Tell me a story' }),
})

const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const text = decoder.decode(value)
  console.log(text)
}
```

## デプロイ

1. **Ollama/Llamafileサーバーをデプロイ**

クラウドプロバイダーにOllamaをデプロイするか、専用サーバーを使用します。

2. **`AI_INFERENCE_API_HOST`シークレットを設定**

```bash
supabase secrets set AI_INFERENCE_API_HOST=https://your-ollama-server.com
```

3. **関数をデプロイ**

```bash
supabase functions deploy llm-chat
```

## 実用例

### チャットボット

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { message, conversationId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 会話履歴を取得
  const { data: history } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  // コンテキストを含むプロンプトを構築
  const contextPrompt = history
    .map(m => `${m.role}: ${m.content}`)
    .join('\n') + `\nuser: ${message}\nassistant:`

  // LLMレスポンスを生成
  const model = new Supabase.ai.Session('mistral')
  const response = await model.run(contextPrompt, {
    stream: false,
    mode: 'ollama',
  })

  // メッセージを保存
  await supabase.from('messages').insert([
    { conversation_id: conversationId, role: 'user', content: message },
    { conversation_id: conversationId, role: 'assistant', content: response },
  ])

  return new Response(JSON.stringify({ response }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## パフォーマンスの考慮事項

- **ローカルOllama**: GPU非対応サーバーよりも遅くなります
- **タイムアウト**: LLMレスポンスには適切なタイムアウトを設定してください
- **ストリーミング**: 長いレスポンスにはストリーミングを使用します

## 今後の予定

Supabaseは、Supabaseでホストされるマネージドインフラストラクチャを介したLLM推論のサポートに取り組んでいます。これにより、独自のサーバーを管理する必要がなくなります。

## その他のリソース

- [Ollama ドキュメント](https://ollama.com/docs)
- [Llamafile リポジトリ](https://github.com/Mozilla-Ocho/llamafile)
- [Supabase AI Examples](https://github.com/supabase/supabase/tree/master/examples/ai)
