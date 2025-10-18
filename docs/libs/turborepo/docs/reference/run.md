# run | Turborepo

`turbo run`コマンドは、`turbo.json`で指定されたタスクを実行するために使用されます。

## コマンド構文

```bash
turbo run [tasks] [options] [-- [args passed to tasks]]
```

### 主要コンポーネント

- **[tasks]**: `turbo.json`で指定されたタスク
- **[options]**: コマンドの動作を制御するフラグ
- **[-- [args passed to tasks]]**: 基礎となるスクリプトに渡される引数

### エイリアス

`turbo run`は単に`turbo`として呼び出すこともできます:

```bash
# これらは同等
turbo run build
turbo build
```

### 基本的な使用例

```bash
# 単一のタスクを実行
turbo run build

# 複数のタスクを実行
turbo run build test lint

# タスクに引数を渡す
turbo run test -- --coverage

# エイリアス形式
turbo build
turbo test lint
```

### タスクが指定されていない場合

タスクを指定せずに`turbo run`を実行すると、使用可能なタスクが表示されます:

```bash
turbo run
# 出力: Available tasks: build, test, lint, dev
```

## オプション

### `--affected`

現在のブランチで変更されたパッケージをフィルタリングします。

- デフォルトの比較: `main...HEAD`
- 環境変数`TURBO_AFFECTED_BASE`と`TURBO_AFFECTED_HEAD`でオーバーライド可能

```bash
# 変更されたパッケージのみビルド
turbo run build --affected

# カスタムベース参照
turbo run build --affected --affected-base=develop
```

### `--cache <options>`

ローカルおよびリモートキャッシングを制御します。

- デフォルト: `local:rw,remote:rw`
- オプション: `local`, `remote`
- モード: `rw`（読み取り/書き込み）、`r`（読み取り専用）、`w`（書き込み専用）

```bash
# ローカルは読み書き、リモートは読み取り専用
turbo run build --cache=local:rw,remote:r

# ローカルキャッシュのみ使用
turbo run build --cache=local:rw

# リモートキャッシュのみ使用
turbo run build --cache=remote:rw
```

### `--cache-dir <path>`

ファイルシステムキャッシュディレクトリを設定します。

- デフォルト: `.turbo/cache`

```bash
turbo run build --cache-dir="./my-cache"
turbo run build --cache-dir=".cache/turbo"
```

### `--concurrency <number | percentage>`

最大並行タスク実行数を制御します。

- デフォルト: `10`
- 数値または百分率で指定可能

```bash
# 最大5つの並行タスク
turbo run build --concurrency=5

# CPUコアの50%を使用
turbo run build --concurrency=50%

# 無制限の並行性
turbo run build --concurrency=100%
```

### `--continue[=<option>]`

エラー発生時のタスク実行を管理します。

- オプション: `never`（デフォルト）、`dependencies-successful`, `always`
- `never`: エラーで即座に停止
- `dependencies-successful`: 依存関係が成功した場合は継続
- `always`: エラーがあっても可能な限り継続

```bash
# エラーがあっても継続
turbo run build test --continue

# 依存関係が成功した場合のみ継続
turbo run build --continue=dependencies-successful

# 常に継続
turbo run build --continue=always
```

### `--cwd <directory>`

作業ディレクトリを指定します。

```bash
turbo run build --cwd=./my-monorepo
```

### `--dry` / `--dry-run`

タスクを実行せずに、実行内容を表示します。

- `--dry=json`でJSON形式の出力も可能

```bash
# タスクの詳細を表示
turbo run build --dry

# JSON形式で出力
turbo run build --dry=json

# 短縮形
turbo run build --dry-run
```

出力には以下が含まれます:
- タスクハッシュ
- 実行コマンド
- 依存関係
- 入力ファイル
- 環境変数

### `--env-mode <option>`

環境変数の可用性を制御します。

- オプション: `strict`（デフォルト）、`loose`
- `strict`: 明示的に宣言された環境変数のみ使用可能
- `loose`: すべての環境変数が使用可能

```bash
# Strictモード（デフォルト）
turbo run build --env-mode=strict

# Looseモード
turbo run build --env-mode=loose
```

### `--filter <string>`

特定のパッケージやディレクトリをターゲットにします。

複雑なフィルタリングをサポートするマイクロ構文を使用:

```bash
# 特定のパッケージ
turbo run build --filter=my-app

# パターンマッチング
turbo run build --filter="@my-org/*"

# ディレクトリ
turbo run build --filter="./apps/*"

# 依存関係を含む
turbo run build --filter="my-app..."

# 依存元を含む
turbo run build --filter="...my-lib"

# 変更されたパッケージとその依存元
turbo run build --filter="...[main]"

# 複数のフィルター
turbo run build --filter=my-app --filter=my-lib

# Gitコミットベース
turbo run build --filter="[HEAD^1]"
```

### `--force`

既存のキャッシュアーティファクトを無視し、すべてのタスクを再実行します。

```bash
turbo run build --force
```

### `--framework-inference`

フレームワーク推論を制御します。

- デフォルト: `true`

```bash
# フレームワーク推論を無効化
turbo run build --framework-inference=false
```

### `--global-deps <globs>`

