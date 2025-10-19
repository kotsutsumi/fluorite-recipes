# Turso Database - クイックスタート

Turso Databaseの始め方を説明します。

## インストール

### macOS/Linux

```bash
curl -sSf https://turso.tech/install.sh | bash
```

### Windows

PowerShellで以下のコマンドを実行：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://turso.tech/install.ps1 | iex"
```

**代替方法**: [GitHubリリース](https://github.com/tursodatabase/turso/releases)から実行ファイルをダウンロードすることもできます。

## インタラクティブシェルの起動

以下のコマンドでインメモリデータベースを起動し、インタラクティブなSQLシェルを開始できます：

```bash
tursodb
```

## SQL実行例

### 1. テーブルの作成

```sql
CREATE TABLE users (id INT, username TEXT);
```

### 2. データの挿入

```sql
INSERT INTO users VALUES (1, 'alice');
INSERT INTO users VALUES (2, 'bob');
```

### 3. データのクエリ

```sql
SELECT * FROM users;
```

実行結果：

```
1|alice
2|bob
```

## 実験的機能

Turso Databaseには実験的機能が用意されています。以下のフラグを使用してアクセスできます：

- `--experimental-encryption` - 暗号化機能
- `--experimental-mvcc` - MVCC（Multi-Version Concurrency Control）
- `--experimental-strict` - 厳格モード
- `--experimental-views` - ビュー機能

**重要な注意事項**: これらの機能は本番環境では使用できません。重要なデータには使用しないでください。

## 詳細情報

Tursoマニュアルの詳細については、[Turso GitHubリポジトリ](https://github.com/tursodatabase/turso)をご覧ください。

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
