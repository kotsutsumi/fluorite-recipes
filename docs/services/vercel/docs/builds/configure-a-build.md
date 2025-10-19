# ビルドの設定

Vercelプロジェクトのビルド設定をカスタマイズする方法。

## 概要

Vercelでプロジェクトをデプロイする際、Gitリポジトリの**Shallow Clone**（最新の10コミット）が実行されます。Vercelは多くのフロントエンドフレームワークのビルド設定を自動的に構成しますが、カスタマイズも可能です。

## ビルド設定の場所

### Vercelダッシュボード

1. プロジェクトダッシュボードに移動
2. **Settings**タブをクリック
3. **Build & Development Settings**セクションを選択

### vercel.json

プロジェクトルートに`vercel.json`を配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## 主要な設定オプション

### 1. フレームワーク設定

#### 自動検出

Vercelは以下のフレームワークを自動検出します：

- Next.js
- React (Create React App)
- Vue.js (Vite, Nuxt)
- Svelte (SvelteKit)
- Angular
- その他多数

#### 手動選択

**ダッシュボードでの設定:**

1. **Settings** > **Build & Development Settings**
2. **Framework Preset**ドロップダウン
3. 適切なフレームワークを選択

**vercel.json:**

```json
{
  "framework": "nextjs"
}
```

#### サポートされるフレームワーク

```typescript
type Framework =
  | 'nextjs'
  | 'create-react-app'
  | 'vite'
  | 'nuxtjs'
  | 'sveltekit'
  | 'angular'
  | 'vue'
  | 'gatsby'
  | 'remix'
  | 'astro';
```

### 2. ビルドコマンド

#### デフォルトのビルドコマンド

```bash
npm run build
```

#### カスタムビルドコマンド

**package.json:**

```json
{
  "scripts": {
    "build": "next build",
    "build:prod": "NODE_ENV=production next build"
  }
}
```

**vercel.json:**

```json
{
  "buildCommand": "npm run build:prod"
}
```

#### 複数のコマンド

```json
{
  "buildCommand": "npm run pre-build && npm run build && npm run post-build"
}
```

#### ビルドスキップ

静的プロジェクトでビルドをスキップ：

```json
{
  "buildCommand": null
}
```

### 3. 出力ディレクトリ

#### デフォルトの出力ディレクトリ

フレームワークごとに異なります：

| フレームワーク | デフォルト出力ディレクトリ |
|----------------|--------------------------|
| Next.js | `.next` |
| Create React App | `build` |
| Vite | `dist` |
| Nuxt | `.output` |
| SvelteKit | `.svelte-kit` |

#### カスタム出力ディレクトリ

**vercel.json:**

```json
{
  "outputDirectory": "public"
}
```

**Next.js設定:**

```javascript
// next.config.js
module.exports = {
  distDir: 'build'
};
```

### 4. インストールコマンド

#### デフォルトのインストールコマンド

Vercelは自動的にパッケージマネージャーを検出：

| ロックファイル | コマンド |
|----------------|----------|
| `package-lock.json` | `npm install` |
| `yarn.lock` | `yarn install` |
| `pnpm-lock.yaml` | `pnpm install` |

#### カスタムインストールコマンド

**vercel.json:**

```json
{
  "installCommand": "pnpm install --frozen-lockfile"
}
```

#### インストールスキップ

```json
{
  "installCommand": null
}
```

### 5. 開発コマンド

#### デフォルトの開発コマンド

```bash
npm run dev
```

#### カスタム開発コマンド

**vercel.json:**

```json
{
  "devCommand": "npm run start:dev"
}
```

**package.json:**

```json
{
  "scripts": {
    "dev": "next dev",
    "start:dev": "next dev --port 3001"
  }
}
```

### 6. ルートディレクトリ

モノレポやサブディレクトリをルートとして指定します。

#### ディレクトリ構造

```
/
  packages/
    web/        ← ルートディレクトリに設定
      package.json
      next.config.js
    api/
      package.json
  package.json
```

#### 設定

**ダッシュボード:**

1. **Settings** > **Build & Development Settings**
2. **Root Directory**
3. `packages/web`を入力

**vercel.json:**

```json
{
  "buildCommand": "cd packages/web && npm run build"
}
```

### 7. Node.jsバージョン

#### package.jsonでの指定

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

#### 環境変数での指定

```
NODE_VERSION=20
```

#### サポートされるバージョン

