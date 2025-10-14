# EAS Update - 包括的なOTAアップデート管理ガイド

## 📋 概要

EAS Update は、アプリストアのレビュープロセスを経ずに、JavaScriptコード、スタイリング、画像などのアプリコンポーネントをOver-The-Air（OTA）で迅速に配信できるホスト型サービスです。`expo-updates`ライブラリを使用し、バグ修正、小規模な機能追加、A/Bテストなどを即座にユーザーに届けることができます。

```typescript
interface EASUpdateSystem {
  core: {
    updates: UpdateManagement
    channels: ChannelManagement
    branches: BranchManagement
    runtimeVersions: RuntimeVersionControl
  }
  deployment: {
    strategies: DeploymentPatterns
    rollouts: GradualRollout
    rollbacks: VersionRollback
    preview: PreviewMethods
  }
  assets: {
    optimization: AssetOptimization
    selection: AssetSelection
    delivery: AssetDelivery
  }
  integration: {
    cli: EASCLICommands
    api: UpdatesAPI
    devClient: DevelopmentPreview
    native: NativeIntegration
  }
}
```

## 🎯 主な機能

### 1. アップデート管理用のJS API

```typescript
interface UpdatesAPI {
  hooks: {
    useUpdates: "React Hookでのアップデート制御"
  }
  methods: {
    checkForUpdateAsync: "新しいアップデートの確認"
    fetchUpdateAsync: "アップデートのダウンロード"
    reloadAsync: "アプリの再起動と適用"
  }
  tracking: {
    monitoring: "アップデートプロセスの追跡"
    debugging: "デバッグ機能とログ"
  }
}
```

**使用例**：
```javascript
import * as Updates from 'expo-updates';

// 実行中のアップデートチェック
async function checkForUpdates() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
}
```

**詳細ドキュメント**: [`download-updates.md`](./eas-update/download-updates.md)

### 2. インサイト追跡

```typescript
interface UpdateInsights {
  dashboard: {
    deployments: "デプロイメントダッシュボード"
    adoption: "アップデート採用率の追跡"
    metrics: "パフォーマンスメトリクス"
  }
  integration: {
    easInsights: "EAS Insightsとの統合"
    analytics: "詳細な分析データ"
  }
}
```

### 3. アップデートの再公開とロールバック

```typescript
interface RollbackCapabilities {
  methods: {
    republish: "以前の安定バージョンへの復帰"
    embedded: "ビルド埋め込みバージョンへの復帰"
  }
  features: {
    versionControl: "Gitコミット機能に類似"
    quickRecovery: "問題のあるアップデートからの迅速な回復"
  }
}
```

**詳細ドキュメント**: [`rollbacks.md`](./eas-update/rollbacks.md)

## 🏗️ アーキテクチャと仕組み

### ビルドの2つのレイヤー

```typescript
interface BuildLayers {
  nativeLayer: {
    location: "アプリバイナリに組み込み"
    contents: ["ネイティブコード", "ネイティブ依存関係"]
    updates: "アプリストア経由のみ"
  }
  updateLayer: {
    location: "互換性のあるアップデートと交換可能"
    contents: ["JavaScript", "画像", "その他のアセット"]
    updates: "OTA配信可能"
  }
}
```

### アップデートの主要プロパティ

```typescript
interface UpdateProperties {
  channel: {
    purpose: "ビルドを識別しグループ化"
    timing: "ビルド時に設定"
    examples: ["production", "staging", "preview"]
  }
  runtimeVersion: {
    purpose: "JS-ネイティブインターフェース互換性を記述"
    guarantee: "互換性の保証"
    matching: "正確に一致する必要がある"
  }
  platform: {
    options: ["android", "ios"]
    matching: "正確に一致する必要がある"
  }
}
```

**詳細ドキュメント**: [`how-it-works.md`](./eas-update/how-it-works.md)

### アップデートプロセス

```typescript
interface UpdateProcess {
  step1_publish: {
    command: "eas update --auto"
    action: "アップデートをEASサーバーのブランチにアップロード"
    structure: "ブランチにはアップデートリストが含まれ、最新がアクティブ"
  }
  step2_matching: {
    rules: {
      platform: "正確に一致"
      runtimeVersion: "正確に一致"
      channel: "ブランチにリンク可能（デフォルトは同名ブランチ）"
    }
  }
  step3_download: {
    trigger: "アプリ起動時にアップデートをチェック"
    sequence: [
      "アップデートマニフェストをダウンロード",
      "必要なアセットをダウンロード",
      "失敗時はキャッシュされたアップデートにフォールバック"
    ]
  }
  step4_apply: {
    timing: "次回アプリ起動時に適用"
    validation: "互換性確認後に適用"
  }
}
```

