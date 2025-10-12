# デプロイ

Next.jsアプリケーションは、マネージド型Next.jsインフラストラクチャにデプロイすることも、Node.jsサーバー、Dockerイメージ、または静的HTMLファイルにセルフホスティングすることもできます。`next start`を使用する場合、すべてのNext.js機能がサポートされます。

このページでは、Next.jsアプリケーションをデプロイする方法について学びます。

## デプロイメントオプション

Next.jsは、さまざまなデプロイメント戦略をサポートしています：

### Node.jsサーバー

Next.jsは、Node.jsをサポートするホスティングプロバイダーにデプロイできます。

**必要なもの**:

1. `package.json`に以下のスクリプトがあることを確認してください：

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

2. アプリケーションをビルドします：

```bash
npm run build
```

3. 本番サーバーを起動します：

```bash
npm run start
```

`next start`は、すべてのNext.js機能をサポートします。

### Dockerコンテナ

Next.jsは、Kubernetesなどのコンテナオーケストレーターや、任意のクラウドプロバイダーで実行されるコンテナ内でデプロイできます。

1. マシンに[Docker](https://docs.docker.com/get-docker/)をインストールします
2. [サンプルをクローン](https://github.com/vercel/next.js/tree/canary/examples/with-docker)します（または[マルチ環境の例](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env)）
3. コンテナをビルドします：`docker build -t nextjs-docker .`
4. コンテナを実行します：`docker run -p 3000:3000 nextjs-docker`

Docker経由のNext.jsは、すべてのNext.js機能をサポートします。

> **知っておくと良いこと**:
>
> - DockerはMacやWindowsで[volumes](https://docs.docker.com/storage/volumes/)を使用する場合、ネイティブファイルシステムよりも遅い可能性があります。これは主に開発に影響します。
> - 開発には`npm run dev`の使用を推奨します。本番環境でのDockerのビルドとデプロイは高速です。

### 静的エクスポート

Next.jsは、静的サイトまたはSingle-Page Application (SPA)として開始し、後でサーバーが必要な機能を使用するようにオプションでアップグレードできます。

Next.jsはこの[静的エクスポート](/docs/app/building-your-application/deploying/static-exports)をサポートしているため、HTMLやCSSやJavaScriptの静的アセットを提供できる任意のウェブサーバーにデプロイおよびホストできます。

> **知っておくと良いこと**: サーバーが必要なNext.js機能はサポートされて**いません**。[詳細はこちら](/docs/app/building-your-application/deploying/static-exports#unsupported-features)を参照してください。

## プロダクションビルド

`next build`を実行すると、Next.jsはアプリケーションの最適化されたバージョンを生成します。HTMLやCSSやJavaScriptファイルがページに基づいて作成されます。JavaScriptは**コンパイル**され、ブラウザバンドルは[Next.jsコンパイラ](/docs/architecture/nextjs-compiler)を使用して**最小化**され、最高のパフォーマンスを実現し、[すべてのモダンブラウザ](/docs/architecture/supported-browsers)をサポートします。

Next.jsは、マネージド型およびセルフホスト型のNext.jsで使用される標準的なデプロイメント出力を生成します。これにより、両方のデプロイメント方法ですべての機能がサポートされます。次のメジャーバージョンでは、この出力を[ビルド出力API仕様](https://vercel.com/docs/build-output-api/v3)に変換する予定です。

## プラットフォームアダプター

Next.jsは、特定のクラウドプロバイダーへのデプロイを簡素化するプラットフォームアダプターをサポートしています。

**サポートされているプラットフォーム**:

- [AWS Amplify Hosting](https://aws.amazon.com/amplify/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Deno Deploy](https://deno.com/deploy)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

各プラットフォームには、Next.jsアプリケーションをデプロイするための特定の手順とベストプラクティスがあります。詳細については、各プラットフォームのドキュメントを参照してください。

## セルフホスティング

Next.jsをセルフホストする場合、3つのオプションがあります：

- [Node.jsサーバー](#nodejsサーバー)
- [Dockerコンテナ](#dockerコンテナ)
- [静的エクスポート](#静的エクスポート)

### Node.jsサーバーの要件

Next.jsは、Node.jsをサポートする任意のホスティングプロバイダーにデプロイできます。`package.json`に`build`および`start`スクリプトがあることを確認してください：

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

次に、`npm run build`を実行してアプリケーションをビルドします。最後に、`npm run start`を実行してNode.jsサーバーを起動します。このサーバーはすべてのNext.js機能をサポートします。

### Dockerイメージ

Next.jsは、[Docker](https://www.docker.com/)コンテナを使用してデプロイできます。このアプローチは、Kubernetesなどのコンテナオーケストレーターにデプロイする場合や、任意のクラウドプロバイダーのコンテナ内で実行する場合に使用できます。

1. マシンに[Docker](https://docs.docker.com/get-docker/)をインストールします
2. [with-docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)の例をクローンします
3. コンテナをビルドします：`docker build -t nextjs-docker .`
4. コンテナを実行します：`docker run -p 3000:3000 nextjs-docker`

Next.jsは、Dockerを介してすべてのNext.js機能をサポートします。

### イメージの最適化

`next/image`を介した[画像最適化](/docs/app/building-your-application/optimizing/images)は、`next start`を使用してデプロイする場合、ゼロ設定でセルフホスティングで動作します。画像を最適化する別のサービスを使用したい場合は、[画像ローダーを設定](/docs/app/building-your-application/optimizing/images#loaders)できます。

画像最適化は、`next.config.js`でカスタム画像ローダーを定義することにより、[静的エクスポート](/docs/app/building-your-application/deploying/static-exports#image-optimization)で使用できます。画像は、ビルド時ではなく、ランタイムで最適化されることに注意してください。

> **知っておくと良いこと**:
>
> - `glibc`ベースのLinuxシステムを使用する場合、過剰なメモリ使用を防ぐために追加の[設定が必要な場合があります](https://nextjs.org/docs/app/api-reference/components/image#memory-usage)。
> - [最適化された画像のキャッシング動作](/docs/app/api-reference/components/image#caching-behavior)と、TTLの設定方法について詳しく学びましょう。
> - 画像最適化を無効にして、他の利点を保持したい場合は、[画像最適化を無効](/docs/app/api-reference/components/image#unoptimized)にすることもできます。これには、`next/image`で`src`として画像URLを維持することが含まれます。

### キャッシング

Next.jsは、レスポンスをキャッシュして、アプリケーションのパフォーマンスを向上させます。

デフォルトでは、Next.jsは[フェッチリクエストのキャッシング](/docs/app/building-your-application/caching#data-cache)をサポートし、[ページのフルルートキャッシング](/docs/app/building-your-application/caching#full-route-cache)も行います。

キャッシング動作をカスタマイズするには、Next.jsの[キャッシングドキュメント](/docs/app/building-your-application/caching)を参照してください。

### ビルドキャッシュ

Next.jsは、`next build`の際に`.next/cache`にビルドキャッシュを作成します。このキャッシュを使用して、ビルド時間を大幅に短縮できます。

このキャッシュは、Continuous Integration (CI)環境で複数のビルド間で保持する必要があります。

以下は、一般的なCIプロバイダーでキャッシュを設定する例です：

**Vercel**: キャッシュは自動的に設定されます。

**CircleCI**: `.circleci/config.yml`で`.next/cache`をキャッシュするように設定します：

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "package-lock.json" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

**Travis CI**: `.travis.yml`に以下を追加します：

```yaml
cache:
  directories:
    - $HOME/.cache/next
```

**GitLab CI**: `.gitlab-ci.yml`に以下を追加します：

```yaml
cache:
  paths:
    - node_modules/
    - .next/cache/
```

**Netlify**: [Netlifyプラグイン](https://www.npmjs.com/package/@netlify/plugin-nextjs)を使用します。

**AWS CodeBuild**: `buildspec.yml`に以下を追加します：

```yaml
cache:
  paths:
    - 'node_modules/**/*'
    - '.next/cache/**/*'
```

**GitHub Actions**: GitHub Actionsの[キャッシュアクション](https://github.com/actions/cache)を使用します。

### ストリーミングとSuspense

Next.js App Routerは、セルフホスティング時にストリーミングレスポンスをサポートします。NginxやKubernetesなどのプロキシやロードバランサーを使用している場合は、ストリーミングを有効にするためにバッファリングを無効にするように設定することが重要です。

たとえば、Nginxでバッファリングを無効にするには、`X-Accel-Buffering`を`no`に設定します：

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

## 環境変数

Next.jsは、ビルド時と実行時の両方で環境変数をサポートできます。

**デフォルトでは、環境変数はサーバー上でのみ利用可能です**。環境変数をブラウザに公開するには、`NEXT_PUBLIC_`プレフィックスを付ける必要があります。ただし、これらのパブリック環境変数は、`next build`の際にJavaScriptバンドルにインライン化されます。

サーバー環境変数を読み取るには、`process.env`を使用できます：

```js
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
})
```

環境変数の詳細については、[環境変数ドキュメント](/docs/app/building-your-application/configuring/environment-variables)を参照してください。

### ランタイム環境変数

Next.jsは、ビルド時と実行時の両方で環境変数をサポートできます。

**デフォルトでは、環境変数はサーバー上でのみ利用可能です**。環境変数をブラウザに公開するには、`NEXT_PUBLIC_`プレフィックスを付ける必要があります。

ただし、これらのパブリック環境変数は、`next build`の際にJavaScriptバンドルにインライン化されます。実行時に環境変数を読み取る必要がある場合は、APIを使用してサーバーにそれらを提供することをお勧めします。たとえば、[Route Handler](/docs/app/building-your-application/routing/route-handlers)を使用します：

```ts title="app/api/config/route.ts"
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.API_URL,
  })
}
```

> **知っておくと良いこと**: `register`関数を使用して、サーバー起動時にコードを実行できます。

## 自動更新とホットリロード

Next.jsは、コードベースへの変更を検出するとアプリケーションを自動的にリロードします。ただし、セルフホスティングされたデプロイメントでは、サーバーを再起動する必要がある場合があります。

## 手動グレースフルシャットダウン

セルフホスティングの場合、`SIGTERM`または`SIGINT`シグナルでサーバーがシャットダウンしたときにコードを実行したい場合があります。

環境変数`NEXT_MANUAL_SIG_HANDLE`を`true`に設定し、`_document.js`ファイル内でそのシグナルのハンドラを登録できます。環境変数は、`.env`ファイルではなく、`package.json`スクリプトに直接登録する必要があります。

> **知っておくと良いこと**: 手動シグナル処理は`next dev`では利用できません。

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "NEXT_MANUAL_SIG_HANDLE=true next start"
  }
}
```

```js title="pages/_document.js"
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM: cleaning up')
    process.exit(0)
  })
  process.on('SIGINT', () => {
    console.log('Received SIGINT: cleaning up')
    process.exit(0)
  })
}
```

## 次のステップ

これで、Next.jsアプリケーションをデプロイする方法を理解できました。次のステップでは、さらに高度なデプロイメントトピックについて学びます：

- **[Static Exports](/docs/app/building-your-application/deploying/static-exports)**: 静的HTMLとしてアプリケーションをエクスポートする方法を学びます。
- **[Environment Variables](/docs/app/building-your-application/configuring/environment-variables)**: 環境変数の設定と使用方法を学びます。
- **[Caching](/docs/app/building-your-application/caching)**: キャッシングの仕組みとカスタマイズ方法を学びます。
