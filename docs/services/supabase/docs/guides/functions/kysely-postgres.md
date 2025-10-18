# Kyselyを使用した型安全なSQL

## 概要

Supabase Edge Functionsは、[Postgresデータベースに直接接続](/docs/guides/functions/connect-to-postgres)してSQLクエリを実行できます。[Kysely](https://github.com/kysely-org/kysely#kysely)は、型安全でオートコンプリート対応のTypeScript SQLクエリビルダーです。

KyselyとDeno Postgresを組み合わせることで、Postgresデータベースと直接やり取りするための便利な開発者体験が得られます。

## コード

サンプルは[GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/kysely-postgres)で確認できます。

プロジェクトの[**Connect**パネル](/dashboard/project/_/?showConnect=true)からデータベース接続情報を取得し、`.env`ファイルに保存します:

```
DB_HOSTNAME=
DB_PASSWORD=
DB_SSL_CERT="-----BEGIN CERTIFICATE-----
プロジェクトダッシュボードから証明書を取得してください
-----END CERTIFICATE-----"
```

[deno-postgres](https://deno-postgres.com/)を介してPostgresへの接続を管理するための`DenoPostgresDriver.ts`ファイルを作成します:

```typescript
import {
  CompiledQuery,
  DatabaseConnection,
  Driver,
  PostgresCursorConstructor,
  QueryResult,
  TransactionSettings,
} from 'https://esm.sh/kysely@0.23.4'
import { Pool, PoolClient } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

export class DenoPostgresDriver implements Driver {
  #pool: Pool

  constructor(pool: Pool) {
    this.#pool = pool
  }

  async init(): Promise<void> {
    // 初期化処理
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    const client = await this.#pool.connect()
    return new DenoPostgresConnection(client)
  }

  async beginTransaction(
    connection: DatabaseConnection,
    settings: TransactionSettings
  ): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('BEGIN'))
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('COMMIT'))
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('ROLLBACK'))
  }

  async releaseConnection(connection: DatabaseConnection): Promise<void> {
    await (connection as DenoPostgresConnection).release()
  }

  async destroy(): Promise<void> {
    await this.#pool.end()
  }
}

class DenoPostgresConnection implements DatabaseConnection {
  #client: PoolClient

  constructor(client: PoolClient) {
    this.#client = client
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const result = await this.#client.queryObject<O>(
      compiledQuery.sql,
      compiledQuery.parameters as any[]
    )

    return {
      rows: result.rows,
    }
  }

  async release(): Promise<void> {
    this.#client.release()
  }

  async *streamQuery<O>(
    _compiledQuery: CompiledQuery,
    _chunkSize?: number
  ): AsyncIterableIterator<QueryResult<O>> {
    throw new Error('Streaming not supported')
  }
}
```

受信リクエストに対してクエリを実行する`index.ts`ファイルを作成します:

```typescript
import { serve } from 'https://deno.land/std@0.175.0/http/server.ts'
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import {
  Kysely,
  Generated,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'https://esm.sh/kysely@0.23.4'
import { DenoPostgresDriver } from './DenoPostgresDriver.ts'

// データベーススキーマの型定義
interface Database {
  users: UserTable
}

interface UserTable {
  id: Generated<number>
  name: string
  email: string
  created_at: Generated<Date>
}

// 接続プールの作成
const pool = new Pool({
  hostname: Deno.env.get('DB_HOSTNAME'),
  port: 5432,
  user: 'postgres',
  password: Deno.env.get('DB_PASSWORD'),
  database: 'postgres',
  tls: {
    enabled: true,
    enforce: true,
    caCertificates: [Deno.env.get('DB_SSL_CERT')!],
  },
}, 3)

// Kyselyインスタンスの作成
const db = new Kysely<Database>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DenoPostgresDriver(pool),
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
})

serve(async (req) => {
  try {
    // 型安全なクエリの例
    const users = await db
      .selectFrom('users')
      .select(['id', 'name', 'email'])
      .where('created_at', '>', new Date('2024-01-01'))
      .orderBy('created_at', 'desc')
      .limit(10)
      .execute()

    return new Response(JSON.stringify(users), {
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

## デプロイ

```bash
supabase functions deploy kysely-postgres
supabase secrets set --env-file .env
```

## 利点

- **型安全性**: TypeScriptの型システムを完全に活用
- **オートコンプリート**: IDEでのインテリジェントな補完
- **コンパイル時チェック**: クエリエラーを実行前に検出
- **移行性**: データベーススキーマの変更を型で追跡

Kyselyを使用することで、Edge FunctionsでPostgresとやり取りする際の開発者体験が大幅に向上します。
