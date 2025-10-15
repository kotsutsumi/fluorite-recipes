# Expo Workflow - 包括的開発ワークフローガイド

## 📋 概要

Expo Workflowは、React Nativeアプリ開発における包括的な開発環境とツールチェーンを提供します。開発モードでの効率的なコーディングから、本番環境へのデプロイまで、全ライフサイクルをカバーする統合されたワークフローです。

```typescript
interface ExpoWorkflow {
  developmentCycle: {
    initialization: ProjectSetup;
    development: DevelopmentMode;
    testing: DeviceEmulation;
    debugging: LoggingSystem;
  };
  configuration: {
    appConfig: AppConfiguration;
    nativeGeneration: ContinuousNativeGeneration;
    customization: NativeCodeCustomization;
  };
  platforms: {
    ios: IOSSimulator;
    android: AndroidEmulator;
    web: WebDevelopment;
  };
  libraries: {
    core: ReactNativeCore;
    sdk: ExpoSDK;
    thirdParty: ThirdPartyLibraries;
  };
  troubleshooting: CommonErrors;
}
```

## 🚀 開発ワークフロー

### プロジェクト初期化

```typescript
interface ProjectInitialization {
  newProject: {
    command: "npx create-expo-app";
    templates: ["blank", "tabs", "bare-minimum"];
    process: "プロジェクト名入力 → テンプレート選択 → 依存関係インストール";
  };

  developmentBuild: {
    package: "expo-dev-client";
    installation: "npx expo install expo-dev-client";
    purpose: "カスタムネイティブコードサポート";
    benefits: [
      "本番品質のデバッグ",
      "ネイティブライブラリ統合",
      "高忠実度ログ",
    ];
  };
}
```

**新規プロジェクト作成**：

```bash
# 基本的なプロジェクト作成
npx create-expo-app my-app

# テンプレート指定
npx create-expo-app my-app --template blank

# 開発ビルドの追加
cd my-app
npx expo install expo-dev-client
```

**詳細ドキュメント**: [`overview.md`](./workflow/overview.md)

### コア開発ループ

```typescript
interface DevelopmentLoop {
  cycle: [
    "JavaScriptコードの記述",
    "アプリ設定の更新",
    "ネイティブプロジェクト設定の変更",
    "ネイティブライブラリのインストール",
  ];

  workflow: {
    codeEditing: {
      tools: ["VSCode", "WebStorm", "任意のエディタ"];
      features: ["インテリセンス", "シンタックスハイライト", "デバッグ"];
    };

    liveReload: {
      hotReloading: "状態保持したまま変更反映";
      fastRefresh: "自動的なコンポーネント更新";
      performance: "即座のフィードバック";
    };

    testing: {
      platforms: ["iOS", "Android", "Web"];
      environments: ["Simulator", "Emulator", "物理デバイス"];
    };
  };

  commands: {
    start: "npx expo start";
    ios: "npx expo run:ios";
    android: "npx expo run:android";
    web: "npx expo start --web";
  };
}
```

**開発コマンド**：

```bash
# 開発サーバー起動
npx expo start

# プラットフォーム固有の起動
npx expo start --ios        # iOSのみ
npx expo start --android    # Androidのみ
npx expo start --web        # Webのみ

# クリーンスタート
npx expo start --clear      # キャッシュクリア
```

## 🛠️ 開発モード

### 開発モードの主要機能

```typescript
interface DevelopmentMode {
  purpose: "開発者向けツールと警告の提供";

  features: {
    debugging: {
      remoteJSDebugging: "Chrome/Edgeデバッガー";
      inspector: "要素検査ツール";
      console: "リアルタイムログ表示";
    };

    liveUpdates: {
      liveReload: "コード変更時の自動リロード";
      hotReloading: "状態保持したままの更新";
      fastRefresh: "Reactコンポーネントの即座更新";
    };

    validation: {
      propTypes: "プロップタイプ検証";
      warnings: "実行時警告メッセージ";
      errorBoundaries: "エラー境界検出";
    };

    monitoring: {
      performanceMonitor: "FPS・メモリ使用量表示";
      elementInspector: "UI要素検査";
      networkInspector: "ネットワークリクエスト監視";
    };
  };

  performanceImpact: {
    note: "開発モードはパフォーマンスが低下";
    reasons: [
      "追加検証処理",
      "警告メッセージ生成",
      "デバッグ情報付加",
      "ソースマップ生成",
    ];
    recommendation: "パフォーマンステストは本番モードで実施";
  };
}
```

