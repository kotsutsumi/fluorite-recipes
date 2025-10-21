# PHP SDK リファレンス - Turso

libSQL PHP SDK の完全なリファレンスドキュメントです。

## インストール

```bash
composer require turso/libsql
```

## データベースの初期化

### ローカルデータベース

```php
use Turso\Database;

$db = new Database("local.db");
```

### インメモリデータベース

```php
$db = new Database(":memory:");
// または
$db = new Database();
```

### リモートデータベース

```php
$db = new Database(
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN')
);
```

### 組み込みレプリカ

```php
$db = new Database(
    path: 'test.db',
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN')
);
```

## 設定オプション

### 同期間隔

```php
$db = new Database(
    path: 'test.db',
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN'),
    syncInterval: 100  // 100秒ごとに自動同期
);
```

### 手動同期

```php
$db->sync();
```

### Read-Your-Writes

```php
$db = new Database(
    path: 'test.db',
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN'),
    readYourWrites: true  // デフォルト: true
);
```

## クエリメソッド

### query()

```php
// 基本的なクエリ
$result = $db->query("SELECT * FROM users");
$rows = $result->fetchArray();

// プレースホルダー付き
$result = $db->query(
    "SELECT * FROM users WHERE id = ?",
    [1]
);

// 名前付きプレースホルダー
$result = $db->query(
    "SELECT * FROM users WHERE id = :id",
    [":id" => 1]
);
```

### execute()

```php
// INSERT
$db->execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ['Alice', 'alice@example.com']
);

// UPDATE
$db->execute(
    "UPDATE users SET name = ? WHERE id = ?",
    ['Bob', 1]
);

// DELETE
$db->execute("DELETE FROM users WHERE id = ?", [1]);
```

### executeBatch()

```php
$db->executeBatch("
  CREATE TABLE users (id INTEGER, name TEXT);
  INSERT INTO users (name) VALUES ('Alice');
  INSERT INTO users (name) VALUES ('Bob');
");
```

## プリペアドステートメント

```php
$conn = $db->connect();

// プリペアドステートメントを作成
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");

// バインドして実行
$result = $stmt->bind([1])->query();
$rows = $result->fetchArray();
```

## トランザクション

### バッチトランザクション

```php
$conn = $db->connect();

$conn->execute_batch("
  CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT);
  INSERT INTO users (name) VALUES ('Alice');
  INSERT INTO users (name) VALUES ('Bob');
");
```

### インタラクティブトランザクション

```php
$conn = $db->connect();
$tx = $conn->transaction();

try {
    $tx->execute(
        "INSERT INTO users (name) VALUES (?)",
        ["Charlie"]
    );

    $tx->execute(
        "UPDATE stats SET count = count + 1"
    );

    $tx->commit();
} catch (Exception $e) {
    $tx->rollback();
    throw $e;
}
```

## 結果の取得

### fetchArray()

```php
$result = $db->query("SELECT * FROM users");
$users = $result->fetchArray();

foreach ($users as $user) {
    echo $user['name'] . "\n";
}
```

### fetchOne()

```php
$result = $db->query("SELECT * FROM users WHERE id = ?", [1]);
$user = $result->fetchOne();

if ($user) {
    echo $user['name'];
}
```

### イテレータとして使用

```php
$result = $db->query("SELECT * FROM users");

foreach ($result as $row) {
    echo $row['name'] . "\n";
}
```

## プレースホルダー

### 位置指定

```php
// ?1, ?2, ...
$db->query(
    "SELECT * FROM users WHERE id = ?1 AND status = ?2",
    [1, 'active']
);
```

### 名前付き

```php
// :name
$db->query(
    "SELECT * FROM users WHERE name = :name AND email = :email",
    [':name' => 'Alice', ':email' => 'alice@example.com']
);
```

## エラーハンドリング

```php
try {
    $db->execute(
        "INSERT INTO users (email) VALUES (?)",
        ['duplicate@example.com']
    );
} catch (Turso\LibsqlException $e) {
    echo "Database error: " . $e->getMessage();
}
```

## ベストプラクティス

### 接続の再利用

```php
class DatabaseService {
    private static ?Database $instance = null;

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database(
                path: 'app.db',
                url: getenv('TURSO_DATABASE_URL'),
                authToken: getenv('TURSO_AUTH_TOKEN')
            );
        }
        return self::$instance;
    }
}

// 使用例
$db = DatabaseService::getInstance();
```

### パラメータ化されたクエリ

```php
// ❌ 危険: SQL インジェクション
$userInput = $_GET['name'];
$db->query("SELECT * FROM users WHERE name = '$userInput'");

// ✅ 安全: パラメータ化
$db->query("SELECT * FROM users WHERE name = ?", [$userInput]);
```

## 関連リンク

- [PHP SDK クイックスタート](./quickstart.md)
- [Doctrine DBAL との統合](./orm/doctrine-dbal.md)
- [Laravel との統合](./guides/laravel.md)
