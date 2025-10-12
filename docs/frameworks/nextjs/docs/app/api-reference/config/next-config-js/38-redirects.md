# redirects

Next.js のリダイレクトを使用すると、受信リクエストパスをプログラム的に異なる宛先にリダイレクトできます。

## 設定

`next.config.js` ファイルで、リダイレクトオブジェクトの配列を返す非同期関数を使用して設定します。

## 主要なリダイレクト設定プロパティ

- **`source`**: 受信リクエストのパスパターン
- **`destination`**: リダイレクト先のターゲットパス
- **`permanent`**: 永続的 (308) か一時的 (307) かを示すブール値

## 基本設定例

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
```

## リダイレクトマッチング機能

### 1. パスマッチング

- **シンプルなパスマッチング**: `/old-blog/:slug`
- **ワイルドカードマッチング**: `/blog/:slug*`
- **正規表現マッチング**: `/post/:slug(\\d{1,})`

### 2. 高度なマッチング

- ヘッダーマッチング
- Cookie マッチング
- クエリパラメータマッチング

## 追加機能

- `basePath` のサポート
- 国際化サポート
- クエリパラメータを保持
- 設定可能なステータスコード

## 例

### パスパラメータを使用したリダイレクト

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```

### ワイルドカードパスマッチング

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
    ]
  },
}
```

### 正規表現パスマッチング

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug',
        permanent: false,
      },
    ]
  },
}
```

ドキュメントは、ヘッダー、Cookie、クエリパラメータに基づく条件付きリダイレクトを含む、複雑なリダイレクトシナリオの広範な例を提供します。
