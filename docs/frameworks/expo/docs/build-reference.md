# EAS Build Reference - 包括的ビルドリファレンス

## 📋 概要

EAS Build Reference は、Expo Application Services (EAS) を使用したモバイルアプリケーションビルドプロセスの完全なリファレンスです。プラットフォーム固有のビルド手順、設定、最適化、トラブルシューティングまで、ビルドに関するあらゆる技術情報を網羅しています。

```typescript
interface EASBuildReference {
  platforms: {
    android: AndroidBuildProcess
    ios: IOSBuildProcess
  }
  configuration: {
    setup: BuildConfiguration
    versions: VersionManagement
    variants: AppVariants
  }
  optimization: {
    caching: DependencyCaching
    infrastructure: ServerResources
  }
  advanced: {
    monorepos: MonorepoSupport
    extensions: AppExtensions
    localBuilds: LocalBuildExecution
  }
  troubleshooting: {
    errors: ErrorDiagnostics
    limitations: KnownLimitations
  }
}
```

## 🏗️ プラットフォーム別ビルドプロセス

### Androidビルドプロセス

```typescript
interface AndroidBuildProcess {
  buildFlow: {
    local: [
      "Git状態確認",
      "認証情報準備",
      "リポジトリtarball作成",
      "S3アップロード"
    ]
    remote: [
      "Dockerコンテナ作成",
      "プロジェクトダウンロード",
      "npmフック: eas-build-pre-install",
      "JavaScript依存関係インストール",
      "expo prebuild（管理プロジェクト）",
      "Gradle依存関係インストール",
      "npmフック: eas-build-post-install",
      "Gradleビルド実行",
      "アーティファクトアップロード",
      "完了フック実行"
    ]
  }

  buildTypes: {
    aab: {
      purpose: "Google Play Store提出用"
      command: "./gradlew :app:bundleRelease"
      default: true
    }
    apk: {
      purpose: "直接インストール・内部配布"
      command: "./gradlew :app:assembleRelease"
      useCases: ["テスト", "内部配布", "エミュレーター"]
    }
  }

  configuration: {
    gradleCommand: string
    buildType: "apk" | "aab"
    resourceClass: "default" | "large"
  }
}
```

**詳細ドキュメント**:
- [`android-builds.md`](./build-reference/android-builds.md) - Androidビルドプロセス
- [`apk.md`](./build-reference/apk.md) - APKビルド設定

### iOSビルドプロセス

```typescript
interface IOSBuildProcess {
  buildFlow: {
    local: [
      "Git状態確認",
      "認証情報準備",
      "Xcodeプロジェクト検証（Bare）",
      "リポジトリtarball作成",
      "S3アップロード"
    ]
    remote: [
      "macOS VM作成",
      "プロジェクトダウンロード",
      "npmフック: eas-build-pre-install",
      "JavaScript依存関係インストール",
      "expo prebuild（管理プロジェクト）",
      "CocoaPods依存関係インストール",
      "npmフック: eas-build-post-install",
      "Xcodeビルド実行",
      "アーティファクトアップロード",
      "完了フック実行"
    ]
  }

  buildOutputs: {
    ipa: {
      purpose: "App Store提出・配布"
      requirement: "プロビジョニングプロファイル"
    }
    app: {
      purpose: "シミュレーター専用"
      requirement: "simulator: true"
      benefits: [
        "Apple Developerアカウント不要",
        "署名不要",
        "高速ビルド"
      ]
    }
  }

  configuration: {
    buildConfiguration: "Debug" | "Release"
    scheme: string
    simulator: boolean
    resourceClass: "default" | "m-large"
  }
}
```

**詳細ドキュメント**:
- [`ios-builds.md`](./build-reference/ios-builds.md) - iOSビルドプロセス
- [`simulators.md`](./build-reference/simulators.md) - シミュレータービルド
- [`ios-capabilities.md`](./build-reference/ios-capabilities.md) - iOS機能管理

## ⚙️ ビルド設定

### ビルド設定プロセス

