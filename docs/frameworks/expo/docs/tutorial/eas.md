# EASチュートリアル - 包括的開発ワークフローガイド

## 📋 概要

EAS（Expo Application Services）チュートリアルは、開発ビルドからプロダクションリリースまでの完全なモバイルアプリ開発ワークフローをカバーする実践的なガイドです。Build、Submit、Updateの各サービスを統合し、チーム開発とCI/CD自動化をサポートします。

```typescript
interface EASTutorialSystem {
  coreServices: {
    build: EASBuildService;
    submit: EASSubmitService;
    update: EASUpdateService;
  };
  developmentFlow: {
    builds: DevelopmentBuilds;
    testing: InternalDistribution;
    automation: GitHubIntegration;
  };
  productionFlow: {
    builds: ProductionBuilds;
    submission: StoreSubmission;
    versioning: VersionManagement;
  };
  teamCollaboration: {
    updates: OTAUpdates;
    variants: AppVariants;
    workflows: TeamWorkflows;
  };
}
```

## 🎯 チュートリアル目標

### 学習目標

```typescript
interface LearningObjectives {
  developmentBuilds: {
    create: "開発ビルドの作成";
    install: "デバイス・エミュレーターへのインストール";
    run: "開発サーバーとの連携実行";
  };
  teamWorkflows: {
    distribution: "内部配信ビルドの共有";
    updates: "OTA更新の展開";
    collaboration: "チーム開発ワークフローの実装";
  };
  productionRelease: {
    builds: "本番ビルドの作成";
    submission: "アプリストアへの提出";
    versioning: "バージョン自動インクリメント";
  };
  automation: {
    github: "GitHub連携ビルド";
    cicd: "CI/CDパイプライン統合";
  };
}
```

### 前提条件

```typescript
interface Prerequisites {
  project: "既存のExpoプロジェクト";
  options: [
    "Sticker Smashアプリ（前チュートリアル）",
    "npx create-expo-appで新規作成",
    "素のReact Nativeプロジェクト",
  ];
  tools: {
    required: ["EAS CLI", "Expo Account"];
    recommended: [
      "Expo Orbit（ビルド管理）",
      "Android Emulator",
      "iOS Simulator（macOS）",
    ];
  };
  duration: "約2時間で完了";
}
```

**詳細ドキュメント**: [`introduction.md`](./eas/introduction.md)

## 🔧 開発ビルド設定

### 開発ビルド概要

```typescript
interface DevelopmentBuild {
  definition: "expo-dev-clientを含むデバッグ最適化ビルド";
  purpose: "迅速な反復開発とネイティブコードテスト";

  comparison: {
    developmentBuild: {
      iterationSpeed: "Web的な反復速度";
      collaboration: "共有ネイティブランタイム";
      libraries: "完全なサードパーティライブラリサポート";
      customization: "広範囲なカスタマイズ";
      useCase: "本格的なアプリ開発";
    };
    expoGo: {
      iterationSpeed: "迅速な反復とテスト";
      collaboration: "簡単なプロジェクト共有";
      libraries: "Expo SDKに限定";
      customization: "限定的";
      useCase: "学習とプロトタイピング";
    };
  };
}
```

### 初期設定手順

```typescript
interface InitialSetup {
  step1: {
    action: "expo-dev-clientのインストール";
    command: "npx expo install expo-dev-client";
  };
  step2: {
    action: "開発サーバー起動";
    command: "npx expo start";
  };
  step3: {
    action: "EAS CLIのインストール";
    command: "npm install -g eas-cli";
  };
  step4: {
    action: "Expoアカウントにログイン";
    command: "eas login";
  };
  step5: {
    action: "プロジェクト初期化";
    command: "eas init";
  };
  step6: {
    action: "EAS Buildの設定";
    command: "eas build:configure";
  };
}
```

### eas.json設定

```json
{
  "cli": {
    "version": ">= 16.18.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

```typescript
interface EASConfig {
  cli: {
    version: "最小EAS CLIバージョン要件";
    appVersionSource: "remote" | "local";
  };
  build: {
    development: BuildProfile;
    preview: BuildProfile;
    production: BuildProfile;
  };
  submit: {
    production: SubmitProfile;
  };
}

