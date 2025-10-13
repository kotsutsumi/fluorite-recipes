# Expo Modules API リファレンス

Expo Modules APIの完全なリファレンスドキュメントです。

## 概要

Expo Modules APIは、SwiftとKotlinでネイティブモジュールを記述するための型安全なAPIを提供します。

**主な特徴**：
- クロスプラットフォーム（iOS/Android）の一貫性
- 型安全なネイティブモジュール開発
- イベントの送受信
- ビューコールバックメカニズム

## Module Definition

### Name

モジュール名をJavaScriptから参照できるように設定します。

```swift
// Swift
Name("MyModule")
```

```kotlin
// Kotlin
Name("MyModule")
```

### Constants

読み取り専用のモジュールプロパティを定義します。

```swift
Constants {
  return [
    "API_URL": "https://api.example.com",
    "VERSION": "1.0.0",
    "MAX_RETRIES": 3
  ]
}
```

```kotlin
Constants {
  mapOf(
    "API_URL" to "https://api.example.com",
    "VERSION" to "1.0.0",
    "MAX_RETRIES" to 3
  )
}
```

**TypeScript**:
```typescript
import { NativeModulesProxy } from 'expo-modules-core';

const { API_URL, VERSION, MAX_RETRIES } = NativeModulesProxy.MyModule;
```

## 関数定義

### Function

同期ネイティブ関数を作成します。

```swift
Function("add") { (a: Int, b: Int) -> Int in
  return a + b
}
```

```kotlin
Function("add") { a: Int, b: Int ->
  a + b
}
```

**TypeScript**:
```typescript
export function add(a: number, b: number): number {
  return MyModule.add(a, b);
}
```

### AsyncFunction

非同期ネイティブ関数をPromiseサポートで作成します。

```swift
AsyncFunction("fetchData") { (url: String) -> String in
  // ネットワークリクエスト
  let data = try await URLSession.shared.data(from: URL(string: url)!)
  return String(data: data.0, encoding: .utf8) ?? ""
}
```

```kotlin
AsyncFunction("fetchData") { url: String ->
  // ネットワークリクエスト
  withContext(Dispatchers.IO) {
    URL(url).readText()
  }
}
```

**TypeScript**:
```typescript
export async function fetchData(url: string): Promise<string> {
  return await MyModule.fetchData(url);
}
```

## イベント

### Events

モジュールが送信できるイベント名を定義します。

```swift
Events("onDataReceived", "onError")
```

```kotlin
Events("onDataReceived", "onError")
```

### sendEvent

ネイティブからJavaScriptにイベントを送信します。

```swift
// Swift
Function("startMonitoring") {
  // データ受信時
  self.sendEvent("onDataReceived", [
    "data": "Sample data",
    "timestamp": Date().timeIntervalSince1970
  ])
}
```

```kotlin
// Kotlin
Function("startMonitoring") {
  // データ受信時
  sendEvent("onDataReceived", mapOf(
    "data" to "Sample data",
    "timestamp" to System.currentTimeMillis()
  ))
}
```

**TypeScript**:
```typescript
import { EventEmitter } from 'expo-modules-core';

const emitter = new EventEmitter(MyModule);

emitter.addListener('onDataReceived', (event) => {
  console.log('Data:', event.data);
  console.log('Timestamp:', event.timestamp);
});
```

## Property

### 読み取り専用プロパティ

```swift
Property("version")
  .get { "1.0.0" }
```

```kotlin
Property("version")
  .get { "1.0.0" }
```

### 読み書き可能プロパティ

```swift
Property("theme")
  .get { self.currentTheme }
  .set { (newTheme: String) in
    self.currentTheme = newTheme
  }
```

```kotlin
Property("theme")
  .get { currentTheme }
  .set { newTheme: String ->
    currentTheme = newTheme
  }
```

## View定義

### View

ネイティブビューの作成を有効にします。

```swift
View(MyCustomView.self) {
  Prop("backgroundColor") { (view: MyCustomView, color: String) in
    view.backgroundColor = UIColor(hexString: color)
  }

  Events("onPress")
}
```

```kotlin
View(MyCustomView::class) {
  Prop("backgroundColor") { view: MyCustomView, color: String ->
    view.setBackgroundColor(Color.parseColor(color))
  }

  Events("onPress")
}
```

## ライフサイクルメソッド

### OnCreate

モジュールインスタンスが作成されたときに呼び出されます。

```swift
OnCreate {
  // 初期化処理
  print("Module created")
}
```

```kotlin
OnCreate {
  // 初期化処理
  println("Module created")
}
```

### OnDestroy

モジュールインスタンスが破棄されるときに呼び出されます。

```swift
OnDestroy {
  // クリーンアップ処理
  print("Module destroyed")
}
```

```kotlin
OnDestroy {
  // クリーンアップ処理
  println("Module destroyed")
}
```

