# オプション概要

`turbo`の呼び出しの動作を管理する3つの方法があります:

- [`turbo.json`での設定](/docs/reference/configuration)
- [システム環境変数](/docs/reference/system-environment-variables)
- [CLI呼び出しに渡すフラグ](/docs/reference/run)

上記の3つの戦略は優先順位の順に並んでいます。フラグ値が提供された場合、同じシステム環境変数または`turbo.json`設定に対して、フラグの値が使用されます。そのため、以下の使用を推奨します:

- `turbo.json`設定をデフォルトに使用
- システム環境変数を環境ごとのオーバーライドに使用
- フラグを呼び出しごとのオーバーライドに使用

## オプション表

### キャッシング

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| タスクの強制実行 | `--force` | `TURBO_FORCE` | - |
| リモートキャッシュのタイムアウト | `--remote-cache-timeout` | `TURBO_REMOTE_CACHE_TIMEOUT` | `remoteCache.timeout` |
| リモートキャッシュのアップロードタイムアウト | `--remote-cache-upload-timeout` | `TURBO_REMOTE_CACHE_UPLOAD_TIMEOUT` | - |
| キャッシュ署名キー | `--signature` | `TURBO_REMOTE_CACHE_SIGNATURE` | `remoteCache.signature` |
| プリフライトリクエスト | `--preflight` | `TURBO_PREFLIGHT` | `remoteCache.preflight` |
| リモートキャッシュのベースURL | `--api` | `TURBO_API` | `remoteCache.apiUrl` |
| キャッシュソース | `--cache` | `TURBO_CACHE` | - |
| ローカルキャッシュディレクトリ | `--cache-dir` | `TURBO_CACHE_DIR` | `cacheDir` |
| リモートのみ | `--remote-only` | `TURBO_REMOTE_ONLY` | - |

### メッセージ

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| バージョン表示の無効化 | - | `TURBO_PRINT_VERSION_DISABLED` | - |
| テレメトリーメッセージの無効化 | - | `TURBO_TELEMETRY_MESSAGE_DISABLED` | - |
| グローバル`turbo`警告の無効化 | - | `TURBO_GLOBAL_WARNING_DISABLED` | - |
| 更新通知なし | `--no-update-notifier` | `TURBO_NO_UPDATE_NOTIFIER` | `noUpdateNotifier` |

### タスク実行とログ

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| ターミナルUI | `--ui` | `TURBO_UI` | `ui` |
| 影響を受けたタスクの実行 | `--affected` | - | - |
| パッケージマネージャーチェックの無効化 | - | - | `dangerouslyDisablePackageManagerCheck` |
| 影響を受けたベース参照 | `--affected-base` | `TURBO_AFFECTED_BASE` | - |
| 影響を受けたヘッド参照 | `--affected-head` | `TURBO_AFFECTED_HEAD` | - |
| 直接指定されたタスクのみ実行 | `--only` | - | - |
| タスクの並行性 | `--concurrency` | `TURBO_CONCURRENCY` | `concurrency` |
| タスクログの順序 | `--log-order` | `TURBO_LOG_ORDER` | - |
| 現在の作業ディレクトリ | `--cwd` | - | - |
| ストリームログのプレフィックス | `--log-prefix` | - | - |
| タスクログ出力レベル | `--output-logs` | - | `tasks.<task>.outputLogs` |
| グローバル入力 | `--global-deps` | - | `globalDependencies` |
| ターミナルのカラー表示 | `--color` / `--no-color` | `FORCE_COLOR` / `NO_COLOR` | - |
| 継続オプション | `--continue` | - | - |
| 並列実行 | `--parallel` | - | - |

### 環境変数

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| 環境変数モード | `--env-mode` | `TURBO_ENV_MODE` | `envMode` |
| ベンダー環境変数 | - | - | `globalEnv` / `tasks.<task>.env` |
| フレームワーク変数の例外 | `--framework-inference` | `TURBO_FRAMEWORK_INFERENCE` | - |
| パススルー環境変数 | `--pass-through-env` | - | `globalPassThroughEnv` / `tasks.<task>.passThroughEnv` |

### デバッグ出力

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| 実行サマリー | `--summarize` | `TURBO_RUN_SUMMARY` | - |
| グラフの可視化 | `--graph` | - | - |
| ドライラン | `--dry` / `--dry-run` | - | - |