interface BuildProfile {
  developmentClient?: boolean;
  distribution: "internal" | "store";
  autoIncrement?: boolean;
  env?: Record<string, string>;
  ios?: IOSBuildConfig;
  android?: AndroidBuildConfig;
}
```

**詳細ドキュメント**: [`configure-development-build.md`](./eas/configure-development-build.md)

## 📱 プラットフォーム別ビルド作成

### Android開発ビルド

```typescript
interface AndroidDevelopmentBuild {
  format: ".apk（開発用）";

  creation: {
    command: "eas build --platform android --profile development";
    prompts: [
      "Androidアプリケーション ID確認",
      "新しいAndroid Keystore生成",
    ];
  };

  installation: {
    methods: {
      expoOrbit: {
        steps: [
          "USB経由でデバイス接続",
          "Orbitメニューバーアプリ起動",
          "デバイス選択",
          "EASダッシュボードで'Open with Orbit'",
        ];
      };
      qrCode: {
        steps: [
          "Installボタンクリック",
          "デバイスカメラでQRスキャン",
          ".apkダウンロード",
          "アプリインストール（警告無視）",
        ];
      };
    };
  };

  execution: {
    server: "npx expo start";
    launch: "ターミナルで'a'キー押下";
    targets: ["物理デバイス", "エミュレーター"];
  };
}
```

**実行例**：

```bash
# Android開発ビルド作成
eas build --platform android --profile development

# 開発サーバー起動
npx expo start

# ターミナルで 'a' を押してAndroidで開く
```

**詳細ドキュメント**: [`android-development-build.md`](./eas/android-development-build.md)

### iOSシミュレータービルド

```typescript
interface IOSSimulatorBuild {
  purpose: "iOSシミュレーター専用開発ビルド";
  requirement: "macOSのみ";

  configuration: {
    profile: "ios-simulator";
    easJson: {
      build: {
        "ios-simulator": {
          extends: "development";
          ios: {
            simulator: true;
          };
        };
      };
    };
  };

  creation: {
    command: "eas build --platform ios --profile ios-simulator";
    prompts: [
      "iOSバンドル識別子指定",
      "暗号化使用確認",
    ];
  };

  installation: {
    cliSuggestion: "ビルド完了後にCLIが自動提案";
    expoOrbit: "Orbitでもインストール可能";
  };

