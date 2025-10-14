# EAS Hosting 総合ガイド

EAS Hostingは、Expo RouterとReact Native webで構築されたWebプロジェクトをデプロイするためのプレビューサービスです。このドキュメントは、EAS Hostingのすべての機能と概念を包括的にカバーします。

## 目次

1. [概要と主要機能](#概要と主要機能)
2. [クイックスタート](#クイックスタート)
3. [デプロイメントとエイリアス](#デプロイメントとエイリアス)
4. [環境変数](#環境変数)
5. [カスタムドメイン](#カスタムドメイン)
6. [APIルートの監視](#apiルートの監視)
7. [ワークフロー自動化](#ワークフロー自動化)
8. [キャッシング戦略](#キャッシング戦略)
9. [レスポンスとヘッダー](#レスポンスとヘッダー)
10. [Worker ランタイム](#worker-ランタイム)
11. [TypeScript型定義](#typescript型定義)
12. [コマンドリファレンス](#コマンドリファレンス)

---

## 概要と主要機能

### EAS Hostingとは

EAS Hostingは、ExpoとReact Native webプロジェクトのWebデプロイを簡素化し、開発から本番環境への効率的なパスを提供するホスティングサービスです。

### 主な機能

- **高速デプロイ**: WebアプリとAPIルート、サーバー関数の迅速なデプロイ
- **シームレスな統合**: Expo CLIとのネイティブ統合
- **複数の出力モード**: Single、Static、Serverの3つの出力モードをサポート
- **グローバルCDN**: Cloudflareのグローバルネットワークを活用
- **環境変数管理**: クライアントサイドとサーバーサイドの環境変数サポート
- **カスタムドメイン**: 独自ドメインでのホスティング（プレミアム機能）
- **APIルート監視**: クラッシュ、ログ、リクエストの包括的な監視
- **自動化ワークフロー**: EAS Workflowsによる CI/CD 統合

### 重要な注意事項

> **EAS Hostingは現在プレビュー版です。** 問題やフィードバックがある場合は、[Discord](https://chat.expo.dev/)チャンネルに投稿するか、hosting@expo.devにメールをお送りください。

### 利点

- **バージョン同期**: ネイティブアプリとWebバージョンの同期を簡素化
- **リクエストルーティング**: ネイティブアプリのリクエストルーティングを簡単に管理
- **プラットフォーム分析**: プラットフォーム固有のメトリクスと分析を提供

---

## クイックスタート

### 前提条件

```typescript
interface Prerequisites {
  account: 'Expoユーザーアカウント';
  project: 'Expo Router webプロジェクト';
  cli: '最新のEAS CLI';
}
```

### デプロイ手順

#### 1. Expoアカウントの作成

[expo.dev](https://expo.dev)でアカウントを作成します。

#### 2. EAS CLIのインストール

```bash
npm install --global eas-cli
```

#### 3. Expoアカウントにログイン

```bash
eas login
```

#### 4. プロジェクトの準備

`expo.web.output`を設定します：

```typescript
interface WebOutputConfig {
  output: 'single' | 'static' | 'server';
}
```

**出力モードの選択:**

- **`single`**: シングルページアプリケーション（SPA）
  - クライアントサイドルーティングを使用
  - 従来のReactアプリに最適

- **`static`**: 静的に生成されたWebアプリ
  - ビルド時にHTMLを生成
  - 高速なページロードと優れたSEO

- **`server`**: サーバー関数とAPIルートをサポート
  - 動的なサーバーサイドレンダリング
  - APIルートとサーバー関数のサポート

**設定例:**

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

#### 5. Webプロジェクトのエクスポート

```bash
npx expo export --platform web
```

#### 6. デプロイ

```bash
eas deploy
```

デプロイプロセスでは：
- EASプロジェクトの接続を求められます
- プレビューサブドメインの選択を求められます
- デプロイされたアプリのプレビューURLが生成されます

**参照:** [get-started.md](/frameworks/expo/docs/eas/hosting/get-started)

---

## デプロイメントとエイリアス

### デプロイメントの特性

```typescript
interface Deployment {
  id: string;                    // 一意のデプロイメントID
  url: string;                   // デプロイメントURL
  createdAt: Date;               // 作成日時
  immutable: true;               // 不変（変更不可）
  aliases: string[];             // 割り当てられたエイリアス
  environment: Environment;      // 環境設定
}

type Environment = 'development' | 'preview' | 'production';
```

### URL構造

```
https://my-app--or1170q9ix.expo.app/
         │      │         │
         │      │         └─ expo.appドメイン
         │      └─────────── デプロイメントID
         └────────────────── プレビューサブドメイン名
```

### エイリアスの使用

```bash
# 機能ブランチのデプロイ
eas deploy --alias feature-auth
# URL: https://my-app--feature-auth.expo.app/

# ステージング環境
eas deploy --alias staging
# URL: https://my-app--staging.expo.app/

# テスト環境
eas deploy --alias test-v2
# URL: https://my-app--test-v2.expo.app/
```

### プロダクションデプロイメント

```bash
# プロダクションへの昇格
eas deploy --prod
# URL: https://my-app.expo.app/
```

プロダクションURLはデプロイメントIDを含まない、クリーンなURLになります。

### 用語集

```typescript
interface HostingTerms {
  previewSubdomain: string;      // グローバルに一意のプレフィックス
  deploymentId: string;          // 自動生成される一意の識別子
  alias: string;                 // ユーザー定義のカスタムURLセグメント
}
```

### ベストプラクティス

1. **意味のあるエイリアス**: 環境や機能を明確に示すエイリアス名を使用
2. **プロダクション保護**: プロダクションへの昇格前に十分にテスト
3. **デプロイメント履歴**: エイリアスを使用してデプロイメント履歴を管理
4. **チームコミュニケーション**: エイリアス命名規則をチーム内で共有

**参照:** [deployments-and-aliases.md](/frameworks/expo/docs/eas/hosting/deployments-and-aliases)

---

## 環境変数

### 環境変数の種類

```typescript
interface EnvironmentVariables {
  client: ClientSideVariable[];  // クライアントサイド環境変数
  server: ServerSideVariable[];  // サーバーサイド環境変数
}

interface ClientSideVariable {
  name: string;                  // EXPO_PUBLIC_ プレフィックス必須
  value: string;
  inlinedAtBuild: true;          // ビルド時にインライン化
  public: true;                  // 公開される
}

interface ServerSideVariable {
  name: string;                  // プレフィックス不要
  value: string;
  secret: true;                  // 機密情報を含む
  uploadedAtDeploy: true;        // デプロイ時にアップロード
}
```

### クライアントサイド環境変数

**特徴:**
- `EXPO_PUBLIC_`プレフィックスが必須
- ビルド時に`npx expo export`実行時にインライン化
- 機密情報を含めることはできません

**使用例:**

```typescript
// アクセス方法
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const appName = process.env.EXPO_PUBLIC_APP_NAME;
```

**設定例:**

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=MyApp
```

### サーバーサイド環境変数

**特徴:**
- APIルート（`+api.ts`で終わるファイル）で使用
- APIキーなどの機密情報を含めることができます
- `eas deploy`実行時に安全にアップロード

**使用例:**

```typescript
// app/api/users+api.ts
export async function GET(request: Request) {
  const apiKey = process.env.SECRET_API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  // API処理
  const data = await fetchFromAPI(apiKey);

  return Response.json(data);
}
```

### ローカル開発

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
SECRET_API_KEY=your-secret-key-here
DATABASE_URL=postgresql://localhost/mydb
```

Expoは自動的に`.env`ファイルを読み込みます。

### EASでの環境変数管理

```typescript
interface EASEnvCommands {
  pull: 'eas env:pull';                                           // 環境変数を取得
  create: 'eas env:create --name VAR --value "val" --env prod';  // 変数を作成
  update: 'eas env:update --name VAR --value "new"';             // 変数を更新
  list: 'eas env:list';                                          // 変数をリスト
  delete: 'eas env:delete --name VAR';                           // 変数を削除
}
```

### 推奨ワークフロー

```bash
# 1. 環境変数をEASに保存
eas env:create --name SECRET_KEY --value "prod-key" --environment production

# 2. ローカルに環境変数を取得
eas env:pull

# 3. フロントエンドをエクスポート
npx expo export --platform web

# 4. 指定された環境でデプロイ
eas deploy --environment production
```

### 重要な特性

```typescript
interface DeploymentEnvironmentVariables {
  perDeployment: true;           // デプロイメントごとに設定
  immutable: true;               // デプロイ後は変更不可
  requiresRedeploy: true;        // 変更には再デプロイが必要
}
```

### ベストプラクティス

**セキュリティ:**

1. **機密情報の保護**: APIキーやシークレットは`EXPO_PUBLIC_`プレフィックスを使用しない
2. **環境の分離**: 本番環境と開発環境で異なる値を使用
3. **アクセス制限**: 必要な人だけが環境変数にアクセスできるようにする

**管理:**

1. **ドキュメント化**: 各環境変数の目的を文書化
2. **命名規則**: 一貫した命名規則を使用
3. **バージョン管理**: `.env.example`をGitにコミット

```bash
# .env.example
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_APP_NAME=
SECRET_API_KEY=
DATABASE_URL=
```

**参照:** [environment-variables.md](/frameworks/expo/docs/eas/hosting/environment-variables)

---

## カスタムドメイン

### 前提条件

```typescript
interface CustomDomainRequirements {
  project: 'EAS Hostingプロジェクト';
  deployment: 'プロダクションデプロイメント';
  domain: '所有するドメイン名';
  plan: 'プレミアムプラン';  // 無料プランでは利用不可
}
```

### カスタムドメインの設定

#### ステップ1: Hostingの設定にアクセス

1. [expo.dev](https://expo.dev)でプロジェクトダッシュボードにアクセス
2. Hosting設定に移動

#### ステップ2: ドメインタイプを選択

```typescript
type DomainType =
  | 'apex'        // example.com
  | 'subdomain';  // app.example.com
```

- プロジェクトごとに1つのカスタムドメインのみ

#### ステップ3: DNSレコードを設定

```typescript
interface DNSRecords {
  verification: TXTRecord;    // ドメイン所有権の検証
  ssl: CNAMERecord;          // SSL証明書の検証
  pointing: ARecord | CNAMERecord;  // トラフィックルーティング
}

interface TXTRecord {
  name: '_expo-hosting.example.com';
  value: 'verification-token';
  purpose: 'ドメイン所有権の証明';
}

interface SSLCNAMERecord {
  name: '_acme-challenge.example.com';
  value: '_acme-challenge.expo.app';
  purpose: 'SSL証明書の検証';
}
```

#### 3-1. 検証用TXTレコード

```
_expo-hosting.example.com TXT "verification-token"
```

#### 3-2. SSL用CNAMEレコード

```
_acme-challenge.example.com CNAME _acme-challenge.expo.app
```

#### 3-3. ドメインポインティングレコード

**Apexドメインの場合（example.com）:**

```typescript
interface ApexDomainPointing {
  type: 'A';
  name: 'example.com';
  value: '76.76.21.21';
}
```

```
example.com A 76.76.21.21
```

**サブドメインの場合（app.example.com）:**

```typescript
interface SubdomainPointing {
  type: 'CNAME';
  name: 'app.example.com';
  value: 'your-app.expo.app';
}
```

```
app.example.com CNAME your-app.expo.app
```

### 高度な設定

#### wwwサブドメインの自動リダイレクト

```typescript
interface WWWRedirect {
  source: 'www.example.com';
  target: 'example.com';
  automatic: true;
}
```

1. `www`サブドメイン用のCNAMEレコードを追加
2. EAS Hostingが自動的にリダイレクトを処理

#### ワイルドカードサブドメイン

```
*.example.com CNAME your-app.expo.app
```

これにより以下が可能になります：
- `staging.example.com` → `staging`エイリアス
- `dev.example.com` → `dev`エイリアス

### カスタムドメインの動作

```typescript
interface CustomDomainBehavior {
  alwaysRoutesToProduction: true;
  requiresProductionDeployment: true;
  automaticSSL: true;
  certificateProvider: 'Let\'s Encrypt';
}
```

**重要:** カスタムドメインは常にプロダクションデプロイメントにルーティングされます。

```bash
# プロダクションに昇格
eas deploy --prod
# このデプロイメントがカスタムドメインで提供されます
```

### DNSプロバイダー別の設定

```typescript
interface DNSProviderSettings {
  cloudflare: {
    proxyStatus: 'DNS only';  // プロキシを無効化
  };
  googleDomains: {
    ttl: 'default';
  };
  namecheap: {
    section: 'Advanced DNS';
  };
}
```

### 検証とトラブルシューティング

#### DNSの伝播

```typescript
interface DNSPropagation {
  typical: '数分から数時間';
  maximum: '最大48時間';
}
```

#### 伝播の確認

```bash
# TXTレコードの確認
dig TXT _expo-hosting.example.com

# Aレコードの確認
dig A example.com

# CNAMEレコードの確認
dig CNAME app.example.com
```

#### 一般的な問題

```typescript
interface CommonIssues {
  dnsPropagation: 'DNSが伝播していない → 待つか、DNSキャッシュをクリア';
  certificateError: '証明書エラー → SSLレコードが正しく設定されているか確認';
  notFoundError: '404エラー → ドメインがプロダクションデプロイメントを指しているか確認';
}
```

### 制限事項

```typescript
interface CustomDomainLimitations {
  domainsPerProject: 1;
  requiresPremiumPlan: true;
  alwaysRoutesToProduction: true;
  noDedicatedIP: true;  // SNI (Server Name Indication) を使用
}
```

**参照:** [custom-domain.md](/frameworks/expo/docs/eas/hosting/custom-domain)

---

## APIルートの監視

### 監視エリア

```typescript
interface MonitoringAreas {
  crashes: CrashMonitoring;
  logs: LogMonitoring;
  requests: RequestMonitoring;
}
```

### 1. クラッシュ

```typescript
interface CrashMonitoring {
  type: 'uncaught-errors';
  location: 'Hosting → Crashesセクション';
  features: {
    grouping: true;              // クラッシュはグループ化される
    stackTrace: true;            // スタックトレースを表示
    metadata: true;              // メタデータを表示
  };
}

interface CrashDetails {
  errorMessage: string;          // エラーメッセージ
  stackTrace: string[];          // スタックトレース
  timestamp: Date;               // 発生時刻
  affectedRequests: number;      // 影響を受けたリクエスト数
}
```

**確認方法:**
1. プロジェクトダッシュボードに移動
2. Hosting → Crashesセクションにアクセス
3. クラッシュの詳細を表示してデバッグ

### 2. ログ

```typescript
interface LogMonitoring {
  types: ['log', 'info', 'error'];
  scope: 'deployment-level';
  realTime: true;
}
```

**確認方法:**
1. プロジェクトダッシュボードに移動
2. 特定のデプロイメントを選択
3. Logsセクションにアクセス

**ログの種類:**

```typescript
// これらはすべて記録されます
console.log('情報メッセージ');
console.info('情報レベルのログ');
console.error('エラーメッセージ');
```

### 3. リクエスト

```typescript
interface RequestMonitoring {
  scope: 'project-level' | 'deployment-level';
  metadata: {
    status: number;              // HTTPステータスコード
    path: string;                // リクエストパス
    region: string;              // リクエスト元のリージョン
    duration: number;            // レスポンス時間
    browser: string;             // ブラウザ情報
    device: string;              // デバイス情報
  };
}
```

**確認方法:**
1. プロジェクトダッシュボードに移動
2. Hosting → Requestsセクションにアクセス
3. フィルターと検索を使用して特定のリクエストを探す

### リクエストの詳細検索

#### Cf-Rayヘッダーによる検索

```typescript
// APIルートでヘッダーを取得
export async function GET(request: Request) {
  const cfRay = request.headers.get('cf-ray');
  console.log('CF-Ray:', cfRay);

  return Response.json({ success: true });
}
```

ダッシュボードでこのIDを使用して特定のリクエストを検索できます。

### サンプリングと高トラフィック

```typescript
interface DataSampling {
  enabled: boolean;              // 高トラフィック時に有効
  statisticsAccuracy: '100%';    // 統計は正確
  detailsAvailability: 'sample'; // 詳細はサンプルのみ
}
```

高トラフィックのデプロイメントでは：
- データ記録を管理するためにサンプリングが使用されます
- サンプリングされたデータでも統計カウントが提供されます
- すべてのリクエストがカウントされますが、すべての詳細が記録されるわけではありません

### APIルートのベストプラクティス

#### ロギング戦略

```typescript
// app/api/users+api.ts
export async function GET(request: Request) {
  console.log('[API] Fetching users');

  try {
    const users = await fetchUsers();
    console.log(`[API] Successfully fetched ${users.length} users`);
    return Response.json(users);
  } catch (error) {
    console.error('[API] Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
```

#### エラーハンドリング

```typescript
// app/api/data+api.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 入力検証
    if (!body.id) {
      return Response.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // データ処理
    const result = await processData(body);

    return Response.json(result);
  } catch (error) {
    // エラーログ
    console.error('[API] Error:', error);

    // クライアントへの適切なエラーレスポンス
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### メトリクスの追跡

```typescript
// app/api/metrics+api.ts
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    const data = await fetchData();
    const duration = Date.now() - startTime;

    console.log(`[Metrics] Request duration: ${duration}ms`);

    return Response.json(data);
  } catch (error) {
    console.error('[Metrics] Request failed:', error);
    throw error;
  }
}
```

### デバッグのヒント

#### 1. 構造化ログ

```typescript
// 構造化されたログ形式を使用
console.log(JSON.stringify({
  level: 'info',
  timestamp: new Date().toISOString(),
  message: 'User action',
  userId: user.id,
  action: 'login'
}));
```

#### 2. リクエストIDの追跡

```typescript
export async function GET(request: Request) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request started`);

  try {
    const result = await processRequest();
    console.log(`[${requestId}] Request completed`);
    return Response.json(result);
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}
```

#### 3. 環境別のログレベル

```typescript
const isDev = process.env.NODE_ENV === 'development';

function debugLog(message: string) {
  if (isDev) {
    console.log('[DEBUG]', message);
  }
}
```

### パフォーマンス監視

```typescript
interface PerformanceMetrics {
  avgResponseTime: number;       // 平均レスポンス時間
  p95ResponseTime: number;       // 95パーセンタイル
  slowRequests: Request[];       // 遅いリクエスト
}
```

**ダッシュボードで監視:**
- 平均レスポンス時間
- 95パーセンタイルのレスポンス時間
- 遅いリクエストの特定

**参照:** [api-routes.md](/frameworks/expo/docs/eas/hosting/api-routes)

---

## ワークフロー自動化

### 前提条件

```typescript
interface WorkflowRequirements {
  easWorkflows: 'EAS Workflowsが設定されている';
  githubIntegration: 'GitHub統合が設定されている';
  hostingProject: 'EAS Hostingプロジェクトが作成されている';
}
```

### ワークフロー設定

#### 基本的なデプロイワークフロー

```yaml
# .eas/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true
```

このワークフローは：
- `main`ブランチへのプッシュで自動的にトリガー
- プロダクション環境変数を使用
- Webバンドルをエクスポート
- プロジェクトをデプロイ
- プロダクションに昇格

### 詳細設定

#### 複数環境のデプロイ

```yaml
name: Deploy to Multiple Environments
on:
  push:
    branches: ['main', 'develop']
jobs:
  deploy-production:
    type: deploy
    name: Deploy to Production
    environment: production
    if: ${{ github.ref == 'refs/heads/main' }}
    params:
      prod: true

  deploy-staging:
    type: deploy
    name: Deploy to Staging
    environment: staging
    if: ${{ github.ref == 'refs/heads/develop' }}
    params:
      alias: staging
```

#### プルリクエストプレビュー

```yaml
name: Preview Deployment
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  preview:
    type: deploy
    name: Deploy Preview
    environment: preview
    params:
      alias: pr-${{ github.event.pull_request.number }}
```

### ワークフローパラメータ

```typescript
interface WorkflowParameters {
  required: {
    type: 'deploy';              // デプロイジョブタイプを指定
    environment: Environment;     // 使用する環境変数セット
  };
  optional: {
    prod?: boolean;              // プロダクションに昇格
    alias?: string;              // デプロイメントエイリアス
  };
}
```

### 手動トリガー

```bash
# CLIから実行
eas workflow:run deploy
```

**GitHub UIから実行:**
1. GitHubリポジトリに移動
2. Actionsタブを開く
3. ワークフローを選択
4. "Run workflow"をクリック

### 環境変数の管理

```yaml
name: Deploy with Environment Variables
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production  # EASの環境変数を使用
    params:
      prod: true
```

```bash
# プロダクション環境変数を設定
eas env:create --name API_URL --value "https://api.production.com" --environment production

# ステージング環境変数を設定
eas env:create --name API_URL --value "https://api.staging.com" --environment staging
```

### 高度なワークフロー例

#### ビルド、テスト、デプロイパイプライン

```yaml
name: Full CI/CD Pipeline
on:
  push:
    branches: ['main']
jobs:
  test:
    type: generic
    name: Run Tests
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    type: deploy
    name: Deploy to Production
    needs: [test]  # テスト成功後のみデプロイ
    environment: production
    params:
      prod: true
```

#### 条件付きデプロイ

```yaml
name: Conditional Deploy
on:
  push:
    branches: ['main', 'develop']
    paths:
      - 'app/**'
      - 'package.json'
jobs:
  deploy:
    type: deploy
    name: Deploy if App Changed
    environment: production
    params:
      prod: ${{ github.ref == 'refs/heads/main' }}
      alias: ${{ github.ref == 'refs/heads/develop' && 'staging' || '' }}
```

### 通知の設定

```yaml
name: Deploy with Notifications
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true

  notify:
    name: Notify Slack
    needs: [deploy]
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Deployment to production completed!"
            }
```

### ワークフローの監視

```typescript
interface WorkflowMonitoring {
  dashboard: {
    location: 'expo.dev → プロジェクト → Workflows';
    features: {
      executionHistory: true;
      statusTracking: true;
      detailedLogs: true;
      errorMessages: true;
      resourceUsage: true;
    };
  };
}
```

### ベストプラクティス

#### 1. 環境の分離

```yaml
production:
  branch: main
  environment: production
  prod: true

staging:
  branch: develop
  environment: staging
  alias: staging
```

#### 2. テストの統合

```yaml
jobs:
  test:
    - run: npm test
    - run: npm run lint

  deploy:
    needs: [test]
    # デプロイ設定
```

#### 3. ロールバック戦略

```typescript
interface RollbackStrategy {
  beforeDeploy: {
    recordCurrentVersion: true;
    createRollbackAlias: true;
    setupMonitoring: true;
  };
}
```

**参照:** [workflows.md](/frameworks/expo/docs/eas/hosting/workflows)

---

## キャッシング戦略

### キャッシングの概要

```typescript
interface CachingStrategy {
  browserCache: boolean;         // ブラウザキャッシュ
  cdnCache: boolean;             // CDNキャッシュ
  performance: {
    improvedSpeed: true;
    reducedServerLoad: true;
    betterUserExperience: true;
  };
}
```

### APIルートのキャッシング

#### 基本的なキャッシング

```typescript
// app/api/data+api.ts
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

この設定では：
- レスポンスは1時間（3600秒）キャッシュされます
- ブラウザとCDNの両方でキャッシュされます

### キャッシュ可能性ディレクティブ

```typescript
interface CacheDirectives {
  public: {
    usage: 'すべてのユーザーに同じレスポンス';
    cache: 'ブラウザとCDN両方';
    example: '公開API、静的データ';
  };
  private: {
    usage: 'ユーザー固有のデータ';
    cache: 'ユーザーのブラウザのみ';
    example: 'ユーザープロファイル、個人設定';
  };
  noStore: {
    usage: '機密データ、リアルタイムデータ';
    cache: 'キャッシュなし';
    example: '金融取引、認証トークン';
  };
  noCache: {
    usage: '常に検証が必要なデータ';
    cache: 'キャッシュされるが使用前に検証';
    example: '定期的に更新されるデータ';
  };
}
```

#### public

```typescript
'Cache-Control': 'public, max-age=3600'
```

#### private

```typescript
'Cache-Control': 'private, max-age=3600'
```

#### no-store

```typescript
'Cache-Control': 'no-store'
```

#### no-cache

```typescript
'Cache-Control': 'no-cache'
```

### キャッシングヘッダー

#### Cache-Control

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=7200'
    }
  });
}
```

ディレクティブの説明：
- `max-age=3600`: ブラウザキャッシュは1時間
- `s-maxage=7200`: CDNキャッシュは2時間

#### CDN-Cache-Control

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'CDN-Cache-Control': 'public, max-age=7200'
    }
  });
}
```

この設定では：
- ブラウザ: 5分間キャッシュ
- CDN: 2時間キャッシュ

### 有効期限戦略

#### max-age

```typescript
interface MaxAgeExamples {
  oneHour: 'public, max-age=3600';
  oneDay: 'public, max-age=86400';
  oneWeek: 'public, max-age=604800';
}
```

#### stale-while-revalidate

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
```

動作：
1. 60秒間は新鮮なレスポンスを提供
2. 60-360秒の間は古いレスポンスを提供しつつ、バックグラウンドで更新
3. 360秒後は新しいレスポンスを取得

#### stale-if-error

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-if-error=3600'
    }
  });
}
```

動作：
- 通常は5分間キャッシュ
- エラー発生時は、最大1時間古いキャッシュを提供

### アセットキャッシング

```typescript
interface AssetCaching {
  default: {
    browserCache: 3600;          // 1時間
    internalCache: 'unlimited';  // 無期限
  };
  automatic: {
    longTermHeaders: true;
    contentHashVersioning: true;
    efficientInvalidation: true;
  };
}
```

### 実用的なキャッシングパターン

#### パターン1: 静的API

```typescript
// ほとんど変更されないデータ
export async function GET(request: Request) {
  const staticData = await getStaticData();

  return Response.json(staticData, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
    }
  });
}
```

#### パターン2: 動的API

```typescript
// 頻繁に更新されるデータ
export async function GET(request: Request) {
  const dynamicData = await getDynamicData();

  return Response.json(dynamicData, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
```

#### パターン3: ユーザー固有データ

```typescript
// ユーザー固有のデータ
export async function GET(request: Request) {
  const userId = await getUserId(request);
  const userData = await getUserData(userId);

  return Response.json(userData, {
    headers: {
      'Cache-Control': 'private, max-age=300'
    }
  });
}
```

#### パターン4: リアルタイムデータ

```typescript
// リアルタイムデータ（キャッシュなし）
export async function GET(request: Request) {
  const realtimeData = await getRealtimeData();

  return Response.json(realtimeData, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
```

### キャッシュとクォータ

```typescript
interface CacheQuota {
  note: 'キャッシュされたリクエストもリクエストクォータにカウントされる';
  implications: {
    cdnCacheHits: 'カウント対象';
    metricsTracking: '通常のリクエストと同様';
    costOptimization: 'キャッシング戦略で最適化可能';
  };
}
```

### キャッシュの無効化

```typescript
interface CacheInvalidation {
  newDeployment: {
    assetURLsChange: true;
    oldCacheInvalidated: true;
    newPolicyApplied: true;
  };
  manual: {
    deployNewVersion: true;
    useURLParameters: true;
    adjustCacheControl: true;
  };
}
```

### パフォーマンスの最適化

#### ヒット率の向上

```typescript
// 長期キャッシュで高いヒット率を実現
export async function GET(request: Request) {
  const cacheableData = await getCacheableData();

  return Response.json(cacheableData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'CDN-Cache-Control': 'public, max-age=604800'
    }
  });
}
```

#### 段階的なキャッシュ戦略

```typescript
// 多層キャッシング
const headers = {
  'Cache-Control': 'public, max-age=60',           // ブラウザ: 1分
  'CDN-Cache-Control': 'public, max-age=3600',     // CDN: 1時間
};
```

### ベストプラクティス

```typescript
interface CachingBestPractices {
  appropriateTiming: 'データの更新頻度に基づいて設定';
  tieredCaching: 'ブラウザとCDNで異なる期間を設定';
  errorHandling: 'stale-if-errorでフォールバックを提供';
  backgroundUpdates: 'stale-while-revalidateでUXを向上';
  privacyProtection: 'ユーザー固有データにはprivateを使用';
}
```

**参照:** [caching.md](/frameworks/expo/docs/eas/hosting/reference/caching)

---

## レスポンスとヘッダー

### アセットレスポンス

#### ETagヘッダー

```typescript
interface ETagHeader {
  value: 'string';               // 例: "33a64df551425fcc55e4d42a148795d9f25f89d4"
  purpose: {
    browserCacheValidation: true;
    conditionalRequests: true;
    bandwidthOptimization: true;
  };
}
```

**動作:**
1. ブラウザが`If-None-Match`ヘッダーでリクエスト
2. ETagが一致する場合、304 Not Modifiedを返す
3. 変更がある場合のみ、完全なレスポンスを返す

### CORSレスポンス

#### デフォルトのCORS設定

```typescript
interface DefaultCORS {
  'Access-Control-Allow-Origin': '*';
  'Access-Control-Allow-Credentials': 'true';
  'Access-Control-Expose-Headers': '*';
  'Access-Control-Max-Age': '3600';
}
```

**特徴:**
- すべてのオリジンからのリクエストを許可
- 認証情報の送信を有効化
- すべてのヘッダーを公開
- OPTIONSレスポンスを1時間キャッシュ

#### カスタムCORS設定

```typescript
// app/api/restricted+api.ts
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://yourdomain.com',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
```

#### OPTIONSリクエストの処理

```typescript
// app/api/data+api.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    }
  });
}

export async function POST(request: Request) {
  // POST処理
}
```

### セキュリティヘッダー

```typescript
interface SecurityHeaders {
  strictTransportSecurity: {
    header: 'Strict-Transport-Security';
    value: 'max-age=31536000; includeSubDomains';
    effect: {
      enforceHTTPS: true;
      preventMITM: true;
      duration: '1年間';
    };
  };
  versionHeadersRemoved: {
    removed: ['X-Powered-By'];
    purpose: 'サーバー情報の漏洩を防止';
  };
  contentSecurityPolicy: {
    header: 'Content-Security-Policy';
    value: "frame-ancestors 'self'";
    effect: {
      iframeRestriction: '同一オリジンのみ';
      preventClickjacking: true;
    };
  };
}
```

#### カスタムセキュリティヘッダー

```typescript
// app/api/secure+api.ts
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}
```

### リクエストヘッダー

#### 転送されたIP情報

```typescript
export async function GET(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('eas-real-ip');

  console.log('Client IP:', realIp);
}
```

利用可能なヘッダー：
- `x-forwarded-for`: プロキシチェーン
- `eas-real-ip`: クライアントの実際のIP
- `cf-connecting-ip`: Cloudflareの接続IP

#### 地理情報ヘッダー

```typescript
export async function GET(request: Request) {
  const continent = request.headers.get('eas-ip-continent');
  const country = request.headers.get('eas-ip-country');
  const city = request.headers.get('eas-ip-city');
  const timezone = request.headers.get('eas-ip-timezone');

  console.log(`Request from: ${city}, ${country} (${timezone})`);

  return Response.json({
    location: { continent, country, city, timezone }
  });
}
```

利用可能な地理情報ヘッダー：

```typescript
interface GeoHeaders {
  'eas-ip-continent': string;    // 例: 'NA'
  'eas-ip-country': string;      // 例: 'US'
  'eas-ip-city': string;         // 例: 'San Francisco'
  'eas-ip-timezone': string;     // 例: 'America/Los_Angeles'
  'eas-ip-latitude': string;     // 緯度
  'eas-ip-longitude': string;    // 経度
}
```

#### Cloudflareデータセンター情報

```typescript
export async function GET(request: Request) {
  const datacenter = request.headers.get('cf-ray');
  const cfColo = request.headers.get('cf-ipcountry');

  console.log('Datacenter:', datacenter);
}
```

### クラッシュページ

```typescript
interface CrashPage {
  automatic: true;
  features: {
    userFriendlyMessage: true;
    stackTraceHidden: true;      // 本番環境
    dashboardDetails: true;
  };
}
```

#### カスタムエラーハンドリング

```typescript
// app/api/data+api.ts
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);

    return Response.json(
      {
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
```

### 実用的なヘッダー使用例

#### 地理ベースのコンテンツ

```typescript
export async function GET(request: Request) {
  const country = request.headers.get('eas-ip-country');

  const content = getContentForCountry(country);

  return Response.json(content);
}
```

#### レート制限

```typescript
const rateLimits = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get('eas-real-ip') || 'unknown';

  const count = rateLimits.get(ip) || 0;
  if (count > 100) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  rateLimits.set(ip, count + 1);

  // リクエスト処理
  return Response.json({ success: true });
}
```

#### タイムゾーンベースのレスポンス

```typescript
export async function GET(request: Request) {
  const timezone = request.headers.get('eas-ip-timezone');

  const localizedData = formatDataForTimezone(data, timezone);

  return Response.json(localizedData);
}
```

### ヘッダーデバッグ

#### すべてのヘッダーを表示

```typescript
export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());

  return Response.json({
    headers,
    url: request.url,
    method: request.method
  });
}
```

#### 特定のヘッダーを検査

```typescript
export async function GET(request: Request) {
  console.log('--- Request Headers ---');
  console.log('IP:', request.headers.get('eas-real-ip'));
  console.log('Country:', request.headers.get('eas-ip-country'));
  console.log('City:', request.headers.get('eas-ip-city'));
  console.log('User-Agent:', request.headers.get('user-agent'));
  console.log('CF-Ray:', request.headers.get('cf-ray'));

  return Response.json({ success: true });
}
```

### ベストプラクティス

```typescript
interface HeaderBestPractices {
  security: {
    minimumPrivilege: '必要なヘッダーのみを公開';
    corsRestriction: '本番環境では特定のオリジンを指定';
    securityHeaders: 'CSP、X-Frame-Optionsなどを適切に設定';
  };
  performance: {
    headerSize: '不要なヘッダーは送信しない';
    cacheControl: '適切なCache-Controlヘッダーを設定';
    compression: '大きなレスポンスは圧縮';
  };
  debugging: {
    logging: '重要なヘッダー情報をログに記録';
    errorHandling: '適切なエラーレスポンスを返す';
    monitoring: 'ダッシュボードでヘッダーパフォーマンスを監視';
  };
}
```

**参照:** [responses-and-headers.md](/frameworks/expo/docs/eas/hosting/reference/responses-and-headers)

---

## Worker ランタイム

### 概要

```typescript
interface WorkerRuntime {
  basedOn: 'Cloudflare Workers';
  engine: 'V8 JavaScript';
  environment: 'V8 Isolate (マイクロコンテナ)';
  differences: {
    notNodeJS: true;
    limitedNodeAPI: true;
    similarToBrowser: true;
  };
}
```

### 主な特徴

```typescript
interface RuntimeFeatures {
  v8Isolate: {
    small: true;                 // 小さなV8 Isolate
    limitedNodeAPI: true;        // Node.js APIの互換性が制限
    browserLike: true;           // ブラウザやService Workerに類似
  };
  performance: {
    fastColdStart: true;         // 非常に高速なコールドスタート
    millisecondResponse: true;   // ミリ秒単位の応答時間
    improvedScalability: true;   // スケーラビリティの向上
  };
  network: {
    globalEdge: true;            // 世界中のデータセンター
    nearUser: true;              // ユーザーに近い場所で実行
    minimizedLatency: true;      // レイテンシーの最小化
  };
}
```

### Node.js互換性

EAS Hostingは、一部のNode.jsビルトインモジュールの互換性レイヤーを提供しますが、完全な互換性はありません。

#### サポートされるグローバル

##### process.env

```typescript
export async function GET(request: Request) {
  const apiKey = process.env.SECRET_API_KEY;
  const environment = process.env.NODE_ENV;

  return Response.json({ environment });
}
```

**注意:**
- EAS Hosting環境変数で設定された値のみアクセス可能
- Node.jsの`process.env`と同じ動作

##### process.stdout と process.stderr

```typescript
process.stdout.write('This is a log message\n');
process.stderr.write('This is an error message\n');

