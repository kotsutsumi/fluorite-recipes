# エイリアスの取得

特定のエイリアスの詳細情報を取得します。

## エンドポイント

```
GET /v4/aliases/{idOrAlias}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `idOrAlias` | string | ✓ | エイリアスまたはID（例: `example.vercel.app`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `projectId` | string | 割り当てられたプロジェクトIDでフィルタ |
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |
| `since` | number | このJavaScriptタイムスタンプ以降に作成された場合に取得 |
| `until` | number | このJavaScriptタイムスタンプ以前に作成された場合に取得 |
| `from` | number | 非推奨: タイムスタンプ以降に作成された場合に取得 |

## レスポンス

### 成功 (200)

```typescript
interface Alias {
  alias: string;                        // エイリアス名またはカスタムドメイン
  uid: string;                          // 一意のエイリアス識別子
  created: string;                      // 作成日（ISO 8601形式）
  createdAt: number;                    // 作成タイムスタンプ（エポックからのミリ秒）
  creator: {                            // 作成者情報
    uid: string;
    email: string;
    username: string;
  };
  deploymentId: string;                 // 関連デプロイメントID
  projectId: string;                    // 関連プロジェクトID
  deployment: {                         // デプロイメント詳細
    id: string;
    url: string;
    meta?: object;
  };
  updatedAt?: number;                   // 最終更新タイムスタンプ
  deletedAt?: number;                   // 削除タイムスタンプ（該当する場合）
  redirect?: string;                    // リダイレクト先ドメイン
  redirectStatusCode?: 301 | 302 | 307 | 308;  // HTTPステータスコード
  protectionBypass?: {                  // バイパス設定詳細
    [scope: string]: {
      createdAt: number;
      createdBy: string;
      lastUpdatedAt?: number;
      lastUpdatedBy?: string;
      scope: string;
    };
  };
  microfrontends?: {                    // マイクロフロントエンド設定用ルーティング
    [path: string]: {
      deploymentId: string;
      url: string;
    };
  };
}

type Response = Alias[];
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |
| 404 | エイリアスが見つかりません |

## 使用例

### 基本的なエイリアス取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const aliases = await vercel.aliases.getAlias({
  idOrAlias: 'example.vercel.app',
  teamId: 'team_abc123'
});

const alias = aliases[0];

console.log(`Alias: ${alias.alias}`);
console.log(`  UID: ${alias.uid}`);
console.log(`  Project: ${alias.projectId}`);
console.log(`  Deployment: ${alias.deployment.url}`);
console.log(`  Created: ${new Date(alias.createdAt).toLocaleDateString()}`);
console.log(`  Creator: ${alias.creator.username}`);
```

### プロジェクトIDでフィルタ

```typescript
const aliases = await vercel.aliases.getAlias({
  idOrAlias: 'example.vercel.app',
  projectId: 'prj_12HKQaOmR5t5Uy6vdcQsNIiZgHGB',
  teamId: 'team_abc123'
});

if (aliases.length > 0) {
  const alias = aliases[0];
  console.log(`✅ Alias found for project`);
  console.log(`   Alias: ${alias.alias}`);
  console.log(`   Deployment ID: ${alias.deploymentId}`);
} else {
  console.log('❌ Alias not found for this project');
}
```

### エイリアスの詳細情報表示

```typescript
async function displayAliasDetails(aliasName: string, teamId: string) {
  const aliases = await vercel.aliases.getAlias({
    idOrAlias: aliasName,
    teamId
  });

  if (aliases.length === 0) {
    console.log(`❌ Alias not found: ${aliasName}`);
    return null;
  }

  const alias = aliases[0];

  console.log('\n📌 Alias Details:');
  console.log(`   Name: ${alias.alias}`);
  console.log(`   UID: ${alias.uid}`);
  console.log(`   Project: ${alias.projectId}`);
  console.log(`   Deployment: ${alias.deployment.url}`);
  console.log(`   Created: ${new Date(alias.createdAt).toLocaleString()}`);
  console.log(`   Creator: ${alias.creator.username} (${alias.creator.email})`);

  if (alias.updatedAt) {
    console.log(`   Updated: ${new Date(alias.updatedAt).toLocaleString()}`);
  }

  if (alias.redirect) {
    console.log(`\n   🔀 Redirect Configuration:`);
    console.log(`      Target: ${alias.redirect}`);
    console.log(`      Status: ${alias.redirectStatusCode}`);
  }

  if (alias.protectionBypass && Object.keys(alias.protectionBypass).length > 0) {
    console.log(`\n   🔐 Protection Bypass:`);
    Object.entries(alias.protectionBypass).forEach(([scope, config]) => {
      console.log(`      Scope: ${scope}`);
      console.log(`      Created: ${new Date(config.createdAt).toLocaleDateString()}`);
    });
  }

  if (alias.microfrontends && Object.keys(alias.microfrontends).length > 0) {
    console.log(`\n   🏗️ Microfrontend Routes:`);
    Object.entries(alias.microfrontends).forEach(([path, config]) => {
      console.log(`      ${path} → ${config.url}`);
    });
  }

  return alias;
}

await displayAliasDetails('example.vercel.app', 'team_abc123');
```

### エイリアスの存在確認

```typescript
async function aliasExists(aliasName: string, teamId: string): Promise<boolean> {
  try {
    const aliases = await vercel.aliases.getAlias({
      idOrAlias: aliasName,
      teamId
    });

    const exists = aliases.length > 0;
    console.log(`Alias ${aliasName}: ${exists ? '✅ exists' : '❌ not found'}`);

    return exists;
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`❌ Alias ${aliasName} not found`);
      return false;
    }
    throw error;
  }
}

