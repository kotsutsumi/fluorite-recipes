# Vercel SDK

Vercelアカウントをプログラムで操作するための型安全なSDK。

## 概要

`@vercel/sdk`は、Vercel REST APIのリソースとメソッドにアクセスできる型安全なTypeScript SDKです。

## インストール

以下のコマンドでVercel SDKをダウンロードおよびインストールします：

```bash
# pnpm
pnpm i @vercel/sdk

# npm
npm i @vercel/sdk

# yarn
yarn add @vercel/sdk
```

## 認証

Vercel SDKを使用するには、Vercelアクセストークンが必要です。

[トークンを作成](/welcome#creating-an-access-token)したら、以下のようにSDKを初期化できます：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: '<YOUR_BEARER_TOKEN_HERE>',
});
```

## トラブルシューティング

### トークンのスコープ

正しいVercel [スコープ](https://vercel.com/docs/dashboard-features#scope-selector)でトークンを作成していることを確認してください。

### 権限エラー（403）

トークンを送信しているにもかかわらず権限エラーが発生する場合、以下の問題が考えられます：

1. **トークンの有効期限切れ**
   - Vercelダッシュボードでトークンの有効期限を確認してください

2. **スコープの不一致**
   - トークンが正しいスコープにアクセスできていない
   - 適切なチームまたはアカウントレベルのアクセス権がない

3. **機能の利用制限**
   - リソースまたは操作がそのチームで利用できない
   - 例: AccessGroupsはEnterprise限定機能であり、Proプランのチームでは使用できません

## 使用例

Vercel SDKの使い方を以下のカテゴリの例で学習できます：

### デプロイメント自動化

デプロイメントの作成、管理、監視を自動化する例。

詳細は[Deployments Automation](/examples/deployments-automation)を参照してください。

### プロジェクト管理

プロジェクトの設定と管理をプログラムで行う例。

詳細は[Project Management](/examples/project-management)を参照してください。

## 主要な機能

### 型安全性

TypeScriptで書かれており、完全な型サポートを提供します：

```typescript
// 型推論とオートコンプリートのサポート
const deployment = await vercel.deployments.get({
  id: 'deployment-id'
});

// deployment オブジェクトは完全に型付けされています
console.log(deployment.url);
console.log(deployment.state);
```

### エンドポイントメソッド

すべてのエンドポイントのメソッドとコード例を確認するには、[リファレンスエンドポイントドキュメント](/endpoints)を参照してください。

## ベストプラクティス

1. **環境変数の使用**
   ```typescript
   const vercel = new Vercel({
     bearerToken: process.env.VERCEL_TOKEN,
   });
   ```

2. **エラーハンドリング**
   ```typescript
   try {
     const deployment = await vercel.deployments.get({ id: 'deployment-id' });
   } catch (error) {
     console.error('デプロイメントの取得に失敗しました:', error);
   }
   ```

3. **トークンのセキュリティ**
   - トークンをコードに直接含めない
   - 環境変数または安全なシークレット管理システムを使用
   - 定期的にトークンをローテーション

## 関連リンク

- [REST API ドキュメント](/docs/rest-api)
- [エンドポイントリファレンス](/endpoints)
- [アクセストークンの作成](/welcome#creating-an-access-token)
- [スコープセレクター](https://vercel.com/docs/dashboard-features#scope-selector)