グローバル依存関係を指定します。

```bash
turbo run build --global-deps=".env" --global-deps="tsconfig.json"
```

### `--graph <filename>`

タスク依存関係グラフを可視化します。

```bash
# グラフをファイルに出力
turbo run build --graph=graph.png

# Mermaid形式
turbo run build --graph=graph.mmd

# DOT形式
turbo run build --graph=graph.dot

# JSON形式
turbo run build --graph=graph.json
```

### `--log-order <option>`

ログ出力の順序を制御します。

- オプション: `stream`（デフォルト）、`grouped`
- `stream`: リアルタイムでログをストリーミング
- `grouped`: タスクごとにログをグループ化

```bash
turbo run build --log-order=grouped
turbo run build --log-order=stream
```

### `--log-prefix <option>`

ストリームログのプレフィックスを設定します。

- オプション: `auto`（デフォルト）、`none`、`task`

```bash
turbo run build --log-prefix=task
turbo run build --log-prefix=none
```

### `--only`

タスクの依存関係を制限します。

```bash
# 依存関係なしで直接指定されたタスクのみ実行
turbo run build --only
```

### `--output-logs <option>`

タスクログ出力レベルを制御します。

- オプション: `full`, `hash-only`, `new-only`, `errors-only`, `none`

```bash
# 完全なログ
turbo run build --output-logs=full

# ハッシュのみ
turbo run build --output-logs=hash-only

# 新しいログのみ
turbo run build --output-logs=new-only

# エラーのみ
turbo run build --output-logs=errors-only

# ログなし
turbo run build --output-logs=none
```

### `--parallel`

パッケージ間でコマンドを並列実行します。

タスク依存関係グラフを無視します。

```bash
turbo run build --parallel
```

### `--pass-through-env <variables>`

タスクで使用可能にする環境変数を指定します。

```bash
turbo run build --pass-through-env=API_KEY --pass-through-env=DATABASE_URL
```

### `--profile <filename>`

プロファイルを生成します。

```bash
turbo run build --profile=profile.json
```

### `--remote-cache-read-only`

リモートキャッシュへの書き込みを防ぎます。

```bash
turbo run build --remote-cache-read-only
```

### `--remote-only`

ローカルファイルシステムキャッシュを無視します。

```bash
turbo run build --remote-only
```

### `--summarize`

実行サマリーを生成します。

```bash
turbo run build --summarize
turbo run build --summarize=summary.json
```

### `--token <token>`

リモートキャッシュの認証トークンを設定します。

```bash
turbo run build --token="your-token-here"
```

### `--ui <option>`

ターミナルUIモードを選択します。

- オプション: `stream`（デフォルト）、`tui`

```bash
# テキストユーザーインターフェース
turbo run build --ui=tui

# ストリーミング（デフォルト）
turbo run build --ui=stream
```

### グローバルフラグ

#### `--color`

非インタラクティブな端末でもカラー表示を強制します。

```bash
turbo run build --color
```

#### `--no-color`

カラー表示を抑制します。

```bash
turbo run build --no-color
```

#### `--help` / `-h`

ヘルプ情報を表示します。

```bash
turbo run --help
turbo run -h
```

#### `--version` / `-v`

バージョン情報を表示します。

```bash
turbo --version
turbo -v
```

#### `--verbosity <level>`

詳細出力レベルを設定します。

```bash
turbo run build --verbosity=2
```

## 複雑な使用例

### CI/CDでの使用

```bash
# 変更されたパッケージのみビルドとテスト
turbo run build test --affected --cache=local:rw,remote:r

# 強制実行でフルビルド
turbo run build --force --concurrency=20

# エラーがあっても継続
turbo run build test lint --continue
```

### ローカル開発

```bash
# TUIで開発サーバー起動
turbo run dev --ui=tui

# 特定のアプリのみビルド
turbo run build --filter=my-app

# デバッグ用のドライラン
turbo run build --dry-run --filter=my-app
```

### パフォーマンスチューニング

```bash
# 並行性を調整
turbo run build --concurrency=50%

# ローカルキャッシュのみ使用
turbo run build --cache=local:rw

# プロファイルを生成
turbo run build --profile=build-profile.json
```

### デバッグとトラブルシューティング

```bash
# グラフの可視化
turbo run build --graph=graph.png

# 完全なログ出力
turbo run build --output-logs=full

# ドライランで詳細確認
turbo run build --dry=json > build-plan.json
```

## ベストプラクティス

1. **フィルターを効果的に使用**: 不要なパッケージをビルドしない
2. **並行性を調整**: マシンのリソースに応じて最適化
3. **キャッシングを活用**: ローカルとリモートキャッシュを適切に設定
4. **CI/CDで`--affected`を使用**: 変更されたパッケージのみテスト
5. **デバッグには`--dry-run`を使用**: 実行前に計画を確認
6. **適切な`--continue`オプション**: ビルドの要件に応じて選択

## まとめ

`turbo run`コマンドは、Turborepoの中核となるコマンドで、強力なフィルタリング、キャッシング、並列実行機能を提供します。適切なオプションを組み合わせることで、開発ワークフローとCI/CDパイプラインを最適化できます。
