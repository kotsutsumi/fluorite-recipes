# EAS Build - 包括的ビルドシステムガイド

## 📋 概要

EAS Build は、ExpoおよびReact Nativeプロジェクト向けのアプリバイナリをビルドするためのホスティングサービスです。ビルドプロセスの簡素化、署名認証情報の管理、内部配布、アプリストアへの自動提出を提供し、開発からデプロイまでの完全なワークフローをサポートします。

```typescript
interface EASBuildSystem {
  core: {
    buildService: "クラウドホスティングビルドサービス"
    platforms: ["iOS", "Android"]
    projectTypes: ["Expo", "React Native"]
  }
  capabilities: {
    binaryGeneration: "アプリバイナリのビルド"
    credentialManagement: "署名認証情報の自動処理"
    distribution: "内部配布とアプリストア提出"
    updates: "expo-updatesライブラリのサポート"
    automation: "CI/CD統合とGitHub連携"
  }
  workflow: {
    setup: "EAS CLI経由の初期設定"
    configuration: "eas.jsonによる柔軟な設定"
    execution: "ローカル・クラウド・CI環境での実行"
    deployment: "内部配布またはストア提出"
  }
}
```

## 🚀 主要機能

### コアサービス
- **クラウドビルド**: インフラ管理不要のホスティングサービス
- **認証情報管理**: iOS証明書・Androidキーストアの自動処理
- **マルチプラットフォーム**: iOSとAndroidの統一ビルドワークフロー
- **柔軟な配布**: 内部テストからアプリストア提出まで対応

### 統合機能
- **EAS Submit**: アプリストアへの自動提出
- **EAS Update**: OTAアップデート管理
- **GitHub連携**: PR・ブランチ・タグベースのビルドトリガー
- **CI/CD統合**: 主要CIサービスとのシームレスな統合

## 📚 トピックガイド

### 基礎知識
- [introduction.md](./build/introduction.md) - EAS Buildの概要と主要機能
- [setup.md](./build/setup.md) - 初期セットアップと最初のビルド作成
- [eas-json.md](./build/eas-json.md) - ビルドプロファイルと設定詳細

### ビルド実行
- [building-from-github.md](./build/building-from-github.md) - GitHub連携とビルドトリガー
- [building-on-ci.md](./build/building-on-ci.md) - CI環境でのビルド実行

### 配布と提出
- [internal-distribution.md](./build/internal-distribution.md) - 内部配布設定とデバイス管理
- [orbit.md](./build/orbit.md) - Orbitによるビルド管理の簡素化
- [automate-submissions.md](./build/automate-submissions.md) - アプリストアへの自動提出

### 高度な機能
- [updates.md](./build/updates.md) - EAS Updateとの統合設定

## 🔧 セットアップと初期設定

### 前提条件

```typescript
interface Prerequisites {
  project: {
    type: "React Native Android/iOS プロジェクト"
    tools: ["Node.js 18.18+", "npm/yarn/pnpm"]
  }
  account: {
    expo: "Expoユーザーアカウント"
    apple?: "Apple Developer Program ($99/年)"
    google?: "Google Play Developer ($25 一度限り)"
  }
  cli: {
    eas: "最新のEAS CLIインストール"
    installation: "npm install -g eas-cli"
  }
}
```

### セットアップ手順

**1. プロジェクト作成**
```bash
# 新規プロジェクトの場合
npx create-expo-app my-app
cd my-app
```

**2. EAS CLIインストール**
```bash
npm install -g eas-cli
```

**3. アカウント認証**
```bash
eas login
```

**4. プロジェクト設定**
```bash
eas build:configure
```

このコマンドにより以下が生成されます：
- `eas.json` 設定ファイル
- プロジェクトID
- デフォルトビルドプロファイル

**5. 最初のビルド実行**
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# 全プラットフォーム
eas build --platform all
```

**詳細ドキュメント**: [setup.md](./build/setup.md)

## ⚙️ ビルドプロファイル設定

### eas.json の構造

```typescript
interface EASConfiguration {
  build: {
    [profileName: string]: BuildProfile
  }
}

interface BuildProfile {
  // 配布設定
  distribution?: "store" | "internal"
  developmentClient?: boolean

  // ビルドツール
  node?: string
  npm?: string
  yarn?: string
  pnpm?: string

  // リソース設定
  resourceClass?: "medium" | "large"

  // 環境変数
  env?: Record<string, string>

  // プラットフォーム固有設定
  android?: AndroidBuildProfile
  ios?: IOSBuildProfile

  // 継承
  extends?: string

