# Android Lifecycle Listeners

Expo ModulesでAndroid Lifecycle Listenersを使用する方法を学びます。

## 概要

Expo Modules APIは、AndroidのActivityおよびApplicationライフサイクルイベントにフックする2種類のライフサイクルリスナーを提供します。

**主な用途**：
- ディープリンクの処理
- アプリ状態の追跡
- セットアップ/クリーンアップ操作
- システムイベントのインターセプト

## Lifecycle Listenerの種類

### 1. Activity Lifecycle Listeners

Android Activityのライフサイクルイベントにフックします。

**サポートされるコールバック**：
- `onCreate`
- `onResume`
- `onPause`
- `onDestroy`
- `onNewIntent`
- `onBackPressed`

### 2. Application Lifecycle Listeners

Android Applicationのライフサイクルイベントにフックします。

**サポートされるコールバック**：
- `onCreate`
- `onConfigurationChanged`

## Activity Lifecycle Listenerの実装

### ステップ1: Listenerクラスの作成

```kotlin
// android/src/main/java/expo/modules/mymodule/MyActivityLifecycleListener.kt
package expo.modules.mymodule

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class MyActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    println("Activity onCreate")
  }

  override fun onResume(activity: Activity?) {
    println("Activity onResume")
  }

  override fun onPause(activity: Activity?) {
    println("Activity onPause")
  }

  override fun onDestroy(activity: Activity?) {
    println("Activity onDestroy")
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    println("Activity onNewIntent: ${intent?.data}")
    return false
  }

  override fun onBackPressed(): Boolean {
    println("Activity onBackPressed")
    return false // false = デフォルトの動作を続行
  }
}
```

### ステップ2: expo-module.config.jsonへの登録

```json
{
  "android": {
    "modules": ["expo.modules.mymodule.MyModule"],
    "reactActivityLifecycleListeners": [
      "expo.modules.mymodule.MyActivityLifecycleListener"
    ]
  }
}
```

## Application Lifecycle Listenerの実装

### ステップ1: Listenerクラスの作成

```kotlin
// android/src/main/java/expo/modules/mymodule/MyApplicationLifecycleListener.kt
package expo.modules.mymodule

import android.app.Application
import android.content.res.Configuration
import expo.modules.core.interfaces.ApplicationLifecycleListener

class MyApplicationLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application?) {
    println("Application onCreate")
  }

  override fun onConfigurationChanged(newConfig: Configuration?) {
    println("Application onConfigurationChanged")
  }
}
```

### ステップ2: expo-module.config.jsonへの登録

```json
{
  "android": {
    "modules": ["expo.modules.mymodule.MyModule"],
    "applicationLifecycleListeners": [
      "expo.modules.mymodule.MyApplicationLifecycleListener"
    ]
  }
}
```

## 実践例

### 例1: ディープリンクハンドラー

```kotlin
package expo.modules.mymodule

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class DeepLinkHandlerActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    activity?.intent?.let { handleIntent(it) }
  }

  override fun onNewIntent(intent: Intent?): Boolean {
    intent?.let { handleIntent(it) }
    return true // trueを返してデフォルトの動作を防ぐ
  }

  private fun handleIntent(intent: Intent) {
    val data = intent.data
    if (data != null) {
      val scheme = data.scheme
      val host = data.host
      val path = data.path

      println("Deep link received: $scheme://$host$path")

      // ディープリンクを処理
      // 例: イベントを送信、ナビゲーションをトリガー
    }
  }
}
```

### 例2: アプリ状態トラッカー

```kotlin
package expo.modules.mymodule

import android.app.Activity
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppStateTrackerActivityLifecycleListener(
  private val module: AppStateTrackerModule
) : ReactActivityLifecycleListener {
  override fun onResume(activity: Activity?) {
    module.sendAppStateEvent("active")
  }

  override fun onPause(activity: Activity?) {
    module.sendAppStateEvent("background")
  }
}

class AppStateTrackerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppStateTracker")

    Events("onAppStateChange")
  }

  fun sendAppStateEvent(state: String) {
    sendEvent("onAppStateChange", mapOf("state" to state))
  }
}
```

### 例3: バックボタンハンドラー

```kotlin
package expo.modules.mymodule

import android.app.Activity
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class BackButtonHandlerActivityLifecycleListener : ReactActivityLifecycleListener {
  private var backPressedOnce = false
  private val backPressTimeout = 2000L // 2秒

  override fun onBackPressed(): Boolean {
    if (backPressedOnce) {
      // 2回目のバックボタン押下 - アプリを終了
      return false
    }

    backPressedOnce = true
    println("Press back again to exit")

    // 2秒後にリセット
    android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
      backPressedOnce = false
    }, backPressTimeout)

    return true // デフォルトの動作を防ぐ
  }
}
```