## 🚀 セットアップと始め方

### 前提条件

```typescript
interface Prerequisites {
  account: "Expoユーザーアカウント"
  project: "React Nativeプロジェクト"
  cli: "Expo CLIを使用するプロジェクト"
  registration: "registerRootComponentを使用"
}
```

### セットアップ手順

```bash
# 1. EAS CLIのインストール
npm install --global eas-cli

# 2. Expoアカウントにログイン
eas login

# 3. プロジェクトの設定
eas update:configure

# 4. ビルドの作成
eas build --platform android --profile preview
eas build --platform ios --profile preview

# 5. アップデートの公開
eas update --channel preview --message "バグ修正"

# または自動公開
eas update --auto
```

**詳細ドキュメント**: [`getting-started.md`](./eas-update/getting-started.md)

### 設定ファイル（eas.json）

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "preview": {
      "channel": "preview",
      "distribution": "internal"
    }
  }
}
```

## 🔧 ランタイムバージョン管理

### ランタイムバージョンポリシー

```typescript
interface RuntimeVersionPolicies {
  automatic: {
    appVersion: {
      policy: "appVersion"
      description: "app.jsonのversionに基づく"
      config: {
        "expo": {
          "runtimeVersion": {
            "policy": "appVersion"
          }
        }
      }
    }
    fingerprint: {
      policy: "fingerprint"
      description: "ネイティブコードのハッシュに基づく"
      config: {
        "expo": {
          "runtimeVersion": {
            "policy": "fingerprint"
          }
        }
      }
    }
  }
  manual: {
    custom: {
      description: "カスタム手動バージョン"
      config: {
        "expo": {
          "runtimeVersion": "1.0.0"
        }
      }
    }
    platformSpecific: {
      description: "プラットフォーム固有バージョン"
      config: {
        "expo": {
          "runtimeVersion": "1.0.0",
          "android": {
            "runtimeVersion": {
              "policy": "appVersion"
            }
          }
        }
      }
    }
  }
}
```

### 互換性のないアップデートの回避戦略

```typescript
interface CompatibilityStrategies {
  strategies: [
    "自動ポリシーの使用：ネイティブコード変更時に自動更新",
    "手動インクリメント：ネイティブコードのインストール/更新時に手動でインクリメント",
    "段階的ロールアウト：アップデートを徐々にロールアウト",
    "手動検証：小規模なユーザーグループでアップデートを手動で検証"
  ]
  bestPractices: [
    "ネイティブ依存関係の変更時にランタイムバージョンを更新",
    "一貫性のあるバージョン管理戦略を使用",
    "互換性をテストしてからデプロイ"
  ]
}
```

**詳細ドキュメント**: [`runtime-versions.md`](./eas-update/runtime-versions.md)

## 📦 デプロイメント戦略

### 1. Two-command Flow（最もシンプル）

```typescript
interface TwoCommandFlow {
  characteristics: {
    builds: "本番ビルドのみ作成"
    testing: "Expo Goまたは開発ビルドで変更をテスト"
    branches: "単一ブランチにアップデートを公開"
  }
  advantages: [
    "簡単なコミュニケーション",
    "高速なアップデート"
  ]
  disadvantages: [
    "本番前の安全性チェックなし"
  ]
  useCases: [
    "小規模チーム",
    "迅速な反復開発",
    "低リスクアップデート"
  ]
}
```

### 2. Persistent Staging Flow

```typescript
interface PersistentStagingFlow {
  characteristics: {
    builds: "本番環境とステージング環境で別々のビルド"
    testing: "TestFlight/Play Store Internal Trackで変更をテスト"
    branches: "永続的な「staging」と「production」ブランチ"
  }
  advantages: [
    "デプロイペースの制御",
    "明確なチームコミュニケーション",
    "本番前の安全性検証"
  ]
  disadvantages: [
    "複雑なバージョンチェックアウト"
  ]
  useCases: [
    "中規模チーム",
    "品質保証が重要",
    "段階的なデプロイメント"
  ]
}
```

### 3. Platform-specific Flow

```typescript
interface PlatformSpecificFlow {
  characteristics: {
    separation: "AndroidとiOSで別々のアップデートプロセス"
    branches: "プラットフォーム固有のステージング/本番ブランチ"
  }
  advantages: [
    "プラットフォーム固有のアップデートの完全制御",
    "独立したリリースサイクル"
  ]
  disadvantages: [
    "2つの別々のコマンドが必要",
    "管理の複雑さ"
  ]
  useCases: [
    "プラットフォーム固有の機能",
    "異なるリリース周期",
    "プラットフォーム間のバージョン差"
  ]
}
```

### 4. Branch Promotion Flow（最も複雑）

```typescript
interface BranchPromotionFlow {
  characteristics: {
    builds: "メジャーバージョンごとにビルドを作成"
    testing: "チャネル間でプロモーションする前にアップデートをテスト"
    promotion: "staging → production への段階的プロモーション"
  }
  advantages: [
    "より安全なデプロイメント",
    "バージョン履歴の保持",
    "複数環境のサポート"
  ]
  disadvantages: [
    "より多くの簿記",
    "複雑なランタイムバージョン管理"
  ]
  useCases: [
    "大規模エンタープライズ",
    "厳格な品質管理",
    "複数のステージング環境"
  ]
}
```

**詳細ドキュメント**: [`deployment-patterns.md`](./eas-update/deployment-patterns.md)

## 🎚️ ロールアウトとロールバック

### 段階的ロールアウト

```typescript
interface GradualRollout {
  updateBasedRollout: {
    start: {
      command: "eas update --rollout-percentage=10"
      description: "10%のユーザーのみが利用可能なアップデートを公開"
    }
    progress: {
      command: "eas update:edit"
      description: "対話的にロールアウト率を調整"
    }
    end: {
      complete: "パーセンテージを100%に設定"
      revert: "eas update:revert-update-rollout を実行"
    }
    limitations: [
      "ブランチ上で同時にロールアウトできるアップデートは1つのみ",
      "新しいアップデートを公開する前にロールアウトを終了する必要がある"
    ]
  }
  branchBasedRollout: {
    start: {
      command: "eas channel:rollout"
      description: "対話的ガイドでチャネル、ブランチ、ロールアウト率を選択"
    }
    end: {
      republish: "最新のアップデートを古いブランチに再公開",
      revert: "新しいブランチのアップデートを破棄"
    }
    limitations: [
      "チャネル上で同時にロールアウトできるブランチは1つのみ",
      "ロールアウト中とcurrentブランチの両方にアップデートを公開可能"
    ]
  }
  bestPractices: [
    "小さいパーセンテージから開始（5-10%）",
    "メトリクスとエラーを監視",
    "問題がなければ徐々に増加",
    "問題があればすぐに復帰"
  ]
}
```

**詳細ドキュメント**: [`rollouts.md`](./eas-update/rollouts.md)

### ロールバック戦略

```typescript
interface RollbackStrategies {
  types: {
    previousUpdate: {
      description: "以前に公開されたアップデートへのロールバック"
      method: "以前に公開されたアップデートを再公開"
      effect: "機能的にクライアントをそのアップデートにロールバック"
    }
    embeddedUpdate: {
      description: "ビルドに埋め込まれたアップデートへのロールバック"
      method: "クライアントに埋め込まれたアップデートを実行するよう指示"
      effect: "アプリストアビルドの初期状態に復帰"
    }
  }
  execution: {
    command: "eas update:rollback"
    interface: "対話的なターミナルガイド"
    options: ["以前のアップデート選択", "埋め込みアップデート選択"]
  }
  postRollback: {
    behavior: "ロールバック後に再度公開すると、すべてのクライアントが新しいアップデートを受信"
    strategy: "問題解決後に正常なアップデートを再公開"
  }
}
```

**詳細ドキュメント**: [`rollbacks.md`](./eas-update/rollbacks.md)

## 🔍 プレビューとテスト

### プレビュー方法

```typescript
interface PreviewMethods {
  developmentBuild: {
    tools: ["expo-dev-client"]
    sources: [
      "プルリクエスト",
      "EASダッシュボード",
      "expo-dev-clientライブラリのUI"
    ]
    advantages: [
      "技術ユーザー向け",
      "高速な反復",
      "詳細なデバッグ情報"
    ]
  }
  previewBuild: {
    methods: [
      "アプリストアのテストトラック（TestFlight、Internal Track）",
      "内部配信",
      "ランタイムアップデートチャネルオーバーライド"
    ]
    advantages: [
      "非技術ユーザー向け",
      "実際のストア環境に近い",
      "QAチームでのテスト"
    ]
  }
  productionBuild: {
    method: "ランタイムでアップデートチャネルをオーバーライド"
    pattern: "Persistent Staging Flow"
    caution: "セキュリティへの影響を考慮"
  }
}
```

**詳細ドキュメント**: [`preview.md`](./eas-update/preview.md)

### 開発ビルドでのプレビュー

```typescript
interface DevelopmentPreview {
  prerequisites: {
    library: "expo-updatesライブラリがインストールされた開発ビルド"
    installation: "デバイスまたはエミュレーターにインストール済み"
  }
  methods: {
    extensionTab: {
      steps: [
        "開発ビルドでExpoアカウントにログイン",
        "公開されたアップデートを表示して開く",
        "ブランチ別にアップデートを閲覧"
      ]
    }
    easDashboard: {
      steps: [
        "アップデート公開後にプレビューリンクをクリック",
        "QRコードをスキャンまたはOrbitを使用してアップデートを起動"
      ]
    }
    manualUrl: {
      format: "[slug]://expo-development-client/?url=[updates-url]/group/[group-id]"
      usage: "手動入力またはQRコードに変換"
    }
  }
}
```

**詳細ドキュメント**: [`expo-dev-client.md`](./eas-update/expo-dev-client.md)

## 🎨 アセット管理と最適化

### アセット選択

```typescript
interface AssetSelection {
  sdk52Plus: {
    config: {
      "updates": {
        "assetPatternsToBeBundled": [
          "app/images/**/*.png"
        ]
      }
    }
  }
  sdkBefore52: {
    config: {
      "extra": {
        "updates": {
          "assetPatternsToBeBundled": [
            "app/images/**/*.png"
          ]
        }
      }
    }
  }
  verification: {
    command: "npx expo-updates assets:verify <dir>"
    purpose: "アップデート公開時に必要なすべてのアセットが含まれることを検証"
    options: {
      assetMapPath: "-a, --asset-map-path: assetmap.jsonへのパス"
      exportedManifestPath: "-e, --exported-manifest-path: metadata.jsonへのパス"
      buildManifestPath: "-b, --build-manifest-path: app.manifestへのパス"
      platform: "-p, --platform: プラットフォームを指定（android/ios）"
    }
  }
  behavior: "assetPatternsToBeBundledが指定されていない場合、バンドラーによって解決されたすべてのアセットが含まれる"
}
```

**詳細ドキュメント**: [`asset-selection.md`](./eas-update/asset-selection.md)

### アセット最適化

```typescript
interface AssetOptimization {
  goal: "ダウンロードサイズを最小化"
  strategies: {
    codeAssets: {
      location: "dist/bundles に表示"
      compression: ["Brotli", "Gzip"]
      effect: "ファイルサイズを大幅に削減"
    }
    imageAssets: {
      tool: "expo-optimize"
      commands: {
        basic: "npx expo-optimize"
        withQuality: "npx expo-optimize --quality 90"
      }
    }
  }
  considerations: {
    explicitRequests: "コード内で明示的に要求されたアセットのみアップロード"
    incrementalDownload: "新規または更新されたアセットのみダウンロード"
  }
  bestPractices: [
    "大きなアセット追加時はアプリストアビルドを使用",
    "小さなバグ修正にアップデートを使用",
    "定期的にアセットを最適化",
    "ダウンロードサイズを監視"
  ]
}
```

**詳細ドキュメント**: [`optimize-assets.md`](./eas-update/optimize-assets.md)

## 🛠️ EAS CLI コマンドリファレンス

### アップデート管理

```bash
# アップデートの公開
eas update --branch [branch-name] --message "変更内容"
eas update --auto  # Gitブランチとコミットを使用

