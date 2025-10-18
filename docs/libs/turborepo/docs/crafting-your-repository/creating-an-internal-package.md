# 内部パッケージの作成

Turborepoモノレポで内部パッケージを作成する詳細なガイドです。ワークスペース全体でコードと機能を共有することに焦点を当てています。

## ステップ1: パッケージディレクトリの作成

新しいディレクトリを作成します：

```bash
mkdir -p ./packages/math
```

## ステップ2: `package.json`の追加

パッケージの`package.json`を作成します：

```json
{
  "name": "@repo/math",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./add": {
      "types": "./dist/add.d.ts",
      "default": "./dist/add.js"
    },
    "./subtract": {
      "types": "./dist/subtract.d.ts",
      "default": "./dist/subtract.js"
    }
  },
  "devDependencies": {
    "typescript": "latest",
    "@repo/typescript-config": "workspace:*"
  }
}
```

重要なポイント：

- **パッケージ名**：`@repo/math`（名前空間プレフィックスを使用）
- **スクリプト**：開発とビルド用
- **exports**：複数のエントリポイントを定義
- **開発依存関係**：TypeScriptと共有設定

## ステップ3: TypeScriptの設定

`tsconfig.json`を作成します：

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## ステップ4: ソースコードの記述

`src`ディレクトリにソースファイルを作成します：

```bash
mkdir -p ./packages/math/src
```

### `src/index.ts`

```typescript
export { add } from './add';
export { subtract } from './subtract';
```

### `src/add.ts`

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

### `src/subtract.ts`

```typescript
export function subtract(a: number, b: number): number {
  return a - b;
}
```

## ステップ5: アプリケーションにパッケージを追加

アプリケーションの`package.json`を更新して新しいパッケージを含めます：

```json
{
  "name": "@repo/web",
  "dependencies": {
    "@repo/math": "workspace:*"
  }
}
```

パッケージをインストール：

```bash
# pnpm
pnpm install

# yarn
yarn install

# npm
npm install

# bun
bun install
```

### アプリケーションでパッケージを使用

```typescript
import { add, subtract } from '@repo/math';
// または特定の関数をインポート
import { add } from '@repo/math/add';

const sum = add(5, 3); // 8
const difference = subtract(10, 4); // 6
```

## ステップ6: `turbo.json`の更新

キャッシングを有効にするためにビルド出力を追加します：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

## ベストプラクティス

### 単一の「目的」を持つパッケージを作成

各パッケージは明確で焦点を絞った責任を持つべきです：

- **良い例**：`@repo/math`、`@repo/ui`、`@repo/auth`
- **悪い例**：`@repo/utils`（あまりにも広範）

### アプリケーションパッケージに共有コードを配置しない

共有コードはアプリケーション外の独立したパッケージに配置します：

```
packages/
  math/          # 共有ユーティリティ
  ui/            # 共有UIコンポーネント
  auth/          # 共有認証ロジック
apps/
  web/           # Webアプリケーション（共有コードなし）
  mobile/        # モバイルアプリ（共有コードなし）
```

### 内部パッケージの利点

- **コードの再利用**：ワークスペース全体で機能を共有
- **型安全性**：TypeScriptの型が自動的に利用可能
- **最適化されたビルド**：Turborepoがパッケージの関係を理解
- **明確な依存関係**：パッケージグラフが依存関係を明示

## 次のステップ

内部パッケージを作成したら、次はタスクの設定について学びましょう。Turborepoはパッケージの関係を自動的に理解し、パッケージグラフを通じてワークフローを最適化します。
