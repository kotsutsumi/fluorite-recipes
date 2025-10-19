# Turso - ローカル開発

Tursoを使用したローカル開発の方法を説明します。

## 概要

開発者はTursoを使用してローカルで開発する際、3つの主要な方法があります：

1. **SQLite** - ローカルSQLiteデータベースファイル
2. **Turso CLI** - 管理されたlibSQLサーバー
3. **Turso Database** - リモートTursoデータベース

## データベースダンプをローカルで使用

本番データベースからローカルデータベースを作成する手順：

### 1. データベースダンプの作成

Turso CLIを使用してダンプを作成：

```bash
turso db shell my-database .dump > dump.sql
```

### 2. ローカルSQLiteファイルへインポート

```bash
sqlite3 local.db < dump.sql
```

### 3. ローカルデータベースファイルに接続

アプリケーションから`file:local.db`で接続します。

## SQLiteローカル開発

### 特徴

- libSQLと比較して機能が限定的
- 非サーバーレスのTurso SDKと互換
- `file:` URLで接続

### 接続例

**JavaScript**:
```javascript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:local.db"
});
```

**Rust**:
```rust
use libsql::Builder;

let db = Builder::new_local("local.db").build().await?;
```

**Go**:
```go
import "database/sql"
import _ "github.com/tursodatabase/libsql-client-go/libsql"

db, err := sql.Open("libsql", "file:local.db")
```

**Python**:
```python
import libsql_experimental as libsql

conn = libsql.connect("local.db")
```

## Turso CLI開発

### 特徴

- libSQL固有の拡張機能をサポート
- ローカルlibSQLサーバーを起動
- `--db-file`フラグで変更を永続化可能
- デフォルトでは一時的（サーバー停止時に変更が失われる）

### サーバーの起動

#### 一時的なデータベース

```bash
turso dev
```

#### 永続的なデータベース

```bash
turso dev --db-file local.db
```

### 接続例

**JavaScript**:
```javascript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "http://127.0.0.1:8080"
});
```

## Turso Database（リモート）

### 注意事項

**警告**: ホストされたデータベースの使用は、プラットフォームのコストとクォータに計上されます。

開発環境でリモートデータベースを使用する場合は、以下を考慮してください：

- 使用量の増加
- コストの発生
- クォータの消費

### 推奨事項

開発環境では、コストを避けるためにローカル開発方法（SQLiteまたはTurso CLI）の使用を推奨します。

## GUIデータベース接続ツール

以下のGUIツールでTursoデータベースに接続できます：

### 推奨ツール

1. **Beekeeper Studio**
   - クロスプラットフォーム
   - オープンソース

2. **Outerbase**
   - Webベース
   - コラボレーション機能

3. **TablePlus**
   - macOS、Windows、Linux対応
   - 直感的なUI

4. **Dataflare**
   - モダンなインターフェース

5. **Outerbase Studio**
   - データ可視化機能

6. **DBeaver**
   - 無料でオープンソース
   - 多くのデータベースをサポート

## 環境変数の使用

開発環境では環境変数を使用してデータベース設定を管理することを推奨：

```bash
# .env
DATABASE_URL=file:local.db
# または
DATABASE_URL=http://127.0.0.1:8080
```

**JavaScript**:
```javascript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL
});
```

## 認証トークン

ローカル開発では、認証トークンは不要です：

- SQLiteファイル: トークン不要
- Turso CLI (turso dev): トークン不要
- リモートTursoデータベース: トークン必要

## ベストプラクティス

1. **環境変数を使用**: データベース設定をコードから分離
2. **ローカル開発方法を優先**: プラットフォームコストを回避
3. **本番データのダンプ使用**: リアルなデータでテスト
4. **GUIツールの活用**: データベースの可視化と管理

## トラブルシューティング

### ファイルが見つからない

```bash
# 正しいパスを確認
ls -la local.db
```

### 権限エラー

```bash
# ファイルの権限を確認
chmod 644 local.db
```

### 接続エラー

- URLが正しいか確認
- ローカルサーバーが起動しているか確認（Turso CLI使用時）

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
