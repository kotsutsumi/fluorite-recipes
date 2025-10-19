# Turso API - 認証

Turso Platform APIは、すべてのリクエストでBearer認証を使用します。このガイドでは、APIトークンの取得、使用方法、セキュリティのベストプラクティスについて説明します。

## 認証方法

### Bearer認証

すべてのAPIリクエストには、`Authorization`ヘッダーにBearer トークンを含める必要があります。

```http
Authorization: Bearer YOUR_API_TOKEN
```

### 基本的な使用例

**cURL**:

```bash
curl -L 'https://api.turso.tech/v1/locations' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**JavaScript / TypeScript**:

```typescript
const response = await fetch('https://api.turso.tech/v1/locations', {
  headers: {
    'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`
  }
});
```

**Python**:

```python
import requests

headers = {
    'Authorization': f'Bearer {os.environ["TURSO_API_TOKEN"]}'
}

response = requests.get(
    'https://api.turso.tech/v1/locations',
    headers=headers
)
```

## APIトークンの種類

### Platform APIトークン

Platform APIトークンは、組織レベルのリソースを管理するために使用します。

```typescript
interface PlatformAPIToken {
  purpose: "API管理";
  capabilities: [
    "データベースの作成・削除",
    "グループの管理",
    "組織設定の変更",
    "メンバーの管理",
    "トークンの作成・削除"
  ];
  scope: "組織全体";
  expiration: "設定可能";
}
```

### データベーストークン

データベーストークンは、特定のデータベースへのアクセスに使用します。

```typescript
interface DatabaseToken {
  purpose: "データベースアクセス";
  capabilities: [
    "SQLクエリの実行",
    "データの読み書き"
  ];
  scope: "特定のデータベース";
  expiration: "設定可能";
}
```

## APIトークンの取得

### 方法1: Turso CLIを使用（推奨）

最も簡単で安全な方法は、Turso CLIを使用することです。

#### インストール

**macOS / Linux**:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows**:

```powershell
irm get.tur.so/install.ps1 | iex
```

#### 認証

```bash
# 初回ログイン
turso auth login

# または新規登録
turso auth signup
```

#### トークンの作成

```bash
turso auth api-tokens mint <token-name>
```

**例**:

```bash
turso auth api-tokens mint production-api
```

**レスポンス**:

```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiIsImlkIjoiYWJjMTIzIn0.signature
```

#### トークンの一覧表示

```bash
turso auth api-tokens list
```

#### トークンの削除

```bash
turso auth api-tokens revoke <token-name>
```

### 方法2: Authentication APIを使用

プログラム的にトークンを管理する場合は、Authentication APIを使用できます。

詳細は[API Tokens - Create](./42-api-tokens-create.md)を参照してください。

## トークンの管理

### トークンの命名規則

トークンには、用途を明確にする名前を付けることをお勧めします：

```bash
# 良い例
turso auth api-tokens mint production-api
turso auth api-tokens mint staging-deployment
turso auth api-tokens mint ci-cd-pipeline
turso auth api-tokens mint development-local

# 避けるべき例
turso auth api-tokens mint token1
turso auth api-tokens mint test
turso auth api-tokens mint mytoken
```

### トークンの有効期限

トークンには有効期限を設定できます：

```typescript
interface TokenExpiration {
  never: "有効期限なし（デフォルト）";
  duration: "相対時間（例: 7d, 30d, 1y）";
  timestamp: "絶対時刻（ISO 8601形式）";
}
```

**例**:

```bash
# 7日間有効なトークン
turso auth api-tokens mint temp-token --expiration 7d

# 30日間有効なトークン
turso auth api-tokens mint monthly-token --expiration 30d

