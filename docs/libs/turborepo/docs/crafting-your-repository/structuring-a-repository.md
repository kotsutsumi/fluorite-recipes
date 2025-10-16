# リポジトリの構造化

Turborepoを使用してモノレポワークスペースを設定する方法を説明します。単一のリポジトリ内で複数のパッケージを整理するためのベストプラクティスに焦点を当てています。

## はじめに

有効なワークスペース構造を生成するには、`create-turbo`の使用を推奨します。複数のパッケージマネージャーをサポートしています：pnpm、yarn、npm、bun。

## ワークスペースの構造

### 最小要件

- パッケージマネージャーによって定義されたパッケージ
- パッケージマネージャーのロックファイル
- ルートの`package.json`
- ルートの`turbo.json`
- 各パッケージの`package.json`

### パッケージ構造

推奨されるディレクトリレイアウト：

```
apps/         # アプリケーションとサービス
packages/     # ライブラリと共有ツール
```

### パッケージの設定

#### ルート`package.json`

- `private: true`を設定すべきです
- 共通タスクのスクリプトを含める（build、dev、lint）
- パッケージマネージャーとTurborepoをdev dependencyとして指定

```json
{
  "name": "my-turborepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "pnpm@8.0.0"
}
```

#### パッケージ`package.json`

- ユニークな`name`フィールド（`@repo`のような名前空間を推奨）
- パッケージ固有のタスク用の`scripts`
- パッケージのエントリポイントを定義する`exports`フィールド
- 内部モジュールショートカット用の`imports`（オプション）

```json
{
  "name": "@repo/math",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest"
  },
  "exports": {
    ".": "./dist/index.js",
    "./add": "./dist/add.js"
  }
}
```

## ベストプラクティス

- パッケージの競合を避けるため、名前空間プレフィックスを使用
- ネストされたパッケージを避ける
- 各パッケージを独立した単位として扱う
- 従来の`main`フィールドよりもモダンな`exports`を使用

適切に構造化されたモノレポアプローチの利点：

- コードの共有と再利用が容易
- 依存関係の管理が明確
- スケーラビリティの向上
- チーム間のコラボレーションの改善
