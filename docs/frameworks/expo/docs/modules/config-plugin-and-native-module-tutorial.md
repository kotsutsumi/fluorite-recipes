# Config Pluginとネイティブモジュールのチュートリアル

Expo Modules APIとConfig Pluginを組み合わせて、ネイティブ設定を管理する方法を学びます。

## チュートリアル概要

このチュートリアルでは、Config Pluginを使用してネイティブ設定ファイルを変更するモジュールを作成します。

**学習内容**：
- Config Pluginの作成
- ネイティブ設定ファイルの変更
- カスタムメタデータの注入
- ネイティブコードからの値の読み取り

**サポートプラットフォーム**：
- Android（AndroidManifest.xml）
- iOS（Info.plist）

## ステップ1: モジュールの初期化

### モジュールの作成

```bash
npx create-expo-module@latest expo-native-configuration
```

**プロンプト**：
```
? What is the name of the npm package? › expo-native-configuration
? What is the native module name? › ExpoNativeConfiguration
? What is the Android package name? › expo.modules.nativeconfiguration
```

### 不要なファイルの削除

```bash
cd expo-native-configuration

# デフォルトのビューファイルを削除
rm ios/ExpoNativeConfigurationView.swift
rm android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationView.kt
rm src/ExpoNativeConfigurationView.tsx
rm src/ExpoNativeConfiguration.types.ts
```

## ステップ2: 最小限のモジュール構造の作成

### Android モジュール（Kotlin）

```kotlin
// android/src/main/java/expo/modules/nativeconfiguration/ExpoNativeConfigurationModule.kt
package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoNativeConfigurationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      val packageManager = appContext.reactContext?.packageManager
      val applicationInfo = packageManager?.getApplicationInfo(
        appContext.reactContext?.packageName ?: "",
        android.content.pm.PackageManager.GET_META_DATA
      )
      applicationInfo?.metaData?.getString("MY_CUSTOM_API_KEY") ?: "No API Key"
    }
  }
}
```

### iOS モジュール（Swift）

```swift
// ios/ExpoNativeConfigurationModule.swift
import ExpoModulesCore

public class ExpoNativeConfigurationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoNativeConfiguration")

    Function("getApiKey") {
      return Bundle.main.object(forInfoDictionaryKey: "MY_CUSTOM_API_KEY") as? String ?? "No API Key"
    }
  }
}
```

### TypeScript モジュール定義

```typescript
// src/index.ts
import { requireNativeModule } from 'expo-modules-core';

const ExpoNativeConfiguration = requireNativeModule('ExpoNativeConfiguration');

export function getApiKey(): string {
  return ExpoNativeConfiguration.getApiKey();
}
```

## ステップ3: Config Pluginの開発

### プラグインディレクトリの作成

```bash
mkdir plugin
```

### TypeScript設定

```json
// plugin/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./build"
  },
  "exclude": ["**/__tests__", "**/__fixtures__", "**/__mocks__"],
  "include": ["./src"]
}
```

### package.jsonの更新

```json
{
  "scripts": {
    "build:plugin": "tsc --build plugin"
  }
}
```

### プラグインのソースコード

```typescript
// plugin/src/index.ts
import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withInfoPlist,
  withAndroidManifest,
} from '@expo/config-plugins';

const pkg = require('../../package.json');

type Props = {
  apiKey: string;
};

const withMyApiKey: ConfigPlugin<Props> = (config, { apiKey }) => {
  // iOS: Info.plistにAPIキーを追加
  config = withInfoPlist(config, (config) => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    return config;
  });

  // Android: AndroidManifest.xmlにメタデータを追加
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );

    return config;
  });

  return config;
};

export default createRunOncePlugin(withMyApiKey, pkg.name, pkg.version);
```

### プラグインのビルド

```bash
npm run build:plugin
```

## ステップ4: アプリでのConfig Pluginの使用

### app.jsonの設定

```json
{
  "expo": {
    "name": "Example App",
    "plugins": [
      [
        "../app.plugin.js",
        {
          "apiKey": "my_secret_api_key_12345"
        }
      ]
    ]
  }
}
```

または、TypeScript設定を使用する場合：

```typescript
// app.config.ts
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'Example App',
  plugins: [
    [
      '../app.plugin.js',
      {
        apiKey: process.env.API_KEY || 'default_api_key',
      },
    ],
  ],
};

export default config;
```

### アプリのプリビルド

```bash
npx expo prebuild --clean
```

## ステップ5: ネイティブ値の読み取り

### サンプルアプリでの使用

```typescript
// example/App.tsx
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as ExpoNativeConfiguration from 'expo-native-configuration';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const key = ExpoNativeConfiguration.getApiKey();
    setApiKey(key);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Configuration</Text>
      <Text style={styles.apiKey}>API Key: {apiKey}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  apiKey: {
    fontSize: 16,
    color: '#666',
  },
});
```

### アプリの実行

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 高度な Config Plugin の例

### 複数の設定値の管理

```typescript
// plugin/src/index.ts
type Props = {
  apiKey: string;
  apiUrl?: string;
  enableDebug?: boolean;
};

const withMyConfiguration: ConfigPlugin<Props> = (config, props) => {
  const { apiKey, apiUrl = 'https://api.example.com', enableDebug = false } = props;

  // iOS設定
  config = withInfoPlist(config, (config) => {
    config.modResults['MY_CUSTOM_API_KEY'] = apiKey;
    config.modResults['MY_CUSTOM_API_URL'] = apiUrl;
    config.modResults['MY_CUSTOM_DEBUG'] = enableDebug;
    return config;
  });

  // Android設定
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_KEY',
      apiKey
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_API_URL',
      apiUrl
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'MY_CUSTOM_DEBUG',
      String(enableDebug)
    );

    return config;
  });

  return config;
};
```

