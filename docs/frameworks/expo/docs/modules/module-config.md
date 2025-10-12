# expo-module.config.json 設定

expo-module.config.jsonファイルの設定方法を学びます。

## 概要

`expo-module.config.json`ファイルは、Expo Modulesの設定に使用され、特にAutolinkingとモジュール登録に必要です。

**目的**: モジュールの設定とAutolinking

**配置場所**: モジュールのルートディレクトリ

## 基本構造

```json
{
  "platforms": ["android", "ios"],
  "android": {
    "modules": ["com.example.MyModule"]
  },
  "ios": {
    "modules": ["MyModule"]
  }
}
```

## 設定オプション

### platforms

サポートするプラットフォームを指定します。

```json
{
  "platforms": ["android", "ios", "web", "devtools"]
}
```

**サポートされる値**：
- `"android"`: Android
- `"ios"`: iOS
- `"apple"`: iOS、macOS、tvOSすべて
- `"macos"`: macOS
- `"tvos"`: tvOS
- `"web"`: Web
- `"devtools"`: Expo Dev Tools

**粒度の選択**：
```json
// より粒度の高い指定
{
  "platforms": ["ios", "macos", "tvos"]
}

// より広範な指定
{
  "platforms": ["apple"]
}
```

### apple（iOS / macOS / tvOS）

Apple プラットフォーム向けの設定。

#### modules

Swiftネイティブモジュールクラスの名前。

```json
{
  "apple": {
    "modules": ["MySwiftModule", "AnotherModule"]
  }
}
```

**注意**: クラス名のみ（パッケージ名は不要）

#### appDelegateSubscribers

`ExpoAppDelegate`ライフサイクルイベントにフックするSwiftクラス。

```json
{
  "apple": {
    "appDelegateSubscribers": ["MyAppDelegateHandler", "AnotherHandler"]
  }
}
```

**完全な例**：
```json
{
  "platforms": ["apple"],
  "apple": {
    "modules": ["ExpoSettings", "ExpoCamera"],
    "appDelegateSubscribers": ["SettingsAppDelegateSubscriber", "CameraAppDelegateSubscriber"]
  }
}
```

### android

Android プラットフォーム向けの設定。

#### modules

Kotlinネイティブモジュールクラスの完全名（パッケージ + クラス名）。

```json
{
  "android": {
    "modules": [
      "expo.modules.settings.ExpoSettingsModule",
      "expo.modules.camera.ExpoCameraModule"
    ]
  }
}
```

**注意**: 完全修飾クラス名（パッケージ名を含む）

#### reactActivityLifecycleListeners

React Activity ライフサイクルリスナーの完全名。

```json
{
  "android": {
    "reactActivityLifecycleListeners": [
      "expo.modules.settings.SettingsLifecycleListener"
    ]
  }
}
```

#### applicationLifecycleListeners

Application ライフサイクルリスナーの完全名。

```json
{
  "android": {
    "applicationLifecycleListeners": [
      "expo.modules.settings.SettingsApplicationListener"
    ]
  }
}
```

**完全な例**：
```json
{
  "platforms": ["android"],
  "android": {
    "modules": [
      "expo.modules.settings.ExpoSettingsModule"
    ],
    "reactActivityLifecycleListeners": [
      "expo.modules.settings.SettingsLifecycleListener"
    ],
    "applicationLifecycleListeners": [
      "expo.modules.settings.SettingsApplicationListener"
    ]
  }
}
```

### ios（非推奨）

iOS固有の設定（`apple`を使用することを推奨）。

```json
{
  "platforms": ["ios"],
  "ios": {
    "modules": ["MyModule"]
  }
}
```

**推奨**: `apple`を使用してください

## プラットフォーム別の完全な例

### クロスプラットフォーム

```json
{
  "platforms": ["android", "apple", "web"],
  "android": {
    "modules": ["com.mycompany.mymodule.MyModule"]
  },
  "apple": {
    "modules": ["MyModule"]
  }
}
```

### Android のみ

```json
{
  "platforms": ["android"],
  "android": {
    "modules": ["com.mycompany.mymodule.MyModule"],
    "reactActivityLifecycleListeners": [
      "com.mycompany.mymodule.MyLifecycleListener"
    ]
  }
}
```

### Apple プラットフォームのみ

```json
{
  "platforms": ["apple"],
  "apple": {
    "modules": ["MyModule"],
    "appDelegateSubscribers": ["MyAppDelegateSubscriber"]
  }
}
```

### すべてのプラットフォーム

```json
{
  "platforms": ["android", "ios", "macos", "tvos", "web"],
  "android": {
    "modules": ["com.mycompany.mymodule.MyModule"]
  },
  "apple": {
    "modules": ["MyModule"]
  }
}
```

## 実践例

### 例1: シンプルなモジュール

```json
{
  "platforms": ["android", "ios"],
  "android": {
    "modules": ["expo.modules.simplemodule.SimpleModule"]
  },
  "ios": {
    "modules": ["SimpleModule"]
  }
}
```

### 例2: ライフサイクルリスナー付き

```json
{
  "platforms": ["android", "apple"],
  "android": {
    "modules": ["expo.modules.tracker.TrackerModule"],
    "reactActivityLifecycleListeners": [
      "expo.modules.tracker.TrackerActivityLifecycleListener"
    ],
    "applicationLifecycleListeners": [
      "expo.modules.tracker.TrackerApplicationLifecycleListener"
    ]
  },
  "apple": {
    "modules": ["TrackerModule"],
    "appDelegateSubscribers": ["TrackerAppDelegateSubscriber"]
  }
}
```

