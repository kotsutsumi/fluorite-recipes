# 既存のリポジトリに追加する

Turborepoは、**シングルパッケージまたはマルチパッケージのいずれのリポジトリにも**段階的に導入でき、開発者とCIのワークフローを高速化します。

## シングルパッケージワークスペースの準備

`npx create-next-app`や`npm create vite`などのツールで作成されたリポジトリの場合、追加の設定は必要ありません。

## マルチパッケージワークスペースの準備

`turbo`はWorkspacesの上に構築されているため、既存のコードベースで簡単に導入できます。

## リポジトリにTurborepoを追加する

### `turbo`をインストールする

グローバルとリポジトリルートの両方にインストールすることをお勧めします:

```bash
# グローバルインストール
pnpm add turbo --global
# リポジトリにインストール
pnpm add turbo --save-dev --workspace-root
```

### `turbo.json`を作成する

`build`や`check-types`などのタスクを含む設定ファイルをリポジトリルートに作成します。

### `.gitignore`を編集する

Turborepo固有のフォルダを無視するために`.turbo`を追加します。

### パッケージマネージャーフィールドを追加する

`package.json`に`packageManager`フィールドを追加します:

```json
{
  "packageManager": "pnpm@10.0.0"
}
```

### ワークスペースを設定する

マルチパッケージリポジトリのパッケージマネージャーワークスペースを設定します:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo`でタスクを実行する

パッケージ全体でタスクを実行します:

```bash
turbo build check-types
```

### 開発を開始する

マルチパッケージワークスペースで開発タスクを実行します:

```bash
turbo dev
```

## 次のステップ

- リモートキャッシングを有効化する
- 環境変数を処理する
- タスクフィルタリングについて学ぶ