# アップデートの表示
eas update:view
eas update:list

# ロールアウト管理
eas update --rollout-percentage=10
eas update:edit
eas update:revert-update-rollout

# ロールバック
eas update:rollback

# 再公開
eas update:republish --group [update-group-id]
```

### チャネル管理

```bash
# チャネル一覧
eas channel:list

# 特定のチャネルを表示
eas channel:view [channel-name]

# チャネルの作成
eas channel:create [channel-name]

# ブランチベースのロールアウト
eas channel:rollout
```

### ブランチ管理

```bash
# ブランチ一覧
eas branch:list

# ブランチの詳細を表示
eas branch:view [branch-name]

# ブランチの削除
eas branch:delete [branch-name]

# ブランチの名前変更
eas branch:rename --from [old-name] --to [new-name]
```

**詳細ドキュメント**: [`eas-cli.md`](./eas-update/eas-cli.md)

## 🔧 高度な機能

### ランタイム設定のオーバーライド

```typescript
interface RuntimeOverride {
  headerOverride: {
    sdk: "SDK 54+"
    usage: {
      code: `
import * as Updates from 'expo-updates';

// チャネルを切り替え
Updates.setUpdateRequestHeadersOverride({
  'expo-channel-name': 'preview'
});
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
      `
      useCase: "defaultチャネルからpreviewチャネルへの切り替え"
    }
  }
  urlAndHeaderOverride: {
    sdk: "SDK 52+"
    usage: "Updates.setUpdateURLAndRequestHeadersOverride(url, headers)"
    warning: "アンチブリッキング対策の無効化が必要（本番環境非推奨）"
  }
  securityConsiderations: [
    "アンチブリッキング対策の無効化は潜在的なセキュリティリスクを伴う",
    "プレビュー/テスト環境でのみ推奨",
    "以前のCodePush実装と同様のセキュリティモデル"
  ]
}
```

**詳細ドキュメント**: [`override.md`](./eas-update/override.md)

### リクエストプロキシ

```typescript
interface RequestProxy {
  purpose: [
    "カスタムヘッダーの追加",
    "リクエストのログ記録",
    "追加のセキュリティ実装",
    "リクエストIPの匿名化"
  ]
  setup: {
    step1: {
      description: "2つのプロキシサーバーの作成"
      assetProxy: {
        target: "assets.eascdn.net"
        passthrough: ["すべてのURL内容", "expo-/eas- ヘッダー"]
      }
      manifestProxy: {
        target: "u.expo.dev"
        passthrough: ["すべてのURL内容", "expo-/eas- ヘッダー"]
      }
    }
    step2: {
      description: "eas.jsonの設定"
      config: {
        "cli": {
          "updateAssetHostOverride": "updates-asset-proxy.example.com",
          "updateManifestHostOverride": "updates-manifest-proxy.example.com"
        }
      }
    }
    step3: {
      command: "eas update:configure"
      description: "変更の適用"
    }
    step4: {
      command: "eas update"
      description: "アップデートの公開"
    }
    step5: {
      description: "EAS Updateダッシュボードで設定を検証"
      verify: ["manifestHostOverride", "アセットのオーバーライド"]
    }
  }
}
```

**詳細ドキュメント**: [`request-proxying.md`](./eas-update/request-proxying.md)

### アップデートダウンロード戦略

```typescript
interface DownloadStrategies {
  default: {
    behavior: "起動時に非同期でロード"
    timing: "コールドブート時にアップデートをチェック"
    advantage: "アプリの読み込みをブロックしない"
    disadvantage: "新しいアップデートのユーザー採用が遅くなる"
  }
  runtimeCheck: {
    code: `
import * as Updates from 'expo-updates';

async function checkForUpdates() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
}
    `
    timing: "アプリ実行中"
    advantage: "即座にアップデート適用"
  }
  backgroundCheck: {
    code: `
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';

const BACKGROUND_TASK_NAME = 'background-update-check';

const setupBackgroundUpdates = async () => {
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    return Promise.resolve();
  });

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 60 * 24, // 24時間ごと
  });
};
    `
    timing: "バックグラウンドで定期的"
    advantage: "ユーザー体験を妨げない"
  }
}
```

**詳細ドキュメント**: [`download-updates.md`](./eas-update/download-updates.md)

## 🔍 デバッグとトラブルシューティング

### デバッグ戦略

```typescript
interface DebuggingStrategies {
  dashboardInspection: {
    location: "expo.dev のDeploymentsページ"
    checkFor: [
      "予期しないチャネル",
      "ランタイムバージョンの不一致",
      "欠落しているアップデート"
    ]
  }
  configurationValidation: {
    easJson: "正しいチャネルを設定"
    appJson: "適切なランタイムバージョンを設定"
    channelMapping: "チャネルを正しいブランチにマッピング"
  }
  updateValidation: {
    expoUpdates: "expo-updatesが適切に設定されているか確認"
    updatesUrl: "updates.urlがプロジェクトIDと一致するか確認"
    runtimeVersion: "runtimeVersionが正しく設定されているか確認"
  }
  debuggingTechniques: {
    devClient: "expo-dev-clientを使用"
    networkInspection: "ネットワークリクエストを検査"
    manifestInspection: "アップデートマニフェストを手動で表示"
    nativeConfig: "ネイティブ設定ファイルを確認"
  }
  mitigationSteps: {
    rollback: "eas update:republishで以前の動作バージョンに復帰"
    recovery: "既知の良好なアップデートを再公開"
  }
  recommendedTools: [
    "Proxyman: ネットワークリクエスト検査用",
    "Charles Proxy: ネットワークリクエスト検査用",
    "Android Studio: ローカルデバッグビルド用",
    "Xcode: ローカルデバッグビルド用"
  ]
}
```

**詳細ドキュメント**: [`debug.md`](./eas-update/debug.md)

### よくある問題

```typescript
interface CommonIssues {
  updateNotAppearing: {
    checks: [
      "チャネル設定を確認",
      "ランタイムバージョンが一致するか確認",
      "アプリを完全に再起動",
      "ネットワーク接続を確認"
    ]
  }
  runtimeVersionMismatch: {
    solution: {
      file: "app.json"
      config: {
        "expo": {
          "runtimeVersion": "1.0.0"
        }
      }
    }
    advice: "ネイティブ依存関係の変更時にランタイムバージョンを更新"
  }
}
```

## 🏢 エンタープライズとスタンドアロン使用

### 他のEASサービスなしでの使用

```typescript
interface StandaloneUsage {
  availability: "スタンドアロンサービスとして使用可能"
  independence: "EAS Buildなどの他のEASサービスから独立"
  compatibility: "異なるビルドパイプライン全体で動作"