### Developer Menu

```typescript
interface DeveloperMenu {
  access: {
    ios: {
      simulator: "Cmd + D";
      device: "デバイスを振る";
    };
    android: {
      emulator: "Cmd + M（macOS）/ Ctrl + M（Windows/Linux）";
      device: "デバイスを振る";
    };
  };

  options: [
    "Reload - アプリをリロード",
    "Debug - デバッガーを開く",
    "Enable Fast Refresh - Fast Refresh切り替え",
    "Enable Performance Monitor - パフォーマンスモニター表示",
    "Toggle Inspector - Element Inspector切り替え",
    "Show Perf Monitor - FPS・メモリ表示",
  ];
}
```

**詳細ドキュメント**: [`development-mode.md`](./workflow/development-mode.md)

### 本番モード

```typescript
interface ProductionMode {
  purpose: [
    "実際のパフォーマンステスト",
    "本番環境固有バグ検出",
    "最適化されたビルド",
  ];

  characteristics: {
    __DEV__: "false に設定";
    minification: "JavaScriptコード圧縮";
    optimization: "パフォーマンス最適化";
    consoleRemoval: "コンソールログ削除（オプション）";
  };

  execution: {
    development: "npx expo start --no-dev --minify";
    androidRelease: "npx expo run:android --variant release";
    iosRelease: "npx expo run:ios --configuration Release";
  };

  environmentVariables: {
    __DEV__: "開発/本番モード判定";
    NODE_ENV: "'development' | 'production'";
  };
}
```

**本番モード実行例**：

```typescript
// 環境変数による条件分岐
if (__DEV__) {
  console.log('開発モードで実行中');
  API_URL = 'http://localhost:3000/api';
} else {
  console.log('本番モードで実行中');
  API_URL = 'https://api.production.com';
}

// プロセス環境変数の使用
const config = {
  apiUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://api.production.com',
  enableLogging: __DEV__,
  enableAnalytics: !__DEV__,
};
```

## ⚙️ アプリ設定

### 設定ファイル構造

```typescript
interface AppConfiguration {
  files: ["app.json", "app.config.js", "app.config.ts"];

  purposes: [
    "Expo Prebuildによるネイティブプロジェクト生成",
    "Expo Goプロジェクトの読み込み",
    "OTA更新マニフェスト",
  ];

  minimalConfig: {
    name: string;
    slug: string;
  };

  properties: {
    basic: {
      name: "アプリ名";
      slug: "一意識別子";
      version: "バージョン番号";
      orientation: "画面向き";
    };

    assets: {
      icon: "アプリアイコンパス";
      splash: "スプラッシュスクリーン設定";
      favicon: "Webファビコン（Web用）";
    };

    features: {
      scheme: "ディープリンクスキーム";
      apiKeys: "外部APIキー";
      permissions: "デバイス権限";
    };

    platforms: {
      ios: "iOS固有設定";
      android: "Android固有設定";
      web: "Web固有設定";
    };
  };
}
```

### 動的設定

```typescript
interface DynamicConfiguration {
  typescript: {
    example: `
      import { ExpoConfig, ConfigContext } from 'expo/config';

      export default ({ config }: ConfigContext): ExpoConfig => ({
        ...config,
        slug: 'my-app',
        name: 'My App',
        extra: {
          apiUrl: process.env.API_URL,
        },
      });
    `;
  };

  javascript: {
    example: `
      module.exports = () => {
        if (process.env.MY_ENVIRONMENT === 'production') {
          return {
            name: 'My App (Production)',
            slug: 'my-app-prod',
            extra: {
              apiUrl: 'https://api.production.com',
            },
          };
        } else {
          return {
            name: 'My App (Dev)',
            slug: 'my-app-dev',
            extra: {
              apiUrl: 'http://localhost:3000',
            },
          };
        }
      };
    `;
  };

  benefits: [
    "コメントと変数使用可能",
    "環境ベースの設定切り替え",
    "任意の追加設定データ",
    "TypeScript型安全性",
  ];
}
```