### 環境変数の使用

```typescript
// app.config.ts
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'Example App',
  plugins: [
    [
      'expo-native-configuration',
      {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
        enableDebug: process.env.DEBUG === 'true',
      },
    ],
  ],
};

export default config;
```

### .envファイルの使用

```bash
# .env
API_KEY=my_secret_api_key
API_URL=https://api.production.com
DEBUG=false
```

```typescript
// app.config.ts
import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'Example App',
  plugins: [
    [
      'expo-native-configuration',
      {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
        enableDebug: process.env.DEBUG === 'true',
      },
    ],
  ],
};

export default config;
```

## AndroidManifest.xmlとInfo.plistの詳細

### Androidの生成された設定

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application>
  <meta-data
    android:name="MY_CUSTOM_API_KEY"
    android:value="my_secret_api_key_12345" />
  <meta-data
    android:name="MY_CUSTOM_API_URL"
    android:value="https://api.example.com" />
  <meta-data
    android:name="MY_CUSTOM_DEBUG"
    android:value="false" />
</application>
```

### iOSの生成された設定

```xml
<!-- ios/MyApp/Info.plist -->
<dict>
  <key>MY_CUSTOM_API_KEY</key>
  <string>my_secret_api_key_12345</string>
  <key>MY_CUSTOM_API_URL</key>
  <string>https://api.example.com</string>
  <key>MY_CUSTOM_DEBUG</key>
  <false/>
</dict>
```

## 主なコマンド

```bash
# プラグインのビルド
npm run build:plugin

# プリビルド（ネイティブプロジェクトの生成）
npx expo prebuild --clean

# アプリの実行
npx expo run:android
npx expo run:ios

# 開発ビルドの作成
eas build --profile development
```

## ベストプラクティス

### 1. 環境変数の使用

機密情報はハードコードせず、環境変数を使用します。

```typescript
// ✅ 推奨
apiKey: process.env.API_KEY

// ❌ 非推奨
apiKey: 'my_secret_key_12345'
```

### 2. バリデーションの追加

```typescript
const withMyConfiguration: ConfigPlugin<Props> = (config, props) => {
  const { apiKey } = props;

  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (apiKey.length < 10) {
    throw new Error('API Key must be at least 10 characters long');
  }

  // 設定の適用
  // ...

  return config;
};
```

### 3. TypeScript型の定義

```typescript
export interface ConfigurationProps {
  apiKey: string;
  apiUrl?: string;
  enableDebug?: boolean;
  timeout?: number;
  retries?: number;
}

const withMyConfiguration: ConfigPlugin<ConfigurationProps> = (config, props) => {
  // ...
};
```

### 4. ドキュメントの作成

```typescript
/**
 * Config plugin for native configuration management.
 *
 * @param config - Expo config object
 * @param props - Plugin properties
 * @param props.apiKey - API key for the service (required)
 * @param props.apiUrl - API base URL (default: https://api.example.com)
 * @param props.enableDebug - Enable debug mode (default: false)
 *
 * @example
 * ```json
 * {
 *   "plugins": [
 *     ["expo-native-configuration", {
 *       "apiKey": "YOUR_API_KEY",
 *       "enableDebug": true
 *     }]
 *   ]
 * }
 * ```
 */
```

## よくある問題と解決策

### 問題1: プラグインが適用されない

**原因**: プラグインがビルドされていない

**解決策**：
```bash
npm run build:plugin
npx expo prebuild --clean
```

### 問題2: ネイティブ値が読み取れない

**原因**: プリビルドが実行されていない

**解決策**：
```bash
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

### 問題3: 環境変数が反映されない

**原因**: .envファイルが読み込まれていない

**解決策**：
```bash
npm install dotenv
```

```typescript
// app.config.ts
import 'dotenv/config';
```

## まとめ

このチュートリアルでは、以下を学びました：

1. **モジュールの初期化**: 最小限のボイラープレート
2. **Config Pluginの開発**: `withInfoPlist`と`withAndroidManifest`
3. **ネイティブ設定の注入**: AndroidManifest.xmlとInfo.plist
4. **ネイティブ値の読み取り**: PackageManagerとBundle
5. **環境変数の使用**: プロセス環境変数と.envファイル

**主な機能**：
- カスタムメタデータの注入
- プラットフォーム固有の設定管理
- 環境変数のサポート
- 型安全なConfig Plugin API

**コード構造**：
```
expo-native-configuration/
├── plugin/
│   ├── src/
│   │   └── index.ts
│   └── tsconfig.json
├── android/
│   └── src/main/java/.../ExpoNativeConfigurationModule.kt
├── ios/
│   └── ExpoNativeConfigurationModule.swift
├── src/
│   └── index.ts
└── package.json
```

**キーコマンド**：
- `npm run build:plugin` - プラグインのビルド
- `npx expo prebuild --clean` - ネイティブプロジェクトの生成
- `npx expo run:android/ios` - アプリの実行

これらのパターンを活用して、ネイティブ設定を管理するカスタムモジュールとConfig Pluginを作成できます。
