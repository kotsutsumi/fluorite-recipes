# libSQL

モダンなアプリケーションのためのSQLite

## 概要

**libSQL**は、Tursoによって開発されたSQLiteのフォークです。グローバルにスケーラブルなモダンデータベースを目指して設計されており、SQLiteのドロップイン置き換えとして機能します。

## タグライン

> "libSQL is SQLite for modern applications."

## SQLiteをフォークした理由

### 背景

- SQLiteは「オープンソースだが、オープンコントリビューションではない」
- Tursoはコミュニティのイノベーションを可能にしたい
- libSQLは無料でオープンソースであり続けることをコミット

### 目標

- コミュニティ主導の開発
- モダンなアプリケーションニーズへの対応
- 革新的な機能の追加

## 主な機能

### 保存時の暗号化

libSQLは、データベースの保存時暗号化をサポートしています：

- 複数の暗号化標準をサポート
- ページベースの暗号化
- SQLCipherとwxSQLite3 AES 256 Bitをサポート

### 暗号化の実装

**TypeScript/JavaScript**:
```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:encrypted.db",
  encryptionKey: "your-encryption-key-here"
});
```

**Go**:
```go
import "github.com/tursodatabase/libsql-client-go/libsql"

db, err := sql.Open("libsql", "file:encrypted.db?encryption_key=your-key")
```

**Rust**:
```rust
use libsql::Builder;

let db = Builder::new_local_with_encryption(
    "encrypted.db",
    encryption_key
).build().await?;
```

**Python**:
```python
import libsql_experimental as libsql

conn = libsql.connect(
    "encrypted.db",
    encryption_key="your-encryption-key-here"
)
```

**Flutter/Dart**:
```dart
import 'package:libsql_dart/libsql_dart.dart';

final db = LibsqlClient(
  path: 'encrypted.db',
  encryptionKey: 'your-encryption-key-here',
);
```

## 互換性

### SQLite API

- SQLite APIを完全に維持
- SQLiteファイル形式と互換
- 既存のSQLiteアプリケーションとの互換性

### 追加機能

- 追加の最適化を提供
- 拡張機能のサポート
- モダンなアプリケーション要件への対応

## Tursoとの関係

### Tursoの役割

1. **インスタンス配信の管理**
   - libSQLインスタンスのグローバル配信
   - 高可用性の保証

2. **グローバルHTTP API**
   - REST APIの提供
   - 世界中からのアクセス

3. **管理ツール**
   - CLI提供
   - Web UI提供
   - データベース管理機能

## SDK対応

libSQLは様々なSDKで利用可能：

- JavaScript/TypeScript
- Python
- Go
- Rust
- Dart/Flutter
- PHP

## セキュリティ

### 暗号化キー管理

**重要**: 暗号化キーの管理はユーザーの責任です。

- 環境変数として保存
- キー管理システムの使用を推奨
- バージョン管理にコミットしない

### ベストプラクティス

1. **強力なキーの使用**: 暗号学的に安全なキーを生成
2. **キーのローテーション**: 定期的にキーを更新
3. **アクセス制御**: キーへのアクセスを制限
4. **バックアップ**: キーのセキュアなバックアップ

## コミュニティ

### GitHub

- オープンソースプロジェクト
- コミュニティコントリビューション歓迎
- Issue報告とフィードバック

### Discord

- 開発者ディスカッション
- コミュニティサポート
- 最新情報の共有

## ベクトルデータ型

libSQLはネイティブのベクトルデータ型をサポートしています：

- AI/MLアプリケーション向け
- ベクトル類似検索
- 拡張機能不要

**推奨**: ベクトル拡張機能の代わりに、ネイティブのlibSQLベクトルデータ型の使用を推奨します。

## 使用例

### 基本的なデータベース操作

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:mydb.db"
});

// テーブル作成
await client.execute(
  "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)"
);

// データ挿入
await client.execute({
  sql: "INSERT INTO users (name) VALUES (?)",
  args: ["Alice"]
});

// データクエリ
const result = await client.execute("SELECT * FROM users");
console.log(result.rows);
```

## SQLiteとの違い

### libSQLの利点

1. **コミュニティ駆動**: オープンコントリビューション
2. **モダン機能**: AI/ML対応、暗号化
3. **グローバル配信**: Turso経由での世界展開
4. **拡張性**: 新機能の迅速な追加

### 互換性

- SQLiteの既存機能はすべて利用可能
- 既存のアプリケーションを簡単に移行可能
- ファイル形式の互換性

## ロードマップ

libSQLは継続的に進化しています：

- 新機能の追加
- パフォーマンスの最適化
- コミュニティからのフィードバック対応

## 関連リンク

- [libSQL GitHub](https://github.com/tursodatabase/libsql)
- [Turso公式サイト](https://turso.tech/)
- [Turso Documentation](https://docs.turso.tech/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