  execution: {
    server: "npx expo start";
    launch: "ターミナルで'i'キー押下";
  };
}
```

**eas.json設定**：

```json
{
  "build": {
    "ios-simulator": {
      "extends": "development",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

**実行例**：

```bash
# iOSシミュレータービルド作成
eas build --platform ios --profile ios-simulator

# 開発サーバー起動
npx expo start

# ターミナルで 'i' を押してiOSシミュレーターで開く
```

**詳細ドキュメント**: [`ios-development-build-for-simulators.md`](./eas/ios-development-build-for-simulators.md)

### iOSデバイスビルド

```typescript
interface IOSDeviceBuild {
  prerequisites: {
    account: "Apple Developer Account";
    device: "iOS 16以降 + Developer Mode有効化";
  };

  deviceRegistration: {
    command: "eas device:create";
    process: [
      "アカウント確認",
      "Apple ID入力",
      "登録URL生成",
      "デバイスでリンク開く",
      "プロビジョニングプロファイルダウンロード",
      "設定アプリでインストール",
    ];
  };

  creation: {
    command: "eas build --platform ios --profile development";
    process: [
      "バンドル識別子設定",
      "Apple Distribution Certificate生成",
      "ad hocビルド用デバイス選択",
    ];
  };

  installation: {
    expoOrbit: {
      steps: [
        "USB経由でデバイス接続",
        "Orbitアプリ起動",
        "デバイスとビルド選択",
      ];
    };
    qrCode: {
      steps: [
        "ビルド成果物で'Install'クリック",
        "デバイスでQRスキャン",
      ];
    };
  };

  execution: {
    server: "npx expo start";
    deviceSteps: [
      "アプリ起動",
      "Expoアカウントログイン",
      "開発サーバー選択",
    ];
  };
}
```

**実行例**：

```bash
# デバイス登録
eas device:create

# iOSデバイスビルド作成
eas build --platform ios --profile development

# 開発サーバー起動
npx expo start
```

**詳細ドキュメント**: [`ios-development-build-for-devices.md`](./eas/ios-development-build-for-devices.md)

## 🔄 内部配信とテスト

### 内部配信ビルド

```typescript
interface InternalDistribution {
  purpose: "チームメンバーとの更新共有とフィードバック収集";

  distributionMethods: {
    android: "Google Playベータ";
    ios: "TestFlight";
    eas: "簡素化された共有可能ビルドリンク";
  };

  configuration: {
    profile: "preview";
    easJson: {
      build: {
        preview: {
          distribution: "internal";
        };
      };
    };
  };

  creation: {
    android: {
      command: "eas build --platform android --profile preview";
      format: ".apk";
    };
    ios: {
      prerequisite: "eas device:create（デバイス登録）";
      command: "eas build --platform ios --profile preview";
      provisioning: "ad hocプロビジョニングプロファイル";
    };
  };

  sharing: {
    methods: [
      "ビルド詳細ページ",
      "Expo Orbit",
      "インストールリンク",
      "QRコード",
    ];
  };

  execution: {
    requirement: "開発サーバー不要";
    launch: "デバイスでアプリアイコンをタップ";
  };
}
```

**実行例**：

```bash
# Android内部配信ビルド
eas build --platform android --profile preview

# iOS内部配信ビルド（デバイス登録後）
eas device:create
eas build --platform ios --profile preview
```

**詳細ドキュメント**: [`internal-distribution-builds.md`](./eas/internal-distribution-builds.md)

## 🚀 プロダクションビルドと提出

### Android本番ビルド

```typescript
interface AndroidProduction {
  prerequisites: {
    account: "Google Play Developer Account（有料）";
    serviceAccount: "Google Service Accountキー";
    profile: "eas.jsonの本番ビルドプロファイル";
  };

  workflow: {
    step1: {
      action: "本番ビルド作成";
      command: "eas build --platform android";
      format: ".aab（Android App Bundle）";
    };
    step2: {
      action: "Google Play Consoleでアプリ作成";
      location: "Google Playダッシュボード";
    };
    step3: {
      action: "内部テストバージョンリリース";
      tasks: [
        "'Start testing now'クリック",
        "内部テスター用メールリスト作成",
        "新しいリリース作成",
        "署名キー選択",
      ];
    };
    step4: {
      action: "アプリバイナリアップロード";
      source: "EASダッシュボードから.aabダウンロード";
      destination: "Google Play Console";
    };
    step5: {
      action: "Google Service Account設定";
      file: "service-account-file.json";
      gitignore: true;
    };
  };

  easJsonConfiguration: {
    submit: {
      production: {
        android: {
          serviceAccountKeyPath: "./service-account-file.json";
          track: "internal" | "production";
        };
      };
    };
  };

  submission: {
    internal: "eas submit --platform android（track: internal）";
    production: "eas submit --platform android（track: production）";
    automated: "eas build --platform android --auto-submit";
  };
}
```

**eas.json設定例**：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        "track": "production"
      }
    }
  }
}
```

**実行例**：

```bash
# Android本番ビルド作成
eas build --platform android

# 手動提出
eas submit --platform android

# 自動提出付きビルド
eas build --platform android --auto-submit
```

**詳細ドキュメント**: [`android-production-build.md`](./eas/android-production-build.md)

### iOS本番ビルド

```typescript
interface IOSProduction {
  prerequisites: {
    account: "Apple Developer Account";
    profile: "eas.jsonの本番ビルドプロファイル";
  };

  workflow: {
    step1: {
      action: "配信プロビジョニングプロファイル作成";
      command: "eas credentials";
      process: [
        "iOSプラットフォーム選択",
        "本番ビルドプロファイル選択",
        "Apple Developerログイン",
        "配信証明書・プロファイル生成",
      ];
    };
    step2: {
      action: "本番ビルド作成";
      command: "eas build --platform ios";
    };
    step3: {
      action: "アプリバイナリ提出";
      command: "eas submit --platform ios";
      destination: "TestFlight";
    };
    step4: {
      action: "内部テストバージョンリリース";
      location: "Apple Developer Account > TestFlight";
      tasks: [
        "テストユーザーグループ作成",
        "テスター招待",
      ];
    };
    step5: {
      action: "App Store提出";
      location: "App Store Connect";
      requirements: [
        "メタデータ追加",
        "スクリーンショット提供",
        "ビルド選択",
        "レビュー提出",
      ];
    };
  };

