# serverActions

Next.jsアプリケーションでServer Actionsの動作を設定するオプションです。

## `allowedOrigins`

Server Actionsを呼び出すことができる追加の安全なオリジンドメインのリストです。Next.jsは、CSRF攻撃を防ぐために、Server Actionリクエストのオリジンとホストドメインを比較します。

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

## `bodySizeLimit`

Server Actionに送信されるリクエストボディの最大サイズを設定します。

- デフォルトの制限: 1MB
- 過度なサーバーリソース消費と潜在的なDDoS攻撃を防ぎます
- バイトまたは文字列形式で設定できます

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

## Server Actionsの有効化（v13）

- Next.js 14で安定版機能となりました
- デフォルトで有効になっています
- それ以前のバージョンでは、`experimental.serverActions: true`で手動で有効化します

```javascript filename="next.config.js"
const config = {
  experimental: {
    serverActions: true,
  },
}

module.exports = config
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v14.0.0` | `serverActions`が安定版になりました |
| `v13.4.0` | `serverActions`が導入されました |