const exists = await aliasExists('example.vercel.app', 'team_abc123');
```

### 日付範囲でのエイリアス取得

```typescript
async function getAliasInDateRange(
  aliasName: string,
  teamId: string,
  startDate: Date,
  endDate: Date
) {
  const aliases = await vercel.aliases.getAlias({
    idOrAlias: aliasName,
    teamId,
    since: startDate.getTime(),
    until: endDate.getTime()
  });

  if (aliases.length > 0) {
    const alias = aliases[0];
    const created = new Date(alias.createdAt);

    console.log(`✅ Alias created within range:`);
    console.log(`   Name: ${alias.alias}`);
    console.log(`   Created: ${created.toLocaleDateString()}`);

    return alias;
  } else {
    console.log(`❌ Alias not created within specified date range`);
    return null;
  }
}

// 過去30日間に作成されたかチェック
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
await getAliasInDateRange(
  'example.vercel.app',
  'team_abc123',
  thirtyDaysAgo,
  new Date()
);
```

### エイリアスの更新履歴確認

```typescript
async function checkAliasActivity(aliasName: string, teamId: string) {
  const aliases = await vercel.aliases.getAlias({
    idOrAlias: aliasName,
    teamId
  });

  if (aliases.length === 0) {
    console.log(`❌ Alias not found`);
    return null;
  }

  const alias = aliases[0];
  const created = new Date(alias.createdAt);
  const age = Date.now() - alias.createdAt;
  const daysSinceCreation = Math.floor(age / (1000 * 60 * 60 * 24));

  const activity = {
    alias: alias.alias,
    age: {
      days: daysSinceCreation,
      isOld: daysSinceCreation > 180  // 6ヶ月以上
    },
    hasUpdates: !!alias.updatedAt,
    isDeleted: !!alias.deletedAt
  };

  console.log('\n📊 Alias Activity:');
  console.log(`   Age: ${activity.age.days} days ${activity.age.isOld ? '(⚠️ Old)' : ''}`);
  console.log(`   Has updates: ${activity.hasUpdates ? 'Yes' : 'No'}`);
  console.log(`   Status: ${activity.isDeleted ? '🗑️ Deleted' : '✅ Active'}`);

  if (alias.updatedAt) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - alias.updatedAt) / (1000 * 60 * 60 * 24)
    );
    console.log(`   Last updated: ${daysSinceUpdate} days ago`);
  }

  return activity;
}

await checkAliasActivity('example.vercel.app', 'team_abc123');
```

### エイリアス設定の検証

```typescript
async function validateAliasConfig(aliasName: string, teamId: string) {
  const aliases = await vercel.aliases.getAlias({
    idOrAlias: aliasName,
    teamId
  });

  if (aliases.length === 0) {
    return { valid: false, issues: ['Alias not found'] };
  }

  const alias = aliases[0];
  const issues = [];

  // デプロイメントの確認
  if (!alias.deploymentId) {
    issues.push('No deployment associated');
  }

  // プロジェクトの確認
  if (!alias.projectId) {
    issues.push('No project associated');
  }

  // リダイレクト設定の確認
  if (alias.redirect) {
    if (!alias.redirectStatusCode) {
      issues.push('Redirect target set but no status code');
    }
    if (![301, 302, 307, 308].includes(alias.redirectStatusCode)) {
      issues.push('Invalid redirect status code');
    }
  }

  // 削除状態の確認
  if (alias.deletedAt) {
    issues.push('Alias is marked as deleted');
  }

  console.log('\n✓ Alias Configuration Validation:');
  console.log(`   Alias: ${alias.alias}`);
  console.log(`   Valid: ${issues.length === 0 ? '✅' : '❌'}`);

  if (issues.length > 0) {
    console.log(`   Issues:`);
    issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
  }

  return { valid: issues.length === 0, issues };
}

await validateAliasConfig('example.vercel.app', 'team_abc123');
```

### マイクロフロントエンド設定の確認

```typescript
async function checkMicrofrontendRoutes(aliasName: string, teamId: string) {
  const aliases = await vercel.aliases.getAlias({
    idOrAlias: aliasName,
    teamId
  });

  if (aliases.length === 0) {
    console.log(`❌ Alias not found`);
    return null;
  }

  const alias = aliases[0];

  if (!alias.microfrontends || Object.keys(alias.microfrontends).length === 0) {
    console.log(`ℹ️ No microfrontend configuration for ${alias.alias}`);
    return null;
  }

  console.log(`\n🏗️ Microfrontend Configuration for ${alias.alias}:`);
  console.log(`   Total routes: ${Object.keys(alias.microfrontends).length}`);

  Object.entries(alias.microfrontends).forEach(([path, config]) => {
    console.log(`\n   Route: ${path}`);
    console.log(`      Deployment: ${config.deploymentId}`);
    console.log(`      URL: ${config.url}`);
  });

  return alias.microfrontends;
}

await checkMicrofrontendRoutes('example.vercel.app', 'team_abc123');
```

## 注意事項

- レスポンスは常に配列形式で返されます
- `idOrAlias`パラメータは、エイリアス名またはUIDを受け入れます
- 日付範囲フィルタ（`since`/`until`）を使用すると、指定された期間内に作成されたエイリアスのみが返されます
- 削除されたエイリアスは`deletedAt`フィールドを持ちますが、API経由で取得できる場合があります

## 関連リンク

- [List Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-aliases.md)
- [List Deployment Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-deployment-aliases.md)
- [Delete an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/delete-an-alias.md)
