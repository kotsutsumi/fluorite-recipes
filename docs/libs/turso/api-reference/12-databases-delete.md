# Databases API - データベースの削除

データベースを完全に削除します。この操作は取り消せません。

## エンドポイント

```
DELETE /v1/organizations/{organizationSlug}/databases/{databaseName}
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | 削除するデータベース名 |

### リクエストヘッダー

```http
Authorization: Bearer YOUR_API_TOKEN
```

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface DeleteDatabaseResponse {
  database: string;  // 削除されたデータベース名
}
```

### レスポンス例

```json
{
  "database": "my-db"
}
```

### エラーレスポンス

#### 404 Not Found

```json
{
  "error": "could not find database with name 'my-db': record not found"
}
```

#### 403 Forbidden - 削除保護が有効

```json
{
  "error": "Database 'my-db' has delete protection enabled"
}
```

## 重要な注意事項

⚠️ **警告**: この操作は不可逆です。データベースとそのすべてのデータが完全に削除されます。

### 削除前の確認事項

1. **削除保護**: `delete_protection`が有効な場合、削除前に無効化する必要があります
2. **データバックアップ**: 重要なデータは削除前にバックアップしてください
3. **依存関係**: 他のシステムやアプリケーションが使用していないか確認
4. **接続文字列**: 削除後、アプリケーションの接続設定を更新

## 使用例

### cURL

```bash
curl -L -X DELETE 'https://api.turso.tech/v1/organizations/my-org/databases/my-db' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function deleteDatabase(
  organizationSlug: string,
  databaseName: string
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

// 使用例
try {
  const result = await deleteDatabase('my-org', 'temp-db');
  console.log('✓ Deleted database:', result.database);
} catch (error) {
  console.error('✗ Failed to delete database:', error.message);
}
```

### 削除保護を無効化してから削除

```typescript
async function deleteDatabaseSafely(
  organizationSlug: string,
  databaseName: string
) {
  try {
    // 1. 削除保護を無効化
    await updateDatabaseConfiguration(organizationSlug, databaseName, {
      delete_protection: false
    });
    console.log('✓ Delete protection disabled');

    // 2. データベースを削除
    const result = await deleteDatabase(organizationSlug, databaseName);
    console.log('✓ Database deleted:', result.database);

    return result;
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  }
}

await deleteDatabaseSafely('my-org', 'old-db');
```

### 確認プロンプト付き削除

```typescript
async function deleteDatabaseWithConfirmation(
  organizationSlug: string,
  databaseName: string
) {
  // データベース情報を取得
  const db = await getDatabase(organizationSlug, databaseName);

  console.log('\n⚠️  WARNING: You are about to delete a database');
  console.log('==================================================');
  console.log(`Database: ${db.Name}`);
  console.log(`Group: ${db.group}`);
  console.log(`Regions: ${db.regions.join(', ')}`);
  console.log(`Delete Protection: ${db.delete_protection ? 'ENABLED' : 'disabled'}`);
  console.log('==================================================');

  // 確認（実際の実装では readline や inquirer を使用）
  const confirmation = prompt(
    `Type "${databaseName}" to confirm deletion: `
  );

  if (confirmation !== databaseName) {
    console.log('✗ Deletion cancelled');
    return;
  }

  // 削除保護を無効化
  if (db.delete_protection) {
    await updateDatabaseConfiguration(organizationSlug, databaseName, {
      delete_protection: false
    });
  }

  // 削除実行
  await deleteDatabase(organizationSlug, databaseName);
  console.log('✓ Database deleted successfully');
}
```

### バックアップしてから削除

```typescript
async function backupAndDelete(
  organizationSlug: string,
  databaseName: string
) {
  console.log('Creating backup before deletion...');

  // 1. バックアップとして新しいデータベースを作成
  const backupName = `${databaseName}-backup-${Date.now()}`;
  const backup = await createDatabase(organizationSlug, {
    name: backupName,
    group: 'backups',
    seed: {
      type: 'database',
      name: databaseName,
      timestamp: new Date().toISOString()
    }
  });

  console.log('✓ Backup created:', backup.Name);

  // 2. 元のデータベースを削除
  await deleteDatabaseSafely(organizationSlug, databaseName);

  console.log('✓ Original database deleted');
  console.log(`Backup available as: ${backup.Name}`);

  return backup;
}

await backupAndDelete('my-org', 'old-db');
```

### 複数のデータベースを一括削除

