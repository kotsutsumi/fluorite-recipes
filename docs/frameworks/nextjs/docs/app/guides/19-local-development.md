# ローカル開発のパフォーマンス最適化

Next.js のローカル開発環境のパフォーマンスを最適化する方法を説明します。開発速度を向上させ、より生産的な開発体験を実現するための戦略を紹介します。

## 主要なパフォーマンス改善戦略

### 1. ウイルス対策ソフトウェアの設定

プロジェクトフォルダをウイルス対策ソフトの除外リストに追加します。

#### Windows Defender の例

1. **Windows セキュリティ** を開く
2. **ウイルスと脅威の防止** → **設定の管理**
3. **除外** → **除外の追加または削除**
4. プロジェクトフォルダを追加

#### macOS の例

システム設定で開発者ツールとプロジェクトフォルダを除外します。

**重要**: すべてのウイルス対策ソフトウェアに適用可能です。

### 2. Next.js の更新と Turbopack の有効化

最新バージョンの Next.js をインストールし、Turbopack を有効にしてローカルパフォーマンスを向上させます。

#### 更新

```bash
npm install next@latest
```

#### Turbopack の有効化

```bash
npm run dev --turbopack
```

または、package.json を更新：

```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

### 3. インポートの最適化

#### アイコンライブラリ

アイコンライブラリ全体をインポートせず、特定のアイコンのみをインポートします。

```typescript
// ❌ 悪い例 - ライブラリ全体をインポート
import { TriangleIcon } from '@phosphor-icons/react'

// ✅ 良い例 - 特定のアイコンのみをインポート
import { TriangleIcon } from '@phosphor-icons/react/dist/csr/Triangle'
```

他のアイコンライブラリの例：

```typescript
// React Icons
import { FaHome } from 'react-icons/fa/FaHome'

// Heroicons
import { HomeIcon } from '@heroicons/react/24/solid/HomeIcon'
```

#### バレルファイルの回避

バレルファイル（`index.ts`）からのインポートを避け、特定のファイルから直接インポートします。

```typescript
// ❌ 悪い例 - バレルファイルからインポート
import { Button, Input, Card } from '@/components'

// ✅ 良い例 - 特定のファイルから直接インポート
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
```

#### パッケージインポートの最適化

`next.config.js` で `optimizePackageImports` を使用します。

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lodash', 'date-fns'],
  },
}
```

### 4. Tailwind CSS の設定

コンテンツスキャンを具体的に指定します。

#### 悪い例

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './**/*.{js,ts,jsx,tsx}', // ❌ すべてのファイルをスキャン
  ],
}
```

#### 良い例

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ src フォルダのみ
    './app/**/*.{js,ts,jsx,tsx}', // ✅ app フォルダのみ
    './components/**/*.{js,ts,jsx,tsx}', // ✅ components フォルダのみ
  ],
}
```

不要なファイルを除外：

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '!./src/**/*.test.{js,ts,jsx,tsx}', // テストファイルを除外
    '!./src/**/*.stories.{js,ts,jsx,tsx}', // Storybook ファイルを除外
  ],
}
```

### 5. カスタム Webpack 設定の最小化

カスタム Webpack 設定を最小限に抑えます。

#### 移行を検討

Turbopack への移行を検討してください。カスタム Webpack 設定の多くは不要になります。

```javascript
// next.config.js
module.exports = {
  // ❌ 複雑なカスタム Webpack 設定を削除
  // webpack: (config) => {
  //   // 複雑なカスタマイズ...
  //   return config
  // },

  // ✅ Turbopack を使用
}
```

### 6. メモリ使用量の最適化

Next.js メモリ使用量ガイドを参照してください。

```javascript
// next.config.js
module.exports = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
}
```

詳細は [Memory Usage ガイド](./21-memory-usage.md) を参照してください。

### 7. Server Components の最適化

開発中に `fetch` レスポンスをキャッシュする実験的オプションを使用します。

```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsHmrCache: true,
  },
}
```

これにより、HMR（Hot Module Replacement）中に `fetch` リクエストが再実行されなくなります。

### 8. 開発環境の選択

#### ローカル開発を優先

Docker よりもローカル開発を優先します。

```bash
# ✅ ローカル開発
npm run dev