```typescript
interface BuildConfiguration {
  initialization: {
    command: "eas build:configure"
    steps: [
      "プラットフォーム選択",
      "eas.json作成",
      "プロジェクト設定検証"
    ]
  }

  easJson: {
    structure: {
      build: {
        development: DevelopmentProfile
        preview: PreviewProfile
        production: ProductionProfile
      }
    }
  }

  profiles: {
    development: {
      developmentClient: true
      distribution: "internal"
      purpose: "開発・デバッグ"
    }
    preview: {
      distribution: "internal"
      purpose: "内部テスト・レビュー"
    }
    production: {
      distribution: "store"
      purpose: "App Store・Google Play提出"
    }
  }

  platformSpecific: {
    android: {
      gradleCommand: string
      buildType: string
      image: string
      resourceClass: string
    }
    ios: {
      buildConfiguration: string
      scheme: string
      simulator: boolean
      image: string
      resourceClass: string
    }
  }

  environmentVariables: {
    scope: "profile" | "secret"
    usage: "API endpoints, feature flags"
    example: {
      production: {
        env: {
          API_URL: "https://api.production.com"
          ENVIRONMENT: "production"
        }
      }
    }
  }
}
```

**設定例**:
```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "resourceClass": "default"
      },
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "aab",
        "resourceClass": "large"
      },
      "ios": {
        "buildConfiguration": "Release",
        "resourceClass": "m-large"
      }
    }
  }
}
```

**詳細ドキュメント**: [`build-configuration.md`](./build-reference/build-configuration.md)

### アプリバージョン管理

```typescript
interface VersionManagement {
  versionTypes: {
    userFacing: {
      property: "version"
      visibility: "ストア表示"
      format: "セマンティックバージョニング (例: 1.0.0)"
      management: "手動更新推奨"
    }
    developer: {
      android: {
        property: "android.versionCode"
        type: "integer"
        autoIncrement: "remote source推奨"
      }
      ios: {
        property: "ios.buildNumber"
        type: "string"
        autoIncrement: "remote source推奨"
      }
    }
  }

  versionSources: {
    remote: {
      location: "EASサーバー"
      configuration: {
        "cli.appVersionSource": "remote",
        "build.production.autoIncrement": true
      }
      benefits: [
        "自動インクリメント",
        "重複防止",
        "手動管理不要"
      ]
    }
    local: {
      location: "app.json/app.config.js"
      management: "手動更新"
      configuration: {
        version: "1.0.0",
        android: { versionCode: 1 },
        ios: { buildNumber: "1" }
      }
    }
  }

  bestPractices: [
    "ユーザー向けバージョン: セマンティックバージョニング",
    "開発者向けビルドバージョン: リモート自動インクリメント",
    "全プラットフォームで一貫性維持",
    "バージョン変更のドキュメント化"
  ]
}
```

**詳細ドキュメント**: [`app-versions.md`](./build-reference/app-versions.md)

### アプリバリアント

```typescript
interface AppVariants {
  purpose: "同一デバイスに複数ビルドを同時インストール"

  requirements: {
    uniqueIdentifiers: {
      android: "applicationId（パッケージ名）"
      ios: "bundleIdentifier"
    }
  }

  configuration: {
    appConfig: `
      // app.config.js
      const IS_DEV = process.env.APP_VARIANT === 'development';

      export default {
        name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
        slug: 'my-app',
        ios: {
          bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
        },
        android: {
          package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
        }
      };
    `

    easJson: {
      build: {
        development: {
          env: { APP_VARIANT: "development" }
        },
        preview: {
          env: { APP_VARIANT: "preview" }
        },
        production: {
          env: { APP_VARIANT: "production" }
        }
      }
    }
  }

  customization: {
    appName: "環境別の名前（例: MyApp (Dev)）"
    appIcon: "環境別のアイコン"
    splashScreen: "環境別のスプラッシュスクリーン"
    colors: "環境別のカラースキーム"
  }

  useCases: [
    "開発・ステージング・本番環境の並行実行",
    "テストビルドと本番ビルドの同時インストール",
    "クライアント向けデモとアクティブ開発の分離"
  ]
}
```

**詳細ドキュメント**: [`variants.md`](./build-reference/variants.md)

## 🚀 パフォーマンス最適化

### 依存関係のキャッシュ

```typescript
interface DependencyCaching {
  javascriptDependencies: {
    npmCache: {
      enabled: "デフォルトで有効（npm, Yarn 2+）"
      yarn1Workaround: "必要（npm-cache-with-yarn.md参照）"
      disable: {
        variable: "EAS_BUILD_DISABLE_NPM_CACHE",
        value: "1"
      }
    }

    frozenLockfile: {
      default: true
      commands: ["yarn --frozen-lockfile", "npm ci"]
      disable: {
        variable: "EAS_NO_FROZEN_LOCKFILE",
        value: "1"
      }
    }
  }

  nativeDependencies: {
    android: {
      gradle: "自動キャッシュ"
      maven: "ローカルキャッシュから"
    }
    ios: {
      cocoapods: "キャッシュサーバーから"
      derivedData: "Xcode派生データキャッシュ"
    }
  }

  customCache: {
    configuration: {
      cache: {
        key: "cache-version-1"
        paths: ["node_modules", ".expo", "custom-dir"]
      }
    }
    invalidation: "cache.keyの変更時"
    restoration: "JavaScript依存関係インストール後"
  }

  bestPractices: [
    "適切なキャッシュキーでバージョン管理",
    "必要なディレクトリのみキャッシュ",
    "キャッシュサイズの管理",
    "定期的なキャッシュクリア"
  ]

  performanceGains: {
    withCache: "依存関係インストール: 28秒"
    withoutCache: "依存関係インストール: 3分"
    improvement: "50-70%の時間短縮"
  }
}
```

