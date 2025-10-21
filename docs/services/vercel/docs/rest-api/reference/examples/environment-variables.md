# Vercel SDK - 環境変数管理

Vercel SDKを使用してプロジェクト全体で環境変数をプログラムで管理する方法を説明します。

## 📚 目次

- [概要](#概要)
- [コア機能](#コア機能)
- [プロジェクトへの変数追加](#プロジェクトへの変数追加)
- [変数のプロパティ](#変数のプロパティ)
- [複数プロジェクト管理](#複数プロジェクト管理)
- [セキュリティプラクティス](#セキュリティプラクティス)
- [認証](#認証)

## 概要

TypeScriptを使用して、単一および複数プロジェクトのシナリオで環境変数を管理する実践的な実装方法を紹介します。

```typescript
interface EnvironmentVariableManagement {
  addVariables: "環境変数の追加と更新";
  multiProject: "複数プロジェクトでの変数管理";
  encryption: "機密情報の暗号化";
  targeting: "環境ごとのターゲティング";
}
```

## コア機能

### プロジェクトへの変数追加

```typescript
interface AddVariablesMethod {
  method: "createProjectEnv()";
  features: {
    upsert: "既存変数の更新または新規作成";
    targeting: "特定環境へのターゲティング";
    encryption: "機密データの暗号化サポート";
  };
}
```

SDKは環境変数の追加と更新のためのメソッドを提供します。基本的な実装：

1. 認証でVercelクライアントをインスタンス化
2. プロジェクト名またはIDを指定
3. キー、値、ターゲット環境を定義
4. `upsert`オプションで`createProjectEnv()`メソッドを使用

### 基本的な使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

async function addEnvironmentVariable() {
  const result = await vercel.projects.createProjectEnv({
    idOrName: "my-project",
    upsert: "true",  // 既存の場合は更新
    requestBody: {
      key: "API_KEY",
      value: "secret-api-key-value",
      type: "encrypted",
      target: ["production", "preview"]
    }
  });

  console.log('Environment variable created:', result);
  return result;
}
```

## 変数のプロパティ

### 設定可能なプロパティ

```typescript
interface EnvironmentVariable {
  key: string;                  // 変数識別子
  value: string;                // 実際のデータまたはシークレット
  target: TargetEnvironment[];  // デプロイメント環境
  type: "encrypted" | "plain";  // 変数の型
}

type TargetEnvironment = "production" | "preview" | "development";
```

### キー（Key）

変数の識別子として使用されます：

```typescript
const variableKey = "DATABASE_URL";
```

**命名規則:**
- 大文字のみ使用（推奨）
- アンダースコアで単語を区切る
- 文字、数字、アンダースコアのみ
- 256文字以下

### 値（Value）

実際のデータまたはシークレット：

```typescript
const variableValue = "postgresql://user:pass@host:5432/db";
```

**制限:**
- 最大65,536文字
- 機密情報には`encrypted`型を使用

### ターゲット（Target）

デプロイメント環境の指定：

```typescript
type TargetOptions = {
  production: "本番環境";
  preview: "プレビュー（ブランチ）デプロイメント";
  development: "ローカル開発環境";
};

// 例
const targets: TargetEnvironment[] = ["production", "preview"];
```

### 型（Type）

データの暗号化レベル：

```typescript
type VariableType = "encrypted" | "plain";

// encrypted: 機密情報用（APIキー、データベースパスワードなど）
// plain: 非機密情報用（公開設定など）
```

## プロジェクトへの変数追加

### 単一変数の追加

```typescript
async function addSingleVariable(
  projectId: string,
  key: string,
  value: string,
  targets: TargetEnvironment[],
  type: "encrypted" | "plain" = "plain"
) {
  try {
    const result = await vercel.projects.createProjectEnv({
      idOrName: projectId,
      upsert: "true",
      requestBody: {
        key,
        value,
        target: targets,
        type
      }
    });

    console.log(`✓ Added ${key} to ${projectId}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to add ${key}:`, error);
    throw error;
  }
}

// 使用例
await addSingleVariable(
  "my-project",
  "API_ENDPOINT",
  "https://api.example.com",
  ["production", "preview"],
  "plain"
);
```

### 複数変数の追加

```typescript
interface EnvVariable {
  key: string;
  value: string;
  target: TargetEnvironment[];
  type: "encrypted" | "plain";
}

async function addMultipleVariables(
  projectId: string,
  variables: EnvVariable[]
) {
  const results = [];

  for (const variable of variables) {
    const result = await vercel.projects.createProjectEnv({
      idOrName: projectId,
      upsert: "true",
      requestBody: variable
    });

    results.push(result);
    console.log(`✓ Added ${variable.key}`);
  }

  return results;
}

// 使用例
await addMultipleVariables("my-project", [
  {
    key: "DATABASE_URL",
    value: "postgresql://...",
    target: ["production"],
    type: "encrypted"
  },
  {
    key: "API_KEY",
    value: "sk_live_...",
    target: ["production", "preview"],
    type: "encrypted"
  },
  {
    key: "PUBLIC_URL",
    value: "https://example.com",
    target: ["production", "preview", "development"],
    type: "plain"
  }
]);
```

## 複数プロジェクト管理

### 複数プロジェクトでの変数管理

```typescript
interface ProjectEnvironmentConfig {
  projects: string[];
  environments: {
    key: string;
    value: string;
    target: TargetEnvironment[];
    type: "encrypted" | "plain";
  }[];
}

async function manageMultiProjectEnvironments(config: ProjectEnvironmentConfig) {
  const results = [];

  // 1. プロジェクト識別子の配列を定義
  for (const projectId of config.projects) {
    console.log(`\nConfiguring project: ${projectId}`);

    // 2. プロジェクトと環境仕様を反復処理
    for (const env of config.environments) {
      try {
        // 3. 環境ターゲティングで変数を作成または更新
        const result = await vercel.projects.createProjectEnv({
          idOrName: projectId,
          upsert: "true",
          requestBody: env
        });

        results.push({
          project: projectId,
          variable: env.key,
          status: 'success'
        });

        console.log(`  ✓ ${env.key} → ${env.target.join(', ')}`);
      } catch (error) {
        console.error(`  ✗ Failed to add ${env.key}:`, error);
        results.push({
          project: projectId,
          variable: env.key,
          status: 'failed',
          error
        });
      }
    }

    // 4. filterProjectEnvs()で設定を取得・検証
    try {
      const envVars = await vercel.projects.filterProjectEnvs({
        idOrName: projectId
      });

      console.log(`  Verified ${envVars.envs?.length || 0} variables`);
    } catch (error) {
      console.error(`  Failed to verify variables:`, error);
    }
  }

  return results;
}

// 使用例
await manageMultiProjectEnvironments({
  projects: ["frontend-app", "backend-api", "admin-panel"],
  environments: [
    {
      key: "API_ENDPOINT",
      value: "https://api.example.com",
      target: ["production", "preview"],
      type: "plain"
    },
    {
      key: "DATABASE_URL",
      value: "postgresql://...",
      target: ["production"],
      type: "encrypted"
    },
    {
      key: "REDIS_URL",
      value: "redis://...",
      target: ["production", "preview"],
      type: "encrypted"
    }
  ]
});
```

### 環境変数の同期

```typescript
async function syncEnvironmentVariables(
  sourceProject: string,
  targetProjects: string[]
) {
  // ソースプロジェクトから変数を取得
  const sourceEnvs = await vercel.projects.filterProjectEnvs({
    idOrName: sourceProject
  });

  if (!sourceEnvs.envs) {
    throw new Error('No environment variables found in source project');
  }

  // ターゲットプロジェクトに同期
  for (const targetProject of targetProjects) {
    console.log(`\nSyncing to ${targetProject}...`);

    for (const env of sourceEnvs.envs) {
      await vercel.projects.createProjectEnv({
        idOrName: targetProject,
        upsert: "true",
        requestBody: {
          key: env.key,
          value: env.value,
          target: env.target,
          type: env.type
        }
      });

      console.log(`  ✓ Synced ${env.key}`);
    }
  }
}

// 使用例
await syncEnvironmentVariables(
  "main-project",
  ["staging-project", "development-project"]
);
```

## セキュリティプラクティス

### 機密情報の暗号化

```typescript
async function addSecureSecret(
  projectId: string,
  key: string,
  value: string
) {
  const result = await vercel.projects.createProjectEnv({
    idOrName: projectId,
    upsert: "true",
    requestBody: {
      key,
      value,
      type: "encrypted",  // 機密情報には必ず encrypted を使用
      target: ["production"]  // 本番環境のみに制限
    }
  });

  console.log(`✓ Secure secret ${key} added`);
  return result;
}

// 使用例
await addSecureSecret(
  "my-project",
  "STRIPE_SECRET_KEY",
  "sk_live_..."
);
```

### 環境別の変数分離

```typescript
interface EnvironmentSpecificConfig {
  development: Record<string, string>;
  preview: Record<string, string>;
  production: Record<string, string>;
}

async function addEnvironmentSpecificVariables(
  projectId: string,
  config: EnvironmentSpecificConfig
) {
  // 開発環境
  for (const [key, value] of Object.entries(config.development)) {
    await vercel.projects.createProjectEnv({
      idOrName: projectId,
      upsert: "true",
      requestBody: {
        key,
        value,
        target: ["development"],
        type: "plain"
      }
    });
  }

  // プレビュー環境
  for (const [key, value] of Object.entries(config.preview)) {
    await vercel.projects.createProjectEnv({
      idOrName: projectId,
      upsert: "true",
      requestBody: {
        key,
        value,
        target: ["preview"],
        type: key.includes("SECRET") ? "encrypted" : "plain"
      }
    });
  }

  // 本番環境
  for (const [key, value] of Object.entries(config.production)) {
    await vercel.projects.createProjectEnv({
      idOrName: projectId,
      upsert: "true",
      requestBody: {
        key,
        value,
        target: ["production"],
        type: "encrypted"  // 本番環境は常に暗号化
      }
    });
  }
}
```

## 認証

すべてのSDK操作には、`bearerToken`プロパティに渡される`VERCEL_TOKEN`環境変数が必要です：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});
```

### 環境変数の設定

```bash
# .env ファイル
VERCEL_TOKEN=your_vercel_token_here
```

## ベストプラクティス

### 変数管理

1. **upsert使用**: 既存変数の更新には`upsert: "true"`を使用
2. **適切な型**: 機密情報には`encrypted`、非機密情報には`plain`を使用
3. **環境分離**: 環境ごとに適切な変数を設定
4. **検証**: 変数追加後は`filterProjectEnvs()`で確認

### セキュリティ

1. **暗号化**: APIキー、パスワード、トークンは常に暗号化
2. **最小権限**: 必要な環境にのみ変数を追加
3. **本番保護**: 本番環境の機密情報は`production`ターゲットのみ
4. **トークン管理**: Vercelトークンを環境変数で安全に管理

### パフォーマンス

1. **バッチ処理**: 複数変数を効率的に処理
2. **エラーハンドリング**: 個別の失敗を適切に処理
3. **レート制限**: 大量の操作では適切な遅延を挿入

## トラブルシューティング

### 一般的な問題

**変数が表示されない**
```typescript
// 正しい環境ターゲットを確認
const envVars = await vercel.projects.filterProjectEnvs({
  idOrName: "my-project"
});

envVars.envs?.forEach(env => {
  console.log(`${env.key}: ${env.target.join(', ')}`);
});
```

**値が更新されない**
```typescript
// upsert を "true" に設定
await vercel.projects.createProjectEnv({
  idOrName: "my-project",
  upsert: "true",  // 重要: 既存変数を更新
  requestBody: { /* ... */ }
});
```

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [デプロイメント自動化](/docs/services/vercel/docs/rest-api/reference/examples/deployments-automation.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/environment-variables)
