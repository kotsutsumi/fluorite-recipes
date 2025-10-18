# タスクの実行

Turborepoは、リポジトリ全体でタスクを自動的に並列化およびキャッシュすることで、開発者のワークフローを最適化します。`turbo.json`にタスクを登録すると、開発者はスクリプトを実行するための強力なツールを利用できます。

## 主要機能

- 頻繁に実行するタスクには`package.json`の`scripts`を使用
- カスタムでオンデマンドのタスク実行にはグローバル`turbo`を使用
- ディレクトリ、パッケージ名、ソースコントロールの変更でタスクをフィルター

## package.jsonでのスクリプト使用

ルートの`package.json`に`turbo`コマンドを定義できます：

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

実行方法：

```bash
# pnpm
pnpm dev
pnpm build

# yarn
yarn dev
yarn build

# npm
npm run dev
npm run build

# bun
bun dev
bun build
```

## グローバルTurboの使用

グローバル`turbo`をインストールすると、高度な機能を備えた直接的なターミナルコマンド実行が可能になります：

```bash
npm install turbo --global
```

### 自動パッケージスコープ

パッケージディレクトリ内で`turbo`を実行すると、自動的にそのパッケージのタスクグラフにスコープされます：

```bash
cd apps/web
turbo build  # @repo/webのbuildのみ実行
```

### カスタマイズオプション

- 特定のパッケージをフィルター
- ワンオフコマンドを実行
- `turbo.json`の設定をオーバーライド

## 複数のタスクを実行

Turborepoは複数のタスクを並列に実行できます：

```bash
turbo run build test lint check-types
```

または省略形：

```bash
turbo build test lint check-types
```

Turborepoは自動的に：
- タスクを並列化
- 依存関係を尊重
- 結果をキャッシュ

## タスクのフィルタリング

強力なフィルタリングオプションが利用可能です。

### パッケージでフィルター

特定のパッケージでタスクを実行：

```bash
turbo build --filter=@repo/web
```

複数のパッケージ：

```bash
turbo build --filter=@repo/web --filter=@repo/mobile
```

### ディレクトリでフィルター

```bash
turbo build --filter=./apps/*
turbo build --filter=./packages/ui
```

### パッケージの依存関係を含める

パッケージとその依存関係：

```bash
turbo build --filter=...@repo/web
```

この構文は：
1. `@repo/web`を選択
2. `@repo/web`が依存するすべてのパッケージを含める
3. すべてのパッケージで`build`を実行

### パッケージの依存先を含める

パッケージとそれに依存するすべてのパッケージ：

```bash
turbo build --filter=@repo/ui...
```

この構文は：
1. `@repo/ui`を選択
2. `@repo/ui`に依存するすべてのパッケージを含める
3. すべてのパッケージで`build`を実行

### 変更されたパッケージでフィルター

ソースコントロールの変更に基づいてフィルター：

```bash
# mainブランチ以降の変更があるパッケージ
turbo build --filter=[main]

# 最後のコミット以降の変更
turbo build --filter=[HEAD^]

# 特定のコミット以降の変更
turbo build --filter=[abc123]
```

### フィルターの組み合わせ

複数のフィルターを組み合わせることができます：

```bash
# appsディレクトリで変更があったパッケージのみビルド
turbo build --filter=[main]...{./apps/*}

# webとその依存関係のみテスト
turbo test --filter=...@repo/web
```

## フィルター構文リファレンス

| 構文 | 説明 |
|------|------|
| `--filter=@repo/web` | 特定のパッケージ |
| `--filter=./apps/*` | ディレクトリパターン |
| `--filter=...@repo/web` | パッケージとその依存関係 |
| `--filter=@repo/ui...` | パッケージとその依存先 |
| `--filter=[main]` | mainブランチ以降の変更 |
| `--filter=[HEAD^]` | 最後のコミット以降の変更 |
| `--filter=...{./apps/*}` | フィルターの組み合わせ |

## 実用例

### 開発ワークフロー

```bash
# すべてのアプリを開発モードで起動
turbo dev --filter=./apps/*

# 特定のアプリとその依存関係を起動
turbo dev --filter=...@repo/web
```

### CI/CDワークフロー

```bash
# 変更されたパッケージのみビルドとテスト
turbo build test --filter=[origin/main]

# すべてをビルドしてリント
turbo build lint
```

### デバッグとトラブルシューティング

```bash
# 単一のパッケージで詳細出力
turbo build --filter=@repo/web --verbose

# キャッシュをスキップして強制実行
turbo build --force

# ドライラン（実行せずに表示）
turbo build --dry-run
```

## その他のオプション

### 並列実行の制御

```bash
# 同時実行タスク数を制限
turbo build --concurrency=2

# 順次実行
turbo build --concurrency=1
```

### 出力モード

```bash
# 完全な出力を表示
turbo build --output-logs=full

# エラーのみ表示
turbo build --output-logs=errors-only

# 出力を非表示
turbo build --output-logs=none
```

### キャッシュ制御

```bash
# キャッシュをスキップ
turbo build --force

# キャッシュのみ（実行しない）
turbo build --cache-only
```

## ベストプラクティス

1. **頻繁なタスクにはスクリプトを使用**：`package.json`にショートカットを定義
2. **開発時はフィルターを活用**：必要なパッケージのみ実行
3. **CIでは変更ベースのフィルター**：効率的なCI/CDパイプライン
4. **並列実行を制御**：リソース制約のある環境で有用
5. **ドライランでテスト**：本番実行前に確認

## 次のステップ

タスクの実行をマスターしたら、Turborepoのキャッシング機構を探索してワークフロー効率をさらに最適化できます。キャッシングにより、同じ作業を二度と繰り返す必要がなくなります。
