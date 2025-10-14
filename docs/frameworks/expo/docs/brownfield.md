# Expo Brownfield統合 - 既存ネイティブアプリへの包括的統合ガイド

## 📋 概要

Expo Brownfield統合は、既存のネイティブモバイルアプリケーション（Android/iOS）にReact NativeとExpoツールを段階的に統合するためのアプローチです。アプリ全体を書き換えることなく、モダンなクロスプラットフォーム開発の利点を享受できます。

```typescript
interface ExpoBrownfieldIntegration {
  approach: {
    type: "段階的統合"
    target: "既存ネイティブアプリ"
    scope: "部分的なReact Native導入"
  }
  support: {
    fullySupported: [
      "Expo SDK",
      "Expo Modules API",
      "Expo CLI",
      "EAS Build",
      "EAS Submit",
      "EAS Update"
    ]
    notSupported: [
      "Expo Router",
      "Expo Dev Client"
    ]
  }
  status: "実験的サポート"
}
```

## 🎯 Brownfield vs Greenfield

### Brownfieldアプリ

```typescript
interface BrownfieldApp {
  definition: "既存のネイティブアプリにReact Nativeを段階的に統合"
  characteristics: {
    codebase: "既存のネイティブコードベース（Java/Kotlin、Swift/Objective-C）"
    reactNativeScope: "一部の画面・機能のみ"
    coexistence: "ネイティブとReact Nativeが共存"
    integration: "段階的な統合アプローチ"
  }
  useCases: [
    "既存アプリの段階的モダナイゼーション",
    "ネイティブスキルとReact Nativeスキルの両方を活用",
    "リスクを最小化した移行",
    "特定機能のクロスプラットフォーム化"
  ]
}
```

**主な特徴**：
- ✅ 既存のネイティブコードベースを保持
- ✅ React Nativeは一部機能に限定
- ✅ ネイティブとReact Nativeの並行開発
- ✅ 段階的な移行が可能

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md)

### Greenfieldアプリ

```typescript
interface GreenfieldApp {
  definition: "ExpoまたはReact Nativeで最初から作成されたアプリ"
  characteristics: {
    codebase: "React Native中心"
    nativeCode: "最小限のネイティブコード"
    expoTools: "Expoツールをフル活用"
    architecture: "React Native優先設計"
  }
  advantages: [
    "完全なExpoツールサポート",
    "シンプルな開発体験",
    "統一されたアーキテクチャ",
    "最小限の設定"
  ]
}
```

**比較表**：

| 特徴 | Brownfield | Greenfield |
|------|-----------|-----------|
| 開発開始時点 | 既存ネイティブアプリあり | ゼロから新規作成 |
| ネイティブコード | 大量に存在 | 最小限 |
| React Nativeの範囲 | 部分的 | 全体的 |
| 統合の複雑さ | 高い | 低い |
| Expoツールサポート | 部分的 | 完全 |
| 移行リスク | 低い（段階的） | なし（新規） |

## 🛠️ Expoツール互換性マトリックス

### 完全サポートツール

#### Expo SDK

```typescript
interface ExpoSDKSupport {
  status: "✅ 完全サポート"
  description: "すべてのExpo SDKパッケージが利用可能"

  installation: {
    command: "npx expo install <package-name>"
    examples: [
      "expo-camera",
      "expo-location",
      "expo-file-system",
      "expo-notifications",
      "expo-sensors",
      "expo-media-library"
    ]
  }

  integration: {
    approach: "標準的なnpmパッケージと同様"
    autolinking: "Expo Modules autolinkingが自動設定"
    configuration: "app.jsonで追加設定が可能"
  }
}
```

**インストール例**：
```bash
# カメラとロケーション機能を追加
npx expo install expo-camera expo-location

# 通知機能を追加
npx expo install expo-notifications
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#expo-sdk)

#### Expo Modules API

```typescript
interface ExpoModulesAPISupport {
  status: "✅ 完全サポート"
  description: "カスタムネイティブモジュールを簡単に作成"

  creation: {
    command: "npx create-expo-module@latest --local"
    location: "プロジェクト内にローカルモジュールを作成"
    languages: ["Swift", "Kotlin"]
  }

  benefits: [
    "型安全なネイティブモジュール開発",
    "自動型生成とTypeScriptサポート",
    "iOS/Android両方を統一APIで実装",
    "既存ネイティブコードとの統合が容易"
  ]
}
```

**カスタムモジュール作成例**：
```bash
# ローカルExpoモジュールを作成
npx create-expo-module@latest --local

