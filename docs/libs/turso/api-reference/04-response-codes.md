# Turso API - レスポンスコード

Turso Platform APIは、標準的なHTTPステータスコードを使用して、リクエストの結果を示します。このガイドでは、各ステータスコードの意味、発生する状況、対処方法について説明します。

## ステータスコード一覧

### 成功レスポンス

#### 200 OK

リクエストが正常に処理されました。

**発生する状況**:
- データの取得成功（GET）
- リソースの更新成功（PUT / PATCH）
- リソースの削除成功（DELETE）
- リソースの作成成功（POST）

**レスポンス例**:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "locations": {
    "ams": "Amsterdam, Netherlands",
    "lhr": "London, United Kingdom",
    "nrt": "Tokyo, Japan"
  }
}
```

**使用例**:

```typescript
const response = await fetch('https://api.turso.tech/v1/locations', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.status === 200) {
  const data = await response.json();
  console.log('成功:', data);
}
```

### クライアントエラー（4xx）

#### 401 Unauthorized

認証トークンが無効、期限切れ、または欠落しています。

**発生する状況**:
- トークンが提供されていない
- トークンの形式が不正
- トークンの有効期限が切れている
- トークンが削除されている

**エラーレスポンス例**:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid or expired auth token"
}
```

**対処方法**:

```typescript
async function handleUnauthorized() {
  console.error('認証エラー: トークンが無効です');

  // 1. トークンの確認
  const token = process.env.TURSO_API_TOKEN;
  if (!token) {
    console.log('トークンが設定されていません');
    console.log('新しいトークンを作成: turso auth api-tokens mint <name>');
    return;
  }

  // 2. 新しいトークンを作成
  console.log('新しいトークンを作成してください:');
  console.log('  turso auth api-tokens mint new-token');

  // 3. 環境変数を更新
  console.log('環境変数を更新してください:');
  console.log('  export TURSO_API_TOKEN="new-token-value"');
}
```

**予防策**:

```typescript
// トークンの有効性を事前にチェック
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.turso.tech/v1/locations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

// 使用例
const isValid = await validateToken(process.env.TURSO_API_TOKEN);
if (!isValid) {
  console.error('トークンが無効です。更新してください。');
}
```

#### 402 Payment Required

サブスクリプションの問題があります。

**発生する状況**:
- アクティブなサブスクリプションがない
- サブスクリプションの支払いが滞っている
- プランの上限に達している
- 試用期間が終了している

**エラーレスポンス例**:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "Active subscription required"
}
```

**対処方法**:

```typescript
async function handlePaymentRequired() {
  console.error('支払いが必要: サブスクリプションを確認してください');

  // 1. サブスクリプション状態を確認
  const subscription = await turso.organizations.getSubscription(orgSlug);
  console.log('現在のプラン:', subscription);

  // 2. 利用状況を確認
  const usage = await turso.organizations.getUsage(orgSlug);
  console.log('リソース使用状況:', usage);

  // 3. 対処方法を提示
  console.log('\n対処方法:');
  console.log('1. Tursoダッシュボードでサブスクリプションを確認');
  console.log('2. プランをアップグレード');
  console.log('3. 不要なリソースを削除して使用量を削減');
}
```

**プラン制限の確認**:

```typescript
interface PlanLimits {
  databases: number;
  groups: number;
  locations: number;
  rowsRead: number;
  rowsWritten: number;
  storage: string;
}

async function checkPlanLimits(orgSlug: string): Promise<PlanLimits> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/plans`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (response.status === 402) {
    throw new Error('サブスクリプションの更新が必要です');
  }

  return response.json();
}
```

#### 403 Forbidden

リソースへのアクセス権限がありません。

**発生する状況**:
- 組織のメンバーではない
- 必要な権限レベルがない
- リソースが別の組織に属している
- 組織が無効化されている

**エラーレスポンス例**:

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "You do not have permission to access this resource"
}
```

**対処方法**:

```typescript
async function handleForbidden(resource: string) {
  console.error(`アクセス拒否: ${resource}へのアクセス権限がありません`);

  // 1. 組織メンバーシップを確認
  const orgs = await turso.organizations.list();
  console.log('アクセス可能な組織:', orgs);

  // 2. 現在のユーザー情報を確認
  console.log('組織の管理者に連絡して、以下を確認してください:');
  console.log('- 正しい組織に所属しているか');
  console.log('- 必要な権限レベルがあるか');
  console.log('- リソースが存在するか');
}
```

**権限レベルの確認**:

```typescript
enum MemberRole {
  Owner = "owner",
  Admin = "admin",
  Member = "member"
}

interface PermissionCheck {
  action: string;
  requiredRole: MemberRole;
  currentRole: MemberRole;
  allowed: boolean;
}

