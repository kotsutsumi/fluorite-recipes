# OPTIONS Allowlist

## 概要

OPTIONS Allowlistは、CORSプリフライト`OPTIONS`リクエストに対して、デプロイメント保護を無効化する機能です。

### 対象プラン

すべてのVercelプランで利用可能

### 主な特徴

- CORS preflight `OPTIONS`リクエストに対して保護を解除
- 特定のパスに対して認証、パスワード保護、信頼済みIPなどの保護設定を無効化
- APIエンドポイントのCORSエラーを解決

## CORSプリフライトリクエストとは

### 概要

ブラウザは、特定のクロスオリジンHTTPリクエストを送信する前に、`OPTIONS`メソッドを使用してプリフライトリクエストを送信します。

### プリフライトが発生する条件

以下のいずれかに該当する場合、プリフライトリクエストが送信されます：

- カスタムヘッダーを使用する場合
- `GET`、`POST`、`HEAD`以外のHTTPメソッド
- `Content-Type`が特定の値以外（例：`application/json`）

### 例

```javascript
// このリクエストはプリフライトを引き起こす
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' })
});

// ブラウザが送信するプリフライトリクエスト:
// OPTIONS /data
// Access-Control-Request-Method: POST
// Access-Control-Request-Headers: content-type
```

## 使用方法

### パスの指定方法

OPTIONS Allowlistでは、パスプレフィックスを指定します。指定したパスで始まるすべての`OPTIONS`リクエストが保護から除外されます。

#### 例

`/api`を指定した場合、以下のすべてのパスが対象：

- `/api/v1/users`
- `/api/v2/projects`
- `/api/data`
- `/api/anything/else`

## 設定手順

### OPTIONS Allowlistの有効化

#### ダッシュボードから設定

1. Vercelダッシュボードからプロジェクトを選択
2. 「設定」タブに移動
3. 「デプロイメント保護」セクションを選択
4. 「OPTIONS Allowlist」セクションを見つける
5. トグルを「無効」から「有効」に切り替え
6. 「パスを追加」をクリック
7. 保護を解除したいパスを入力（例：`/api`、`/webhooks`）
8. 「保存」をクリック

#### APIから設定

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "optionsAllowlist": {
      "paths": ["/api", "/webhooks"]
    }
  }'
```

### OPTIONS Allowlistの無効化

#### ダッシュボードから無効化

1. 同じ設定画面に移動
2. トグルを「有効」から「無効」に切り替え
3. 「保存」をクリック

#### APIから無効化

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "optionsAllowlist": null
  }'
```

## ユースケース

### 1. APIエンドポイントのCORS対応

**シナリオ**: フロントエンドアプリケーションが別ドメインのAPIにアクセス

```
パス: /api
対象: /api/users, /api/products, /api/orders など
```

### 2. Webhookエンドポイント

**シナリオ**: 外部サービスからのWebhook受信

```
パス: /webhooks
対象: /webhooks/stripe, /webhooks/github など
```

### 3. GraphQL API

**シナリオ**: GraphQLエンドポイントへのクロスオリジンアクセス

```
パス: /graphql
対象: /graphql
```

### 4. 複数のAPIバージョン

**シナリオ**: バージョン付きAPIエンドポイント

```
パス: /api/v1, /api/v2
対象: それぞれのバージョンのすべてのエンドポイント
```

## 注意点

### 保護の範囲

- **対象**: `OPTIONS`リクエストのみ
- **対象外**: `GET`、`POST`、`PUT`、`DELETE`などの実際のリクエスト

### セキュリティ影響

OPTIONS Allowlistを有効化しても、以下は保護されます：

- 実際のAPIリクエスト（`GET`、`POST`など）
- 他のパスの`OPTIONS`リクエスト

### パスの削除

パスを削除すると、再びプロジェクトのデプロイメント保護設定が適用されます。

## 実装例

### 例1: 単一のAPIパス

```json
{
  "optionsAllowlist": {
    "paths": ["/api"]
  }
}
```

**効果**: `/api`で始まるすべてのパスの`OPTIONS`リクエストが保護から除外されます。

### 例2: 複数のパス

```json
{
  "optionsAllowlist": {
    "paths": [
      "/api",
      "/webhooks",
      "/graphql"
    ]
  }
}
```

**効果**: 指定したすべてのパスの`OPTIONS`リクエストが保護から除外されます。

### 例3: バージョン付きAPI

```json
{
  "optionsAllowlist": {
    "paths": [
      "/api/v1",
      "/api/v2",
      "/api/v3"
    ]
  }
}
```

**効果**: 各APIバージョンの`OPTIONS`リクエストが個別に保護から除外されます。

## トラブルシューティング

### 問題1: CORSエラーが解決しない

**確認事項**:
- [ ] OPTIONS Allowlistが有効化されているか
- [ ] 正しいパスが設定されているか
- [ ] サーバー側でCORSヘッダーが正しく設定されているか

**解決策**:
```javascript
// Next.js APIルートでCORSヘッダーを設定
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 実際の処理
}
```

### 問題2: 一部のエンドポイントでCORSエラーが発生

**原因**: パスが OPTIONS Allowlist に含まれていない

**解決策**:
1. エラーが発生するエンドポイントのパスを確認
2. OPTIONS Allowlist に該当するパスを追加
3. より広いパスプレフィックスを使用（例：`/api`の代わりに`/`）

### 問題3: 設定が反映されない

**確認事項**:
- [ ] 設定が保存されているか
- [ ] 新しいデプロイメントで確認しているか
- [ ] ブラウザのキャッシュがクリアされているか

**解決策**:
1. 設定を再保存
2. 新しいデプロイメントを作成
3. ブラウザのキャッシュをクリア

## ベストプラクティス

### 1. 最小限のパス

必要最小限のパスのみをOPTIONS Allowlistに追加します。

```json
// 良い例
{
  "paths": ["/api/public"]
}

// 悪い例（広すぎる）
{
  "paths": ["/"]
}
```

### 2. 明確な命名

APIパスには明確な命名規則を使用します。

```json
{
  "paths": [
    "/api/public",
    "/api/webhooks",
    "/api/external"
  ]
}
```

### 3. 定期的なレビュー

OPTIONS Allowlistを定期的に見直し、不要なパスは削除します。

### 4. ドキュメント化

どのパスがOPTIONS Allowlistに含まれているか、その理由を文書化します。

## CORSヘッダーの設定例

### Next.js API Routes

```typescript
// pages/api/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // プリフライトリクエストへの応答
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 実際のAPI処理
  res.status(200).json({ message: 'Hello' });
}
```

### Express.js

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORSミドルウェア
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// または手動で設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

export default app;
```

## 関連リソース

- [デプロイメント保護](/docs/deployment-protection)
- [デプロイメント保護のバイパス方法](/docs/deployment-protection/methods-to-bypass-deployment-protection)
- [CORS設定ガイド](/docs/cors)
- [Next.js CORS設定](https://nextjs.org/docs/api-routes/api-middlewares#cors)