  // EAS Update
  channel?: string
}
```

### デフォルトプロファイル

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### プロファイルタイプ

| プロファイル | 用途 | 配布方法 | 開発ツール | ストア提出 |
|------------|------|---------|----------|----------|
| **development** | 開発・デバッグ | internal | ✅ 含む | ❌ |
| **preview** | 内部テスト・QA | internal | ❌ 除外 | ❌ |
| **production** | 本番リリース | store | ❌ 除外 | ✅ |

### プロファイル継承パターン

```json
{
  "build": {
    "base": {
      "node": "18.18.0",
      "env": {
        "API_URL": "https://api.example.com"
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "https://dev-api.example.com"
      }
    },
    "staging": {
      "extends": "base",
      "distribution": "internal",
      "channel": "staging",
      "env": {
        "API_URL": "https://staging-api.example.com"
      }
    },
    "production": {
      "extends": "base",
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

### ビルドツールバージョン指定

```json
{
  "build": {
    "production": {
      "node": "18.18.0",
      "pnpm": "8.0.0",
      "resourceClass": "large"
    }
  }
}
```

### 環境変数の活用

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production",
        "API_URL": "https://api.example.com",
        "SENTRY_DSN": "https://..."
      }
    },
    "preview": {
      "env": {
        "APP_ENV": "staging",
        "API_URL": "https://staging-api.example.com"
      }
    }
  }
}
```

**app.config.js での活用**:
```javascript
export default () => {
  return {
    name: process.env.APP_ENV === 'production' ? 'MyApp' : 'MyApp (DEV)',
    ios: {
      bundleIdentifier: process.env.APP_ENV === 'production'
        ? 'com.myapp'
        : 'com.myapp.dev',
    },
    android: {
      package: process.env.APP_ENV === 'production'
        ? 'com.myapp'
        : 'com.myapp.dev',
    },
    extra: {
      apiUrl: process.env.API_URL,
      sentryDsn: process.env.SENTRY_DSN,
    }
  };
};
```

**詳細ドキュメント**: [eas-json.md](./build/eas-json.md)

## 🔄 ビルド実行パターン

### ローカル実行

```bash
# プロファイル指定
eas build --platform android --profile preview

# 非対話モード
eas build --platform all --non-interactive

# ビルド完了を待たずに終了
eas build --platform ios --no-wait

# 自動提出付き
eas build --platform android --auto-submit
```

### GitHub連携ビルド

```typescript
interface GitHubBuildTriggers {
  manual: {
    method: "Expo Webサイトの「Build from GitHub」ボタン"
    options: {
      gitReference: "ブランチ/コミット/タグ"
      platform: "ios | android | all"
      profile: "ビルドプロファイル名"
    }
  }

  prLabels: {
    "eas-build-android": "Android本番ビルド"
    "eas-build-ios": "iOS本番ビルド"
    "eas-build-all": "全プラットフォームビルド"
    "eas-build-android:preview": "Androidプレビュービルド"
    "eas-build-ios:development": "iOS開発ビルド"
  }

  autoTrigger: {
    branches: "ブランチマッチング（ワイルドカード対応）"
    pullRequests: "PR作成・更新時の自動ビルド"
    gitTags: "タグプッシュ時のビルド"
    autoSubmit: "ビルド完了後の自動ストア提出"
  }
}
```

#### GitHub連携の前提条件

```typescript
interface GitHubIntegrationPrerequisites {
  easJson: {
    requirement: "各プラットフォームにimageフィールド設定"
    example: {
      build: {
        production: {
          android: { image: "latest" },
          ios: { image: "latest" }
        }
      }
    }
  }

  localBuild: {
    requirement: "ローカルで成功したビルド実行"
    reason: "認証情報と設定の検証"
  }

  githubAccount: {
    requirement: "ExpoユーザーとGitHubアカウントのリンク"
    setup: "Expo GitHubアプリの権限承認"
  }

  repository: {
    type: "組織リポジトリのみリンク可能"
    configuration: "サブディレクトリの場合はベースディレクトリ指定"
  }
}
```

#### 自動ビルドトリガー設定例

```yaml
# Expo Webサイトでの設定
triggers:
  branches:
    - pattern: "main"
      platforms: ["ios", "android"]
      profile: "production"
      autoSubmit: true

    - pattern: "develop"
      platforms: ["ios", "android"]
      profile: "preview"
      autoSubmit: false

    - pattern: "feature/*"
      platforms: ["android"]
      profile: "development"

  pullRequests:
    - enabled: true
      platforms: ["android"]
      profile: "preview"

  gitTags:
    - pattern: "v*.*.*"
      platforms: ["ios", "android"]
      profile: "production"
      autoSubmit: true
```

**詳細ドキュメント**: [building-from-github.md](./build/building-from-github.md)

### CI/CD統合

```typescript
interface CIIntegrationPattern {
  authentication: {
    expoToken: {
      requirement: "個人アクセストークン"
      envVar: "EXPO_TOKEN"
      creation: "https://expo.dev/settings/access-tokens"
    }

    appleCredentials?: {
      EXPO_ASC_API_KEY_PATH: "App Store Connect APIキーパス"
      EXPO_ASC_KEY_ID: "APIキーID"
      EXPO_ASC_ISSUER_ID: "発行者ID"
      EXPO_APPLE_TEAM_ID: "チームID"
      EXPO_APPLE_TEAM_TYPE: "チームタイプ"
    }
  }

  buildCommand: {
    basic: "eas build --platform all --non-interactive"
    noWait: "eas build --platform all --non-interactive --no-wait"
    withProfile: "eas build --platform all --profile production --non-interactive"
  }
}
```

#### GitHub Actions設定例

```yaml
name: EAS Build
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  build:
    name: Build App
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build on EAS
        run: eas build --platform all --non-interactive --profile ${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }}
```

#### GitLab CI設定例

```yaml
stages:
  - build

build_app:
  stage: build
  image: node:18
  before_script:
    - npm install -g eas-cli
    - export EXPO_TOKEN=$EXPO_TOKEN
  script:
    - npm ci
    - eas build --platform all --non-interactive
  only:
    - main
    - develop
