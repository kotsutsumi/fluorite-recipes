# システム環境変数

システム環境変数により、異なる環境やマシン間でTurborepoの動作を変更できます。

## 重要な原則

"システム環境変数は、`turbo`コマンドに直接提供されるフラグ値によって常にオーバーライドされます"

つまり、環境変数とコマンドラインフラグの両方が設定されている場合、フラグ値が優先されます。

## 推奨される使用方法

- 控えめかつ意図的に使用する
- 設定変更の潜在的な副作用を理解する
- 可能な限り直接コマンドフラグを優先する

## タスク内の環境変数

Turborepoは、タスク実行中に2つの特別な環境変数を提供します:

### `TURBO_HASH`

現在実行中のタスクのハッシュ。

```bash
echo "Current task hash: $TURBO_HASH"
```

### `TURBO_IS_TUI`

テキストユーザーインターフェース（TUI）が使用されているかどうかを示します。

```bash
if [ "$TURBO_IS_TUI" = "true" ]; then
  echo "Running in TUI mode"
fi
```

## システム環境変数一覧

### キャッシング

#### `TURBO_CACHE`

キャッシュソースの読み取り/書き込みを制御します。

- オプション: `local:rw,remote:rw`（デフォルト）
- `r`: 読み取り専用
- `w`: 書き込み専用
- `rw`: 読み取りと書き込み

```bash
export TURBO_CACHE="local:rw,remote:r"
```

#### `TURBO_CACHE_DIR`

キャッシュディレクトリの場所を設定します。

- デフォルト: `.turbo/cache`

```bash
export TURBO_CACHE_DIR=".custom-cache"
```

#### `TURBO_REMOTE_ONLY`

ローカルファイルシステムキャッシュを無視します。

- デフォルト: `false`

```bash
export TURBO_REMOTE_ONLY=true
```

#### `TURBO_FORCE`

既存のキャッシュを無視して、すべてのタスクを強制的に実行します。

- デフォルト: `false`

```bash
export TURBO_FORCE=true
```

### リモートキャッシング

#### `TURBO_API`

リモートキャッシュのベースURLを設定します。

```bash
export TURBO_API="https://cache.example.com"
```

#### `TURBO_TOKEN`

リモートキャッシュの認証トークン。

```bash
export TURBO_TOKEN="your-token-here"
```

#### `TURBO_REMOTE_CACHE_READ_ONLY`

リモートキャッシュへの書き込みを防ぎます。

- デフォルト: `false`

```bash
export TURBO_REMOTE_CACHE_READ_ONLY=true
```

#### `TURBO_REMOTE_CACHE_TIMEOUT`

キャッシュアーティファクト取得のタイムアウトを設定します。

- デフォルト: `30`（秒）

```bash
export TURBO_REMOTE_CACHE_TIMEOUT=60
```

#### `TURBO_REMOTE_CACHE_SIGNATURE`

アーティファクトの署名検証を有効にします。

- デフォルト: `false`

```bash
export TURBO_REMOTE_CACHE_SIGNATURE=true
```

#### `TURBO_PREFLIGHT`

キャッシュ操作前のプリフライトチェックを有効にします。

- デフォルト: `false`

```bash
export TURBO_PREFLIGHT=true
```

### ログと出力

#### `FORCE_COLOR`

端末ログでカラー表示を強制します。

```bash
export FORCE_COLOR=1
```

#### `TURBO_LOG_ORDER`

ログ出力の順序を制御します。

- オプション: `stream`, `grouped`
- デフォルト: `stream`

```bash
export TURBO_LOG_ORDER=grouped
```

#### `TURBO_PRINT_VERSION_DISABLED`

バージョン印刷を無効にします。

- デフォルト: `false`

```bash
export TURBO_PRINT_VERSION_DISABLED=true
```

#### `TURBO_NO_UPDATE_NOTIFIER`

更新通知を無効にします。

```bash
export TURBO_NO_UPDATE_NOTIFIER=1
```

### タスク実行

#### `TURBO_CONCURRENCY`

タスクの並行性を管理します。

