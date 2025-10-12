# 既存のReact NativeプロジェクトにExpoモジュールをインストール

既存のReact Nativeプロジェクトにexpoモジュールをインストールする方法を説明します。

## インストール方法

### 自動インストール（推奨）

ほとんどのプロジェクトに推奨される方法です：

```bash
npx install-expo-modules@latest
```

このコマンドは、以下を自動的に実行します：

1. `expo`パッケージのインストール
2. Android設定の更新
3. iOS設定の更新
4. 必要な依存関係のインストール

### 手動インストール

より細かい制御が必要な場合は、手動でインストールできます：

#### 1. expoパッケージのインストール

```bash
npm install expo
```

#### 2. Android設定の変更

後述の「Android設定」セクションを参照してください。

#### 3. iOS設定の変更

後述の「iOS設定」セクションを参照してください。

## 主な手順

### Android設定

#### 1. `android/build.gradle`の更新

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 34
        targetSdkVersion = 34
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.1")
    }
}
```

#### 2. `android/settings.gradle`の更新

```gradle
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()
```

#### 3. `android/app/build.gradle`の更新

```gradle
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()
```

### iOS設定

#### 1. `AppDelegate.swift`の更新

```swift
import ExpoModulesCore

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Expo modules
    ExpoModulesCore.ApplicationDelegate.initialize()

    return true
  }
}
```

#### 2. iOSデプロイメントターゲットを15.1に設定

`ios/Podfile`：

```ruby
platform :ios, '15.1'
```

#### 3. CocoaPodsのインストール

```bash
npx pod-install
```

## インストールの確認

### `expo-constants`のインストール

```bash
npx expo install expo-constants
```

### システムフォントをログに出力

`App.js`または`App.tsx`に追加：

```typescript
import Constants from 'expo-constants';

console.log('System fonts:', Constants.systemFonts);
```

アプリを実行してログを確認：

```bash
npx expo run:android
# または
npx expo run:ios
```

コンソールにシステムフォントのリストが表示されれば、インストールが成功しています。

## 追加のモジュールのインストール

Expo SDKパッケージを追加するには、`npx expo install`を使用します：

```bash
# カメラモジュールをインストール
npx expo install expo-camera

# 位置情報モジュールをインストール
npx expo install expo-location

# 複数のモジュールを一度にインストール
npx expo install expo-camera expo-location expo-image-picker
```

## 含まれるモジュール

Expoモジュールをインストールすると、以下のモジュールがデフォルトで含まれます：

### コアモジュール

- **`expo-asset`**: アセット管理
- **`expo-constants`**: アプリとデバイスの定数
- **`expo-file-system`**: ファイルシステムアクセス
- **`expo-font`**: カスタムフォントの読み込み
- **`expo-keep-awake`**: 画面をスリープさせない

## モジュールの除外（オプション）

特定のモジュールを除外するには、`package.json`で`expo.autolinking.exclude`を使用します：

```json
{
  "expo": {
    "autolinking": {
      "exclude": ["expo-keep-awake"]
    }
  }
}
```

これにより、`expo-keep-awake`モジュールが自動リンクから除外されます。

## トラブルシューティング

### Android

#### ビルドエラー

Gradleキャッシュをクリアします：

```bash
cd android
./gradlew clean
cd ..
```

#### 依存関係の競合

`android/build.gradle`で依存関係のバージョンを確認してください。

### iOS

#### ビルドエラー

Podsを再インストールします：

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Xcodeエラー

1. Xcodeでワークスペースを開く
2. Clean Build Folder（Cmd + Shift + K）
3. 再ビルド

## ベストプラクティス

### 1. 定期的な更新

Expoモジュールを定期的に更新してください：

```bash
npx expo install --fix
```

### 2. 互換性の確認

新しいモジュールをインストールする前に、互換性を確認してください。

### 3. 段階的な統合

一度にすべてのモジュールを統合するのではなく、段階的に統合してください。

### 4. テスト

各モジュールを統合した後、十分にテストしてください。

## 次のステップ

### 1. Expo CLIの使用

React Native CLIの代わりにExpo CLIを使用します：

```bash
npx expo run:android
npx expo run:ios
```

### 2. Expo SDKライブラリの探索

[Expo SDK API Reference](/versions/latest)で利用可能なライブラリを確認してください。

### 3. 開発ビルドの作成

```bash
npx expo install expo-dev-client
npx expo run:android
```

## まとめ

ExpoモジュールをReact Nativeプロジェクトに統合することで、Expo SDKライブラリとツールにアクセスできます。自動インストールを使用すると、設定が簡素化され、すぐに開発を開始できます。
