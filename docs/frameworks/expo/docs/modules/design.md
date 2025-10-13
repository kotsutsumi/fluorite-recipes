# Expo Modulesのデザイン哲学

Expo Modulesの設計原則とアーキテクチャガイドラインを学びます。

## 概要

Expo Modules APIは、優れた開発者体験、型安全性、クロスプラットフォーム一貫性を重視して設計されています。

**主な設計目標**:
- モダンな言語機能の活用（Swift/Kotlin優先）
- 型安全性とコンパイル時検証
- 最小限のボイラープレート
- クロスプラットフォーム一貫性

## デザイン原則

### 1. モダンな言語の優先

**Swift（iOS）とKotlin（Android）を第一選択**として、Objective-CやJavaよりも優先します。

**Swift/Kotlinを選ぶ理由**：
```swift
// ✅ 推奨: Swift - 簡潔で型安全
public class SettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Settings")

    Function("getTheme") { () -> String in
      return UserDefaults.standard.string(forKey: "theme") ?? "light"
    }
  }
}
```

```objective-c
// ❌ 非推奨: Objective-C - 冗長
@implementation SettingsModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getTheme:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *theme = [[NSUserDefaults standardUserDefaults] stringForKey:@"theme"];
  if (theme) {
    resolve(theme);
  } else {
    resolve(@"light");
  }
}

@end
```

**主な利点**：
- **簡潔性**: 少ないコードで同じ機能を実現
- **型安全性**: コンパイル時の型チェック
- **モダンな構文**: クロージャ、ジェネリクス、null安全性
- **メンテナンス性**: より読みやすく、保守しやすいコード

### 2. ランタイム間のデータ受け渡し

JavaScriptとネイティブコード間で効率的にデータを受け渡します。

**基本型のマッピング**：

| JavaScript | Swift | Kotlin |
|------------|-------|--------|
| string | String | String |
| number | Double/Int | Double/Int |
| boolean | Bool | Boolean |
| null/undefined | nil | null |
| array | [Any] | List<Any> |
| object | [String: Any] | Map<String, Any> |

**例: 複雑なデータ構造**

```swift
// Swift: Record型の定義
Record("User") {
  Field("id") { String.self }
  Field("name") { String.self }
  Field("age") { Int.self }
  Field("email") { String?.self }
}

Function("createUser") { (user: [String: Any]) -> String in
  let id = user["id"] as? String ?? ""
  let name = user["name"] as? String ?? ""
  let age = user["age"] as? Int ?? 0

  // ユーザーを作成
  return "User created: \(name)"
}
```

```typescript
// TypeScript: 対応する型定義
interface User {
  id: string;
  name: string;
  age: number;
  email?: string;
}

// 使用例
const result = await MyModule.createUser({
  id: '123',
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
});
```

**ベストプラクティス**：
- **型定義を共有**: TypeScript型とネイティブRecord型を一致させる
- **null/undefined処理**: オプショナル型を適切に使用
- **バリデーション**: 境界でデータを検証
- **シリアライゼーション**: 複雑なオブジェクトは明示的に変換

### 3. オブジェクト指向API設計

**一貫性のあるAPIパターン**で、予測可能で使いやすいインターフェースを提供します。

#### シンプルな関数API

```swift
public class MathModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Math")

    // 同期関数
    Function("add") { (a: Double, b: Double) -> Double in
      return a + b
    }

    // 非同期関数
    AsyncFunction("complexCalculation") { (input: Double) -> Double in
      // 非同期処理
      await Task.sleep(1_000_000_000) // 1秒
      return input * 2
    }
  }
}
```

```typescript
// TypeScript
import * as Math from 'expo-math';

// 同期呼び出し
const sum = Math.add(5, 3); // 8

// 非同期呼び出し
const result = await Math.complexCalculation(10); // 20
```

#### イベント駆動API

```swift
public class SensorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Sensor")

    Events("onDataReceived", "onError")

    Function("startListening") {
      // センサーデータを定期的に送信
      Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
        self.sendEvent("onDataReceived", [
          "value": Double.random(in: 0...100),
          "timestamp": Date().timeIntervalSince1970
        ])
      }
    }
  }
}
```

```typescript
// TypeScript
import { Sensor } from 'expo-sensor';

Sensor.addListener('onDataReceived', (event) => {
  console.log('Sensor data:', event.value);
});

Sensor.startListening();
```

