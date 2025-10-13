# iOS AppDelegate Subscribers

Expo ModulesでiOS AppDelegate Subscribersを使用する方法を学びます。

## 概要

AppDelegate Subscribersは、ライブラリがiOSシステムイベントにフックできるようにします。

**前提条件**: アプリの`AppDelegate`は`ExpoAppDelegate`を継承する必要があります

**主な利点**：
- セットアップとメンテナンスの簡素化
- 複数のモジュールによるイベント処理
- システムイベントへの統一されたアクセス

## AppDelegate Subscriberの実装

### ステップ1: Subscriberクラスの作成

```swift
// ios/MyAppDelegateSubscriber.swift
import ExpoModulesCore
import UIKit

public class MyAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    print("App finished launching")
    return true
  }

  public func applicationDidBecomeActive(_ application: UIApplication) {
    print("App became active")
  }

  public func applicationWillResignActive(_ application: UIApplication) {
    print("App will resign active")
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    print("App entered background")
  }

  public func applicationWillEnterForeground(_ application: UIApplication) {
    print("App will enter foreground")
  }

  public func applicationWillTerminate(_ application: UIApplication) {
    print("App will terminate")
  }
}
```

### ステップ2: expo-module.config.jsonへの登録

```json
{
  "apple": {
    "modules": ["MyModule"],
    "appDelegateSubscribers": ["MyAppDelegateSubscriber"]
  }
}
```

## サポートされるDelegate Methods

### アプリケーションライフサイクル

```swift
public class LifecycleSubscriber: ExpoAppDelegateSubscriber {
  // アプリ起動時
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // 初期化処理
    return true
  }

  // アクティブになった時
  public func applicationDidBecomeActive(_ application: UIApplication) {
    // アクティブ状態の処理
  }

  // アクティブでなくなる時
  public func applicationWillResignActive(_ application: UIApplication) {
    // 非アクティブ状態の処理
  }

  // バックグラウンドに入った時
  public func applicationDidEnterBackground(_ application: UIApplication) {
    // バックグラウンド処理
  }

  // フォアグラウンドに戻る時
  public func applicationWillEnterForeground(_ application: UIApplication) {
    // フォアグラウンド復帰処理
  }

  // アプリ終了時
  public func applicationWillTerminate(_ application: UIApplication) {
    // クリーンアップ処理
  }
}
```

### URLスキーム処理

```swift
public class URLSchemeSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    print("URL opened: \(url.absoluteString)")

    // URLスキームを処理
    if url.scheme == "myapp" {
      handleDeepLink(url)
      return true
    }

    return false
  }

  private func handleDeepLink(_ url: URL) {
    // ディープリンク処理
  }
}
```

### ユニバーサルリンク処理

```swift
public class UniversalLinksSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
      return false
    }

    print("Universal link: \(url.absoluteString)")

    // ユニバーサルリンクを処理
    handleUniversalLink(url)
    return true
  }

  private func handleUniversalLink(_ url: URL) {
    // ユニバーサルリンク処理
  }
}
```

### リモート通知処理

```swift
public class PushNotificationSubscriber: ExpoAppDelegateSubscriber {
  // デバイストークン受信
  public func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("Device token: \(token)")

    // デバイストークンをサーバーに送信
    sendTokenToServer(token)
  }

  // 登録失敗
  public func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("Failed to register: \(error.localizedDescription)")
  }

  // リモート通知受信
  public func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    print("Remote notification received")

    // 通知を処理
    handleRemoteNotification(userInfo) { result in
      completionHandler(result)
    }
  }

  private func sendTokenToServer(_ token: String) {
    // サーバーにトークンを送信
  }

  private func handleRemoteNotification(
    _ userInfo: [AnyHashable: Any],
    completion: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    // 通知処理
    completion(.newData)
  }
}
```

## 結果の調整（Result Reconciliation）

### didFinishLaunchingWithOptions

複数のSubscriberが`didFinishLaunchingWithOptions`を実装している場合、すべての結果が`AND`演算されます。

```swift
// Subscriber 1
public func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
  return true // 成功
}

// Subscriber 2
public func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
  return false // 失敗
}

// 最終結果: false（いずれかがfalseを返すと全体がfalse）
```

### リモート通知の結果集約

リモート通知処理の結果は、優先度に基づいて集約されます：

1. **Failed**: 最優先（エラーが発生）
2. **NewData**: 次の優先度（新しいデータを受信）
3. **NoData**: デフォルト（データなし）

```swift
// Subscriber 1
completion(.newData)

// Subscriber 2
completion(.noData)

// 最終結果: .newData（高優先度が選択される）
```

## 実践例

### 例1: アプリ状態トラッカー

