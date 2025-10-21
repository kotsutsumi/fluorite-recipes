# Supabase Database (Postgres)との統合

Edge FunctionsからPostgresデータベースに接続します。

## supabase-jsの使用

`supabase-js`クライアントは、行レベルセキュリティによる認証を処理し、レスポンスを自動的にJSON形式でフォーマットします。これはほとんどのアプリケーションで推奨されるアプローチです:

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data, error } = await supabase.from('countries').select('*')
    if (error) {
      throw error
    }
    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})
```

これにより以下が可能になります:
- 自動的な行レベルセキュリティの適用
- 組み込みのJSONシリアライゼーション
- 一貫したエラー処理
- データベーススキーマのTypeScriptサポート

## Postgresクライアントの使用

Edge Functionsはサーバーサイド技術であるため、一般的なPostgresクライアントを使用してデータベースに直接接続することが安全です。つまり、Edge FunctionsからSQL文を直接実行できます。

以下は、Deno Postgresドライバーを使用した例です:

```typescript
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

// 1つの接続でデータベースプールを作成します。
const pool = new Pool(
  {
    tls: { enabled: false },
    database: 'postgres',
    hostname: Deno.env.get('DB_HOSTNAME'),
    user: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASSWORD'),
    port: 5432,
  },
  1
)

Deno.serve(async (req) => {
  try {
    // プールから接続を取得します
    const connection = await pool.connect()

    try {
      // SQLクエリを実行します
      const result = await connection.queryObject`
        SELECT * FROM countries
      `

      return new Response(JSON.stringify(result.rows), {
        headers: { 'Content-Type': 'application/json' },
      })
    } finally {
      // 接続を常にリリースします
      connection.release()
    }
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})
```

### 接続情報の取得

データベース接続の詳細は、Supabaseダッシュボードの**Settings** > **Database**から取得できます:

- `DB_HOSTNAME`: プロジェクトのホスト名
- `DB_USER`: デフォルトは`postgres`
- `DB_PASSWORD`: データベースパスワード
- `DB_PORT`: デフォルトは`5432`

これらの値は環境変数として設定してください:

```bash
supabase secrets set DB_HOSTNAME=your-hostname
supabase secrets set DB_USER=postgres
supabase secrets set DB_PASSWORD=your-password
```

### 注意事項

- Postgresクライアントを使用する場合、行レベルセキュリティは自動的に適用されません
- RLSを適用する必要がある場合は、`supabase-js`の使用を推奨します
- 接続プールを適切に管理して、接続リークを防ぎます