**詳細ドキュメント**:
- [`caching.md`](./build-reference/caching.md) - 依存関係キャッシュ
- [`npm-cache-with-yarn.md`](./build-reference/npm-cache-with-yarn.md) - Yarn 1対応

### ビルドサーバーインフラストラクチャ

```typescript
interface BuildInfrastructure {
  android: {
    standard: {
      image: "Ubuntu 22.04"
      cpu: "4コア"
      memory: "16 GB"
      disk: "100 GB"
      software: {
        node: ["18", "20", "22"],
        java: "OpenJDK 17",
        androidSDK: "35",
        gradle: "8.x"
      }
    }
    large: {
      cpu: "8コア"
      memory: "32 GB"
      disk: "200 GB"
      recommendation: "大規模プロジェクト・メモリ多消費ビルド"
    }
  }

  ios: {
    standard: {
      image: "macOS Sonoma 14.7"
      cpu: "Apple M1 8コア"
      memory: "16 GB"
      disk: "120 GB"
      software: {
        xcode: ["15.4", "16.0", "16.1"],
        node: ["18", "20", "22"],
        cocoapods: "1.15.x",
        ruby: "3.3.x"
      }
    }
    large: {
      cpu: "Apple M2 Pro 12コア"
      memory: "32 GB"
      disk: "240 GB"
      recommendation: "複雑なプロジェクト・マルチターゲット"
    }
  }

  imageSelection: {
    auto: "プロジェクト設定から自動選択"
    latest: "最新ソフトウェアバージョン"
    sdkSpecific: "sdk-54, sdk-53など"
    exact: "特定のイメージ名"
  }

  buildTimes: {
    android: {
      small: "3-5分",
      medium: "5-10分",
      large: "10-20分"
    }
    ios: {
      small: "5-8分",
      medium: "8-15分",
      large: "15-30分"
    }
  }

  ipAddresses: {
    url: "https://expo.dev/eas-build-worker-ips.txt"
    format: "Last-Modified・Expiresタイムスタンプ付き"
    usage: "ファイアウォール設定"
  }
}
```

**リソースクラス設定例**:
```json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "large"
      },
      "ios": {
        "resourceClass": "m-large"
      }
    }
  }
}
```

**詳細ドキュメント**: [`infrastructure.md`](./build-reference/infrastructure.md)

## 🔧 高度な機能

### モノレポサポート

```typescript
interface MonorepoSupport {
  requirements: {
    executionDirectory: "アプリディレクトリのルートから実行"
    configLocation: "eas.json, credentials.json をアプリルートに配置"
    workspaceSetup: "パッケージマネージャーのワークスペース機能"
  }

  directoryStructure: `
    monorepo/
    ├── packages/
    │   ├── shared/
    │   └── ui-components/
    ├── apps/
    │   ├── mobile-app/
    │   │   ├── eas.json
    │   │   ├── app.json
    │   │   └── package.json
    │   └── web-app/
    │       └── package.json
    └── package.json
  `

  workspaceManagers: {
    npm: "workspaces機能",
    yarn: "workspaces機能（Classic & 2+）",
    pnpm: "pnpm-workspace.yaml",
    bun: "workspaces機能（実験的）"
  }

  postinstallScript: {
    purpose: "モノレポルートでの依存関係ビルド"
    example: {
      scripts: {
        postinstall: "cd ../.. && yarn build"
      }
    }
  }

  execution: {
    correct: "cd apps/mobile-app && eas build",
    incorrect: "cd monorepo && eas build --path apps/mobile-app"
  }
}
```

**詳細ドキュメント**: [`build-with-monorepos.md`](./build-reference/build-with-monorepos.md)

### iOSアプリ拡張機能

