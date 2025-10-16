# サポートポリシー

## パッケージマネージャーのサポート

サポートされているパッケージマネージャー：

- **pnpm 8+**: はい
- **npm 8+**: はい
- **yarn 1+**: はい（Yarn Plug'n'Playを含む）
- **bun 1.2+**: Beta

## プラットフォーム

サポートされているプラットフォーム：

- DebianベースのLinuxディストリビューション
- macOS（IntelとApple Silicon）
- Windows（x86_64とARM 64）

さまざまなアーキテクチャ用の特定のバイナリがnpm経由で利用可能です。

## Node.js

- コア機能はNode.jsバージョンに依存しません
- 一部のエコシステムパッケージは、ActiveおよびMaintenance LTS Node.jsバージョンをサポートします
- これらのバージョンで動作することが期待される例

## バージョン管理

- Git管理およびバージョン管理されていないリポジトリをサポートします
- 他のバージョン管理システムは無視されます
- ファイルハッシュにGitを使用します

## LTSポリシー

- メジャーバージョンは、次のメジャーバージョンのリリース後2年間サポートされます
- 重要なセキュリティ修正はバックポートされます
- 最新バージョンの使用を推奨します

## リリースフェーズ

### 1. Stable（安定版）

- 本番環境対応のAPI
- 後方互換性のある変更
- 破壊的変更には警告があります

### 2. Beta（ベータ版）

- 機能設計に自信があります
- マイナーな破壊的変更の可能性があります
- 現在、このフェーズのAPIはありません

### 3. Experimental（実験的）

- アクティブな開発中
- 大幅な変更の可能性があります
- 現在の実験的API：
  - `turbo query`
  - `turbo boundaries`とTags
  - `turbo watch`の`--experimental-write-cache`
  - `turbo ls --affected`の`--output=json`

### 4. Deprecated（非推奨）

- 段階的に廃止されているAPI
- 現在：`TURBO_REMOTE_ONLY`と`--remote-only`
