# Expo Modules - 包括的ネイティブモジュール開発ガイド

## 📋 概要

Expo Modules APIは、SwiftとKotlinでネイティブモジュールを記述できる強力なフレームワークです。モダンな言語機能を活用し、最小限のボイラープレートで型安全なネイティブ機能を統合できます。

```typescript
interface ExpoModulesSystem {
  core: {
    api: ModulesAPI;
    autolinking: AutolinkingSystem;
    configuration: ModuleConfig;
  };
  development: {
    localModules: LocalModuleDevelopment;
    standaloneModules: StandaloneModuleDevelopment;
    tutorials: ComprehensiveTutorials;
  };
  integration: {
    thirdParty: ThirdPartyLibraryIntegration;
    migration: ExistingLibraryMigration;
    lifecycle: LifecycleIntegration;
  };
  advanced: {
    configPlugins: ConfigPluginSystem;
    testing: MockingSupport;
    multiPlatform: AdditionalPlatformSupport;
  };
}
```

## 🎯 主な特徴

### 1. モダンな言語サポート

SwiftとKotlinの最新機能を活用できます。

```typescript
interface LanguageSupport {
  ios: {
    language: "Swift";
    features: ["型安全性", "Null安全性", "モダンな構文"];
    advantages: "Objective-Cより簡潔で保守しやすい";
  };
  android: {
    language: "Kotlin";
    features: ["型安全性", "Null安全性", "コルーチン"];
    advantages: "Javaより簡潔で安全";
  };
}
```

**コード例（Swift）**：
```swift
public class ExpoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")
    Function("sayHello") { (name: String) in
      return "Hello \(name)!"
    }
  }
}
```

**コード例（Kotlin）**：
```kotlin
class ExpoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")
    Function("sayHello") { name: String ->
      "Hello $name!"
    }
  }
}
```

**詳細ドキュメント**: [`overview.md`](./modules/overview.md)

### 2. 最小限のボイラープレート

従来のReact Nativeモジュールと比較して、大幅にコード量を削減できます。

```typescript
interface BoilerplateComparison {
  traditional: {
    lines: "100-200行以上のボイラープレート";
    complexity: "高い";
  };
  expoModules: {
    lines: "10-20行で実装可能";
    complexity: "低い";
  };
  reduction: "80-90%のコード削減";
}
```

### 3. React Native New Architectureサポート

新しいReact Nativeアーキテクチャを自動的にサポートします。

```typescript
interface NewArchitectureSupport {
  turboModules: "自動互換性";
  fabricRenderer: "自動対応";
  backwardCompatibility: "既存アプリとの互換性維持";
}
```

**詳細ドキュメント**: [`design.md`](./modules/design.md)

## 🚀 開発の開始

### 方法1: ローカルモジュール

既存のExpoアプリにモジュールを追加します。

```bash
npx create-expo-module@latest --local
```

**プロジェクト構造**：
```
project/
├── app/
├── modules/
│   └── my-module/
│       ├── android/
│       ├── ios/
│       ├── src/
│       │   └── index.ts
│       └── expo-module.config.json
└── package.json
```

**詳細ドキュメント**: [`get-started.md`](./modules/get-started.md)

### 方法2: スタンドアロンモジュール

再利用可能なモジュールをサンプルプロジェクトと共に作成します。

```bash
npx create-expo-module@latest my-module
```

**プロジェクト構造**：
```
my-module/
├── android/          # Android実装
├── ios/              # iOS実装
├── src/              # TypeScript API
├── example/          # サンプルアプリ
├── expo-module.config.json
└── package.json
```

**詳細ドキュメント**: [`use-standalone-expo-module-in-your-project.md`](./modules/use-standalone-expo-module-in-your-project.md)

## 📚 Modules API リファレンス

### Module Definition

モジュールの基本構造を定義します。

