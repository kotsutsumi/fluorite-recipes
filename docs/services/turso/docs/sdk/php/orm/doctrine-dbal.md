# Doctrine DBAL + Turso 統合ガイド

Doctrine DBAL を使用して Turso データベースを操作する方法を説明します。

## セットアップ

### パッケージのインストール

```bash
composer require tursodatabase/turso-doctrine-dbal
```

### libsql PHP 拡張のインストール

システムに libsql PHP 拡張が必要です。

## 接続設定

### リモート接続

```php
<?php

require 'vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

$params = [
    "auth_token"    => getenv('TURSO_AUTH_TOKEN'),
    "sync_url"      => getenv('TURSO_DATABASE_URL'),
    'driverClass'   => \Turso\Doctrine\DBAL\Driver::class,
];

$conn = DriverManager::getConnection($params);
```

### 組み込みレプリカ

```php
$params = [
    "path"          => "local.db",
    "auth_token"    => getenv('TURSO_AUTH_TOKEN'),
    "sync_url"      => getenv('TURSO_DATABASE_URL'),
    "sync_interval" => 300,  // 5分ごとに同期
    'driverClass'   => \Turso\Doctrine\DBAL\Driver::class,
];

$conn = DriverManager::getConnection($params);
```

### その他のオプション

```php
$params = [
    "path"              => "local.db",
    "auth_token"        => getenv('TURSO_AUTH_TOKEN'),
    "sync_url"          => getenv('TURSO_DATABASE_URL'),
    "sync_interval"     => 300,
    "read_your_writes"  => true,
    "encryption_key"    => getenv('ENCRYPTION_KEY'),  // オプション
    'driverClass'       => \Turso\Doctrine\DBAL\Driver::class,
];

$conn = DriverManager::getConnection($params);
```

## クエリの実行

### SELECT クエリ

```php
$sql = "SELECT * FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$result = $stmt->executeQuery([1]);

$users = $result->fetchAllAssociative();

foreach ($users as $user) {
    echo "User: {$user['name']}\n";
}
```

### INSERT クエリ

```php
$sql = "INSERT INTO users (name, email) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->executeStatement(['Alice', 'alice@example.com']);

$lastInsertId = $conn->lastInsertId();
```

### UPDATE クエリ

```php
$sql = "UPDATE users SET name = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$affectedRows = $stmt->executeStatement(['Alice Updated', 1]);
```

### DELETE クエリ

```php
$sql = "DELETE FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->executeStatement([1]);
```

## クエリビルダー

```php
$queryBuilder = $conn->createQueryBuilder();

$users = $queryBuilder
    ->select('*')
    ->from('users')
    ->where('status = :status')
    ->setParameter('status', 'active')
    ->executeQuery()
    ->fetchAllAssociative();
```

## トランザクション

```php
$conn->beginTransaction();

try {
    $conn->insert('users', [
        'name' => 'Bob',
        'email' => 'bob@example.com'
    ]);

    $conn->update('stats', ['count' => 1], ['id' => 1]);

    $conn->commit();
} catch (\Exception $e) {
    $conn->rollBack();
    throw $e;
}
```

## 完全な Todo CLI 例

```php
<?php

require 'vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

// データベース接続
$params = [
    "path"          => "todos.db",
    "auth_token"    => getenv('TURSO_AUTH_TOKEN'),
    "sync_url"      => getenv('TURSO_DATABASE_URL'),
    'driverClass'   => \Turso\Doctrine\DBAL\Driver::class,
];

$conn = DriverManager::getConnection($params);

// テーブルを作成
$conn->executeStatement("
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

// Todo を追加
function addTodo($conn, $task) {
    $conn->insert('todos', [
        'task' => $task,
        'completed' => 0
    ]);
    echo "Todo added: $task\n";
}

// Todo を一覧表示
function listTodos($conn) {
    $todos = $conn->createQueryBuilder()
        ->select('*')
        ->from('todos')
        ->orderBy('created_at', 'DESC')
        ->executeQuery()
        ->fetchAllAssociative();

    if (empty($todos)) {
        echo "No todos found.\n";
        return;
    }

    foreach ($todos as $todo) {
        $status = $todo['completed'] ? '[✓]' : '[ ]';
        echo "{$status} {$todo['id']}. {$todo['task']}\n";
    }
}

// Todo を完了
function completeTodo($conn, $id) {
    $affected = $conn->update('todos', ['completed' => 1], ['id' => $id]);

    if ($affected) {
        echo "Todo $id marked as completed.\n";
    } else {
        echo "Todo $id not found.\n";
    }
}

// Todo を削除
function deleteTodo($conn, $id) {
    $affected = $conn->delete('todos', ['id' => $id]);

    if ($affected) {
        echo "Todo $id deleted.\n";
    } else {
        echo "Todo $id not found.\n";
    }
}

// CLI
if ($argc < 2) {
    echo "Usage: php todo.php [add|list|complete|delete] [args]\n";
    exit(1);
}

$command = $argv[1];

switch ($command) {
    case 'add':
        if ($argc < 3) {
            echo "Usage: php todo.php add <task>\n";
            exit(1);
        }
        addTodo($conn, $argv[2]);
        break;

    case 'list':
        listTodos($conn);
        break;

    case 'complete':
        if ($argc < 3) {
            echo "Usage: php todo.php complete <id>\n";
            exit(1);
        }
        completeTodo($conn, $argv[2]);
        break;

    case 'delete':
        if ($argc < 3) {
            echo "Usage: php todo.php delete <id>\n";
            exit(1);
        }
        deleteTodo($conn, $argv[2]);
        break;

    default:
        echo "Unknown command: $command\n";
        exit(1);
}
```

## 関連リンク

- [PHP SDK リファレンス](../reference.md)
- [Laravel との統合](../guides/laravel.md)
- [Doctrine DBAL 公式ドキュメント](https://www.doctrine-project.org/projects/dbal.html)