# モジュール名を入力
# → modules/my-custom-module/ が作成される
```

#### Expo CLI

```typescript
interface ExpoCLISupport {
  status: "✅ 完全サポート"
  description: "プロジェクト管理とビルドツール"

  commands: {
    start: "npx expo start"
    runAndroid: "npx expo run:android"
    runIOS: "npx expo run:ios"
    install: "npx expo install <package>"
    prebuild: "npx expo prebuild"
  }

  features: {
    devServer: "Metro bundler自動起動"
    autolinking: "ネイティブモジュール自動リンク"
    debugging: "React Native Debugger統合"
  }
}
```

**基本コマンド**：
```bash
# 開発サーバー起動
npx expo start

# Androidで実行
npx expo run:android

# iOSで実行
npx expo run:ios
```

#### EAS Build

```typescript
interface EASBuildSupport {
  status: "✅ 完全サポート"
  description: "クラウドベースのビルドサービス"

  advantages: {
    noLocalSetup: "ローカルのXcode/Android Studio不要"
    consistency: "一貫したビルド環境"
    performance: "高速なビルド時間"
    ciCdIntegration: "CI/CDパイプライン統合"
  }

  commands: {
    configure: "eas build:configure"
    buildAndroid: "eas build --platform android"
    buildIOS: "eas build --platform ios"
    buildAll: "eas build --platform all"
  }

  configuration: {
    file: "eas.json"
    profiles: ["development", "preview", "production"]
  }
}
```

**EAS Build設定例**：
```bash
# EAS Buildを設定
eas build:configure

# Androidビルド
eas build --platform android

# iOSビルド
eas build --platform ios

# 両方のプラットフォームをビルド
eas build --platform all
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#eas-build)

#### EAS Submit

```typescript
interface EASSubmitSupport {
  status: "✅ 完全サポート"
  description: "アプリストア自動提出サービス"

  targets: {
    googlePlay: "Google Play Store"
    appStore: "Apple App Store"
  }

  commands: {
    submitAndroid: "eas submit --platform android"
    submitIOS: "eas submit --platform ios"
  }

  requirements: {
    android: ["Google Play Console API access", "Service account JSON key"]
    ios: ["App Store Connect API key", "App-specific password"]
  }
}
```

**アプリストア提出例**：
```bash
# Google Play Storeに提出
eas submit --platform android

# Apple App Storeに提出
eas submit --platform ios
```

#### EAS Update

```typescript
interface EASUpdateSupport {
  status: "✅ 完全サポート"
  description: "Over-the-Air (OTA) アップデート配信"

  capabilities: {
    instantUpdates: "アプリストア審査を待たずに即座に更新"
    bugFixes: "バグ修正の迅速な配信"
    abTesting: "A/Bテストのサポート"
    rollback: "問題発生時の即座のロールバック"
  }

  commands: {
    configure: "eas update:configure"
    publish: "eas update --branch <branch-name>"
    production: "eas update --branch production"
  }

  workflow: {
    development: "頻繁なイテレーション"
    staging: "QA環境での検証"
    production: "本番環境への段階的ロールアウト"
  }
}
```

**OTA更新の配信例**：
```bash
# EAS Updateを設定
eas update:configure

# 本番環境に更新を配信
eas update --branch production

# ステージング環境に配信
eas update --branch staging
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#eas-update)

### サポートされていないツール

#### Expo Router

```typescript
interface ExpoRouterLimitation {
  status: "❌ サポートなし"
  reason: "アプリ全体のルーティング構造を定義する必要があるため"

  conflicts: {
    nativeNavigation: "既存のネイティブナビゲーションシステムと競合"
    appStructure: "アプリ全体のファイルベースルーティングが必要"
    integration: "部分的な統合が不可能"
  }

  alternatives: {
    reactNavigation: {
      library: "React Navigation"
      compatibility: "Brownfield対応"
      integration: "React Nativeコンポーネント内で使用可能"
    }
    nativeNavigation: {
      approach: "既存のネイティブナビゲーションを継続使用"
      bridging: "React Native画面をネイティブから起動"
    }
  }
}
```

**代替アプローチ**：
```typescript
// React Navigationを使用
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#expo-router)

#### Expo Dev Client