**設定アクセス例**：

```typescript
import Constants from 'expo-constants';

// 設定値へのアクセス
const appName = Constants.expoConfig?.name;
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

// 使用例
function App() {
  const config = Constants.expoConfig;

  return (
    <View>
      <Text>App: {config?.name}</Text>
      <Text>Version: {config?.version}</Text>
    </View>
  );
}
```

**詳細ドキュメント**: [`configuration.md`](./workflow/configuration.md)

## 🔄 Continuous Native Generation（CNG）

### CNGコアコンセプト

```typescript
interface ContinuousNativeGeneration {
  concept: "短命なネイティブプロジェクトを必要時のみ生成";

  philosophy: {
    maintain: "設定とカスタマイズの定義";
    generate: "ネイティブプロジェクト（android/ios）";
    avoid: "複数ネイティブプロジェクトの手動維持";
  };

  benefits: {
    upgradeSimplification: "ネイティブプロジェクトアップグレード簡素化";
    automation: "ライブラリインストール自動化";
    codeReduction: "孤立コード削減";
    crossPlatformConfig: "統一設定ファイル";
  };

  workflow: {
    command: "npx expo prebuild";
    generates: ["android/", "ios/"];
    cleans: "npx expo prebuild --clean";
    platforms: ["--platform ios", "--platform android", "--platform all"];
  };

  integration: {
    easBuild: "EAS Buildとシームレス連携";
    configPlugins: "設定プラグインでネイティブ変更";
    packageManagers: ["npm", "yarn", "pnpm"];
  };
}
```

**Prebuildワークフロー**：

```bash
# ネイティブプロジェクト生成
npx expo prebuild

# プラットフォーム指定
npx expo prebuild --platform ios
npx expo prebuild --platform android

# クリーン再生成
npx expo prebuild --clean

# パッケージマネージャー指定
npx expo prebuild --npm
npx expo prebuild --yarn
npx expo prebuild --pnpm
```

### CNGのメリットと制限

```typescript
interface CNGConsiderations {
  advantages: [
    "ネイティブアップグレードの簡素化",
    "ライブラリ統合の自動化",
    "クロスプラットフォーム設定の一元管理",
    "未使用コードの自動削除",
  ];

  limitations: {
    existingProjects: "ブラウンフィールドプロジェクトには不向き";
    modularization: "ネイティブ変更のモジュール化必要";
    librarySupport: "一部コミュニティライブラリは開発中";
  };

  bestFor: [
    "新規プロジェクト",
    "グリーンフィールド開発",
    "クロスプラットフォームアプリ",
    "ネイティブコード最小化",
  ];
}
```

**詳細ドキュメント**: [`continuous-native-generation.md`](./workflow/continuous-native-generation.md)

## 🎨 カスタムネイティブコード

### ネイティブライブラリの使用

```typescript
interface NativeLibraryUsage {
  installation: {
    command: "npx expo install <library-name>";
    examples: [
      "npx expo install react-native-localize",
      "npx expo install expo-camera",
      "npx expo install @react-navigation/native",
    ];
  };

  process: [
    "npm/yarnでライブラリインストール",
    "app.jsonで設定プラグイン構成（必要に応じて）",
    "新しい開発ビルド作成",
  ];

  libraries: {
    expoManaged: [
      "expo-camera",
      "expo-location",
      "expo-notifications",
    ];
    reactNative: [
      "react-native-safe-area-context",
      "react-native-screens",
      "react-native-gesture-handler",
    ];
    community: [
      "react-native-localize",
      "react-native-svg",
      "react-native-reanimated",
    ];
  };
}
```

