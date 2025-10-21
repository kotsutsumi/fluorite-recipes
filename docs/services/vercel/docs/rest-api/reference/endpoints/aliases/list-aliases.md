# エイリアスの一覧取得

チームまたはプロジェクトのすべてのエイリアスを取得します。

## エンドポイント

```
GET /v4/aliases
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `domain` | string/array | 指定されたドメイン名のエイリアスのみを取得（最大20個） |
| `limit` | number | リクエストから返すエイリアスの最大数 |
| `projectId` | string | 指定された`projectId`からのエイリアスをフィルタ |
| `since` | number | このJavaScriptタイムスタンプ以降に作成されたエイリアスを取得 |
| `until` | number | このJavaScriptタイムスタンプ以前に作成されたエイリアスを取得 |
| `rollbackDeploymentId` | string | 指定されたデプロイメントのロールバック対象となるエイリアスを取得 |
| `from` | number | 非推奨: タイムスタンプフィールド |
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Alias {
  alias: string;                        // ドメイン名（例: my-alias.vercel.app）
  created?: string;                     // 作成タイムスタンプ（ISO 8601）
  createdAt?: number;                   // 作成タイムスタンプ（ミリ秒）
  creator: {                            // 作成者情報
    uid: string;
    email: string;
    username: string;
  };
  deployment: {                         // デプロイメント情報
    id: string;
    url: string;
    meta?: object;
  };
  projectId: string;                    // 関連プロジェクトID
  redirect?: string;                    // リダイレクト先（オプション）
  redirectStatusCode?: 301 | 302 | 307 | 308;  // リダイレクトステータスコード
  protectionBypass?: object;            // アクセスバイパス設定
  microfrontends?: {                    // マイクロフロントエンド用ルーティング設定
    [path: string]: {
      deploymentId: string;
      url: string;
    };
  };
  updatedAt?: number;                   // 最終更新タイムスタンプ
  deletedAt?: number;                   // 削除タイムスタンプ
}

interface Response {
  aliases: Alias[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |
| 404 | 見つかりません |

## 使用例

### 基本的なエイリアス一覧取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.aliases.listAliases({
  teamId: 'team_abc123',
  limit: 20
});

console.log(`Total aliases: ${result.pagination.count}`);

result.aliases.forEach(alias => {
  console.log(`\n${alias.alias}`);
  console.log(`  Project: ${alias.projectId}`);
  console.log(`  Deployment: ${alias.deployment.url}`);
  console.log(`  Created: ${new Date(alias.createdAt || alias.created).toLocaleDateString()}`);
});
```

### ドメイン別のエイリアス取得

```typescript
const result = await vercel.aliases.listAliases({
  domain: 'example.com',
  teamId: 'team_abc123'
});

console.log(`Aliases for example.com: ${result.aliases.length}`);

result.aliases.forEach(alias => {
  console.log(`\n${alias.alias}`);
  console.log(`  Creator: ${alias.creator.username}`);
  console.log(`  Deployment ID: ${alias.deployment.id}`);
});
```

### プロジェクト別のエイリアス取得

```typescript
const result = await vercel.aliases.listAliases({
  projectId: 'prj_abc123',
  teamId: 'team_abc123'
});

console.log(`Project aliases: ${result.aliases.length}`);

result.aliases.forEach(alias => {
  console.log(`\n📌 ${alias.alias}`);
  if (alias.redirect) {
    console.log(`   🔀 Redirects to: ${alias.redirect} (${alias.redirectStatusCode})`);
  }
});
```

### ページネーション処理

```typescript
async function getAllAliases(teamId: string) {
  const allAliases = [];
  let nextTimestamp: number | null = null;

  do {
    const result = await vercel.aliases.listAliases({
      teamId,
      limit: 100,
      since: nextTimestamp || undefined
    });

    allAliases.push(...result.aliases);
    nextTimestamp = result.pagination.next;

    console.log(`Fetched ${result.aliases.length} aliases...`);
  } while (nextTimestamp);

  console.log(`\nTotal aliases fetched: ${allAliases.length}`);
  return allAliases;
}

const aliases = await getAllAliases('team_abc123');
```

### 日付範囲でのフィルタリング

```typescript
// 過去30日間のエイリアスを取得
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

const result = await vercel.aliases.listAliases({
  since: thirtyDaysAgo,
  teamId: 'team_abc123',
  limit: 100
});

console.log(`Aliases created in last 30 days: ${result.aliases.length}`);

result.aliases.forEach(alias => {
  const age = Math.floor((Date.now() - alias.createdAt) / (1000 * 60 * 60 * 24));
  console.log(`\n${alias.alias} (${age} days old)`);
});
```

### リダイレクト設定のあるエイリアスを抽出

