# Bare React Native - 既存プロジェクトへのExpo統合ガイド

## 📋 概要

Bare React Nativeは、既存のReact Nativeプロジェクトに対してExpoのツールとサービスを段階的に統合するアプローチです。完全なExpo管理プロジェクトではなく、ネイティブコードへの直接アクセスを維持しながら、Expoの強力な機能を利用できます。

```typescript
interface BareReactNativeIntegration {
  concept: {
    definition: "既存React NativeプロジェクトへのExpo機能統合"
    approach: "段階的採用（Incremental Adoption）"
    control: "ネイティブコード直接アクセス維持"
  }

  phases: {
    quickWins: "即座に利益が得られる基本統合"
    newWorkflows: "高度な機能とCI/CD統合"
    newMindset: "開発アプローチの変更"
    fullExpo: "完全なExpo採用"
  }

  benefits: {
    devExperience: "開発者エクスペリエンス向上"
    cicd: "プロフェッショナルなCI/CDワークフロー"
    libraries: "高品質なネイティブライブラリ"
    nativeModules: "簡単なネイティブモジュール開発"
    projectManagement: "簡素化されたプロジェクト管理"
  }

  tools: {
    expoModules: "Expoモジュールインストーラー"
    expoCli: "統合開発CLI"
    devClient: "カスタマイズ可能な開発ビルド"
    updates: "OTA更新システム"
    upgradeHelper: "バージョンアップグレード支援"
  }
}
```

## 🎯 採用フェーズ

### フェーズ1: クイックウィン（Quick Wins）

即座に利益が得られる基本的な統合ステップです。

```typescript
interface QuickWinsPhase {
  timeframe: "数時間～1日"
  effort: "最小限"
  impact: "即座の開発エクスペリエンス改善"

  steps: {
    step1: {
      title: "Expoモジュールのインストール"
      command: "npx install-expo-modules@latest"
      purpose: "Expo SDK基盤のセットアップ"
      result: "Expo SDKライブラリへのアクセス"
    }

    step2: {
      title: "Expo CLIの使用"
      commands: {
        android: "npx expo run:android"
        ios: "npx expo run:ios"
      }
      purpose: "React Native CLIからの移行"
      benefits: [
        "Hermesデバッガー即座アクセス",
        "React Native DevTools統合",
        "改善されたログフォーマット"
      ]
    }

    step3: {
      title: "expo-dev-clientのインストール"
      command: "npx expo install expo-dev-client"
      purpose: "開発ビルド作成"
      benefits: [
        "カスタムネイティブコード対応",
        "Fast Refresh",
        "開発ツール統合"
      ]
    }

    step4: {
      title: "Expo SDKライブラリの使用"
      example: "npx expo install expo-camera expo-location"
      purpose: "高品質なネイティブ機能へのアクセス"
      libraries: [
        "expo-camera: カメラアクセス",
        "expo-location: 位置情報",
        "expo-notifications: プッシュ通知",
        "expo-image-picker: 画像選択"
      ]
    }
  }
}
```

**詳細ドキュメント**:
- [`overview.md`](./bare/overview.md) - 概要と採用フェーズ
- [`installing-expo-modules.md`](./bare/installing-expo-modules.md) - Expoモジュールインストール
- [`using-expo-cli.md`](./bare/using-expo-cli.md) - Expo CLI移行
- [`install-dev-builds-in-bare.md`](./bare/install-dev-builds-in-bare.md) - 開発ビルド作成

### フェーズ2: 新しいワークフロー（New Workflows）

CI/CDとリモート更新を含む高度な機能の採用です。

```typescript
interface NewWorkflowsPhase {
  timeframe: "数日～1週間"
  effort: "中程度"
  impact: "CI/CD自動化とOTA更新"

  easBuild: {
    purpose: "クラウドビルドサービス"
    setup: {
      install: "npm install -g eas-cli"
      configure: "eas build:configure"
      build: "eas build --platform all"
    }
    benefits: [
      "クラウドでのビルド実行",
      "複数プラットフォーム同時ビルド",
      "CI/CD統合簡素化",
      "チーム共有ビルド"
    ]
  }

  expoUpdates: {
    purpose: "JavaScriptコードのOTA更新"
    installation: {
      package: "npx expo install expo-updates"
      configure: "eas update:configure"
    }
    workflow: {
      publish: "eas update --branch production"
      rollback: "以前のバージョンへの即座ロールバック"
    }
    benefits: [
      "アプリストア審査バイパス",
      "緊急バグ修正の即座配信",
      "段階的機能ロールアウト",
      "A/Bテスト実施"
    ]
  }

  distribution: {
    internal: {
      method: "TestFlight / Internal App Sharing"
      purpose: "チーム内配布"
    }
    external: {
      method: "EAS Submit"
      command: "eas submit --platform all"
      purpose: "アプリストア提出自動化"
    }
  }
}
```