### ネイティブコードの記述

```typescript
interface NativeCodeWriting {
  approach: "Expo Modules API使用";

  languages: {
    ios: "Swift";
    android: "Kotlin";
  };

  whenToConsider: [
    "ライブラリが特定プラットフォーム機能を提供していない",
    "サードパーティサービスにReact Nativeバインディングがない",
    "カスタムネイティブ機能実装が必要",
  ];

  localModule: {
    command: "npx create-expo-module@latest --local";
    structure: {
      directory: "modules/my-module/";
      files: [
        "ios/（Swiftコード）",
        "android/（Kotlinコード）",
        "src/（TypeScript）",
      ];
    };
    rebuild: "npx expo run:ios / npx expo run:android";
  };

  standaloneModule: {
    command: "npx create-expo-module@latest";
    purpose: "複数アプリで共有可能な独立モジュール";
    distribution: ["npm公開", "プライベートレジストリ", "ローカルパス"];
  };
}
```

**ローカルモジュール作成例**：

```bash
# ローカルモジュール作成
npx create-expo-module@latest --local
# → モジュール名入力（例: my-native-module）

# プロジェクト構造
# modules/
#   my-native-module/
#     ios/
#       MyNativeModule.swift
#     android/
#       MyNativeModule.kt
#     src/
#       index.ts

# 使用例（JavaScriptから呼び出し）
import * as MyNativeModule from './modules/my-native-module';

MyNativeModule.someNativeFunction();
```

**詳細ドキュメント**: [`customizing.md`](./workflow/customizing.md)

## 📱 プラットフォーム開発環境

### iOSシミュレーター

```typescript
interface IOSSimulatorSetup {
  requirements: {
    os: "macOS";
    xcode: "最新バージョン（App Store）";
    commandLineTools: "Xcodeコマンドラインツール";
    watchman: "ファイル監視ツール";
  };

  installation: {
    xcode: {
      source: "Mac App Store";
      size: "約10-15GB";
      commandLineTools: "xcode-select --install";
    };

    simulator: {
      location: "Xcode Settings > Platforms > iOS";
      download: "Get ボタンでランタイムダウンロード";
    };

    watchman: {
      command: "brew install watchman";
      purpose: "ファイルシステム変更監視";
    };
  };

  usage: {
    expoStart: "npx expo start → 'i'キーでシミュレーター起動";
    expoRun: "npx expo run:ios";
    selectSimulator: "Shift + i でシミュレーター選択";
  };

  limitations: [
    "音声入力（マイク）非対応",
    "気圧計非対応",
    "カメラ非対応",
    "モーションサポート（加速度計・ジャイロ）非対応",
    "バックグラウンドアプリ一時停止（iOS 11+）",
  ];
}
```

**シミュレーター管理**：

```bash
# シミュレーター一覧
xcrun simctl list devices

# 特定シミュレーター起動
xcrun simctl boot "iPhone 15 Pro"

# スクリーンショット
xcrun simctl io booted screenshot screenshot.png

# ダークモード切り替え
xcrun simctl ui booted appearance dark

# コンテンツ消去
# Device > Erase All Content and Settings（シミュレーター内）
```

**詳細ドキュメント**: [`ios-simulator.md`](./workflow/ios-simulator.md)

### Android Studioエミュレーター

```typescript
interface AndroidEmulatorSetup {
  requirements: {
    jdk: "JDK 17";
    androidStudio: "最新バージョン";
    watchman: "オプション（推奨）";
  };

  installation: {
    jdk: {
      macos: "brew install openjdk@17";
      windows: "AdoptOpenJDK";
      linux: "sudo apt-get install openjdk-17-jdk";
    };

    androidStudio: {
      download: "https://developer.android.com/studio";
      sdkPlatform: "Android SDK Platform 35（Android 15）";
      sdkTools: [
        "Android SDK Build-Tools",
        "Android Emulator",
        "Android SDK Platform-Tools",
      ];
    };

    environmentVariables: {
      ANDROID_HOME: "$HOME/Library/Android/sdk";
      PATH: [
        "$ANDROID_HOME/emulator",
        "$ANDROID_HOME/platform-tools",
      ];
    };
  };

  emulatorCreation: {
    process: [
      "Tools > Device Manager",
      "Create Device",
      "デバイス選択（Pixel推奨）",
      "システムイメージ選択（Android 15）",
      "設定（RAM: 2048MB+, Storage: 2048MB+）",
    ];
    launch: "Device Managerで▶️ Playボタン";
  };

  usage: {
    expoStart: "npx expo start → 'a'キーでエミュレーター起動";
    expoRun: "npx expo run:android";
  };
}
```

