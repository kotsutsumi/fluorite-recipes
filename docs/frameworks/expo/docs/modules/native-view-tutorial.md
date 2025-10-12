# ネイティブビューチュートリアル

Expo Modules APIを使用してネイティブWebViewコンポーネントを作成する実践的なチュートリアルです。

## チュートリアル概要

このチュートリアルでは、クロスプラットフォームのネイティブWebViewモジュール`expo-web-view`を作成します。

**学習内容**：
- ネイティブビューコンポーネントの作成
- プロップスの処理
- イベントハンドラーの実装
- プラットフォーム固有の実装

**サポートプラットフォーム**：
- Android（WebViewを使用）
- iOS（WKWebViewを使用）

## ステップ1: モジュールの初期化

### モジュールの作成

```bash
npx create-expo-module@latest expo-web-view
```

**プロンプト**：
```
? What is the name of the npm package? › expo-web-view
? What is the native module name? › ExpoWebView
? What is the Android package name? › expo.modules.expowebview
```

### 不要なファイルの削除

```bash
cd expo-web-view

# デフォルトのモジュールファイルを削除
rm ios/ExpoWebViewModule.swift
rm android/src/main/java/expo/modules/expowebview/ExpoWebViewModule.kt
```

## ステップ2: Androidの実装

### 基本的なWebViewコンポーネント

```kotlin
// android/src/main/java/expo/modules/expowebview/ExpoWebView.kt
package expo.modules.expowebview

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(MATCH_PARENT, MATCH_PARENT)
    it.webViewClient = WebViewClient()
    addView(it)
    it.loadUrl("https://docs.expo.dev/modules/")
  }
}
```

### ViewManagerの作成

```kotlin
// android/src/main/java/expo/modules/expowebview/ExpoWebViewModule.kt
package expo.modules.expowebview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      // プロップスとイベントをここに追加
    }
  }
}
```

### URLプロップの追加

```kotlin
class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Prop("url") { view: ExpoWebView, url: String ->
        view.webView.loadUrl(url)
      }
    }
  }
}
```

### onLoadイベントの追加

```kotlin
import android.webkit.WebView
import android.webkit.WebViewClient

class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(MATCH_PARENT, MATCH_PARENT)
    it.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        // イベントを発行
        onLoad(mapOf("url" to url))
      }
    }
    addView(it)
    it.loadUrl("https://docs.expo.dev/modules/")
  }

  private val onLoad by EventDispatcher()
}
```

```kotlin
class ExpoWebViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView::class) {
      Prop("url") { view: ExpoWebView, url: String ->
        view.webView.loadUrl(url)
      }

      Events("onLoad")
    }
  }
}
```

## ステップ3: iOSの実装

### 基本的なWKWebViewコンポーネント

```swift
// ios/ExpoWebView.swift
import ExpoModulesCore
import WebKit

class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    webView.navigationDelegate = self
    addSubview(webView)
    webView.load(URLRequest(url: URL(string: "https://docs.expo.dev/modules/")!))
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    webView.frame = bounds
  }
}
```

### ViewManagerの作成

```swift
// ios/ExpoWebViewModule.swift
import ExpoModulesCore

public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      // プロップスとイベントをここに追加
    }
  }
}
```

### URLプロップの追加

```swift
public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Prop("url") { (view: ExpoWebView, url: String) in
        if let url = URL(string: url) {
          view.webView.load(URLRequest(url: url))
        }
      }
    }
  }
}
```

### onLoadイベントの追加

```swift
class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()
  let onLoad = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    webView.navigationDelegate = self
    addSubview(webView)
    webView.load(URLRequest(url: URL(string: "https://docs.expo.dev/modules/")!))
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    webView.frame = bounds
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    onLoad([
      "url": webView.url?.absoluteString ?? ""
    ])
  }
}
```

```swift
public class ExpoWebViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoWebView")

    View(ExpoWebView.self) {
      Prop("url") { (view: ExpoWebView, url: String) in
        if let url = URL(string: url) {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
```

## ステップ4: TypeScriptコンポーネントの作成

### 基本的なコンポーネント

```typescript
// src/ExpoWebViewView.tsx
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type ExpoWebViewProps = ViewProps & {
  url?: string;
  onLoad?: (event: { nativeEvent: { url: string } }) => void;
};

const NativeView: React.ComponentType<ExpoWebViewProps> =
  requireNativeViewManager('ExpoWebView');

export default function ExpoWebView(props: ExpoWebViewProps) {
  return <NativeView {...props} />;
}
```

### エクスポート

```typescript
// src/index.ts
export { default as ExpoWebView } from './ExpoWebViewView';
export type { ExpoWebViewProps } from './ExpoWebViewView';
```

## ステップ5: サンプルアプリでのテスト

### 基本的な使用例

```typescript
// example/App.tsx
import { StyleSheet, View } from 'react-native';
import { ExpoWebView } from 'expo-web-view';

export default function App() {
  return (
    <View style={styles.container}>
      <ExpoWebView
        style={styles.webView}
        url="https://expo.dev"
        onLoad={(event) => {
          console.log('Page loaded:', event.nativeEvent.url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
```

### サンプルアプリの起動

```bash
cd expo-web-view
npx expo start
```

## ボーナス: Webブラウザーの実装

### UI コンポーネントの追加

