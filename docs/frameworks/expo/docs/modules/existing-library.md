# 既存ライブラリのExpo Modules APIへの移行

既存のReact Nativeライブラリを、Expo Modules APIに移行する方法を学びます。

## 概要

既存のReact NativeライブラリをExpo Modules APIに移行することで、以下の利点が得られます：

**主な利点**：
- Expo Autolinkingによる自動リンク
- Android Lifecycle ListenersとiOS AppDelegate Subscribersへのアクセス
- モダンなSwift/Kotlin APIの活用
- 段階的なライブラリの近代化

## 移行ステップ

### ステップ1: expo-module.config.jsonの作成

プロジェクトルートに空のJSONオブジェクトを含む`expo-module.config.json`を作成します。

```json
{}
```

**目的**: ExpoがこのライブラリをExpo Moduleとして認識できるようにする

### ステップ2: 依存関係の追加

#### Android（build.gradle）

```gradle
// android/build.gradle
dependencies {
  implementation project(':expo-modules-core')

  // 既存の依存関係
  // ...
}
```

#### iOS（.podspec）

```ruby
# ios/MyModule.podspec
Pod::Spec.new do |s|
  # 既存の設定
  # ...

  s.dependency 'ExpoModulesCore'
end
```

#### package.json

```json
{
  "peerDependencies": {
    "expo": "*"
  },
  "devDependencies": {
    "expo-modules-core": "^1.12.0"
  }
}
```

### ステップ3: ネイティブモジュールファイルの作成

#### Android（Kotlin）

```kotlin
// android/src/main/java/com/mymodule/MyModule.kt
package com.mymodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    // 既存の関数をExpo Modules APIに移行
    Function("hello") {
      return "Hello from MyModule"
    }

    // その他の関数やイベント
  }
}
```

#### iOS（Swift）

```swift
// ios/MyModule.swift
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    // 既存の関数をExpo Modules APIに移行
    Function("hello") {
      return "Hello from MyModule"
    }

    // その他の関数やイベント
  }
}
```

### ステップ4: expo-module.config.jsonの更新

モジュールクラスを設定ファイルに追加します。

```json
{
  "ios": {
    "modules": ["MyModule"]
  },
  "android": {
    "modules": ["com.mymodule.MyModule"]
  }
}
```

**注意**：
- **iOS**: クラス名のみ
- **Android**: 完全修飾クラス名（パッケージ名を含む）

### ステップ5: TypeScriptファイルの作成

```typescript
// src/index.ts
import { requireNativeModule } from 'expo-modules-core';

const MyModule = requireNativeModule('MyModule');

export function hello(): string {
  return MyModule.hello();
}

export default MyModule;
```

## 既存のReact Native APIからの移行

### モジュール定義の移行

#### React Native（従来）

```kotlin
// Kotlin
class MyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "MyModule"

  @ReactMethod
  fun hello(promise: Promise) {
    promise.resolve("Hello from MyModule")
  }
}
```

```swift
// Swift
@objc(MyModule)
class MyModule: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func hello(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve("Hello from MyModule")
  }
}
```

#### Expo Modules API

```kotlin
// Kotlin
class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    AsyncFunction("hello") {
      "Hello from MyModule"
    }
  }
}
```

```swift
// Swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    AsyncFunction("hello") {
      return "Hello from MyModule"
    }
  }
}
```

### イベントの移行

#### React Native（従来）

```kotlin
// Kotlin
private fun sendEvent(eventName: String, params: WritableMap?) {
  reactApplicationContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    .emit(eventName, params)
}

@ReactMethod
fun doSomething() {
  val params = Arguments.createMap()
  params.putString("key", "value")
  sendEvent("onEvent", params)
}
```

#### Expo Modules API

```kotlin
// Kotlin
class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Events("onEvent")

    Function("doSomething") {
      sendEvent("onEvent", mapOf("key" to "value"))
    }
  }
}
```

### ビューコンポーネントの移行

#### React Native（従来）

```kotlin
// Kotlin
class MyViewManager(reactContext: ReactApplicationContext) : SimpleViewManager<MyView>() {
  override fun getName() = "MyView"

  override fun createViewInstance(reactContext: ThemedReactContext): MyView {
    return MyView(reactContext)
  }

  @ReactProp(name = "color")
  fun setColor(view: MyView, color: String) {
    view.setBackgroundColor(Color.parseColor(color))
  }
}
```

#### Expo Modules API

```kotlin
// Kotlin
class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyView")

    View(MyView::class) {
      Prop("color") { view: MyView, color: String ->
        view.setBackgroundColor(android.graphics.Color.parseColor(color))
      }
    }
  }
}
```

## Autolinkingの活用

### React Native Autolinkingとの互換性

Expo ModulesはReact Native Autolinkingと互換性があります。

**package.json**:
```json
{
  "name": "my-module",
  "version": "1.0.0",
  "main": "src/index.ts",
  "react-native": "src/index.ts"
}
```

### expo-module.config.jsonの高度な設定

```json
{
  "platforms": ["ios", "android", "web"],
  "ios": {
    "modules": ["MyModule"],
    "appDelegateSubscribers": ["MyAppDelegateSubscriber"]
  },
  "android": {
    "modules": ["com.mymodule.MyModule"],
    "reactActivityLifecycleListeners": ["com.mymodule.MyLifecycleListener"]
  }
}
```