function checkPermission(
  action: string,
  requiredRole: MemberRole,
  currentRole: MemberRole
): PermissionCheck {
  const roleHierarchy = {
    owner: 3,
    admin: 2,
    member: 1
  };

  const allowed = roleHierarchy[currentRole] >= roleHierarchy[requiredRole];

  return { action, requiredRole, currentRole, allowed };
}
```

#### 409 Conflict

リソースが既に存在します。

**発生する状況**:
- 同じ名前のデータベースが既に存在
- 同じ名前のグループが既に存在
- 同じ名前のAPIトークンが既に存在
- リソースの状態が競合している

**エラーレスポンス例**:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "Database with name 'my-db' already exists"
}
```

**対処方法**:

```typescript
async function handleConflict(resourceType: string, resourceName: string) {
  console.error(`競合エラー: ${resourceType} '${resourceName}' は既に存在します`);

  // オプション1: 既存のリソースを使用
  console.log('\nオプション1: 既存のリソースを使用');
  const existing = await getExistingResource(resourceType, resourceName);
  console.log('既存のリソース:', existing);

  // オプション2: 異なる名前を使用
  console.log('\nオプション2: 異なる名前を使用');
  const newName = `${resourceName}-${Date.now()}`;
  console.log('新しい名前:', newName);

  // オプション3: 既存のリソースを削除
  console.log('\nオプション3: 既存のリソースを削除してから再作成');
  console.log('警告: データが失われる可能性があります');
}
```

**競合回避の実装**:

```typescript
async function createDatabaseWithRetry(
  name: string,
  group: string,
  maxRetries = 3
): Promise<Database> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const dbName = i === 0 ? name : `${name}-${i}`;
      const database = await turso.databases.create(dbName, { group });
      console.log(`データベース作成成功: ${dbName}`);
      return database;
    } catch (error) {
      if (error.status === 409 && i < maxRetries - 1) {
        console.log(`名前が競合、リトライ中... (${i + 1}/${maxRetries})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error('データベース作成に失敗しました');
}
```

#### 404 Not Found

リソースが見つかりません。

**発生する状況**:
- データベースが存在しない
- グループが存在しない
- 組織が存在しない
- URLが間違っている

**エラーレスポンス例**:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Database not found"
}
```

**対処方法**:

```typescript
async function handleNotFound(resourceType: string, identifier: string) {
  console.error(`${resourceType}が見つかりません: ${identifier}`);

  // リソースの一覧を取得して確認
  console.log(`利用可能な${resourceType}を確認中...`);

  switch (resourceType) {
    case 'database':
      const dbs = await turso.databases.list();
      console.log('利用可能なデータベース:', dbs.map(db => db.Name));
      break;
    case 'group':
      const groups = await turso.groups.list();
      console.log('利用可能なグループ:', groups.map(g => g.name));
      break;
    case 'organization':
      const orgs = await turso.organizations.list();
      console.log('利用可能な組織:', orgs);
      break;
  }
}
```

#### 422 Unprocessable Entity

リクエストの形式は正しいが、内容が不正です。

**発生する状況**:
- 必須パラメータが欠落
- パラメータの値が不正
- バリデーションエラー

**エラーレスポンス例**:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "Invalid database name: must contain only alphanumeric characters and hyphens"
}
```

**対処方法**:

```typescript
// 入力バリデーション
function validateDatabaseName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'データベース名は必須です' };
  }

  if (name.length > 32) {
    return { valid: false, error: 'データベース名は32文字以内にしてください' };
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    return {
      valid: false,
      error: 'データベース名は小文字の英数字とハイフンのみ使用できます'
    };
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'データベース名の最初と最後にハイフンは使えません' };
  }

  return { valid: true };
}

// 使用例
const validation = validateDatabaseName('my-db');
if (!validation.valid) {
  console.error('バリデーションエラー:', validation.error);
} else {
  await turso.databases.create('my-db', { group: 'default' });
}
```

#### 429 Too Many Requests

レート制限に達しました。

**発生する状況**:
- 短時間に大量のリクエストを送信
- APIレート制限を超過

**エラーレスポンス例**:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60

{
  "error": "Rate limit exceeded. Please try again later."
}
```

**対処方法**:

