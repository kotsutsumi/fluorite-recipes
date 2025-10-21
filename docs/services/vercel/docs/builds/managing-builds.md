# ビルドの管理

Vercelでのビルドプロセスの管理と最適化。

## 概要

Vercelは、アプリケーションデプロイメントのためにビルドプロセスを実行します。ビルド管理には、依存関係のインストール、ビルドスクリプトの実行、ビルド出力のCDNへのアップロードが含まれます。

## ビルドプロセス

### 基本的なビルドフロー

```typescript
interface BuildProcess {
  steps: [
    '依存関係のインストール',
    'ビルドスクリプトの実行',
    'ビルド出力のアップロード',
    'CDNへのデプロイ'
  ];
}
```

### ステップ詳細

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **ビルドスクリプトの実行**
   ```bash
   npm run build
   ```

3. **ビルド出力の検証とアップロード**
   ```bash
   # .next/, dist/, build/ などをアップロード
   ```

4. **CDNへの配信**
   - グローバルエッジネットワークへのデプロイ

## ビルド管理オプション

### 1. 同時ビルド（Concurrent Builds）

複数のデプロイメントを同時にビルドできます。

#### プランごとの制限

| プラン | 同時ビルド数 |
|--------|--------------|
| Hobby | 1 |
| Pro | 最大12 |
| Enterprise | カスタム |

#### 設定方法

**ダッシュボード:**

1. チーム設定に移動
2. **Usage** > **Concurrent Builds**
3. スライダーで制限を調整

```typescript
interface ConcurrentBuilds {
  plan: 'Pro' | 'Enterprise';
  maxConcurrent: number;
  adjustable: boolean;
}
```

#### 利用シーン

- 複数のブランチで同時開発
- チームでの並行作業
- 頻繁なデプロイメント

### 2. オンデマンド同時ビルド（On-Demand Concurrent Builds）

ビルド容量を動的にスケールします。

#### 特徴

```typescript
interface OnDemandBuilds {
  queueSkip: true;              // キューをスキップ
  dynamicScaling: true;         // 動的スケーリング
  billing: 'per build minute';  // ビルド分数で課金
}
```

#### アクティベーション方法

**方法1: 緊急ビルド（Urgent Builds）**

1. デプロイメント詳細ページに移動
2. **Start Building Now**ボタンをクリック
3. ビルドが即座に開始

**方法2: プロジェクトレベル設定**

1. **Settings** > **General**
2. **Build & Development Settings**
3. **On-Demand Concurrent Builds**を有効化

```json
{
  "onDemandConcurrentBuilds": {
    "enabled": true,
    "scope": "project"
  }
}
```

#### 料金

使用したビルド分数に基づいて課金：

```typescript
interface Pricing {
  unit: 'build minutes';
  model: 'pay-as-you-go';
  benefit: '無制限の同時ビルド';
}
```

### 3. Enhanced Build Machines

より強力なビルドコンピュートオプション。

#### ビルドマシンの種類

| タイプ | vCPU | メモリ | コスト |
|--------|------|--------|--------|
| Standard | 4 | 8 GB | 標準 |
| Enhanced | 8 | 16 GB | 高コスト |

#### 設定方法

**ダッシュボード:**

1. **Settings** > **General**
2. **Build & Development Settings**
3. **Build Machine**を選択

```json
{
  "buildMachine": {
    "type": "enhanced",
    "vCPU": 8,
    "memory": "16GB"
  }
}
```

#### 使用シーン

- 大規模なプロジェクト
- 複雑なビルドプロセス
- 長時間のビルド
- ビルド時間の短縮が必要な場合

## ビルドキューの管理

### ビルドキューの回避

**推奨: オンデマンド同時ビルドの使用**

```typescript
interface QueueManagement {
  method: 'On-Demand Concurrent Builds';
  benefit: 'すべてのキューイングを防止';
  availability: 'Pro and Enterprise';
}
```

### プロダクションビルドの優先順位付け

**設定:**

1. **Settings** > **Git**
2. **Production Branch**を設定
3. プロダクションビルドが優先される

```json
{
  "git": {
    "productionBranch": "main"
  }
}
```

## ビルド最適化戦略

### 1. ビルドキャッシュの理解

#### キャッシュされる項目

```typescript
interface BuildCache {
  directories: [
    'node_modules',
    '.next/cache',
    '.cache',
    'dist'
  ];
  maxSize: '1 GB';
}
```

#### キャッシュディレクトリの指定

**vercel.json:**

```json
{
  "cacheDirectories": [
    "node_modules",
    ".next/cache",
    ".nuxt",
    ".cache"
  ]
}
```

#### キャッシュのクリア

**Vercel CLI:**

```bash
vercel build --force
```

**ダッシュボード:**

1. デプロイメント詳細ページ
2. **Redeploy** > **Clear Build Cache**

### 2. 不要なビルドステップの無視

#### Ignored Build Step