## Lifecycle ListenersとAppDelegate Subscribers

### Android Lifecycle Listener

```kotlin
// android/src/main/java/com/mymodule/MyLifecycleListener.kt
package com.mymodule

import android.app.Activity
import android.os.Bundle
import expo.modules.kotlin.activityresult.AppContextActivityResultCaller
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity, savedInstanceState: Bundle?) {
    // Activity created
    println("MyLifecycleListener: onCreate")
  }

  override fun onResume(activity: Activity) {
    // Activity resumed
    println("MyLifecycleListener: onResume")
  }

  override fun onPause(activity: Activity) {
    // Activity paused
    println("MyLifecycleListener: onPause")
  }

  override fun onDestroy(activity: Activity) {
    // Activity destroyed
    println("MyLifecycleListener: onDestroy")
  }
}
```

### iOS AppDelegate Subscriber

```swift
// ios/MyAppDelegateSubscriber.swift
import ExpoModulesCore

public class MyAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    print("MyAppDelegateSubscriber: didFinishLaunching")
    return true
  }

  public func applicationWillEnterForeground(_ application: UIApplication) {
    print("MyAppDelegateSubscriber: willEnterForeground")
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    print("MyAppDelegateSubscriber: didEnterBackground")
  }
}
```

## 段階的な移行戦略

### フェーズ1: 並行稼働

既存のコードとExpo Modules APIを並行して動作させます。

```kotlin
class MyModule : Module() {
  // 既存のReact Nativeメソッドをラップ
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Function("legacyMethod") {
      // 既存のコードを呼び出す
      legacyImplementation()
    }

    Function("newMethod") {
      // 新しいExpo Modules APIで実装
      "New implementation"
    }
  }

  private fun legacyImplementation(): String {
    // 既存のReact Nativeコード
    return "Legacy result"
  }
}
```

### フェーズ2: 段階的な置き換え

徐々に既存のメソッドを新しいAPIに置き換えます。

### フェーズ3: レガシーコードの削除

すべてのメソッドがExpo Modules APIに移行されたら、レガシーコードを削除します。

## ベストプラクティス

### 1. 後方互換性の維持

```typescript
// src/index.ts
export function hello(): string {
  try {
    return MyModule.hello();
  } catch (error) {
    // フォールバック処理
    return "Hello (fallback)";
  }
}
```

### 2. TypeScript型の定義

```typescript
export interface MyModuleConfig {
  apiKey: string;
  timeout?: number;
  retries?: number;
}

export function configure(config: MyModuleConfig): void {
  MyModule.configure(config);
}
```

### 3. ドキュメントの更新

移行後、既存のドキュメントを更新します。

```markdown
# Migration Guide

## Breaking Changes

- `oldMethod()` has been renamed to `newMethod()`
- `configure()` now requires an object instead of individual parameters

## Migration Steps

1. Update import statements
2. Replace deprecated methods
3. Update configuration

## Example

Before:
\`\`\`typescript
import MyModule from 'my-module';
MyModule.oldMethod();
\`\`\`

After:
\`\`\`typescript
import { newMethod } from 'my-module';
newMethod();
\`\`\`
```

### 4. テストの追加

```typescript
// __tests__/MyModule.test.ts
import { hello } from '../src';

describe('MyModule', () => {
  it('should return hello message', () => {
    const result = hello();
    expect(result).toBe('Hello from MyModule');
  });
});
```

## よくある問題と解決策

### 問題1: モジュールが見つからない

**原因**: `expo-module.config.json`が正しく設定されていない

**解決策**：
```json
{
  "ios": {
    "modules": ["MyModule"]
  },
  "android": {
    "modules": ["com.mymodule.MyModule"]
  }
}
```

### 問題2: Autolinkingが動作しない

**原因**: `expo-modules-core`が依存関係に含まれていない

**解決策**：
```bash
npm install expo-modules-core
npx expo prebuild --clean
```

### 問題3: TypeScriptエラー

**原因**: 型定義が不足している

**解決策**：
```typescript
// src/MyModule.types.ts
export interface MyModuleInterface {
  hello(): string;
}
```

## まとめ

既存のReact NativeライブラリをExpo Modules APIに移行するには、以下のステップを実行します：

1. **expo-module.config.jsonの作成**: 空のJSONオブジェクト
2. **依存関係の追加**: expo-modules-coreをbuild.gradle、.podspec、package.jsonに追加
3. **ネイティブモジュールファイルの作成**: KotlinとSwiftでModule定義
4. **expo-module.config.jsonの更新**: モジュールクラスを登録
5. **TypeScriptファイルの作成**: requireNativeModuleでエクスポート

**主な利点**：
- Expo Autolinkingによる自動リンク
- Android Lifecycle ListenersとiOS AppDelegate Subscribersへのアクセス
- モダンなSwift/Kotlin APIの活用
- 段階的なライブラリの近代化

**移行戦略**：
- フェーズ1: 並行稼働
- フェーズ2: 段階的な置き換え
- フェーズ3: レガシーコードの削除

詳細な実装ガイダンスについては、[ネイティブモジュールAPIリファレンス](./module-api.md)を参照してください。