### 例3: 複数のモジュール

```json
{
  "platforms": ["android", "apple"],
  "android": {
    "modules": [
      "expo.modules.auth.AuthModule",
      "expo.modules.storage.StorageModule",
      "expo.modules.analytics.AnalyticsModule"
    ]
  },
  "apple": {
    "modules": [
      "AuthModule",
      "StorageModule",
      "AnalyticsModule"
    ]
  }
}
```

### 例4: マルチプラットフォーム

```json
{
  "platforms": ["ios", "macos", "tvos", "android"],
  "android": {
    "modules": ["expo.modules.video.VideoModule"]
  },
  "apple": {
    "modules": ["VideoModule"]
  }
}
```

## プロジェクト構造での配置

### スタンドアロンモジュール

```
expo-my-module/
├── android/
│   └── src/main/java/expo/modules/mymodule/
│       └── MyModule.kt
├── ios/
│   └── MyModule.swift
├── src/
│   └── index.ts
├── expo-module.config.json  ← ここ
└── package.json
```

### ローカルモジュール

```
my-app/
├── app/
├── modules/
│   └── my-module/
│       ├── android/
│       ├── ios/
│       ├── src/
│       ├── expo-module.config.json  ← ここ
│       └── package.json
└── package.json
```

## バリデーションとエラー

### 有効な設定

```json
// ✅ 正しい
{
  "platforms": ["android", "ios"],
  "android": {
    "modules": ["com.example.MyModule"]
  },
  "ios": {
    "modules": ["MyModule"]
  }
}
```

### 無効な設定

```json
// ❌ 間違い: platformsが指定されていない
{
  "android": {
    "modules": ["com.example.MyModule"]
  }
}

// ❌ 間違い: Androidでクラス名のみ（完全修飾名が必要）
{
  "platforms": ["android"],
  "android": {
    "modules": ["MyModule"]
  }
}

// ❌ 間違い: iOSで完全修飾名（クラス名のみが必要）
{
  "platforms": ["ios"],
  "ios": {
    "modules": ["expo.modules.MyModule"]
  }
}
```

## ベストプラクティス

### 1. appleを使用する

```json
// ✅ 推奨: appleを使用
{
  "platforms": ["apple"],
  "apple": {
    "modules": ["MyModule"]
  }
}

// ❌ 非推奨: iosを使用
{
  "platforms": ["ios"],
  "ios": {
    "modules": ["MyModule"]
  }
}
```

### 2. 明確な命名

```json
// ✅ 推奨: 明確なモジュール名
{
  "android": {
    "modules": ["expo.modules.settings.SettingsModule"]
  }
}

// ❌ 非推奨: 曖昧なモジュール名
{
  "android": {
    "modules": ["expo.modules.Mod"]
  }
}
```

### 3. 一貫した構造

```json
// ✅ 推奨: 一貫した構造
{
  "platforms": ["android", "apple"],
  "android": {
    "modules": ["expo.modules.mymodule.MyModule"]
  },
  "apple": {
    "modules": ["MyModule"]
  }
}
```

### 4. ドキュメント化

```json
{
  // モジュール設定
  // サポートプラットフォーム: Android, iOS, macOS
  "platforms": ["android", "apple"],

  // Android設定
  "android": {
    "modules": ["expo.modules.mymodule.MyModule"]
  },

  // Apple プラットフォーム設定
  "apple": {
    "modules": ["MyModule"],
    "appDelegateSubscribers": ["MyAppDelegateSubscriber"]
  }
}
```

## トラブルシューティング

### 問題1: モジュールが認識されない

**原因**: `expo-module.config.json`がない、または不正

**解決策**：
```bash
# ファイルの存在を確認
ls expo-module.config.json

# JSONの妥当性を確認
cat expo-module.config.json | python -m json.tool
```

### 問題2: Autolinkingが失敗する

**原因**: プラットフォームが指定されていない

**解決策**：
```json
{
  "platforms": ["android", "ios"]
}
```

### 問題3: ビルドエラー

**原因**: クラス名が間違っている

**解決策**：
```json
// Android: 完全修飾名を確認
{
  "android": {
    "modules": ["expo.modules.mymodule.MyModule"]
  }
}

// iOS: クラス名のみを確認
{
  "ios": {
    "modules": ["MyModule"]
  }
}
```

## まとめ

`expo-module.config.json`は、以下の設定を提供します：

### 主な設定項目
- `platforms`: サポートするプラットフォームの指定
- `android.modules`: Androidモジュールクラスの完全修飾名
- `apple.modules`: Appleプラットフォームモジュールクラス名
- `apple.appDelegateSubscribers`: AppDelegateサブスクライバー
- `android.reactActivityLifecycleListeners`: ActivityライフサイクルリスナーAndroidモジュールクラスの完全修飾名
- `android.applicationLifecycleListeners`: Applicationライフサイクルリスナー

### プラットフォーム
- `android`: Android
- `apple`: iOS、macOS、tvOS
- `ios`、`macos`、`tvos`: 個別指定
- `web`: Web
- `devtools`: Expo Dev Tools

### ベストプラクティス
- `apple`を使用（`ios`の代わりに）
- 明確な命名規則
- 一貫した構造
- コメントでのドキュメント化

これらの設定を活用して、Expo Modulesを適切に構成できます。