  limitations: {
    lost: [
      "自動的なランタイムバージョンとチャネルの簿記",
      "expo.devのDeploymentsセクションでグループ化されたビルド",
      "EASサービス全体のより深いインサイト"
    ]
  }

  manualSteps: {
    channelSetup: [
      "アプリ設定でリクエストヘッダーを設定",
      "サーバー側でチャネルを手動作成"
    ]
    example: {
      command: "eas channel:create production"
    }
  }

  useCases: [
    "既存のCI/CDインフラストラクチャとの統合",
    "独自のビルドパイプラインを使用",
    "カスタマイズされたデプロイメントワークフロー"
  ]
}
```

**詳細ドキュメント**: [`standalone-service.md`](./eas-update/standalone-service.md)

### 既存のネイティブアプリへの統合

```typescript
interface NativeAppIntegration {
  target: "ブラウンフィールドReact Nativeアプリ"
  requirements: {
    sdk: "Expo SDK 52+ および React Native 0.76+"
    modifications: "AndroidとiOSのネイティブプロジェクト設定の変更が必要"
  }

  prerequisites: [
    "既存のアップデートライブラリの削除",
    "Expoモジュールがインストールされていることを確認",
    "metroとbabel設定の構成",
    "npx expo export が正常に実行されることを確認"
  ]