```

#### CircleCI設定例

```yaml
version: 2.1

executors:
  node:
    docker:
      - image: cimg/node:18.18

jobs:
  build:
    executor: node
    steps:
      - checkout
      - run:
          name: Install EAS CLI
          command: npm install -g eas-cli
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Build on EAS
          command: eas build --platform all --non-interactive

workflows:
  build_app:
    jobs:
      - build:
          filters:
            branches:
              only:
                - main
                - develop
```

**詳細ドキュメント**: [building-on-ci.md](./build/building-on-ci.md)

## 📦 内部配布

### 内部配布の概要

```typescript
interface InternalDistribution {
  purpose: "チームメンバー・テスターへのビルド共有"
  mechanism: "共有可能なURLによる配布"
  configuration: {
    easJson: {
      distribution: "internal"
    }
  }

  platformBehavior: {
    android: {
      buildType: "APK（AABではなく）"
      keystore: "新規作成または既存使用"
      installation: "デバイスへの直接インストール可能"
      distribution: ["Web", "メール", "USB"]
    }

    ios: {
      provisioning: "アドホックまたはエンタープライズ"
      deviceRegistration: "eas device:create で登録必要"
      limitations: {
        adHoc: "年間100デバイスまで"
        enterprise: "無制限（Enterprise Program必要）"
      }
    }
  }
}
```

### iOS配布オプション

**1. アドホック配布**
```typescript
interface AdHocDistribution {
  requirements: {
    account: "有料Apple Developer アカウント"
    cost: "$99/年"
  }
  limitations: {
    devices: "年間100デバイスまで"
    registration: "デバイスUDID登録必須"
  }
  useCases: [
    "小規模チームテスト",
    "ベータテスター配布",
    "QA検証"
  ]
}
```

**2. エンタープライズ配布**
```typescript
interface EnterpriseDistribution {
  requirements: {
    account: "Apple Developer Enterprise Program"
    cost: "$299/年"
    eligibility: "組織のみ（DUNS番号必要）"
  }
  capabilities: {
    devices: "無制限"
    registration: "デバイス登録不要"
  }
  useCases: [
    "社内業務アプリ",
    "大規模組織配布",
    "エンタープライズソリューション"
  ]
  restrictions: [
    "公開配布禁止",
    "組織内部使用のみ"
  ]
}
```

### デバイス管理コマンド

```bash
# デバイスの登録（iOS）
eas device:create

# デバイス一覧表示
eas device:list

# デバイスの削除
eas device:delete

# デバイスの名前変更
eas device:rename
```

### 内部配布設定例

```json
{
  "build": {
    "internal": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "enterpriseProvisioning": "adhoc"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "team-test": {
      "extends": "internal",
      "channel": "team-testing"
    }
  }
}
```

### CI での非対話型内部配布

```bash
# 非対話モードでの内部配布ビルド
eas build --platform android --profile internal --non-interactive

# iOS は事前にデバイス登録が必要
# 注意: iOSデバイスプロビジョニングには制限あり
```

**詳細ドキュメント**: [internal-distribution.md](./build/internal-distribution.md)

## 🚀 自動提出

### 自動提出の仕組み

```typescript
interface AutoSubmission {
  trigger: {
    flag: "--auto-submit"
    profileSelection: {
      default: "ビルドプロファイル名と同名"
      custom: "--auto-submit-with-profile=<profile-name>"
    }
  }

  workflow: {
    build: "EAS Build でビルド実行"
    completion: "ビルド成功時"
    submission: "自動的にアプリストアへ提出"
  }

  configuration: {
    envVariables: "ビルドプロファイルの環境変数を使用"
    appConfig: "app.config.js の評価時に適用"
  }
}
```

### プラットフォーム別デフォルト動作

**Android提出**
```typescript
interface AndroidSubmission {
  defaultBehavior: {
    releaseType: "内部リリース（internal）"
    status: "draft"
  }

  configurableOptions: {
    track: ["internal", "alpha", "beta", "production"]
    releaseStatus: ["draft", "completed", "inProgress", "halted"]
  }

  workflow: {
    newApp: "初回は内部リリースとして作成"
    promotion: "段階的にトラックを昇格"
    testing: "内部テスター → アルファ → ベータ → 本番"
  }
}
```

**iOS提出**
```typescript
interface IOSSubmission {
  defaultBehavior: {
    destination: "TestFlight"
    availability: "内部テスト"
  }

  testFlight: {
    internalTesters: "最大100人"
    externalTesters: "最大10,000人（レビュー必要）"
    groups: "複数のTestFlightグループ指定可能"
  }

  appStore: {
    review: "手動のApp Storeレビュープロセス"
    metadata: "EAS Metadata で更新可能"
  }
}
```

### 提出設定例

**eas.json ビルド設定**
```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production",
        "APP_VARIANT": "production"
      }
    },
    "staging": {
      "env": {
        "APP_ENV": "staging",
        "APP_VARIANT": "staging"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "production",
        "releaseStatus": "completed"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      }
    },
    "staging": {
      "android": {
        "track": "internal",
        "releaseStatus": "completed"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      }
    }
  }
}
```

**app.config.js での環境別設定**
```javascript
export default () => {
  const isProduction = process.env.APP_ENV === 'production';

  return {
    name: isProduction ? 'MyApp' : 'MyApp (Staging)',
    slug: 'my-app',
    version: '1.0.0',
    ios: {
      bundleIdentifier: isProduction
        ? 'com.mycompany.myapp'
        : 'com.mycompany.myapp.staging',
      buildNumber: '1'
    },
    android: {
      package: isProduction
        ? 'com.mycompany.myapp'
        : 'com.mycompany.myapp.staging',
      versionCode: 1
    }
  };
};
```

### 自動提出コマンド

```bash
# デフォルトプロファイルで自動提出
eas build --platform all --auto-submit