#### ビューコンポーネントAPI

```swift
public class WebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WebView")

    View(ExpoWebView.self) {
      Events("onLoad", "onError")

      Prop("url") { (view, url: String) in
        if let url = URL(string: url) {
          view.webView.load(URLRequest(url: url))
        }
      }

      Prop("backgroundColor") { (view, color: UIColor) in
        view.webView.backgroundColor = color
      }
    }
  }
}
```

```typescript
// TypeScript
import { WebView } from 'expo-webview';

<WebView
  url="https://example.com"
  backgroundColor="#ffffff"
  onLoad={(event) => console.log('Loaded:', event.url)}
/>
```

### 4. アプリライフサイクルとの統合

**システムイベントにフック**して、アプリのライフサイクルと適切に統合します。

#### iOS AppDelegate Subscribers

```swift
public class AnalyticsSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // アプリ起動時に分析を初期化
    Analytics.initialize()
    return true
  }

  public func applicationDidBecomeActive(_ application: UIApplication) {
    // アクティブ時のトラッキング
    Analytics.trackEvent("app_active")
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    // バックグラウンド時の処理
    Analytics.trackEvent("app_background")
  }
}
```

#### Android Lifecycle Listeners

```kotlin
class AnalyticsActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    // アプリ起動時に分析を初期化
    Analytics.initialize()
  }

  override fun onResume(activity: Activity?) {
    // 再開時のトラッキング
    Analytics.trackEvent("app_active")
  }

  override fun onPause(activity: Activity?) {
    // 一時停止時の処理
    Analytics.trackEvent("app_background")
  }
}
```

**登録**:
```json
{
  "apple": {
    "appDelegateSubscribers": ["AnalyticsSubscriber"]
  },
  "android": {
    "reactActivityLifecycleListeners": ["com.example.AnalyticsActivityLifecycleListener"]
  }
}
```

### 5. アーキテクチャ互換性

**既存のアーキテクチャパターンと統合**できるように設計します。

#### MVVM統合

```swift
// ViewModel
class ThemeViewModel {
  @Published var currentTheme: String = "light"

  func updateTheme(_ theme: String) {
    currentTheme = theme
    // ネイティブモジュールに保存
    SettingsModule.shared.setTheme(theme)
  }
}

// Expo Module
public class SettingsModule: Module {
  static let shared = SettingsModule()

  public func definition() -> ModuleDefinition {
    Name("Settings")

    Function("setTheme") { (theme: String) in
      UserDefaults.standard.set(theme, forKey: "theme")
      NotificationCenter.default.post(
        name: .themeChanged,
        object: theme
      )
    }
  }
}
```

#### Repository Pattern統合

```kotlin
// Repository
class UserRepository(private val userModule: UserModule) {
  suspend fun getCurrentUser(): User? {
    return userModule.getCurrentUser()
  }

  suspend fun updateUser(user: User) {
    userModule.updateUser(user)
  }
}

// Expo Module
class UserModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("User")

    AsyncFunction("getCurrentUser") {
      // データベースからユーザーを取得
      return@AsyncFunction mapOf(
        "id" to "123",
        "name" to "Alice"
      )
    }

    AsyncFunction("updateUser") { user: Map<String, Any> ->
      // ユーザーを更新
    }
  }
}
```

## 設計パターン

### 1. シングルトンパターン

**用途**: グローバル状態やリソース管理

```swift
public class DatabaseModule: Module {
  static let shared = DatabaseModule()
  private var database: Database?

  public func definition() -> ModuleDefinition {
    Name("Database")

    OnCreate {
      database = Database.create()
    }

    OnDestroy {
      database?.close()
    }

    Function("query") { (sql: String) -> [[String: Any]] in
      return database?.execute(sql) ?? []
    }
  }
}
```

### 2. Observerパターン

**用途**: イベントベースの通信

```swift
public class NotificationModule: Module {
  private var observers: [String: [EventDispatcher]] = [:]

  public func definition() -> ModuleDefinition {
    Name("Notification")

    Events("onNotificationReceived")

    Function("subscribe") { (channel: String) in
      NotificationCenter.default.addObserver(
        forName: Notification.Name(channel),
        object: nil,
        queue: .main
      ) { notification in
        self.sendEvent("onNotificationReceived", [
          "channel": channel,
          "data": notification.userInfo
        ])
      }
    }
  }
}
```