  integrationSteps: [
    "eas-cliのインストールと認証",
    "expo-updatesのインストール",
    "EASプロジェクトの初期化",
    "AndroidとiOS用の自動セットアップの無効化",
    "expo-updatesを使用するようネイティブプロジェクトを設定"
  ]

  platformSpecific: {
    android: {
      file: "MainActivity.kt"
      modification: "アップデート初期化コードをMainActivityに追加"
    }
    ios: {
      file: "AppDelegate.swift"
      modification: "カスタムビューコントローラーコードをAppDelegateに追加"
    }
  }
}
```

**詳細ドキュメント**: [`integration-in-existing-native-apps.md`](./eas-update/integration-in-existing-native-apps.md)

## 📋 FAQ と課金

### アプリストアガイドライン

```typescript
interface StoreGuidelines {
  compliance: "App StoreとPlay Storeのガイドラインに従う必要がある"
  reviewRequirements: "アプリの動作の重要な変更にはレビューが必要な場合がある"
  allowedUpdates: [
    "バグ修正",
    "小規模な改善",
    "コンテンツの更新",
    "スタイリング変更"
  ]
  benefits: "重要なバグの修正など、改善を迅速に配信"
}
```

### 月間アクティブユーザーの課金

```typescript
interface MonthlyActiveUserBilling {
  definition: "請求サイクル中に少なくとも1つのアップデートをダウンロードするアプリの1つのユニークなインストール"