```typescript
interface IOSAppExtensions {
  managedProjects: {
    status: "実験的サポート"
    configuration: {
      "expo.extra.eas.build.experimental.ios.appExtensions": [
        {
          targetName: "myappextension",
          bundleIdentifier: "com.myapp.extension",
          entitlements: {
            "com.apple.example": "value"
          }
        }
      ]
    }
  }

  bareProjects: {
    autoDetection: true
    credentialGeneration: "自動"
    manualConfig: "credentials.json"
  }

  extensionTypes: [
    "Today Widget",
    "Share Extension",
    "Notification Content Extension",
    "Notification Service Extension",
    "Action Extension",
    "Keyboard Extension",
    "Photo Editing Extension",
    "Intents Extension",
    "App Clip"
  ]

  provisioningProfiles: {
    requirement: "拡張機能ごとに個別プロファイル"
    setup: [
      "Apple Developer ConsoleでApp ID作成",
      "バンドル識別子設定",
      "必要な機能を有効化",
      "プロビジョニングプロファイル作成"
    ]
  }

  appGroups: {
    purpose: "メインアプリと拡張機能間のデータ共有"
    entitlement: "com.apple.security.application-groups"
    example: {
      ios: {
        entitlements: {
          "com.apple.security.application-groups": ["group.com.myapp"]
        }
      }
    }
  }

  bestPractices: [
    "バンドル識別子命名規則: com.company.app.extension-type",
    "App Groupsでデータ共有",
    "拡張機能サイズの最適化",
    "メモリ制限の考慮",
    "長時間実行タスクを避ける"
  ]
}
```

**詳細ドキュメント**: [`app-extensions.md`](./build-reference/app-extensions.md)

### ローカルビルド

```typescript
interface LocalBuilds {
  purpose: "マシン上でのEAS Buildプロセス実行"

  command: "eas build --local"

  useCases: [
    "クラウドビルド失敗のデバッグ",
    "サードパーティCI/CD制限の回避",
    "プライベート環境でのビルド"
  ]

  prerequisites: {
    authentication: ["eas login", "EXPO_TOKEN環境変数"]
    android: ["Android Studio", "Android SDK", "Java JDK"]
    ios: ["Xcode", "CocoaPods"]
  }

  debugVariables: {
    EAS_LOCAL_BUILD_SKIP_CLEANUP: "作業ディレクトリ保持"
    EAS_LOCAL_BUILD_WORKINGDIR: "カスタム作業ディレクトリ"
    EAS_LOCAL_BUILD_ARTIFACTS_DIR: "アーティファクト出力先"
  }

  limitations: [
    "プラットフォーム固有（macOS・Linux、Windowsサポートなし）",
    "バージョンカスタマイズ不可",
    "キャッシングサポートなし",
    "環境変数サポート限定的"
  ]

  advantages: [
    "デバッグの容易さ",
    "迅速なイテレーション",
    "プライバシー保護",
    "完全な環境制御"
  ]
}
```

**実行例**:
```bash
# 基本的なローカルビルド
eas build --platform android --local

# デバッグ情報を保持
EAS_LOCAL_BUILD_SKIP_CLEANUP=1 eas build --platform ios --local

# カスタムディレクトリ指定
EAS_LOCAL_BUILD_WORKINGDIR=/tmp/my-build eas build --local
```

**詳細ドキュメント**: [`local-builds.md`](./build-reference/local-builds.md)

### ビルドライフサイクルフック

```typescript
interface BuildLifecycleHooks {
  hooks: {
    "eas-build-pre-install": {
      timing: "npm install前"
      usage: "環境セットアップ、認証設定"
    }
    "eas-build-post-install": {
      timing: {
        android: "npm install + expo prebuild後",
        ios: "npm install + expo prebuild + pod install後"
      }
      usage: "ビルド前処理、コード生成"
    }
    "eas-build-on-success": {
      timing: "ビルド成功後"
      usage: "通知送信、アーティファクト処理"
    }
    "eas-build-on-error": {
      timing: "ビルド失敗後"
      usage: "エラー通知、ログ収集"
    }
    "eas-build-on-complete": {
      timing: "ビルド完了時（成功・失敗問わず）"
      usage: "クリーンアップ、統計収集"
      statusVariable: "EAS_BUILD_STATUS (finished|errored)"
    }
    "eas-build-on-cancel": {
      timing: "ビルドキャンセル時"
      usage: "リソースクリーンアップ"
    }
  }

  configuration: {
    "package.json": {
      scripts: {
        "eas-build-pre-install": "node scripts/pre-build.js",
        "eas-build-post-install": "node scripts/post-build.js"
      }
    }
  }

  commonUseCases: {
    gitSubmodules: "eas-build-pre-installでSSHキー設定・サブモジュール初期化",
    codeGeneration: "eas-build-post-installで設定ファイル生成",
    customNotifications: "eas-build-on-successでSlack通知"
  }
}
```