```typescript
interface ModuleDefinition {
  Name: "モジュール名の設定";
  Constants: "読み取り専用プロパティ";
  Function: "同期関数";
  AsyncFunction: "非同期関数";
  Events: "イベント定義";
  Property: "可変/不変プロパティ";
  View: "ネイティブビュー";
}
```

### 関数定義

#### 同期関数

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

#### 非同期関数

```swift
AsyncFunction("fetchData") { (url: String) -> String in
  let data = try await URLSession.shared.data(from: URL(string: url)!)
  return String(data: data.0, encoding: .utf8) ?? ""
}
```

```kotlin
AsyncFunction("fetchData") { url: String ->
  withContext(Dispatchers.IO) {
    URL(url).readText()
  }
}
```

### イベントシステム

```typescript
interface EventSystem {
  definition: "Events('onDataReceived', 'onError')";
  emission: "sendEvent() でJavaScriptに送信";
  subscription: "EventEmitter で購読";
}
```

**Swift実装**：
```swift
Events("onDataReceived", "onError")

Function("startMonitoring") {
  self.sendEvent("onDataReceived", [
    "data": "Sample data",
    "timestamp": Date().timeIntervalSince1970
  ])
}
```

**TypeScript使用**：
```typescript
import { EventEmitter } from 'expo-modules-core';

const emitter = new EventEmitter(MyModule);

emitter.addListener('onDataReceived', (event) => {
  console.log('Data:', event.data);
});
```

**詳細ドキュメント**: [`module-api.md`](./modules/module-api.md)

## 🎓 チュートリアル

### ネイティブモジュールチュートリアル

テーマ設定を管理するモジュールの作成を通じて、基本的なネイティブモジュール開発を学びます。

```typescript
interface NativeModuleTutorial {
  topics: [
    "ネイティブ関数の作成",
    "データの永続化（SharedPreferences / UserDefaults）",
    "イベントの発行",
    "型安全性の実装"
  ];
  platforms: ["Android", "iOS"];
  outcome: "完全に機能するテーマ管理モジュール";
}
```

**作成するモジュール**：
- テーマの取得と保存
- アプリ再起動後もテーマを保持
- テーマ変更時にイベントを発行
- 型安全なAPI（light、dark、system）

**詳細ドキュメント**: [`native-module-tutorial.md`](./modules/native-module-tutorial.md)

### ネイティブビューチュートリアル

クロスプラットフォームのネイティブWebViewコンポーネントの作成を通じて、UIコンポーネント開発を学びます。

```typescript
interface NativeViewTutorial {
  topics: [
    "ネイティブビューコンポーネントの作成",
    "プロップスの処理",
    "イベントハンドラーの実装",
    "プラットフォーム固有の実装"
  ];
  platforms: {
    android: "WebView";
    ios: "WKWebView";
  };
  outcome: "完全に機能するWebViewコンポーネント";
}
```

**作成するコンポーネント**：
- デフォルト/設定可能なURLでWebViewをレンダリング
- URLを動的に設定するプロップス
- ページロード完了時のイベントハンドラー
- 進捗イベント（オプション）

**詳細ドキュメント**: [`native-view-tutorial.md`](./modules/native-view-tutorial.md)

### Config Pluginとネイティブモジュール

Config Pluginを使用してネイティブ設定ファイルを変更する方法を学びます。

```typescript
interface ConfigPluginTutorial {
  topics: [
    "Config Pluginの作成",
    "ネイティブ設定ファイルの変更",
    "カスタムメタデータの注入",
    "ネイティブコードからの値の読み取り"
  ];
  targets: {
    android: "AndroidManifest.xml";
    ios: "Info.plist";
  };
}
```

**実装例**：
```typescript
const withMyApiKey: ConfigPlugin<Props> = (config, { apiKey }) => {
  // iOS: Info.plistにAPIキーを追加
  config = withInfoPlist(config, (config) => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  // Android: AndroidManifest.xmlにメタデータを追加
  config = withAndroidManifest(config, (config) => {
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );
    return config;
  });

  return config;
};
```