コミットの内容に基づいてビルドをスキップします。

**設定:**

1. **Settings** > **Git**
2. **Ignored Build Step**フィールド
3. コマンドを入力

```bash
# 例: docsディレクトリの変更のみの場合、ビルドをスキップ
git diff HEAD^ HEAD --quiet -- . ':(exclude)docs/'
```

#### 使用例

```bash
# package.jsonが変更されていない場合、スキップ
git diff HEAD^ HEAD --quiet package.json
```

```bash
# 特定のディレクトリのみの変更の場合、スキップ
git diff HEAD^ HEAD --quiet -- . ':(exclude)src/'
```

### 3. 最新ランタイムバージョンの使用

#### Node.jsバージョンの指定

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

#### メリット

- パフォーマンスの向上
- 最新機能の利用
- セキュリティ強化

### 4. 依存関係の最適化

#### 不要な依存関係の削除

```json
{
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  }
}
```

#### ロックファイルの使用

```bash
# package-lock.json, yarn.lock, pnpm-lock.yaml を必ずコミット
git add package-lock.json
git commit -m "Update dependencies"
```

#### 依存関係の監査

```bash
npm audit
npm audit fix
```

### 5. ビルドコマンドの最適化

#### 並列ビルド

```json
{
  "scripts": {
    "build": "npm-run-all --parallel build:*",
    "build:app": "next build",
    "build:types": "tsc --noEmit"
  }
}
```

#### 条件付きビルド

```json
{
  "scripts": {
    "build": "node build-script.js"
  }
}
```

**build-script.js:**

```javascript
const { execSync } = require('child_process');

// 環境に応じてビルドコマンドを変更
if (process.env.VERCEL_ENV === 'production') {
  execSync('npm run build:prod', { stdio: 'inherit' });
} else {
  execSync('npm run build:preview', { stdio: 'inherit' });
}
```

## ビルドモニタリング

### ビルド時間の追跡

**ダッシュボード:**

1. プロジェクトの**Deployments**タブ
2. 各デプロイメントのビルド時間を確認

```typescript
interface BuildMetrics {
  buildTime: number;      // 秒
  queueTime: number;      // 秒
  totalTime: number;      // 秒
  cacheHit: boolean;      // キャッシュヒット
}
```

### ビルドログの確認

**アクセス方法:**

1. **Vercelダッシュボード**: デプロイメント詳細ページ
2. **特殊URL**: `https://your-deployment.vercel.app/_logs`
3. **Vercel CLI**: `vercel logs`

**ログの内容:**

```
Installing dependencies...
✓ Installed 234 packages in 15s

Building...
✓ Compiled successfully in 45s

Uploading build output...
✓ Uploaded 1.2 MB in 3s

Deployment ready
```

## トラブルシューティング

### ビルドが遅い

**診断:**

1. ビルドログを確認
2. ビルド時間の内訳を分析
3. ボトルネックを特定

**解決策:**

1. **Enhanced Build Machinesを使用**
   ```json
   { "buildMachine": "enhanced" }
   ```

2. **キャッシュを最適化**
   ```json
   { "cacheDirectories": ["node_modules", ".next/cache"] }
   ```

3. **依存関係を削減**
   - 不要なパッケージを削除
   - tree-shakingを活用

### ビルドがキューに滞在

**原因:**
- 同時ビルド制限に達している

**解決策:**

1. **オンデマンド同時ビルドを有効化**
2. **不要なビルドをキャンセル**
3. **プランをアップグレード**

### メモリ不足エラー

**問題:**
```
Error: JavaScript heap out of memory
```

**解決策:**

1. **Enhanced Build Machinesを使用**

2. **Node.jsメモリ制限を増やす**
   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max_old_space_size=4096' next build"
     }
   }
   ```

3. **ビルドプロセスを最適化**
   - 並列処理を削減
   - メモリ使用量の多いプロセスを分離

## ベストプラクティス

### 1. オンデマンド同時ビルドの使用

ProまたはEnterpriseプランでは、オンデマンド同時ビルドを有効にしてキューイングを回避します。

### 2. ビルドキャッシュの活用

適切なキャッシュディレクトリを設定して、ビルド時間を短縮します。

### 3. Ignored Build Stepの活用

ドキュメントのみの変更など、ビルドが不要な場合はスキップします。

### 4. ランタイムの最新化

Node.jsやその他のランタイムを最新の安定版に保ちます。

### 5. ビルドメトリクスの監視

ビルド時間とリソース使用量を定期的に確認し、最適化の機会を特定します。

### 6. プロダクションビルドの優先順位付け

プロダクションブランチを明確に設定し、本番デプロイメントを優先します。

## 関連リンク

- [ビルド概要](/docs/builds)
- [ビルドの設定](/docs/builds/configure-a-build)
- [ビルドキュー](/docs/builds/build-queues)
- [ビルド機能](/docs/builds/build-features)
- [プランと価格](https://vercel.com/pricing)
