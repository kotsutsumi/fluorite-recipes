# ls

モノレポ内のパッケージを一覧表示します。

## コマンド構文

```bash
turbo ls [package(s)] [flags]
```

## 使用シナリオ

### 1. リポジトリ内のすべてのパッケージを一覧表示

```bash
turbo ls
```

以下を出力します:
- パッケージマネージャー
- パッケージ数
- パッケージ名
- ディレクトリ

### 2. 特定のパッケージを一覧表示

```bash
turbo ls web @repo/ui
```

以下を出力します:
- パッケージ名
- ディレクトリ
- 内部依存関係
- タスク

## フラグ

### `--affected`

現在のブランチでの変更によって影響を受けるパッケージをフィルタリングします。

デフォルトの比較: `main` と `HEAD` の間

環境変数でbase/headを上書きできます:
- `TURBO_SCM_BASE`
- `TURBO_SCM_HEAD`

例:

```bash
TURBO_SCM_BASE=development turbo ls --affected
```

### `--output <format>` (実験的)

出力形式のオプション: `json` または `pretty` (デフォルト)

例:

```bash
turbo ls --output=json
```