```typescript
async function fetchWithRateLimit(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;

      console.log(`レート制限に達しました。${waitTime / 1000}秒待機中...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }

    return response;
  }

  throw new Error('レート制限により最大リトライ回数に達しました');
}
```

### サーバーエラー（5xx）

#### 500 Internal Server Error

サーバー内部エラーが発生しました。

**対処方法**:

```typescript
async function handleServerError(retryCount = 0, maxRetries = 3) {
  console.error('サーバーエラーが発生しました');

  if (retryCount < maxRetries) {
    const backoff = Math.pow(2, retryCount) * 1000; // 指数バックオフ
    console.log(`${backoff / 1000}秒後にリトライします... (${retryCount + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    return true; // リトライ
  }

  console.error('最大リトライ回数に達しました。Tursoサポートに連絡してください。');
  return false;
}
```

#### 503 Service Unavailable

サービスが一時的に利用できません。

**対処方法**:

```typescript
async function handleServiceUnavailable() {
  console.error('サービスが一時的に利用できません');
  console.log('メンテナンス中の可能性があります');
  console.log('Tursoステータスページを確認: https://status.turso.tech');

  // 指数バックオフでリトライ
  const backoffMs = 5000;
  await new Promise(resolve => setTimeout(resolve, backoffMs));
}
```

## エラーレスポンスの構造

### 基本形式

```typescript
interface ErrorResponse {
  error: string;        // エラーメッセージ
  code?: string;        // エラーコード（オプション）
  details?: object;     // 追加の詳細情報（オプション）
}
```

### 例

```json
{
  "error": "Database with name 'my-db' already exists",
  "code": "RESOURCE_CONFLICT",
  "details": {
    "resource_type": "database",
    "resource_name": "my-db",
    "organization": "my-org"
  }
}
```

## 包括的なエラーハンドリング

### TypeScript実装例

```typescript
class TursoAPIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: ErrorResponse
  ) {
    super(body.error);
    this.name = 'TursoAPIError';
  }
}

async function tursoFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`https://api.turso.tech${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new TursoAPIError(response.status, response.statusText, body);
  }

  return response.json();
}

// 使用例
async function createDatabaseSafely(name: string, group: string) {
  try {
    const database = await tursoFetch('/v1/organizations/my-org/databases', {
      method: 'POST',
      body: JSON.stringify({ name, group })
    });
    console.log('データベース作成成功:', database);
    return database;
  } catch (error) {
    if (error instanceof TursoAPIError) {
      switch (error.status) {
        case 401:
          console.error('認証エラー: トークンを確認してください');
          break;
        case 402:
          console.error('支払いが必要: サブスクリプションを確認してください');
          break;
        case 403:
          console.error('権限エラー: アクセス権限を確認してください');
          break;
        case 409:
          console.error('競合エラー: 異なる名前を使用してください');
          break;
        case 429:
          console.error('レート制限: しばらく待ってから再試行してください');
          break;
        default:
          console.error('APIエラー:', error.message);
      }
    }
    throw error;
  }
}
```

### リトライロジック付きラッパー

```typescript
async function fetchWithRetry(
  endpoint: string,
  options: RequestInit = {},
  retryConfig = { maxRetries: 3, baseDelay: 1000 }
): Promise<any> {
  let lastError: Error;

  for (let attempt = 0; attempt < retryConfig.maxRetries; attempt++) {
    try {
      return await tursoFetch(endpoint, options);
    } catch (error) {
      lastError = error;

      if (error instanceof TursoAPIError) {
        // リトライすべきでないエラー
        if ([400, 401, 403, 404, 409, 422].includes(error.status)) {
          throw error;
        }

        // リトライすべきエラー
        if ([429, 500, 502, 503, 504].includes(error.status)) {
          const delay = retryConfig.baseDelay * Math.pow(2, attempt);
          console.log(`エラー ${error.status}: ${delay}ms後にリトライ (${attempt + 1}/${retryConfig.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError!;
}
```

## レスポンスコードのクイックリファレンス

| コード | 名前 | 説明 | リトライ | 対処方法 |
|-------|------|------|---------|---------|
| 200 | OK | 成功 | - | - |
| 401 | Unauthorized | 認証エラー | いいえ | トークンを確認・更新 |
| 402 | Payment Required | 支払い必要 | いいえ | サブスクリプション確認 |
| 403 | Forbidden | 権限不足 | いいえ | 権限を確認 |
| 404 | Not Found | リソース未検出 | いいえ | リソース名・URLを確認 |
| 409 | Conflict | リソース競合 | いいえ | 異なる名前を使用 |
| 422 | Unprocessable | バリデーションエラー | いいえ | 入力値を修正 |
| 429 | Too Many Requests | レート制限 | はい | 待機してリトライ |
| 500 | Internal Server Error | サーバーエラー | はい | 指数バックオフでリトライ |
| 503 | Service Unavailable | サービス停止 | はい | 待機してリトライ |

## 次のステップ

1. [Database APIs](./05-databases-list.md) - データベース管理の開始
2. [Authentication](./03-authentication.md) - 認証エラーの詳細
3. [Organization APIs](./31-organizations-list.md) - 組織設定の管理

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [API Quickstart](./02-quickstart.md)
- [Authentication](./03-authentication.md)
