# httpAgentOptions

`httpAgentOptions` は、Node.js バージョン 18 より前のバージョンにおいて、サーバーサイドの `fetch()` 呼び出しの HTTP 接続動作を管理するための設定です。

## 概要

- **対象**: Node.js バージョン 18 未満
- **動作**: Next.js は `fetch()` を undici で自動的にポリフィル
- **デフォルト**: HTTP Keep-Alive が有効

## 設定例

```javascript
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```

## 用途

この設定により、`next.config.js` ファイルで `keepAlive` を `false` に設定することで、すべてのサーバーサイド `fetch()` 呼び出しに対して HTTP Keep-Alive を無効にできます。

これにより、Next.js アプリケーションでサーバーサイドのネットワークリクエストに対する HTTP 接続動作を柔軟に管理できます。
