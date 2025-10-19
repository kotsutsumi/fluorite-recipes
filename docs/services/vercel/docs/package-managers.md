# パッケージマネージャー

Vercelは、プロジェクトで使用されているパッケージマネージャーを自動的に検出し、[デプロイメント](/docs/deployments/builds#build-process)時に依存関係をインストールします。これは、プロジェクト内のロックファイルを確認し、適切なパッケージマネージャーを推測することで行われます。

[Corepack](/docs/deployments/configure-a-build#corepack)を使用している場合、Vercelは`package.json`ファイルの`packageManager`フィールドで指定されたパッケージマネージャーを使用します。

## サポートされているパッケージマネージャー

以下の表は、Vercelでサポートされているパッケージマネージャー、インストールコマンド、およびサポートされているバージョンを示しています：

| パッケージマネージャー | ロックファイル | インストールコマンド | サポートされているバージョン |
|----------------------|--------------|---------------------|------------------------------|
| Yarn | [`yarn.lock`](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/) | [`yarn install`](https://classic.yarnpkg.com/lang/en/docs/cli/install/) | 1, 2, 3, 4 |
| npm | [`package-lock.json`](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json) | [`npm install`](https://docs.npmjs.com/cli/v8/commands/npm-install) | 8, 9, 10 |
| pnpm | [`pnpm-lock.yaml`](https://pnpm.io/git) | [`pnpm install`](https://pnpm.io/cli/install) | 6, 7, 8, 9, 10 |
| Bun | [`bun.lockb`](https://bun.sh/docs/install/lockfile) | [`bun install`](https://bun.sh/docs/cli/install) | 1.0以降 |

## パッケージマネージャーの検出

Vercelは、以下の優先順位でパッケージマネージャーを検出します：

1. **Corepackの`packageManager`フィールド**（`package.json`）
2. **ロックファイルの存在**
3. **デフォルト**（npm）

### 例：Corepackを使用した指定

```json
{
  "name": "my-project",
  "packageManager": "pnpm@9.0.0"
}
```

Vercelは、指定されたバージョンのpnpmを使用します。

### 例：ロックファイルによる自動検出

```
my-project/
├── package.json
└── pnpm-lock.yaml  ← Vercelはpnpmを使用
```

## 各パッケージマネージャーの特徴

### npm

**特徴：**
- Node.jsに標準で含まれる
- 広く使用されている
- 安定性と信頼性が高い

**使用例：**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**インストール：**

```bash
npm install
```

### Yarn

**特徴：**
- 高速で効率的
- ワークスペース機能
- Berry（Yarn 2+）でのPlug'n'Playサポート

**バージョン：**
- **Yarn Classic（v1）**：従来のバージョン
- **Yarn Berry（v2+）**：最新の機能とパフォーマンス改善

**使用例：**

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**インストール：**

```bash
# Yarn Classic
yarn install

# Yarn Berry
yarn install
```

### pnpm

**特徴：**
- ディスク効率が高い（ハードリンクを使用）
- 厳格な依存関係管理
- モノレポサポート
- 高速なインストール

**使用例：**

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**インストール：**

```bash
pnpm install
```

**利点：**
- ディスク容量の節約（複数のプロジェクトで依存関係を共有）
- 幽霊依存関係（phantom dependencies）の防止
- 高速なインストール

### Bun

**特徴：**
- 非常に高速なJavaScriptランタイム
- 組み込みのパッケージマネージャー
- Node.jsとの互換性

**使用例：**

```json
{
  "scripts": {
    "dev": "bun run dev",
    "build": "bun run build"
  }
}
```

**インストール：**

```bash
bun install
```

**利点：**
- 超高速なインストール
- ネイティブの高速化
- シンプルなAPI

## Corepackの使用

Corepackは、パッケージマネージャーのバージョンを管理するツールです。

### セットアップ

**1. Corepackを有効化（Node.js 16.9+）：**

```bash
corepack enable
```

**2. `package.json`でパッケージマネージャーを指定：**

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

**3. 自動的に指定されたバージョンが使用される：**

```bash
# pnpm 9.0.0が自動的にダウンロードされ、使用される
pnpm install
```

### Vercelでの使用

Vercelは、`packageManager`フィールドを自動的に検出し、指定されたバージョンを使用します。

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

デプロイ時、Vercelは自動的にpnpm 9.0.0を使用して依存関係をインストールします。

## カスタムインストールコマンド

プロジェクト設定でカスタムインストールコマンドを指定できます。

### Vercelダッシュボードでの設定

1. プロジェクトの「Settings」に移動
2. 「Build & Development Settings」セクションを開く
3. 「Install Command」フィールドにカスタムコマンドを入力

### 例：フラグ付きインストール

```bash
pnpm install --frozen-lockfile
```

```bash
npm ci
```

```bash
yarn install --immutable
```

### vercel.jsonでの設定

```json
{
  "buildCommand": "npm run build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

## モノレポでの使用

### ワークスペースの設定

#### pnpm

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
{
  "name": "my-monorepo",
  "packageManager": "pnpm@9.0.0"
}
```

#### Yarn

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "packageManager": "yarn@4.0.0"
}
```

#### npm

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 依存関係の追加

```bash
# 特定のワークスペースに追加（pnpm）
pnpm add react --filter web

# 特定のワークスペースに追加（Yarn）
yarn workspace web add react

# 特定のワークスペースに追加（npm）
npm install react --workspace=web
```

## ベストプラクティス

### 1. ロックファイルをコミット

ロックファイルをGitにコミットして、一貫性のあるインストールを保証：

```bash
git add package-lock.json   # npm
git add yarn.lock           # Yarn
git add pnpm-lock.yaml      # pnpm
git add bun.lockb           # Bun
```

### 2. Corepackを使用したバージョン固定

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

チーム全体で同じバージョンを使用することを保証します。

### 3. CI/CDでのキャッシュ

Vercelは自動的に依存関係をキャッシュしますが、カスタムCI/CDでもキャッシュを設定：

```yaml
# GitHub Actions
- uses: actions/cache@v3
  with:
    path: |
      ~/.pnpm-store
      node_modules
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### 4. セキュリティ監査

定期的に依存関係のセキュリティ監査を実行：

```bash
# npm
npm audit

# Yarn
yarn audit

# pnpm
pnpm audit

# Bun
bun audit
```

## トラブルシューティング

### ロックファイルが古い

**エラー：** ロックファイルと`package.json`が一致しない

**解決策：**

```bash
# ロックファイルを更新
pnpm install
yarn install
npm install
```

### 依存関係の競合

**エラー：** バージョンの競合

**解決策：**

```bash
# node_modulesとロックファイルを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### パッケージマネージャーのバージョン不一致

**エラー：** 異なるバージョンが使用されている

**解決策：**

Corepackを使用してバージョンを固定：

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

### インストールが遅い

**解決策：**

1. **キャッシュをクリア：**

```bash
pnpm store prune
yarn cache clean
npm cache clean --force
```

2. **高速なパッケージマネージャーに移行：**
   - npmからpnpmまたはBunに移行を検討

3. **不要な依存関係を削除：**

```bash
# 未使用の依存関係を確認
npx depcheck
```

## 関連リンク

- [npm公式ドキュメント](https://docs.npmjs.com/)
- [Yarn公式ドキュメント](https://yarnpkg.com/)
- [pnpm公式ドキュメント](https://pnpm.io/)
- [Bun公式ドキュメント](https://bun.sh/)
- [Corepack](https://nodejs.org/api/corepack.html)
- [Vercelでのモノレポ](/docs/monorepos)
