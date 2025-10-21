# Vercel SDK - プロジェクト管理

TypeScriptを使用してプロジェクトをプログラムで管理する方法を説明します。

## 📚 目次

- [概要](#概要)
- [コア機能](#コア機能)
- [基本的なプロジェクト作成](#基本的なプロジェクト作成)
- [高度なプロジェクトセットアップ](#高度なプロジェクトセットアップ)

## 概要

一般的なプロジェクト管理タスクの実践的な実装方法を紹介します。

## コア機能

### 基本的なプロジェクト作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function createBasicProject() {
  try {
    const project = await vercel.projects.createProject({
      requestBody: {
        name: "my-new-project",
        framework: "nextjs"
      }
    });

    console.log('Project created successfully:');
    console.log(`- Name: ${project.name}`);
    console.log(`- ID: ${project.id}`);
    console.log(`- Framework: ${project.framework}`);

    return project;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}
```

### プロジェクト作成パラメータ

```typescript
interface ProjectCreationParams {
  name: string;              // プロジェクト名
  framework?: string;        // フレームワーク選択（例: "nextjs", "vite", "gatsby"）
  gitRepository?: {          // GitHubリポジトリ統合（オプション）
    type: "github";
    repo: string;
  };
}
```

## 高度なプロジェクトセットアップ

GitHubリポジトリ接続と環境変数設定を統合した包括的なアプローチ：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function createProjectWithGitHubAndEnv() {
  try {
    // 1. GitHubリポジトリ統合でプロジェクトを作成
    const project = await vercel.projects.createProject({
      requestBody: {
        name: "my-advanced-project",
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: "my-org/my-repository"
        }
      }
    });

    console.log(`Project created: ${project.id}`);

    // 2. 環境変数を設定
    const envVariables = [
      {
        key: "DATABASE_URL",
        value: "postgresql://user:pass@host:5432/db",
        type: "encrypted",
        target: ["production", "preview"]
      },
      {
        key: "API_KEY",
        value: "sk_live_...",
        type: "encrypted",
        target: ["production"]
      },
      {
        key: "PUBLIC_URL",
        value: "https://example.com",
        type: "plain",
        target: ["production", "preview", "development"]
      }
    ];

    // 3. 複数の環境変数を一括リクエストで追加
    for (const envVar of envVariables) {
      await vercel.projects.createProjectEnv({
        idOrName: project.id,
        upsert: "true",
        requestBody: envVar
      });

      console.log(`✓ Added environment variable: ${envVar.key}`);
    }

    console.log('\nProject setup completed successfully!');
    return project;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}
```

### 重要な前提条件

```typescript
interface GitHubIntegrationRequirements {
  repositoryExists: "リポジトリが事前に作成されている必要がある";
  accountConnected: "GitHubアカウントがVercelアカウントに接続されている必要がある";
}
```

## 環境変数管理

### 環境変数の設定

```typescript
type TargetEnvironment = "production" | "preview" | "development";
type VariableType = "encrypted" | "plain";

interface EnvironmentVariable {
  key: string;
  value: string;
  type: VariableType;
  target: TargetEnvironment[];
}
```

### バッチ操作

複数の環境変数を効率的に追加：

```typescript
async function addMultipleEnvironmentVariables(
  projectId: string,
  variables: EnvironmentVariable[]
) {
  const results = [];

  for (const variable of variables) {
    try {
      const result = await vercel.projects.createProjectEnv({
        idOrName: projectId,
        upsert: "true",
        requestBody: variable
      });

      results.push({ variable: variable.key, status: 'success' });
      console.log(`✓ ${variable.key}`);
    } catch (error) {
      results.push({ variable: variable.key, status: 'failed', error });
      console.error(`✗ ${variable.key}:`, error);
    }
  }

  return results;
}
```

## 実装パターン

### 完全なプロジェクトセットアップワークフロー

```typescript
interface ProjectSetupConfig {
  name: string;
  framework: string;
  gitRepository?: {
    type: "github";
    repo: string;
  };
  environmentVariables: EnvironmentVariable[];
  domains?: string[];
}

async function setupCompleteProject(config: ProjectSetupConfig) {
  console.log(`Setting up project: ${config.name}\n`);

  // 1. プロジェクトを作成
  const project = await vercel.projects.createProject({
    requestBody: {
      name: config.name,
      framework: config.framework,
      gitRepository: config.gitRepository
    }
  });

  console.log(`✓ Project created: ${project.id}`);

  // 2. 環境変数を追加
  if (config.environmentVariables.length > 0) {
    console.log('\nAdding environment variables...');
    await addMultipleEnvironmentVariables(
      project.id,
      config.environmentVariables
    );
  }

  // 3. ドメインを追加（指定されている場合）
  if (config.domains && config.domains.length > 0) {
    console.log('\nAdding domains...');

    for (const domain of config.domains) {
      await vercel.projects.addProjectDomain({
        idOrName: project.id,
        requestBody: { name: domain }
      });

      console.log(`✓ Domain added: ${domain}`);
    }
  }

  console.log('\n✓ Project setup completed successfully!');
  return project;
}

// 使用例
await setupCompleteProject({
  name: "my-production-app",
  framework: "nextjs",
  gitRepository: {
    type: "github",
    repo: "my-org/production-app"
  },
  environmentVariables: [
    {
      key: "DATABASE_URL",
      value: "postgresql://...",
      type: "encrypted",
      target: ["production"]
    },
    {
      key: "API_KEY",
      value: "sk_live_...",
      type: "encrypted",
      target: ["production", "preview"]
    }
  ],
  domains: ["example.com", "www.example.com"]
});
```

### エラーハンドリング付きプロジェクト作成

```typescript
async function createProjectWithRetry(
  config: any,
  maxRetries: number = 3
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const project = await vercel.projects.createProject({
        requestBody: config
      });

      console.log(`✓ Project created on attempt ${attempt + 1}`);
      return project;
    } catch (error) {
      attempt++;

      if (attempt >= maxRetries) {
        console.error(`Failed to create project after ${maxRetries} attempts`);
        throw error;
      }

      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## 認証

すべてのSDK操作には`VERCEL_TOKEN`環境変数が必要です：

```bash
# .env
VERCEL_TOKEN=your_vercel_token_here
```

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});
```

## ベストプラクティス

### プロジェクト作成

1. **命名規則**: 一貫性のある命名パターンを使用
2. **フレームワーク指定**: 正しいフレームワークを選択
3. **Git統合**: リポジトリが存在し、接続されていることを確認
4. **環境変数**: 作成時に必要な変数を設定

### セキュリティ

1. **機密情報**: 環境変数には`encrypted`型を使用
2. **最小権限**: 必要な環境にのみ変数を追加
3. **トークン管理**: Vercelトークンを安全に保管

### 効率性

1. **バッチ処理**: 複数の操作を効率的にグループ化
2. **エラーハンドリング**: 適切な再試行ロジックを実装
3. **検証**: 操作後にプロジェクト設定を確認

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [環境変数](/docs/services/vercel/docs/rest-api/reference/examples/environment-variables.md)
- [ドメイン管理](/docs/services/vercel/docs/rest-api/reference/examples/domain-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/project-management)