  keyPoints: {
    singleDevice: "毎日アップデートをダウンロードする1つのアプリインストールは1月間アクティブユーザーとしてカウント"
    noDownload: "ダウンロードされたアップデートがない場合は0月間アクティブユーザー"
    reinstall: "アプリの再インストールは複数の月間アクティブユーザーとしてカウント"
    multipleApps: "1つのデバイス上の複数のアプリは別々にカウント"
  }
}
```

### Classic Updates の状態

```typescript
interface ClassicUpdatesStatus {
  status: "非推奨"
  timeline: {
    endDate: "2021年12月"
    newPublishing: "新しい公開の受け入れを停止"
    existing: "既存の公開されたアップデートは引き続き動作"
  }
  alternatives: [
    "EAS Updateへの移行（推奨）",
    "自己ホスト型アップデートサービスの使用"
  ]
}
```

**詳細ドキュメント**: [`faq.md`](./eas-update/faq.md)

## 🎯 実装パターンとベストプラクティス

### チームサイズ別の推奨構成

```typescript
interface TeamConfigurations {
  smallTeam: {
    size: "1-5人"
    strategy: "Two-command Flow"
    preview: "開発ビルドで十分"
    testing: "Expo Goまたは開発ビルド"
    advantages: ["シンプル", "高速", "低オーバーヘッド"]
  }