**詳細ドキュメント**: [`npm-hooks.md`](./build-reference/npm-hooks.md)

### プライベートnpmパッケージ

```typescript
interface PrivateNpmPackages {
  npmRegistry: {
    requirement: "読み取り専用npmトークン"
    configuration: {
      secret: {
        name: "NPM_TOKEN",
        scope: "project | account",
        command: "eas secret:create --scope project --name NPM_TOKEN --value token"
      }
      automaticNpmrc: {
        trigger: "NPM_TOKEN環境変数検出時",
        content: `
          //registry.npmjs.org/:_authToken=\${NPM_TOKEN}
          registry=https://registry.npmjs.org/
        `
      }
    }
  }

  privateRegistry: {
    examples: ["Verdaccio", "Nexus", "Artifactory"]
    configuration: {
      ".npmrc": `
        registry=https://registry.example.com
        //registry.example.com/:_authToken=\${NPM_TOKEN}
      `
    }
    location: "プロジェクトルート"
  }

  easBuildDefaults: {
    android: "registry=http://npm-cache-service.worker-infra-production.svc.cluster.local:4873",
    ios: "registry=http://10.254.24.8:4873"
  }
}
```

**詳細ドキュメント**: [`private-npm-packages.md`](./build-reference/private-npm-packages.md)

### Gitサブモジュール

```typescript
interface GitSubmodules {
  setup: {
    sshKey: {
      encoding: "base64",
      secret: "SSH_KEY_BASE64",
      command: "cat ~/.ssh/id_rsa | base64"
    }

    preInstallScript: `
      #!/usr/bin/env bash

      mkdir -p ~/.ssh

      # プライベートキーの復元
      umask 0177
      echo "$SSH_KEY_BASE64" | base64 -d > ~/.ssh/id_rsa
      umask 0022
      ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

      # 既知のホストに追加
      ssh-keyscan github.com >> ~/.ssh/known_hosts

      # サブモジュール初期化
      git submodule update --init
    `
  }

  packageJson: {
    scripts: {
      "eas-build-pre-install": "bash scripts/eas-build-pre-install.sh"
    }
  }

  requirements: [
    "CIでビルド時",
    "cli.requireCommit: true設定時"
  ]
}
```

**詳細ドキュメント**: [`git-submodules.md`](./build-reference/git-submodules.md)

## 📁 ファイル管理

### .easignore

```typescript
interface EasignoreFile {
  purpose: "ビルドアップロードからファイルを除外"

  behavior: {
    default: ".gitignoreを参照"
    override: ".easignore作成で.gitignoreより優先"
  }

  syntax: {
    patterns: {
      "*": "スラッシュ以外の任意の文字列",
      "**": "スラッシュを含む任意の文字列",
      "?": "任意の1文字",
      "[abc]": "ブラケット内の任意の文字",
      "[a-z]": "範囲内の任意の文字"
    }

    specialCharacters: {
      "/": "プロジェクトルート相対パス（開始時）",
      "/": "ディレクトリのみ（終了時）",
      "!": "パターン否定（ファイル含める）",
      "#": "コメント"
    }
  }

  commonPatterns: {
    documentation: [
      "/docs",
      "/documentation",
      "*.md",
      "!README.md"
    ],
    tests: [
      "**/__tests__",
      "**/*.test.ts",
      "/coverage"
    ],
    buildArtifacts: [
      "/android",
      "/ios",
      "/dist",
      "/.expo"
    ],
    development: [
      ".vscode",
      ".idea",
      "*.swp"
    ]
  }

  benefits: {
    uploadSize: "アーカイブサイズ削減",
    uploadTime: "アップロード時間短縮",
    security: "機密情報の除外"
  }

  validation: {
    method: "ビルドログの「Uploading project」セクション確認",
    indicator: "アップロードサイズの減少"
  }
}
```

**設定例**:
```
# .gitignoreの内容をコピー

# ドキュメント
/docs
*.md
!README.md

# ネイティブディレクトリ（Prebuild使用時）
/android
/ios

# テストとカバレッジ
**/__tests__
**/*.test.ts
/coverage

# ビルドアーティファクト
/dist
/.expo

# 開発ツール
.vscode
.idea
```

**詳細ドキュメント**: [`easignore.md`](./build-reference/easignore.md)

