# 既存のReact Nativeプロジェクトにexpo-updatesをインストール

既存のReact Nativeプロジェクトに`expo-updates`をインストールする方法を説明します。

## 前提条件

- **`expo`パッケージがインストールされている必要があります**
- React Native CLIで作成されたプロジェクトの場合は、[Expoモジュールをインストール](/bare/installing-expo-modules)してください

## インストール

### 1. expo-updatesのインストール

```bash
npx expo install expo-updates
```

### 2. iOSポッドのインストール

```bash
npx pod-install
```

## expo-updatesライブラリの設定

### JavaScriptとJSON

#### EAS Updateの設定

```bash
eas update:configure
```

このコマンドは、`app.json`に更新URLとプロジェクトIDを設定します。

#### app.jsonの変更

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "extra": {
      "eas": {
        "projectId": "[your-project-id]"
      }
    }
  }
}
```

### Android設定

#### 1. `android/app/build.gradle`の変更

```gradle
apply from: "../../node_modules/expo-updates/scripts/create-manifest-android.gradle"
```

#### 2. `AndroidManifest.xml`の更新

`android/app/src/main/AndroidManifest.xml`に以下を追加：

```xml
<manifest>
  <application>
    <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="[your-update-url]"/>
    <meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
  </application>
</manifest>
```

#### 3. `strings.xml`にExpoランタイムバージョンを追加

`android/app/src/main/res/values/strings.xml`：

```xml
<resources>
  <string name="expo_runtime_version">1.0.0</string>
</resources>
```

### iOS設定

#### 1. `Podfile.properties.json`の追加

`ios/Podfile.properties.json`を作成：

```json
{
  "expo.updates.configuration": "Release"
}
```

#### 2. `Podfile`の変更

`ios/Podfile`に以下を追加：

```ruby
require 'json'
podfile_properties = JSON.parse(File.read('./Podfile.properties.json')) rescue {}

# ...

target 'YourApp' do
  use_expo_modules!
  config = use_native_modules!

  # expo-updatesの設定
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )

    # expo-updatesのネイティブファイル生成
    installer.target_installation_results.pod_target_installation_results.each do |pod_name, target_installation_result|
      if pod_name == 'EXUpdates'
        target_installation_result.native_target.build_configurations.each do |config|
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'EX_UPDATES_NATIVE_DEBUG=1' if config.name == 'Debug'
        end
      end
    end
  end
end
```

#### 3. `Expo.plist`の作成

プロジェクトのSupportingディレクトリに`Expo.plist`を作成：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>EXUpdatesCheckOnLaunch</key>
    <string>ALWAYS</string>
    <key>EXUpdatesEnabled</key>
    <true/>
    <key>EXUpdatesLaunchWaitMs</key>
    <integer>0</integer>
    <key>EXUpdatesRuntimeVersion</key>
    <string>1.0.0</string>
    <key>EXUpdatesURL</key>
    <string>[your-update-url]</string>
  </dict>
</plist>
```

## 更新の動作確認

### 1. アプリをビルド

```bash
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```

### 2. EAS Updateで更新を公開

```bash
eas update --branch production --message "First update"
```

### 3. アプリを再起動

アプリを再起動すると、更新がダウンロードされて適用されます。

## 次のステップ

### 1. EAS UpdateとEAS Buildを使用

EAS BuildとEAS Updateを組み合わせて使用します：

```bash
eas build --platform android
eas update --branch production
```

### 2. `expo-updates` APIリファレンスを参照

[`expo-updates` API Reference](/versions/latest/sdk/updates)で詳細を確認してください。

### 3. カスタム更新サーバーオプションを探索

独自の更新サーバーをホストすることも可能です。

## トラブルシューティング

### 更新がダウンロードされない

#### 確認事項

1. **ランタイムバージョンが一致しているか**：`app.json`と`Expo.plist`/`strings.xml`
2. **更新URLが正しいか**：`app.json`の`updates.url`
3. **ネットワーク接続を確認**

### ビルドエラー

#### Android

```bash
cd android
./gradlew clean
cd ..
npx expo run:android --variant release
```

#### iOS

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx expo run:ios --configuration Release
```

## ベストプラクティス

### 1. ランタイムバージョン管理

ランタイムバージョンを適切に管理してください：

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

### 2. 更新の段階的なロールアウト

すべてのユーザーに一度に更新を配信するのではなく、段階的にロールアウトしてください。

### 3. 更新のテスト

本番環境に配信する前に、更新を十分にテストしてください。

## まとめ

`expo-updates`をReact Nativeプロジェクトに統合することで、アプリストアを経由せずにJavaScriptの更新を配信できます。適切に設定することで、ユーザーエクスペリエンスを向上させ、バグ修正を迅速に配信できます。