# 1年間有効なトークン
turso auth api-tokens mint yearly-token --expiration 1y
```

## セキュリティのベストプラクティス

### 1. 環境変数を使用

トークンは必ず環境変数として保存し、コードに直接記述しないでください。

**良い例**:

```bash
# .env ファイル
TURSO_API_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
TURSO_ORG_SLUG=my-organization
```

```typescript
// アプリケーションコード
const token = process.env.TURSO_API_TOKEN;
const orgSlug = process.env.TURSO_ORG_SLUG;
```

**悪い例**:

```typescript
// 絶対にしないでください！
const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...";
```

### 2. トークンを公開しない

以下の場所でトークンを公開しないよう注意してください：

- **GitHubリポジトリ**: `.gitignore`に環境変数ファイルを追加
- **CI/CDログ**: ログにトークンが出力されないよう設定
- **公開ドキュメント**: ドキュメントやブログ記事にトークンを含めない
- **クライアントサイドコード**: フロントエンドコードにトークンを埋め込まない

### .gitignoreの設定

```gitignore
# 環境変数ファイル
.env
.env.local
.env.production
.env.*.local

# トークンファイル
*.token
secrets/
credentials/
```

### 3. トークンのローテーション

定期的にトークンをローテーションすることをお勧めします：

```bash
# 新しいトークンを作成
turso auth api-tokens mint production-api-v2

# 古いトークンを削除
turso auth api-tokens revoke production-api
```

### 4. 最小権限の原則

必要な権限のみを持つトークンを使用してください。

```typescript
interface TokenPermissions {
  readOnly: "読み取り専用トークン";
  fullAccess: "フルアクセストークン";
  custom: "カスタム権限（将来サポート予定）";
}
```

### 5. 異なる環境で異なるトークンを使用

開発、ステージング、本番環境でそれぞれ異なるトークンを使用してください：

```bash
# 開発環境
turso auth api-tokens mint development

# ステージング環境
turso auth api-tokens mint staging

# 本番環境
turso auth api-tokens mint production
```

## トークンの保存と配布

### ローカル開発環境

```bash
# .env ファイル
TURSO_API_TOKEN=your-development-token
```

```typescript
// dotenvを使用
import 'dotenv/config';

const token = process.env.TURSO_API_TOKEN;
```

### CI/CD環境

#### GitHub Actions

```yaml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Turso
        env:
          TURSO_API_TOKEN: ${{ secrets.TURSO_API_TOKEN }}
          TURSO_ORG_SLUG: ${{ secrets.TURSO_ORG_SLUG }}
        run: |
          npm run deploy
```

シークレットの設定:
1. GitHubリポジトリ → Settings → Secrets and variables → Actions
2. "New repository secret"をクリック
3. 名前と値を入力

#### GitLab CI

```yaml
deploy:
  script:
    - npm run deploy
  variables:
    TURSO_API_TOKEN: $TURSO_API_TOKEN
    TURSO_ORG_SLUG: $TURSO_ORG_SLUG
```

シークレットの設定:
1. GitLabプロジェクト → Settings → CI/CD → Variables
2. "Add variable"をクリック
3. キーと値を入力、"Protect variable"と"Mask variable"をチェック

#### CircleCI

```yaml
version: 2.1
jobs:
  deploy:
    docker:
      - image: node:18
    steps:
      - checkout
      - run:
          name: Deploy
          command: npm run deploy
          environment:
            TURSO_API_TOKEN: ${TURSO_API_TOKEN}
            TURSO_ORG_SLUG: ${TURSO_ORG_SLUG}
```

### クラウドプラットフォーム

#### Vercel

```bash
# Vercel環境変数の設定
vercel env add TURSO_API_TOKEN
vercel env add TURSO_ORG_SLUG
```

または、Vercelダッシュボード:
1. プロジェクト → Settings → Environment Variables
2. 名前と値を入力
3. 環境を選択（Production / Preview / Development）

#### Netlify

```bash
# Netlify環境変数の設定
netlify env:set TURSO_API_TOKEN "your-token"
netlify env:set TURSO_ORG_SLUG "your-org"
```

#### AWS Lambda

```bash
# AWS CLIを使用
aws lambda update-function-configuration \
  --function-name my-function \
  --environment "Variables={TURSO_API_TOKEN=your-token,TURSO_ORG_SLUG=your-org}"
