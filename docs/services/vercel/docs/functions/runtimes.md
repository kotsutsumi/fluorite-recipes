# ランタイム

Vercelは、関数用に複数のランタイムをサポートしており、それぞれ独自のライブラリ、API、および機能を持っています。

## 公式ランタイム

| ランタイム | 説明 |
|---------|-------------|
| [Node.js](/docs/functions/runtimes/node-js) | Node.js関数のエントリーポイントを取得し、依存関係をビルドし、Vercel Functionにバンドルします |
| [Go](/docs/functions/runtimes/go) | 単一のHTTPハンドラーを持つGoプログラムを取得し、Vercel Functionとして出力します |
| [Python](/docs/functions/runtimes/python) | 単一のHTTPハンドラーを持つPythonプログラムを取得し、Vercel Functionとして出力します |
| [Ruby](/docs/functions/runtimes/ruby) | 単一のHTTPハンドラーを持つRubyプログラムを取得し、Vercel Functionとして出力します |
| [Edge](/docs/functions/runtimes/edge) | V8エンジン上に構築され、コンテナやVMなしで分離された実行環境で動作します |

## コミュニティランタイム

推奨されるコミュニティランタイム:

| ランタイム | ランタイムモジュール | ドキュメント |
|---------|----------------|----------------|
| Bash | `vercel-bash` | [GitHubリンク](https://github.com/importpw/vercel-bash) |
| Deno | `vercel-deno` | [GitHubリンク](https://github.com/vercel-community/deno) |
| PHP | `vercel-php` | [GitHubリンク](https://github.com/vercel-community/php) |
| Rust | `vercel-rust` | [GitHubリンク](https://github.com/vercel-community/rust) |

## 機能

### ロケーション

- リージョンファーストのデプロイメント
- カスタマイズ可能なロケーション
- Pro/Enterprise: 複数リージョンのサポート

### フェイルオーバーモード

- Edgeランタイムの自動フェイルオーバー
- Node.jsランタイムの設定可能なフェイルオーバーリージョン

### 分離境界

- 安全な実行環境のためのMicroVM

### ファイルシステムサポート

- 読み取り専用ファイルシステム
- 書き込み可能な`/tmp`スクラッチスペース(最大500 MB)

### アーカイブ

- 本番デプロイメント: 2週間以内にアーカイブ
- プレビューデプロイメント: 48時間以内にアーカイブ
