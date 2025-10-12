# logging

`logging` オプションを使用すると、開発中のログ動作を設定できます。

## 1. データのフェッチ

fetch リクエストの完全な URL をログに記録できます:

```javascript
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

HMR (Hot Module Replacement) キャッシュリフレッシュのログを有効化:

```javascript
module.exports = {
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
}
```

## 2. 受信リクエスト

デフォルトでは、開発中はすべての受信リクエストがログに記録されます。

正規表現を使用して特定のリクエストを無視:

```javascript
module.exports = {
  logging: {
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
  },
}
```

受信リクエストのログを完全に無効化:

```javascript
module.exports = {
  logging: {
    incomingRequests: false,
  },
}
```

## 3. グローバルログ

`logging` を `false` に設定してすべての開発ログを無効化:

```javascript
module.exports = {
  logging: false,
}
```

## 主要なポイント

- 開発モードにのみ適用
- 現在は `fetch` API ログに限定
- ログ動作をきめ細かく制御可能