```typescript
interface ExpoDevClientLimitation {
  status: "❌ サポートなし"
  reason: "アプリ全体の開発環境を定義する必要があるため"

  conflicts: {
    developmentBuild: "既存のネイティブビルド設定と競合"
    debuggingTools: "ネイティブとReact Nativeのデバッグツールが混在"
    hotReload: "ネイティブコードとの統合で制限"
  }

  alternatives: {
    standardDebugger: {
      tool: "React Native Debugger"
      features: ["Redux DevTools", "React DevTools", "Network Inspector"]
    }
    nativeTools: {
      android: "Android Studio Debugger"
      ios: "Xcode Debugger"
    }
    metroDebugger: {
      tool: "Metro Bundler内蔵デバッガー"
      access: "ブラウザでlocalhost:8081/debugger-ui"
    }
  }
}
```

**代替デバッグアプローチ**：
```bash
# React Native標準デバッガーを使用
# アプリ内でShake → "Debug" を選択

# Chrome DevToolsを使用
# Metro bundlerで自動的にデバッガーが開く
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#expo-dev-client)

## 🔧 統合手順

### Android統合

#### 1. プロジェクト構造の設定

```typescript
interface AndroidProjectStructure {
  monorepo: {
    root: "my-app/"
    structure: {
      expoProject: "my-project/"
      androidProject: "android/"
      sharedDeps: "package.json"
    }
  }

  directoryLayout: `
my-app/
├── my-project/         # Expoプロジェクト
│   ├── app/            # React Nativeコード
│   ├── package.json
│   └── app.json
├── android/            # 既存のAndroidプロジェクト
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
└── package.json        # ルートpackage.json（オプション）
  `
}
```

**モノレポ設定（オプション）**：
```json
{
  "name": "my-app-monorepo",
  "private": true,
  "workspaces": [
    "my-project",
    "android",
    "ios"
  ]
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#プロジェクト構造の設定)

#### 2. Gradleファイルの設定

```typescript
interface GradleConfiguration {
  settingsGradle: {
    location: "android/settings.gradle"
    purpose: "Expo Modulesのautolinking設定"
    content: `
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()

include ':app'
    `
  }

  buildGradle: {
    location: "android/build.gradle"
    purpose: "React Nativeとビルドツールバージョンの設定"
    versions: {
      buildToolsVersion: "34.0.0"
      minSdkVersion: 23
      compileSdkVersion: 34
      targetSdkVersion: 34
      gradlePlugin: "8.1.1"
    }
  }
}
```

**settings.gradle設定**：
```gradle
// android/settings.gradle
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()

include ':app'
```

**build.gradle設定**：
```gradle
// android/build.gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 34
        targetSdkVersion = 34
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.1")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#gradleファイルの変更)

#### 3. AndroidManifest.xmlの更新

```typescript
interface AndroidManifestConfig {
  location: "android/app/src/main/AndroidManifest.xml"
  requirements: {
    permissions: ["INTERNET"]
    activities: ["ReactActivity"]
  }

  configuration: `
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme">

        <!-- 既存のアクティビティ -->

        <!-- React Nativeアクティビティを追加 -->
        <activity
            android:name=".ReactActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
        </activity>
    </application>
</manifest>
  `
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#androidmanifestxmlの更新)

#### 4. ReactActivityの作成

```java
// android/app/src/main/java/com/myapp/ReactActivity.java
package com.myapp;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class ReactActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "MyProject";  // app.jsonのnameと一致させる
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            DefaultNewArchitectureEntryPoint.getFabricEnabled()
        );
    }
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#reactactivityの作成)

#### 5. MainApplicationクラスの設定

```java
// android/app/src/main/java/com/myapp/MainApplication.java
package com.myapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                return new PackageList(this).getPackages();
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }

            @Override
            protected boolean isNewArchEnabled() {
                return DefaultNewArchitectureEntryPoint.getFabricEnabled();
            }

            @Override
            protected Boolean isHermesEnabled() {
                return true;
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#applicationクラスの設定)

### iOS統合

#### 1. Podfileの作成

```typescript
interface PodfileConfiguration {
  location: "ios/Podfile"
  purpose: "CocoaPodsでReact NativeとExpo Modulesを統合"

  requirements: {
    iosVersion: "15.1"
    hermesEnabled: true
    fabricEnabled: false
  }

  configuration: `
require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")

platform :ios, '15.1'

target 'MyApp' do
  use_expo_modules!
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end
end
  `
}
```

**Podfileインストール**：
```bash
cd ios
pod install
cd ..
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#podfileの作成変更)

#### 2. Xcodeビルドフェーズの追加

```typescript
interface XcodeBuildPhases {
  startPackager: {
    name: "Start Packager"
    order: "最初のビルドフェーズ"
    purpose: "Metro bundlerの自動起動"
    script: `
export RCT_METRO_PORT="\${RCT_METRO_PORT:=8081}"
echo "export RCT_METRO_PORT=\${RCT_METRO_PORT}" > "\${SRCROOT}/../node_modules/react-native/scripts/.packager.env"
if [ -z "\${RCT_NO_LAUNCH_PACKAGER+xxx}" ] ; then
  if nc -w 5 -z localhost \${RCT_METRO_PORT} ; then
    if ! curl -s "http://localhost:\${RCT_METRO_PORT}/status" | grep -q "packager-status:running" ; then
      echo "Port \${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"
      exit 2
    fi
  else
    open "$SRCROOT/../node_modules/react-native/scripts/launchPackager.command" || echo "Can't start packager automatically"
  fi
fi
    `
  }
}
```

**設定方法**：
1. Xcodeでプロジェクトを開く
2. プロジェクトナビゲーターでターゲットを選択
3. "Build Phases" タブを選択
4. "+" → "New Run Script Phase" をクリック
5. スクリプトを追加

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#xcodeでビルドフェーズを追加)

#### 3. ReactViewControllerの作成

```swift
// ios/MyApp/ReactViewController.swift
import UIKit
import React
import ExpoModulesCore

class ReactViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")

        let rootView = RCTRootView(
            bundleURL: jsCodeLocation,
            moduleName: "MyProject",  // app.jsonのnameと一致
            initialProperties: nil,
            launchOptions: nil
        )

        self.view = rootView
    }
}
```

**使用例**：
```swift
// 既存のViewControllerからReact Native画面を表示
let reactVC = ReactViewController()
navigationController?.pushViewController(reactVC, animated: true)
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#reactviewcontrollerの作成)

