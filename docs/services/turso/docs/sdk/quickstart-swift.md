# Swift クイックスタート

TursoをSwiftで使用する方法を説明します。iOSおよびmacOSアプリケーションでTursoデータベースに接続できます。

## インストール

### Swift Package Manager

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/tursodatabase/libsql-swift", from: "0.1.0")
]
```

### Xcode

1. File > Add Packages...
2. URLに入力: `https://github.com/tursodatabase/libsql-swift`
3. "Add Package"をクリック

## データベースの作成

```bash
# Tursoデータベースを作成
turso db create swift-app

# 接続情報を取得
turso db show swift-app --url
turso db tokens create swift-app
```

## 基本的な使用方法

### 接続の作成

```swift
import LibSQL

let client = try LibSQLClient(
    url: "libsql://your-database.turso.io",
    authToken: "your-auth-token"
)
```

### テーブルの作成

```swift
func createTable() async throws {
    try await client.execute("""
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

```swift
func insertUser(name: String, email: String) async throws {
    try await client.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        parameters: [name, email]
    )
}

// 使用例
Task {
    try await insertUser(name: "Alice", email: "alice@example.com")
}
```

### データの取得

```swift
struct User: Codable {
    let id: Int
    let name: String
    let email: String
}

func getUsers() async throws -> [User] {
    let result = try await client.execute("SELECT * FROM users")

    return result.rows.map { row in
        User(
            id: row["id"] as! Int,
            name: row["name"] as! String,
            email: row["email"] as! String
        )
    }
}

// 使用例
Task {
    let users = try await getUsers()
    for user in users {
        print("User: \(user.name) - \(user.email)")
    }
}
```

### トランザクション

```swift
func transfer() async throws {
    try await client.transaction { tx in
        try await tx.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
        try await tx.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    }
}
```

## SwiftUIでの使用

### ViewModel

```swift
import SwiftUI
import LibSQL

@MainActor
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    private let client: LibSQLClient

    init() {
        self.client = try! LibSQLClient(
            url: "libsql://your-database.turso.io",
            authToken: "your-auth-token"
        )
    }

    func loadUsers() async {
        do {
            self.users = try await getUsers()
        } catch {
            print("Error loading users: \(error)")
        }
    }

    private func getUsers() async throws -> [User] {
        let result = try await client.execute("SELECT * FROM users")
        return result.rows.map { row in
            User(
                id: row["id"] as! Int,
                name: row["name"] as! String,
                email: row["email"] as! String
            )
        }
    }
}
```

### View

```swift
struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        List(viewModel.users, id: \.id) { user in
            VStack(alignment: .leading) {
                Text(user.name)
                    .font(.headline)
                Text(user.email)
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
        }
        .task {
            await viewModel.loadUsers()
        }
    }
}
```

## iOS アプリでの設定

### Info.plist

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>turso.io</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <false/>
        </dict>
    </dict>
</dict>
```

### 環境変数の使用

```swift
// Config.swift
enum Config {
    static let databaseURL = ProcessInfo.processInfo.environment["TURSO_DATABASE_URL"] ?? ""
    static let authToken = ProcessInfo.processInfo.environment["TURSO_AUTH_TOKEN"] ?? ""
}

// 使用例
let client = try LibSQLClient(
    url: Config.databaseURL,
    authToken: Config.authToken
)
```

## ベストプラクティス

### シングルトンパターン

```swift
class DatabaseManager {
    static let shared = DatabaseManager()

    private let client: LibSQLClient

    private init() {
        self.client = try! LibSQLClient(
            url: Config.databaseURL,
            authToken: Config.authToken
        )
    }

    func getClient() -> LibSQLClient {
        return client
    }
}

// 使用例
let client = DatabaseManager.shared.getClient()
```

### エラーハンドリング

```swift
func safeExecute(_ sql: String) async -> Result<Void, Error> {
    do {
        try await client.execute(sql)
        return .success(())
    } catch {
        return .failure(error)
    }
}

// 使用例
await safeExecute("SELECT * FROM users")
    .map { print("Success") }
    .mapError { print("Error: \($0)") }
```

### オフライン対応

```swift
import Network

class OfflineManager {
    private let monitor = NWPathMonitor()
    @Published var isConnected = true

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            self?.isConnected = path.status == .satisfied
        }
        monitor.start(queue: DispatchQueue.global())
    }

    func syncWhenOnline() async {
        guard isConnected else { return }
        // 同期処理
    }
}
```

## トラブルシューティング

### 接続エラー

```swift
do {
    try await client.execute("SELECT 1")
} catch {
    print("Connection error: \(error.localizedDescription)")
}
```

### デバッグログ

```swift
#if DEBUG
print("Executing SQL: \(sql)")
#endif
```

## 参考リンク

- [Swift SDK リファレンス](./swift-reference.md)
- [SwiftUIでの使用](./swift-swiftui.md)
- [Turso CLI](../cli/README.md)
- [SDK一覧](./README.md)

## サンプルプロジェクト

完全なサンプルプロジェクトは、Turso公式GitHubリポジトリを参照してください：
https://github.com/tursodatabase/examples
