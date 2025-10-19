# Turso - クイックスタート

数分でTursoを始める方法を説明します。

## 学習目標

このクイックスタートでは以下を学びます：

1. Turso CLIのインストール
2. Tursoへのサインアップ
3. 最初のTurso Databaseの作成
4. データベースシェルへの接続

## 1. Turso CLIのインストール

プラットフォームに応じてTurso CLIをインストールします：

### macOS

```bash
brew install tursodatabase/tap/turso
```

### Linux / Windows (WSL)

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

## 2. サインアップ / ログイン

### 新規サインアップ

```bash
turso auth signup
```

### 既存アカウントでログイン

```bash
turso auth login
```

## 3. データベースの作成

最初のデータベースを作成します：

```bash
turso db create my-db
```

### データベースの確認

作成したデータベースの詳細を確認：

```bash
turso db show my-db
```

## 4. データベースシェルへの接続

インタラクティブなSQLシェルに接続します：

```bash
turso db shell my-db
```

## データベースシェル操作

### テーブルの作成

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT
);
```

### データの挿入

```sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
```

### データのクエリ

```sql
SELECT * FROM users;
```

### シェルの終了

```sql
.quit
```

## 次のステップ

アプリケーションから接続するには、提供されているSDKを使用します：

- [JavaScript/TypeScript SDK](/docs/services/turso/docs/connect/javascript)
- [Python SDK](/docs/services/turso/docs/connect/python)
- [Go SDK](/docs/services/turso/docs/connect/go)
- [Rust SDK](/docs/services/turso/docs/connect/rust)
- [Dart SDK](/docs/services/turso/docs/connect/dart)

## 重要な注意事項

- CLIは自動的に最も近いリージョンを検出します
- データベース作成はリージョン固有です
- シェルでSQL操作を直接実行できます

## データベース認証情報の取得

アプリケーションから接続するために必要な情報：

### データベースURL

```bash
turso db show my-db --url
```

### 認証トークン

```bash
turso db tokens create my-db
```

## 環境変数の設定

取得した認証情報を環境変数として設定することを推奨します：

```bash
export TURSO_DATABASE_URL="libsql://my-db-[org-name].turso.io"
export TURSO_AUTH_TOKEN="your-auth-token-here"
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [ローカル開発](/docs/services/turso/docs/local-development)