#### 4. Info.plistの設定

```typescript
interface InfoPlistConfig {
  location: "ios/MyApp/Info.plist"
  purpose: "開発時のローカルMetro bundlerへのHTTP接続許可"

  configuration: `
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
  `

  security: {
    scope: "開発環境のみ"
    production: "本番ビルドではHTTPSのみ使用"
  }
}
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#infoplistの設定)

## 🧪 統合テストとデバッグ

### 開発環境のセットアップ

```typescript
interface DevelopmentSetup {
  metroServer: {
    command: "npx expo start"
    alternativeCommand: "yarn start"
    location: "Expoプロジェクトディレクトリ"
    port: 8081
  }

  workflow: {
    step1: "Metro bundlerを起動"
    step2: "ネイティブアプリをビルド"
    step3: "React Native画面に移動"
    step4: "JavaScriptコンポーネントが読み込まれる"
  }
}
```

**開発サーバー起動**：
```bash
# Expoプロジェクトディレクトリで
cd my-project
npx expo start

# または
yarn start
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#統合のテスト)

### Androidビルドとテスト

```bash
# Android Studioで実行
# または

# コマンドラインでビルド
cd android
./gradlew assembleDebug

# インストール
./gradlew installDebug

# クリーンビルド（トラブル時）
./gradlew clean
./gradlew assembleDebug
```

### iOSビルドとテスト

```bash
# Xcodeで実行
# または

# コマンドラインでビルド
cd ios
xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug

# クリーンビルド（トラブル時）
# Xcodeで: Product > Clean Build Folder (Cmd + Shift + K)

# ポッドの再インストール
rm -rf Pods Podfile.lock
pod install
```

## 🔍 トラブルシューティングガイド

### Metro Bundler接続問題

```typescript
interface MetroBundlerTroubleshooting {
  symptom: "アプリがMetro bundlerに接続できない"

  diagnosis: {
    checks: [
      "Metro bundlerが実行中か確認",
      "ファイアウォール設定を確認",
      "ポート8081が開いているか確認",
      "ネットワーク接続を確認"
    ]
  }

  solutions: {
    restartServer: {
      command: "npx expo start --clear"
      description: "キャッシュをクリアして再起動"
    }
    checkPort: {
      command: "lsof -i :8081"
      description: "ポート使用状況を確認"
    }
    firewall: {
      action: "ファイアウォールでポート8081を開く"
      platforms: {
        macOS: "システム環境設定 > セキュリティとプライバシー > ファイアウォール"
        windows: "Windowsファイアウォールの設定"
      }
    }
  }
}
```