  automation: {
    command: "eas build --platform ios --auto-submit";
    note: "TestFlightにアップロード、App Storeレビューは手動";
  };
}
```

**実行例**：

```bash
# 配信プロビジョニング設定
eas credentials

# iOS本番ビルド作成
eas build --platform ios

# TestFlightに提出
eas submit --platform ios

# 自動提出付きビルド
eas build --platform ios --auto-submit
```

**詳細ドキュメント**: [`ios-production-build.md`](./eas/ios-production-build.md)

## 📊 バージョン管理

### アプリバージョンの理解

```typescript
interface AppVersioning {
  types: {
    developer: {
      android: "versionCode（整数）";
      ios: "buildNumber（整数）";
      purpose: "ストア内の一意性識別";
      management: "各ビルドで増加必須";
    };
    user: {
      source: "app.config.js > version";
      format: "1.0.0（セマンティックバージョニング）";
      purpose: "ユーザー向け表示";
      management: "手動管理";
    };
  };

  manualManagement: {
    location: "app.config.js";
    example: {
      ios: {
        buildNumber: "1";
      };
      android: {
        versionCode: 1;
      };
    };
  };
}
```

### EAS自動バージョン管理

```typescript
interface AutoVersionManagement {
  mechanism: "リモートバージョンソースによる自動インクリメント";

  configuration: {
    appVersionSource: "remote";
    autoIncrement: true;
    location: "eas.json";
  };

  defaultConfig: {
    cli: {
      appVersionSource: "remote";
    };
    build: {
      production: {
        autoIncrement: true;
      };
    };
  };

  syncExistingApp: {
    command: "eas build:version:set";
    process: [
      "プラットフォーム選択（Android/iOS）",
      "アプリバージョンソースをremoteに設定",
      "アプリストアからの最終バージョン番号入力",
    ];
  };

  benefits: [
    "手動管理エラー削減",
    "一意のバージョン保証",
    "本番ビルド自動化",
  ];
}
```

**eas.json設定**：

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

**実行例**：

```bash
# 既存アプリのバージョン同期
eas build:version:set
```

**詳細ドキュメント**: [`manage-app-versions.md`](./eas/manage-app-versions.md)

## 🎨 複数アプリバリアント

### 動的設定の実装

```typescript
interface AppVariants {
  purpose: "単一デバイスに複数バリアント（開発・プレビュー・本番）をインストール";

  implementation: {
    configFile: "app.config.js";
    environmentVariables: "APP_VARIANT環境変数";
    dynamicProperties: [
      "アプリ名",
      "バンドル識別子（iOS）",
      "パッケージ名（Android）",
    ];
  };

  variants: {
    development: {
      env: "APP_VARIANT=development";
      name: "StickerSmash (Dev)";
      identifier: "com.yourname.stickersmash.dev";
    };
    preview: {
      env: "APP_VARIANT=preview";
      name: "StickerSmash (Preview)";
      identifier: "com.yourname.stickersmash.preview";
    };
    production: {
      env: undefined;
      name: "StickerSmash: Emoji Stickers";
      identifier: "com.yourname.stickersmash";
    };
  };
}
```

### app.config.js実装

```javascript
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  }
  if (IS_PREVIEW) {
    return 'com.yourname.stickersmash.preview';
  }
  return 'com.yourname.stickersmash';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)';
  }
  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)';
  }
  return 'StickerSmash: Emoji Stickers';
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
```

### eas.json環境変数設定

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      }
    },
    "production": {}
  }
}
```

**詳細ドキュメント**: [`multiple-app-variants.md`](./eas/multiple-app-variants.md)

## 🔄 チーム開発とOTA更新

### EAS Update概要

```typescript
interface EASUpdate {
  purpose: "アプリストアリリース間の小さなバグ修正と変更プッシュ";

  setup: {
    step1: {
      action: "expo-updatesインストール";
      command: "npx expo install expo-updates";
    };
    step2: {
      action: "EAS Update設定";
      command: "eas update:configure";
    };
    step3: {
      action: "ビルドプロファイルにチャンネル追加";
      location: "eas.json";
    };
  };

  channels: {
    concept: "ビルドをグループ化するメカニズム";
    examples: ["development", "preview", "production"];
    mapping: "各ビルドプロファイルに対応";
  };

  workflow: {
    codeChange: "アプリコードの変更";
    publish: {
      command: "eas update --channel {channel} --message '{message}'";
      examples: [
        "eas update --channel development --message '最初のボタンラベルを変更'",
        "eas update --channel preview --message '最初のボタンラベルを変更'",
      ];
    };
    preview: {
      location: "開発ビルドのExtensionsタブ";
      access: "Branch: {channel} > Open";
    };
  };
}
```