  mediumTeam: {
    size: "6-20人"
    strategy: "Persistent Staging Flow"
    preview: "複数のプレビュー方法を組み合わせ"
    testing: "TestFlight/Internal Track + 開発ビルド"
    advantages: ["品質保証", "段階的デプロイメント", "チーム協調"]
  }

  largeTeam: {
    size: "20+人"
    strategy: "Branch Promotion Flow"
    preview: "専用のステージング環境"
    testing: "複数のステージング環境 + 段階的ロールアウト"
    advantages: ["厳格な品質管理", "複数環境サポート", "エンタープライズガバナンス"]
  }
}
```

### デプロイメントワークフロー

```typescript
interface DeploymentWorkflow {
  development: {
    steps: [
      "ローカルで変更を実施",
      "開発ビルドでテスト",
      "コミットとプッシュ"
    ]
    tools: ["Expo Go", "開発ビルド", "expo-dev-client"]
  }

  staging: {
    steps: [
      "eas update --channel staging",
      "内部テスターで検証",
      "パフォーマンス監視"
    ]
    validation: ["機能テスト", "パフォーマンステスト", "セキュリティ検証"]
  }

  production: {
    steps: [
      "段階的ロールアウト開始（5-10%）",
      "メトリクス監視",
      "段階的に拡大（25% → 50% → 100%）"
    ]
    monitoring: ["エラー率", "クラッシュレート", "ユーザーフィードバック"]
    rollback: "問題発生時は即座にロールバック"
  }
}
```

### セキュリティベストプラクティス

```typescript
interface SecurityBestPractices {
  runtimeVersionManagement: [
    "ネイティブ依存関係変更時に必ず更新",
    "一貫性のあるバージョン管理戦略を使用",
    "自動ポリシーの活用（fingerprint推奨）"
  ]

  accessControl: [
    "Expoアカウントに2FAを有効化",
    "CI/CD用のロボットユーザーを使用",
    "アクセストークンを安全に管理",
    "定期的なトークンローテーション"
  ]

  updateSecurity: [
    "ランタイムオーバーライドは制御された環境でのみ使用",
    "アンチブリッキング対策の無効化は本番環境で避ける",
    "リクエストプロキシでセキュリティレイヤーを追加",
    "アップデート配信の監視とログ記録"
  ]

  assetSecurity: [
    "機密情報をアセットに含めない",
    "アセット選択で不要なファイルを除外",
    "HTTPS経由でのみアセットを配信",
    "アセットの整合性検証"
  ]
}
```

### パフォーマンス最適化

```typescript
interface PerformanceOptimization {
  assetOptimization: {
    images: [
      "expo-optimizeで画像を圧縮",
      "適切な品質レベルを選択（90推奨）",
      "WebPフォーマットの使用を検討"
    ]
    code: [
      "不要なコードを削除",
      "Tree shakingを有効化",
      "コード分割とlazyロードを実装"
    ]
  }

  downloadStrategy: {
    timing: "アプリ起動時のバックグラウンドダウンロード（デフォルト）"
    alternative: "実行中のチェック（ユーザーエクスペリエンスに注意）"
    background: "バックグラウンドタスクで定期的にチェック（慎重に実装）"
  }

  caching: {
    leverage: "新規または更新されたアセットのみダウンロード"
    strategy: "効果的なキャッシュ戦略を実装"
    monitoring: "キャッシュヒット率を監視"
  }

