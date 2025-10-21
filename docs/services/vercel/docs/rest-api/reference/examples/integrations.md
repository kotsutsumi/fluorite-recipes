# Vercel SDK - インテグレーション管理

Vercel SDKを使用してアカウント内のインテグレーションを管理する方法を説明します。

## 📚 目次

- [概要](#概要)
- [インテグレーション情報の取得](#インテグレーション情報の取得)
- [実装の詳細](#実装の詳細)

## 概要

実用的な例を通じて、Vercel SDKを活用してアカウントのインテグレーションを管理する方法を紹介します。

## インテグレーション情報の取得

### コード例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function listAccountIntegrations() {
  try {
    const integrationsResponse = await vercel.integrations.getConfigurations({
      view: 'account',
    });

    integrationsResponse.forEach((config) => {
      console.log(
        `- ${config.slug}: ${
          config.installationType ? `${config.installationType}` : ``
        }integration installed in ${config.projects?.join(' ')}`
      );
    });
  } catch (error) {
    console.error('Failed to list integrations:', error);
    throw error;
  }
}
```

## 実装の詳細

### APIメソッド

```typescript
interface GetConfigurationsMethod {
  method: "vercel.integrations.getConfigurations()";
  parameter: {
    view: "account";
  };
  description: "アカウントに接続されているインテグレーションを取得";
}
```

### パラメータ

`view`プロパティを`'account'`に設定した設定オブジェクトを受け取ります：

```typescript
const config = {
  view: 'account' as const
};
```

### レスポンス構造

レスポンスには以下を含むインテグレーション設定が返されます：

```typescript
interface IntegrationConfig {
  slug: string;                    // インテグレーション識別子
  installationType?: string;       // インストールタイプ
  projects?: string[];             // インテグレーションがアクティブなプロジェクト配列
}
```

**例:**

```
- github: oauth integration installed in my-project my-api
- slack: webhook integration installed in my-project
- datadog: monitoring integration installed in production-app
```

### エラーハンドリング

```typescript
async function safeListIntegrations() {
  try {
    const integrations = await vercel.integrations.getConfigurations({
      view: 'account'
    });

    if (!integrations || integrations.length === 0) {
      console.log('No integrations found');
      return [];
    }

    return integrations;
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return [];
  }
}
```

## 高度な使用例

### インテグレーションの詳細表示

```typescript
async function displayIntegrationDetails() {
  const integrations = await vercel.integrations.getConfigurations({
    view: 'account'
  });

  console.log(`Found ${integrations.length} integrations:\n`);

  integrations.forEach((config, index) => {
    console.log(`${index + 1}. ${config.slug}`);
    console.log(`   Type: ${config.installationType || 'N/A'}`);
    console.log(`   Projects: ${config.projects?.length || 0}`);

    if (config.projects && config.projects.length > 0) {
      config.projects.forEach(project => {
        console.log(`     - ${project}`);
      });
    }

    console.log('');
  });
}
```

### プロジェクト別のインテグレーションフィルタリング

```typescript
async function getIntegrationsForProject(projectName: string) {
  const integrations = await vercel.integrations.getConfigurations({
    view: 'account'
  });

  const projectIntegrations = integrations.filter(config =>
    config.projects?.includes(projectName)
  );

  console.log(`Integrations for ${projectName}:`);
  projectIntegrations.forEach(config => {
    console.log(`- ${config.slug} (${config.installationType})`);
  });

  return projectIntegrations;
}

// 使用例
await getIntegrationsForProject('my-project');
```

### インテグレーションタイプ別のグループ化

```typescript
async function groupIntegrationsByType() {
  const integrations = await vercel.integrations.getConfigurations({
    view: 'account'
  });

  const grouped: Record<string, typeof integrations> = {};

  integrations.forEach(config => {
    const type = config.installationType || 'unknown';

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(config);
  });

  console.log('Integrations by type:');
  Object.entries(grouped).forEach(([type, configs]) => {
    console.log(`\n${type.toUpperCase()}:`);
    configs.forEach(config => {
      console.log(`  - ${config.slug}`);
    });
  });

  return grouped;
}
```

## ベストプラクティス

### インテグレーション管理

1. **定期的な確認**: インテグレーションリストを定期的に確認
2. **未使用の削除**: 使用していないインテグレーションを削除
3. **権限確認**: インテグレーションの権限スコープを確認
4. **監査ログ**: インテグレーションの変更を記録

### セキュリティ

1. **最小権限**: 必要最小限の権限のみを付与
2. **定期的な見直し**: インテグレーションの権限を定期的に見直し
3. **監視**: インテグレーションの活動を監視

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/integrations)