## 🚨 トラブルシューティング

### エラー診断フロー

```typescript
interface ErrorDiagnostics {
  errorTypes: {
    buildErrors: {
      detection: "ビルド詳細ページで失敗フェーズ確認"
      focus: "最も早い失敗フェーズ"
    }
    runtimeErrors: {
      detection: "デバッグガイド「本番エラー」セクション参照"
      logs: "デバイス・クラッシュレポート"
    }
  }

  validationSteps: {
    javascriptBundle: {
      error: "Task :app:bundleReleaseJsAndAssets FAILED (Android)"
      error2: "Metro encountered an error (iOS)"
      validation: "npx expo export"
    }

    localBuild: {
      android: "npx expo run:android --variant release"
      ios: "npx expo run:ios --configuration Release"
      requirements: [
        "同じビルドツールバージョン",
        "同じ環境変数",
        "同じソースファイル"
      ]
    }
  }

  commonIssues: {
    dependencies: {
      solution: `
        rm -rf node_modules
        rm package-lock.json
        npm install
      `
    }

    nativeModules: {
      ios: `
        cd ios
        rm -rf Pods Podfile.lock
        pod install
        cd ..
      `,
      android: `
        cd android
        ./gradlew clean
        cd ..
      `
    }

    environmentVariables: {
      location: "eas.json",
      example: {
        build: {
          production: {
            env: {
              API_URL: "https://api.example.com"
            }
          }
        }
      }
    }
  }

  helpResources: {
    required: [
      "ビルドページへのリンク",
      "エラーログ",
      "最小再現可能例"
    ],
    community: [
      "Expo Discord",
      "Expo Forums"
    ]
  }
}
```

**トラブルシューティングチェックリスト**:

| 手順 | 確認項目 | コマンド/場所 |
|------|----------|--------------|
| 1 | JavaScriptバンドル検証 | `npx expo export` |
| 2 | ローカルリリースビルド | `npx expo run:[platform] --variant release` |
| 3 | 依存関係クリーン | `rm -rf node_modules && npm install` |
| 4 | ネイティブキャッシュクリーン | iOS: `pod install`, Android: `./gradlew clean` |
| 5 | 環境変数確認 | `eas.json`の`env`セクション |
| 6 | ビルドログ分析 | ビルド詳細ページ |

**詳細ドキュメント**: [`troubleshooting.md`](./build-reference/troubleshooting.md)

### 既知の制限事項

```typescript
interface KnownLimitations {
  resourceLimits: {
    buildTime: {
      maximum: "2時間",
      free: "30分",
      recommendation: "リソースクラスのアップグレード・最適化"
    }

    pendingBuilds: {
      maximum: "プラットフォームごとに50",
      management: [
        "eas build:list --status pending",
        "eas build:cancel --id <build-id>"
      ]
    }

    memory: {
      standard: "固定メモリ・CPU制限",
      solution: "largeリソースクラス使用"
    }
  }

  cachingLimitations: {
    javascript: "ローカルキャッシュ・キャッシュサーバー",
    native: {
      android: "Gradle・Maven",
      ios: "CocoaPods"
    },
    notCached: "node_modules（コミット時はアップロード）"
  }

  platformLimitations: {
    localBuilds: {
      supported: ["macOS", "Linux"],
      notSupported: "Windows"
    }

    customNativeCode: {
      limitations: [
        "自動設定の制限",
        "アップグレード作業増加",
        "互換性維持必要"
      ]
    }
  }

  networkLimitations: {
    externalServices: "タイムアウト設定必要",
    privateRepos: "適切な認証必要",
    firewalls: "ビルダーIPアドレス確認"
  }

  planLimits: {
    free: {
      buildTime: "30分",
      concurrentBuilds: 1,
      priority: "低",
      resourceClass: "標準のみ"
    },
    pro: {
      buildTime: "2時間",
      concurrentBuilds: "複数",
      priority: "高",
      resourceClass: "すべて"
    }
  }

  workarounds: [
    "モジュール分割",
    "選択的ビルド",
    "段階的移行",
    "継続的最適化"
  ]
}
```

**制限事項マトリックス**:

| 制限項目 | 無料プラン | プロプラン | 回避策 |
|----------|-----------|-----------|--------|
| ビルド時間 | 30分 | 2時間 | リソースクラス・最適化 |
| 同時ビルド数 | 1 | 複数 | プラン変更 |
| 保留ビルド数 | 50 | 50 | 不要ビルドのキャンセル |
| リソースクラス | 標準のみ | すべて | large/m-large使用 |
| ローカルビルド | Windows非対応 | Windows非対応 | クラウドビルド |