```typescript
const result = await vercel.aliases.listAliases({
  teamId: 'team_abc123',
  limit: 100
});

const withRedirects = result.aliases.filter(alias => alias.redirect);

console.log(`Aliases with redirects: ${withRedirects.length}`);

withRedirects.forEach(alias => {
  console.log(`\n${alias.alias}`);
  console.log(`  → ${alias.redirect}`);
  console.log(`  Status: ${alias.redirectStatusCode}`);
});
```

### マイクロフロントエンド設定の確認

```typescript
const result = await vercel.aliases.listAliases({
  teamId: 'team_abc123'
});

const withMicrofrontends = result.aliases.filter(
  alias => alias.microfrontends && Object.keys(alias.microfrontends).length > 0
);

console.log(`Aliases with microfrontends: ${withMicrofrontends.length}`);

withMicrofrontends.forEach(alias => {
  console.log(`\n🏗️ ${alias.alias}`);
  console.log('   Routes:');
  Object.entries(alias.microfrontends!).forEach(([path, config]) => {
    console.log(`   ${path} → ${config.url}`);
  });
});
```

### エイリアスの統計情報

```typescript
async function getAliasStatistics(teamId: string) {
  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const stats = {
    total: result.aliases.length,
    withRedirects: 0,
    withMicrofrontends: 0,
    byDomain: {} as Record<string, number>,
    byProject: {} as Record<string, number>,
    byCreator: {} as Record<string, number>
  };

  result.aliases.forEach(alias => {
    // リダイレクト
    if (alias.redirect) {
      stats.withRedirects++;
    }

    // マイクロフロントエンド
    if (alias.microfrontends && Object.keys(alias.microfrontends).length > 0) {
      stats.withMicrofrontends++;
    }

    // ドメイン別
    const domain = alias.alias.split('.').slice(-2).join('.');
    stats.byDomain[domain] = (stats.byDomain[domain] || 0) + 1;

    // プロジェクト別
    stats.byProject[alias.projectId] = (stats.byProject[alias.projectId] || 0) + 1;

    // 作成者別
    stats.byCreator[alias.creator.username] = (stats.byCreator[alias.creator.username] || 0) + 1;
  });

  console.log('Alias Statistics:');
  console.log(`  Total: ${stats.total}`);
  console.log(`  With redirects: ${stats.withRedirects}`);
  console.log(`  With microfrontends: ${stats.withMicrofrontends}`);

  console.log('\n  Top domains:');
  Object.entries(stats.byDomain)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([domain, count]) => {
      console.log(`    ${domain}: ${count}`);
    });

  return stats;
}

await getAliasStatistics('team_abc123');
```

### ロールバック候補の確認

```typescript
async function checkRollbackAliases(deploymentId: string, teamId: string) {
  const result = await vercel.aliases.listAliases({
    rollbackDeploymentId: deploymentId,
    teamId
  });

  console.log(`Aliases that would be affected by rollback: ${result.aliases.length}`);

  result.aliases.forEach(alias => {
    console.log(`\n⚠️ ${alias.alias}`);
    console.log(`   Current deployment: ${alias.deployment.id}`);
    console.log(`   Would rollback to: ${deploymentId}`);
  });

  return result.aliases;
}

await checkRollbackAliases('dpl_rollback123', 'team_abc123');
```

### 古いエイリアスの検出

```typescript
async function findStaleAliases(teamId: string, daysThreshold: number = 180) {
  const result = await vercel.aliases.listAliases({
    teamId,
    limit: 1000
  });

  const cutoffTime = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
  const staleAliases = result.aliases.filter(
    alias => (alias.createdAt || new Date(alias.created).getTime()) < cutoffTime
  );

  console.log(`Stale aliases (${daysThreshold}+ days): ${staleAliases.length}`);

  staleAliases.forEach(alias => {
    const age = Math.floor(
      (Date.now() - (alias.createdAt || new Date(alias.created).getTime())) /
      (1000 * 60 * 60 * 24)
    );
    console.log(`\n${alias.alias} (${age} days old)`);
    console.log(`  Project: ${alias.projectId}`);
  });

  return staleAliases;
}

// 180日以上古いエイリアスを検出
await findStaleAliases('team_abc123', 180);
```

## 注意事項

- デフォルトではすべてのエイリアスが返されます
- `limit`パラメータを使用してレスポンスサイズを制御できます
- `domain`パラメータは配列を受け入れ、複数のドメインをフィルタできます（最大20個）
- `from`パラメータは非推奨です。代わりに`since`を使用してください
- マイクロフロントエンド設定は、複数のデプロイメントを1つのドメインにマッピングするために使用されます

## 関連リンク

- [List Deployment Aliases](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/list-deployment-aliases.md)
- [Get an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/get-an-alias.md)
- [Delete an Alias](/docs/services/vercel/docs/rest-api/reference/endpoints/aliases/delete-an-alias.md)