# ⚠️ Docker は本番環境用に使用
docker-compose up
```

#### Docker を使用する場合

開発用の最適化された Docker 設定：

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# 依存関係のみをコピー（キャッシュ最適化）
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# ボリュームマウント用のディレクトリ
VOLUME ["/app/node_modules"]

CMD ["npm", "run", "dev"]
```

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## パフォーマンスデバッグツール

### 詳細な Fetch ログ

```javascript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

これにより、すべての fetch リクエストの詳細がコンソールに表示されます。

### Turbopack トレーシング

#### トレースファイルの生成

```bash
NEXT_TURBOPACK_TRACING=1 npm run dev
```

#### トレースの分析

生成されたトレースファイルを https://trace.nextjs.org/ で分析します。

1. 開発サーバーを起動（トレーシング有効）
2. アプリケーションを使用
3. 生成された `.trace` ファイルを trace.nextjs.org にアップロード
4. パフォーマンスボトルネックを分析

### Node.js プロファイリング

```bash
node --inspect node_modules/.bin/next dev
```

Chrome DevTools で `chrome://inspect` を開いてデバッグします。

## 追加の最適化

### 1. Git の設定

`.gitignore` を最適化してパフォーマンスを向上させます。

```gitignore
# .gitignore
node_modules/
.next/
out/
.turbo/
*.log
.DS_Store
.env*.local
```

### 2. エディタの設定

#### VS Code の設定

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/.turbo/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/.turbo": true
  }
}
```

### 3. ファイルシステムウォッチャーの制限

macOS/Linux の場合：

```bash
# .zshrc または .bashrc に追加
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 4. npm/yarn/pnpm の最適化

#### パッケージマネージャーの選択

pnpm は通常、最も高速です：

```bash
# pnpm のインストール
npm install -g pnpm

# 依存関係のインストール
pnpm install
```

#### キャッシュのクリア

パフォーマンスの問題がある場合：

```bash
# npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install

# yarn
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

## パフォーマンスベンチマーク

### 起動時間の測定

```bash
time npm run dev
```

### メモリ使用量の監視

```bash
# Node.js のメモリ使用量を表示
node --max-old-space-size=4096 node_modules/.bin/next dev
```

### ビルド時間の測定

```bash
time npm run build
```

## トラブルシューティング

### 遅い HMR（Hot Module Replacement）

1. **大きなファイルを分割**: 大きなコンポーネントファイルを小さく分割
2. **Dynamic import を使用**: 必要に応じて遅延読み込み
3. **キャッシュをクリア**: `.next` フォルダを削除

### 高いメモリ使用量

1. **依存関係を削減**: 不要なパッケージを削除
2. **Webpack 最適化を有効化**: `webpackMemoryOptimizations: true`
3. **Node.js のヒープサイズを増やす**: `--max-old-space-size=4096`

### 遅いビルド

1. **Turbopack を使用**: `--turbopack` フラグを追加
2. **並列ビルドを有効化**: `experimental.cpus` を設定
3. **キャッシュを有効化**: `.next/cache` を保持

## ベストプラクティス

1. **最新の Next.js を使用**: 常に最新バージョンに更新
2. **Turbopack を有効化**: 開発中のパフォーマンスが大幅に向上
3. **インポートを最適化**: 必要なものだけをインポート
4. **ウイルス対策を設定**: プロジェクトフォルダを除外
5. **定期的なキャッシュクリア**: `.next` フォルダを定期的に削除
6. **パフォーマンスを測定**: ベンチマークツールを使用
7. **ドキュメントを参照**: 公式ドキュメントで最新の最適化を確認

## まとめ

ローカル開発のパフォーマンスを最適化するポイント：

- **環境設定**: ウイルス対策の除外、エディタの設定
- **Next.js 設定**: Turbopack、パッケージ最適化
- **コードの最適化**: インポートの最適化、コンポーネントの分割
- **ツールの活用**: トレーシング、プロファイリング
- **継続的な改善**: 定期的なベンチマークと最適化

これらの戦略を実装することで、開発速度が大幅に向上し、より生産的な開発体験を実現できます。