```typescript
// example/App.tsx
import { useState } from 'react';
import { StyleSheet, View, TextInput, Button, ActivityIndicator, Text } from 'react-native';
import { ExpoWebView } from 'expo-web-view';

export default function App() {
  const [url, setUrl] = useState('https://expo.dev');
  const [currentUrl, setCurrentUrl] = useState('https://expo.dev');
  const [loading, setLoading] = useState(false);

  const handleGo = () => {
    setCurrentUrl(url);
    setLoading(true);
  };

  const handleLoad = (event: { nativeEvent: { url: string } }) => {
    setLoading(false);
    setUrl(event.nativeEvent.url);
    console.log('Page loaded:', event.nativeEvent.url);
  };

  return (
    <View style={styles.container}>
      {/* アドレスバー */}
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={handleGo}
          placeholder="Enter URL"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Button title="Go" onPress={handleGo} />
      </View>

      {/* ローディングインジケーター */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}

      {/* WebView */}
      <ExpoWebView
        style={styles.webView}
        url={currentUrl}
        onLoad={handleLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  loading: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  webView: {
    flex: 1,
  },
});
```

## ステップ6: 追加機能の実装

### 進捗イベントの追加（Android）

```kotlin
class ExpoWebView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onLoad by EventDispatcher()
  private val onProgress by EventDispatcher()

  internal val webView = WebView(context).also {
    it.layoutParams = LayoutParams(MATCH_PARENT, MATCH_PARENT)
    it.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        onLoad(mapOf("url" to url))
      }

      override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
        super.onPageStarted(view, url, favicon)
        onProgress(mapOf("progress" to 0.0))
      }
    }
    it.webChromeClient = object : android.webkit.WebChromeClient() {
      override fun onProgressChanged(view: WebView?, newProgress: Int) {
        super.onProgressChanged(view, newProgress)
        onProgress(mapOf("progress" to newProgress / 100.0))
      }
    }
    addView(it)
    it.loadUrl("https://docs.expo.dev/modules/")
  }
}
```

```kotlin
View(ExpoWebView::class) {
  Prop("url") { view: ExpoWebView, url: String ->
    view.webView.loadUrl(url)
  }

  Events("onLoad", "onProgress")
}
```

### 進捗イベントの追加（iOS）

```swift
class ExpoWebView: ExpoView, WKNavigationDelegate {
  let webView = WKWebView()
  let onLoad = EventDispatcher()
  let onProgress = EventDispatcher()

  private var progressObserver: NSKeyValueObservation?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    webView.navigationDelegate = self
    addSubview(webView)
    webView.load(URLRequest(url: URL(string: "https://docs.expo.dev/modules/")!))

    // 進捗の監視
    progressObserver = webView.observe(\.estimatedProgress, options: [.new]) { [weak self] webView, _ in
      self?.onProgress([
        "progress": webView.estimatedProgress
      ])
    }
  }

  deinit {
    progressObserver?.invalidate()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    webView.frame = bounds
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    onLoad([
      "url": webView.url?.absoluteString ?? ""
    ])
  }
}
```

## 主な学習ポイント

### 1. クロスプラットフォームネイティブビュー

- **Android**: WebViewコンポーネント
- **iOS**: WKWebViewコンポーネント
- **統一API**: 同じTypeScriptインターフェース

### 2. プロップスの処理

```typescript
<ExpoWebView
  url="https://expo.dev"
  style={{ flex: 1 }}
/>
```

### 3. イベントハンドラー

```typescript
<ExpoWebView
  onLoad={(event) => {
    console.log('URL:', event.nativeEvent.url);
  }}
/>
```

### 4. レイアウトの管理

- **Android**: `LayoutParams`
- **iOS**: `layoutSubviews()`

## ベストプラクティス

### 1. メモリ管理

```swift
deinit {
  progressObserver?.invalidate()
  webView.navigationDelegate = nil
}
```

### 2. エラーハンドリング

```kotlin
it.webViewClient = object : WebViewClient() {
  override fun onReceivedError(
    view: WebView?,
    request: WebResourceRequest?,
    error: WebResourceError?
  ) {
    onError(mapOf(
      "url" to request?.url?.toString(),
      "code" to error?.errorCode,
      "description" to error?.description
    ))
  }
}
```

### 3. プロップスの検証

```typescript
export type ExpoWebViewProps = ViewProps & {
  url?: string;
  onLoad?: (event: { nativeEvent: { url: string } }) => void;
  onError?: (event: { nativeEvent: { code: number; description: string } }) => void;
};
```

### 4. TypeScript型の定義

```typescript
export interface WebViewEvent {
  url: string;
}

export interface WebViewProgressEvent {
  progress: number;
}

export interface WebViewErrorEvent {
  url: string;
  code: number;
  description: string;
}
```

## まとめ

このチュートリアルでは、以下を学びました：

1. **モジュールの初期化**: `npx create-expo-module@latest`
2. **ネイティブビューの実装**: WebView（Android）、WKWebView（iOS）
3. **プロップスの追加**: `Prop("url")`
4. **イベントハンドラーの実装**: `Events("onLoad")`
5. **TypeScriptコンポーネント**: `requireNativeViewManager()`
6. **サンプルアプリ**: Webブラウザー風UIの実装

**主な機能**：
- デフォルト/設定可能なURLでWebViewをレンダリング
- URLを動的に設定するプロップス
- ページロード完了時のイベントハンドラー
- 進捗イベント（オプション）

**コード構造**：
```
expo-web-view/
├── android/
│   └── src/main/java/.../
│       ├── ExpoWebView.kt
│       └── ExpoWebViewModule.kt
├── ios/
│   ├── ExpoWebView.swift
│   └── ExpoWebViewModule.swift
├── src/
│   ├── index.ts
│   └── ExpoWebViewView.tsx
└── example/
    └── App.tsx
```

**プラットフォーム固有の実装**：
- **Android**: WebView、WebViewClient、WebChromeClient
- **iOS**: WKWebView、WKNavigationDelegate、KVO

これらのパターンを活用して、カスタムネイティブUIコンポーネントを作成できます。