**環境変数設定例**：

```bash
# ~/.zshrc または ~/.bash_profile に追加（macOS/Linux）
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 適用
source ~/.zshrc

# 確認
adb version
```

**エミュレーター最適化**：

```typescript
interface EmulatorOptimization {
  graphics: "Hardware - GLES 2.0";
  cpuCores: "4コア推奨";
  bootOption: "Quick boot（スナップショット有効）";
  saveQuickBootState: true;

  performance: {
    closeUnusedApps: "他のアプリを閉じる";
    deleteUnusedEmulators: "未使用エミュレーター削除";
    allocateRAM: "十分なRAM割り当て";
  };
}
```

**詳細ドキュメント**: [`android-studio-emulator.md`](./workflow/android-studio-emulator.md)

### Web開発

```typescript
interface WebDevelopment {
  features: {
    universal: "プラットフォーム間で同じコードベース";
    reactNativeWeb: "React NativeコンポーネントのWeb対応";
    reactDOM: "Web固有のReact DOMコンポーネント";
    fullSDKSupport: "Expo SDKライブラリ完全サポート";
  };

  setup: {
    dependencies: [
      "react-dom",
      "react-native-web",
      "@expo/metro-runtime",
    ];
    installation: "npx expo install react-dom react-native-web @expo/metro-runtime";
  };

  development: {
    start: "npx expo start --web";
    autoOpen: "ブラウザ自動起動";
    hotReload: "Fast Refresh対応";
  };

  production: {
    export: "npx expo export --platform web";
    output: "dist/ ディレクトリに生成";
    hosting: ["Vercel", "Netlify", "静的ホスティング"];
  };

  configuration: {
    staticRendering: {
      output: "static";
      seo: "SEO対応";
    };
    bundler: ["metro", "webpack"];
    favicon: "./assets/favicon.png";
  };
}
```

**ユニバーサルコンポーネント例**：

```typescript
import { Text, View, StyleSheet, Platform } from 'react-native';

export default function UniversalComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        これは{Platform.OS}プラットフォームで動作しています
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    // Web固有のスタイル
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
    }),
  },
});
```

**Web固有設定**：

```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png",
      "build": {
        "babel": {
          "include": []
        }
      }
    }
  }
}
```

**詳細ドキュメント**: [`web.md`](./workflow/web.md)

## 📚 ライブラリ管理

### React Nativeコアライブラリ

```typescript
interface ReactNativeCore {
  components: {
    ui: [
      "<View> - コンテナビュー",
      "<Text> - テキスト表示",
      "<Image> - 画像表示",
      "<ScrollView> - スクロール可能ビュー",
      "<FlatList> - リストレンダリング",
    ];

    input: [
      "<TextInput> - テキスト入力",
      "<Button> - ボタン",
      "<Switch> - スイッチ",
      "<Slider> - スライダー",
    ];

    feedback: [
      "<ActivityIndicator> - ローディング",
      "<Modal> - モーダル",
      "<Alert> - アラート",
    ];
  };

  apis: [
    "Platform - プラットフォーム判定",
    "Dimensions - 画面サイズ取得",
    "StyleSheet - スタイル定義",
    "Animated - アニメーション",
    "Vibration - バイブレーション",
  ];
}
```

### Expo SDKライブラリ

