# 環境変数リファレンス

## Prisma Client

### `DEBUG`
Prisma Client のデバッグ出力を有効化するために使用します。

例：
```bash
export DEBUG="prisma:client"
```

### `NO_COLOR`
真値の場合、`colorless` 設定を有効化し、エラーメッセージから色を削除します。

## Prisma Studio

### `BROWSER`
Prisma Studio が開くブラウザを強制的に指定します。

例：
```bash
BROWSER=firefox prisma studio --port 5555
```

## Prisma CLI 環境変数

### `PRISMA_HIDE_PREVIEW_FLAG_WARNINGS`
プレビュー機能フラグに関する警告メッセージを非表示にします。

### `PRISMA_HIDE_UPDATE_MESSAGE`
新しい Prisma CLI バージョンの更新通知を非表示にします。

### `PRISMA_GENERATE_SKIP_AUTOINSTALL`
`prisma generate` 中の CLI とクライアント依存関係の自動インストールをスキップします。

### `PRISMA_SKIP_POSTINSTALL_GENERATE`
パッケージインストール中の Prisma Client の自動生成をスキップします。

### `PRISMA_GENERATE_NO_ENGINE`
クエリエンジンを含まない Prisma Client を生成し、アプリケーションサイズを削減します。

## プロキシ環境変数

### `NO_PROXY`
プロキシを必要としないホスト名/IP のカンマ区切りリスト。

### `HTTP_PROXY`
HTTP プロキシサーバーのホスト名または IP。

### `HTTPS_PROXY`
HTTPS プロキシサーバーのホスト名または IP。

## エンジン環境変数

### クエリエンジンタイプの設定

#### `PRISMA_CLI_QUERY_ENGINE_TYPE`
Prisma CLI のクエリエンジンタイプを定義します（デフォルト: `library`）。

例：
```bash
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
```

#### `PRISMA_CLIENT_ENGINE_TYPE`
Prisma Client のクエリエンジンタイプを定義します（デフォルト: `library`）。

### カスタムエンジンファイルの場所

#### `PRISMA_QUERY_ENGINE_BINARY`
クエリエンジンバイナリのカスタム場所を設定します。

#### `PRISMA_QUERY_ENGINE_LIBRARY`
クエリエンジンライブラリのカスタム場所を設定します。

#### `PRISMA_SCHEMA_ENGINE_BINARY`
スキーマエンジンバイナリのカスタム場所を設定します。

#### `PRISMA_FMT_BINARY`
フォーマットエンジンバイナリのカスタム場所を設定します。

## データベース接続環境変数

### `DATABASE_URL`
データベース接続文字列。Prisma スキーマで `env("DATABASE_URL")` として参照されます。

例：
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### `SHADOW_DATABASE_URL`
シャドウデータベースの接続文字列（Prisma Migrate で使用）。

## Prisma Migrate 環境変数

### `PRISMA_MIGRATE_SKIP_GENERATE`
マイグレーション適用後の Prisma Client の自動生成をスキップします。

### `PRISMA_MIGRATE_SKIP_SEED`
マイグレーションリセット後のデータベースシード処理をスキップします。

### `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK`
Prisma Migrate のアドバイザリロックを無効化します。

## パフォーマンス調整環境変数

### `QUERY_BATCH_SIZE`
バッチクエリのサイズを設定します。

### `PRISMA_CLIENT_NO_RETRY`
接続エラー時の自動リトライを無効化します。

## ログ関連環境変数

### `DEBUG`
詳細なデバッグログを有効化します。

可能な値：
- `prisma:client`: Prisma Client のログ
- `prisma:engine`: クエリエンジンのログ
- `prisma:*`: すべての Prisma ログ

例：
```bash
DEBUG="prisma:*" node app.js
```

## セキュリティ関連環境変数

### `PRISMA_HIDE_SENSITIVE_LOGS`
ログから機密情報（パスワード、トークンなど）を非表示にします。

## その他の環境変数

### `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING`
エンジンチェックサムの検証をスキップします。

### `PRISMA_SHOW_ALL_TRACES`
すべてのスタックトレースを表示します（デバッグ用）。

## 使用例

環境変数の設定方法：

### Unix/Linux/macOS
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
export PRISMA_HIDE_UPDATE_MESSAGE=true
```

### Windows (PowerShell)
```powershell
$env:DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
$env:PRISMA_HIDE_UPDATE_MESSAGE="true"
```

### .env ファイル
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/shadow"
PRISMA_HIDE_UPDATE_MESSAGE=true
DEBUG="prisma:client"
```

## 注意事項

- 機密情報（パスワード、API キーなど）を含む環境変数は `.env` ファイルに保存し、バージョン管理から除外してください
- 本番環境では適切な環境変数管理サービスを使用することを推奨します
- 環境変数の変更後は、アプリケーションを再起動する必要があります