// 以下と同等：
console.log('This is a log message');
console.error('This is an error message');
```

##### require（制限付き）

```typescript
// サポートされているモジュール
const buffer = require('buffer');
const events = require('events');

// サポートされていないモジュール
// const fs = require('fs');  // エラー
```

##### Buffer

```typescript
const buf = Buffer.from('Hello World');
console.log(buf.toString());  // 'Hello World'
```

##### EventEmitter

```typescript
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

emitter.on('event', (data) => {
  console.log('Event received:', data);
});

emitter.emit('event', 'test data');
```

#### サポートされるNode.jsモジュール

```typescript
interface NodeModuleSupport {
  partialSupport: {
    buffer: '基本的なBuffer操作のみ';
    events: 'EventEmitter基本機能';
    util: '基本ユーティリティ';
    stream: '簡略化されたStream API';
    crypto: 'Web Crypto APIベース';
    path: 'パス操作ユーティリティ';
    url: 'URL解析とフォーマット';
    querystring: 'クエリ文字列の解析';
  };
  notSupported: {
    fs: 'ファイルシステムアクセスなし';
    http: 'Fetch APIを使用';
    https: 'Fetch APIを使用';
    net: 'ソケットアクセスなし';
    child_process: 'プロセス生成なし';
  };
}
```

| モジュール | ステータス | 注意 |
|-----------|----------|------|
| `buffer` | ✅ 部分サポート | 基本的なBuffer操作のみ |
| `events` | ✅ 部分サポート | EventEmitter基本機能 |
| `util` | ✅ 部分サポート | 基本ユーティリティ |
| `stream` | ✅ 部分サポート | 簡略化されたStream API |
| `crypto` | ✅ 部分サポート | Web Crypto APIベース |
| `path` | ✅ 部分サポート | パス操作ユーティリティ |
| `url` | ✅ 部分サポート | URL解析とフォーマット |
| `querystring` | ✅ サポート | クエリ文字列の解析 |
| `fs` | ❌ 未サポート | ファイルシステムアクセスなし |
| `http` | ❌ 未サポート | Fetch APIを使用 |
| `https` | ❌ 未サポート | Fetch APIを使用 |
| `net` | ❌ 未サポート | ソケットアクセスなし |
| `child_process` | ❌ 未サポート | プロセス生成なし |

#### 重要な制限事項

> **重要:** ここに記載されていないモジュールは利用できないか、サポートされていません。コードと依存関係は、これらのモジュールが提供されることに依存してはいけません。

### Web標準APIの使用

#### Fetch API

```typescript
export async function GET(request: Request) {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();

  return Response.json(data);
}
```

**利点:**
- Web標準
- Node.jsの`http`/`https`より簡潔
- Promiseベース

#### Web Crypto API

```typescript
export async function POST(request: Request) {
  const body = await request.text();

  // ハッシュを生成
  const encoder = new TextEncoder();
  const data = encoder.encode(body);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return Response.json({ hash: hashHex });
}
```

#### Streams API

```typescript
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('First chunk\n');
      controller.enqueue('Second chunk\n');
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }
  });
}
```

### ベストプラクティス

```typescript
interface RuntimeBestPractices {
  preferWebStandards: {
    avoid: 'const http = require("http")';
    recommended: 'const response = await fetch(...)';
  };
  checkDependencies: {
    ensure: 'Node.js固有の機能を使用していないライブラリを選択';
  };
  usePolyfills: {
    import: 'import { Buffer } from "buffer"';
  };
  detectEnvironment: {
    check: 'const isCloudflareWorker = typeof caches !== "undefined"';
  };
}
```

### 一般的な移行パターン

#### ファイルシステムからKVストレージへ

```typescript
// ❌ Node.js (動作しない)
const fs = require('fs');
const data = fs.readFileSync('data.json');

