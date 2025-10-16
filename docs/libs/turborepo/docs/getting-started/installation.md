# インストール

## Turborepoを始める

### クイックインストール方法
Turborepoは以下の方法でインストールできます:
- pnpm: `pnpm dlx create-turbo@latest`
- yarn: `yarn dlx create-turbo@latest`
- npm: `npx create-turbo@latest`
- bun (Beta): `bunx create-turbo@latest`

### スターターリポジトリの機能
スターターには以下が含まれます:
- 2つのデプロイ可能なアプリケーション
- モノレポで使用する3つの共有ライブラリ

## `turbo`のインストール

### グローバルインストール
グローバルに`turbo`をインストールすることで、ローカルワークフローに柔軟性とスピードをもたらします。

インストールコマンド:
- pnpm: `pnpm add turbo --global`
- yarn: `yarn global add turbo`
- npm: `npm install turbo --global`
- bun: `bun install turbo --global`

#### グローバル使用例
- `turbo build`: 依存関係グラフに従ってビルドスクリプトを実行
- `turbo build --filter=docs --dry`: docsパッケージのビルドタスクをプレビュー
- `turbo generate`: コードジェネレーターを実行
- `cd apps/docs && turbo build`: 特定のパッケージでビルドを実行

### リポジトリへのインストール
他の開発者とリポジトリで共同作業する場合は、依存関係のバージョンを固定することをお勧めします。

インストールコマンド:
- pnpm: `pnpm add turbo --save-dev --ignore-workspace-root-check`
- yarn: `yarn add turbo --dev --ignore-workspace-root-check`
- npm: `npm install turbo --save-dev`
- bun: `bun install turbo --dev`

重要なポイント:
- グローバルの`turbo`は、ローカルリポジトリバージョンが存在する場合はそちらを優先します
- 開発者環境間で一貫した使用が可能になります