**詳細ドキュメント**:
- [`installing-updates.md`](./bare/installing-updates.md) - expo-updates統合

### フェーズ3: 新しいマインドセット（New Mindset）

開発アプローチを変更し、Continuous Native Generation（CNG）を採用します。

```typescript
interface NewMindsetPhase {
  timeframe: "1-2週間"
  effort: "高（パラダイムシフト）"
  impact: "ネイティブプロジェクト管理の革命"

  prebuild: {
    concept: "Continuous Native Generation (CNG)"
    principle: "ネイティブコードを生成物として扱う"
    command: "npx expo prebuild"

    workflow: {
      before: {
        nativeCode: "Gitでバージョン管理"
        updates: "手動でネイティブファイル編集"
        conflicts: "マージコンフリクト頻発"
      }
      after: {
        nativeCode: ".gitignoreで除外"
        updates: "app.json/app.configで管理"
        conflicts: "設定ファイルのみの競合"
        generation: "必要時にネイティブプロジェクト生成"
      }
    }

    benefits: [
      "ネイティブコードマージコンフリクト解消",
      "プラットフォーム間の設定一貫性",
      "アップグレードの大幅簡素化",
      "設定プラグインによる拡張性"
    ]
  }

  configPlugins: {
    purpose: "ネイティブプロジェクト設定のコード化"
    example: `
      // app.config.js
      export default {
        plugins: [
          [
            "expo-camera",
            {
              cameraPermission: "Allow $(PRODUCT_NAME) to access camera."
            }
          ]
        ]
      }
    `
    advantages: [
      "設定の再現性",
      "チーム間の一貫性",
      "バージョン管理可能",
      "自動化対応"
    ]
  }

  expoRouter: {
    purpose: "ファイルベースルーティング"
    installation: "npx expo install expo-router"
    benefits: [
      "直感的なナビゲーション構造",
      "自動型安全性",
      "ディープリンク自動処理",
      "Webサポート組み込み"
    ]
  }
}
```

**Prebuild実装例**:

```bash
# ステップ1: ネイティブディレクトリをGit管理から除外
echo "android/" >> .gitignore
echo "ios/" >> .gitignore

# ステップ2: 既存ネイティブディレクトリを削除（バックアップ推奨）
rm -rf android ios

# ステップ3: Prebuildでネイティブプロジェクト生成
npx expo prebuild

# ステップ4: 通常通りアプリを実行
npx expo run:android
npx expo run:ios
```

### フェーズ4: フルExpo（Full Expo）

Expoの全機能を最大限活用します。

```typescript
interface FullExpoPhase {
  timeframe: "継続的"
  effort: "最適化と改良"
  impact: "最大の開発効率と品質"

  fullIntegration: {
    devWorkflow: [
      "Expo CLI完全採用",
      "開発ビルドによる開発",
      "Expo Routerでのナビゲーション"
    ]
    cicdWorkflow: [
      "EAS Build完全自動化",
      "EAS Updateによる段階的配信",
      "EAS Submit自動提出"
    ]
    projectManagement: [
      "Prebuild/CNG採用",
      "Config plugins管理",
      "モノレポ対応"
    ]
  }

  ecosystem: {
    development: "Expo SDK + 開発ビルド",
    building: "EAS Build + ローカルビルド",
    updating: "EAS Update + カスタム更新サーバー",
    monitoring: "Expo Application Services",
    collaboration: "Expo Dashboard + チーム管理"
  }
}
```

## 🛠️ コマンドリファレンス

### Expoモジュールインストール

```bash
# 自動インストール（推奨）
npx install-expo-modules@latest

# 手動インストール
npm install expo
# Android/iOS設定を手動で変更（詳細はドキュメント参照）
```

### Expo CLI使用

```bash
# 開発サーバー起動
npx expo start

# Android実行
npx expo run:android
npx expo run:android --device        # 実機
npx expo run:android --variant release  # リリースビルド

# iOS実行
npx expo run:ios
npx expo run:ios --device            # 実機
npx expo run:ios --configuration Release  # リリースビルド

# 環境変数
EXPO_PUBLIC_API_URL=https://api.example.com npx expo start
```