// ✅ Cloudflare Workers
// KVストレージまたは外部データソースを使用
const response = await fetch('https://storage.example.com/data.json');
const data = await response.json();
```

#### HTTP ServerからFetch Handlerへ

```typescript
// ❌ Node.js (動作しない)
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello World');
});

// ✅ Cloudflare Workers
export async function GET(request: Request) {
  return new Response('Hello World');
}
```

#### プロセス環境変数

```typescript
// ✅ どちらでも動作
const apiKey = process.env.API_KEY;
```

### パフォーマンスの最適化

#### 1. コールドスタートの最小化

```typescript
// グローバルスコープで初期化（Workers間で共有）
const config = {
  apiUrl: process.env.API_URL,
  timeout: 30000
};

export async function GET(request: Request) {
  // configを使用
}
```

#### 2. 外部リクエストの最小化

```typescript
// 可能な限りリクエストを結合
const [userData, postsData] = await Promise.all([
  fetch('https://api.example.com/users'),
  fetch('https://api.example.com/posts')
]);
```

#### 3. キャッシュの活用

```typescript
export async function GET(request: Request) {
  const cache = caches.default;
  let response = await cache.match(request);

  if (!response) {
    response = await fetch('https://api.example.com/data');
    await cache.put(request, response.clone());
  }

  return response;
}
```

### デバッグのヒント

#### 1. ログ出力

```typescript
export async function GET(request: Request) {
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);

  // 処理

  return Response.json({ success: true });
}
```

#### 2. エラーハンドリング

```typescript
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### 3. ランタイム情報

