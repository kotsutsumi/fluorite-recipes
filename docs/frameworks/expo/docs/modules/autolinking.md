# Expo Autolinking

Expo Autolinkingの仕組みと設定方法を学びます。

## 概要

Expo Autolinkingは、ネイティブ依存関係のリンク処理を自動化し、手動設定を削減します。

**目的**: モバイルアプリ開発におけるネイティブモジュールの自動リンク

**主な機能**：
- ExpoとReact Nativeモジュールの自動リンク
- Gradle（Android）とCocoaPods（iOS）との統合
- モノレポと複雑な依存関係構造のサポート

## Autolinkingの仕組み

### モジュール解決プロセス

1. **react-native.config.js**をチェック（オプション）
2. **指定された検索パス**を検索
3. **ローカルモジュールディレクトリ**を検索
4. **アプリの依存関係**を再帰的に解決

```
┌─────────────────────────────────┐
│  react-native.config.js         │
│  (オプション設定)               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  検索パスのスキャン             │
│  (カスタムディレクトリ)         │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  ローカルモジュールの検索       │
│  (./modules デフォルト)         │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  依存関係の再帰的解決           │
│  (node_modules)                 │
└─────────────────────────────────┘
```

## 設定オプション

### react-native.config.js

```javascript
// react-native.config.js
module.exports = {
  dependencies: {
    // 除外するパッケージ
    'my-unwanted-package': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  project: {
    android: {
      sourceDir: './android',
    },
    ios: {
      project: './ios/MyApp.xcworkspace',
    },
  },
};
```

### expo-module.config.json

モジュールがAutolinkingの対象となるには、`expo-module.config.json`が必要です。

```json
{
  "platforms": ["android", "ios"],
  "android": {
    "modules": ["com.mycompany.mymodule.MyModule"]
  },
  "ios": {
    "modules": ["MyModule"]
  }
}
```

### app.json / app.config.js

```json
{
  "expo": {
    "autolinking": {
      "searchPaths": ["../packages/*"],
      "nativeModulesDir": "./custom-modules",
      "exclude": ["expo-unwanted-module"],
      "android": {
        "searchPaths": ["../android-packages/*"]
      },
      "ios": {
        "searchPaths": ["../ios-packages/*"]
      }
    }
  }
}
```

**設定オプション**：
- `searchPaths`: モジュールを検索するカスタムディレクトリ
- `nativeModulesDir`: ローカルモジュールのディレクトリ（デフォルト: `./modules`）
- `exclude`: Autolinkingから除外するパッケージ
- `flags`: プラットフォーム固有の設定オプション

## CLIコマンド

### search

Expoモジュールを検索します。

```bash
npx expo-modules-autolinking search
```

**出力例**：
```
Found 15 Expo modules:
  - expo
  - expo-constants
  - expo-file-system
  - expo-router
  ...
```

### resolve

プラットフォーム固有のモジュール詳細を取得します。

```bash
# iOS向け
npx expo-modules-autolinking resolve --platform ios

# Android向け
npx expo-modules-autolinking resolve --platform android
```

**出力例（iOS）**：
```json
{
  "modules": [
    {
      "packageName": "expo-constants",
      "packageVersion": "14.0.0",
      "moduleName": "ExpoConstants",
      "podName": "ExpoConstants"
    }
  ]
}
```

### verify

モジュールの競合をチェックします。

```bash
npx expo-modules-autolinking verify
```

**出力例**：
```
✓ No conflicts found
```

### react-native-config

React Nativeモジュール設定を生成します。

```bash
npx expo-modules-autolinking react-native-config
```

## モノレポでの使用

### プロジェクト構造

```
monorepo/
├── apps/
│   └── my-app/
│       ├── app.json
│       └── package.json
├── packages/
│   ├── expo-custom-module/
│   │   ├── expo-module.config.json
│   │   └── package.json
│   └── another-module/
│       ├── expo-module.config.json
│       └── package.json
└── package.json
```

### app.jsonの設定

```json
{
  "expo": {
    "autolinking": {
      "searchPaths": ["../../packages/*"]
    }
  }
}
```

### workspaceの設定

