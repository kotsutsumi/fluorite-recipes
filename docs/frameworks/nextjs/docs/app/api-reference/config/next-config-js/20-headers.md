# headers

ヘッダーを使用すると、特定のパスへの受信リクエストに対するレスポンスにカスタムHTTPヘッダーを設定できます。

カスタムHTTPヘッダーを設定するには、`next.config.js` で `headers` キーを使用できます：

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

`headers` は、`source` および `headers` プロパティを持つオブジェクトを含む配列を返すことが期待される非同期関数です：

- `source` は受信リクエストのパスパターンです。
- `headers` は `key` と `value` プロパティを持つレスポンスヘッダーオブジェクトの配列です。
- `basePath`: `false` または `undefined` - falseの場合、マッチング時にbasePathが含まれず、外部リライトにのみ使用できます。
- `locale`: `false` または `undefined` - マッチング時にロケールを含めないかどうか。
- `has` は、`type`、`key`、および `value` プロパティを持つ[hasオブジェクト](#header-cookie-and-query-matching)の配列です。
- `missing` は、`type`、`key`、および `value` プロパティを持つ[missingオブジェクト](#header-cookie-and-query-matching)の配列です。

ヘッダーは、ページや `/public` ファイルを含むファイルシステムの前にチェックされます。

## ヘッダーの上書き動作

2つのヘッダーが同じパスにマッチし、同じヘッダーキーを設定する場合、最後のヘッダーキーが最初のヘッダーキーを上書きします。

## パスマッチング

パスマッチが許可されており、例えば `/blog/:slug` は `/blog/hello-world` にマッチします（ネストされたパスはありません）。

### ワイルドカードパスマッチング

ワイルドカードパスにマッチさせるには、パラメータの後に `*` を使用できます。例えば `/blog/:slug*` は `/blog/a/b/c/d/hello-world` にマッチします。

### 正規表現パスマッチング

正規表現パスにマッチさせるには、パラメータの後に括弧で正規表現を囲むことができます。例えば `/blog/:slug(\\d{1,})` は `/blog/123` にマッチしますが、`/blog/abc` にはマッチしません。

## ヘッダー、クッキー、クエリマッチング

`has` フィールドまたは `missing` フィールドがマッチした場合にのみヘッダーを適用するには、これらのフィールドを使用できます。`source` と すべての `has` アイテムがマッチし、すべての `missing` アイテムがマッチしない場合にのみヘッダーが適用されます。

`has` および `missing` アイテムには以下のフィールドがあります：

- `type`: `String` - `header`、`cookie`、`host`、または `query` のいずれかである必要があります。
- `key`: `String` - 選択されたタイプからマッチさせるキー。
- `value`: `String` または `undefined` - チェックする値。undefinedの場合、任意の値がマッチします。正規表現のような文字列を使用して値の特定の部分をキャプチャできます。例：値 `first-(?<paramName>.*)` が `first-second` に使用された場合、`second` は宛先で `:paramName` として使用できます。

```javascript
module.exports = {
  async headers() {
    return [
      // ヘッダー `x-add-header` が存在する場合、
      // `x-another-header` ヘッダーが適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // ヘッダー `x-no-header` が存在しない場合、
      // `x-another-header` ヘッダーが適用されます
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-no-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // sourceとhost、queryが一致する場合、
      // `x-authorized` ヘッダーが適用されます
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // pageの値はheadersキーで使用できるため、
            // 提供された名前付きキャプチャグループを使用できます
            // 例: (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized',
            value: ':authorized',
          },
        ],
      },
      // ヘッダー `x-authorized` が存在し、
      // マッチする値を含む場合、`x-another-header` が適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
      // hostが `example.com` の場合、
      // このヘッダーが適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
    ]
  },
}
```

## basePathサポート付きのヘッダー

ヘッダーで[`basePath` サポート](/docs/app/api-reference/config/next-config-js/basePath)を活用する場合、各 `source` にはヘッダーに `basePath: false` を追加しない限り、自動的に `basePath` がプレフィックスとして付けられます：

```javascript
module.exports = {
  basePath: '/docs',

  async headers() {
    return [
      {
        source: '/with-basePath', // /docs/with-basePathになります
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/without-basePath', // basePathが追加されません
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
        basePath: false,
      },
    ]
  },
}
```

## i18nサポート付きのヘッダー

ヘッダーで[`i18n` サポート](/docs/app/api-reference/config/next-config-js/i18n)を活用する場合、各 `source` にはヘッダーに `locale: false` を追加しない限り、設定された `locales` を処理するために自動的にプレフィックスが付けられます。`locale: false` を使用する場合、`source` に正しくマッチするようにロケールをプレフィックスとして付ける必要があります。

```javascript
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async headers() {
    return [
      {
        source: '/with-locale', // すべてのロケールを自動的に処理
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // locale: falseが設定されているため、ロケールは自動的に処理されません
        source: '/nl/with-locale-manual',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // これは '/' がマッチするため、`en`がdefaultLocaleです
        source: '/en',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // これは/(en|fr|de)/(.*)に変換されるため、/:path*のように
        // トップレベルの `/` や `/fr` ルートにはマッチしません
        source: '/(.*)',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## キャッシュ

レスポンスヘッダーは `/_next/data` 内のファイルへのリクエストを含む、Next.jsの静的生成ページには設定できません。これらのファイルは、同じ `Cache-Control` ヘッダーを効率的に処理するためにキャッシュされます。キャッシュされたデータの `Cache-Control` を再検証する必要がある場合は、`getServerSideProps` を使用してください。
