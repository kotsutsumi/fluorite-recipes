# Vercel Cache（エッジキャッシュ）

Vercel Cacheは、エッジでコンテンツをキャッシュし、ユーザーに高速にデータを配信するための仕組みです。

## 概要

Vercel Cacheは、以下の特徴を持っています:

- すべてのデプロイメントとドメインで利用可能
- 価格プランに関係なく使用可能
- 2つの主要なキャッシュ方法を提供

## キャッシング方法

### 1. 自動静的ファイルキャッシング

静的ファイル（画像、CSS、JavaScriptなど）は自動的にキャッシュされます。

### 2. 動的コンテンツのキャッシング

`Cache-Control`ヘッダーを使用して動的コンテンツをキャッシュします。

## キャッシングの実装方法

キャッシングは以下の方法で実装できます:

### 1. Vercel Functions

関数内で`Cache-Control`ヘッダーを設定します。

### 2. ルート定義

`vercel.json`または`next.config.js`でルートを定義します。

## 主要なキャッシングディレクティブ

### s-maxage

```
Cache-Control: s-maxage=N
```

レスポンスをN秒間キャッシュします。

### stale-while-revalidate

```
Cache-Control: s-maxage=N, stale-while-revalidate=Z
```

バックグラウンドで更新しながら、古いキャッシュを配信します。

## レスポンスがキャッシュされる条件

レスポンスがキャッシュされるには、以下の条件を満たす必要があります:

### 1. リクエストメソッド

- `GET`または`HEAD`メソッドを使用

### 2. ヘッダーの制限

- `Range`ヘッダーがない
- `Authorization`ヘッダーがない

### 3. ステータスコード

以下のステータスコードのいずれか:
- 200 (OK)
- 404 (Not Found)
- 301 (Moved Permanently)
- 302 (Found)
- 307 (Temporary Redirect)
- 308 (Permanent Redirect)

### 4. レスポンスサイズ

- レスポンスが10MB未満

### 5. レスポンスヘッダー

- `set-cookie`ヘッダーがない
- `private`、`no-cache`、`no-store`ディレクティブがない

## 高度な機能

### CDN-Cache-Control

CDN固有のキャッシュ制御を提供します。

```
CDN-Cache-Control: max-age=3600
```

### Vercel-CDN-Cache-Control

Vercel専用のキャッシュ制御ヘッダー（最高優先度）。

```
Vercel-CDN-Cache-Control: max-age=3600
```

### Varyヘッダー

コンテンツネゴシエーションのサポート。

```
Vary: Accept-Encoding
```

異なるエンコーディング（gzip、brotliなど）に対して別々にキャッシュします。

### リージョン別キャッシング

各リージョンで個別にキャッシュが管理されます。

## 制限事項

### キャッシュ可能なレスポンスサイズ

- 最大: 10-20MB

### 最大キャッシュ時間

- 最大: 1年（31,536,000秒）

### ベストエフォート型キャッシング

- リクエスト頻度に基づいたキャッシング
- 高頻度のリクエストがより効果的にキャッシュされる

## 実装例

### Next.js App Router

```typescript
export async function GET() {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

### Next.js Pages Router

```typescript
export async function getServerSideProps({ res }) {
  res.setHeader(
    'Cache-Control',
    's-maxage=60, stale-while-revalidate=30'
  );

  const data = await fetchData();

  return {
    props: { data },
  };
}
```

### vercel.json設定

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate=30"
        }
      ]
    }
  ]
}
```

## ベストプラクティス

### 1. 適切なキャッシュ時間の設定

コンテンツの更新頻度に応じて、適切な`s-maxage`値を設定します。

### 2. stale-while-revalidateの活用

ユーザーエクスペリエンスを向上させるために、古いキャッシュを即座に配信しながらバックグラウンドで更新します。

### 3. レスポンスサイズの最適化

10MB未満に保つことで、確実にキャッシュされるようにします。

### 4. 適切なステータスコードの使用

キャッシュ可能なステータスコード（200、404、301、302、307、308）を使用します。

### 5. キャッシュパージの活用

必要に応じて、キャッシュを手動でパージします。

詳細: [Cache Purge](/docs/edge-cache/purge)

## まとめ

Vercel Cacheを効果的に使用することで、Webアプリケーションのパフォーマンスを大幅に向上させ、サーバー負荷を削減し、ユーザーエクスペリエンスを改善できます。