**詳細ドキュメント**: [`limitations.md`](./build-reference/limitations.md)

## 🎯 実装パターンとベストプラクティス

### ビルドプロファイル設計

```typescript
interface BuildProfileDesignPatterns {
  development: {
    purpose: "開発・デバッグ"
    configuration: {
      developmentClient: true,
      distribution: "internal",
      android: {
        gradleCommand: ":app:assembleDebug",
        buildType: "apk"
      },
      ios: {
        simulator: true,
        buildConfiguration: "Debug"
      }
    }
    characteristics: [
      "高速ビルド",
      "デバッグシンボル含む",
      "開発ツール有効"
    ]
  }

  preview: {
    purpose: "内部テスト・QA"
    configuration: {
      distribution: "internal",
      android: {
        buildType: "apk"
      },
      ios: {
        simulator: false
      }
    }
    characteristics: [
      "本番に近い設定",
      "内部配布",
      "TestFlight・内部テスト"
    ]
  }

  production: {
    purpose: "ストア提出"
    configuration: {
      autoIncrement: true,
      android: {
        buildType: "aab",
        resourceClass: "large"
      },
      ios: {
        buildConfiguration: "Release",
        resourceClass: "m-large"
      }
    }
    characteristics: [
      "最適化済み",
      "デバッグシンボルなし",
      "ストア提出可能"
    ]
  }

  staging: {
    purpose: "ステージング環境"
    configuration: {
      extends: "production",
      distribution: "internal",
      env: {
        API_URL: "https://api.staging.com",
        ENVIRONMENT: "staging"
      }
    }
  }
}
```

### CI/CD統合パターン