### 例4: セッショントラッカー

```kotlin
package expo.modules.mymodule

import android.app.Activity
import android.os.Bundle
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import java.util.Date

class SessionTrackerActivityLifecycleListener : ReactActivityLifecycleListener {
  private var sessionStartTime: Long = 0

  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    sessionStartTime = System.currentTimeMillis()
    println("Session started at $sessionStartTime")
  }

  override fun onDestroy(activity: Activity?) {
    val sessionDuration = System.currentTimeMillis() - sessionStartTime
    println("Session duration: ${sessionDuration}ms")

    // セッションデータを保存
    saveSessionData(sessionDuration)
  }

  private fun saveSessionData(duration: Long) {
    // 分析サービスに送信
    // SharedPreferencesに保存
    // など
  }
}
```

## メモリリークの防止

### Weak Referencesの使用

```kotlin
import java.lang.ref.WeakReference

class MyActivityLifecycleListener(activity: Activity) : ReactActivityLifecycleListener {
  private val activityRef = WeakReference(activity)

  override fun onResume(activity: Activity?) {
    activityRef.get()?.let { act ->
      // activityを使用
      println("Activity resumed: ${act.localClassName}")
    }
  }

  override fun onDestroy(activity: Activity?) {
    // リファレンスをクリア
    activityRef.clear()
  }
}
```

### 必要なメソッドのみ実装

```kotlin
class MinimalActivityLifecycleListener : ReactActivityLifecycleListener {
  // 必要なメソッドのみオーバーライド
  override fun onNewIntent(intent: Intent?): Boolean {
    handleIntent(intent)
    return true
  }

  private fun handleIntent(intent: Intent?) {
    // インテント処理
  }
}
```

## ベストプラクティス

### 1. リスナーを軽量に保つ

```kotlin
// ✅ 推奨: 軽量な操作
override fun onResume(activity: Activity?) {
  sendEvent("appResumed")
}

// ❌ 非推奨: 重い操作
override fun onResume(activity: Activity?) {
  // 同期ネットワークリクエスト - UIをブロック
  fetchDataFromNetwork()
}
```

### 2. 非同期処理の使用

```kotlin
override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
  // バックグラウンドで実行
  kotlinx.coroutines.GlobalScope.launch(kotlinx.coroutines.Dispatchers.IO) {
    performHeavyOperation()
  }
}
```

### 3. 適切な戻り値

```kotlin
override fun onNewIntent(intent: Intent?): Boolean {
  if (canHandleIntent(intent)) {
    handleIntent(intent)
    return true // デフォルトの動作を防ぐ
  }
  return false // デフォルトの動作を続行
}

override fun onBackPressed(): Boolean {
  if (shouldHandleBackPress()) {
    handleCustomBackPress()
    return true // デフォルトの動作を防ぐ
  }
  return false // デフォルトの動作を続行
}
```

### 4. エラーハンドリング

```kotlin
override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
  try {
    initializeModule()
  } catch (e: Exception) {
    println("Error initializing module: ${e.message}")
    // エラーを適切に処理
  }
}
```

## 重要な考慮事項

### 1. インターフェースの変更

Expo SDKリリース間でインターフェースが変更される可能性があります。

**推奨**: 常に最新のExpo SDKドキュメントを参照

### 2. パフォーマンスへの影響

ライフサイクルリスナーはアプリのパフォーマンスに影響を与える可能性があります。

**推奨**：
- 重い操作を避ける
- 非同期処理を使用
- 必要な場合のみ実装

### 3. 複数のリスナー

複数のモジュールが同じライフサイクルイベントをリッスンできます。

**実行順序**: 保証されない（依存しないこと）

## まとめ

Android Lifecycle Listenersは、以下のライフサイクルイベントにアクセスを提供します：

### Activity Lifecycle
- `onCreate`: Activity作成時
- `onResume`: Activity再開時
- `onPause`: Activity一時停止時
- `onDestroy`: Activity破棄時
- `onNewIntent`: 新しいインテント受信時
- `onBackPressed`: バックボタン押下時

### Application Lifecycle
- `onCreate`: Application作成時
- `onConfigurationChanged`: 設定変更時

**主なユースケース**：
- ディープリンク処理
- アプリ状態追跡
- セッション管理
- バックボタンのカスタマイズ

**ベストプラクティス**：
- リスナーを軽量に保つ
- 非同期処理を使用
- Weak Referencesでメモリリークを防ぐ
- 必要なメソッドのみ実装

これらのパターンを活用して、Androidライフサイクルイベントを効率的に処理できます。
