# generate

新しいアプリとパッケージでTurborepoを拡張します。

## 主要なコマンド

### 1. `turbo generate run [generator-name]`

リポジトリで定義されたカスタムジェネレーターを実行します。

フラグオプション:
- `--args`: ジェネレーターのプロンプトに直接回答を渡す
- `--config <path>`: ジェネレーター設定ファイルを指定
- `--root <path>`: リポジトリのルートディレクトリを設定

### 2. `turbo generate workspace [options]`

リポジトリに新しいワークスペースを作成します。

フラグオプション:
- `--name <name>`: package.jsonでワークスペース名を設定
- `--empty`: 空のワークスペースを作成（デフォルトはtrue）
- `--copy <name>/<url>`: ローカルワークスペースまたはGitHub URLからコピー
- `--destination <path>`: ワークスペース作成場所を指定
- `--type <app/package>`: ワークスペースタイプを選択
- `--show-all-dependencies`: 選択時にすべての依存関係を表示

## 重要な注意事項

- `turbo gen` は `turbo generate` のエイリアスです
- `run` はデフォルトコマンドなので、`turbo gen` は `turbo generate run` と同じです

## 詳細情報

より詳細なガイダンスについては、「Generating code」ガイドを参照してください。
