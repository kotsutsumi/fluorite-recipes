# Databases API - データベーストークンの無効化

データベースのすべての認証トークンを無効化します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/databases/{databaseName}/auth/rotate
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | データベース名 |

### リクエストヘッダー

```http
Authorization: Bearer YOUR_API_TOKEN
```

## レスポンス

### 成功レスポンス (200 OK)

レスポンスボディなし（空）

## 重要な注意事項

⚠️ **警告**: この操作により、データベースの既存のすべてのトークンが即座に無効化されます。

### 影響

- すべての既存のデータベーストークンが無効になる
- アクティブな接続が切断される可能性がある
- 新しいトークンを作成して配布する必要がある

### 使用シナリオ

- セキュリティ侵害の疑いがある場合
- トークンが漏洩した場合
- 定期的なセキュリティローテーション
- アクセス権の一括リセット

## 使用例

### cURL

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/auth/rotate' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function invalidateDatabaseTokens(
  organizationSlug: string,
  databaseName: string
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/auth/rotate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  console.log('✓ All database tokens invalidated');
}

await invalidateDatabaseTokens('my-org', 'my-db');
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

await turso.databases.rotateTokens("my-db");
console.log('✓ Tokens rotated');
```

## 実用的な例

### トークンのローテーション（無効化 → 新規作成）

```typescript
async function rotateTokens(
  organizationSlug: string,
  databaseName: string,
  options: TokenOptions = {}
) {
  console.log('Starting token rotation...');

  // 1. 既存のトークンを無効化
  await invalidateDatabaseTokens(organizationSlug, databaseName);
  console.log('✓ Old tokens invalidated');

  // 2. 新しいトークンを作成
  const newToken = await createDatabaseToken(
    organizationSlug,
    databaseName,
    options
  );
  console.log('✓ New token created');

  return newToken;
}

// 使用例
const newToken = await rotateTokens('my-org', 'my-db', {
  expiration: 'never',
  authorization: 'full-access'
});

console.log('New database token:', newToken);
```

### セキュリティインシデント対応

```typescript
async function handleSecurityIncident(
  organizationSlug: string,
  databaseName: string
) {
  console.log('⚠️  SECURITY INCIDENT: Rotating all tokens');

  // 1. すぐにすべてのトークンを無効化
  await invalidateDatabaseTokens(organizationSlug, databaseName);
  console.log('✓ All tokens invalidated');

  // 2. データベースを読み取り専用に設定
  await updateDatabaseConfiguration(organizationSlug, databaseName, {
    block_writes: true
  });
  console.log('✓ Database set to read-only');

  // 3. 新しい読み取り専用トークンのみ作成
  const readOnlyToken = await createDatabaseToken(
    organizationSlug,
    databaseName,
    {
      authorization: 'read-only',
      expiration: '7d'  // 短い有効期限
    }
  );

  console.log('✓ Temporary read-only token created');
  console.log('  Token expires in 7 days');
  console.log('  Investigate and resolve the incident before restoring write access');

  return readOnlyToken;
}
```

### 複数環境のトークンローテーション

```typescript
interface EnvironmentTokens {
  production: string;
  staging: string;
  development: string;
}

async function rotateAllEnvironmentTokens(
  organizationSlug: string,
  databases: { [env: string]: string }
): Promise<EnvironmentTokens> {
  console.log('Rotating tokens for all environments...');

  const newTokens: Partial<EnvironmentTokens> = {};

  for (const [env, dbName] of Object.entries(databases)) {
    console.log(`\nProcessing ${env}...`);

    // トークンをローテーション
    const token = await rotateTokens(organizationSlug, dbName, {
      expiration: env === 'production' ? 'never' : '30d',
      authorization: 'full-access'
    });

    newTokens[env as keyof EnvironmentTokens] = token;
    console.log(`✓ ${env} token rotated`);

    // 環境変数ファイルを更新
    updateEnvFile(env, token);
  }

  console.log('\n✓ All environment tokens rotated');
  return newTokens as EnvironmentTokens;
}

// 使用例
const databases = {
  production: 'prod-db',
  staging: 'staging-db',
  development: 'dev-db'
};

