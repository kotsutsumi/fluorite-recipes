# Request Headers（リクエストヘッダー）

Vercelは、各デプロイメントへのリクエストと共にいくつかのヘッダーを送信します。これらのヘッダーは、Vercel Functionsでアクセス可能で、ドメイン、プロトコル、IPロケーションなどの情報を提供します。

## 主要なリクエストヘッダー

### 1. `host`

クライアントがアクセスしたドメイン名を表します。

**含まれる内容**:
- カスタムドメイン
- デプロイメントURL

### 2. `x-vercel-id`

リクエストが通過したVercelリージョンのリストを含みます。

**目的**:
- 無限リクエストループを防止

### 3. `x-forwarded-host`

`host`ヘッダーと同一の内容を含みます。

### 4. `x-forwarded-proto`

リクエストプロトコルを示します。

**値**:
- `https`: 本番環境
- `http`: 開発環境

### 5. `x-forwarded-for`

クライアントの公開IPアドレスを含みます。

**重要な注意事項**:
- Vercelはこのヘッダーを上書きしてIPスプーフィングを防止します

## ロケーションベースのヘッダー

### `x-vercel-ip-continent`

**内容**: 2文字の大陸コード

**例**: `NA`（北米）、`EU`（ヨーロッパ）、`AS`（アジア）

### `x-vercel-ip-country`

**内容**: 2文字の国コード（ISO 3166-1 alpha-2形式）

**例**: `US`（アメリカ）、`JP`（日本）、`GB`（イギリス）

### `x-vercel-ip-city`

**内容**: 都市名

**例**: `Tokyo`、`New York`、`London`

### `x-vercel-ip-latitude`

**内容**: 緯度座標

**例**: `35.6895`（東京の緯度）

### `x-vercel-ip-longitude`

**内容**: 経度座標

**例**: `139.6917`（東京の経度）

### `x-vercel-ip-timezone`

**内容**: タイムゾーン名

**例**: `Asia/Tokyo`、`America/New_York`、`Europe/London`

### `x-vercel-ip-postal-code`

**内容**: 郵便番号

**注意**: 利用可能な場合のみ

## デプロイメント固有のヘッダー

### `x-vercel-deployment-url`

**内容**: 一意のデプロイメントURL

**例**: `my-app-abc123.vercel.app`

## 実装例（Next.js App Router）

```typescript
export function GET(request: Request) {
  const host = request.headers.get('host');
  return new Response(`Host: ${host}`);
}
```

### ロケーション情報の取得例

```typescript
export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');
  const timezone = request.headers.get('x-vercel-ip-timezone');

  return new Response(
    `Location: ${city}, ${country} (${timezone})`
  );
}
```

## Enterprise機能

### Trusted Proxy

Enterpriseプランでは、カスタムの`X-Forwarded-For` IPに対応するTrusted Proxy機能を利用できます。

**用途**:
- カスタムプロキシの実装
- IPアドレスの正確な追跡

## ユースケース

### 1. ロケーションベースのコンテンツ配信

```typescript
export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');

  if (country === 'JP') {
    return new Response('日本語コンテンツ');
  }

  return new Response('English Content');
}
```

### 2. プロトコルベースのリダイレクト

```typescript
export function GET(request: Request) {
  const proto = request.headers.get('x-forwarded-proto');

  if (proto === 'http') {
    // HTTPSにリダイレクト
    const host = request.headers.get('host');
    return Response.redirect(`https://${host}`, 301);
  }

  return new Response('Secure connection');
}
```

### 3. デプロイメント情報の表示

```typescript
export function GET(request: Request) {
  const deploymentUrl = request.headers.get('x-vercel-deployment-url');

  return new Response(`Deployment: ${deploymentUrl}`);
}
```

## ベストプラクティス

### 1. セキュリティ

- `x-forwarded-for`ヘッダーは信頼できる情報として扱う
- Vercelが自動的にIPスプーフィング対策を実施

### 2. ロケーション情報の活用

- 地域に応じたコンテンツのカスタマイズ
- タイムゾーンに基づいた時刻表示
- 言語の自動選択

### 3. デバッグとモニタリング

- `x-vercel-id`を使用してリクエストの追跡
- デプロイメントURLを記録してトラブルシューティング

これらのリクエストヘッダーを活用することで、よりパーソナライズされた、セキュアで効率的なWebアプリケーションを構築できます。
