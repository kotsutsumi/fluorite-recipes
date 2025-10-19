# Build Output API - プリミティブ

Vercelデプロイメントを構成する「ビルディングブロック」。

## 概要

Vercel Primitivesは、Vercelデプロイメントを構成する基本要素です。4つの主要なディレクトリに分類されます。

## ディレクトリ構造

```
.vercel/
  output/
    static/              # 静的ファイル
    functions/           # サーバーレス関数・エッジ関数
      [name].func/       # 関数ディレクトリ
        .vc-config.json  # 関数設定
        index.js         # 関数コード
```

## 1. 静的ファイル（Static Files）

### 場所

```
.vercel/output/static/
```

### 特徴

- Vercel Edge CDN経由で公開アクセス可能
- 元のファイル名と拡張子を保持
- サブディレクトリはURLパスに反映される

### 例

```
.vercel/output/static/
  index.html           → https://example.com/index.html
  about.html           → https://example.com/about.html
  images/
    logo.png           → https://example.com/images/logo.png
  css/
    style.css          → https://example.com/css/style.css
```

### ユースケース

- HTML、CSS、JavaScriptファイル
- 画像、フォント、その他のアセット
- 静的に生成されたコンテンツ

## 2. サーバーレス関数（Serverless Functions）

### ディレクトリ構造

```
.vercel/output/functions/
  api-endpoint.func/
    .vc-config.json
    index.js
```

### 設定ファイル（.vc-config.json）

```json
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "memory": 1024,
  "maxDuration": 10,
  "environment": {
    "DATABASE_URL": "postgres://..."
  }
}
```

### 型定義

```typescript
interface ServerlessConfig {
  runtime: string;           // 実行環境
  handler: string;           // エントリーポイント
  memory?: number;           // メモリ（MB）
  maxDuration?: number;      // 最大実行時間（秒）
  environment?: Record<string, string>;  // 環境変数
  regions?: string[];        // デプロイリージョン
  supportsResponseStreaming?: boolean;   // レスポンスストリーミング
}
```

### サポートされるランタイム

- `nodejs18.x`
- `nodejs20.x`
- `python3.9`
- `python3.11`
- `go1.x`

### 関数の例

**Node.js:**

```javascript
// .vercel/output/functions/api-hello.func/index.js
export default function handler(request, response) {
  const { name = 'World' } = request.query;

  response.status(200).json({
    message: `Hello, ${name}!`
  });
}
```

**Python:**

```python
# .vercel/output/functions/api-hello.func/index.py
def handler(request, response):
    name = request.args.get('name', 'World')

    return {
        'statusCode': 200,
        'body': f'Hello, {name}!'
    }
```

### 設定パラメータ

**runtime:**
実行環境を指定

**handler:**
エントリーポイントファイルを指定

**memory:**
割り当てメモリ（デフォルト: 1024MB）

**maxDuration:**
最大実行時間（デフォルト: 10秒、最大: 300秒）

**environment:**
関数固有の環境変数

**regions:**
デプロイするリージョンのリスト

**supportsResponseStreaming:**
レスポンスストリーミングのサポート（デフォルト: false）

## 3. エッジ関数（Edge Functions）

### ディレクトリ構造

```
.vercel/output/functions/
  middleware.func/
    .vc-config.json
    index.js
```

### 設定ファイル（.vc-config.json）

```json
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
```

### 型定義

```typescript
interface EdgeConfig {
  runtime: 'edge';
  entrypoint: string;
  regions?: string[];
}
```

### サポートされるファイル

- JavaScript（.js）
- TypeScript（.ts）
- JSON（.json）
- WebAssembly（.wasm）

### ビルド時の処理

エッジ関数はビルド時にバンドルされます。すべての依存関係を含める必要があります。

### エッジ関数の例

```typescript
// .vercel/output/functions/middleware.func/index.ts
export default async function handler(request: Request) {
  const url = new URL(request.url);

  // 地理的な場所に基づくリダイレクト
  const country = request.headers.get('x-vercel-ip-country');

  if (country === 'JP' && !url.pathname.startsWith('/jp')) {
    return Response.redirect(new URL('/jp' + url.pathname, request.url));
  }

  return new Response(null, {
    headers: {
      'x-middleware-next': '1'
    }
  });
}
```