**解決手順**：
```bash
# 1. Metro bundlerを再起動
cd my-project
npx expo start --clear

# 2. ポート使用状況を確認
lsof -i :8081

# 3. 別のポートを使用
PORT=8082 npx expo start
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#metro-bundlerに接続できない)

### ビルドエラー

#### Android

```typescript
interface AndroidBuildTroubleshooting {
  commonErrors: {
    gradleSync: {
      symptom: "Gradle sync failed"
      solutions: [
        "Gradleキャッシュをクリア",
        "dependencies再インストール",
        "Android Studio再起動"
      ]
    }
    moduleNotFound: {
      symptom: "Module not found errors"
      solutions: [
        "node_modules再インストール",
        "Gradleクリーンビルド",
        "autolinking設定確認"
      ]
    }
  }
}
```

**解決手順**：
```bash
# Gradleクリーンビルド
cd android
./gradlew clean
./gradlew assembleDebug

# node_modules再インストール
cd ..
rm -rf node_modules
yarn install

# Gradleキャッシュをクリア
cd android
./gradlew cleanBuildCache
```

#### iOS

```typescript
interface IOSBuildTroubleshooting {
  commonErrors: {
    podInstall: {
      symptom: "Pod install errors"
      solutions: [
        "CocoaPodsキャッシュをクリア",
        "Podfile.lockを削除して再インストール",
        "Xcodeを再起動"
      ]
    }
    architectureMismatch: {
      symptom: "Architecture mismatch errors"
      solutions: [
        "Build Settings確認",
        "Excluded Architectures設定",
        "Rosetta使用（Apple Silicon Mac）"
      ]
    }
  }
}
```

**解決手順**：
```bash
# ポッドの完全再インストール
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install

# CocoaPodsキャッシュをクリア
pod cache clean --all
pod install

# Xcodeでクリーンビルド
# Product > Clean Build Folder (Cmd + Shift + K)
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#ビルドエラー)

### JavaScript読み込みエラー

```typescript
interface JavaScriptLoadingTroubleshooting {
  symptom: "JavaScriptバンドルが読み込まれない"

  possibleCauses: [
    "Metro bundlerが起動していない",
    "ネットワーク接続問題",
    "バンドル名の不一致",
    "キャッシュの問題"
  ]

  solutions: {
    clearCache: {
      command: "npx expo start --clear"
      description: "Metro bundlerキャッシュをクリア"
    }
    reinstallModules: {
      commands: [
        "rm -rf node_modules",
        "yarn install"
      ]
      description: "node_modulesを再インストール"
    }
    checkBundleName: {
      files: ["app.json", "ReactActivity.java", "ReactViewController.swift"]
      action: "すべてのファイルで同じモジュール名を使用していることを確認"
    }
  }
}
```

**解決手順**：
```bash
# 1. Metro bundlerを再起動（キャッシュクリア）
cd my-project
npx expo start --clear

# 2. node_modulesを再インストール
rm -rf node_modules
yarn install

# 3. Watchmanキャッシュをクリア（macOS/Linux）
watchman watch-del-all

# 4. 一時ファイルをクリア
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
```