```json
// ルートpackage.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## Autolinking対象モジュールの要件

### 1. expo-module.config.jsonが必要

```json
{
  "platforms": ["android", "ios"]
}
```

### 2. サポートするプラットフォームを指定

```json
{
  "platforms": ["android", "ios", "web"],
  "android": {
    "modules": ["com.example.MyModule"]
  },
  "ios": {
    "modules": ["MyModule"]
  }
}
```

### 3. package.jsonに正しいメタデータ

```json
{
  "name": "expo-my-module",
  "version": "1.0.0",
  "main": "build/index.js",
  "types": "build/index.d.ts"
}
```

## Autolinkingからのオプトアウト

### React Native Community CLIの使用

```bash
# 環境変数を設定
export EXPO_USE_COMMUNITY_AUTOLINKING=1

# @react-native-community/cliをインストール
npm install --save-dev @react-native-community/cli
```

### 特定のモジュールの除外

```json
{
  "expo": {
    "autolinking": {
      "exclude": [
        "expo-unwanted-module",
        "another-unwanted-module"
      ]
    }
  }
}
```

## トラブルシューティング

### 問題1: モジュールが見つからない

**症状**: モジュールがAutolinkingによって検出されない

**解決策**：
```bash
# Autolinkingのキャッシュをクリア
npx expo prebuild --clean

# モジュールを検索して確認
npx expo-modules-autolinking search
```

### 問題2: モジュールの競合

**症状**: 複数のバージョンのモジュールが検出される

**解決策**：
```bash
# 競合を確認
npx expo-modules-autolinking verify

# 依存関係を整理
npm dedupe

# または
yarn dedupe
```

### 問題3: Podインストールが失敗する

**症状**: `pod install`が失敗する

**解決策**：
```bash
# Podキャッシュをクリア
cd ios
pod cache clean --all
pod deintegrate
pod install

# または、プリビルドをクリーン実行
cd ..
npx expo prebuild --clean
```

### 問題4: Gradleビルドが失敗する

**症状**: Androidビルドが失敗する

**解決策**：
```bash
# Gradleキャッシュをクリア
cd android
./gradlew clean

# または、プリビルドをクリーン実行
cd ..
npx expo prebuild --clean
```

## ベストプラクティス

### 1. 依存関係の重複をチェック

```bash
# npmの場合
npm dedupe

# yarnの場合
yarn dedupe

# pnpmの場合
pnpm dedupe
```

### 2. 一貫したモジュール解決

```json
{
  "expo": {
    "experiments": {
      "autolinkingModuleResolution": "strict"
    }
  }
}
```

### 3. 明示的な検索パス

```json
{
  "expo": {
    "autolinking": {
      "searchPaths": [
        "../packages/*",
        "../node_modules/@company/*"
      ]
    }
  }
}
```

### 4. プラットフォーム固有の除外

```json
{
  "expo": {
    "autolinking": {
      "android": {
        "exclude": ["expo-ios-only-module"]
      },
      "ios": {
        "exclude": ["expo-android-only-module"]
      }
    }
  }
}
```

## 高度な設定

### カスタムモジュール解決

```javascript
// app.config.js
export default {
  expo: {
    autolinking: {
      searchPaths: ['../custom-modules'],
      nativeModulesDir: './native',
      resolve: (modulePath) => {
        // カスタム解決ロジック
        if (modulePath.includes('legacy')) {
          return null; // スキップ
        }
        return modulePath;
      },
    },
  },
};
```

### モジュール優先度の設定

```json
{
  "expo": {
    "autolinking": {
      "priority": {
        "expo-constants": 100,
        "expo-router": 90,
        "my-custom-module": 80
      }
    }
  }
}
```

## まとめ

Expo Autolinkingは、以下の機能を提供します：

### 主な機能
- ネイティブ依存関係の自動リンク
- Gradle（Android）とCocoaPods（iOS）との統合
- モノレポと複雑な依存関係構造のサポート
- カスタマイズ可能な検索パスと除外設定

### 設定オプション
- `searchPaths`: カスタム検索ディレクトリ
- `nativeModulesDir`: ローカルモジュールディレクトリ
- `exclude`: 除外するパッケージ
- プラットフォーム固有の設定

### CLIコマンド
- `search`: モジュールの検索
- `resolve`: プラットフォーム固有の詳細取得
- `verify`: 競合のチェック
- `react-native-config`: 設定の生成

### 要件
- `expo-module.config.json`の存在
- サポートプラットフォームの指定
- 適切なpackage.jsonメタデータ

**ベストプラクティス**：
- 依存関係の重複をチェック
- 一貫したモジュール解決を使用
- 明示的な検索パスを設定
- プラットフォーム固有の除外を活用

これらの機能を活用して、ネイティブモジュールの管理を効率化できます。