```typescript
interface CICDIntegrationPatterns {
  githubActions: {
    setup: `
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: \${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build Android
        run: eas build --platform android --non-interactive --no-wait

      - name: Build iOS
        run: eas build --platform ios --non-interactive --no-wait
    `
  }

  gitlabCI: {
    setup: `
      build:
        image: node:18
        script:
          - npm ci
          - npm test
          - npx eas-cli build --platform all --non-interactive
        variables:
          EXPO_TOKEN: $EXPO_TOKEN
    `
  }

  bestPractices: [
    "専用のロボットユーザー使用",
    "最小権限の原則",
    "シークレット管理の厳格化",
    "ビルド結果の通知設定",
    "失敗時の自動リトライ"
  ]
}
```

### パフォーマンス最適化チェックリスト

```typescript
interface PerformanceOptimizationChecklist {
  configuration: [
    "✅ 適切なリソースクラス選択",
    "✅ 依存関係キャッシュ有効化",
    "✅ .easignoreで不要ファイル除外",
    "✅ 環境変数の適切な設定"
  ]

  codeOptimization: [
    "✅ 不要な依存関係削除",
    "✅ 画像・アセットの最適化",
    "✅ バンドルサイズの監視",
    "✅ コード分割の実装"
  ]

  buildProcess: [
    "✅ カスタムキャッシュの設定",
    "✅ npmフックの効率化",
    "✅ 並列ビルドの活用",
    "✅ ビルド時間の定期監視"
  ]

  monitoring: [
    "✅ ビルド時間のトラッキング",
    "✅ 失敗率の監視",
    "✅ ログの定期確認",
    "✅ ボトルネックの特定"
  ]
}
```

### セキュリティベストプラクティス

```typescript
interface SecurityBestPractices {
  credentials: [
    "✅ アクセストークンの安全な保管",
    "✅ 定期的なトークンローテーション",
    "✅ 最小権限の原則適用",
    "✅ プロジェクトごとのトークン分離"
  ]

  codeManagement: [
    "✅ .easignoreで機密情報除外",
    "✅ 環境変数でシークレット管理",
    "✅ ハードコードされた認証情報の排除",
    "✅ Gitサブモジュールの適切な認証"
  ]

  buildSecurity: [
    "✅ プライベートnpmパッケージの安全な設定",
    "✅ SSHキーのbase64エンコード",
    "✅ ビルドログの定期確認",
    "✅ 認証情報の漏洩チェック"
  ]
}
```

## 🔗 関連リソース

### 内部リンク

**プラットフォーム別ビルド**:
- [`android-builds.md`](./build-reference/android-builds.md) - Androidビルドプロセス
- [`apk.md`](./build-reference/apk.md) - APKビルド設定
- [`ios-builds.md`](./build-reference/ios-builds.md) - iOSビルドプロセス
- [`ios-capabilities.md`](./build-reference/ios-capabilities.md) - iOS機能管理
- [`simulators.md`](./build-reference/simulators.md) - シミュレータービルド

**設定とカスタマイズ**:
- [`build-configuration.md`](./build-reference/build-configuration.md) - ビルド設定
- [`app-versions.md`](./build-reference/app-versions.md) - バージョン管理
- [`variants.md`](./build-reference/variants.md) - アプリバリアント

**最適化**:
- [`caching.md`](./build-reference/caching.md) - 依存関係キャッシュ
- [`infrastructure.md`](./build-reference/infrastructure.md) - サーバーインフラ

**高度な機能**:
- [`build-with-monorepos.md`](./build-reference/build-with-monorepos.md) - モノレポ
- [`app-extensions.md`](./build-reference/app-extensions.md) - iOSアプリ拡張
- [`local-builds.md`](./build-reference/local-builds.md) - ローカルビルド
- [`npm-hooks.md`](./build-reference/npm-hooks.md) - ビルドフック
- [`private-npm-packages.md`](./build-reference/private-npm-packages.md) - プライベートパッケージ
- [`git-submodules.md`](./build-reference/git-submodules.md) - Gitサブモジュール

**ファイル管理とトラブルシューティング**:
- [`easignore.md`](./build-reference/easignore.md) - ファイル除外
- [`npm-cache-with-yarn.md`](./build-reference/npm-cache-with-yarn.md) - Yarn 1キャッシュ
- [`troubleshooting.md`](./build-reference/troubleshooting.md) - トラブルシューティング
- [`limitations.md`](./build-reference/limitations.md) - 既知の制限事項

### 外部リンク

**公式リソース**:
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/) - 公式ドキュメント
- [eas.json Reference](https://docs.expo.dev/build/eas-json/) - 設定リファレンス
- [Builder IP Addresses](https://expo.dev/eas-build-worker-ips.txt) - ビルダーIPリスト
- [Expo GitHub](https://github.com/expo/expo) - ソースコード

**関連サービス**:
- **[EAS Submit](../submit/)** - アプリストア提出
- **[EAS Update](../update/)** - OTAアップデート
- **[Accounts](../accounts.md)** - アカウント管理
- **[Workflow](../workflow/)** - 開発ワークフロー

## 📋 まとめ

EAS Build Reference は、Expoアプリケーションのビルドプロセスを完全にマスターするための包括的なリファレンスです：

```typescript
interface EASBuildReferenceSummary {
  coverage: [
    "プラットフォーム別ビルドプロセス（Android・iOS）",
    "ビルド設定とカスタマイズ",
    "パフォーマンス最適化戦略",
    "高度な機能とインテグレーション",
    "トラブルシューティングとベストプラクティス"
  ]

  keyFeatures: [
    "詳細なビルドフロー解説",
    "LLMパース可能な構造化情報",
    "実践的な設定例",
    "包括的なトラブルシューティング",
    "最適化チェックリスト"
  ]

  useCases: [
    "初めてのEAS Build設定",
    "ビルドプロセスの理解と最適化",
    "トラブルシューティングと問題解決",
    "高度な機能の実装",
    "CI/CD統合とオートメーション"
  ]

  nextSteps: [
    "プロジェクトに適したビルドプロファイル設計",
    "パフォーマンス最適化の段階的実装",
    "モニタリングとログ分析体制構築",
    "セキュリティベストプラクティスの適用",
    "CI/CD統合の自動化"
  ]
}
```

### クイックスタートガイド

```typescript
interface QuickStartGuide {
  step1_setup: {
    command: "eas build:configure",
    result: "eas.json作成・プラットフォーム選択"
  }

  step2_configure: {
    file: "eas.json",
    profiles: ["development", "preview", "production"],
    customization: "環境変数・プラットフォーム設定"
  }

  step3_build: {
    commands: {
      development: "eas build --profile development --platform ios",
      preview: "eas build --profile preview --platform android",
      production: "eas build --profile production --platform all"
    }
  }

  step4_optimize: {
    areas: [
      "依存関係キャッシュ有効化",
      "適切なリソースクラス選択",
      ".easignoreで不要ファイル除外",
      "ビルド時間の監視と改善"
    ]
  }

  step5_automate: {
    integration: "CI/CD統合",
    tokens: "アクセストークン設定",
    monitoring: "ビルド結果通知"
  }
}
```

このリファレンスを活用して、効率的で信頼性の高いEAS Buildワークフローを構築してください。
