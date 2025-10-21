# Vercel REST API

Vercelのアカウントをプログラムで操作する。

## 概要

Vercel REST APIは、Vercelプラットフォームとプログラム的にやり取りするための包括的なインターフェースを提供します。

## 基本情報

### ベースURL

```
https://api.vercel.com
```

### サポートされるプロトコル

- HTTP/1
- HTTP/1.1
- HTTP/2

### コンテンツタイプ

すべてのリクエストとレスポンスは**JSON形式**である必要があります。

## 認証

### アクセストークンの作成

1. アカウント設定でアクセストークンを作成
2. トークンのスコープと有効期限を設定
3. Authorizationヘッダーでトークンを使用

### 認証ヘッダー

```
Authorization: Bearer <TOKEN>
```

### 例: トークン認証

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  https://api.vercel.com/v1/user
```

## データ型

APIは標準的なJSON データ型をサポートしています：

- String（文字列）
- Number（数値）
- Boolean（真偽値）
- Array（配列）
- Object（オブジェクト）

## ページネーション

### デフォルト設定

- デフォルトの制限: 20レコード
- カスタマイズ可能な制限とオフセット

### Node.jsでのページネーション例

```javascript
const limit = 20;
let offset = 0;
let hasMore = true;

while (hasMore) {
  const response = await fetch(
    `https://api.vercel.com/v1/deployments?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  // データを処理
  processDeployments(data.deployments);

  // 次のページがあるかチェック
  offset += limit;
  hasMore = data.deployments.length === limit;
}
```

## レート制限

### レート制限ヘッダー

レスポンスには以下のレート制限情報が含まれます：

- `X-RateLimit-Limit`: 期間内の最大リクエスト数
- `X-RateLimit-Remaining`: 残りのリクエスト数
- `X-RateLimit-Reset`: レート制限がリセットされる時刻（Unixタイムスタンプ）

### レート制限エラーの処理

```javascript
const response = await fetch('https://api.vercel.com/v1/user', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  const waitTime = parseInt(resetTime) * 1000 - Date.now();

  console.log(`レート制限に達しました。${waitTime}ms待機します。`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}
```

## バージョニング

APIはバージョン管理されており、URLパスにバージョン番号が含まれます：

```
https://api.vercel.com/v1/...
https://api.vercel.com/v2/...
```

## 主要なエンドポイントカテゴリ

- **Deployments**: デプロイメントの作成と管理
- **Projects**: プロジェクトの設定と管理
- **Domains**: カスタムドメインの管理
- **Teams**: チームとメンバーの管理
- **Secrets**: 環境変数とシークレットの管理
- **Aliases**: デプロイメントエイリアスの管理

## エラー処理

APIは標準的なHTTPステータスコードを返します：

- `200`: 成功
- `400`: 不正なリクエスト
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソースが見つからない
- `429`: レート制限超過
- `500`: サーバーエラー

## ベストプラクティス

1. **認証トークンの安全な保管**: 環境変数に保存し、コードに直接含めない
2. **レート制限の尊重**: リクエスト間に適切な間隔を設ける
3. **エラーハンドリング**: すべてのAPIコールに適切なエラー処理を実装
4. **ページネーションの活用**: 大量のデータを取得する際は適切にページネーションを使用

## 関連リンク

- [エンドポイントリファレンスドキュメント](/endpoints)
- [Vercel SDK](/docs/sdk)
- [認証ガイド](/welcome#creating-an-access-token)
