# Vercel SDK - デプロイメント自動化

Vercel SDKを使用してデプロイメントをプログラムで管理する実用的な例を紹介します。

## 📚 目次

- [概要](#概要)
- [認証](#認証)
- [コアAPIエンドポイント](#コアapiエンドポイント)
- [実装パターン](#実装パターン)
- [Gitソース設定](#gitソース設定)

## 概要

このドキュメントでは、Vercel SDKを使用してデプロイメントをプログラムで管理する実践的な方法を、実例を通じて説明します。

```typescript
interface DeploymentAutomationFeatures {
  createDeployment: "新しいデプロイメントの作成";
  getDeploymentStatus: "デプロイメントステータスの取得";
  createAlias: "カスタムドメインのエイリアス作成";
  polling: "ステータスのポーリング監視";
}
```

## 認証

SDKには Bearer トークンによる認証が必要です：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});
```

### 環境変数の設定

```bash
# .env ファイル
VERCEL_TOKEN=your_vercel_token_here
```

## コアAPIエンドポイント

### デプロイメントの作成

```typescript
interface CreateDeploymentMethod {
  method: "vercel.deployments.createDeployment()";
  parameters: {
    projectName: string;
    targetEnvironment: "production" | "preview" | "development";
    gitSource: GitSourceDetails;
  };
}
```

**使用例:**

```typescript
const deployment = await vercel.deployments.createDeployment({
  name: "my-project",
  target: "production",
  gitSource: {
    type: "github",
    repo: "username/repository",
    ref: "main"
  }
});
```

### デプロイメントステータスの取得

```typescript
interface GetDeploymentMethod {
  method: "vercel.deployments.getDeployment()";
  parameters: {
    deploymentId: string;
    gitRepoInfo?: boolean;
  };
}
```

**使用例:**

```typescript
const status = await vercel.deployments.getDeployment({
  idOrUrl: deployment.id
});

console.log(`Status: ${status.readyState}`);
```

### エイリアスの作成

```typescript
interface AssignAliasMethod {
  method: "vercel.aliases.assignAlias()";
  description: "カスタムドメインをデプロイメントにリンク";
}
```

**使用例:**

```typescript
const alias = await vercel.aliases.assignAlias({
  deploymentId: deployment.id,
  alias: "my-custom-domain.com"
});
```

## 実装パターン

### 基本的なデプロイメント

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function createBasicDeployment() {
  try {
    // デプロイメントの作成
    const deployment = await vercel.deployments.createDeployment({
      name: "my-project",
      gitSource: {
        type: "github",
        repo: "username/my-repository",
        ref: "main"
      }
    });

    console.log(`Deployment ID: ${deployment.id}`);
    console.log(`Initial Status: ${deployment.readyState}`);

    return deployment;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}
```

### ポーリングとエイリアス作成を含む高度なデプロイメント

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function deploymentWithPollingAndAliasing() {
  try {
    // 1. GitHubソース設定でデプロイメント作成
    const deployment = await vercel.deployments.createDeployment({
      name: "my-project",
      target: "production",
      gitSource: {
        type: "github",
        org: "my-org",
        repo: "my-repository",
        ref: "main"
      }
    });

    console.log(`Deployment created: ${deployment.id}`);

    // 2. 5秒間隔でステータスをポーリング
    let currentStatus = deployment.readyState;

    while (currentStatus !== "READY" && currentStatus !== "ERROR") {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const status = await vercel.deployments.getDeployment({
        idOrUrl: deployment.id
      });

      currentStatus = status.readyState;
      console.log(`Current status: ${currentStatus}`);

      // デプロイメントの状態を処理
      switch (currentStatus) {
        case "BUILDING":
          console.log("Building deployment...");
          break;
        case "INITIALIZING":
          console.log("Initializing deployment...");
          break;
        case "READY":
          console.log("Deployment is ready!");
          break;
        case "ERROR":
          console.error("Deployment failed!");
          throw new Error("Deployment failed");
      }
    }

    // 3. デプロイメントがREADYになったらドメインエイリアスを作成
    if (currentStatus === "READY") {
      const alias = await vercel.aliases.assignAlias({
        deploymentId: deployment.id,
        alias: "my-custom-domain.com"
      });

      console.log(`Alias created: ${alias.alias}`);
    }

    return deployment;
  } catch (error) {
    console.error('Deployment process failed:', error);
    throw error;
  }
}
```

### デプロイメントステータスの種類

```typescript
type DeploymentState =
  | "BUILDING"      // ビルド中
  | "INITIALIZING"  // 初期化中
  | "READY"         // 準備完了
  | "ERROR"         // エラー発生
  | "QUEUED"        // キュー待機中
  | "CANCELED";     // キャンセル済み
```

## Gitソース設定

### GitHubリポジトリの設定

```typescript
interface GitSourceConfiguration {
  type: "github";
  repo: string;        // リポジトリ名
  org: string;         // 組織名またはユーザー名
  ref: string;         // ブランチ、タグ、またはコミット参照
}
```

**重要な注意事項:**
- 個人アカウントの場合、`org` フィールドには GitHubユーザー名を使用
- 組織の場合、`org` フィールドには組織名を使用

### 使用例

```typescript
// 個人アカウントの場合
const personalRepoSource = {
  type: "github",
  org: "github-username",
  repo: "my-repository",
  ref: "main"
};

// 組織の場合
const orgRepoSource = {
  type: "github",
  org: "my-organization",
  repo: "my-repository",
  ref: "develop"
};

// 特定のコミットを指定
const specificCommitSource = {
  type: "github",
  org: "my-organization",
  repo: "my-repository",
  ref: "abc123def456"  // コミットハッシュ
};
```

## 高度な使用例

### 環境別デプロイメント

```typescript
async function deployToEnvironment(environment: "production" | "preview" | "development") {
  const branch = environment === "production" ? "main" :
                 environment === "preview" ? "staging" :
                 "develop";

  const deployment = await vercel.deployments.createDeployment({
    name: "my-project",
    target: environment,
    gitSource: {
      type: "github",
      org: "my-org",
      repo: "my-repository",
      ref: branch
    }
  });

  return deployment;
}

// 使用例
await deployToEnvironment("production");
await deployToEnvironment("preview");
```

### エラーハンドリング付きデプロイメント

```typescript
async function safeDeployment(config: any) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const deployment = await vercel.deployments.createDeployment(config);

      // ステータスチェック
      const finalStatus = await waitForDeployment(deployment.id);

      if (finalStatus === "READY") {
        return deployment;
      } else if (finalStatus === "ERROR") {
        throw new Error("Deployment failed");
      }
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt >= maxRetries) {
        throw new Error(`Deployment failed after ${maxRetries} attempts`);
      }

      // 指数バックオフで再試行
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

async function waitForDeployment(deploymentId: string, maxWaitTime = 600000) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const status = await vercel.deployments.getDeployment({
      idOrUrl: deploymentId
    });

    if (status.readyState === "READY" || status.readyState === "ERROR") {
      return status.readyState;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  throw new Error("Deployment timeout");
}
```

## ベストプラクティス

### デプロイメント管理

1. **ステータスポーリング**: 5-10秒間隔で適切にポーリング
2. **タイムアウト設定**: 最大待機時間を設定（推奨: 10分）
3. **エラーハンドリング**: 適切な再試行ロジックを実装
4. **ログ記録**: すべてのデプロイメントイベントを記録

### セキュリティ

1. **トークン管理**: 環境変数でトークンを管理
2. **権限制御**: 最小権限の原則に従う
3. **監査ログ**: デプロイメント履歴を保持

### パフォーマンス

1. **並列処理**: 複数のデプロイメントを並列化（適切な制限内で）
2. **キャッシング**: デプロイメント設定をキャッシュ
3. **最適化**: 不要なポーリングを避ける

## 関連リンク

- [Vercel REST API - ウェルカム](/docs/services/vercel/docs/rest-api/reference/welcome.md)
- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [環境変数](/docs/services/vercel/docs/rest-api/reference/examples/environment-variables.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/deployments-automation)
