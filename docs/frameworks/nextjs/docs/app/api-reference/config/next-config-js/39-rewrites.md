# rewrites

Next.js のリライトを使用すると、元の URL を維持しながら、受信リクエストパスを異なる宛先パスにマッピングできます。

## コアコンセプト

- リライトは URL プロキシとして機能し、宛先パスをマスクします
- `next.config.js` で非同期 `rewrites()` 関数を使用して適用されます
- 配列または異なるリライト戦略を持つオブジェクトを返すことができます

## リライト設定

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/'
      }
    ]
  }
}
```

## リライトタイプ

### 1. 基本的なリライト
シンプルなパスマッピング

### 2. ワイルドカードパスマッチング
ネストされたパスに `*` を使用

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*'
      }
    ]
  }
}
```

### 3. 正規表現パスマッチング
複雑なマッチングに括弧を使用

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug'
      }
    ]
  }
}
```

## 高度な機能

- ヘッダー、Cookie、クエリのマッチング
- 外部 URL リライト
- 段階的な Next.js 採用
- BasePath サポート

## リライトの実行順序

1. ヘッダーをチェック
2. リダイレクトを適用
3. `beforeFiles` リライト
4. 静的ファイルをチェック
5. `afterFiles` リライト
6. `fallback` リライト

## 主要パラメータ

- **`source`**: 受信リクエストのパスパターン
- **`destination`**: ターゲットパス
- **`basePath`**: オプションのベースパス設定
- **`locale`**: ロケール含有オプション

## 複雑なリライト例

### ヘッダーベースのリライト

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page'
      }
    ]
  }
}
```

### Cookie ベースのリライト

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        destination: '/another-page'
      }
    ]
  }
}
```

ドキュメントは、Next.js アプリケーションで柔軟なルーティング戦略を実装するための包括的なガイダンスを提供します。
