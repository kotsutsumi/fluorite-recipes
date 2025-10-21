# Turso - Goで接続

Goを使用してTursoに接続する方法を説明します。

## セットアップ手順

### 1. インストール

Go Modulesを使用してTurso Goパッケージをインストールします：

```bash
go get github.com/tursodatabase/turso-go
go install github.com/tursodatabase/turso-go
```

### 2. 接続

ローカルSQLiteデータベースに接続します：

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/tursodatabase/turso-go"
)

func main() {
    db, err := sql.Open("turso", "file:sqlite.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
}
```

### 3. テーブルの作成

`users`テーブルを作成します：

```go
_, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
    )
`)
if err != nil {
    log.Fatal(err)
}
```

### 4. データの挿入

プリペアドステートメントを使用してユーザーを挿入します：

```go
_, err = db.Exec("INSERT INTO users (username) VALUES (?)", "alice")
if err != nil {
    log.Fatal(err)
}

_, err = db.Exec("INSERT INTO users (username) VALUES (?)", "bob")
if err != nil {
    log.Fatal(err)
}
```

### 5. データのクエリ

すべてのユーザーを取得して表示します：

```go
stmt, err := db.Prepare("SELECT id, username FROM users")
if err != nil {
    log.Fatal(err)
}
defer stmt.Close()

rows, err := stmt.Query()
if err != nil {
    log.Fatal(err)
}
defer rows.Close()

for rows.Next() {
    var id int
    var username string
    err = rows.Scan(&id, &username)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("User: %d - %s\n", id, username)
}
```

## 完全なコード例

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/tursodatabase/turso-go"
)

func main() {
    // データベースに接続
    db, err := sql.Open("turso", "file:sqlite.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // テーブルを作成
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL
        )
    `)
    if err != nil {
        log.Fatal(err)
    }

    // データを挿入
    _, err = db.Exec("INSERT INTO users (username) VALUES (?)", "alice")
    if err != nil {
        log.Fatal(err)
    }

    _, err = db.Exec("INSERT INTO users (username) VALUES (?)", "bob")
    if err != nil {
        log.Fatal(err)
    }

    // データをクエリ
    stmt, err := db.Prepare("SELECT id, username FROM users")
    if err != nil {
        log.Fatal(err)
    }
    defer stmt.Close()

    rows, err := stmt.Query()
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    fmt.Println("Users:")
    for rows.Next() {
        var id int
        var username string
        err = rows.Scan(&id, &username)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("  %d: %s\n", id, username)
    }

    if err = rows.Err(); err != nil {
        log.Fatal(err)
    }
}
```

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```go
import (
    "database/sql"
    "os"

    _ "github.com/tursodatabase/turso-go"
)

func main() {
    url := os.Getenv("TURSO_DATABASE_URL")
    token := os.Getenv("TURSO_AUTH_TOKEN")

    db, err := sql.Open("turso", url+"?authToken="+token)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
}
```

## 主な機能

### プリペアドステートメント

SQLインジェクション攻撃を防ぐため、プリペアドステートメントの使用を推奨します：

```go
stmt, err := db.Prepare("INSERT INTO users (username) VALUES (?)")
if err != nil {
    log.Fatal(err)
}
defer stmt.Close()

_, err = stmt.Exec("alice")
if err != nil {
    log.Fatal(err)
}
```

### トランザクション

複数の操作をアトミックに実行できます：

```go
tx, err := db.Begin()
if err != nil {
    log.Fatal(err)
}

_, err = tx.Exec("INSERT INTO users (username) VALUES (?)", "alice")
if err != nil {
    tx.Rollback()
    log.Fatal(err)
}

_, err = tx.Exec("INSERT INTO users (username) VALUES (?)", "bob")
if err != nil {
    tx.Rollback()
    log.Fatal(err)
}

err = tx.Commit()
if err != nil {
    log.Fatal(err)
}
```

### 単一行のクエリ

1つの結果のみが期待される場合、`QueryRow`を使用できます：

```go
var username string
err := db.QueryRow("SELECT username FROM users WHERE id = ?", 1).Scan(&username)
if err != nil {
    if err == sql.ErrNoRows {
        fmt.Println("No user found")
    } else {
        log.Fatal(err)
    }
}
fmt.Println("Username:", username)
```

### エラーハンドリング

Goの標準的なエラーハンドリングパターンを使用します：

```go
rows, err := db.Query("SELECT id, username FROM users")
if err != nil {
    return fmt.Errorf("query failed: %w", err)
}
defer rows.Close()

for rows.Next() {
    var id int
    var username string
    if err := rows.Scan(&id, &username); err != nil {
        return fmt.Errorf("scan failed: %w", err)
    }
    // データを処理
}

if err = rows.Err(); err != nil {
    return fmt.Errorf("rows iteration error: %w", err)
}
```

## ベストプラクティス

1. **常にdeferでクローズ**: データベース接続、ステートメント、行を適切に閉じる
2. **プリペアドステートメントを使用**: SQLインジェクションを防ぐ
3. **トランザクションを使用**: 関連する操作をグループ化
4. **エラーをチェック**: すべてのデータベース操作後にエラーを確認
5. **環境変数を使用**: 認証情報をコードにハードコードしない

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [turso-go GitHub](https://github.com/tursodatabase/turso-go)
- [Go database/sql package](https://pkg.go.dev/database/sql)
