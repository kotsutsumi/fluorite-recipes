# C クイックスタート

TursoをC言語で使用する方法を説明します。libsql CライブラリでTursoデータベースに接続できます。

## インストール

### ソースからビルド

```bash
# libsqlをクローン
git clone https://github.com/tursodatabase/libsql
cd libsql

# ビルド
mkdir build && cd build
cmake ..
make
sudo make install
```

### pkg-config

```bash
# インストール後
pkg-config --cflags --libs libsql
```

## データベースの作成

```bash
# Tursoデータベースを作成
turso db create c-app

# 接続情報を取得
turso db show c-app --url
turso db tokens create c-app
```

## 基本的な使用方法

### プログラムの作成

```c
// main.c
#include <stdio.h>
#include <libsql.h>

int main() {
    libsql_database_t db;
    libsql_connection_t conn;
    libsql_result_t result;

    // データベースに接続
    const char *url = "libsql://your-database.turso.io";
    const char *auth_token = "your-auth-token";

    int rc = libsql_open_remote(url, auth_token, &db);
    if (rc != LIBSQL_OK) {
        fprintf(stderr, "Failed to open database: %s\n", libsql_error_message(db));
        return 1;
    }

    // コネクションを作成
    rc = libsql_database_connect(db, &conn);
    if (rc != LIBSQL_OK) {
        fprintf(stderr, "Failed to create connection\n");
        return 1;
    }

    // クエリを実行
    rc = libsql_execute(conn, "SELECT 1", &result);
    if (rc == LIBSQL_OK) {
        printf("Query executed successfully\n");
        libsql_free_result(result);
    }

    // クリーンアップ
    libsql_disconnect(conn);
    libsql_close(db);

    return 0;
}
```

### コンパイル

```bash
# GCC
gcc -o app main.c $(pkg-config --cflags --libs libsql)

# または直接指定
gcc -o app main.c -llibsql

# 実行
./app
```

## テーブルの作成

```c
int create_table(libsql_connection_t conn) {
    const char *sql =
        "CREATE TABLE IF NOT EXISTS users ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  name TEXT NOT NULL,"
        "  email TEXT NOT NULL UNIQUE"
        ")";

    libsql_result_t result;
    int rc = libsql_execute(conn, sql, &result);

    if (rc == LIBSQL_OK) {
        libsql_free_result(result);
        return 0;
    }

    return -1;
}
```

## データの挿入

```c
int insert_user(libsql_connection_t conn, const char *name, const char *email) {
    libsql_statement_t stmt;
    int rc;

    // プリペアドステートメントを作成
    rc = libsql_prepare(conn, "INSERT INTO users (name, email) VALUES (?, ?)", &stmt);
    if (rc != LIBSQL_OK) {
        return -1;
    }

    // パラメータをバインド
    libsql_bind_text(stmt, 1, name, -1, LIBSQL_STATIC);
    libsql_bind_text(stmt, 2, email, -1, LIBSQL_STATIC);

    // 実行
    libsql_result_t result;
    rc = libsql_query(stmt, &result);

    // クリーンアップ
    libsql_free_result(result);
    libsql_finalize(stmt);

    return (rc == LIBSQL_OK) ? 0 : -1;
}

// 使用例
insert_user(conn, "Alice", "alice@example.com");
```

## データの取得

```c
typedef struct {
    int id;
    char name[256];
    char email[256];
} User;

int get_users(libsql_connection_t conn, User *users, int max_users) {
    libsql_statement_t stmt;
    libsql_result_t result;
    int rc;

    rc = libsql_prepare(conn, "SELECT id, name, email FROM users", &stmt);
    if (rc != LIBSQL_OK) {
        return -1;
    }

    rc = libsql_query(stmt, &result);
    if (rc != LIBSQL_OK) {
        libsql_finalize(stmt);
        return -1;
    }

    int count = 0;
    libsql_row_t row;
    while (libsql_next_row(result, &row) == LIBSQL_OK && count < max_users) {
        users[count].id = libsql_column_int(row, 0);
        strncpy(users[count].name, libsql_column_text(row, 1), 255);
        strncpy(users[count].email, libsql_column_text(row, 2), 255);
        count++;
    }

    libsql_free_result(result);
    libsql_finalize(stmt);

    return count;
}

// 使用例
User users[100];
int user_count = get_users(conn, users, 100);

for (int i = 0; i < user_count; i++) {
    printf("User %d: %s <%s>\n", users[i].id, users[i].name, users[i].email);
}
```