### 開発ビルド

```bash
# expo-dev-clientインストール
npx expo install expo-dev-client

# ディープリンクスキーム追加
npx uri-scheme add myapp

# ローカルビルド
npx expo run:android
npx expo run:ios

# クラウドビルド（EAS）
npm install -g eas-cli
eas build:configure
eas build --platform all --profile development

# 開発サーバー起動（開発ビルド用）
npx expo start --dev-client
```

### OTA更新

```bash
# expo-updatesインストール
npx expo install expo-updates
npx pod-install

# EAS Update設定
eas update:configure

# 更新公開
eas update --branch production --message "Bug fix"

# リリースビルドで動作確認
npx expo run:android --variant release
npx expo run:ios --configuration Release
```

### アップグレード

```bash
# Expo SDKアップグレード
npx expo install expo@latest
npx expo install --fix

# 依存関係再インストール
rm -rf node_modules
npm install
npx pod-install

# キャッシュクリア
npx expo start --clear

# Prebuildプロジェクトの場合
npx expo prebuild --clean
```

## 🔄 ワークフロー決定フロー

```typescript
interface WorkflowDecisionTree {
  question1: {
    q: "ネイティブコードへの直接アクセスが必要か？"
    yes: "Bare React Native（このガイド）"
    no: "Managed Workflow（expo prebuild）を検討"
  }

  question2: {
    q: "既存のReact Nativeプロジェクトか？"
    yes: {
      step1: "npx install-expo-modules@latest"
      step2: "フェーズ1から段階的に採用"
    }
    no: {
      option1: "npx create-expo-app（推奨）"
      option2: "npx create-expo-app -e with-dev-client"
    }
  }

  question3: {
    q: "ネイティブコードのマージコンフリクトに悩んでいるか？"
    yes: "Prebuild/CNG採用を検討（フェーズ3）"
    no: "現在のワークフローを維持"
  }

  question4: {
    q: "CI/CDとOTA更新が必要か？"
    yes: "EAS Build + EAS Update採用（フェーズ2）"
    no: "ローカルビルドと開発ビルドのみ使用"
  }
}
```

## 📊 比較マトリックス

### コマンド比較: React Native CLI vs Expo CLI

| 操作 | React Native CLI | Expo CLI | 追加機能 |
|------|------------------|----------|----------|
| 開発サーバー起動 | `npx react-native start` | `npx expo start` | インタラクティブメニュー、QRコード |
| Android実行 | `npx react-native run-android` | `npx expo run:android` | 自動ログ表示、Hermesデバッガー |
| iOS実行 | `npx react-native run-ios` | `npx expo run:ios` | 自動ログ表示、デバイス選択UI |
| ログ表示 | `npx react-native log-android/ios` | 自動表示 | フォーマット済み、カラー出力 |
| Web対応 | 別途設定必要 | `npx expo start` → `w` | 即座のWeb開発 |
| 環境変数 | 手動設定 | `.env`ファイル自動サポート | EXPO_PUBLIC_*変数 |
| TypeScript | 追加設定 | デフォルトサポート | - |

### インストール方法比較

| 項目 | 自動インストール | 手動インストール |
|------|----------------|----------------|
| コマンド | `npx install-expo-modules@latest` | 個別ステップ実行 |
| 所要時間 | 5-10分 | 30-60分 |
| Android設定 | 自動 | 手動編集必要 |
| iOS設定 | 自動 | 手動編集必要 |
| エラーリスク | 低 | 中～高 |
| カスタマイズ | 標準設定 | 完全制御 |
| 推奨ケース | 一般的なプロジェクト | 特殊な設定が必要 |

### ビルド方法比較

| 項目 | ローカルビルド | EAS Build（クラウド） |
|------|---------------|-------------------|
| コマンド | `npx expo run:android/ios` | `eas build --platform all` |
| ビルド環境 | ローカルマシン | クラウド（AWS） |
| 初期設定 | Xcode/Android Studio必要 | EAS CLI設定のみ |
| ビルド時間 | マシン性能依存 | 一定（最適化済み） |
| 並列ビルド | 不可 | 可能 |
| キャッシュ | ローカルのみ | クラウドキャッシュ |
| CI/CD統合 | 複雑 | 簡単 |
| コスト | 無料（電力・時間） | 従量制（無料枠あり） |

## 🔍 トラブルシューティング

### インストール関連