```

## 認証エラーのハンドリング

### 401 Unauthorized

トークンが無効または期限切れの場合：

```typescript
async function handleAuthError(error: Response) {
  if (error.status === 401) {
    console.error("認証エラー: トークンが無効または期限切れです");
    console.log("新しいトークンを作成してください:");
    console.log("  turso auth api-tokens mint new-token");

    // トークンのリフレッシュロジック
    await refreshToken();
  }
}
```

### 403 Forbidden

権限不足の場合：

```typescript
async function handlePermissionError(error: Response) {
  if (error.status === 403) {
    console.error("権限エラー: このリソースへのアクセス権限がありません");
    console.log("組織の管理者に連絡して権限を確認してください");
  }
}
```

## トークンのテスト

トークンが正しく機能するかテストする方法：

```bash
# ロケーションAPIで認証をテスト
curl -L 'https://api.turso.tech/v1/locations' \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}"
```

**成功レスポンス（200 OK）**:

```json
{
  "locations": {
    "ams": "Amsterdam, Netherlands",
    "lhr": "London, United Kingdom",
    ...
  }
}
```

**失敗レスポンス（401 Unauthorized）**:

```json
{
  "error": "Invalid or expired auth token"
}
```

## 高度な使用例

### トークンの自動更新

```typescript
class TursoAPIClient {
  private token: string;
  private tokenExpiry: Date;

  constructor(private orgSlug: string, initialToken: string) {
    this.token = initialToken;
    this.tokenExpiry = this.parseTokenExpiry(initialToken);
  }

  private async refreshTokenIfNeeded() {
    const now = new Date();
    const timeUntilExpiry = this.tokenExpiry.getTime() - now.getTime();

    // 1時間以内に期限切れの場合は更新
    if (timeUntilExpiry < 60 * 60 * 1000) {
      await this.refreshToken();
    }
  }

  private async refreshToken() {
    // トークン更新ロジック
    console.log("トークンを更新しています...");
    // 新しいトークンを取得
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    await this.refreshTokenIfNeeded();

    return fetch(`https://api.turso.tech${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      }
    });
  }
}
```

### リトライロジック付き認証

```typescript
async function fetchWithRetry(
  url: string,
  token: string,
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 && i < maxRetries - 1) {
      console.log(`認証失敗、リトライ ${i + 1}/${maxRetries - 1}`);
      // トークンを更新
      token = await getNewToken();
      continue;
    }

    return response;
  }

  throw new Error('最大リトライ回数に達しました');
}
```

## まとめ

### 認証のチェックリスト

- [ ] Turso CLIをインストール
- [ ] `turso auth login`で認証
- [ ] `turso auth api-tokens mint`でトークンを作成
- [ ] トークンを環境変数として保存
- [ ] `.gitignore`に環境変数ファイルを追加
- [ ] CI/CD環境でシークレットとして設定
- [ ] トークンのローテーション計画を立てる
- [ ] 異なる環境で異なるトークンを使用

### セキュリティチェックリスト

- [ ] トークンをコードに直接記述しない
- [ ] `.env`ファイルをバージョン管理に含めない
- [ ] CI/CDログでトークンをマスク
- [ ] 定期的にトークンをローテーション
- [ ] 不要なトークンを削除
- [ ] 最小権限の原則を適用

## 次のステップ

1. [Response Codes](./04-response-codes.md) - エラーハンドリングを学ぶ
2. [Database APIs](./05-databases-list.md) - データベース管理を開始
3. [API Tokens](./42-api-tokens-create.md) - プログラム的なトークン管理

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [API Quickstart](./02-quickstart.md)
- [Response Codes](./04-response-codes.md)