```swift
import ExpoModulesCore
import UIKit

public class AppStateTrackerSubscriber: ExpoAppDelegateSubscriber {
  private weak var module: AppStateTrackerModule?

  public init(module: AppStateTrackerModule) {
    self.module = module
  }

  public func applicationDidBecomeActive(_ application: UIApplication) {
    module?.sendAppStateEvent("active")
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    module?.sendAppStateEvent("background")
  }

  public func applicationWillTerminate(_ application: UIApplication) {
    module?.sendAppStateEvent("terminated")
  }
}

public class AppStateTrackerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AppStateTracker")
    Events("onAppStateChange")
  }

  func sendAppStateEvent(_ state: String) {
    sendEvent("onAppStateChange", ["state": state])
  }
}
```

### 例2: ディープリンクハンドラー

```swift
import ExpoModulesCore
import UIKit

public class DeepLinkSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    guard url.scheme == "myapp" else {
      return false
    }

    handleDeepLink(url)
    return true
  }

  public func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
      return false
    }

    handleDeepLink(url)
    return true
  }

  private func handleDeepLink(_ url: URL) {
    print("Deep link: \(url.absoluteString)")

    // URLから情報を抽出
    let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
    let path = components?.path
    let queryItems = components?.queryItems

    // イベントを送信
    NotificationCenter.default.post(
      name: Notification.Name("DeepLinkReceived"),
      object: nil,
      userInfo: ["url": url, "path": path ?? "", "query": queryItems ?? []]
    )
  }
}
```

### 例3: セッション追跡

```swift
import ExpoModulesCore
import UIKit

public class SessionTrackerSubscriber: ExpoAppDelegateSubscriber {
  private var sessionStartTime: Date?

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    sessionStartTime = Date()
    print("Session started")
    return true
  }

  public func applicationWillTerminate(_ application: UIApplication) {
    guard let startTime = sessionStartTime else { return }

    let duration = Date().timeIntervalSince(startTime)
    print("Session duration: \(duration) seconds")

    // セッションデータを保存
    saveSessionData(duration: duration)
  }

  private func saveSessionData(duration: TimeInterval) {
    // 分析サービスに送信
    // UserDefaultsに保存
    UserDefaults.standard.set(duration, forKey: "lastSessionDuration")
  }
}
```

## ベストプラクティス

### 1. Swiftクラスのみ

```swift
// ✅ 推奨: Swiftクラス
public class MySubscriber: ExpoAppDelegateSubscriber {
  // ...
}

// ❌ サポートされない: Objective-Cクラス
@objc public class MySubscriber: NSObject, ExpoAppDelegateSubscriber {
  // サポートされない
}
```

### 2. 軽量な処理

```swift
// ✅ 推奨: 軽量な操作
public func applicationDidBecomeActive(_ application: UIApplication) {
  sendEvent("appActive")
}

// ❌ 非推奨: 重い操作
public func applicationDidBecomeActive(_ application: UIApplication) {
  // 同期ネットワークリクエスト - UIをブロック
  fetchDataFromNetwork()
}
```

### 3. Weak Referencesの使用

```swift
public class MySubscriber: ExpoAppDelegateSubscriber {
  private weak var module: MyModule?

  public init(module: MyModule) {
    self.module = module
  }

  public func applicationDidBecomeActive(_ application: UIApplication) {
    module?.handleAppActive()
  }
}
```

### 4. エラーハンドリング

```swift
public func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
  do {
    try initializeModule()
    return true
  } catch {
    print("Initialization error: \(error.localizedDescription)")
    return false
  }
}
```

## 制限事項

### 1. Swiftのみサポート

Objective-Cクラスはサポートされません。

### 2. サポートされないメソッド

副作用の可能性があるいくつかのAppDelegateメソッドはサポートされません。

**例**：
- `application(_:supportedInterfaceOrientationsFor:)`
- `application(_:shouldAllowExtensionPointIdentifier:)`

### 3. 実行順序の保証なし

複数のSubscriberが同じメソッドを実装している場合、実行順序は保証されません。

## まとめ

iOS AppDelegate Subscribersは、以下のシステムイベントへのアクセスを提供します：

### アプリケーションライフサイクル
- `didFinishLaunchingWithOptions`: アプリ起動時
- `applicationDidBecomeActive`: アクティブ時
- `applicationWillResignActive`: 非アクティブ時
- `applicationDidEnterBackground`: バックグラウンド時
- `applicationWillEnterForeground`: フォアグラウンド復帰時
- `applicationWillTerminate`: アプリ終了時

### URLとリンク処理
- URLスキーム処理
- ユニバーサルリンク処理

### リモート通知
- デバイストークン登録
- リモート通知受信

**主な利点**：
- セットアップの簡素化
- 複数モジュールによるイベント処理
- 統一されたシステムイベントアクセス

**重要な制限事項**：
- Swiftクラスのみサポート
- 一部のAppDelegateメソッドは非サポート
- 実行順序は保証されない

これらのパターンを活用して、iOSシステムイベントを効率的に処理できます。