- Node.js 22.x（最新）
- Node.js 20.x（LTS）
- Node.js 18.x

### 8. パッケージマネージャー

#### 自動検出

Vercelはロックファイルに基づいて自動検出します。

#### 明示的な指定

**環境変数:**

```
PACKAGE_MANAGER=pnpm
```

#### Corepackサポート（実験的）

```json
{
  "packageManager": "pnpm@8.0.0"
}
```

環境変数で有効化：

```
ENABLE_EXPERIMENTAL_COREPACK=1
```

## フレームワーク別の設定例

### Next.js

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "next dev"
}
```

### Vite + React

```json
{
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "vite"
}
```

### Nuxt 3

```json
{
  "framework": "nuxtjs",
  "buildCommand": "nuxt build",
  "outputDirectory": ".output/public",
  "installCommand": "npm install",
  "devCommand": "nuxt dev"
}
```

### SvelteKit

```json
{
  "framework": "sveltekit",
  "buildCommand": "svelte-kit build",
  "outputDirectory": ".svelte-kit",
  "installCommand": "npm install",
  "devCommand": "svelte-kit dev"
}
```

### 静的サイト

```json
{
  "buildCommand": null,
  "outputDirectory": "public",
  "installCommand": null,
  "devCommand": null
}
```

## モノレポの設定

### Turborepoの例

**ディレクトリ構造:**

```
/
  apps/
    web/
      package.json
    docs/
      package.json
  packages/
    ui/
      package.json
  package.json
  turbo.json
```

**vercel.json（webアプリ）:**

```json
{
  "buildCommand": "turbo run build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install"
}
```

### pnpm Workspacesの例

**pnpm-workspace.yaml:**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**vercel.json:**

```json
{
  "buildCommand": "pnpm --filter web build",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

## 環境固有の設定

### プロダクションビルドの優先順位付け

**ダッシュボード:**

1. **Settings** > **Git**
2. **Production Branch**を`main`に設定

### 環境変数での条件分岐

```json
{
  "scripts": {
    "build": "node build-script.js"
  }
}
```

**build-script.js:**

```javascript
const isProduction = process.env.VERCEL_ENV === 'production';

if (isProduction) {
  // プロダクション用ビルド
  require('child_process').execSync('npm run build:prod');
} else {
  // プレビュー用ビルド
  require('child_process').execSync('npm run build:preview');
}
```

## ビルド最適化

### 1. キャッシュの活用

```json
{
  "cacheDirectories": [
    "node_modules",
    ".next/cache",
    ".cache"
  ]
}
```

### 2. 並列ビルド

```json
{
  "buildCommand": "npm run build:parallel"
}
```

**package.json:**

```json
{
  "scripts": {
    "build:parallel": "npm-run-all --parallel build:*",
    "build:app": "next build",
    "build:storybook": "build-storybook"
  }
}
```

### 3. インクリメンタルビルド

```javascript
// next.config.js
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js')
  }
};
```

## トラブルシューティング

### ビルドコマンドが見つからない

**問題:**
```
Error: Command "build" not found.
```

**解決策:**

1. `package.json`に`build`スクリプトを追加：
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

2. または`vercel.json`で明示的に指定：
```json
{
  "buildCommand": "next build"
}
```

### 出力ディレクトリが空

**問題:**
ビルドは成功するが、デプロイメントにファイルがない。

**解決策:**

正しい出力ディレクトリを指定：

```json
{
  "outputDirectory": "dist"
}
```

### Node.jsバージョンの不一致

**問題:**
ローカルとVercelでビルド結果が異なる。

**解決策:**

`package.json`でバージョンを明示：

```json
{
  "engines": {
    "node": "20.11.0"
  }
}
```

## ベストプラクティス

1. **フレームワークプリセットの使用**
   - 可能な限りデフォルト設定を使用

2. **明示的なバージョン指定**
   - Node.jsバージョンを明確に指定

3. **キャッシュの活用**
   - ビルド時間を短縮

4. **環境変数の活用**
   - 環境ごとに異なる設定を使用

5. **ビルドログの確認**
   - 設定が正しく適用されているか確認

## 関連リンク

- [ビルド概要](/docs/builds)
- [ビルド機能](/docs/builds/build-features)
- [ビルドイメージ](/docs/builds/build-image)
- [環境変数](/docs/environment-variables)
- [モノレポ](/docs/monorepos)