### 認証

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| ログインURL | `--login` | `TURBO_LOGIN` | - |
| リモートキャッシュのチーム名 | `--team` | `TURBO_TEAM` | `remoteCache.teamSlug` |
| リモートキャッシュのチームID | `--team` | `TURBO_TEAMID` | `remoteCache.teamId` |
| 認証トークン | `--token` | `TURBO_TOKEN` | - |

### その他

| オプション | CLIフラグ | 環境変数 | turbo.json |
|---------|---------|---------|-----------|
| バイナリパス | - | `TURBO_BINARY_PATH` | - |
| ローカル`turbo`のダウンロード | - | `TURBO_DOWNLOAD_LOCAL_ENABLED` | - |
| Daemonモード | - | `TURBO_DAEMON` | `daemon` |
| テレメトリーの無効化 | `--no-telemetry` | `TURBO_TELEMETRY_DISABLED` | - |
| ヘルプ | `--help` / `-h` | - | - |
| バージョン | `--version` / `-v` | - | - |
| 詳細出力 | `--verbosity` | `TURBO_VERBOSITY` | - |

## 優先順位の例

Turborepoは以下の優先順位でオプションを解決します:

1. **コマンドラインフラグ**（最優先）
2. **システム環境変数**
3. **turbo.json設定**（最低優先）

### 例: 並行性の設定

```jsonc
// turbo.json
{
  "concurrency": 5
}
```

```bash
# 環境変数
export TURBO_CONCURRENCY=8

# コマンド実行
turbo run build
# → 8を使用（環境変数がturbo.jsonをオーバーライド）

turbo run build --concurrency=10
# → 10を使用（フラグが両方をオーバーライド）
```

### 例: リモートキャッシュの設定

```jsonc
// turbo.json
{
  "remoteCache": {
    "timeout": 30
  }
}
```

```bash
# 環境変数
export TURBO_REMOTE_CACHE_TIMEOUT=60

# コマンド実行
turbo run build
# → 60秒を使用（環境変数がturbo.jsonをオーバーライド）

turbo run build --remote-cache-timeout=120
# → 120秒を使用（フラグが両方をオーバーライド）
```

## 推奨される使用パターン

### デフォルト設定: turbo.json

チーム全体で共有される共通の設定を定義:

```jsonc
{
  "concurrency": 10,
  "ui": "stream",
  "cacheDir": ".turbo/cache",
  "remoteCache": {
    "timeout": 30
  }
}
```

### 環境固有の設定: 環境変数

異なる環境（開発、CI、本番）で異なる動作を設定:

```bash
# CI環境（.github/workflows/ci.yml）
env:
  TURBO_TEAM: "my-team"
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_REMOTE_CACHE_TIMEOUT: 120
  TURBO_CONCURRENCY: 20
```

```bash
# ローカル開発環境（.env.local）
TURBO_UI=tui
TURBO_CONCURRENCY=5
```

### 一時的なオーバーライド: コマンドラインフラグ

特定の実行のみの変更:

```bash
# デバッグのために強制実行
turbo run build --force

# グラフの可視化
turbo run build --graph

# ドライラン
turbo run build --dry-run

# 並行性の一時的な変更
turbo run build --concurrency=1
```

## ベストプラクティス

1. **turbo.jsonでデフォルトを設定**: プロジェクトの標準設定を定義
2. **環境変数で環境を区別**: CI、ステージング、本番で異なる設定が必要な場合
3. **フラグでテストと調整**: 一時的な変更や実験に使用
4. **文書化**: 使用している設定オプションとその理由を文書化
5. **一貫性**: チーム全体で一貫した設定パターンを使用

## 複数の方法を組み合わせる例

```jsonc
// turbo.json - チームのデフォルト
{
  "concurrency": 10,
  "ui": "stream",
  "cacheDir": ".turbo/cache"
}
```

```yaml
# .github/workflows/ci.yml - CI環境のオーバーライド
env:
  TURBO_CONCURRENCY: 20
  TURBO_UI: stream
  TURBO_TEAM: my-team
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
```

```bash
# ローカル開発 - 個別の調整
turbo run build --ui=tui  # UIを一時的に変更
turbo run build --force   # キャッシュを無視
```

この階層的なアプローチにより、柔軟性を維持しながら、一貫性のある設定を実現できます。