```typescript
export async function GET(request: Request) {
  return Response.json({
    runtime: 'Cloudflare Workers',
    nodeVersion: process.version || 'N/A',
    platform: process.platform || 'unknown'
  });
}
```

**参照:** [worker-runtime.md](/frameworks/expo/docs/eas/hosting/reference/worker-runtime)

---

## TypeScript型定義

### 基本的な型定義

```typescript
// デプロイメント
interface Deployment {
  id: string;
  url: string;
  createdAt: Date;
  immutable: true;
  aliases: string[];
  environment: Environment;
}

type Environment = 'development' | 'preview' | 'production';

// 環境変数
interface EnvironmentVariables {
  client: ClientSideVariable[];
  server: ServerSideVariable[];
}

interface ClientSideVariable {
  name: string;                  // EXPO_PUBLIC_ プレフィックス必須
  value: string;
  inlinedAtBuild: true;
  public: true;
}

interface ServerSideVariable {
  name: string;
  value: string;
  secret: true;
  uploadedAtDeploy: true;
}

// カスタムドメイン
interface CustomDomainRequirements {
  project: 'EAS Hostingプロジェクト';
  deployment: 'プロダクションデプロイメント';
  domain: '所有するドメイン名';
  plan: 'プレミアムプラン';
}

type DomainType = 'apex' | 'subdomain';

interface DNSRecords {
  verification: TXTRecord;
  ssl: CNAMERecord;
  pointing: ARecord | CNAMERecord;
}

// APIルート監視
interface MonitoringAreas {
  crashes: CrashMonitoring;
  logs: LogMonitoring;
  requests: RequestMonitoring;
}

interface CrashDetails {
  errorMessage: string;
  stackTrace: string[];
  timestamp: Date;
  affectedRequests: number;
}

// キャッシング
interface CachingStrategy {
  browserCache: boolean;
  cdnCache: boolean;
  performance: {
    improvedSpeed: true;
    reducedServerLoad: true;
    betterUserExperience: true;
  };
}

interface CacheDirectives {
  public: CacheDirectiveConfig;
  private: CacheDirectiveConfig;
  noStore: CacheDirectiveConfig;
  noCache: CacheDirectiveConfig;
}

interface CacheDirectiveConfig {
  usage: string;
  cache: string;
  example: string;
}

// ヘッダー
interface SecurityHeaders {
  strictTransportSecurity: HeaderConfig;
  versionHeadersRemoved: HeaderConfig;
  contentSecurityPolicy: HeaderConfig;
}

interface GeoHeaders {
  'eas-ip-continent': string;
  'eas-ip-country': string;
  'eas-ip-city': string;
  'eas-ip-timezone': string;
  'eas-ip-latitude': string;
  'eas-ip-longitude': string;
}

// Worker ランタイム
interface WorkerRuntime {
  basedOn: 'Cloudflare Workers';
  engine: 'V8 JavaScript';
  environment: 'V8 Isolate (マイクロコンテナ)';
  differences: {
    notNodeJS: true;
    limitedNodeAPI: true;
    similarToBrowser: true;
  };
}

interface NodeModuleSupport {
  partialSupport: Record<string, string>;
  notSupported: Record<string, string>;
}
```

