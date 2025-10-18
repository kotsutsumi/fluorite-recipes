# 依存関係の管理

Turborepoにおける依存関係の管理について説明します。

## 主要な概念

2つの主要な依存関係タイプについて説明します：

### 1. 外部依存関係

- npmレジストリから取得
- エコシステムのコードを活用してアプリケーションとライブラリをより速く構築

### 2. 内部依存関係

- リポジトリ内で機能を共有
- コードの発見可能性と使いやすさを向上

## 依存関係インストールのベストプラクティス

### 主要な推奨事項：使用する場所に依存関係をインストール

依存関係を使用するパッケージに直接追加します：

- 各パッケージの`package.json`に依存関係をリスト化
- 利点：
  - 明確性の向上
  - チーム間の柔軟性の向上
  - より良いキャッシング
  - 依存関係のプルーニングが容易

```json
{
  "name": "@repo/web",
  "dependencies": {
    "react": "^18.0.0",
    "@repo/ui": "workspace:*"
  }
}
```

### ルートの依存関係を最小限に

ワークスペースルートには、リポジトリ管理ツールのみをインストールします：

- 例：`turbo`、`husky`、`lint-staged`

```json
{
  "name": "monorepo-root",
  "private": true,
  "devDependencies": {
    "turbo": "latest",
    "husky": "^8.0.0"
  }
}
```

## 依存関係管理の原則

### パッケージマネージャーの考慮事項

- Turborepoは依存関係を管理しません
- パッケージマネージャーが処理します：
  - 依存関係のバージョンのダウンロード
  - シンボリックリンクの作成
  - モジュール解決

### 依存関係バージョンの同期方法

#### 1. 専用ツール

- `syncpack`
- `manypkg`
- `sherif`

#### 2. パッケージマネージャーコマンド

ワークスペース全体で単一のコマンドで更新：

```bash
# pnpm
pnpm add react@latest --filter "@repo/*"

# yarn
yarn workspace @repo/web add react@latest

# npm
npm install react@latest --workspace=@repo/web

# bun
bun add react@latest --filter "@repo/*"
```

#### 3. IDEリファクタリング

正規表現を使用して`package.json`ファイル全体でバージョンを置換。

## 実用的な例

### 複数のパッケージに依存関係をインストール

#### pnpm

```bash
pnpm add lodash --filter "@repo/web" --filter "@repo/mobile"
```

#### yarn

```bash
yarn workspace @repo/web add lodash
yarn workspace @repo/mobile add lodash
```

#### npm

```bash
npm install lodash --workspace=@repo/web --workspace=@repo/mobile
```

#### bun

```bash
bun add lodash --filter "@repo/web" --filter "@repo/mobile"
```

## 次のステップ

依存関係を効果的に管理するための次の学習ステップとして、内部パッケージの作成をお勧めします。
