# デプロイメントのエイリアス一覧取得

特定のデプロイメントに関連付けられたすべてのエイリアスを取得します。

## エンドポイント

```
GET /v2/deployments/{id}/aliases
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | デプロイメント識別子（例: `dpl_FjvFJncQHQcZMznrUm9EoB8sFuPa`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface DeploymentAlias {
  uid: string;                  // 一意の識別子
  alias: string;                // エイリアス名またはドメイン（例: .vercel.appサブドメインまたはカスタムドメイン）
  created: string;              // 作成タイムスタンプ（ISO 8601形式）
  redirect: string | null;      // リダイレクト先ドメイン
  protectionBypass: {           // 保護バイパス設定
    [scope: string]: {
      createdAt: number;
      createdBy: string;
      lastUpdatedAt?: number;
      lastUpdatedBy?: string;
      scope: string;
    };
  };
}

interface Response {
  aliases: DeploymentAlias[];
}
```

### 保護バイパススコープ

- `shareable-link` - 共有可能リンクバイパス
- `user` - ユーザーベースバイパス
- `alias-protection-override` - エイリアス保護オーバーライド
- `email_invite` - メール招待バイパス

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |
| 404 | デプロイメントが見つかりません |

## 使用例

### 基本的なエイリアス一覧取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.deployments.listDeploymentAliases({
  id: 'dpl_FjvFJncQHQcZMznrUm9EoB8sFuPa',
  teamId: 'team_abc123'
});

console.log(`Total aliases: ${result.aliases.length}`);

result.aliases.forEach(alias => {
  console.log(`\n${alias.alias}`);
  console.log(`  UID: ${alias.uid}`);
  console.log(`  Created: ${new Date(alias.created).toLocaleString()}`);
  if (alias.redirect) {
    console.log(`  Redirects to: ${alias.redirect}`);
  }
});
```

### エイリアスの詳細情報取得

```typescript
async function getDeploymentAliasesDetailed(deploymentId: string, teamId: string) {
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  console.log(`Deployment: ${deploymentId}`);
  console.log(`Total aliases: ${result.aliases.length}\n`);

  result.aliases.forEach(alias => {
    console.log(`📌 ${alias.alias}`);
    console.log(`   UID: ${alias.uid}`);
    console.log(`   Created: ${new Date(alias.created).toLocaleDateString()}`);

    if (alias.redirect) {
      console.log(`   🔀 Redirect: ${alias.redirect}`);
    }

    // 保護バイパス設定の確認
    const bypassScopes = Object.keys(alias.protectionBypass);
    if (bypassScopes.length > 0) {
      console.log(`   🔐 Protection bypass scopes: ${bypassScopes.join(', ')}`);
    }

    console.log('');
  });

  return result.aliases;
}

await getDeploymentAliasesDetailed('dpl_abc123', 'team_abc123');
```

### カスタムドメインのフィルタリング

```typescript
async function getCustomDomainAliases(deploymentId: string, teamId: string) {
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  // .vercel.app以外のドメインを抽出
  const customDomains = result.aliases.filter(
    alias => !alias.alias.endsWith('.vercel.app')
  );

  console.log(`Custom domains: ${customDomains.length}/${result.aliases.length}`);

  customDomains.forEach(alias => {
    console.log(`\n🌐 ${alias.alias}`);
    console.log(`   Created: ${new Date(alias.created).toLocaleDateString()}`);
  });

  return customDomains;
}

await getCustomDomainAliases('dpl_abc123', 'team_abc123');
```

### リダイレクト設定の確認

```typescript
async function checkRedirects(deploymentId: string, teamId: string) {
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  const withRedirects = result.aliases.filter(alias => alias.redirect !== null);

  console.log(`Aliases with redirects: ${withRedirects.length}`);

  withRedirects.forEach(alias => {
    console.log(`\n${alias.alias} → ${alias.redirect}`);
    console.log(`  Created: ${new Date(alias.created).toLocaleDateString()}`);
  });

  return withRedirects;
}

