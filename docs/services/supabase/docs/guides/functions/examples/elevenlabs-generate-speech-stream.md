# ElevenLabsで音声をストリーミング

## イントロダクション

このチュートリアルでは、Supabase Edge Functions、Supabase Storage、[ElevenLabsテキスト読み上げAPI](https://elevenlabs.io/text-to-speech)を使用して、音声を生成、ストリーミング、保存、キャッシュするエッジAPIを構築する方法を学びます。

[GitHubのサンプルプロジェクト](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/text-to-speech/supabase/stream-and-cache-storage)を確認してください。

## 要件

- [APIキー](/app/settings/api-keys)を持つElevenLabsアカウント
- [Supabase](https://supabase.com)アカウント（[database.new](https://database.new)から無料アカウントにサインアップできます）
- マシンに[Supabase CLI](/docs/guides/local-development)がインストールされていること
- マシンに[Denoランタイム](https://docs.deno.com/runtime/getting_started/installation/)がインストールされていること、およびオプションで[お気に入りのIDEでセットアップ](https://docs.deno.com/runtime/getting_started/setup_your_environment)されていること

## セットアップ

### ローカルでSupabaseプロジェクトを作成

```bash
supabase init
```

### ストレージバケットの設定

`config.toml`ファイルに以下を追加します:

```toml
[storage.buckets.audio]
public = false
file_size_limit = "50MiB"
allowed_mime_types = ["audio/mp3"]
objects_path = "./audio"
```

### Supabase Edge Functionsのバックグラウンドタスクを設定

```toml
[edge_runtime]
policy = "per_worker"
```

### 音声生成用のSupabase Edge Functionを作成

```bash
supabase functions new text-to-speech
```

### 環境変数のセットアップ

`supabase/functions`ディレクトリ内に新しい`.env`ファイルを作成します:

```
# https://elevenlabs.io/app/settings/api-keysでAPIキーを検索/作成
ELEVENLABS_API_KEY=your_api_key
```

### 依存関係

プロジェクトには以下の依存関係が必要です:

```typescript
import { ElevenLabsClient } from "npm:elevenlabs@0.8.2"
import { createClient } from "npm:@supabase/supabase-js@2.39.3"
import hash from "npm:object-hash@3.0.0"
```

### Edge Functionの実装

`supabase/functions/text-to-speech/index.ts`ファイルを作成します:

```typescript
import { ElevenLabsClient } from "npm:elevenlabs@0.8.2"
import { createClient } from "npm:@supabase/supabase-js@2.39.3"
import hash from "npm:object-hash@3.0.0"

const elevenlabs = new ElevenLabsClient({
  apiKey: Deno.env.get("ELEVENLABS_API_KEY")!,
})

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

Deno.serve(async (req) => {
  try {
    const { text, voice = "Rachel" } = await req.json()

    // テキストと音声のハッシュを生成してキャッシュキーとして使用
    const cacheKey = hash({ text, voice })
    const filename = `${cacheKey}.mp3`

    // ストレージに既に存在するか確認
    const { data: existingFile } = await supabase
      .storage
      .from('audio')
      .download(filename)

    if (existingFile) {
      // キャッシュされたファイルを返す
      return new Response(existingFile, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Cache': 'HIT',
        },
      })
    }

    // ElevenLabsで音声を生成
    const audio = await elevenlabs.textToSpeech.convert(voice, {
      text,
      model_id: "eleven_monolingual_v1",
    })

    // ストリームをバッファに変換
    const chunks: Uint8Array[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    const buffer = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    )
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.length
    }

    // Supabase Storageに保存
    await supabase
      .storage
      .from('audio')
      .upload(filename, buffer, {
        contentType: 'audio/mpeg',
        upsert: false,
      })

    // 生成された音声を返す
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## デプロイ

### プロジェクトをリンク

```bash
supabase link --project-ref your-project-ref
```

### 関数をデプロイ

```bash
supabase functions deploy text-to-speech
```

### シークレットを設定

```bash
supabase secrets set ELEVENLABS_API_KEY=your_api_key
```

## 使用方法

関数は`<audio>`要素のソースとして直接使用できます:

```typescript
const response = await fetch('https://your-project-ref.supabase.co/functions/v1/text-to-speech', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    text: 'Hello, this is a test of text to speech.',
    voice: 'Rachel',
  }),
})

const audioBlob = await response.blob()
const audioUrl = URL.createObjectURL(audioBlob)

// HTMLで使用
// <audio src={audioUrl} controls />
```

## 主な特徴

- **ストリーミング**: リアルタイムで音声をストリーミング
- **キャッシング**: Supabase Storageを使用して生成された音声をキャッシュ
- **効率性**: 同じテキストと音声の組み合わせに対して重複した生成を回避
- **スケーラビリティ**: Edge Functionsのグローバル分散を活用

完全な実装例は[GitHubリポジトリ](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/text-to-speech/supabase/stream-and-cache-storage)で確認できます。