```typescript
interface ExpoSDKLibraries {
  categories: {
    device: [
      "expo-camera - カメラアクセス",
      "expo-location - 位置情報",
      "expo-sensors - センサーアクセス",
      "expo-battery - バッテリー情報",
    ];

    media: [
      "expo-av - オーディオ・ビデオ",
      "expo-image-picker - 画像選択",
      "expo-media-library - メディアライブラリ",
    ];

    notifications: [
      "expo-notifications - プッシュ通知",
      "expo-haptics - ハプティックフィードバック",
    ];

    storage: [
      "expo-file-system - ファイルシステム",
      "expo-secure-store - セキュアストレージ",
      "expo-sqlite - SQLiteデータベース",
    ];

    authentication: [
      "expo-local-authentication - 生体認証",
      "expo-auth-session - OAuth認証",
    ];
  };

  installation: "npx expo install <library-name>";
  documentation: "https://docs.expo.dev/versions/latest/";
}
```

### サードパーティライブラリ

```typescript
interface ThirdPartyLibraries {
  discovery: {
    primary: {
      name: "React Native Directory";
      url: "https://reactnative.directory";
      features: [
        "Expo互換性情報",
        "人気度スコア",
        "メンテナンス状態",
        "プラットフォームサポート",
      ];
    };

    secondary: {
      name: "npm Registry";
      url: "https://www.npmjs.com";
    };
  };

  installation: {
    recommended: "npx expo install <package-name>";
    standard: "npm install <package-name>";
    quickReadme: "npx npm-home <package-name>";
  };

  compatibility: {
    developmentBuild: "本番品質アプリに推奨";
    expoGo: "ライブラリサポート限定的";
    nativeCode: "ネイティブコード要件確認";
  };

  configPlugins: {
    purpose: "ネイティブ設定自動化";
    example: `
      {
        "expo": {
          "plugins": [
            "expo-camera",
            ["expo-location", {
              "locationAlwaysAndWhenInUsePermission": "アプリは位置情報を使用します"
            }]
          ]
        }
      }
    `;
  };
}
```

**ライブラリインストール例**：

```bash
# Expo推奨方法
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context

# 設定プラグイン付きライブラリ
npx expo install expo-camera
# → app.jsonに自動追加または手動追加

# ライブラリREADMEを開く
npx npm-home react-native-reanimated
```

**詳細ドキュメント**: [`using-libraries.md`](./workflow/using-libraries.md)

## 📊 ログとデバッグ

### コンソールログ

```typescript
interface LoggingSystem {
  console: {
    methods: ["console.log", "console.warn", "console.error", "console.info"];

    lowFidelity: {
      source: "Expo CLI（WebSocket経由）";
      characteristics: "低忠実度、基本的な情報";
      usage: "npx expo start → ターミナルに表示";
    };

    highFidelity: {
      requirements: ["開発ビルド", "Hermes", "インスペクター接続"];
      features: ["console.table", "詳細スタックトレース", "オブジェクト検査"];
      access: ["chrome://inspect", "edge://inspect"];
    };
  };

  nativeLogs: {
    android: {
      tool: "Android Studio Logcat";
      filters: ["Verbose", "Debug", "Info", "Warn", "Error"];
      command: "npx react-native log-android";
    };

    ios: {
      tool: "Xcode Console";
      location: "Window > Devices and Simulators > Open Console";
      command: "npx react-native log-ios";
    };
  };

  bestPractices: {
    logLevels: "適切なログレベル使用";
    structuredLogging: "構造化ログ（JSON）";
    productionRemoval: "本番ビルドからコンソールログ削除";
    customLogger: "カスタムロガークラス実装";
  };
}
```

**カスタムロガー実装例**：

```typescript
class Logger {
  static log(message: string, data?: any) {
    if (__DEV__) {
      console.log(`[${new Date().toISOString()}] ${message}`, data);
    }
  }

  static warn(message: string, data?: any) {
    if (__DEV__) {
      console.warn(`[${new Date().toISOString()}] ${message}`, data);
    }
  }

  static error(message: string, error?: Error) {
    console.error(`[${new Date().toISOString()}] ${message}`, error);
    // 本番環境ではエラー追跡サービスに送信
    if (!__DEV__) {
      // Sentry.captureException(error);
    }
  }
}

// 使用例
Logger.log('ユーザーログイン', { userId: 123 });
Logger.error('APIエラー', new Error('接続失敗'));
```

