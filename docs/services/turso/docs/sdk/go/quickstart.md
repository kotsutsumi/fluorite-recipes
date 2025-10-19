# Go SDK クイックスタート - Turso

Go アプリケーションで Turso データベースを使用するための基本ガイドです。

## インストール

### ローカル/組み込みレプリカ用

```bash
go get github.com/tursodatabase/go-libsql
```

### リモートのみ用

```bash
go get github.com/tursodatabase/libsql-client-go/libsql
```

## 接続方法

### 1. 組み込みレプリカ（推奨）

```go
package main

import (
    "database/sql"
    "fmt"
    "os"
    "time"

    _ "github.com/tursodatabase/go-libsql"
    "github.com/tursodatabase/go-libsql"
)

func main() {
    dbPath := "./local.db"
    primaryUrl := os.Getenv("TURSO_DATABASE_URL")
    authToken := os.Getenv("TURSO_AUTH_TOKEN")

    connector, err := libsql.NewEmbeddedReplicaConnector(
        dbPath,
        primaryUrl,
        libsql.WithAuthToken(authToken),
    )
    if err != nil {
        panic(err)
    }
    defer connector.Close()

    db := sql.OpenDB(connector)
    defer db.Close()

    // クエリを実行
    rows, err := db.Query("SELECT * FROM users")
    if err != nil {
        panic(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id int
        var name string
        if err := rows.Scan(&id, &name); err != nil {
            panic(err)
        }
        fmt.Printf("User: %d - %s\n", id, name)
    }
}
```

### 2. ローカルデータベース

```go
db, err := sql.Open("libsql", "file:./local.db")
if err != nil {
    panic(err)
}
defer db.Close()
```

### 3. リモートデータベース

```go
url := os.Getenv("TURSO_DATABASE_URL")
authToken := os.Getenv("TURSO_AUTH_TOKEN")

dbUrl := fmt.Sprintf("%s?authToken=%s", url, authToken)

db, err := sql.Open("libsql", dbUrl)
if err != nil {
    panic(err)
}
defer db.Close()
```

## クエリの実行

### SELECT クエリ

```go
type User struct {
    ID    int
    Name  string
    Email string
}

func queryUsers(db *sql.DB) ([]User, error) {
    rows, err := db.Query("SELECT id, name, email FROM users")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return users, nil
}
```

### INSERT クエリ

```go
func createUser(db *sql.DB, name, email string) (int64, error) {
    result, err := db.Exec(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        name,
        email,
    )
    if err != nil {
        return 0, err
    }

    id, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }

    return id, nil
}
```

### UPDATE クエリ

```go
func updateUser(db *sql.DB, id int, name string) error {
    _, err := db.Exec(
        "UPDATE users SET name = ? WHERE id = ?",
        name,
        id,
    )
    return err
}
```

### DELETE クエリ

```go
func deleteUser(db *sql.DB, id int) error {
    _, err := db.Exec("DELETE FROM users WHERE id = ?", id)
    return err
}
```

## 同期機能（組み込みレプリカ）

### 手動同期

```go
connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
)
if err != nil {
    panic(err)
}

// 同期を実行
if err := connector.Sync(); err != nil {
    panic(err)
}
```

### 自動定期同期

```go
connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
    libsql.WithSyncInterval(time.Minute), // 1分ごとに同期
)
if err != nil {
    panic(err)
}
```

## トランザクション

```go
func transferFunds(db *sql.DB, fromID, toID int, amount float64) error {
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // 送金元から減額
    _, err = tx.Exec(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        amount,
        fromID,
    )
    if err != nil {
        return err
    }

    // 送金先に加算
    _, err = tx.Exec(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        amount,
        toID,
    )
    if err != nil {
        return err
    }

    return tx.Commit()
}
```

## 完全な例

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "time"

    _ "github.com/tursodatabase/go-libsql"
    "github.com/tursodatabase/go-libsql"
)

type User struct {
    ID    int
    Name  string
    Email string
}

func main() {
    dbPath := "./local.db"
    primaryUrl := os.Getenv("TURSO_DATABASE_URL")
    authToken := os.Getenv("TURSO_AUTH_TOKEN")

    connector, err := libsql.NewEmbeddedReplicaConnector(
        dbPath,
        primaryUrl,
        libsql.WithAuthToken(authToken),
        libsql.WithSyncInterval(time.Minute),
    )
    if err != nil {
        log.Fatal(err)
    }
    defer connector.Close()

    db := sql.OpenDB(connector)
    defer db.Close()

    // テーブルを作成
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `)
    if err != nil {
        log.Fatal(err)
    }

    // ユーザーを作成
    id, err := createUser(db, "Alice", "alice@example.com")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Created user with ID: %d\n", id)

    // ユーザーを取得
    users, err := queryUsers(db)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Users:")
    for _, user := range users {
        fmt.Printf("  %d: %s (%s)\n", user.ID, user.Name, user.Email)
    }
}

func createUser(db *sql.DB, name, email string) (int64, error) {
    result, err := db.Exec(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        name,
        email,
    )
    if err != nil {
        return 0, err
    }
    return result.LastInsertId()
}

func queryUsers(db *sql.DB) ([]User, error) {
    rows, err := db.Query("SELECT id, name, email FROM users")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }
    return users, rows.Err()
}
```

## 関連リンク

- [Go SDK リファレンス](./reference.md)
- [Turso 公式ドキュメント](https://docs.turso.tech)