**詳細ドキュメント**: [`config-plugin-and-native-module-tutorial.md`](./modules/config-plugin-and-native-module-tutorial.md)

## 🔗 サードパーティライブラリの統合

### ライブラリのラップ

既存のネイティブライブラリをExpo Modulesでラップします。

```typescript
interface ThirdPartyIntegration {
  process: [
    "新しいモジュールの作成",
    "ネイティブ依存関係の追加",
    "TypeScript型定義の作成",
    "プラットフォーム固有のコードの実装",
    "サンプルアプリの作成"
  ];
  examples: {
    android: "MPAndroidChart";
    ios: "Charts";
  };
}
```

**Android依存関係**：
```gradle
dependencies {
  implementation project(':expo-modules-core')
  implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
}
```

**iOS依存関係**：
```ruby
Pod::Spec.new do |s|
  s.dependency 'ExpoModulesCore'
  s.dependency 'Charts', '~> 5.1.0'
end
```

**詳細ドキュメント**: [`third-party-library.md`](./modules/third-party-library.md)

### 既存ライブラリの移行

既存のReact NativeライブラリをExpo Modules APIに移行します。

```typescript
interface LibraryMigration {
  steps: [
    "expo-module.config.jsonの作成",
    "依存関係の追加",
    "ネイティブモジュールファイルの作成",
    "expo-module.config.jsonの更新",
    "TypeScriptファイルの作成"
  ];
  benefits: [
    "Expo Autolinkingによる自動リンク",
    "Lifecycle ListenersとAppDelegate Subscribersへのアクセス",
    "モダンなSwift/Kotlin APIの活用",
    "段階的なライブラリの近代化"
  ];
}
```

**詳細ドキュメント**: [`existing-library.md`](./modules/existing-library.md)

## ⚙️ Autolinkingシステム

### Autolinkingの仕組み

ネイティブ依存関係のリンク処理を自動化します。

```typescript
interface AutolinkingSystem {
  process: [
    "react-native.config.jsをチェック（オプション）",
    "指定された検索パスを検索",
    "ローカルモジュールディレクトリを検索",
    "アプリの依存関係を再帰的に解決"
  ];
  configuration: {
    searchPaths: "モジュールを検索するカスタムディレクトリ";
    nativeModulesDir: "ローカルモジュールディレクトリ（デフォルト: ./modules）";
    exclude: "Autolinkingから除外するパッケージ";
  };
}
```

**CLIコマンド**：
```bash
# Expoモジュールを検索
npx expo-modules-autolinking search

# プラットフォーム固有の詳細を取得
npx expo-modules-autolinking resolve --platform ios
npx expo-modules-autolinking resolve --platform android

# モジュールの競合をチェック
npx expo-modules-autolinking verify
```

**詳細ドキュメント**: [`autolinking.md`](./modules/autolinking.md)

## 🛠️ モジュール設定

### expo-module.config.json

モジュールの設定とAutolinkingに必要な設定ファイルです。

```typescript
interface ModuleConfig {
  platforms: ["android", "ios", "apple", "web"];
  android: {
    modules: "完全修飾クラス名の配列";
    reactActivityLifecycleListeners: "Activityライフサイクルリスナー";
    applicationLifecycleListeners: "Applicationライフサイクルリスナー";
  };
  apple: {
    modules: "クラス名の配列";
    appDelegateSubscribers: "AppDelegateサブスクライバー";
  };
}
```

**基本設定例**：
```json
{
  "platforms": ["android", "apple"],
  "android": {
    "modules": ["com.example.MyModule"]
  },
  "apple": {
    "modules": ["MyModule"],
    "appDelegateSubscribers": ["MyAppDelegateSubscriber"]
  }
}
```

**詳細ドキュメント**: [`module-config.md`](./modules/module-config.md)

## 🔄 ライフサイクル統合

### Android Lifecycle Listeners

Android ActivityおよびApplicationライフサイクルイベントにフックします。