**本番環境でのログ削除**：

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    drop_console: true, // コンソールログを削除
  },
};

module.exports = config;
```

**詳細ドキュメント**: [`logging.md`](./workflow/logging.md)

## 🐛 よくあるエラーとトラブルシューティング

### 接続エラー

```typescript
interface ConnectionErrors {
  econnrefused: {
    error: "Metro bundler ECONNREFUSED 127.0.0.1:19001";
    causes: ["ファイアウォール", "VPN", "アンチウイルス"];
    solutions: [
      "rm -rf .expo",
      "ファイアウォール設定確認",
      "VPN無効化",
      "npx expo start --clear",
    ];
  };

  moduleNotRegistered: {
    error: "Module AppRegistry is not a registered callable module";
    causes: ["Babel設定", "minifier非互換", "キャッシュ"];
    solutions: [
      "npx expo start --no-dev --minify",
      "babel.config.js確認",
      "npx expo start --clear",
      "デバイスログ確認",
    ];
  };
}
```

### バージョンエラー

```typescript
interface VersionErrors {
  invalidSDKVersion: {
    error: "XX.X.X is not a valid SDK version";
    solution: [
      "npx expo upgrade",
      "app.jsonのsdkVersion更新",
      "npm install",
    ];
  };

  versionMismatch: {
    error: "React Native version mismatch";
    solution: [
      "app.jsonとpackage.jsonでバージョン統一",
      "rm -rf node_modules && npm install",
      "npx expo start --clear",
    ];
  };
}
```

### ビルドエラー

```typescript
interface BuildErrors {
  applicationNotRegistered: {
    error: "Application has not been registered";
    causes: "ネイティブ側とJS側のAppKey不一致";
    solution: [
      "registerRootComponent使用確認",
      "ネイティブ側のMainComponentName確認",
      "npx expo run:ios / npx expo run:android",
    ];
  };

  cacheIssues: {
    error: "Application not behaving as expected";
    solutions: [
      "npx expo start --clear",
      "rm -rf .expo node_modules/.cache",
      "watchman watch-del-all（macOS/Linux）",
      "rm -rf node_modules && npm install",
      "Android: cd android && ./gradlew clean",
      "iOS: cd ios && rm -rf Pods Podfile.lock && pod install",
    ];
  };
}
```

**包括的トラブルシューティングコマンド**：

```bash
# 完全クリーンアップ
rm -rf .expo
rm -rf node_modules/.cache
watchman watch-del-all
rm -rf node_modules
npm install
npx expo start --clear

# Android クリーン
cd android
./gradlew clean
cd ..

# iOS クリーン
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# 診断ツール
npx expo-doctor
```

**詳細ドキュメント**: [`common-development-errors.md`](./workflow/common-development-errors.md)

## 🎯 ベストプラクティス

### 開発ワークフロー最適化

```typescript
interface WorkflowOptimization {
  development: {
    fastRefresh: "常に有効化";
    incrementalBuilds: "変更ファイルのみ再ビルド";
    caching: "Metro/Watchmanキャッシュ活用";
  };

  testing: {
    frequentTesting: "複数プラットフォームで頻繁にテスト";
    realDevices: "物理デバイスで定期的にテスト";
    performanceTesting: "本番モードでパフォーマンステスト";
  };

  codeOrganization: {
    componentStructure: "機能ベースのディレクトリ構造";
    sharedCode: "プラットフォーム間でコード共有";
    platformSpecific: "必要時のみプラットフォーム固有コード";
  };

  debugging: {
    earlyDebugging: "早期デバッグで問題特定";
    logging: "適切なログレベルとカスタムロガー";
    errorBoundaries: "エラー境界実装";
  };
}
```

### パフォーマンスベストプラクティス

```typescript
interface PerformanceBestPractices {
  rendering: {
    memoization: "React.memo、useMemo、useCallbackの活用";
    listOptimization: "FlatList/SectionListの最適化";
    imageOptimization: "適切な画像サイズと圧縮";
  };