```typescript
interface InstallationTroubleshooting {
  androidBuildError: {
    症状: "Gradleビルド失敗"
    解決策: [
      "cd android && ./gradlew clean && cd ..",
      "android/build.gradleでバージョン確認",
      "キャッシュクリア: rm -rf android/.gradle"
    ]
  }

  iosBuildError: {
    症状: "Xcodeビルド失敗"
    解決策: [
      "cd ios && rm -rf Pods Podfile.lock && pod install && cd ..",
      "Xcode Clean Build Folder (Cmd+Shift+K)",
      "CocoaPodsバージョン確認: pod --version"
    ]
  }

  moduleNotFound: {
    症状: "Expoモジュールが見つからない"
    解決策: [
      "npx expo install --check",
      "node_modules削除後再インストール",
      "Metro bundlerキャッシュクリア: npx expo start --clear"
    ]
  }
}
```

### 開発ビルド関連

```typescript
interface DevBuildTroubleshooting {
  connectionError: {
    症状: "開発ビルドが開発サーバーに接続できない"
    チェック項目: [
      "開発サーバーが実行中か確認",
      "デバイスとPCが同じネットワークか",
      "ファイアウォール設定確認",
      "ポート19000が開いているか"
    ]
    解決策: "npx expo start --dev-client --clear"
  }

  deepLinkError: {
    症状: "ディープリンクが機能しない"
    確認: "npx uri-scheme list",
    解決策: [
      "AndroidManifest.xmlでintent-filter確認",
      "Info.plistでCFBundleURLTypes確認",
      "npx uri-scheme add myapp で再設定"
    ]
  }

  buildNotInstalling: {
    症状: "ビルドがインストールされない"
    Android: "adb install path/to/app.apk",
    iOS: "Xcodeからデバイスに直接インストール"
  }
}
```

### OTA更新関連

```typescript
interface UpdateTroubleshooting {
  updateNotDownloading: {
    症状: "更新がダウンロードされない"
    確認項目: {
      runtimeVersion: {
        check: "app.json、Expo.plist、strings.xmlで一致確認",
        policy: "runtimeVersion.policy設定確認"
      }
      updateUrl: {
        check: "app.jsonのupdates.url確認",
        valid: "https://u.expo.dev/[project-id]形式"
      }
      network: "インターネット接続確認"
    }
  }

  buildError: {
    Android: "cd android && ./gradlew clean && cd ..",
    iOS: "cd ios && rm -rf Pods Podfile.lock && pod install && cd .."
  }

  configMismatch: {
    症状: "設定不一致エラー"
    解決: {
      android: "strings.xmlのexpo_runtime_version更新",
      ios: "Expo.plistのEXUpdatesRuntimeVersion更新",
      appJson: "app.jsonのruntimeVersion設定確認"
    }
  }
}
```

### アップグレード関連

```typescript
interface UpgradeTroubleshooting {
  versionConflict: {
    症状: "依存関係バージョン競合"
    解決策: [
      "npx expo install --fix",
      "package.jsonで手動調整",
      "npm ls [package-name]で依存関係ツリー確認"
    ]
  }

  nativeCodeBreaking: {
    症状: "ネイティブコード変更後動作しない"
    手順: [
      "Upgrade Helperで差分確認",
      "変更を段階的に適用",
      "各変更後にビルドテスト",
      "問題発生時は前のコミットに戻す"
    ]
  }

  podInstallFail: {
    症状: "pod installが失敗"
    解決策: [
      "CocoaPodsバージョン確認: pod --version",
      "Podfile.lockとPodsディレクトリ削除",
      "pod cache clean --all",
      "pod install --repo-update"
    ]
  }
}
```

## ✅ ベストプラクティス

### セットアップ

```typescript
interface SetupBestPractices {
  初期設定: {
    バックアップ: "git commit -m 'Before Expo integration'",
    ブランチ作成: "git checkout -b feature/expo-integration",
    段階的実装: "フェーズごとにコミット",
    テスト: "各フェーズ後に動作確認"
  }

  モジュール管理: {
    インストール: "npx expo install（npm installではない）",
    バージョン管理: "npx expo install --fix で互換性維持",
    除外設定: "不要なモジュールはexpo.autolinking.excludeで除外"
  }

  設定ファイル: {
    app_json: "中央集約された設定管理",
    環境変数: ".envファイル使用（EXPO_PUBLIC_*）",
    gitignore: "機密情報は.gitignoreに追加"
  }
}
```

### 開発ワークフロー