- デフォルト: `10`

```bash
export TURBO_CONCURRENCY=5
```

または百分率:

```bash
export TURBO_CONCURRENCY=50%
```

#### `TURBO_UI`

ターミナルUIモードを設定します。

- オプション: `stream`, `tui`
- デフォルト: `stream`

```bash
export TURBO_UI=tui
```

### プラットフォームと認証

#### `TURBO_TEAM`

リポジトリのアカウント名。

```bash
export TURBO_TEAM="my-team"
```

#### `TURBO_TEAMID`

アカウント識別子。

```bash
export TURBO_TEAMID="team_1234567890"
```

#### `TURBO_LOGIN`

リモートキャッシュログインURL。

```bash
export TURBO_LOGIN="https://vercel.com"
```

### デバッグとその他

#### `TURBO_BINARY_PATH`

turboバイナリへのパスを手動で設定します。

```bash
export TURBO_BINARY_PATH="/usr/local/bin/turbo"
```

#### `TURBO_GLOBAL_WARNING_DISABLED`

グローバル`turbo`の警告を無効にします。

```bash
export TURBO_GLOBAL_WARNING_DISABLED=1
```

#### `TURBO_RUN_SUMMARY`

実行サマリーの生成を有効にします。

```bash
export TURBO_RUN_SUMMARY=true
```

#### `TURBO_TELEMETRY_DISABLED`

テレメトリーを無効にします。

```bash
export TURBO_TELEMETRY_DISABLED=1
```

#### `TURBO_TELEMETRY_MESSAGE_DISABLED`

テレメトリーメッセージを無効にします。

```bash
export TURBO_TELEMETRY_MESSAGE_DISABLED=1
```

#### `TURBO_DOWNLOAD_LOCAL_ENABLED`

ローカルの`turbo`のダウンロードを有効にします。

```bash
export TURBO_DOWNLOAD_LOCAL_ENABLED=true
```

### 環境変数モード

#### `TURBO_ENV_MODE`

環境変数の可用性を制御します。

- オプション: `strict`, `loose`
- デフォルト: `strict`（Turborepo 2.0以降）

```bash
export TURBO_ENV_MODE=loose
```

**strict mode**:
- 明示的に宣言された環境変数のみがタスクで使用可能
- `env`、`passThroughEnv`、`globalEnv`、`globalPassThroughEnv`で宣言

**loose mode**:
- すべての環境変数がタスクで使用可能
- 以前のバージョンのTurborepoの動作

### Daemon関連

#### `TURBO_DAEMON`

バックグラウンド最適化プロセスを有効/無効にします。

- デフォルト: `true`

```bash
export TURBO_DAEMON=false
```

## CI/CD環境での使用

CI/CD環境では、これらの環境変数を使用してTurborepoの動作をカスタマイズできます:

```yaml
# GitHub Actions の例
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: my-team
  TURBO_REMOTE_CACHE_READ_ONLY: false
  FORCE_COLOR: 1
```

```yaml
# GitLab CI の例
variables:
  TURBO_TOKEN: $TURBO_TOKEN
  TURBO_TEAM: "my-team"
  TURBO_UI: "stream"
  FORCE_COLOR: "1"
```

## 優先順位

Turborepoの設定の優先順位（高から低）:

1. コマンドラインフラグ
2. システム環境変数
3. `turbo.json`の設定

例:

```bash
# 環境変数
export TURBO_CONCURRENCY=5

# コマンドラインフラグが優先される
turbo run build --concurrency=10  # 10が使用される
```

## ベストプラクティス

1. **デフォルトは`turbo.json`で**: 共通設定は`turbo.json`に配置
2. **環境固有の上書き用**: CI、ステージング、本番環境で異なる設定が必要な場合に環境変数を使用
3. **一時的な変更用フラグ**: 一度だけの調整にはコマンドラインフラグを使用
4. **機密情報を保護**: トークンなどの機密情報は、環境変数やシークレット管理システムを使用
5. **文書化**: プロジェクトで使用する環境変数を文書化し、チームが理解できるようにする
