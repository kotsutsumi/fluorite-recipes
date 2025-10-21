# エイリアスの削除

既存のエイリアスを削除します。

## エンドポイント

```
DELETE /v2/aliases/{aliasId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `aliasId` | string | ✓ | 削除するエイリアスのIDまたは名前（例: `2WjyKQmM8ZnGcJsPWMrHRHrE`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface DeleteAliasResponse {
  status: "SUCCESS";
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |
| 404 | 指定されたエイリアスが見つかりません |

## 使用例

### 基本的なエイリアス削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.aliases.deleteAlias({
  aliasId: '2WjyKQmM8ZnGcJsPWMrHRHrE',
  teamId: 'team_abc123'
});

console.log(`✅ Alias deleted: ${result.status}`);
```

### 安全な削除（確認付き）

```typescript
async function deleteAliasSafely(aliasId: string, teamId: string) {
  try {
    // 1. 削除前にエイリアス情報を取得
    const aliases = await vercel.aliases.getAlias({
      idOrAlias: aliasId,
      teamId
    });

    if (aliases.length === 0) {
      console.log(`❌ Alias not found: ${aliasId}`);
      return { deleted: false };
    }

    const alias = aliases[0];

    console.log('⚠️ About to delete alias:');
    console.log(`   Name: ${alias.alias}`);
    console.log(`   Project: ${alias.projectId}`);
    console.log(`   Deployment: ${alias.deployment.url}`);
    console.log(`   Created: ${new Date(alias.createdAt).toLocaleDateString()}`);

    // 2. 削除実行
    const result = await vercel.aliases.deleteAlias({
      aliasId,
      teamId
    });

    console.log(`\n✅ Alias deleted successfully`);

    return { deleted: true, alias };
  } catch (error) {
    console.error(`❌ Failed to delete alias: ${error.message}`);
    throw error;
  }
}

await deleteAliasSafely('2WjyKQmM8ZnGcJsPWMrHRHrE', 'team_abc123');
```

### 複数エイリアスの削除

```typescript
async function deleteMultipleAliases(aliasIds: string[], teamId: string) {
  console.log(`Deleting ${aliasIds.length} aliases...`);

  const results = [];

  for (const aliasId of aliasIds) {
    try {
      const result = await vercel.aliases.deleteAlias({
        aliasId,
        teamId
      });

      results.push({ aliasId, success: true });
      console.log(`✅ Deleted: ${aliasId}`);
    } catch (error) {
      results.push({ aliasId, success: false, error: error.message });
      console.error(`❌ Failed: ${aliasId} - ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${aliasIds.length} deleted`);

  return results;
}

await deleteMultipleAliases(
  ['alias_abc123', 'alias_def456', 'alias_ghi789'],
  'team_abc123'
);
```

### プロジェクトのすべてのエイリアスを削除

```typescript
async function deleteProjectAliases(projectId: string, teamId: string) {
  // 1. プロジェクトのエイリアスを取得
  const result = await vercel.aliases.listAliases({
    projectId,
    teamId
  });

  console.log(`Found ${result.aliases.length} aliases for project ${projectId}`);

  const deleted = [];

  // 2. 各エイリアスを削除
  for (const alias of result.aliases) {
    try {
      await vercel.aliases.deleteAlias({
        aliasId: alias.uid,
        teamId
      });

      deleted.push(alias.alias);
      console.log(`✅ Deleted: ${alias.alias}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${alias.alias}`);
    }
  }

  console.log(`\nDeleted ${deleted.length}/${result.aliases.length} aliases`);

  return deleted;
}

await deleteProjectAliases('prj_abc123', 'team_abc123');
```

### 古いエイリアスの削除

```typescript
async function deleteStaleAliases(teamId: string, daysThreshold: number = 180) {
  // 1. すべてのエイリアスを取得
  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const cutoffTime = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
  const staleAliases = result.aliases.filter(
    alias => (alias.createdAt || new Date(alias.created).getTime()) < cutoffTime
  );

  console.log(`Found ${staleAliases.length} stale aliases (${daysThreshold}+ days old)`);

  const deleted = [];

  for (const alias of staleAliases) {
    try {
      await vercel.aliases.deleteAlias({
        aliasId: alias.uid,
        teamId
      });

      const age = Math.floor(
        (Date.now() - (alias.createdAt || new Date(alias.created).getTime())) /
        (1000 * 60 * 60 * 24)
      );

      deleted.push(alias.alias);
      console.log(`✅ Deleted ${age}-day old alias: ${alias.alias}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${alias.alias}`);
    }
  }

  console.log(`\nDeleted ${deleted.length}/${staleAliases.length} stale aliases`);

  return deleted;
}

// 180日以上古いエイリアスを削除
await deleteStaleAliases('team_abc123', 180);
```

### ドメインパターン別の削除

