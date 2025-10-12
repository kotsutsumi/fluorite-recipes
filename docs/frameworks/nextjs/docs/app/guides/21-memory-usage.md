# メモリ使用量の最適化

Next.js アプリケーションのメモリ使用量を最適化するための戦略を説明します。大規模またはメモリ集約的なプロジェクトのビルドとランタイムパフォーマンスを向上させる方法を紹介します。

## 主要な最適化テクニック

### 1. 依存関係の削減

Bundle Analyzer を使用して、大きな依存関係を調査し削除します。

#### Bundle Analyzer のインストール

```bash
npm install --save-dev @next/bundle-analyzer
```

#### 設定

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js の設定
})
```

#### 分析の実行

```bash
ANALYZE=true npm run build
```

ブラウザで自動的に開かれる視覚化レポートで、大きな依存関係を特定できます。

#### 不要なパッケージの削除

```bash
# 使用していないパッケージを見つける
npx depcheck

# パッケージを削除
npm uninstall package-name
```

### 2. Webpack メモリ最適化

`next.config.js` で Webpack メモリ最適化を有効にします。

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
}

module.exports = nextConfig
```

**注意**: コンパイル時間がわずかに増加する可能性がありますが、メモリ使用量が削減されます。

### 3. ビルドメモリのデバッグ

#### デバッグモードでビルド

```bash
next build --experimental-debug-memory-usage
```

これにより、以下の情報が出力されます：

- **ビルド中のメモリ使用量**: 各段階でのメモリ消費
- **ヒープスナップショット**: メモリ制限に近づくと自動的に取得

#### ヒープスナップショットの場所

```
.next/cache/
├── heap-profile-1.heapprofile
├── heap-profile-2.heapprofile
└── ...
```

### 4. ヒーププロファイリング

Node.js のヒーププロファイリング機能を使用します。

#### ビルド時のプロファイリング

```bash
node --heap-prof node_modules/.bin/next build
```

#### プロファイルの分析

1. `.heapprofile` ファイルが生成される
2. Chrome DevTools を開く（`chrome://inspect`）
3. **Memory** タブを選択
4. **Load** ボタンをクリックして `.heapprofile` ファイルを読み込む
5. メモリ使用量を分析

#### ビルド中のヒープスナップショット

ビルドプロセス中に手動でヒープスナップショットを取得：

```bash
# ビルドを開始
next build &

# プロセス ID を取得
PID=$!

# SIGUSR2 シグナルを送信してスナップショットを取得
kill -USR2 $PID
```

### 5. 追加のメモリ削減方法

#### Webpack ビルドワーカーの有効化

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
}

module.exports = nextConfig
```

#### Webpack キャッシュの無効化

メモリを優先する場合：

```javascript
// next.config.js
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.cache = false
    return config
  },
}

module.exports = nextConfig
```

**注意**: ビルド時間が増加する可能性があります。

#### ビルド中の静的解析を無効化

```javascript
// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
```

**警告**: これらは開発中には推奨されません。CI/CD パイプラインで別途チェックしてください。

#### ソースマップの無効化

```javascript
// next.config.js
const nextConfig = {
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

#### プリロードエントリの調整

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
}

module.exports = nextConfig
```

## 包括的な設定例

メモリ使用量を最適化する完全な設定：

```javascript
// next.config.js
const nextConfig = {
  // Webpack メモリ最適化
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    preloadEntriesOnStart: false,
  },

  // ソースマップを無効化
  productionBrowserSourceMaps: false,

  // ビルド中の静的解析をスキップ（本番ビルドのみ）
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Webpack 設定
  webpack: (config, { isServer, dev }) => {
    // 本番ビルドでメモリを優先
    if (!dev && process.env.OPTIMIZE_MEMORY === 'true') {
      config.cache = false
    }

    return config
  },
}