# カスタム提出プロファイル指定
eas build --platform android --profile production --auto-submit-with-profile staging

# GitHub連携での自動提出
# Expo Webサイトのビルドトリガー設定で autoSubmit を有効化
```

### 提出後のメタデータ更新

```typescript
interface MetadataUpdate {
  limitation: "EAS Submit はストアメタデータを更新しない"

  solutions: {
    easMetadata: {
      purpose: "TestFlightアップロード後のiOSアプリ情報更新"
      usage: "eas metadata:push"
    }

    manualUpdate: {
      android: "Google Play Console"
      ios: "App Store Connect"
    }
  }
}
```

**詳細ドキュメント**: [automate-submissions.md](./build/automate-submissions.md)

## 🔄 EAS Update統合

### EAS Updateとは

```typescript
interface EASUpdate {
  purpose: "ネイティブビルドなしでのアプリアップデート配信"
  mechanism: "OTA（Over-The-Air）アップデート"

  capabilities: {
    updates: "JavaScript・アセット・設定の更新"
    instant: "アプリストアレビュー不要"
    rollback: "問題発生時の即座のロールバック"
  }

  limitations: {
    nativeCode: "ネイティブコード変更は不可"
    binaryRequired: "ネイティブライブラリ変更時は新規ビルド必要"
  }
}
```

### チャネル設定

```typescript
interface ChannelConfiguration {
  concept: "異なるビルドプロファイルに異なるチャネルを割り当て"

