# 既存のネイティブアプリにExpoを追加する方法

既存のネイティブモバイルアプリケーションに、React NativeとExpoを段階的に統合する方法を説明します。

## 概要

このガイドでは、既存のネイティブアプリケーションにReact NativeとExpoを統合する方法を説明します。アプリ全体を書き換えることなく、モダンなクロスプラットフォームツールを採用できます。

## 前提条件

### 必要なツール

- **Node.js**: LTSバージョン
- **Yarn**: パッケージマネージャー
- **CocoaPods**: iOS用（iOS開発の場合）
- **JavaScript開発環境**: 推奨

### 既存のプロジェクト

- Android: Android Studioプロジェクト
- iOS: Xcodeプロジェクト

## 統合手順

### 1. Expoプロジェクトの作成

既存のプロジェクトのルートディレクトリで、新しいExpoプロジェクトを作成します：

```bash
npx create-expo-app my-project
```

**説明**：
- 新しいディレクトリが作成されます
- TypeScriptのサンプルアプリケーションが含まれます
- React Nativeの設定が含まれます

### 2. プロジェクト構造の設定

#### モノレポの設定（オプション）

ルートレベルの`package.json`を作成して、モノレポを設定できます：

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

#### ディレクトリ構造

```
my-app/
├── my-project/         # Expoプロジェクト
│   ├── app/            # React Nativeコード
│   ├── package.json
│   └── app.json
├── android/            # 既存のAndroidプロジェクト
│   ├── app/
│   └── build.gradle
├── ios/                # 既存のiOSプロジェクト
│   ├── MyApp/
│   └── MyApp.xcodeproj
└── package.json        # ルートpackage.json（モノレポの場合）
```

## Android設定

### 1. Gradleファイルの変更

#### settings.gradle

`android/settings.gradle`に以下を追加：

```gradle
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()

include ':app'
```

#### build.gradle（プロジェクトレベル）

`android/build.gradle`に以下を追加：

```gradle
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

### 2. AndroidManifest.xmlの更新

`android/app/src/main/AndroidManifest.xml`を更新：

```xml
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
```

### 3. ReactActivityの作成

`android/app/src/main/java/com/myapp/ReactActivity.java`を作成：

```java
package com.myapp;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class ReactActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "MyProject";
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

### 4. Applicationクラスの設定

`android/app/src/main/java/com/myapp/MainApplication.java`を更新：

```java
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

## iOS設定

### 1. Podfileの作成/変更

`ios/Podfile`を作成または更新：

```ruby
require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")

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
```

### 2. ポッドのインストール

```bash
cd ios
pod install
cd ..
```

### 3. Xcodeでビルドフェーズを追加

Xcodeでプロジェクトを開き、以下のビルドフェーズを追加します：

#### Start Packager

**名前**: Start Packager

**スクリプト**:
```bash
export RCT_METRO_PORT="${RCT_METRO_PORT:=8081}"
echo "export RCT_METRO_PORT=${RCT_METRO_PORT}" > "${SRCROOT}/../node_modules/react-native/scripts/.packager.env"
if [ -z "${RCT_NO_LAUNCH_PACKAGER+xxx}" ] ; then
  if nc -w 5 -z localhost ${RCT_METRO_PORT} ; then
    if ! curl -s "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running" ; then
      echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"
      exit 2
    fi
  else
    open "$SRCROOT/../node_modules/react-native/scripts/launchPackager.command" || echo "Can't start packager automatically"
  fi
fi
```

### 4. ReactViewControllerの作成

`ios/MyApp/ReactViewController.swift`を作成：

```swift
import UIKit
import React
import ExpoModulesCore

class ReactViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")

        let rootView = RCTRootView(
            bundleURL: jsCodeLocation,
            moduleName: "MyProject",
            initialProperties: nil,
            launchOptions: nil
        )

        self.view = rootView
    }
}
```

### 5. Info.plistの設定

`ios/MyApp/Info.plist`に以下を追加：

```xml
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
```

## 統合のテスト

### 1. Metro bundlerの起動

```bash
cd my-project
yarn start
```

または：

```bash
cd my-project
npx expo start
```

### 2. アプリのビルドと実行

#### Android

Android Studioでプロジェクトを開き、アプリをビルドして実行します。または：

```bash
cd android
./gradlew assembleDebug
```

#### iOS

Xcodeでプロジェクトを開き、アプリをビルドして実行します。または：

```bash
cd ios
xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug
```

### 3. React Native画面の表示

アプリ内から、React Native画面に移動します。JavaScriptコンポーネントが読み込まれて表示されます。

## トラブルシューティング

### Metro bundlerに接続できない

#### 症状

アプリがMetro bundlerに接続できません。

#### 解決策

1. Metro bundlerが実行中か確認
2. ファイアウォール設定を確認
3. ポート8081が開いているか確認

### ビルドエラー

#### Android

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

#### iOS

1. Xcodeでワークスペースを開く
2. Clean Build Folder（Cmd + Shift + K）
3. ポッドを再インストール：
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   ```

### JavaScript読み込みエラー

#### 症状

JavaScriptバンドルが読み込まれません。

#### 解決策

1. Metro bundlerを再起動
2. キャッシュをクリア：
   ```bash
   npx expo start --clear
   ```
3. `node_modules`を再インストール：
   ```bash
   rm -rf node_modules
   yarn install
   ```

## ベストプラクティス

### 1. 小さく始める

単一の画面から始めて、段階的に範囲を拡大してください。

### 2. 既存のコードを維持

既存のネイティブコードを維持しながら、React Nativeを追加してください。

### 3. チームとのコミュニケーション

ネイティブとReact Nativeの両方のチームメンバーと密にコミュニケーションを取ってください。

### 4. 十分にテスト

両方のプラットフォームで十分にテストしてください。

## 次のステップ

### 1. Expo SDKライブラリの追加

```bash
cd my-project
npx expo install expo-camera expo-location
```

### 2. カスタムネイティブモジュールの作成

```bash
cd my-project
npx create-expo-module@latest --local
```

### 3. EAS Buildの設定

```bash
cd my-project
eas build:configure
```

## まとめ

既存のネイティブアプリにExpoを統合することで、アプリ全体を書き換えることなく、React Nativeとモダンなクロスプラットフォームツールを採用できます。段階的な統合アプローチにより、既存のコードベースを維持しながら、新しい機能をReact Nativeで実装できます。