---

## コマンドリファレンス

### EAS CLI コマンド

```bash
# インストール
npm install --global eas-cli

# ログイン
eas login

# デプロイ
eas deploy                           # 基本デプロイ
eas deploy --alias staging          # エイリアス付きデプロイ
eas deploy --prod                   # プロダクションへの昇格
eas deploy --environment production # 環境を指定

# 環境変数
eas env:pull                                                      # 環境変数を取得
eas env:pull --environment development                            # 特定環境の変数を取得
eas env:create --name VAR --value "val" --environment production # 変数を作成
eas env:update --name VAR --value "new"                          # 変数を更新
eas env:list                                                      # 変数をリスト
eas env:list --environment production                            # 特定環境の変数をリスト
eas env:delete --name VAR                                        # 変数を削除

# ワークフロー
eas workflow:run deploy              # ワークフローを手動実行

# プロジェクト
npx expo export --platform web       # Webプロジェクトをエクスポート
```

### DNSコマンド

```bash
# TXTレコードの確認
dig TXT _expo-hosting.example.com

# Aレコードの確認
dig A example.com

# CNAMEレコードの確認
dig CNAME app.example.com
```

### 主要なフラグとオプション

```typescript
interface CLIFlags {
  deploy: {
    '--alias': string;           // デプロイメントエイリアス
    '--prod': boolean;           // プロダクションに昇格
    '--environment': Environment; // 環境を指定
  };
  env: {
    '--name': string;            // 変数名
    '--value': string;           // 変数の値
    '--environment': Environment; // 環境
  };
}
```