await checkRedirects('dpl_abc123', 'team_abc123');
```

### 保護バイパス設定の分析

```typescript
async function analyzeProtectionBypass(deploymentId: string, teamId: string) {
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  const analysis = {
    total: result.aliases.length,
    withBypass: 0,
    byScope: {} as Record<string, number>
  };

  result.aliases.forEach(alias => {
    const scopes = Object.keys(alias.protectionBypass);

    if (scopes.length > 0) {
      analysis.withBypass++;

      scopes.forEach(scope => {
        analysis.byScope[scope] = (analysis.byScope[scope] || 0) + 1;
      });
    }
  });

  console.log('Protection Bypass Analysis:');
  console.log(`  Total aliases: ${analysis.total}`);
  console.log(`  With bypass: ${analysis.withBypass}`);
  console.log('\n  By scope:');
  Object.entries(analysis.byScope).forEach(([scope, count]) => {
    console.log(`    ${scope}: ${count}`);
  });

  return analysis;
}

await analyzeProtectionBypass('dpl_abc123', 'team_abc123');
```

### エイリアスの経過時間分析

```typescript
async function analyzeAliasAges(deploymentId: string, teamId: string) {
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  const now = Date.now();

  const ageGroups = {
    recent: [] as string[],      // 7日以内
    medium: [] as string[],       // 7-30日
    old: [] as string[]           // 30日以上
  };

  result.aliases.forEach(alias => {
    const age = now - new Date(alias.created).getTime();
    const days = Math.floor(age / (1000 * 60 * 60 * 24));

    if (days <= 7) {
      ageGroups.recent.push(alias.alias);
    } else if (days <= 30) {
      ageGroups.medium.push(alias.alias);
    } else {
      ageGroups.old.push(alias.alias);
    }
  });

  console.log('Alias Age Distribution:');
  console.log(`  Recent (≤7 days): ${ageGroups.recent.length}`);
  console.log(`  Medium (8-30 days): ${ageGroups.medium.length}`);
  console.log(`  Old (>30 days): ${ageGroups.old.length}`);

  return ageGroups;
}

await analyzeAliasAges('dpl_abc123', 'team_abc123');
```

### デプロイメント間のエイリアス比較

```typescript
async function compareDeploymentAliases(
  deployment1Id: string,
  deployment2Id: string,
  teamId: string
) {
  const [result1, result2] = await Promise.all([
    vercel.deployments.listDeploymentAliases({ id: deployment1Id, teamId }),
    vercel.deployments.listDeploymentAliases({ id: deployment2Id, teamId })
  ]);

  const aliases1 = new Set(result1.aliases.map(a => a.alias));
  const aliases2 = new Set(result2.aliases.map(a => a.alias));

  const common = [...aliases1].filter(a => aliases2.has(a));
  const uniqueTo1 = [...aliases1].filter(a => !aliases2.has(a));
  const uniqueTo2 = [...aliases2].filter(a => !aliases1.has(a));

  console.log('Deployment Alias Comparison:');
  console.log(`\nDeployment 1: ${result1.aliases.length} aliases`);
  console.log(`Deployment 2: ${result2.aliases.length} aliases`);
  console.log(`\nCommon: ${common.length}`);
  console.log(`Unique to 1: ${uniqueTo1.length}`);
  console.log(`Unique to 2: ${uniqueTo2.length}`);

  return { common, uniqueTo1, uniqueTo2 };
}

await compareDeploymentAliases('dpl_abc123', 'dpl_def456', 'team_abc123');
```

## 注意事項

- デプロイメントに関連付けられたすべてのエイリアスが返されます（カスタムドメインと.vercel.appサブドメインの両方）
- 保護バイパス設定は、エイリアスへのアクセス制御を管理します
- リダイレクトが設定されている場合、`redirect`フィールドに宛先ドメインが含まれます
- 削除されたエイリアスはこのリストには表示されません

## 関連リンク

- [List Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-aliases.md)
- [Get an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/get-an-alias.md)
- [Delete an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/delete-an-alias.md)
