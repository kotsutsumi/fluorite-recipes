# Kotlin クイックスタート

TursoをKotlinで使用する方法を説明します。

## インストール

### Gradle（Kotlin DSL）

```kotlin
// build.gradle.kts
dependencies {
    implementation("tech.turso:libsql:0.1.0") // 最新バージョンを確認
}
```

### Maven

```xml
<!-- pom.xml -->
<dependency>
    <groupId>tech.turso</groupId>
    <artifactId>libsql</artifactId>
    <version>0.1.0</version>
</dependency>
```

## データベースの作成

```bash
# Tursoデータベースを作成
turso db create kotlin-app

# 接続情報を取得
turso db show kotlin-app --url
turso db tokens create kotlin-app
```

## 基本的な使用方法

### 接続の作成

```kotlin
import tech.turso.libsql.LibsqlClient

fun main() {
    val client = LibsqlClient(
        url = "libsql://your-database.turso.io",
        authToken = "your-auth-token"
    )

    // 使用例
    val result = client.execute("SELECT 1")
    println(result)

    client.close()
}
```

### テーブルの作成

```kotlin
fun createTable(client: LibsqlClient) {
    client.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
}
```

### データの挿入

```kotlin
fun insertUser(client: LibsqlClient, name: String, email: String) {
    client.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        listOf(name, email)
    )
}

// 使用例
insertUser(client, "Alice", "alice@example.com")
```

### データの取得

```kotlin
fun getUsers(client: LibsqlClient): List<User> {
    val result = client.execute("SELECT * FROM users")
    return result.rows.map { row ->
        User(
            id = row.getInt("id"),
            name = row.getString("name"),
            email = row.getString("email")
        )
    }
}

data class User(
    val id: Int,
    val name: String,
    val email: String
)
```

### トランザクション

```kotlin
fun transferWithTransaction(client: LibsqlClient) {
    client.transaction { tx ->
        tx.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
        tx.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    }
}
```

## Android での使用

### build.gradle.kts

```kotlin
android {
    // ...
}

dependencies {
    implementation("tech.turso:libsql-android:0.1.0")
}
```

### AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 使用例

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var client: LibsqlClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        client = LibsqlClient(
            url = BuildConfig.TURSO_DATABASE_URL,
            authToken = BuildConfig.TURSO_AUTH_TOKEN
        )

        // データの取得
        lifecycleScope.launch {
            val users = getUsers(client)
            // UIを更新
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        client.close()
    }
}
```

## ベストプラクティス

### 環境変数の使用

```kotlin
// build.gradle.kts
android {
    defaultConfig {
        buildConfigField("String", "TURSO_DATABASE_URL", "\"${System.getenv("TURSO_DATABASE_URL")}\"")
        buildConfigField("String", "TURSO_AUTH_TOKEN", "\"${System.getenv("TURSO_AUTH_TOKEN")}\"")
    }
}
```

### コネクションプーリング

```kotlin
object DatabasePool {
    private val pool = mutableListOf<LibsqlClient>()

    fun getClient(): LibsqlClient {
        return pool.removeFirstOrNull() ?: LibsqlClient(
            url = Config.TURSO_DATABASE_URL,
            authToken = Config.TURSO_AUTH_TOKEN
        )
    }

    fun returnClient(client: LibsqlClient) {
        pool.add(client)
    }
}
```

## エラーハンドリング

```kotlin
fun safeExecute(client: LibsqlClient, sql: String): Result<Unit> {
    return try {
        client.execute(sql)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// 使用例
safeExecute(client, "SELECT * FROM users")
    .onSuccess { println("Success") }
    .onFailure { e -> println("Error: ${e.message}") }
```

## 参考リンク

- [Kotlin SDK リファレンス](./kotlin-reference.md)
- [Android での使用](./kotlin-android.md)
- [Turso CLI](../cli/README.md)
- [SDK一覧](./README.md)

## サンプルプロジェクト

完全なサンプルプロジェクトは、Turso公式GitHubリポジトリを参照してください：
https://github.com/tursodatabase/examples