## トランザクション

```c
int transfer_money(libsql_connection_t conn, int from_id, int to_id, int amount) {
    libsql_result_t result;
    int rc;

    // トランザクション開始
    rc = libsql_execute(conn, "BEGIN TRANSACTION", &result);
    if (rc != LIBSQL_OK) {
        return -1;
    }
    libsql_free_result(result);

    // 送金元から引き出し
    char sql1[256];
    snprintf(sql1, sizeof(sql1),
             "UPDATE accounts SET balance = balance - %d WHERE id = %d",
             amount, from_id);

    rc = libsql_execute(conn, sql1, &result);
    if (rc != LIBSQL_OK) {
        libsql_execute(conn, "ROLLBACK", &result);
        return -1;
    }
    libsql_free_result(result);

    // 送金先に追加
    char sql2[256];
    snprintf(sql2, sizeof(sql2),
             "UPDATE accounts SET balance = balance + %d WHERE id = %d",
             amount, to_id);

    rc = libsql_execute(conn, sql2, &result);
    if (rc != LIBSQL_OK) {
        libsql_execute(conn, "ROLLBACK", &result);
        return -1;
    }
    libsql_free_result(result);

    // コミット
    rc = libsql_execute(conn, "COMMIT", &result);
    libsql_free_result(result);

    return (rc == LIBSQL_OK) ? 0 : -1;
}
```

## エラーハンドリング

```c
void print_error(libsql_database_t db) {
    fprintf(stderr, "Error: %s\n", libsql_error_message(db));
}

int safe_execute(libsql_connection_t conn, const char *sql) {
    libsql_result_t result;
    int rc = libsql_execute(conn, sql, &result);

    if (rc == LIBSQL_OK) {
        libsql_free_result(result);
        return 0;
    } else {
        fprintf(stderr, "SQL error: %s\n", sql);
        return -1;
    }
}
```

## メモリ管理

```c
// 必ずリソースを解放する
void cleanup(libsql_connection_t conn, libsql_database_t db,
             libsql_result_t result, libsql_statement_t stmt) {
    if (result) libsql_free_result(result);
    if (stmt) libsql_finalize(stmt);
    if (conn) libsql_disconnect(conn);
    if (db) libsql_close(db);
}
```

## Makefile の例

```makefile
# Makefile
CC = gcc
CFLAGS = -Wall -Wextra $(shell pkg-config --cflags libsql)
LDFLAGS = $(shell pkg-config --libs libsql)

TARGET = app
SOURCES = main.c
OBJECTS = $(SOURCES:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) -o $@ $^ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

.PHONY: all clean
```

## ベストプラクティス

### 1. エラーチェック

```c
#define CHECK_RC(rc, msg) \
    if (rc != LIBSQL_OK) { \
        fprintf(stderr, "%s\n", msg); \
        return -1; \
    }

// 使用例
int rc = libsql_execute(conn, sql, &result);
CHECK_RC(rc, "Failed to execute query");
```

### 2. リソース管理

```c
// RAIIスタイルのクリーンアップ（GCC拡張）
void cleanup_connection(libsql_connection_t *conn) {
    if (*conn) libsql_disconnect(*conn);
}

#define auto_cleanup __attribute__((cleanup(cleanup_connection)))

void function() {
    auto_cleanup libsql_connection_t conn = NULL;
    // connは関数終了時に自動的にクリーンアップされる
}
```

## 参考リンク

- [C SDK リファレンス](./c-reference.md)
- [libsql GitHub](https://github.com/tursodatabase/libsql)
- [Turso CLI](../cli/README.md)
- [SDK一覧](./README.md)

## サンプルプロジェクト

完全なサンプルプロジェクトは、Turso公式GitHubリポジトリを参照してください：
https://github.com/tursodatabase/examples