### チャンネル設定

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

**実行例**：

```bash
# expo-updatesインストール
npx expo install expo-updates

# EAS Update設定
eas update:configure

# 開発チャンネルに更新公開
eas update --channel development --message "ボタンラベルを変更"

# プレビューチャンネルに更新公開
eas update --channel preview --message "本番前最終テスト"
```

**詳細ドキュメント**: [`team-development.md`](./eas/team-development.md)

## 🔗 GitHub連携

### GitHub連携の設定

```typescript
interface GitHubIntegration {
  purpose: "GitHubリポジトリからビルドを自動トリガー";

  setup: {
    step1: {
      action: "Expo GitHubアプリ設定";
      location: "https://expo.dev/settings#connections";
      process: [
        "Connections > GitHub > Connect",
        "Expo GitHubアプリ承認",
        "インストールをExpoアカウントにリンク",
      ];
    };
    step2: {
      action: "GitHubリポジトリ接続";
      location: "EASダッシュボード > Project settings > GitHub";
      process: "プロジェクトリポジトリを検索して接続";
    };
  };

  configuration: {
    buildImage: {
      location: "eas.json";
      requirement: "latest イメージ指定";
    };
  };

  triggering: {
    mechanism: "GitHub PRラベル";
    labels: {
      allPlatforms: "eas-build-all:development";
      android: "eas-build-android:development";
      ios: "eas-build-ios:development";
    };
    workflow: [
      "新しいブランチ作成",
      "コード変更",
      "プルリクエスト作成",
      "適切なラベル追加",
      "自動ビルド開始",
    ];
  };
}
```

### eas.json設定例

```json
{
  "build": {
    "development": {
      "android": {
        "image": "latest"
      },
      "ios": {
        "image": "latest"
      }
    }
  }
}
```

**実装パターン**：

```typescript
interface GitHubWorkflowPattern {
  prLabels: {
    development: "eas-build-all:development";
    preview: "eas-build-all:preview";
    production: "eas-build-all:production";
  };
  automation: {
    trigger: "ラベル追加時";
    platforms: ["Android", "iOS"];
    notification: "GitHub PRコメント";
  };
}
```

**詳細ドキュメント**: [`using-github.md`](./eas/using-github.md)

## 🎯 実装パターンとベストプラクティス

### 開発ワークフロー

```typescript
interface DevelopmentWorkflow {
  localDevelopment: {
    step1: "npx expo start（開発サーバー）";
    step2: "Expo Go または 開発ビルドで実行";
    step3: "コード変更とホットリロード";
  };

  buildCreation: {
    development: {
      purpose: "ネイティブコードテスト";
      command: "eas build --platform all --profile development";
      distribution: "Expo Orbit または QRコード";
    };
    preview: {
      purpose: "内部テスト・フィードバック";
      command: "eas build --platform all --profile preview";
      distribution: "チームメンバーとリンク共有";
    };
  };

  otaUpdates: {
    trigger: "JavaScriptコード変更時";
    command: "eas update --channel {channel}";
    scope: "ネイティブコード変更含まず";
    benefit: "即座の更新展開";
  };
}
```

### プロダクションリリース

```typescript
interface ProductionReleasePattern {
  preparation: {
    versionBump: "app.config.jsでバージョン更新";
    testing: [
      "開発ビルドでテスト",
      "プレビュービルドでQAテスト",
      "内部テスターフィードバック",
    ];
    changelog: "リリースノート作成";
  };

  buildAndSubmit: {
    android: {
      build: "eas build --platform android --auto-submit";
      track: "internal → production";
      review: "Google Play審査（数時間）";
    };
    ios: {
      build: "eas build --platform ios --auto-submit";
      testFlight: "TestFlightで内部テスト";
      submission: "App Store Connectで手動提出";
      review: "Apple審査（数日）";
    };
  };

  postRelease: {
    monitoring: [
      "クラッシュレポート監視",
      "ユーザーフィードバック確認",
      "パフォーマンスメトリクス追跡",
    ];
    hotfix: {
      trigger: "重大なバグ発見";
      method: "EAS Updateで即座修正（可能な場合）";
      alternative: "新しいビルド作成と提出";
    };
  };
}
```

