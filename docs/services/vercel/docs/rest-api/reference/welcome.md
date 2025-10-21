# Vercel REST API - ウェルカムガイド

Vercelの REST APIを使用してプログラムからアカウントと対話する方法を学びます。

## 📚 目次

- [概要](#概要)
- [API基礎](#api基礎)
- [認証](#認証)
- [データ型](#データ型)
- [ページネーション](#ページネーション)
- [レート制限](#レート制限)
- [バージョニング](#バージョニング)

## 概要

Vercel REST APIは、デプロイメント管理、ドメイン設定、シークレット管理など、アカウントとプログラムで対話するための機能を提供します。HTTP対応の任意の言語で使用できます。

## API基礎

### エンドポイントベースURL

```
https://api.vercel.com
```

### サポートされるプロトコル

- HTTP/1、HTTP/1.1、HTTP/2（HTTP/2を推奨）
- TLS 1.2 および TLS 1.3（再開機能付き）

### リクエストヘッダー

すべてのリクエストには以下のヘッダーが必要です：

```
Content-Type: application/json
```

## 認証

### Bearer トークン認証

すべてのAPIリクエストには、Authorizationヘッダーでbearerトークンを使用します：

```
Authorization: Bearer <TOKEN>
```

### トークンの作成手順

```typescript
interface TokenCreationSteps {
  step1: "アカウント設定ダッシュボードにアクセス";
  step2: "サイドバーから「Tokens」を選択";
  step3: "トークンに説明的な名前を付ける";
  step4: "チームスコープを選択";
  step5: "有効期限を設定（1日〜1年を推奨）";
  step6: "生成された値を安全に保存";
}
```

### チームリソースへのアクセス

チームのリソースにアクセスする場合は、エンドポイントに `?teamId=[teamID]` クエリパラメータを追加します。

```
GET https://api.vercel.com/v6/deployments?teamId=team_abc123
```

## データ型

APIで使用される8つの型定義：

```typescript
interface VercelAPIDataTypes {
  ID: {
    description: "一意の識別子";
    format: "文字列";
  };
  String: {
    description: "テキストデータ";
  };
  Integer: {
    description: "整数値";
  };
  Float: {
    description: "浮動小数点数";
  };
  Map: {
    description: "キーと値のペアのオブジェクト";
  };
  List: {
    description: "配列";
  };
  Enum: {
    description: "事前定義された値のセット";
  };
  Date: {
    description: "日付値";
    types: ["IsoDate", "Boolean"];
  };
}
```

## ページネーション

### デフォルト制限

- デフォルト: 20アイテム
- 最大: 100アイテム

### ページネーションオブジェクト

```typescript
interface PaginationObject {
  count: number;           // 返されたアイテム数
  next: number | null;     // 次のページのタイムスタンプ
  prev: number | null;     // 前のページのタイムスタンプ
}
```

### 使用例

```
GET /v6/deployments?limit=20&until=1540095775941
```

## レート制限

### レスポンスヘッダー

```typescript
interface RateLimitHeaders {
  "X-RateLimit-Limit": number;      // エンドポイントごとの制限
  "X-RateLimit-Remaining": number;  // 残りのリクエスト数
  "X-RateLimit-Reset": number;      // リセットされるタイムスタンプ
}
```

### 制限超過時の動作

レート制限を超えると、`429 Too Many Requests` ステータスコードが返されます。

## バージョニング

### エンドポイントのバージョン

エンドポイントのバージョンはURLに含まれます：

```
/v6/deployments
/v9/projects
```

### バージョニングの特徴

- エンドポイントごとに異なるバージョンが存在
- レスポンスに追加のキーが含まれる場合でもバージョンは変更されない
- 破壊的な変更がある場合にのみバージョンがインクリメント

## クイックスタート例

### 基本的なリクエスト

```bash
curl -X GET "https://api.vercel.com/v6/deployments" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json"
```

### チームリソースへのリクエスト

```bash
curl -X GET "https://api.vercel.com/v9/projects?teamId=team_abc123" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json"
```

### ページネーション付きリクエスト

```bash
curl -X GET "https://api.vercel.com/v6/deployments?limit=50&until=1540095775941" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json"
```

## ベストプラクティス

### セキュリティ

- トークンは安全に保存し、公開リポジトリにコミットしない
- 環境変数を使用してトークンを管理
- 必要最小限の権限でトークンを作成
- 定期的にトークンをローテーション

### パフォーマンス

- HTTP/2を使用して接続を最適化
- レート制限ヘッダーを監視
- 適切なページネーションサイズを使用
- 不要なリクエストを避ける

### エラーハンドリング

- レート制限エラー（429）に対して再試行ロジックを実装
- 認証エラー（401/403）を適切に処理
- タイムアウトとネットワークエラーに対応

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [Vercel REST API - エラー](/docs/services/vercel/docs/rest-api/reference/errors.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/welcome)
