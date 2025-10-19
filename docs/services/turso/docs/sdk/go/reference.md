# Go SDK リファレンス - Turso

libSQL Go SDK の完全なリファレンスドキュメントです。

## インストール

```bash
go get github.com/tursodatabase/go-libsql
```

## 組み込みレプリカ

### 基本的な設定

```go
import (
    "database/sql"
    _ "github.com/tursodatabase/go-libsql"
    "github.com/tursodatabase/go-libsql"
)

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
```

## 設定オプション

### 認証トークン

```go
connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
)
```

### 手動同期

```go
if err := connector.Sync(); err != nil {
    log.Printf("Sync failed: %v", err)
}
```

### 定期同期

```go
import "time"

connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
    libsql.WithSyncInterval(time.Minute), // 1分ごとに同期
)
```

### Read-Your-Writes 一貫性

```go
connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
    libsql.WithReadYourWrites(true),
)
```

### 暗号化

```go
encryptionKey := os.Getenv("ENCRYPTION_KEY")

connector, err := libsql.NewEmbeddedReplicaConnector(
    dbPath,
    primaryUrl,
    libsql.WithAuthToken(authToken),
    libsql.WithEncryption(encryptionKey),
)
```

**注意**: 暗号化されたデータベースは標準の SQLite ファイルとして読み取ることはできません。

## database/sql パッケージの使用

### クエリの実行

```go
// 単一行
var name string
err := db.QueryRow("SELECT name FROM users WHERE id = ?", 1).Scan(&name)
if err != nil {
    if err == sql.ErrNoRows {
        fmt.Println("User not found")
    } else {
        log.Fatal(err)
    }
}

// 複数行
rows, err := db.Query("SELECT id, name FROM users")
if err != nil {
    log.Fatal(err)
}
defer rows.Close()

for rows.Next() {
    var id int
    var name string
    if err := rows.Scan(&id, &name); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("ID: %d, Name: %s\n", id, name)
}
```

### データの挿入

```go
result, err := db.Exec(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    "Alice",
    "alice@example.com",
)
if err != nil {
    log.Fatal(err)
}

// 挿入されたIDを取得
lastID, err := result.LastInsertId()
if err != nil {
    log.Fatal(err)
}

// 影響を受けた行数を取得
rowsAffected, err := result.RowsAffected()
if err != nil {
    log.Fatal(err)
}
```

### プリペアドステートメント

```go
stmt, err := db.Prepare("SELECT name, email FROM users WHERE id = ?")
if err != nil {
    log.Fatal(err)
}
defer stmt.Close()

var name, email string
err = stmt.QueryRow(1).Scan(&name, &email)
if err != nil {
    log.Fatal(err)
}
```

### トランザクション

```go
tx, err := db.Begin()
if err != nil {
    log.Fatal(err)
}
defer tx.Rollback() // エラー時に自動ロールバック

_, err = tx.Exec("INSERT INTO users (name) VALUES (?)", "Bob")
if err != nil {
    log.Fatal(err)
}

_, err = tx.Exec("UPDATE stats SET count = count + 1")
if err != nil {
    log.Fatal(err)
}

if err := tx.Commit(); err != nil {
    log.Fatal(err)
}
```

## エラーハンドリング

```go
import (
    "database/sql"
    "errors"
)

func getUser(db *sql.DB, id int) (*User, error) {
    var user User
    err := db.QueryRow(
        "SELECT id, name, email FROM users WHERE id = ?",
        id,
    ).Scan(&user.ID, &user.Name, &user.Email)

    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("user with id %d not found", id)
        }
        return nil, fmt.Errorf("query failed: %w", err)
    }

    return &user, nil
}
```

## ベストプラクティス

### 接続プール

```go
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
db.SetConnMaxIdleTime(10 * time.Minute)
```

### コンテキストの使用

```go
import "context"

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

rows, err := db.QueryContext(ctx, "SELECT * FROM users")
if err != nil {
    log.Fatal(err)
}
defer rows.Close()
```

### 構造体スキャン

```go
type User struct {
    ID        int
    Name      string
    Email     string
    CreatedAt time.Time
}

func scanUser(rows *sql.Rows) (*User, error) {
    var user User
    err := rows.Scan(
        &user.ID,
        &user.Name,
        &user.Email,
        &user.CreatedAt,
    )
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

## 関連リンク

- [Go SDK クイックスタート](./quickstart.md)
- [Go database/sql ドキュメント](https://pkg.go.dev/database/sql)
- [Turso 公式ドキュメント](https://docs.turso.tech)