```typescript
interface AndroidLifecycleListeners {
  activity: {
    callbacks: [
      "onCreate",
      "onResume",
      "onPause",
      "onDestroy",
      "onNewIntent",
      "onBackPressed"
    ];
    useCases: [
      "ディープリンクの処理",
      "アプリ状態の追跡",
      "バックボタンのカスタマイズ"
    ];
  };
  application: {
    callbacks: [
      "onCreate",
      "onConfigurationChanged"
    ];
    useCases: [
      "グローバル初期化",
      "設定変更の処理"
    ];
  };
}
```

**実装例**：
```kotlin
class MyActivityLifecycleListener : ReactActivityLifecycleListener {
  override fun onCreate(activity: Activity?, savedInstanceState: Bundle?) {
    println("Activity onCreate")
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

**詳細ドキュメント**: [`android-lifecycle-listeners.md`](./modules/android-lifecycle-listeners.md)

### iOS AppDelegate Subscribers

iOSシステムイベントにフックします。

```typescript
interface iOSAppDelegateSubscribers {
  lifecycle: {
    callbacks: [
      "didFinishLaunchingWithOptions",
      "applicationDidBecomeActive",
      "applicationWillResignActive",
      "applicationDidEnterBackground",
      "applicationWillEnterForeground",
      "applicationWillTerminate"
    ];
  };
  url: {
    callbacks: [
      "application(_:open:options:)",
      "application(_:continue:restorationHandler:)"
    ];
    useCases: ["URLスキーム処理", "ユニバーサルリンク処理"];
  };
  notification: {
    callbacks: [
      "didRegisterForRemoteNotificationsWithDeviceToken",
      "didFailToRegisterForRemoteNotificationsWithError",
      "didReceiveRemoteNotification"
    ];
  };
}
```

**実装例**：
```swift
public class MyAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    print("App finished launching")
    return true
  }

  public func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    print("URL opened: \(url.absoluteString)")
    return handleDeepLink(url)
  }
}
```

**詳細ドキュメント**: [`appdelegate-subscribers.md`](./modules/appdelegate-subscribers.md)

## 🧪 テストとモッキング

### モックの提供

ネイティブ呼び出しをモックしてテストを実行します。

```typescript
interface MockingSupport {
  approach: "Jest と jest-expo preset";
  location: "mocks ディレクトリ";
  automation: "npx expo-modules-test-core generate-ts-mocks";
  benefits: [
    "実際のデバイスなしでテスト可能",
    "一貫したモック動作",
    "開発とテストがより容易"
  ];
}
```

**モック実装例**：
```typescript
// mocks/expo-my-module.ts
export async function hasStringAsync(): Promise<boolean> {
  return false;
}

export function getTheme(): string {
  return 'light';
}

export function setTheme(theme: string): void {
  console.log(`Mock: Setting theme to ${theme}`);
}
```

**テスト例**：
```typescript
import * as MyModule from 'expo-my-module';

describe('MyModule', () => {
  it('should return false for hasStringAsync', async () => {
    const result = await MyModule.hasStringAsync();
    expect(result).toBe(false);
  });
});
```

**詳細ドキュメント**: [`mocking.md`](./modules/mocking.md)

## 🌐 追加プラットフォームサポート

### サポートされるプラットフォーム

```typescript
interface PlatformSupport {
  primary: {
    android: "完全サポート";
    ios: "完全サポート";
  };
  additional: {
    macOS: "react-native-macosが必要";
    tvOS: "react-native-tvosが必要";
    web: "完全サポート";
    windows: "実験的（react-native-windowsが必要）";
  };
}
```

### macOSサポート

```typescript
interface macOSSupport {
  configuration: {
    platform: "apple";
    podspec: "osx => '10.15'を追加";
  };
  implementation: {
    conditionalCompilation: "#if os(macOS)";
    uiFramework: "AppKit（UIKitではない）";
    polyfills: ["UIColor → NSColor", "UIView → NSView"];
  };
}
```

**実装例**：
```swift
#if os(iOS)
import UIKit
#elseif os(macOS)
import AppKit
#endif