---

## 参考資料

### 公式ドキュメント

- [EAS Hosting イントロダクション](/frameworks/expo/docs/eas/hosting/introduction)
- [EAS Hosting 開始ガイド](/frameworks/expo/docs/eas/hosting/get-started)
- [デプロイメントとエイリアス](/frameworks/expo/docs/eas/hosting/deployments-and-aliases)
- [環境変数](/frameworks/expo/docs/eas/hosting/environment-variables)
- [カスタムドメイン](/frameworks/expo/docs/eas/hosting/custom-domain)
- [APIルート](/frameworks/expo/docs/eas/hosting/api-routes)
- [ワークフロー](/frameworks/expo/docs/eas/hosting/workflows)

### 技術リファレンス

- [キャッシング](/frameworks/expo/docs/eas/hosting/reference/caching)
- [レスポンスとヘッダー](/frameworks/expo/docs/eas/hosting/reference/responses-and-headers)
- [Worker ランタイム](/frameworks/expo/docs/eas/hosting/reference/worker-runtime)

### 外部リソース

- [Expo Router ドキュメント](https://docs.expo.dev/router/)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Web標準API リファレンス](https://developer.mozilla.org/en-US/docs/Web/API)
- [EAS Workflowsドキュメント](https://docs.expo.dev/eas/workflows/)

---

## まとめ

EAS Hostingは、Expo RouterとReact Native webプロジェクトのための包括的なホスティングソリューションです。主な特徴：

### 主要機能のハイライト

1. **高速デプロイ**: CLI統合による迅速なデプロイプロセス
2. **柔軟な出力モード**: Single、Static、Serverの3つのモードをサポート
3. **環境管理**: クライアントとサーバーの環境変数を分離管理
4. **カスタムドメイン**: 独自ドメインでのホスティング（プレミアム）
5. **包括的な監視**: クラッシュ、ログ、リクエストの完全な可視性
6. **自動化ワークフロー**: GitHub統合による CI/CD
7. **高度なキャッシング**: 多層キャッシング戦略によるパフォーマンス最適化
8. **グローバルCDN**: Cloudflareのエッジネットワークを活用

### ベストプラクティス

```typescript
interface BestPractices {
  deployment: {
    meaningfulAliases: true;     // 意味のあるエイリアス名を使用
    testBeforeProduction: true;  // プロダクション前に十分テスト
    trackHistory: true;          // エイリアスで履歴管理
  };
  environment: {
    separateSecrets: true;       // 機密情報は適切に分離
    documentVariables: true;     // 変数の目的を文書化
    useExampleFile: true;        // .env.exampleをバージョン管理
  };
  performance: {
    appropriateCaching: true;    // データ特性に応じたキャッシング
    tieredStrategy: true;        // 多層キャッシング戦略
    monitorMetrics: true;        // パフォーマンスメトリクスを監視
  };
  security: {
    restrictCORS: true;          // 本番環境でCORSを制限
    useSecurityHeaders: true;    // セキュリティヘッダーを設定
    protectSecrets: true;        // 機密情報を適切に保護
  };
}
```

### 注意事項

- EAS Hostingは現在プレビュー版です
- カスタムドメインはプレミアムプラン必要
- Worker ランタイムはNode.js完全互換ではありません
- キャッシュされたリクエストもクォータにカウントされます

### サポートとフィードバック

問題やフィードバックがある場合は：
- [Discord](https://chat.expo.dev/)チャンネル
- hosting@expo.dev

---

このドキュメントは、EAS Hostingの全機能を網羅した包括的なガイドです。具体的な実装や詳細については、各セクションのリンクから個別のドキュメントを参照してください。
