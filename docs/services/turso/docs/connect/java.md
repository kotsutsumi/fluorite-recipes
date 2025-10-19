# Turso - Javaで接続

Javaを使用してTursoに接続する方法を説明します。

## 重要な注意事項

現在、Turso Java バインディングはMaven Centralに公開されていません。ローカルビルドとMavenローカルへの公開が必要です。

## セットアップ手順

### 1. ローカルビルド

Turso GitHubリポジトリから Javaバインディングをビルドします：

#### Bashでのビルド例

```bash
cd bindings/java
make macos_x86
make publish_local
```

#### プラットフォーム別のビルドターゲット

利用可能なビルドターゲット：

- `macos_x86` - macOS Intel
- `macos_arm64` - macOS Apple Silicon
- `windows` - Windows
- `linux_x86` - Linux x86_64

使用しているプラットフォームに応じて適切なターゲットを選択してください。

### 2. 依存関係の設定

#### Gradleの場合

`build.gradle`または`build.gradle.kts`に以下を追加：

**Groovy DSL (build.gradle)**:
```gradle
repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation 'tech.turso:turso:0.0.1-SNAPSHOT'
}
```

**Kotlin DSL (build.gradle.kts)**:
```kotlin
repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation("tech.turso:turso:0.0.1-SNAPSHOT")
}
```

#### Mavenの場合

`pom.xml`に以下を追加：

```xml
<dependencies>
    <dependency>
        <groupId>tech.turso</groupId>
        <artifactId>turso</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </dependency>
</dependencies>
```

## 基本的な使用方法

### データベースへの接続

```java
import tech.turso.Turso;
import tech.turso.TursoClient;

public class Main {
    public static void main(String[] args) {
        // ローカルSQLiteデータベースに接続
        TursoClient client = Turso.connect("sqlite.db");
    }
}
```

### テーブルの作成

```java
client.execute(
    "CREATE TABLE IF NOT EXISTS users (" +
    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "  username TEXT NOT NULL" +
    ")"
);
```

### データの挿入

```java
client.execute("INSERT INTO users (username) VALUES ('alice')");
client.execute("INSERT INTO users (username) VALUES ('bob')");
```

### データのクエリ

```java
import tech.turso.ResultSet;

ResultSet result = client.query("SELECT * FROM users");
while (result.next()) {
    int id = result.getInt("id");
    String username = result.getString("username");
    System.out.println("User: " + id + " - " + username);
}
```

## 完全なコード例

```java
import tech.turso.Turso;
import tech.turso.TursoClient;
import tech.turso.ResultSet;

public class TursoExample {
    public static void main(String[] args) {
        try {
            // データベースに接続
            TursoClient client = Turso.connect("sqlite.db");

            // テーブルを作成
            client.execute(
                "CREATE TABLE IF NOT EXISTS users (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  username TEXT NOT NULL" +
                ")"
            );

            // データを挿入
            client.execute("INSERT INTO users (username) VALUES ('alice')");
            client.execute("INSERT INTO users (username) VALUES ('bob')");

            // データをクエリ
            ResultSet result = client.query("SELECT * FROM users");
            System.out.println("Users:");
            while (result.next()) {
                int id = result.getInt("id");
                String username = result.getString("username");
                System.out.println("  " + id + ": " + username);
            }

            // 接続を閉じる
            client.close();

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```java
import tech.turso.Turso;
import tech.turso.TursoClient;

public class TursoCloudExample {
    public static void main(String[] args) {
        String url = System.getenv("TURSO_DATABASE_URL");
        String token = System.getenv("TURSO_AUTH_TOKEN");

        TursoClient client = Turso.connect(url, token);

        // データベース操作
        ResultSet result = client.query("SELECT * FROM users");
        // ...

        client.close();
    }
}
```

## プリペアドステートメント

SQLインジェクション攻撃を防ぐため、プリペアドステートメントの使用を推奨します：

```java
String username = "alice";
client.execute(
    "INSERT INTO users (username) VALUES (?)",
    username
);

// 複数のパラメータ
client.execute(
    "INSERT INTO users (id, username) VALUES (?, ?)",
    1,
    "alice"
);
```

## トランザクション

複数の操作をアトミックに実行できます：

```java
try {
    client.beginTransaction();

    client.execute("INSERT INTO users (username) VALUES ('alice')");
    client.execute("INSERT INTO users (username) VALUES ('bob')");

    client.commit();
} catch (Exception e) {
    client.rollback();
    throw e;
}
```

または、try-with-resourcesパターンを使用：

```java
try (Transaction tx = client.transaction()) {
    tx.execute("INSERT INTO users (username) VALUES ('alice')");
    tx.execute("INSERT INTO users (username) VALUES ('bob')");
    tx.commit();
}
```

## エラーハンドリング

適切なエラーハンドリングを実装することを推奨します：

```java
import tech.turso.TursoException;

try {
    ResultSet result = client.query("SELECT * FROM users");
    // データを処理
} catch (TursoException e) {
    System.err.println("Database error: " + e.getMessage());
    e.printStackTrace();
} catch (Exception e) {
    System.err.println("Unexpected error: " + e.getMessage());
    e.printStackTrace();
}
```

## リソース管理

try-with-resourcesを使用して自動的にリソースを閉じることを推奨：

```java
try (TursoClient client = Turso.connect("sqlite.db")) {
    ResultSet result = client.query("SELECT * FROM users");
    while (result.next()) {
        System.out.println(result.getString("username"));
    }
} // clientは自動的に閉じられる
```

## ベストプラクティス

1. **try-with-resourcesを使用**: リソースリークを防ぐ
2. **プリペアドステートメントを使用**: SQLインジェクションを防ぐ
3. **トランザクションを使用**: 関連する操作をグループ化
4. **エラーハンドリング**: すべてのデータベース操作でエラーをキャッチ
5. **環境変数**: 認証情報をコードにハードコードしない

## 制限事項

- 現在、Maven Centralには公開されていません
- ローカルビルドが必要です
- SNAPSHOTバージョンのみ利用可能です

## 将来の計画

- Maven Centralへの公開
- 安定版リリース
- 追加機能の実装

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [Java Documentation](https://docs.oracle.com/en/java/)