const newTokens = await rotateAllEnvironmentTokens('my-org', databases);
```

### スケジュールされたローテーション

```typescript
async function scheduleTokenRotation(
  organizationSlug: string,
  databaseName: string,
  intervalDays: number = 30
) {
  console.log(`Scheduling token rotation every ${intervalDays} days`);

  const rotateAndSchedule = async () => {
    try {
      // トークンをローテーション
      const newToken = await rotateTokens(organizationSlug, databaseName, {
        expiration: `${intervalDays + 7}d`  // 少し余裕を持たせる
      });

      // 新しいトークンを保存
      await saveTokenToSecureStorage(databaseName, newToken);

      console.log(`✓ Token rotated at ${new Date().toISOString()}`);
      console.log(`  Next rotation in ${intervalDays} days`);

      // 次のローテーションをスケジュール
      setTimeout(rotateAndSchedule, intervalDays * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('✗ Token rotation failed:', error);
      // エラー通知を送信
      await sendAlertToAdmin(error);
    }
  };

  // 最初のローテーションを実行
  await rotateAndSchedule();
}

// 30日ごとにトークンをローテーション
await scheduleTokenRotation('my-org', 'production-db', 30);
```

### ダウンタイムゼロのローテーション

```typescript
async function zeroDowntimeRotation(
  organizationSlug: string,
  databaseName: string
) {
  console.log('Starting zero-downtime token rotation...');

  // 1. 新しいトークンを作成（既存のトークンはまだ有効）
  const newToken = await createDatabaseToken(organizationSlug, databaseName, {
    expiration: 'never',
    authorization: 'full-access'
  });
  console.log('✓ New token created');

  // 2. アプリケーションに新しいトークンを配布
  await deployNewToken(newToken);
  console.log('✓ New token deployed to applications');

  // 3. 古いトークンが使用されなくなるまで待機
  await waitForTokenPropagation(60000);  // 60秒待機
  console.log('✓ Token propagation complete');

  // 4. 古いトークンを無効化
  await invalidateDatabaseTokens(organizationSlug, databaseName);
  console.log('✓ Old tokens invalidated');

  console.log('Zero-downtime rotation complete');
  return newToken;
}

async function deployNewToken(token: string) {
  // アプリケーションサーバーに新しいトークンを配布
  // 実装はデプロイメント環境に依存
  console.log('Deploying new token to application servers...');
  // await updateK8sSecret(token);
  // await updateEnvironmentVariable(token);
}

async function waitForTokenPropagation(ms: number) {
  console.log(`Waiting ${ms/1000}s for token propagation...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## ベストプラクティス

### 1. ローテーション前の通知

```typescript
async function rotateWithNotification(
  organizationSlug: string,
  databaseName: string
) {
  // チームに通知
  await sendNotification({
    type: 'warning',
    message: `Database tokens for ${databaseName} will be rotated in 5 minutes`,
    channels: ['slack', 'email']
  });

  // 5分待機
  await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));

  // ローテーション実行
  const newToken = await rotateTokens(organizationSlug, databaseName);

  // 完了通知
  await sendNotification({
    type: 'success',
    message: `Database tokens for ${databaseName} have been rotated`,
    channels: ['slack', 'email']
  });

  return newToken;
}
```

### 2. ローテーション履歴の記録

```typescript
interface RotationRecord {
  timestamp: string;
  database: string;
  reason: string;
  performer: string;
}

async function rotateWithAudit(
  organizationSlug: string,
  databaseName: string,
  reason: string
) {
  const record: RotationRecord = {
    timestamp: new Date().toISOString(),
    database: databaseName,
    reason,
    performer: process.env.USER || 'system'
  };

  // ローテーション実行
  await invalidateDatabaseTokens(organizationSlug, databaseName);

  // 監査ログに記録
  await logRotation(record);

  console.log('Token rotation recorded in audit log');
}
```

## エラーハンドリング

```typescript
async function safelyInvalidateTokens(
  organizationSlug: string,
  databaseName: string
) {
  try {
    await invalidateDatabaseTokens(organizationSlug, databaseName);
    console.log('✓ Tokens invalidated successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        console.error('✗ Database not found');
      } else if (error.message.includes('permission')) {
        console.error('✗ Insufficient permissions');
      } else {
        console.error('✗ Error:', error.message);
      }
    }
    throw error;
  }
}
```

---

**参考リンク**:
- [データベーストークンの作成](./14-databases-tokens-create.md)
- [データベースの取得](./07-databases-retrieve.md)