  bundleSize: {
    codesplitting: "コード分割による初期バンドル削減";
    treeshaking: "未使用コード削除";
    lazyLoading: "遅延読み込み実装";
  };

  nativePerformance: {
    nativeDriver: "AnimatedでuseNativeDriver: true使用";
    offMainThread: "メインスレッド負荷軽減";
    debounceThrottle: "デバウンス・スロットル実装";
  };
}
```

### セキュリティベストプラクティス

```typescript
interface SecurityBestPractices {
  credentials: {
    storage: "expo-secure-storeで機密情報保存";
    environment: "環境変数で秘密情報管理";
    noHardcoding: "ハードコーディング回避";
  };

  api: {
    https: "HTTPS通信のみ";
    authentication: "適切な認証・認可実装";
    tokenManagement: "トークンの安全な管理";
  };

  codeQuality: {
    inputValidation: "ユーザー入力の検証";
    errorHandling: "適切なエラーハンドリング";
    dependencies: "依存関係の定期更新";
  };
}
```

## 🔗 関連リソース

### 内部リンク

- [overview.md](./workflow/overview.md) - ワークフロー概要
- [development-mode.md](./workflow/development-mode.md) - 開発モード詳細
- [configuration.md](./workflow/configuration.md) - アプリ設定
- [continuous-native-generation.md](./workflow/continuous-native-generation.md) - CNG詳細
- [customizing.md](./workflow/customizing.md) - カスタムネイティブコード
- [ios-simulator.md](./workflow/ios-simulator.md) - iOSシミュレーター
- [android-studio-emulator.md](./workflow/android-studio-emulator.md) - Androidエミュレーター
- [web.md](./workflow/web.md) - Web開発
- [using-libraries.md](./workflow/using-libraries.md) - ライブラリ管理
- [logging.md](./workflow/logging.md) - ログとデバッグ
- [common-development-errors.md](./workflow/common-development-errors.md) - エラーガイド

### 関連ドキュメント

- **[EAS Build](../build/)** - プロダクションビルド
- **[EAS Submit](../submit/)** - アプリストア提出
- **[EAS Update](../update/)** - OTA更新
- **[Accounts](../accounts/)** - アカウント管理

### 外部リンク

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Directory](https://reactnative.directory)
- [Expo Forums](https://forums.expo.dev/)
- [GitHub - Expo](https://github.com/expo/expo)

## 📋 まとめ

Expo Workflowは、React Nativeアプリ開発のための包括的で効率的な開発環境を提供します：

```typescript
interface WorkflowSummary {
  strengths: [
    "統合された開発環境（iOS・Android・Web）",
    "効率的な開発モードとデバッグツール",
    "柔軟なアプリ設定システム",
    "Continuous Native Generation（CNG）",
    "包括的なライブラリエコシステム",
    "プラットフォーム固有の最適化",
  ];

  developmentCycle: {
    initialization: "npx create-expo-app";
    development: "Hot Reload・Fast Refresh";
    testing: "シミュレーター・エミュレーター・Web";
    production: "本番モードビルド";
  };

  platformSupport: {
    ios: "iOSシミュレーター・Xcode統合";
    android: "Androidエミュレーター・Android Studio統合";
    web: "React Native Web・静的レンダリング";
  };

  keyFeatures: [
    "開発モード・本番モード切り替え",
    "動的アプリ設定",
    "ネイティブプロジェクト自動生成",
    "カスタムネイティブコードサポート",
    "包括的ログシステム",
    "エラートラブルシューティング",
  ];

  nextSteps: [
    "開発環境のセットアップ",
    "プラットフォーム固有ツールのインストール",
    "開発ワークフローの理解",
    "ベストプラクティスの実践",
  ];
}
```

このガイドを参考に、効率的で生産性の高いExpo開発ワークフローを構築してください。各セクションの詳細ドキュメントも併せてご参照ください。