```typescript
async function deleteAliasesByPattern(
  teamId: string,
  pattern: string | RegExp
) {
  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  const matchingAliases = result.aliases.filter(alias =>
    regex.test(alias.alias)
  );

  console.log(`Found ${matchingAliases.length} aliases matching pattern: ${pattern}`);

  const deleted = [];

  for (const alias of matchingAliases) {
    try {
      await vercel.aliases.deleteAlias({
        aliasId: alias.uid,
        teamId
      });

      deleted.push(alias.alias);
      console.log(`✅ Deleted: ${alias.alias}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${alias.alias}`);
    }
  }

  console.log(`\nDeleted ${deleted.length} aliases`);

  return deleted;
}

// 例: テスト環境のエイリアスをすべて削除
await deleteAliasesByPattern('team_abc123', /test|dev|staging/);
```

### リダイレクト設定のあるエイリアスを削除

```typescript
async function deleteRedirectAliases(teamId: string) {
  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const redirectAliases = result.aliases.filter(alias => alias.redirect);

  console.log(`Found ${redirectAliases.length} aliases with redirects`);

  for (const alias of redirectAliases) {
    try {
      await vercel.aliases.deleteAlias({
        aliasId: alias.uid,
        teamId
      });

      console.log(`✅ Deleted redirect alias: ${alias.alias} → ${alias.redirect}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${alias.alias}`);
    }
  }
}

await deleteRedirectAliases('team_abc123');
```

### デプロイメントのエイリアスをクリーンアップ

```typescript
async function cleanupDeploymentAliases(deploymentId: string, teamId: string) {
  // 1. デプロイメントのエイリアスを取得
  const result = await vercel.deployments.listDeploymentAliases({
    id: deploymentId,
    teamId
  });

  console.log(`Found ${result.aliases.length} aliases for deployment`);

  const deleted = [];

  // 2. .vercel.appドメイン以外を削除（カスタムドメインの削除）
  for (const alias of result.aliases) {
    if (!alias.alias.endsWith('.vercel.app')) {
      try {
        await vercel.aliases.deleteAlias({
          aliasId: alias.uid,
          teamId
        });

        deleted.push(alias.alias);
        console.log(`✅ Deleted custom domain: ${alias.alias}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${alias.alias}`);
      }
    }
  }

  console.log(`\nDeleted ${deleted.length} custom domain aliases`);

  return deleted;
}

await cleanupDeploymentAliases('dpl_abc123', 'team_abc123');
```

### エイリアスクリーンアップバッチ処理

```typescript
async function cleanupAliases(teamId: string) {
  console.log('Starting alias cleanup...\n');

  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const issues = {
    stale: [] as string[],        // 180日以上古い
    deleted: [] as string[],       // 削除マーク付き
    noDeployment: [] as string[]   // デプロイメントなし
  };

  const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);

  result.aliases.forEach(alias => {
    const createdAt = alias.createdAt || new Date(alias.created).getTime();

    if (createdAt < sixMonthsAgo) {
      issues.stale.push(alias.uid);
    }
    if (alias.deletedAt) {
      issues.deleted.push(alias.uid);
    }
    if (!alias.deploymentId) {
      issues.noDeployment.push(alias.uid);
    }
  });

  const toDelete = new Set([
    ...issues.stale,
    ...issues.deleted,
    ...issues.noDeployment
  ]);

  console.log('Issues found:');
  console.log(`  Stale (180+ days): ${issues.stale.length}`);
  console.log(`  Marked as deleted: ${issues.deleted.length}`);
  console.log(`  No deployment: ${issues.noDeployment.length}`);
  console.log(`\nTotal to delete: ${toDelete.size}`);

  let deleted = 0;

  for (const aliasId of toDelete) {
    try {
      await vercel.aliases.deleteAlias({ aliasId, teamId });
      deleted++;
      console.log(`✅ Deleted: ${aliasId}`);
    } catch (error) {
      console.error(`❌ Failed: ${aliasId}`);
    }
  }

  console.log(`\n✅ Cleanup complete: ${deleted}/${toDelete.size} deleted`);

  return { deleted, total: toDelete.size };
}

await cleanupAliases('team_abc123');
```

## 注意事項

- **元に戻せません**: エイリアスの削除は永久的で、取り消すことができません
- **即座に有効**: 削除後、そのエイリアスへのアクセスは即座に失われます
- **DNS伝播**: カスタムドメインの場合、DNS変更が伝播するまで時間がかかる場合があります
- **確認なし**: API呼び出しで確認プロンプトは表示されません
- **依存関係**: エイリアスを使用している統合やサービスがある場合は、削除前に確認してください

## 削除前のチェックリスト

1. ✅ エイリアスIDまたは名前が正しいことを確認
2. ✅ エイリアスが使用されていないことを確認
3. ✅ 必要に応じてエイリアス設定をバックアップ
4. ✅ カスタムドメインの場合、DNS設定への影響を確認
5. ✅ 依存する統合やサービスに影響がないか確認
6. ✅ チームメンバーに事前通知

## 関連リンク

- [List Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-aliases.md)
- [List Deployment Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-deployment-aliases.md)
- [Get an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/get-an-alias.md)
