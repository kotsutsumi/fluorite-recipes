# Tursoへのマイグレーション

既存のSQLiteデータベースをTurso Cloudにインポートする方法を説明します。

## 概要

既存のSQLiteデータベースをTurso Cloudに移行する方法は2つあります：

1. Turso CLI
2. Platform API

## 準備手順

### データベースをWALモードにする

マイグレーション前に、データベースがWAL（Write-Ahead Logging）モードであることを確認する必要があります。

#### 1. SQLiteデータベースを開く

```bash
sqlite3 my-database.db
```

#### 2. ジャーナルモードをWALに設定

```sql
PRAGMA journal_mode=WAL;
```

#### 3. WALファイルをチェックポイント化してトランケート

```sql
PRAGMA wal_checkpoint(TRUNCATE);
```

#### 4. ジャーナルモードを確認

```sql
PRAGMA journal_mode;
```

出力が`wal`であることを確認してください。

#### 5. データベースを閉じる

```sql
.quit
```

## Turso CLIを使用したマイグレーション

### 1. Turso CLIのインストール

まだインストールしていない場合：

```bash
# macOS
brew install tursodatabase/tap/turso

# Linux / Windows (WSL)
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. データベースのインポート

```bash
turso db import ~/path/to/my-database.db
```

### 3. データベースに接続

インポートしたデータベースに接続してデータを確認：

```bash
turso db shell <database-name>
```

## Platform APIを使用したマイグレーション

### 1. サインアップ/ログイン

```bash
turso auth signup
# または
turso auth login
```

### 2. Platform APIトークンの作成

```bash
turso auth api-tokens mint <token-name>
```

### 3. アカウント/組織スラッグの取得

```bash
turso org list
```

### 4. インポート用のデータベースを作成

```bash
curl -L -X POST \
  'https://api.turso.tech/v1/organizations/{organizationSlug}/databases' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name": "my-imported-database",
    "group": "default"
  }'
```

### 5. データベーストークンの生成

```bash
curl -L -X POST \
  'https://api.turso.tech/v1/organizations/{organizationSlug}/databases/my-imported-database/auth/tokens?expiration=2w' \
  -H 'Authorization: Bearer TOKEN'
```

### 6. SQLiteデータベースファイルのアップロード

```bash
curl -L -X POST \
  'https://api.turso.tech/v1/organizations/{organizationSlug}/databases/my-imported-database/upload' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/octet-stream' \
  --data-binary '@/path/to/my-database.db'
```

## 重要な要件

### WALモード

- **必須**: データベースはWALモードである必要があります
- WALモード以外のデータベースはインポートできません
- インポート前に必ずWALモードに変換してください

### ファイルサイズ

- インポート可能なファイルサイズには制限があります
- 大規模なデータベースの場合は、サポートに問い合わせてください

## マイグレーション後の確認

### データの確認

```bash
turso db shell my-imported-database
```

```sql
-- テーブル一覧を表示
.tables

-- データを確認
SELECT * FROM my_table LIMIT 10;
```

### スキーマの確認

```sql
.schema
```

## トラブルシューティング

### WALモードエラー

```
Error: Database is not in WAL mode
```

**解決方法**: データベースをWALモードに変換してから再試行してください。

### ファイルサイズエラー

```
Error: File size exceeds maximum allowed
```

**解決方法**:
- データベースを複数の小さなデータベースに分割
- サポートに問い合わせて制限の引き上げを依頼

### 権限エラー

```
Error: Authorization failed
```

**解決方法**:
- APIトークンが正しいか確認
- トークンの有効期限を確認
- 必要な権限があるか確認

## ベストプラクティス

1. **バックアップ**: マイグレーション前に必ずバックアップを作成
2. **テスト**: 小規模なテストデータベースで先にテスト
3. **検証**: インポート後にデータを検証
4. **WALモード**: インポート前に必ずWALモードに変換

## 大規模データベースの移行

### 推奨手順

1. データベースを論理的なチャンクに分割
2. 各チャンクを個別にインポート
3. 必要に応じて`ATTACH`機能を使用して結合

### パフォーマンス最適化

- ネットワーク帯域幅の確保
- オフピーク時間にマイグレーション実行
- 段階的な移行を検討

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso CLI Reference](https://docs.turso.tech/cli)
- [Platform API Reference](https://docs.turso.tech/api)
- [SQLite WAL Mode](https://www.sqlite.org/wal.html)