  pattern: {
    production: "本番ユーザー向けアップデート"
    staging: "内部テスト・QA向けアップデート"
    development: "開発者向けアップデート"
  }
}
```

**eas.json でのチャネル設定**
```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "staging",
      "distribution": "internal"
    },
    "development": {
      "channel": "development",
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

### ランタイムバージョン管理

```typescript
interface RuntimeVersionManagement {
  purpose: "バイナリとアップデートの互換性保証"

  principle: "各バイナリバージョンに異なるランタイムバージョンを使用"

  incrementTriggers: [
    "ネイティブライブラリの追加・削除",
    "ネイティブモジュールの更新",
    "app.json の変更",
    "Expo SDK バージョン変更"
  ]

  risks: {
    mismatch: "互換性のないアップデートによるアプリクラッシュ"
    prevention: "適切なランタイムバージョン管理"
  }
}
```

**ランタイムバージョン設定例**
```json
// app.json
{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

**カスタムランタイムバージョン**
```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

**app.config.js での動的設定**
```javascript
export default {
  expo: {
    runtimeVersion: {
      policy: 'appVersion'
    },
    ios: {
      buildNumber: '1.0.0'
    },
    android: {
      versionCode: 1
    }
  }
};
```

### 開発ビルドでのプレビュー

```typescript
interface DevelopmentPreview {
  limitation: "runtimeVersion を持つアップデートはExpo Goで読み込めない"

  solution: {
    tool: "expo-dev-client"
    process: "開発ビルドを作成してアップデートをプレビュー"
  }

  workflow: {
    build: "eas build --profile development"
    install: "デバイスにインストール"
    update: "eas update でアップデート公開"
    test: "開発ビルドでアップデートをテスト"
  }
}
```

### 環境変数の注意点

```typescript
interface EnvironmentVariableRestriction {
  issue: "ビルドプロファイルの env フィールドは eas update では利用不可"

  reason: "ビルド時とアップデート時で異なるコンテキスト"

  solution: {
    buildTime: "eas.json の build.*.env でビルド時環境変数"
    updateTime: "app.config.js で直接定義または外部設定管理"
    runtime: "アプリ内で動的に環境を切り替え"
  }
}
```

### アップデート公開ワークフロー

```bash
# 特定のチャネルへのアップデート公開
eas update --channel production --message "Fix critical bug"

# ブランチ指定
eas update --branch production --message "New feature"

# 自動公開（ビルド後）
eas build --platform all --auto-submit
```

**詳細ドキュメント**: [updates.md](./build/updates.md)

## 🛠️ Expo Orbit

### Orbitの概要

```typescript
interface ExpoOrbit {
  purpose: "デバイス・シミュレーター管理とビルド配布の簡素化"
  tagline: "ワンクリックのビルドとアップデート起動"

  capabilities: {
    simulators: "シミュレーターのリスト表示と起動"
    builds: "EASビルドのインストールと起動"
    updates: "EAS Updateのインストールと起動"
    snacks: "Snackプロジェクトの起動"
    localFiles: "ローカルファイルからのアプリインストール"
    quickAccess: "ピン留めプロジェクトへのクイックアクセス"
  }

  platforms: {
    macOS: "フルサポート（Homebrew経由）"
    windows: "プレビュー版（x64・x86対応）"
  }
}
```

### インストール

**macOS**
```bash
# Homebrewでインストール
brew install expo-orbit

# 自動起動設定（オプション）
# Orbit設定で「Launch on Login」を有効化
```

**Windows**
```typescript
interface WindowsInstallation {
  status: "プレビュー版"
  compatibility: ["x64", "x86"]
  installation: "GitHubリリースからダウンロード"
  url: "https://github.com/expo/orbit/releases"
}
```

### システム要件

```typescript
interface SystemRequirements {
  common: {
    androidSDK: "Android開発に必要"
    androidStudio: "推奨"
  }

  macOS: {
    xcrun: "デバイス管理に必要"
    xcode: "iOS開発に必要"
  }

  windows: {
    architecture: ["x64", "x86"]
    androidStudio: "Android開発に必要"
  }
}
```

### 主要機能

**1. シミュレーター管理**
```typescript
interface SimulatorManagement {
  actions: {
    list: "利用可能なシミュレーター一覧"
    launch: "シミュレーターの起動"
    install: "アプリのインストール"
  }

  platforms: {
    ios: "iOSシミュレーター（macOSのみ）"
    android: "Androidエミュレーター（全プラットフォーム）"
  }
}
```

**2. EASビルド統合**
```typescript
interface EASBuildIntegration {
  workflow: {
    access: "Orbit から EAS ダッシュボードに直接アクセス"
    download: "ビルドのダウンロード"
    install: "シミュレーター・デバイスへのインストール"
    launch: "アプリの起動"
  }

  advantages: {
    speed: "ワンクリックでのインストール・起動"
    simplicity: "複雑なコマンド不要"
    visibility: "ビルドステータスの可視化"
  }
}
```

**3. EAS Update統合**
```typescript
interface EASUpdateIntegration {
  capabilities: {
    view: "利用可能なアップデートの表示"
    install: "アップデートのインストール"
    test: "開発ビルドでのアップデートテスト"
  }

  workflow: {
    publish: "eas update でアップデート公開"
    access: "Orbit からアップデートを確認"
    install: "ワンクリックでインストール"
    verify: "アプリでアップデートを検証"
  }
}
```

**4. Snack統合**
```typescript
interface SnackIntegration {
  purpose: "Snackプロジェクトをシミュレーターで直接実行"

  workflow: {
    create: "expo.dev/snack でプロジェクト作成"
    share: "Snack URLを取得"
    launch: "Orbit から URL でシミュレーター起動"
  }
}
```

**5. ローカルファイル対応**
```typescript
interface LocalFileSupport {
  supportedFormats: {
    ios: [".app", ".ipa"]
    android: [".apk", ".aab"]
  }

  installation: {
    method: "ドラッグ&ドロップまたはファイル選択"
    targets: ["シミュレーター", "接続されたデバイス"]
  }
}
```

### 開発ワークフローの改善

```typescript
interface WorkflowImprovement {
  before: {
    steps: [
      "EAS ダッシュボードにアクセス",
      "ビルドをダウンロード",
      "ターミナルでインストールコマンド実行",
      "シミュレーターを手動起動",
      "アプリを起動"
    ]
    timeEstimate: "5-10分"
  }

  after: {
    steps: [
      "Orbit でビルドを選択",
      "インストール・起動をクリック"
    ]
    timeEstimate: "30秒"
  }

  improvement: {
    timeReduction: "90%以上の時間短縮"
    complexity: "手動ステップの大幅削減"
    errorReduction: "コマンドミスの防止"
  }
}
```

**詳細ドキュメント**: [orbit.md](./build/orbit.md)

## 🎯 実装パターンとベストプラクティス

### プロジェクト構成パターン

**モノレポ構成**
```json
{
  "build": {
    "base": {
      "node": "18.18.0",
      "pnpm": "8.0.0"
    },
    "app1-production": {
      "extends": "base",
      "channel": "production",
      "env": {
        "APP_ID": "app1"
      }
    },
    "app2-production": {
      "extends": "base",
      "channel": "production",
      "env": {
        "APP_ID": "app2"
      }
    }
  }
}
```

**環境別構成**
```json
{
  "build": {
    "base": {
      "node": "18.18.0",
      "resourceClass": "medium"
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "distribution": "internal",
      "channel": "staging",
      "env": {
        "ENVIRONMENT": "staging",
        "API_URL": "https://staging-api.example.com"
      }
    },
    "production": {
      "extends": "base",
      "channel": "production",
      "resourceClass": "large",
      "env": {
        "ENVIRONMENT": "production",
        "API_URL": "https://api.example.com"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### CI/CD統合パターン

**GitHub Actions完全ワークフロー**
```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  release:
    types: [published]

env:
  NODE_VERSION: '18.x'

jobs:
  build-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: npm ci

      - name: Build Preview
        run: eas build --platform all --profile preview --non-interactive --no-wait

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview build started! Check status at https://expo.dev'
            })

  build-staging:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: npm ci

      - name: Build Staging
        run: eas build --platform all --profile staging --non-interactive

  build-production:
    if: github.ref == 'refs/heads/main' || github.event_name == 'release'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: npm ci

      - name: Build and Submit Production
        run: eas build --platform all --profile production --auto-submit --non-interactive

      - name: Create GitHub Release Comment
        if: github.event_name == 'release'
        run: echo "Production build completed and submitted to stores"