**詳細ドキュメント**: [`get-started.md`](./brownfield/get-started.md#javascript読み込みエラー)

## 📚 実装パターンとベストプラクティス

### 段階的統合アプローチ

```typescript
interface IncrementalIntegrationStrategy {
  phase1: {
    title: "小さく始める"
    scope: "単一の画面や機能"
    approach: {
      target: "ユーザーに見えない画面から開始"
      examples: ["設定画面", "情報表示画面", "単純なフォーム"]
      risk: "低リスク"
    }
    validation: {
      testing: "十分なテストを実施"
      feedback: "ユーザーフィードバックを収集"
      metrics: "パフォーマンスメトリクスを測定"
    }
  }

  phase2: {
    title: "段階的に拡大"
    scope: "複数の画面や機能"
    approach: {
      expansion: "成功した機能を基に拡大"
      examples: ["一覧画面", "詳細画面", "インタラクティブ機能"]
      risk: "中リスク"
    }
    considerations: [
      "既存機能との統合",
      "ナビゲーションフローの統一",
      "状態管理の統合"
    ]
  }

  phase3: {
    title: "コア機能の移行"
    scope: "主要な機能やユーザーフロー"
    approach: {
      target: "ビジネスクリティカルな機能"
      examples: ["認証フロー", "決済処理", "主要なユーザージャーニー"]
      risk: "高リスク"
    }
    requirements: [
      "包括的なテスト",
      "段階的ロールアウト",
      "ロールバック計画",
      "監視とアラート"
    ]
  }
}
```

**実装チェックリスト**：
```typescript
interface ImplementationChecklist {
  planning: [
    "✅ 統合する機能の明確な定義",
    "✅ 既存コードへの影響分析",
    "✅ リスクアセスメント",
    "✅ ロールバック計画"
  ]

  development: [
    "✅ コードレビュー体制の確立",
    "✅ テスト戦略の策定",
    "✅ ドキュメンテーション",
    "✅ チーム間のコミュニケーション"
  ]

  testing: [
    "✅ ユニットテスト",
    "✅ 統合テスト",
    "✅ E2Eテスト",
    "✅ パフォーマンステスト",
    "✅ デバイステスト"
  ]

  deployment: [
    "✅ 段階的ロールアウト",
    "✅ 監視とメトリクス",
    "✅ ユーザーフィードバック収集",
    "✅ 緊急時対応計画"
  ]
}
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#ベストプラクティス)、[`get-started.md`](./brownfield/get-started.md#ベストプラクティス)

### チームコラボレーションパターン

```typescript
interface TeamCollaborationPattern {
  teamStructure: {
    nativeTeam: {
      responsibilities: [
        "既存ネイティブコードの保守",
        "ネイティブモジュールのブリッジング",
        "プラットフォーム固有機能の実装",
        "ビルドとリリースプロセス"
      ]
      skills: ["Swift/Objective-C", "Kotlin/Java", "Xcode", "Android Studio"]
    }
    reactNativeTeam: {
      responsibilities: [
        "React Nativeコンポーネント開発",
        "JavaScriptロジック実装",
        "UIコンポーネント作成",
        "状態管理"
      ]
      skills: ["TypeScript", "React", "React Native", "Expo"]
    }
  }

  communication: {
    regular: [
      "週次の統合ミーティング",
      "技術的な課題の共有",
      "API設計レビュー",
      "コードレビュー"
    ]
    documentation: [
      "ブリッジングAPI仕様書",
      "統合ガイドライン",
      "トラブルシューティングガイド",
      "ベストプラクティスドキュメント"
    ]
  }

  tooling: {
    sharedTools: [
      "Git/GitHub",
      "CI/CD パイプライン",
      "テストフレームワーク",
      "ドキュメンテーションツール"
    ]
    codeReview: {
      nativeCode: "ネイティブチームがレビュー"
      reactNativeCode: "React Nativeチームがレビュー"
      integration: "両チームが参加"
    }
  }
}
```

### コード品質とテスト戦略

```typescript
interface QualityAssuranceStrategy {
  testing: {
    unit: {
      reactNative: {
        framework: "Jest + React Testing Library"
        coverage: ">80%"
        scope: "コンポーネントロジック、ユーティリティ関数"
      }
      native: {
        frameworks: {
          android: "JUnit + Espresso"
          ios: "XCTest"
        }
        coverage: ">70%"
        scope: "ネイティブモジュール、ブリッジロジック"
      }
    }

    integration: {
      framework: "Detox (React Native E2E)"
      coverage: "主要なユーザーフロー"
      scope: "ネイティブ↔React Native統合ポイント"
    }

    manual: {
      scope: [
        "デバイス互換性",
        "パフォーマンス",
        "UIコンシステンシー",
        "ユーザー体験"
      ]
      devices: [
        "iOS: iPhone SE, iPhone 14, iPad",
        "Android: 様々なメーカー、APIレベル"
      ]
    }
  }

  codeQuality: {
    linting: {
      javascript: "ESLint + TypeScript ESLint"
      native: {
        android: "Android Lint"
        ios: "SwiftLint"
      }
    }
    formatting: {
      javascript: "Prettier"
      native: {
        android: "ktlint"
        ios: "SwiftFormat"
      }
    }
    typeChecking: {
      javascript: "TypeScript strict mode"
      native: "Strong typing enforcement"
    }
  }
}
```

## 🎯 アーキテクチャ決定パターン

### ネイティブ↔React Nativeブリッジング

```typescript
interface BridgingStrategy {
  communicationPatterns: {
    nativeToReactNative: {
      initialProps: {
        use: "画面起動時の初期データ渡し"
        example: `
// iOS
let initialProps = ["userId": "12345", "theme": "dark"]
let rootView = RCTRootView(
    bundleURL: jsCodeLocation,
    moduleName: "UserProfile",
    initialProperties: initialProps,
    launchOptions: nil
)
        `
      }
      events: {
        use: "ネイティブからReact Nativeへのイベント通知"
        implementation: "React Native Event Emitter"
      }
    }

    reactNativeToNative: {
      nativeModules: {
        use: "ネイティブ機能の呼び出し"
        example: `
// React Native側
import { NativeModules } from 'react-native';
const { MyNativeModule } = NativeModules;

await MyNativeModule.doSomething();
        `
      }
      callbacks: {
        use: "非同期結果の返却"
        implementation: "Promise-based API"
      }
    }
  }

  dataSharing: {
    storage: {
      shared: "AsyncStorage / UserDefaults / SharedPreferences"
      secure: "Keychain / Android Keystore"
    }
    inMemory: {
      approach: "Native Module経由でのデータ共有"
      caution: "シングルトンパターンの慎重な使用"
    }
  }
}
```

### ナビゲーション統合パターン

```typescript
interface NavigationIntegrationPattern {
  hybrid: {
    nativeStack: {
      description: "ネイティブナビゲーションスタックを維持"
      reactNativeScreens: "ネイティブスタックにReact Native画面をプッシュ"
      advantages: [
        "既存のナビゲーションフローを維持",
        "プラットフォームネイティブなアニメーション",
        "バックボタンの自然な動作"
      ]
    }

    reactNavigationWithinReactNative: {
      description: "React Native画面内でReact Navigationを使用"
      scope: "React Native領域内のナビゲーション"
      advantages: [
        "React Nativeの柔軟なナビゲーション",
        "クロスプラットフォーム一貫性",
        "豊富なナビゲーションパターン"
      ]
    }
  }

  deepLinking: {
    setup: {
      android: "Intent filters in AndroidManifest.xml"
      ios: "URL types in Info.plist"
    }
    handling: {
      native: "ネイティブ側でディープリンクを受信"
      reactNative: "initialPropsとして渡してReact Native画面を起動"
    }
  }
}
```

## 📊 パフォーマンス最適化

```typescript
interface PerformanceOptimization {
  bundleSize: {
    strategies: [
      "Code splitting（可能な範囲で）",
      "未使用ライブラリの削除",
      "Hermes JavaScriptエンジンの使用",
      "ProGuard/R8（Android）でのコード最適化"
    ]
    monitoring: {
      tool: "EAS Build size analytics"
      threshold: "増加を5%以内に抑える"
    }
  }

  startup: {
    optimization: [
      "React Nativeコンポーネントの遅延読み込み",
      "初期プロパティの最小化",
      "ネイティブモジュールの非同期初期化",
      "JavaScript bundleのプリロード"
    ]
    measurement: {
      metrics: ["Time to Interactive", "First Render Time"]
      tools: ["React Native Performance Monitor", "Xcode Instruments", "Android Profiler"]
    }
  }

  memory: {
    management: [
      "React Nativeビュー階層の適切な解放",
      "イベントリスナーのクリーンアップ",
      "画像キャッシュの管理",
      "メモリリークの定期的な監視"
    ]
    tools: {
      ios: "Xcode Memory Graph Debugger"
      android: "Android Studio Memory Profiler"
    }
  }
}
```

## 🔗 関連リソース

### 内部リンク
- [`overview.md`](./brownfield/overview.md) - Brownfield統合の概要と互換性
- [`get-started.md`](./brownfield/get-started.md) - 詳細な統合手順とトラブルシューティング

### 外部リンク
- [Expo Documentation](https://docs.expo.dev/) - 公式Expoドキュメント
- [React Native Documentation](https://reactnative.dev/) - React Native公式ドキュメント
- [Expo GitHub](https://github.com/expo/expo) - 問題報告とコントリビューション
- [Expo Forums](https://forums.expo.dev/) - コミュニティサポート

### 関連ドキュメント
- **[EAS Build](../build/)** - クラウドビルドサービスの設定と使用
- **[EAS Submit](../submit/)** - アプリストア提出の自動化
- **[EAS Update](../update/)** - OTAアップデートの配信
- **[Expo Modules](../modules/)** - カスタムネイティブモジュールの作成

## ⚠️ 重要な注意事項

### 実験的サポート

```typescript
interface ExperimentalSupport {
  status: "実験的"
  implications: {
    stability: "すべての機能がシームレスに動作するとは限らない"
    documentation: "ドキュメントが不完全な場合がある"
    support: "コミュニティサポートに依存する部分がある"
    updates: "APIや統合方法が変更される可能性がある"
  }

  recommendations: [
    "本番環境で使用する前に十分なテストを実施",
    "問題が発生した場合はGitHubで報告",
    "コミュニティフォーラムで質問と情報共有",
    "実験的に試行錯誤する姿勢",
    "バックアップとロールバック計画を準備"
  ]
}
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#重要な注意事項)

### 適応の課題

```typescript
interface IntegrationChallenges {
  buildConfiguration: {
    challenge: "ネイティブとReact Nativeのビルド設定の競合"
    examples: [
      "Gradle設定の競合",
      "CocoaPods依存関係の競合",
      "ビルドバージョンの不一致"
    ]
    mitigation: [
      "明確なビルド設定ドキュメント",
      "バージョン管理の徹底",
      "定期的な依存関係更新"
    ]
  }

  dependencyManagement: {
    challenge: "ネイティブとReact Nativeの依存関係管理"
    complexity: [
      "バージョン互換性の維持",
      "トランジティブ依存関係の競合",
      "ネイティブライブラリのアップデート"
    ]
    bestPractices: [
      "lockファイルの厳格な管理",
      "依存関係更新の慎重な計画",
      "互換性テストの自動化"
    ]
  }

  debugging: {
    challenge: "ネイティブとReact Nativeの両方をデバッグする複雑さ"
    difficulties: [
      "ブリッジ境界でのエラー追跡",
      "異なるデバッグツールの使用",
      "パフォーマンス問題の特定"
    ]
    strategies: [
      "包括的なロギング戦略",
      "エラー境界の明確化",
      "統合されたモニタリングツール"
    ]
  }
}
```

**詳細ドキュメント**: [`overview.md`](./brownfield/overview.md#適応の課題)

## 📋 まとめ

```typescript
interface ExpoBrownfieldSummary {
  keyTakeaways: [
    "既存ネイティブアプリに段階的にReact Nativeを統合可能",
    "主要なExpoツール（SDK、EAS Build、EAS Update）は完全サポート",
    "Expo RouterとExpo Dev Clientはサポート外",
    "実験的サポートのため、十分なテスト必須"
  ]

  benefits: {
    incrementalMigration: "アプリ全体を書き換えずに移行",
    riskMitigation: "小さく始めて段階的に拡大",
    skillLeverage: "既存のネイティブスキルとReact Nativeスキルの両方を活用",
    modernTools: "Expoの最新ツールとサービスを利用"
  }

  challenges: {
    buildComplexity: "ビルド設定の複雑さ増加",
    dependencyManagement: "依存関係管理の難しさ",
    debugging: "デバッグの複雑化",
    teamCoordination: "複数チーム間の調整"
  }

  successFactors: [
    "明確な統合戦略と段階的アプローチ",
    "チーム間の密なコミュニケーション",
    "包括的なテスト戦略",
    "十分なドキュメンテーション",
    "継続的な監視と改善"
  ]

  nextSteps: [
    "overview.mdで互換性を確認",
    "get-started.mdで詳細な統合手順を実施",
    "単一の画面から統合を開始",
    "段階的に範囲を拡大",
    "問題発生時はGitHubで報告"
  ]
}
```

**統合決定フロー**：

```
開始
  ↓
既存ネイティブアプリあり？
  ↓ Yes
段階的移行が必要？
  ↓ Yes
Brownfield統合を選択
  ↓
1. 互換性確認（overview.md）
  ↓
2. 統合手順実施（get-started.md）
  ↓
3. 単一画面で開始
  ↓
4. テストと検証
  ↓
5. 段階的拡大
  ↓
完了
```

このガイドを参考に、既存ネイティブアプリへのExpo統合を計画・実装してください。実験的サポートであることを念頭に、十分なテストとバックアップ計画を準備して進めることが成功の鍵です。