module.exports = nextConfig
```

## Node.js ヒープサイズの調整

### ヒープサイズの増加

メモリエラーが発生する場合、Node.js のヒープサイズを増やします。

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build",
    "dev": "NODE_OPTIONS='--max-old-space-size=2048' next dev"
  }
}
```

推奨値：

- **小規模プロジェクト**: 2048 MB (2 GB)
- **中規模プロジェクト**: 4096 MB (4 GB)
- **大規模プロジェクト**: 8192 MB (8 GB)

### クロスプラットフォーム対応

Windows と macOS/Linux の両方で動作するように：

```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

## メモリリークの検出

### プロファイリングツール

#### Clinic.js の使用

```bash
npm install -g clinic

# メモリリークを検出
clinic doctor -- node node_modules/.bin/next build
```

#### Node.js インスペクターの使用

```bash
node --inspect node_modules/.bin/next build
```

Chrome DevTools で `chrome://inspect` を開いてメモリリークを調査します。

## パフォーマンス監視

### ビルド時のメモリ使用量を記録

```javascript
// scripts/build-with-memory-tracking.js
const { spawn } = require('child_process')
const pidusage = require('pidusage')

const buildProcess = spawn('next', ['build'])

const interval = setInterval(async () => {
  try {
    const stats = await pidusage(buildProcess.pid)
    console.log(`Memory: ${Math.round(stats.memory / 1024 / 1024)} MB`)
  } catch (error) {
    clearInterval(interval)
  }
}, 1000)

buildProcess.on('exit', () => {
  clearInterval(interval)
})
```

```bash
npm install --save-dev pidusage
node scripts/build-with-memory-tracking.js
```

## CI/CD での最適化

### GitHub Actions の例

```yaml
# .github/workflows/build.yml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build with memory optimization
        run: |
          NODE_OPTIONS='--max-old-space-size=4096' npm run build
        env:
          OPTIMIZE_MEMORY: 'true'
```

### Docker での最適化

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# メモリ制限を設定
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["npm", "start"]
```

## トラブルシューティング

### Out of Memory エラー

#### エラーメッセージ

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

#### 解決策

1. **ヒープサイズを増やす**:
   ```bash
   NODE_OPTIONS='--max-old-space-size=8192' npm run build
   ```

2. **依存関係を削減**: Bundle Analyzer で大きなパッケージを特定

3. **Webpack 最適化を有効化**:
   ```javascript
   experimental: {
     webpackMemoryOptimizations: true,
   }
   ```

### ビルドが遅い

メモリ最適化によりビルドが遅くなる場合：

1. **Turbopack を使用**:
   ```bash
   npm run dev --turbopack
   ```

2. **増分ビルドを有効化**:
   ```javascript
   experimental: {
     incrementalCacheHandlerPath: './cache-handler.js',
   }
   ```

3. **並列処理を調整**:
   ```javascript
   experimental: {
     cpus: Math.max(1, require('os').cpus().length - 1),
   }
   ```

## ベストプラクティス

1. **定期的な依存関係の監査**: 不要なパッケージを削除
2. **バンドルサイズの監視**: 継続的にバンドルサイズをチェック
3. **段階的な最適化**: 一度にすべてを適用せず、段階的にテスト
4. **メトリクスの記録**: ビルド時間とメモリ使用量を追跡
5. **CI/CD での検証**: 本番環境と同じ条件でテスト
6. **ドキュメント化**: チームで最適化設定を共有

## まとめ

メモリ使用量を最適化する主なポイント：

1. **依存関係の管理**: 不要なパッケージを削減
2. **Webpack 最適化**: メモリ最適化機能を有効化
3. **プロファイリング**: メモリ使用量を測定して分析
4. **Node.js 設定**: ヒープサイズを適切に調整
5. **ビルド設定**: 不要な機能を無効化
6. **継続的な監視**: メトリクスを追跡して改善

これらの戦略を実装することで、大規模な Next.js プロジェクトでも効率的にビルドとデプロイが可能になります。