```

### 認証情報管理パターン

```typescript
interface CredentialManagement {
  personal: {
    method: "ロボットユーザー作成"
    token: "専用アクセストークン"
    rotation: "90日ごとにローテーション"
  }

  team: {
    method: "組織アカウント"
    roles: {
      ci: "Developer ロール（ビルド・提出のみ）"
      admin: "Admin ロール（設定変更）"
    }
  }

  secrets: {
    storage: "CI/CD secrets（暗号化）"
    access: "ビルドワークフローのみ"
    audit: "アクセスログ監視"
  }
}
```

### バージョン管理パターン

```typescript
interface VersionManagement {
  semantic: {
    format: "major.minor.patch"
    increment: {
      major: "破壊的変更"
      minor: "新機能追加"
      patch: "バグフィックス"
    }
  }

  automation: {
    ios: {
      version: "CFBundleShortVersionString"
      buildNumber: "CFBundleVersion（自動インクリメント）"
    }
    android: {
      versionName: "semantic version"
      versionCode: "整数（自動インクリメント）"
    }
  }

  strategy: {
    production: "手動バージョン管理"
    staging: "自動ビルド番号インクリメント"
    development: "日付ベースバージョン"
  }
}
```

**package.json でのバージョン管理**
```json
{
  "version": "1.2.3",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

**app.config.js での自動バージョン**
```javascript
import packageJson from './package.json';

export default {
  expo: {
    version: packageJson.version,
    ios: {
      buildNumber: process.env.BUILD_NUMBER || '1'
    },
    android: {
      versionCode: parseInt(process.env.BUILD_NUMBER || '1')
    }
  }
};
```

### エラーハンドリングパターン

```typescript
interface ErrorHandling {
  buildFailures: {
    detection: "ビルドログ監視"
    notification: "Slack・メール通知"
    rollback: "前のビルドへのロールバック"
  }

  credentialIssues: {
    validation: "ビルド前の認証情報検証"
    renewal: "証明書期限監視と更新"
    backup: "認証情報のバックアップ"
  }

  submissionFailures: {
    retry: "自動リトライ（指数バックオフ）"
    manual: "手動介入の通知"
    logging: "詳細なエラーログ記録"
  }
}
```

## 📊 コマンドリファレンス

### ビルドコマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `eas build:configure` | プロジェクトの初期設定 | `eas build:configure` |
| `eas build` | ビルド実行 | `eas build --platform all` |
| `eas build --platform <platform>` | 特定プラットフォームビルド | `eas build --platform ios` |
| `eas build --profile <profile>` | プロファイル指定ビルド | `eas build --profile staging` |
| `eas build --non-interactive` | 非対話モード | `eas build --non-interactive` |
| `eas build --no-wait` | ビルド完了を待たない | `eas build --no-wait` |
| `eas build --auto-submit` | 自動提出 | `eas build --auto-submit` |
| `eas build --clear-cache` | キャッシュクリア | `eas build --clear-cache` |
| `eas build --local` | ローカルビルド | `eas build --local` |
| `eas build:list` | ビルド一覧表示 | `eas build:list` |
| `eas build:view <build-id>` | ビルド詳細表示 | `eas build:view abc123` |
| `eas build:cancel <build-id>` | ビルドキャンセル | `eas build:cancel abc123` |

### デバイス管理コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `eas device:create` | デバイス登録（iOS） | `eas device:create` |
| `eas device:list` | デバイス一覧表示 | `eas device:list` |
| `eas device:view <device-id>` | デバイス詳細表示 | `eas device:view xyz789` |
| `eas device:delete` | デバイス削除 | `eas device:delete` |
| `eas device:rename` | デバイス名変更 | `eas device:rename` |

### 認証情報管理コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `eas credentials` | 認証情報管理メニュー | `eas credentials` |
| `eas credentials:configure-build` | ビルド認証情報設定 | `eas credentials:configure-build` |

### 更新コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `eas update` | アップデート公開 | `eas update --channel production` |
| `eas update --branch <branch>` | ブランチ指定公開 | `eas update --branch main` |
| `eas update --message <message>` | メッセージ付き公開 | `eas update --message "Fix bug"` |
| `eas channel:create <name>` | チャネル作成 | `eas channel:create staging` |
| `eas channel:list` | チャネル一覧 | `eas channel:list` |
| `eas channel:view <name>` | チャネル詳細 | `eas channel:view production` |

### 提出コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `eas submit` | アプリストア提出 | `eas submit --platform ios` |
| `eas submit --profile <profile>` | プロファイル指定提出 | `eas submit --profile production` |
| `eas submit --latest` | 最新ビルドを提出 | `eas submit --latest` |

## 🔍 トラブルシューティング

### ビルドエラー

**問題: ビルドが失敗する**
```typescript
interface BuildFailureTroubleshooting {
  checkList: [
    "ビルドログの確認",
    "eas.json の設定検証",
    "package.json の依存関係確認",
    "認証情報の有効性確認",
    "キャッシュのクリア"
  ]

  solutions: {
    logs: "eas build:view <build-id> でログ確認"
    cache: "eas build --clear-cache"
    credentials: "eas credentials で認証情報再設定"
    dependencies: "npm ci でクリーンインストール"
  }
}
```

**一般的なビルドエラーと対策**

| エラー | 原因 | 解決方法 |
|--------|------|---------|
| "No matching provisioning profiles found" | iOS証明書・プロファイル不足 | `eas credentials` で再設定 |
| "Gradle build failed" | Android依存関係エラー | `android/` フォルダの `gradlew clean` |
| "Metro bundler error" | JavaScriptバンドルエラー | キャッシュクリアと再ビルド |
| "Out of memory" | ビルドリソース不足 | `resourceClass: "large"` に変更 |
| "Invalid credentials" | 認証情報期限切れ | 認証情報の更新 |

### GitHub連携の問題

**問題: GitHubからビルドがトリガーされない**
```typescript
interface GitHubTriggerTroubleshooting {
  prerequisites: [
    "eas.json に image フィールド設定確認",
    "ローカルでの成功したビルド確認",
    "GitHub アカウントリンク確認",
    "Expo GitHub アプリ権限確認"
  ]

  verification: {
    easJson: "各プラットフォームに image: 'latest' 設定",
    permissions: "Expo GitHub アプリが組織リポジトリにアクセス可能",
    baseDirectory: "サブディレクトリプロジェクトの場合はベースディレクトリ設定"
  }
}
```

### 内部配布の問題

**問題: iOSデバイスにインストールできない**
```typescript
interface IOSInstallationTroubleshooting {
  checklist: [
    "デバイスUDID登録確認",
    "プロビジョニングプロファイル確認",
    "証明書有効期限確認",
    "デバイス数制限（100台）確認"
  ]

  solutions: {
    registration: "eas device:create で再登録",
    provisioning: "eas build で新規プロビジョニング作成",
    limit: "不要なデバイスを削除または Enterprise アカウント検討"
  }
}
```

**問題: Androidデバイスにインストールできない**
```typescript
interface AndroidInstallationTroubleshooting {
  checklist: [
    "APK形式でビルドされているか確認（AABではない）",
    "不明なソースからのインストール許可確認",
    "デバイスの空き容量確認"
  ]

  solutions: {
    buildType: "eas.json で distribution: 'internal' 設定",
    permissions: "デバイス設定で不明なソースを許可",
    space: "デバイスの空き容量確保"
  }
}
```

### CI/CD統合の問題

**問題: CI環境でビルドが失敗する**
```typescript
interface CIBuildTroubleshooting {
  authentication: {
    issue: "EXPO_TOKEN が設定されていない"
    solution: "CI/CD secrets に EXPO_TOKEN 追加"
    verification: "echo $EXPO_TOKEN で確認"
  }

  dependencies: {
    issue: "依存関係のインストール失敗"
    solution: "npm ci または yarn install --frozen-lockfile"
    caching: "node_modules キャッシュ設定"
  }

  timeout: {
    issue: "ビルドタイムアウト"
    solution: "--no-wait フラグ使用でCI時間短縮"
  }
}
```

### 認証情報の問題

**問題: 証明書・プロファイルエラー**
```typescript
interface CredentialTroubleshooting {
  expiration: {
    detection: "eas credentials で有効期限確認"
    renewal: "Apple Developer ポータルで更新"
    sync: "eas credentials で再同期"
  }

  mismatch: {
    issue: "Bundle ID・Package Name 不一致"
    verification: "app.json と認証情報の一致確認"
    fix: "eas credentials:configure-build で再設定"
  }

  teamConflict: {
    issue: "複数Apple Teamへのアクセス"
    solution: "正しいTeam IDを指定"
    configuration: "eas.json に appleTeamId 追加"
  }
}
```

### パフォーマンス問題

**問題: ビルドが遅い**
```typescript
interface PerformanceTroubleshooting {
  resourceClass: {
    issue: "デフォルトリソースクラスが不足"
    solution: "eas.json で resourceClass: 'large' に変更"
    requirement: "有料EASプラン必要"
  }

  caching: {
    optimization: "依存関係キャッシュ活用"
    clearWhenNeeded: "問題時は --clear-cache"
  }

  dependencies: {
    optimization: "不要な依存関係の削減"
    nativeModules: "ネイティブモジュール最小化"
  }
}
```

## 📋 チェックリスト

### 初回セットアップチェックリスト

```typescript
interface SetupChecklist {
  project: [
    "✅ React Native/Expoプロジェクト作成",
    "✅ package.json 依存関係確認",
    "✅ app.json/app.config.js 設定完了"
  ]

  account: [
    "✅ Expoアカウント作成",
    "✅ Apple Developer アカウント（iOS）",
    "✅ Google Play Developer アカウント（Android）"
  ]

  tools: [
    "✅ Node.js 18.18+ インストール",
    "✅ EAS CLI インストール",
    "✅ eas login 実行"
  ]

  configuration: [
    "✅ eas build:configure 実行",
    "✅ eas.json 設定確認",
    "✅ ビルドプロファイル定義"
  ]

  firstBuild: [
    "✅ ローカルビルド成功確認",
    "✅ 認証情報生成確認",
    "✅ ビルドログ確認"
  ]
}
```

### 本番リリースチェックリスト

```typescript
interface ProductionReleaseChecklist {
  code: [
    "✅ すべてのテストパス",
    "✅ コードレビュー完了",
    "✅ 変更履歴記録",
    "✅ バージョン番号更新"
  ]

  configuration: [
    "✅ 本番環境変数設定",
    "✅ API URLの本番環境確認",
    "✅ 機能フラグ確認",
    "✅ ランタイムバージョン更新"
  ]

  credentials: [
    "✅ iOS証明書有効性確認",
    "✅ Androidキーストア確認",
    "✅ 証明書有効期限確認"
  ]

  build: [
    "✅ production プロファイルでビルド",
    "✅ ビルド成功確認",
    "✅ ビルドサイズ確認",
    "✅ クラッシュレポート設定確認"
  ]

  testing: [
    "✅ 内部配布でテスト完了",
    "✅ 主要機能動作確認",
    "✅ パフォーマンステスト",
    "✅ セキュリティチェック"
  ]

  submission: [
    "✅ アプリストアメタデータ準備",
    "✅ スクリーンショット準備",
    "✅ プライバシーポリシー確認",
    "✅ レビューガイドライン準拠確認"
  ]

  deployment: [
    "✅ 段階的ロールアウト計画",
    "✅ ロールバック計画準備",
    "✅ 監視・アラート設定",
    "✅ サポート体制確認"
  ]
}
```

### CI/CD統合チェックリスト

```typescript
interface CICDIntegrationChecklist {
  authentication: [
    "✅ 個人アクセストークン作成",
    "✅ CI/CD secrets 設定",
    "✅ ロボットユーザー作成（推奨）"
  ]

  workflow: [
    "✅ ワークフローファイル作成",
    "✅ トリガー条件設定",
    "✅ ビルドコマンド設定",
    "✅ 環境変数設定"
  ]

  testing: [
    "✅ CI環境での初回ビルド成功",
    "✅ 各ブランチでのテスト",
    "✅ エラーハンドリング確認"
  ]

  optimization: [
    "✅ キャッシュ設定",
    "✅ 並列実行設定",
    "✅ タイムアウト設定"
  ]
}
```

## 🔗 関連リソース

### 内部ドキュメント
- [introduction.md](./build/introduction.md) - EAS Build概要
- [setup.md](./build/setup.md) - 初期セットアップ
- [eas-json.md](./build/eas-json.md) - 設定詳細
- [building-from-github.md](./build/building-from-github.md) - GitHub連携
- [building-on-ci.md](./build/building-on-ci.md) - CI統合
- [internal-distribution.md](./build/internal-distribution.md) - 内部配布
- [orbit.md](./build/orbit.md) - Orbit ツール
- [automate-submissions.md](./build/automate-submissions.md) - 自動提出
- [updates.md](./build/updates.md) - EAS Update統合

### 外部リソース
- [EAS Build Dashboard](https://expo.dev/accounts/[account]/projects/[project]/builds) - ビルド管理
- [Expo Documentation](https://docs.expo.dev/build/introduction/) - 公式ドキュメント
- [EAS CLI Reference](https://docs.expo.dev/build-reference/eas-cli/) - CLIリファレンス
- [GitHub Expo/eas-cli](https://github.com/expo/eas-cli) - EAS CLI リポジトリ

### 関連サービス
- **[EAS Submit](../submit/)** - アプリストア提出サービス
- **[EAS Update](../update/)** - OTAアップデートサービス
- **[Expo Accounts](../accounts/)** - アカウント管理
- **[Credentials](../app-signing/)** - 認証情報管理

## 📋 まとめ

EAS Build は、モバイルアプリ開発のビルド・配布プロセスを包括的にサポートする強力なサービスです：

```typescript
interface EASBuildSummary {
  strengths: [
    "クラウドベースのホスティングビルドサービス",
    "認証情報の自動管理と安全な保管",
    "柔軟なビルドプロファイルと環境設定",
    "GitHub・CI/CDとのシームレスな統合",
    "内部配布からアプリストア提出までの一貫したワークフロー",
    "EAS Updateとの統合によるOTAアップデート",
    "Orbitによる開発者体験の向上"
  ]

  useCases: [
    "個人・チーム開発プロジェクト",
    "内部テスト・QA配布",
    "本番アプリのストア提出",
    "CI/CD自動化パイプライン",
    "複数環境管理",
    "エンタープライズアプリ配布"
  ]

  keyFeatures: {
    flexibility: "柔軟なプロファイル設定と環境分離",
    automation: "GitHub・CI連携による自動ビルド・提出",
    security: "認証情報の安全な管理",
    distribution: "内部配布とアプリストア提出の統一ワークフロー",
    updates: "バイナリ更新とOTAアップデートの統合管理",
    tooling: "Orbitによる開発効率の向上"
  }

  bestPractices: [
    "環境別のプロファイル定義",
    "プロファイル継承による設定の共通化",
    "CI/CD統合による自動化",
    "適切な内部配布設定",
    "ランタイムバージョンの適切な管理",
    "認証情報の定期的なローテーション",
    "ビルドログの監視とエラー対応"
  ]

  nextSteps: [
    "プロジェクト要件に応じたプロファイル設計",
    "GitHub連携またはCI統合の選択と実装",
    "内部配布ワークフローの構築",
    "本番リリースプロセスの確立",
    "EAS Update統合による継続的デリバリー",
    "監視とアラート体制の構築"
  ]
}
```

このガイドを参考に、プロジェクトの規模と要件に応じた最適なビルドワークフローを実装してください。