### チーム開発ベストプラクティス

```typescript
interface TeamBestPractices {
  branchStrategy: {
    development: {
      branch: "develop";
      builds: "開発ビルド自動作成";
      updates: "頻繁なOTA更新";
    };
    staging: {
      branch: "staging";
      builds: "プレビュービルド";
      updates: "QAテスト用";
    };
    production: {
      branch: "main";
      builds: "本番リリースのみ";
      updates: "慎重な更新";
    };
  };

  cicdIntegration: {
    githubActions: {
      triggers: [
        "PR作成時：開発ビルド",
        "stagingマージ時：プレビュービルド",
        "mainマージ時：本番ビルド",
      ];
      secrets: ["EXPO_TOKEN"];
    };
  };

  communicationFlow: {
    buildNotifications: "Slack/Discord統合";
    qaFeedback: "専用チャンネル";
    releaseAnnouncements: "チーム全体通知";
  };

  securityPractices: [
    "アクセストークン適切管理",
    "環境変数でシークレット管理",
    "プロビジョニングプロファイル定期更新",
    "監査ログ定期確認",
  ];
}
```

## 🚀 高度な機能とトラブルシューティング

### ビルド最適化

```typescript
interface BuildOptimization {
  caching: {
    dependencies: "依存関係キャッシュ";
    nativeModules: "ネイティブモジュールキャッシュ";
    benefit: "ビルド時間短縮";
  };

  parallelBuilds: {
    method: "eas build --platform all";
    benefit: "Android・iOS同時ビルド";
    consideration: "ビルドクレジット消費2倍";
  };

  resourceManagement: {
    resourceClass: {
      default: "標準ビルドリソース";
      large: "大規模プロジェクト用";
      configuration: "eas.json > build > {profile} > resourceClass";
    };
  };
}
```

### トラブルシューティング

```typescript
interface Troubleshooting {
  commonIssues: {
    buildFailures: {
      symptoms: "ビルドエラー・失敗";
      solutions: [
        "eas.jsonの構文確認",
        "依存関係の互換性確認",
        "ログの詳細確認",
        "ローカルでのビルドテスト",
      ];
    };
    installationProblems: {
      android: {
        issue: "APKインストール失敗";
        solutions: [
          "不明なソースからのインストール許可",
          "古いバージョンのアンインストール",
          "十分なストレージ確保",
        ];
      };
      ios: {
        issue: "デバイスにインストール不可";
        solutions: [
          "デバイス登録確認",
          "プロビジョニングプロファイル更新",
          "Developer Mode有効化",
        ];
      };
    };
    updateIssues: {
      symptoms: "OTA更新が反映されない";
      solutions: [
        "アプリを完全終了して再起動",
        "正しいチャンネル確認",
        "expo-updatesバージョン確認",
        "updateチェックロジック確認",
      ];
    };
  };

  diagnosticCommands: {
    buildStatus: "eas build:list";
    buildDetails: "eas build:view {build-id}";
    credentials: "eas credentials";
    updateStatus: "eas update:list";
  };
}
```

## 📚 関連リソースと次のステップ

### EASサービス探索

```typescript
interface EASResources {
  coreServices: {
    build: {
      url: "https://docs.expo.dev/build/introduction/";
      topics: [
        "カスタムビルド設定",
        "ビルドシークレット管理",
        "ローカルビルド",
      ];
    };
    submit: {
      url: "https://docs.expo.dev/submit/introduction/";
      topics: [
        "自動送信設定",
        "ストアメタデータ管理",
        "複数ストア対応",
      ];
    };
    update: {
      url: "https://docs.expo.dev/eas-update/introduction/";
      topics: [
        "更新戦略",
        "ロールバック",
        "A/Bテスト",
      ];
    };
  };

  additionalServices: {
    hosting: {
      status: "プレビュー";
      purpose: "Webアプリホスティング";
    };
    metadata: {
      status: "プレビュー";
      purpose: "アプリストアメタデータ管理";
    };
    insights: {
      status: "プレビュー";
      purpose: "アプリパフォーマンス分析";
    };
  };
}
```

### 推奨ガイド