### 3. Factoryパターン

**用途**: 複雑なオブジェクト生成

```swift
public class ViewFactory {
  static func createWebView(url: String) -> ExpoWebView {
    let webView = ExpoWebView()
    webView.loadURL(url)
    return webView
  }

  static func createMapView(region: MapRegion) -> ExpoMapView {
    let mapView = ExpoMapView()
    mapView.setRegion(region)
    return mapView
  }
}

public class ViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ViewFactory")

    View(ExpoWebView.self) {
      Prop("url") { (view, url: String) in
        view.loadURL(url)
      }
    }

    View(ExpoMapView.self) {
      Prop("region") { (view, region: [String: Double]) in
        view.setRegion(MapRegion(from: region))
      }
    }
  }
}
```

## パフォーマンスの考慮事項

### 1. 効率的なデータシリアライゼーション

```swift
// ✅ 推奨: 必要なデータのみを送信
Function("getUserSummary") { (userId: String) -> [String: Any] in
  let user = database.getUser(userId)
  return [
    "id": user.id,
    "name": user.name,
    "avatar": user.avatarURL
  ]
}

// ❌ 非推奨: 不要なデータを含む
Function("getUser") { (userId: String) -> [String: Any] in
  let user = database.getUser(userId)
  return user.allProperties // 大量のデータ
}
```

### 2. 非同期処理の適切な使用

```swift
// ✅ 推奨: 重い処理は非同期で
AsyncFunction("processImage") { (imageData: Data) -> String in
  return await Task.detached {
    let processedImage = ImageProcessor.process(imageData)
    return processedImage.save()
  }.value
}

// ❌ 非推奨: 重い処理を同期で実行
Function("processImage") { (imageData: Data) -> String in
  let processedImage = ImageProcessor.process(imageData) // UIをブロック
  return processedImage.save()
}
```

### 3. メモリ管理

```swift
public class CacheModule: Module {
  private var cache: NSCache<NSString, AnyObject> = {
    let cache = NSCache<NSString, AnyObject>()
    cache.countLimit = 100
    cache.totalCostLimit = 10 * 1024 * 1024 // 10MB
    return cache
  }()

  public func definition() -> ModuleDefinition {
    Name("Cache")

    OnDestroy {
      cache.removeAllObjects()
    }

    Function("set") { (key: String, value: Any) in
      cache.setObject(value as AnyObject, forKey: key as NSString)
    }

    Function("get") { (key: String) -> Any? in
      return cache.object(forKey: key as NSString)
    }
  }
}
```

## セキュリティのベストプラクティス

### 1. 入力検証

```swift
Function("processUserInput") { (input: String) -> String in
  // バリデーション
  guard !input.isEmpty else {
    throw InputValidationException("Input cannot be empty")
  }

  guard input.count <= 1000 else {
    throw InputValidationException("Input too long")
  }

  // サニタイゼーション
  let sanitized = input.trimmingCharacters(in: .whitespacesAndNewlines)

  return process(sanitized)
}
```

### 2. 安全なストレージ

```swift
import Security

public class SecureStorageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SecureStorage")

    AsyncFunction("save") { (key: String, value: String) in
      let data = value.data(using: .utf8)!
      let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: key,
        kSecValueData as String: data
      ]

      SecItemDelete(query as CFDictionary)
      let status = SecItemAdd(query as CFDictionary, nil)

      guard status == errSecSuccess else {
        throw StorageException("Failed to save")
      }
    }

    AsyncFunction("get") { (key: String) -> String? in
      let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: key,
        kSecReturnData as String: true
      ]

      var result: AnyObject?
      let status = SecItemCopyMatching(query as CFDictionary, &result)

      guard status == errSecSuccess,
            let data = result as? Data,
            let value = String(data: data, encoding: .utf8) else {
        return nil
      }

      return value
    }
  }
}
```

### 3. パーミッション処理

```swift
AsyncFunction("requestCameraPermission") { () -> Bool in
  let status = await AVCaptureDevice.requestAccess(for: .video)
  return status
}

Function("checkCameraPermission") { () -> String in
  let status = AVCaptureDevice.authorizationStatus(for: .video)

  switch status {
  case .authorized:
    return "granted"
  case .denied, .restricted:
    return "denied"
  case .notDetermined:
    return "undetermined"
  @unknown default:
    return "unknown"
  }
}
```

