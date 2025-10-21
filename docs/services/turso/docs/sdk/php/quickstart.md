# PHP SDK クイックスタート - Turso

PHP アプリケーションで Turso データベースを使用するための基本ガイドです。

## インストール

```bash
composer require turso/libsql
```

## 接続方法

### 1. 組み込みレプリカ（推奨）

```php
<?php

require 'vendor/autoload.php';

use Turso\Database;

$db = new Database(
    path: 'test.db',
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN'),
    syncInterval: 100
);
```

### 2. ローカルデータベース

```php
$db = new Database("database.db");
```

### 3. リモートデータベース

```php
$db = new Database(
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN')
);
```

## クエリの実行

### テーブルの作成とデータの挿入

```php
$createUsers = "
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
  );
";

$db->executeBatch($createUsers);
```

### データの挿入

```php
$db->execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ['Alice', 'alice@example.com']
);
```

### データの取得

```php
// すべてのユーザーを取得
$result = $db->query("SELECT * FROM users");
$users = $result->fetchArray();

foreach ($users as $user) {
    echo "ID: {$user['id']}, Name: {$user['name']}\n";
}

// 単一ユーザーを取得
$result = $db->query(
    "SELECT * FROM users WHERE id = ?",
    [1]
);
$user = $result->fetchArray()[0] ?? null;
```

### プレースホルダーの使用

```php
// 位置指定プレースホルダー
$db->query("SELECT * FROM users WHERE id = ?", [1]);

// 名前付きプレースホルダー
$db->query(
    "SELECT * FROM users WHERE id = :id",
    [":id" => 1]
);
```

### データの更新

```php
$db->execute(
    "UPDATE users SET name = ? WHERE id = ?",
    ['Alice Updated', 1]
);
```

### データの削除

```php
$db->execute("DELETE FROM users WHERE id = ?", [1]);
```

## 同期機能（組み込みレプリカ）

```php
// 手動同期
$db->sync();
```

## 完全な例

```php
<?php

require 'vendor/autoload.php';

use Turso\Database;

// データベースに接続
$db = new Database(
    path: 'app.db',
    url: getenv('TURSO_DATABASE_URL'),
    authToken: getenv('TURSO_AUTH_TOKEN'),
    syncInterval: 60
);

// テーブルを作成
$db->executeBatch("
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
");

// ユーザーを作成
$db->execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    ['Alice', 'alice@example.com']
);

// すべてのユーザーを取得
$result = $db->query("SELECT * FROM users");
$users = $result->fetchArray();

echo "Users:\n";
foreach ($users as $user) {
    echo sprintf(
        "  %d: %s (%s) - %s\n",
        $user['id'],
        $user['name'],
        $user['email'],
        $user['created_at']
    );
}

// ユーザーを更新
$db->execute(
    "UPDATE users SET name = ? WHERE id = ?",
    ['Alice Updated', 1]
);

// 更新後のユーザーを取得
$result = $db->query("SELECT * FROM users WHERE id = ?", [1]);
$user = $result->fetchArray()[0] ?? null;

if ($user) {
    echo "\nUpdated user: {$user['name']}\n";
}

// 手動同期
$db->sync();
```

## 関連リンク

- [PHP SDK リファレンス](./reference.md)
- [Doctrine DBAL との統合](./orm/doctrine-dbal.md)
- [Laravel との統合](./guides/laravel.md)