#if os(macOS)
typealias PlatformColor = NSColor
typealias PlatformView = NSView
#else
typealias PlatformColor = UIColor
typealias PlatformView = UIView
#endif
```

### Webサポート

```typescript
interface WebSupport {
  implementation: {
    files: ["*.web.tsx", "*.web.ts"];
    apis: "Web標準API";
  };
  example: {
    view: "divとHTMLでレンダリング";
    module: "window API使用";
  };
}
```

**実装例**：
```typescript
// src/MyModule.web.ts
export function getPlatform(): string {
  return 'web';
}

export function showNativeAlert(title: string, message: string): void {
  window.alert(`${title}\n\n${message}`);
}
```

**詳細ドキュメント**: [`additional-platform-support.md`](./modules/additional-platform-support.md)

## 🎨 デザイン哲学

### 設計原則

```typescript
interface DesignPhilosophy {
  principles: {
    modernLanguage: "Swift/Kotlin優先でObjective-C/Java非推奨";
    typeSystem: "型安全性とコンパイル時検証";
    minimalBoilerplate: "最小限のボイラープレート";
    crossPlatform: "クロスプラットフォーム一貫性";
  };
  patterns: {
    singleton: "グローバル状態管理";
    observer: "イベントベース通信";
    factory: "複雑なオブジェクト生成";
  };
  performance: {
    serialization: "効率的なデータシリアライゼーション";
    async: "非同期処理の適切な使用";
    memory: "メモリ管理とキャッシング";
  };
}
```

### セキュリティベストプラクティス

```typescript
interface SecurityPractices {
  inputValidation: "すべての入力を検証";
  secureStorage: "KeychainとEncryptedSharedPreferences使用";
  permissions: "適切な権限チェック";
  errorHandling: "機密情報を漏らさない";
}
```

**詳細ドキュメント**: [`design.md`](./modules/design.md)

## 🎯 実装パターンとベストプラクティス

### チーム開発のモジュール構成

```typescript
interface TeamModuleOrganization {
  smallTeam: {
    size: "2-5人";
    structure: "オーナー1人、管理者1人、残り開発者";
    approach: "ローカルモジュールまたはモノレポ";
  };
  mediumTeam: {
    size: "6-20人";
    structure: "複数の管理者、開発者チーム";
    approach: "モノレポとnpmパッケージの併用";
  };
  enterpriseTeam: {
    size: "20+人";
    structure: "部門ごとの管理者、プロジェクトチーム";
    approach: "プライベートnpmレジストリとモノレポ";
  };
}
```

### モジュール配布戦略

```typescript
interface DistributionStrategy {
  monorepo: {
    advantages: [
      "ローカル開発が容易",
      "即座にテスト可能",
      "バージョン管理が不要"
    ];
    tools: ["pnpm workspace", "Yarn workspace", "Turborepo"];
  };
  npmPublish: {
    advantages: [
      "広く配布可能",
      "バージョン管理",
      "コミュニティでの共有"
    ];
    alternatives: ["Tarball", "Verdaccio", "プライベートレジストリ"];
  };
}
```

### セキュリティチェックリスト

```typescript
interface SecurityChecklist {
  development: [
    "✅ すべての入力を検証",
    "✅ 機密データは安全なストレージに保存",
    "✅ 権限を適切にチェック",
    "✅ エラーメッセージで機密情報を漏らさない"
  ];
  deployment: [
    "✅ Config Pluginで環境変数を使用",
    "✅ APIキーをハードコードしない",
    "✅ リリースビルドでデバッグログを無効化"
  ];
  testing: [
    "✅ セキュリティ関連機能のテスト",
    "✅ モックで機密データを扱わない",
    "✅ 権限エラーのテスト"
  ];
}
```

## 🔗 関連リソース

### 内部リンク

- [overview.md](./modules/overview.md) - Expo Modules API概要
- [get-started.md](./modules/get-started.md) - 入門ガイド
- [module-api.md](./modules/module-api.md) - APIリファレンス
- [native-module-tutorial.md](./modules/native-module-tutorial.md) - ネイティブモジュールチュートリアル
- [native-view-tutorial.md](./modules/native-view-tutorial.md) - ネイティブビューチュートリアル
- [config-plugin-and-native-module-tutorial.md](./modules/config-plugin-and-native-module-tutorial.md) - Config Pluginチュートリアル
- [third-party-library.md](./modules/third-party-library.md) - サードパーティライブラリ統合
- [existing-library.md](./modules/existing-library.md) - 既存ライブラリの移行
- [autolinking.md](./modules/autolinking.md) - Autolinkingシステム
- [module-config.md](./modules/module-config.md) - モジュール設定
- [android-lifecycle-listeners.md](./modules/android-lifecycle-listeners.md) - Android Lifecycle Listeners
- [appdelegate-subscribers.md](./modules/appdelegate-subscribers.md) - iOS AppDelegate Subscribers
- [use-standalone-expo-module-in-your-project.md](./modules/use-standalone-expo-module-in-your-project.md) - スタンドアロンモジュール使用
- [mocking.md](./modules/mocking.md) - モッキングとテスト
- [additional-platform-support.md](./modules/additional-platform-support.md) - 追加プラットフォームサポート
- [design.md](./modules/design.md) - デザイン哲学

### 外部リンク

- [Expo Modules Documentation](https://docs.expo.dev/modules/) - 公式ドキュメント
- [Expo GitHub Repository](https://github.com/expo/expo) - ソースコード
- [Expo Modules Core](https://github.com/expo/expo/tree/main/packages/expo-modules-core) - コアライブラリ

### 関連ドキュメント

- **[EAS Build](../build/)** - ネイティブモジュールのビルド設定
- **[Workflow](../workflow/)** - 開発ワークフローとモジュール統合
- **[Accounts](../accounts.md)** - アカウント管理とアクセス制御

## 📋 まとめ

Expo Modules APIは、モダンなネイティブモジュール開発のための包括的なフレームワークです：

```typescript
interface ExpoModulesSummary {
  strengths: [
    "モダンな言語（Swift/Kotlin）優先",
    "最小限のボイラープレート（80-90%削減）",
    "型安全性とコンパイル時検証",
    "React Native New Architecture自動サポート",
    "包括的なライフサイクル統合",
    "マルチプラットフォーム対応"
  ];

