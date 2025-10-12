# assetPrefix

> **注意**: [Vercelへのデプロイ](/docs/app/getting-started/deploying)では、Next.jsプロジェクトのグローバルCDNが自動的に設定されます。Asset Prefixを手動で設定する必要はありません。

> **知っておくと良いこと**: Next.js 9.5以降では、カスタマイズ可能な[Base Path](/docs/app/api-reference/config/next-config-js/basePath)がサポートされており、`/docs` のようなサブパスでアプリケーションをホストする場合に適しています。このユースケースにはカスタムAsset Prefixの使用は推奨しません。

## CDNのセットアップ

[CDN](https://en.wikipedia.org/wiki/Content_delivery_network)を設定するには、アセットプレフィックスを設定し、Next.jsがホストされているドメインに解決されるようにCDNのオリジンを設定できます。

`next.config.mjs` を開き、[フェーズ](/docs/app/api-reference/config/next-config-js#async-configuration)に基づいて `assetPrefix` 設定を追加します：

```javascript
// @ts-check
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    assetPrefix: isDev ? undefined : 'https://cdn.mydomain.com',
  }
  return nextConfig
}
```

Next.jsは、`/_next/` パス（`.next/static/` フォルダ）から読み込むJavaScriptおよびCSSファイルに対して、自動的にアセットプレフィックスを使用します。例えば、上記の設定では、次のJSチャンクへのリクエスト：

```
/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

は以下のようになります：

```
https://cdn.mydomain.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```
