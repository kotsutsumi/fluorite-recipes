# Upstash Redis

リージョンごとの関数呼び出し回数の[ハッシュ](https://redis.io/commands/hincrby/)を保存するRedisカウンターの例。コードは[GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/upstash-redis-counter)で確認できます。

## Redisデータベースのセットアップ

[Upstashコンソール](https://console.upstash.com/)または[Upstash CLI](https://github.com/upstash/cli)を使用してRedisデータベースを作成します。

すべてのエッジロケーションからのレイテンシを最小化するために、`Global`タイプを選択します。`.env`ファイルに`UPSTASH_REDIS_REST_URL`と`UPSTASH_REDIS_REST_TOKEN`をコピーします。

これらは**Details > REST API > .env**の下にあります。

```bash
cp supabase/functions/upstash-redis-counter/.env.example supabase/functions/upstash-redis-counter/.env
```

## コード

最新バージョンの[Supabase CLIがインストール](/docs/guides/cli#installation)されていることを確認してください。

プロジェクトに新しい関数を作成します:

```bash
supabase functions new upstash-redis-counter
```

`index.ts`ファイルに次のコードを追加します:

```typescript
import { Redis } from 'https://deno.land/x/upstash_redis@v1.19.3/mod.ts'

console.log(`Function "upstash-redis-counter" up and running!`)

Deno.serve(async (_req) => {
  try {
    const redis = new Redis({
      url: Deno.env.get('UPSTASH_REDIS_REST_URL')!,
      token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!,
    })

    const deno_region = Deno.env.get('DENO_REGION')

    if (deno_region) {
      // リージョンカウンターをインクリメント
      await redis.hincrby('supa-edge-counter', deno_region, 1)
    } else {
      // ローカル開発環境用のフォールバック
      await redis.hincrby('supa-edge-counter', 'local', 1)
    }

    // すべてのリージョンのカウントを取得
    const counters = await redis.hgetall('supa-edge-counter')

    return new Response(JSON.stringify({ region: deno_region, counters }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

## ローカルで実行

```bash
supabase start
supabase functions serve upstash-redis-counter --env-file supabase/functions/upstash-redis-counter/.env --no-verify-jwt
```

## デプロイ

```bash
supabase functions deploy upstash-redis-counter
supabase secrets set --env-file supabase/functions/upstash-redis-counter/.env
```

## 使用例

関数を呼び出すと、現在のリージョンのカウンターがインクリメントされ、すべてのリージョンのカウンターが返されます:

```bash
curl https://your-project-ref.supabase.co/functions/v1/upstash-redis-counter
```

レスポンス例:

```json
{
  "region": "iad1",
  "counters": {
    "iad1": "5",
    "sfo1": "3",
    "fra1": "2"
  }
}
```

このパターンは、リージョンごとのビューカウンター、レート制限、その他のアトミックカウンター操作に使用できます。