```typescript
interface DevelopmentBestPractices {
  日常開発: {
    開発サーバー: "npx expo start --dev-client",
    ホットリロード: "Fast Refresh活用",
    デバッグ: "React Native DevTools + Hermes",
    環境分離: "開発・ステージング・本番環境を分離"
  }

  ビルド管理: {
    開発ビルド: {
      頻度: "ネイティブコード変更時のみ",
      配布: "TestFlight / Internal App Sharing",
      バージョン管理: "開発ビルドIDで追跡"
    }
    本番ビルド: {
      自動化: "EAS Build + CI/CD",
      テスト: "本番ビルドで完全テスト実施",
      アーカイブ: "各ビルドをアーカイブ保存"
    }
  }

  更新戦略: {
    段階的配信: {
      手順: "開発 → ステージング → 本番（段階的）",
      ブランチ: "branch別に環境分離",
      ロールバック: "問題発生時の即座ロールバック計画"
    }
    テスト: {
      更新前: "ステージング環境で完全テスト",
      更新後: "本番環境でモニタリング",
      検証: "クラッシュレート・エラー率確認"
    }
  }
}
```

### セキュリティ

```typescript
interface SecurityBestPractices {
  環境変数: {
    命名: "EXPO_PUBLIC_* は公開、それ以外は秘密",
    管理: "機密情報は.envに記載し.gitignore追加",
    CI_CD: "GitHub Secrets / GitLab CI Variables使用"
  }

  アクセス制御: {
    トークン: {
      使用: "CI/CDではアクセストークン使用",
      管理: "定期的なトークンローテーション",
      権限: "最小権限の原則"
    }
    チーム: {
      ロール: "適切なロール割り当て（Owner/Admin/Developer）",
      レビュー: "定期的な権限レビュー",
      退職者: "即座のアクセス削除"
    }
  }

  更新セキュリティ: {
    署名: "expo-updatesのコード署名検証",
    検証: "ランタイムバージョン厳密管理",
    監視: "不正更新の検出とアラート"
  }
}
```

### パフォーマンス

```typescript
interface PerformanceBestPractices {
  ビルドサイズ: {
    最適化: {
      hermes: "Hermesエンジン有効化",
      proguard: "Android ProGuard有効化",
      bitcode: "iOS Bitcodeストリップ"
    }
    分析: {
      android: "bundle-visualizer使用",
      ios: "Xcode App Thinning確認"
    }
  }

  起動時間: {
    最適化: [
      "スプラッシュスクリーン最適化",
      "初期表示に必要な最小限のコード読み込み",
      "遅延ロード（Lazy Loading）活用",
      "不要なモジュール除外"
    ]
  }

  更新: {
    サイズ削減: "差分更新のみ配信",
    タイミング: "バックグラウンド更新設定",
    検証: "更新サイズとダウンロード時間測定"
  }
}
```

### チームコラボレーション

```typescript
interface TeamBestPractices {
  ドキュメント: {
    README: [
      "セットアップ手順明記",
      "ビルドコマンド一覧",
      "トラブルシューティングガイド"
    ]
    CONTRIBUTING: "開発フロー・PR規約",
    CHANGELOG: "変更履歴と更新内容"
  }

  Git運用: {
    ブランチ戦略: "Git Flow または GitHub Flow",
    コミットメッセージ: "Conventional Commits採用",
    PR: "テンプレート使用、レビュー必須"
  }

  CI_CD: {
    自動化: [
      "PR作成時の開発ビルド",
      "マージ時の本番ビルド",
      "自動テスト実行",
      "更新の自動配信"
    ]
    通知: "Slack/Discord統合でチーム通知"
  }
}
```

## 📈 採用判断チェックリスト