```typescript
async function deleteDatabasesBatch(
  organizationSlug: string,
  databaseNames: string[],
  options = { skipProtected: true, dryRun: false }
) {
  console.log(`Deleting ${databaseNames.length} databases...`);

  const results = {
    deleted: [] as string[],
    skipped: [] as string[],
    failed: [] as Array<{ name: string; error: string }>
  };

  for (const name of databaseNames) {
    try {
      // データベース情報を取得
      const db = await getDatabase(organizationSlug, name);

      // 削除保護が有効で skipProtected=true の場合はスキップ
      if (db.delete_protection && options.skipProtected) {
        console.log(`⊘ Skipped (protected): ${name}`);
        results.skipped.push(name);
        continue;
      }

      // ドライランモード
      if (options.dryRun) {
        console.log(`[DRY RUN] Would delete: ${name}`);
        continue;
      }

      // 削除実行
      await deleteDatabaseSafely(organizationSlug, name);
      console.log(`✓ Deleted: ${name}`);
      results.deleted.push(name);

    } catch (error) {
      console.error(`✗ Failed: ${name} - ${error.message}`);
      results.failed.push({ name, error: error.message });
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Deleted: ${results.deleted.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);

  return results;
}

// 使用例
const oldDatabases = ['temp-db-1', 'temp-db-2', 'test-db'];

// ドライラン（実際には削除しない）
await deleteDatabasesBatch('my-org', oldDatabases, { dryRun: true });

// 実際に削除
await deleteDatabasesBatch('my-org', oldDatabases, { dryRun: false });
```

### パターンマッチで削除

```typescript
async function deleteDatabasesByPattern(
  organizationSlug: string,
  pattern: RegExp,
  options = { confirm: true }
) {
  // すべてのデータベースを取得
  const databases = await listDatabases(organizationSlug);

  // パターンに一致するデータベースを抽出
  const matches = databases.filter(db => pattern.test(db.Name));

  if (matches.length === 0) {
    console.log('No databases match the pattern');
    return;
  }

  console.log(`Found ${matches.length} databases matching pattern:`);
  matches.forEach(db => console.log(`  - ${db.Name}`));

  if (options.confirm) {
    const confirmed = confirm(`Delete ${matches.length} databases?`);
    if (!confirmed) {
      console.log('Cancelled');
      return;
    }
  }

  const databaseNames = matches.map(db => db.Name);
  return deleteDatabasesBatch(organizationSlug, databaseNames);
}

// 例: "test-"で始まるすべてのデータベースを削除
await deleteDatabasesByPattern('my-org', /^test-/);

// 例: "-temp"で終わるすべてのデータベースを削除
await deleteDatabasesByPattern('my-org', /-temp$/);
```

## ベストプラクティス

### 1. 削除前のチェックリスト

```typescript
async function preDeleteChecklist(
  organizationSlug: string,
  databaseName: string
): Promise<boolean> {
  const checks = {
    exists: false,
    hasBackup: false,
    noActiveConnections: false,
    protectionDisabled: false
  };

  try {
    // データベースが存在するか
    const db = await getDatabase(organizationSlug, databaseName);
    checks.exists = true;

    // 削除保護が無効か
    checks.protectionDisabled = !db.delete_protection;

    // バックアップが存在するか（命名規則による）
    const databases = await listDatabases(organizationSlug);
    checks.hasBackup = databases.some(
      d => d.Name.startsWith(`${databaseName}-backup-`)
    );

    // アクティブな接続がないか（使用量でチェック）
    const usage = await getDatabaseUsage(organizationSlug, databaseName);
    const recentActivity = usage.total.rows_read > 0 || usage.total.rows_written > 0;
    checks.noActiveConnections = !recentActivity;

  } catch (error) {
    console.error('Pre-delete check failed:', error);
    return false;
  }

  console.log('Pre-delete checklist:');
  console.log(`  ✓ Database exists: ${checks.exists}`);
  console.log(`  ${checks.hasBackup ? '✓' : '✗'} Backup exists: ${checks.hasBackup}`);
  console.log(`  ${checks.noActiveConnections ? '✓' : '⚠'} No recent activity: ${checks.noActiveConnections}`);
  console.log(`  ${checks.protectionDisabled ? '✓' : '✗'} Protection disabled: ${checks.protectionDisabled}`);

  return checks.exists && checks.protectionDisabled;
}

// 使用例
const canDelete = await preDeleteChecklist('my-org', 'old-db');
if (canDelete) {
  await deleteDatabase('my-org', 'old-db');
}
```

## エラーハンドリング

```typescript
async function deleteDatabaseWithErrorHandling(
  organizationSlug: string,
  databaseName: string
) {
  try {
    await deleteDatabase(organizationSlug, databaseName);
    console.log('✓ Database deleted successfully');
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not found')) {
        console.error('✗ Database does not exist');
      } else if (message.includes('protection')) {
        console.error('✗ Delete protection is enabled');
        console.log('Disable protection first:');
        console.log(`  await updateDatabaseConfiguration('${organizationSlug}', '${databaseName}', { delete_protection: false })`);
      } else if (message.includes('permission')) {
        console.error('✗ Insufficient permissions');
      } else {
        console.error('✗ Unknown error:', error.message);
      }
    }
    throw error;
  }
}
```

---

**参考リンク**:
- [データベースの作成](./06-databases-create.md)
- [データベース一覧の取得](./05-databases-list.md)
- [データベース設定の更新](./09-databases-update-configuration.md)