  monitoring: {
    metrics: [
      "ダウンロードサイズ",
      "ダウンロード時間",
      "採用率",
      "エラー率"
    ]
    tools: ["EASダッシュボード", "EAS Insights", "カスタム分析"]
  }
}
```

## 🔗 関連リソース

### 内部リンク

- [introduction.md](./eas-update/introduction.md) - EAS Updateの紹介
- [getting-started.md](./eas-update/getting-started.md) - セットアップガイド
- [how-it-works.md](./eas-update/how-it-works.md) - 動作原理
- [runtime-versions.md](./eas-update/runtime-versions.md) - ランタイムバージョン管理
- [deployment.md](./eas-update/deployment.md) - デプロイワークフロー
- [deployment-patterns.md](./eas-update/deployment-patterns.md) - デプロイメントパターン
- [rollouts.md](./eas-update/rollouts.md) - 段階的ロールアウト
- [rollbacks.md](./eas-update/rollbacks.md) - ロールバック戦略
- [preview.md](./eas-update/preview.md) - プレビュー方法
- [expo-dev-client.md](./eas-update/expo-dev-client.md) - 開発ビルドでのプレビュー
- [debug.md](./eas-update/debug.md) - デバッグガイド
- [eas-cli.md](./eas-update/eas-cli.md) - CLIコマンドリファレンス
- [download-updates.md](./eas-update/download-updates.md) - アップデートダウンロード戦略
- [override.md](./eas-update/override.md) - ランタイムオーバーライド
- [asset-selection.md](./eas-update/asset-selection.md) - アセット選択
- [optimize-assets.md](./eas-update/optimize-assets.md) - アセット最適化
- [request-proxying.md](./eas-update/request-proxying.md) - リクエストプロキシ
- [standalone-service.md](./eas-update/standalone-service.md) - スタンドアロン使用
- [integration-in-existing-native-apps.md](./eas-update/integration-in-existing-native-apps.md) - ネイティブアプリへの統合
- [faq.md](./eas-update/faq.md) - よくある質問

### 外部リンク

- [Expo Dashboard](https://expo.dev) - EASダッシュボード
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/) - 公式ドキュメント
- [Updates API Demo](https://github.com/expo/UpdatesAPIDemo) - デモリポジトリ

### 関連ドキュメント

- **[EAS Build](./build/)** - ビルド管理とEAS Updateの統合
- **[EAS Submit](./submit/)** - アプリストア提出
- **[Accounts](./accounts.md)** - アカウント管理とアクセス制御
- **[Workflow](./workflow/)** - 開発ワークフロー

## 📋 まとめ

EAS Update は、モバイルアプリの迅速な更新と継続的デリバリーを実現する包括的なOTAアップデートシステムです：

```typescript
interface EASUpdateSummary {
  coreStrengths: [
    "アプリストアレビューを経ずに即座にアップデート配信",
    "柔軟なデプロイメント戦略（段階的ロールアウト、ロールバック）",
    "包括的なモニタリングとインサイト",
    "ランタイムバージョンによる互換性保証",
    "アセット最適化による効率的な配信"
  ]

  keyCapabilities: [
    "チャネルとブランチによる柔軟なアップデート管理",
    "段階的ロールアウトとロールバック",
    "開発ビルドでのプレビューとテスト",
    "詳細なデバッグとトラブルシューティング",
    "既存のネイティブアプリへの統合"
  ]

  useCases: [
    "緊急バグ修正の即座の配信",
    "小規模機能のA/Bテスト",
    "段階的な機能ロールアウト",
    "エンタープライズアプリの継続的デリバリー",
    "マルチ環境デプロイメント（staging/production）"
  ]

  bestPractices: [
    "適切なデプロイメント戦略の選択（チームサイズと要件に基づく）",
    "ランタイムバージョンの慎重な管理",
    "段階的ロールアウトによるリスク軽減",
    "包括的なモニタリングとエラー追跡",
    "セキュリティベストプラクティスの遵守"
  ]

  integrationPoints: [
    "EAS Buildとの統合による自動化",
    "CI/CDパイプラインとの統合",
    "開発ビルドとexpo-dev-clientの活用",
    "EAS Insightsによる分析",
    "カスタムCI/CDシステムとの統合"
  ]

  nextSteps: [
    "プロジェクトでEAS Updateのセットアップ",
    "チームに適したデプロイメント戦略の選択",
    "段階的ロールアウトとモニタリングの実装",
    "アセット最適化による配信効率化",
    "セキュリティとアクセス制御の強化"
  ]
}
```

このガイドを参考に、プロジェクトの要件に応じた最適なEAS Update設定を実装し、継続的デリバリーを実現してください。