## テスタビリティ

### 1. 依存性注入

```swift
protocol DatabaseProtocol {
  func query(_ sql: String) -> [[String: Any]]
}

public class UserModule: Module {
  private let database: DatabaseProtocol

  init(database: DatabaseProtocol = RealDatabase()) {
    self.database = database
  }

  public func definition() -> ModuleDefinition {
    Name("User")

    Function("getUsers") { () -> [[String: Any]] in
      return database.query("SELECT * FROM users")
    }
  }
}

// テスト
class MockDatabase: DatabaseProtocol {
  func query(_ sql: String) -> [[String: Any]] {
    return [["id": "1", "name": "Test User"]]
  }
}

let module = UserModule(database: MockDatabase())
```

### 2. モック可能なAPI

```swift
public class NetworkModule: Module {
  var urlSession: URLSession = .shared

  public func definition() -> ModuleDefinition {
    Name("Network")

    AsyncFunction("fetch") { (url: String) -> [String: Any] in
      let (data, _) = try await urlSession.data(from: URL(string: url)!)
      return try JSONSerialization.jsonObject(with: data) as! [String: Any]
    }
  }
}

// テスト用のモック
class MockURLProtocol: URLProtocol {
  static var mockData: Data?

  override class func canInit(with request: URLRequest) -> Bool {
    return true
  }

  override class func canonicalRequest(for request: URLRequest) -> URLRequest {
    return request
  }

  override func startLoading() {
    if let data = MockURLProtocol.mockData {
      client?.urlProtocol(self, didLoad: data)
    }
    client?.urlProtocolDidFinishLoading(self)
  }

  override func stopLoading() {}
}
```

## ドキュメント化

### 1. コードコメント

```swift
/// ユーザー認証を管理するモジュール
///
/// このモジュールは、ユーザーのログイン、ログアウト、セッション管理を提供します。
public class AuthModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Auth")

    /// ユーザーをログインさせる
    ///
    /// - Parameters:
    ///   - email: ユーザーのメールアドレス
    ///   - password: ユーザーのパスワード
    /// - Returns: 認証トークン
    /// - Throws: `AuthException` 認証に失敗した場合
    AsyncFunction("login") { (email: String, password: String) -> String in
      guard isValidEmail(email) else {
        throw AuthException("Invalid email format")
      }

      guard password.count >= 8 else {
        throw AuthException("Password too short")
      }

      let token = try await authenticateUser(email: email, password: password)
      return token
    }
  }
}
```

### 2. TypeScript型定義

```typescript
/**
 * ユーザー認証モジュール
 */
export interface AuthModule {
  /**
   * ユーザーをログインさせる
   * @param email - ユーザーのメールアドレス
   * @param password - ユーザーのパスワード
   * @returns 認証トークンのPromise
   * @throws {Error} 認証に失敗した場合
   */
  login(email: string, password: string): Promise<string>;

  /**
   * ユーザーをログアウトさせる
   */
  logout(): void;

  /**
   * 現在のユーザーセッションを取得
   * @returns ユーザーセッション情報、またはnull
   */
  getCurrentSession(): Promise<UserSession | null>;
}

export interface UserSession {
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
}
```

## まとめ

Expo Modulesの設計哲学は、以下の原則に基づいています：

### 言語とツール
- **モダンな言語優先**: Swift/Kotlinを第一選択
- **型安全性**: コンパイル時検証と型推論
- **最小限のボイラープレート**: 簡潔な記述で最大の機能

### データとAPI
- **効率的なデータ受け渡し**: JavaScript ⇄ ネイティブ間の最適化
- **一貫性のあるAPI**: 予測可能で使いやすいインターフェース
- **イベント駆動**: リアルタイム通信とリアクティブパターン

### アーキテクチャ
- **ライフサイクル統合**: システムイベントとの適切な統合
- **既存パターンとの互換性**: MVVM、Repository等との連携
- **設計パターン活用**: Singleton、Observer、Factory等

### 品質
- **パフォーマンス**: 非同期処理とメモリ管理
- **セキュリティ**: 入力検証、安全なストレージ、パーミッション
- **テスタビリティ**: 依存性注入とモック可能な設計
- **ドキュメント**: コードコメントと型定義

これらの原則に従うことで、保守性が高く、パフォーマンスに優れ、セキュアなExpo Modulesを構築できます。