### エッジランタイムの制限

- Node.js APIの一部が利用不可
- ファイルシステムアクセス不可
- ネイティブモジュール不可
- 最大実行時間が短い

### ユースケース

- 認証・認可
- A/Bテスト
- リダイレクト・リライト
- ヘッダー操作
- 地理的ルーティング

## 4. プリレンダー関数（Prerender Functions）

### 概要

Vercel CDNによってキャッシュされる関数。

### ディレクトリ構造

```
.vercel/output/functions/
  blog-post.prerender-func/
    .vc-config.json
    index.js
    fallback.html          # オプション
```

### 設定ファイル（.vc-config.json）

```json
{
  "expiration": 86400,
  "allowQuery": ["id", "page"],
  "bypassToken": "ランダムに生成されたトークン"
}
```

### 型定義

```typescript
interface PrerenderConfig {
  expiration?: number | false;    // キャッシュ有効期限（秒）
  allowQuery?: string[];          // 許可するクエリパラメータ
  bypassToken?: string;           // キャッシュバイパストークン
  fallback?: string;              // フォールバック静的ファイル
}
```

### パラメータ

**expiration:**
- キャッシュの有効期限（秒）
- `false`: 無期限キャッシュ
- デフォルト: 86400（24時間）

**allowQuery:**
- キャッシュキーに含めるクエリパラメータ
- 指定されたパラメータごとに個別のキャッシュを作成

**bypassToken:**
- キャッシュをバイパスするためのトークン
- Draft ModeやオンデマンドISRで使用

**fallback:**
- 初回リクエスト時に表示する静的HTMLファイル

### プリレンダー関数の例

```typescript
// .vercel/output/functions/blog-post.prerender-func/index.ts
export default async function handler(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  // データベースから記事を取得
  const post = await fetchBlogPost(id);

  // HTMLを生成
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>${post.title}</title></head>
      <body>
        <h1>${post.title}</h1>
        <div>${post.content}</div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  });
}
```

### フォールバックファイル

```html
<!-- .vercel/output/functions/blog-post.prerender-func/fallback.html -->
<!DOCTYPE html>
<html>
  <head><title>Loading...</title></head>
  <body>
    <div id="loading">記事を読み込んでいます...</div>
  </body>
</html>
```

## プリミティブの選択ガイド

### 静的ファイル

**使用する場合:**
- ビルド時に生成される静的コンテンツ
- 変更頻度が低いファイル
- 画像、CSS、JavaScriptなどのアセット

### サーバーレス関数

**使用する場合:**
- リクエストごとに動的な処理が必要
- データベースクエリ
- 外部APIとの連携
- 認証が必要な処理

### エッジ関数

**使用する場合:**
- 低レイテンシが重要
- 地理的ルーティング
- 軽量な認証・認可
- リクエスト/レスポンスの変換

### プリレンダー関数

**使用する場合:**
- 動的だがキャッシュ可能なコンテンツ
- ブログ記事、商品ページなど
- ISR（Incremental Static Regeneration）が適している場合

## ベストプラクティス

1. **適切なプリミティブの選択**
   - パフォーマンスとコストを考慮
   - キャッシュ戦略を事前に計画

2. **設定の最適化**
   - メモリと実行時間を適切に設定
   - 必要最小限のリージョンにデプロイ

3. **セキュリティ**
   - バイパストークンを安全に管理
   - 環境変数をセンシティブデータに使用

4. **モニタリング**
   - 関数の実行時間とメモリ使用量を監視
   - エラーレートを追跡

## 関連リンク

- [Build Output API 概要](/docs/build-output-api)
- [Build Output API 設定](/docs/build-output-api/configuration)
- [Build Output API 機能](/docs/build-output-api/features)
- [Vercel Functions ドキュメント](/docs/functions)