```typescript
interface AdoptionChecklist {
  技術的要件: {
    reactNativeVersion: {
      question: "React Native 0.70以降を使用していますか？"
      required: "Yes推奨（古いバージョンは制限あり）"
    }
    nativeModules: {
      question: "サードパーティネイティブモジュールを使用していますか？"
      note: "ほとんどは互換性ありますが、事前確認推奨"
    }
    customNativeCode: {
      question: "大量のカスタムネイティブコードがありますか？"
      recommendation: "段階的統合（既存コード維持可能）"
    }
  }

  プロジェクト要件: {
    teamSize: {
      small: "1-5人 → Expoで開発効率大幅向上",
      medium: "6-20人 → CI/CD・コラボレーション機能が有用",
      large: "20+人 → Enterprise機能でガバナンス強化"
    }
    releaseFrequency: {
      frequent: "週1回以上 → OTA更新で迅速配信",
      moderate: "月1-2回 → EAS Buildで自動化",
      infrequent: "数ヶ月に1回 → 基本機能のみ活用"
    }
  }

  組織要件: {
    budget: {
      question: "クラウドビルド予算がありますか？"
      free: "無料枠内（個人・小規模）",
      paid: "Production/Enterpriseプラン（中～大規模）"
    }
    compliance: {
      question: "監査・ログ要件がありますか？"
      enterprise: "Enterpriseプラン必須（監査ログ）"
    }
  }

  リスク評価: {
    migration: {
      risk: "中（段階的移行可能）",
      rollback: "各フェーズでロールバック可能",
      timeInvestment: "フェーズ1: 数時間、フル採用: 数週間"
    }
    vendor: {
      question: "Expoへの依存リスクは？"
      mitigation: "コアはOSS、ロックインなし（いつでも削除可能）"
    }
  }
}
```

## 🔗 関連リソース

### 内部リンク（bareディレクトリ）

- [`overview.md`](./bare/overview.md) - Bare React Native概要と採用フェーズ
- [`installing-expo-modules.md`](./bare/installing-expo-modules.md) - Expoモジュール詳細インストール手順
- [`using-expo-cli.md`](./bare/using-expo-cli.md) - React Native CLIからExpo CLIへの移行
- [`install-dev-builds-in-bare.md`](./bare/install-dev-builds-in-bare.md) - 開発ビルド作成とディープリンク設定
- [`installing-updates.md`](./bare/installing-updates.md) - expo-updates統合とOTA更新設定
- [`upgrade.md`](./bare/upgrade.md) - ネイティブプロジェクトアップグレードヘルパー

### 関連Expoドキュメント

- **Expo CLI** - 統合開発CLIリファレンス
- **EAS Build** - クラウドビルドサービス設定
- **EAS Update** - OTA更新システム詳細
- **EAS Submit** - アプリストア提出自動化
- **Config Plugins** - ネイティブ設定カスタマイズ
- **Expo Router** - ファイルベースルーティング
- **Expo Modules API** - ネイティブモジュール開発

### 外部リソース

- **[Native Project Upgrade Helper](https://expo.dev/upgrade-helper)** - SDKアップグレード差分確認ツール
- **[Expo GitHub](https://github.com/expo/expo)** - オープンソースリポジトリ
- **[Expo Forums](https://forums.expo.dev)** - コミュニティサポート
- **[Expo Discord](https://discord.gg/expo)** - リアルタイムサポート
- **[React Native Community](https://reactnative.dev/community/overview)** - React Nativeコミュニティリソース

## 📋 まとめ

```typescript
interface BareReactNativeSummary {
  keyTakeaways: {
    flexibility: "段階的採用により、既存プロジェクトへの影響を最小化"
    control: "ネイティブコードへの直接アクセスを維持"
    benefits: "Expoの強力なツールとサービスへのアクセス"
    scalability: "個人開発からエンタープライズまでスケール可能"
  }

  adoptionPath: {
    phase1: "数時間でExpoモジュール・CLI・開発ビルド統合",
    phase2: "数日でEAS Build・EAS Update採用",
    phase3: "1-2週間でPrebuild/CNG移行",
    phase4: "継続的に最適化と改良"
  }

  idealFor: [
    "既存React Nativeプロジェクトの改善",
    "ネイティブコード制御維持が必要なプロジェクト",
    "段階的にExpoエコシステムを採用したいチーム",
    "CI/CD自動化とOTA更新が必要なアプリ"
  ]

  notIdealFor: [
    "完全に管理されたワークフローを求める場合（Managed Workflow検討）",
    "ネイティブコードに触れたくない場合",
    "Expo Goアプリでの開発を希望する場合"
  ]

  nextSteps: {
    evaluate: "プロジェクト要件とチェックリスト確認",
    prototype: "テストブランチでフェーズ1を試す",
    measure: "開発エクスペリエンス改善を測定",
    adopt: "成功を確認後、段階的に採用拡大",
    optimize: "CI/CD統合と更新戦略を最適化"
  }

  support: {
    documentation: "詳細な個別ドキュメント参照",
    community: "Expo Forums・Discord活用",
    enterprise: "Enterprise支援が必要な場合はExpo営業チーム連絡"
  }
}
```

このガイドを参考に、既存のReact Nativeプロジェクトに最適なExpo統合戦略を計画してください。段階的な採用により、リスクを最小化しながら、開発効率と品質を大幅に向上させることができます。
