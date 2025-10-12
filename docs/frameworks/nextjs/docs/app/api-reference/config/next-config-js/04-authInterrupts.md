# authInterrupts

この機能は現在canaryチャンネルで利用可能であり、変更される可能性があります。[Next.jsをアップグレード](/docs/app/building-your-application/upgrading/canary)して試してみて、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有してください。

`authInterrupts` 設定オプションを使用すると、アプリケーションで[`forbidden`](/docs/app/api-reference/functions/forbidden)および[`unauthorized`](/docs/app/api-reference/functions/unauthorized) APIを使用できます。これらの機能は実験的なものですが、使用するには `next.config.js` ファイルで `authInterrupts` オプションを有効にする必要があります：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

## 次のステップ

- [forbidden - forbidden関数のAPIリファレンス](/docs/app/api-reference/functions/forbidden)
- [unauthorized - unauthorized関数のAPIリファレンス](/docs/app/api-reference/functions/unauthorized)
- [forbidden.js - forbidden.js特殊ファイルのAPIリファレンス](/docs/app/api-reference/file-conventions/forbidden)
- [unauthorized.js - unauthorized.js特殊ファイルのAPIリファレンス](/docs/app/api-reference/file-conventions/unauthorized)