### OnStartObserving

最初のイベントリスナーが追加されたときに呼び出されます。

```swift
OnStartObserving {
  // 監視開始
  startListening()
}
```

### OnStopObserving

最後のイベントリスナーが削除されたときに呼び出されます。

```swift
OnStopObserving {
  // 監視停止
  stopListening()
}
```

## 型システム

### サポートされる基本型

- **Swift**: Bool, Int, Double, String, Array, Dictionary
- **Kotlin**: Boolean, Int, Double, String, List, Map

### Records

構造化データを型安全なフィールドで定義します。

```swift
Record("User") {
  Field("id") { String.self }
  Field("name") { String.self }
  Field("email") { String.self }
  Field("age") { Int.self }
    .optional()
}
```

```kotlin
Record("User") {
  Field("id") { String::class }
  Field("name") { String::class }
  Field("email") { String::class }
  Field("age") { Int::class }
    .optional()
}
```

**TypeScript**:
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}
```

### Enums

制限された値のセットを定義します。

```swift
Enum("Theme") {
  Value("light")
  Value("dark")
  Value("system")
}
```

```kotlin
Enum("Theme") {
  Value("light")
  Value("dark")
  Value("system")
}
```

**TypeScript**:
```typescript
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
```

## エラーハンドリング

### 例外のスロー

```swift
Function("divide") { (a: Int, b: Int) -> Int in
  guard b != 0 else {
    throw Exception(name: "DivisionByZero", description: "Cannot divide by zero")
  }
  return a / b
}
```

```kotlin
Function("divide") { a: Int, b: Int ->
  if (b == 0) {
    throw Exception("DivisionByZero", "Cannot divide by zero")
  }
  a / b
}
```

**TypeScript**:
```typescript
try {
  const result = MyModule.divide(10, 0);
} catch (error) {
  console.error(error.name); // "DivisionByZero"
  console.error(error.message); // "Cannot divide by zero"
}
```

## AppContext

アプリコンテキストへのインターフェース。

```swift
Property("appVersion")
  .get {
    Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "Unknown"
  }
```

```kotlin
Property("appVersion")
  .get {
    appContext.reactContext?.packageManager
      ?.getPackageInfo(appContext.reactContext?.packageName ?: "", 0)
      ?.versionName ?: "Unknown"
  }
```

## ベストプラクティス

### 1. 明確な命名

```swift
// ✅ 推奨
Function("getUserById") { (id: String) -> User in
  // ...
}

// ❌ 非推奨
Function("getU") { (i: String) -> User in
  // ...
}
```

### 2. 型安全性

```swift
// ✅ 推奨: 型を明示
Function("add") { (a: Int, b: Int) -> Int in
  return a + b
}

// ❌ 非推奨: 型が曖昧
Function("add") { (a, b) in
  return a + b
}
```

### 3. エラーハンドリング

```swift
AsyncFunction("fetchData") { (url: String) -> String in
  guard let url = URL(string: url) else {
    throw Exception(name: "InvalidURL", description: "Invalid URL format")
  }

  do {
    let (data, _) = try await URLSession.shared.data(from: url)
    guard let string = String(data: data, encoding: .utf8) else {
      throw Exception(name: "DecodingError", description: "Cannot decode data")
    }
    return string
  } catch {
    throw Exception(name: "NetworkError", description: error.localizedDescription)
  }
}
```

### 4. ドキュメント

```swift
/**
 * Fetches data from the specified URL.
 *
 * @param url - The URL to fetch data from
 * @returns The fetched data as a string
 * @throws InvalidURL if the URL format is invalid
 * @throws NetworkError if the network request fails
 * @throws DecodingError if the data cannot be decoded
 */
AsyncFunction("fetchData") { (url: String) -> String in
  // ...
}
```

## まとめ

Expo Modules APIは、以下のコンポーネントを提供します：

### Definition Components
- `Name`: モジュール名の設定
- `Constants`: 読み取り専用プロパティ
- `Function`: 同期関数
- `AsyncFunction`: 非同期関数
- `Events`: イベント定義
- `Property`: 可変/不変プロパティ
- `View`: ネイティブビュー

### Lifecycle Methods
- `OnCreate`: モジュール作成時
- `OnDestroy`: モジュール破棄時
- `OnStartObserving`: イベント監視開始
- `OnStopObserving`: イベント監視停止

### Type System
- プリミティブ型（Bool, Int, String, etc.）
- Records: 構造化データ
- Enums: 制限された値のセット

### Key Features
- クロスプラットフォーム一貫性
- 型安全なネイティブモジュール開発
- イベント送受信
- ビューコールバックメカニズム

詳細な例とチュートリアルについては、[ネイティブモジュールチュートリアル](./native-module-tutorial.md)と[ネイティブビューチュートリアル](./native-view-tutorial.md)を参照してください。
