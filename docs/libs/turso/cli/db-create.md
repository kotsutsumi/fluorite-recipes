# turso db create - データベース作成

Turso CLIの`turso db create`コマンドは、新しいデータベースを作成します。既存のデータベースからのコピー、SQLiteファイルからのインポート、CSV形式からの作成など、様々な方法でデータベースを作成できます。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [データソースからの作成](#データソースからの作成)
- [ベストプラクティス](#ベストプラクティス)
- [制限事項](#制限事項)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db create [データベース名] [オプション]
```

### パラメータ

- `データベース名` (オプション): 作成するデータベースの名前
  - 省略した場合、プロジェクト名が使用されます
  - 複数のグループが存在する場合は`--group`フラグが必須

## オプション

### グループとロケーション

#### `--group <グループ名>`

データベースを作成するグループを指定します。

```bash
turso db create my-db --group production
```

**注意**: 複数のグループが存在する場合、このフラグは必須です。

### 機能拡張

#### `--enable-extensions`

実験的なSQLite拡張機能を有効化します。

```bash
turso db create my-db --enable-extensions
```

**重要**: この設定はグループ内のすべてのデータベースに影響します。

### サイズ制限

#### `--size-limit <サイズ>`

データベースの最大サイズを設定します。

```bash
turso db create my-db --size-limit 1gb
```

### データソースオプション

#### `--from-csv <CSVファイルパス>`

CSVファイルからデータベースを作成します。

```bash
turso db create my-db --from-csv ./data.csv
```

#### `--from-db <既存データベース名>`

既存のデータベースからデータをコピーして作成します。

```bash
turso db create new-db --from-db existing-db
```

#### `--from-dump <ダンプファイルパス>`

ローカルのSQLiteダンプファイルからデータベースを作成します。

```bash
turso db create my-db --from-dump ./dump.sql
```

#### `--from-dump-url <URL>`

リモートのSQLiteダンプファイルからデータベースを作成します。

```bash
turso db create my-db --from-dump-url https://example.com/dump.sql
```

#### `--from-file <SQLiteファイルパス>`

ローカルのSQLite3互換ファイルからデータベースを作成します。

```bash
turso db create my-db --from-file ./local.db
```

**制限**: ファイルサイズは2GB以下である必要があります。

### ポイントインタイム

#### `--timestamp <タイムスタンプ>`

特定の時点のデータをコピーします。`--from-db`と併用します。

```bash
turso db create new-db --from-db old-db --timestamp 2024-01-01T10:10:10-10:00
```

**フォーマット**: RFC3339形式（例: `2024-01-01T10:10:10-10:00`）

### 実行制御

#### `-w, --wait`

データベースが準備完了するまで待機します。

```bash
turso db create my-db --wait
```

#### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db create --help
```

## 使用例

### 基本的なデータベース作成

#### 空のデータベースを作成

```bash
turso db create my-database
```

#### 特定のグループにデータベースを作成

```bash
turso db create my-database --group production
```

#### 拡張機能を有効化して作成

```bash
turso db create my-database --enable-extensions --group default
```

### データソースからの作成

#### SQLiteファイルからインポート

```bash
turso db create imported-db --from-file ./local-database.db
```

ローカルのSQLite3データベースファイルから新しいTursoデータベースを作成します。

**ファイル要件**:
- SQLite3互換形式
- 2GB以下のサイズ

#### CSVファイルから作成

```bash
turso db create csv-db --from-csv ./data.csv --group default
```

CSVファイルから直接データベースを作成します。

#### SQLダンプから作成（ローカル）

```bash
turso db create dump-db --from-dump ./backup.sql
```

#### SQLダンプから作成（リモート）

```bash
turso db create remote-db --from-dump-url https://backups.example.com/latest.sql
```

### 既存データベースのコピー

#### 現在の状態をコピー

```bash
turso db create prod-copy --from-db production-db
```

#### 特定時点のデータをコピー

```bash
turso db create snapshot-db \
  --from-db production-db \
  --timestamp 2024-01-15T09:00:00Z
```

この例では、2024年1月15日午前9時（UTC）時点のデータでデータベースを作成します。

### サイズ制限付きデータベース

```bash
turso db create limited-db --size-limit 500mb --group default
```

最大サイズを500MBに制限したデータベースを作成します。

### 準備完了を待機

```bash
turso db create my-db --wait --group default
```

データベースが完全に準備完了するまでコマンドが待機します。

## データソースからの作成

### CSVインポート

```typescript
interface CSVImport {
  source: {
    format: "CSV";
    filePath: string;
  };
  options: {
    delimiter?: string;     // カスタム区切り文字（デフォルト: カンマ）
    hasHeader?: boolean;    // ヘッダー行の有無
  };
}
```

**使用例**:

```bash
# 基本的なCSVインポート
turso db create sales-data --from-csv ./sales.csv

# 大きなCSVファイルの場合は準備完了を待機
turso db create large-dataset --from-csv ./big-data.csv --wait
```

### SQLiteファイルインポート

```typescript
interface SQLiteImport {
  source: {
    format: "SQLite3";
    filePath: string;
    maxSize: "2GB";
  };
  requirements: {
    compatibility: "SQLite3";
    walMode: boolean;       // WALモードの有無
  };
}
```

**使用例**:

```bash
# ローカルSQLiteファイルからインポート
turso db create app-db --from-file ./app.db --group production

# サイズ制限を設定してインポート
turso db create app-db --from-file ./app.db --size-limit 1gb
```

### データベースクローン

```typescript
interface DatabaseClone {
  source: {
    database: string;
    timestamp?: string;     // RFC3339形式
  };
  options: {
    pointInTime: boolean;
    includeSchema: boolean;
    includeData: boolean;
  };
}
```

**使用例**:

```bash
# 本番データベースの開発用コピーを作成
turso db create dev-db --from-db production-db --group development

# 昨日の時点のデータでコピーを作成
turso db create yesterday-snapshot \
  --from-db production-db \
  --timestamp 2024-10-18T00:00:00Z
```

## 複合的な使用例

### 本番環境への移行

```bash
# ステップ 1: ローカルデータベースを準備
sqlite3 local.db < schema.sql

# ステップ 2: Tursoにインポート
turso db create production-db \
  --from-file ./local.db \
  --group production \
  --size-limit 10gb \
  --wait

# ステップ 3: データベース情報を確認
turso db show production-db
```

### バックアップとリストア

```bash
# バックアップ用のスナップショットを作成
turso db create backup-$(date +%Y%m%d) \
  --from-db production-db \
  --group backups

# 特定時点からのリストア
turso db create restored-db \
  --from-db production-db \
  --timestamp 2024-10-19T12:00:00Z \
  --group production
```

### 開発環境のセットアップ

```bash
# 本番データのサニタイズ版を開発環境に作成
turso db create dev-sanitized \
  --from-db production-db \
  --group development \
  --size-limit 1gb
```

## ベストプラクティス

### 1. 適切なグループ管理

環境ごとにグループを分けることを推奨:

```bash
# 本番環境
turso db create prod-api --group production

# ステージング環境
turso db create staging-api --group staging

# 開発環境
turso db create dev-api --group development
```

### 2. 命名規則

一貫した命名規則を使用:

```bash
# 環境プレフィックス
turso db create prod-users --group production
turso db create dev-users --group development

# 機能別
turso db create auth-service --group services
turso db create analytics-db --group analytics
```

### 3. サイズ制限の設定

予期しない増大を防ぐため、適切なサイズ制限を設定:

```bash
# 小規模アプリケーション
turso db create small-app --size-limit 100mb

# 中規模アプリケーション
turso db create medium-app --size-limit 1gb

# 大規模アプリケーション
turso db create large-app --size-limit 10gb
```

### 4. タイムスタンプの活用

重要な変更前にスナップショットを作成:

```bash
# 重要な変更前のスナップショット
turso db create pre-migration-snapshot \
  --from-db production-db \
  --timestamp $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

### 5. 待機フラグの使用

スクリプト内では`--wait`フラグを使用してデータベースの準備完了を確保:

```bash
#!/bin/bash
turso db create new-db --group production --wait
turso db shell new-db < schema.sql
```

## 制限事項

### ファイルサイズ制限

```typescript
interface Limitations {
  fileImport: {
    maxSize: "2GB";
    supportedFormats: ["SQLite3", "SQL dump", "CSV"];
  };
  database: {
    maxSize: "Planによる";
    extensions: "グループレベルで設定";
  };
}
```

### 重要な制約

1. **ファイルインポート**: 最大2GB
2. **拡張機能**: グループ内のすべてのDBに影響
3. **タイムスタンプ**: RFC3339形式必須
4. **グループ**: 複数グループ存在時は必須指定

## トラブルシューティング

### エラー: "group is required"

**原因**: 複数のグループが存在するが、グループが指定されていない

**解決方法**:
```bash
# グループ一覧を確認
turso group list

# グループを指定して作成
turso db create my-db --group default
```

### エラー: "file too large"

**原因**: インポートファイルが2GBを超えている

**解決方法**:
```bash
# ファイルサイズを確認
ls -lh ./large-file.db

# データを分割するか、小さいデータセットを使用
# または、ダンプファイルを使用
turso db create my-db --from-dump ./dump.sql
```

### エラー: "invalid timestamp format"

**原因**: タイムスタンプがRFC3339形式ではない

**解決方法**:
```bash
# 正しいフォーマット
turso db create snapshot \
  --from-db source \
  --timestamp 2024-10-19T12:00:00Z

# タイムゾーン付き
turso db create snapshot \
  --from-db source \
  --timestamp 2024-10-19T12:00:00+09:00
```

## パフォーマンス考慮事項

### 作成時間

データベースの作成時間は以下に依存:

```typescript
interface CreationTime {
  factors: {
    sourceType: "空 < CSV < SQLite < クローン";
    dataSize: "データ量に比例";
    location: "リージョン間の距離";
  };
  optimization: {
    useWait: "準備完了を確実に待機";
    localFiles: "リモートよりも高速";
    timestamps: "最新データが最も高速";
  };
}
```

### 推奨事項

```bash
# 大きなファイルの場合は--waitを使用
turso db create large-db --from-file ./big.db --wait

# ローカルファイルを優先
turso db create local-import --from-file ./local.db

# リモートURLは最終手段
turso db create remote-import --from-dump-url https://example.com/dump.sql
```

## 関連コマンド

- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso db show`](./db-show.md) - データベース詳細を表示
- [`turso db destroy`](./db-destroy.md) - データベースを削除
- [`turso db import`](./db-import.md) - 既存SQLiteファイルをインポート
- [`turso group list`](./group-list.md) - グループ一覧を表示

## 参考リンク

- [Turso データベース概念](https://docs.turso.tech/concepts/databases)
- [Turso グループ管理](https://docs.turso.tech/concepts/groups)
- [SQLite互換性](https://docs.turso.tech/libsql)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