```typescript
interface RecommendedGuides {
  automation: {
    title: "送信の自動化";
    url: "https://docs.expo.dev/build/automate-submissions/";
    topics: ["CI/CD統合", "自動リリース"];
  };
  githubActions: {
    title: "EAS UpdateとGitHub Actions";
    url: "https://docs.expo.dev/eas-update/github-actions/";
    topics: ["自動更新", "ワークフロー統合"];
  };
  credentials: {
    title: "アプリの資格情報";
    url: "https://docs.expo.dev/app-signing/";
    topics: ["証明書管理", "プロビジョニング"];
  };
  development: {
    title: "Expoでアプリを開発";
    url: "https://docs.expo.dev/workflow/overview/";
    topics: ["開発ワークフロー", "ベストプラクティス"];
  };
}
```

### コミュニティサポート

```typescript
interface CommunitySupport {
  discord: {
    url: "https://chat.expo.dev/";
    purpose: "リアルタイムサポート・質問";
  };
  twitter: {
    url: "https://x.com/expo";
    purpose: "最新情報・経験共有";
  };
  forums: {
    url: "https://forums.expo.dev/";
    purpose: "詳細なディスカッション";
  };
  documentation: {
    url: "https://docs.expo.dev/";
    purpose: "包括的なドキュメント";
  };
}
```

**詳細ドキュメント**: [`next-steps.md`](./eas/next-steps.md)

## 🔗 内部リンク

### チュートリアルセクション

- [`introduction.md`](./eas/introduction.md) - イントロダクションと前提条件
- [`configure-development-build.md`](./eas/configure-development-build.md) - 開発ビルド設定
- [`android-development-build.md`](./eas/android-development-build.md) - Android開発ビルド
- [`ios-development-build-for-simulators.md`](./eas/ios-development-build-for-simulators.md) - iOSシミュレータービルド
- [`ios-development-build-for-devices.md`](./eas/ios-development-build-for-devices.md) - iOSデバイスビルド
- [`internal-distribution-builds.md`](./eas/internal-distribution-builds.md) - 内部配信ビルド
- [`android-production-build.md`](./eas/android-production-build.md) - Android本番ビルド
- [`ios-production-build.md`](./eas/ios-production-build.md) - iOS本番ビルド
- [`manage-app-versions.md`](./eas/manage-app-versions.md) - バージョン管理
- [`multiple-app-variants.md`](./eas/multiple-app-variants.md) - 複数アプリバリアント
- [`team-development.md`](./eas/team-development.md) - チーム開発とOTA更新
- [`using-github.md`](./eas/using-github.md) - GitHub連携
- [`next-steps.md`](./eas/next-steps.md) - 次のステップ

### 関連ドキュメント

- **[EAS Build](../build/)** - ビルドサービス詳細
- **[EAS Submit](../submit/)** - 提出サービス詳細
- **[EAS Update](../update/)** - 更新サービス詳細
- **[Accounts](../accounts.md)** - アカウント管理

## 📋 まとめ

```typescript
interface EASTutorialSummary {
  achievements: [
    "開発ビルド作成とインストール",
    "内部配信ビルドでのチーム共有",
    "本番ビルドの作成とストア提出",
    "自動バージョン管理の実装",
    "OTA更新によるコラボレーション",
    "GitHub連携の自動化",
    "複数アプリバリアントの設定",
  ];

  keyTakeaways: [
    "EAS Buildでクラウドビルド自動化",
    "開発・プレビュー・本番の明確な分離",
    "効率的なチーム開発ワークフロー",
    "CI/CD統合によるリリース自動化",
    "OTA更新による迅速なバグ修正",
  ];

  nextSteps: [
    "カスタムビルド設定の探索",
    "高度な更新戦略の実装",
    "監視とインサイトの統合",
    "エンタープライズ機能の活用",
  ];

  bestPractices: [
    "環境ごとにビルドプロファイル分離",
    "自動バージョン管理の活用",
    "セキュアな資格情報管理",
    "定期的なテストとQA",
    "継続的なモニタリング",
  ];
}
```

このチュートリアルを完了することで、Expo Application Servicesの中核機能を理解し、実践的な開発ワークフローを構築するための基礎を習得しました。さらなる学習のために、各EASサービスの詳細ドキュメントを探索し、プロジェクトの要件に応じて高度な機能を実装してください。