  useCases: [
    "カスタムネイティブ機能の統合",
    "サードパーティSDKのラップ",
    "既存ライブラリの近代化",
    "プラットフォーム固有の機能追加",
    "システム機能へのアクセス"
  ];

  developmentApproaches: {
    local: "既存アプリにローカルモジュールとして追加";
    standalone: "再利用可能なモジュールとして開発";
    monorepo: "複数モジュールをモノレポで管理";
    npm: "npmパッケージとして公開・配布";
  };

  keyFeatures: {
    api: "関数、イベント、プロパティ、ビューの統一API";
    autolinking: "自動リンクと依存関係解決";
    lifecycle: "Android Lifecycle ListenersとiOS AppDelegate Subscribers";
    configPlugin: "ネイティブ設定の自動化";
    testing: "包括的なモッキングとテストサポート";
    multiPlatform: "macOS、tvOS、Web、Windowsサポート";
  };

  nextSteps: [
    "適切な開発アプローチの選択（ローカル/スタンドアロン）",
    "基本チュートリアルの実行",
    "APIリファレンスの確認",
    "実際のユースケースでの実装",
    "テストとモッキングの追加",
    "必要に応じてConfig Pluginの実装"
  ];
}
```

このガイドを参考に、プロジェクトの要件に応じた最適なネイティブモジュール開発を実装してください。Expo Modules APIの強力な機能を活用することで、効率的でメンテナンス性の高いクロスプラットフォームネイティブ機能を構築できます。
