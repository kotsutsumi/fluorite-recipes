# Self-Hosting（セルフホスティング）

Next.jsアプリケーションは、Node.jsまたはDockerをサポートする任意のホスティングプロバイダーにセルフホストできます。このガイドでは、セルフホスティングする際の考慮事項について説明します。

## セルフホスティングの主要な考慮事項

### 1. Image Optimization（画像最適化）

`next/image`を使用した[画像最適化](https://nextjs.org/docs/app/building-your-application/optimizing/images)は、`next start`を使用してデプロイする場合、セルフホスティングでゼロ設定で動作します。画像を最適化する別のサービスを使用したい場合は、[画像ローダーを設定](https://nextjs.org/docs/app/building-your-application/optimizing/images#loaders)できます。

画像最適化は、`next.config.js`でカスタム画像ローダーを定義することで、[静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#image-optimization)で使用できます。画像はビルド時ではなく、実行時に最適化されます。

```javascript filename="next.config.js"
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}
```

```typescript filename="my-loader.ts"
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

> **知っておくと良いこと**: カスタム画像ローダーを定義する場合は、画像を最適化するために`src`、`width`、`quality`を使用してください。

### 2. Middleware（ミドルウェア）

[ミドルウェア](https://nextjs.org/docs/app/building-your-application/routing/middleware)は、`next start`を使用してデプロイする場合、セルフホスティングでゼロ設定で動作します。リクエストへのアクセスが必要なため、[静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)を使用する場合はサポートされません。

ミドルウェアは、アプリケーション内のすべてのルートまたはアセットの前に実行できる可能性のある低遅延を保証するために、[Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)をデフォルトで使用します。ただし、必ずしも必要ではありません。例えば、完全なNode.jsランタイム（実験的）を使用して、より複雑な処理（例：データベースクエリ、サードパーティAPIコール）を実行できます。

```javascript filename="middleware.js"
export const config = {
  runtime: 'nodejs', // または 'edge'
}

export function middleware(request) {
  // ミドルウェアロジック
}
```

ストリーミング（またはウェブクローラー）を使用しており、複雑なロジックが必要な場合は、ミドルウェアではなく[Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components)としてロジックを移動できます。

### 3. Environment Variables（環境変数）

Next.jsは、ビルド時と実行時の両方の環境変数をサポートできます。

**デフォルトでは、環境変数はサーバー上でのみ使用可能です**。環境変数をブラウザに公開するには、`NEXT_PUBLIC_`でプレフィックスを付ける必要があります。ただし、これらの公開環境変数は`next build`中にJavaScriptバンドルにインライン化されます。

```bash filename=".env"
# サーバー側でのみ使用可能
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword

# ブラウザとサーバー側で使用可能
NEXT_PUBLIC_API_URL=https://api.example.com
```

サーバー上で動的に環境変数を読み取るには、`getServerSideProps`または[App Router](https://nextjs.org/docs/app/building-your-application/rendering/server-components)を使用することをお勧めします。App Routerでは、動的レンダリング中にサーバー上で環境変数を安全に読み取ることができます。

```javascript filename="app/page.js"
export default async function Page() {
  const dbHost = process.env.DB_HOST // 動的レンダリング中に読み取り
  // ...
}
```

これにより、複数の環境で使用できる単一のDockerイメージを昇格させることができます。異なる値を持つ環境変数を使用できます。

> **知っておくと良いこと**:
> - サーバー起動時に[`register` 関数](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)を使用してコードを実行できます。
> - [runtimeConfig](https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration)オプションの使用はお勧めしません。スタンドアロン出力モードでは動作しません。代わりに、App Routerを[段階的に採用](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)することをお勧めします。

### 4. Caching and ISR（キャッシングとインクリメンタル静的再生成）

Next.jsは、レスポンス、生成された静的ページ、ビルド出力、および画像、フォント、スクリプトなどの他の静的アセットをキャッシュできます。

ページのキャッシングと再検証（インクリメンタル静的再生成（ISR）または新しい関数を使用）は、**同じ共有キャッシュ**を使用します。デフォルトでは、このキャッシュはNext.jsサーバーのファイルシステム（ディスク上）に保存されます。**これは、Pages RouterとApp Routerの両方を使用してセルフホスティングする場合に自動的に動作します。**

キャッシュされたページとデータを耐久性のあるストレージに永続化したり、Next.jsアプリケーションの複数のコンテナまたはインスタンス間でキャッシュを共有したりする場合は、Next.jsキャッシュの場所を設定できます。

#### 自動キャッシング

Next.jsは、本当に不変のアセットに対して`public, max-age=31536000, immutable`の`Cache-Control`ヘッダーを設定します。これはオーバーライドできません。これらの不変ファイルには、ファイル名にSHAハッシュが含まれているため、無期限に安全にキャッシュできます。例えば、[静的画像インポート](https://nextjs.org/docs/app/building-your-application/optimizing/images#local-images)などです。画像の[TTL](https://nextjs.org/docs/app/api-reference/components/image#minimumcachettl)を設定できます。

インクリメンタル静的再生成（ISR）は、`s-maxage: <revalidate in getStaticProps>, stale-while-revalidate`の`Cache-Control`ヘッダーを設定します。この再検証時間は、[`getStaticProps` 関数](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)で秒単位で定義されます。`revalidate: false`を設定すると、デフォルトで1年間のキャッシュ期間になります。

動的にレンダリングされるページは、ユーザー固有のデータがキャッシュされないように、`private, no-cache, no-store, max-age=0, must-revalidate`の`Cache-Control`ヘッダーを設定します。これは、App RouterとPages Routerの両方に適用されます。これにはDraft Modeも含まれます。

#### 静的アセット

静的アセットを別のドメインまたはCDNでホストする場合は、`next.config.js`で[`assetPrefix` 設定](https://nextjs.org/docs/app/api-reference/next-config-js/assetPrefix)を使用できます。Next.jsは、JavaScriptまたはCSSファイルを取得する際にこのアセットプレフィックスを使用します。アセットを別のドメインに分離すると、DNSとTLS解決に追加の時間がかかるというデメリットがあります。

```javascript filename="next.config.js"
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
}
```

#### キャッシュの設定

デフォルトでは、生成されたキャッシュアセットはメモリ（デフォルトは50MB）とディスクに保存されます。Kubernetesなどのコンテナオーケストレーションプラットフォームを使用してNext.jsをホスティングしている場合、各Podにはキャッシュのコピーがあります。デフォルトではポッド間でキャッシュが共有されないため、古いデータが表示されるのを防ぐには、Next.jsキャッシュを設定してキャッシュハンドラーを提供し、メモリ内キャッシングを無効にできます。

セルフホスティング時にISR/Dataキャッシュの場所を設定するには、`next.config.js`ファイルでカスタムハンドラーを設定できます。

```javascript filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // メモリ内キャッシングを無効化
}
```

次に、プロジェクトのルートに`cache-handler.js`を作成します。例：

```javascript filename="cache-handler.js"
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    // これは任意のデータストアに保存できます
    return cache.get(key)
  }

  async set(key, data, ctx) {
    // これは任意のデータストアに保存できます
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }

  async revalidateTag(tags) {
    // 特定のタグが付けられたエントリに対してキャッシュを反復処理
    for (let [key, value] of cache) {
      // エントリに指定されたタグの1つが含まれている場合
      if (value.tags.some((tag) => tags.includes(tag))) {
        // エントリを削除
        cache.delete(key)
      }
    }
  }
}
```

カスタムキャッシュハンドラーを使用すると、Next.jsアプリケーションをホストするすべてのポッド間で一貫性を保つことができます。例えば、キャッシュされた値を[Redis](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis)や[Memcached](https://www.memcached.org/)などの任意の場所に保存できます。

### 5. Build Cache（ビルドキャッシュ）

Next.jsは、`next build`中のビルドキャッシュのIDを生成します。同じIDは、複数のコンテナをスピンアップする際に使用されます。

各環境に対してビルドしている場合は、コンテナ間で使用する一貫したビルドIDを生成する必要があります。`next.config.js`で`generateBuildId`コマンドを使用します。

```javascript filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // 任意の値を返すことができます（例：最新のgit commit hash）
    return process.env.GIT_HASH
  },
}
```

### 6. Streaming and Suspense（ストリーミングとサスペンス）

Next.js App Routerは、セルフホスティング時に[ストリーミングレスポンス](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)をサポートします。Nginxまたは同様のプロキシを使用している場合は、ストリーミングを有効にするためにバッファリングを無効にするように設定する必要があります。

例えば、Nginxで`X-Accel-Buffering`を`no`に設定することでバッファリングを無効にできます。

```nginx filename="nginx.conf"
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    # ストリーミングを有効にするためにバッファリングを無効化
    proxy_buffering off;
    proxy_set_header X-Accel-Buffering no;
  }
}
```

## 本番環境への移行

本番環境に移行する際には、アプリケーションを可能な限りパフォーマンス良く実行するために考慮すべきいくつかの最適化と設定があります。

### CDN の使用

Next.jsがページをレンダリングする際、レスポンス（HTMLストリーム）はクライアントに送信されます。そのレスポンスは、CDNによって自動的にキャッシュされます。

ただし、Partial Prerendering（PPR）を有効にしている場合、静的な「シェル」とストリーミングコンテンツの両方がCDNにキャッシュされます。PPRについての詳細は[ドキュメント](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering)を参照してください。

### 出力ファイルトレーシング

Next.jsは、本番デプロイに必要なファイルを自動的にトレースして、`output: 'standalone'`で`.next/standalone`フォルダに出力します。

```javascript filename="next.config.js"
module.exports = {
  output: 'standalone',
}
```

これにより、必要なファイルのみを含む最小限の本番デプロイが作成されます。

### Node.js サーバー

Node.jsサーバーを使用してセルフホスティングしている場合は、[Node.jsサーバー](https://nextjs.org/docs/pages/building-your-application/deploying#nodejs-server)のベストプラクティスを参照してください。

```bash
node server.js
```

このサーバーは、すべての Next.js 機能をサポートしています。

### Docker イメージ

公式の[Next.js Dockerイメージ](https://github.com/vercel/next.js/tree/canary/examples/with-docker)を使用してNext.jsをコンテナ化できます。

```dockerfile
FROM node:18-alpine AS base

# 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 本番イメージ
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## まとめ

Next.jsのセルフホスティングには、画像最適化、キャッシング、環境変数の管理など、さまざまな考慮事項があります。このガイドに従うことで、本番環境で高パフォーマンスのNext.jsアプリケーションを実行できます。
