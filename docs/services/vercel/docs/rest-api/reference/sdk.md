# Vercel SDK

型安全なTypeScript SDKでVercel REST APIにアクセスします。

## 📚 目次

- [概要](#概要)
- [インストール](#インストール)
- [認証設定](#認証設定)
- [よくある問題](#よくある問題)
- [学習リソース](#学習リソース)

## 概要

Vercel SDKは、Vercel REST APIのリソースとメソッドにアクセスできる型安全なTypeScript SDKです。TypeScriptの型定義により、IDEでの自動補完とコンパイル時の型チェックが可能になります。

```typescript
interface VercelSDKFeatures {
  typeSafety: "完全なTypeScript型定義";
  autoCompletion: "IDEでの自動補完サポート";
  restAPIAccess: "すべてのREST APIエンドポイントへのアクセス";
  easyAuthentication: "シンプルな認証設定";
}
```

## インストール

### pnpm

```bash
pnpm i @vercel/sdk
```

### npm

```bash
npm i @vercel/sdk
```

### yarn

```bash
yarn add @vercel/sdk
```

## 認証設定

### 1. Vercelアクセストークンの取得

1. Vercelダッシュボードにログイン
2. **Settings** → **Tokens**に移動
3. 新しいトークンを作成
4. トークンを安全に保存

### 2. SDKの初期化

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: '<YOUR_TOKEN>'
});
```

### 3. 基本的な使用例

```typescript
import { Vercel } from '@vercel/sdk';

// SDKクライアントの初期化
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

// デプロイメントの取得
async function getDeployments() {
  try {
    const deployments = await vercel.deployments.list();
    console.log(deployments);
  } catch (error) {
    console.error('Error:', error);
  }
}

// プロジェクトの取得
async function getProjects() {
  try {
    const projects = await vercel.projects.list();
    console.log(projects);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## よくある問題

### 権限エラー（403 Forbidden）

権限エラーが発生する主な原因：

```typescript
interface PermissionIssues {
  expiredToken: {
    problem: "トークンの有効期限が切れている";
    solution: "ダッシュボードでトークンの有効期限を確認し、必要に応じて新しいトークンを作成";
  };
  insufficientScope: {
    problem: "不十分なスコープアクセスまたは間違ったチーム関連付け";
    solution: "トークンのスコープとチーム設定を確認";
  };
  featureUnavailable: {
    problem: "現在のプランでは機能が利用できない";
    solution: "プランをアップグレード（例：AccessGroupsはEnterpriseプランが必要）";
  };
}
```

### トラブルシューティング手順

1. **トークンの確認**
   - トークンが有効期限内か確認
   - 正しいトークンを使用しているか確認

2. **スコープの確認**
   - トークンに必要な権限があるか確認
   - 正しいチームに関連付けられているか確認

3. **プランの確認**
   - 使用しようとしている機能が現在のプランで利用可能か確認
   - Enterprise機能（AccessGroupsなど）を使用する場合はプランをアップグレード

## 学習リソース

SDKの使用方法を学ぶための例を、以下のカテゴリで提供しています：

### デプロイメントの自動化
[Deployments Automation](/docs/services/vercel/docs/rest-api/reference/examples/deployments-automation.md)

デプロイメントの作成、管理、自動化に関する実装例

### プロジェクト管理
[Project Management](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)

プロジェクトの作成、更新、削除などの操作例

### ドメイン管理
[Domain Management](/docs/services/vercel/docs/rest-api/reference/examples/domain-management.md)

カスタムドメインの追加、設定、管理に関する例

### チーム管理
[Team Management](/docs/services/vercel/docs/rest-api/reference/examples/team-management.md)

チームメンバーの管理、権限設定などの例

### 環境変数
[Environment Variables](/docs/services/vercel/docs/rest-api/reference/examples/environment-variables.md)

環境変数の作成、更新、削除に関する実装ガイド

### ログとモニタリング
[Logs and Monitoring](/docs/services/vercel/docs/rest-api/reference/examples/logs-monitoring.md)

ログの取得、モニタリング、分析に関する例

### インテグレーション
[Integrations](/docs/services/vercel/docs/rest-api/reference/examples/integrations.md)

外部サービスとの統合に関する実装例

## 高度な使用例

### チームコンテキストでの操作

```typescript
// チームIDを指定してプロジェクトを取得
const projects = await vercel.projects.list({
  teamId: 'team_abc123'
});

// チームのデプロイメントを取得
const deployments = await vercel.deployments.list({
  teamId: 'team_abc123'
});
```

### エラーハンドリング

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

async function safeAPICall() {
  try {
    const result = await vercel.deployments.list();
    return result;
  } catch (error) {
    if (error.status === 403) {
      console.error('権限エラー: トークンの権限を確認してください');
    } else if (error.status === 429) {
      console.error('レート制限エラー: しばらく待ってから再試行してください');
    } else {
      console.error('APIエラー:', error.message);
    }
    throw error;
  }
}
```

### ページネーション

```typescript
// ページネーションを使用したデプロイメント取得
async function getAllDeployments() {
  const deployments = [];
  let hasMore = true;
  let until = undefined;

  while (hasMore) {
    const response = await vercel.deployments.list({
      limit: 100,
      until
    });

    deployments.push(...response.deployments);

    if (response.pagination.next) {
      until = response.pagination.next;
    } else {
      hasMore = false;
    }
  }

  return deployments;
}
```

## ベストプラクティス

### セキュリティ

- トークンは環境変数で管理
- トークンをコードにハードコードしない
- 最小権限の原則に従う
- 定期的にトークンをローテーション

### パフォーマンス

- 必要なデータのみを取得
- ページネーションを活用
- レート制限を考慮した実装
- エラーハンドリングを適切に実装

### 型安全性

- TypeScriptの型定義を活用
- 型アサーションは最小限に
- 返り値の型を明示的に定義

## 関連リンク

- [Vercel REST API - ウェルカム](/docs/services/vercel/docs/rest-api/reference/welcome.md)
- [Vercel REST API - エラー](/docs/services/vercel/docs/rest-api/reference/errors.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/sdk)
