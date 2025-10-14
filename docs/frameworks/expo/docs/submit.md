# EAS Submit - 包括的アプリストア送信ガイド

## 📋 概要

EAS Submit は、アプリのバイナリを Google Play Store と Apple App Store に送信するためのホスト型サービスです。認証情報の管理と送信プロセスを自動化し、アプリストアへの配信を簡素化します。

```typescript
interface EASSubmitSystem {
  platforms: {
    android: AndroidSubmit;
    ios: IOSSubmit;
  };
  configuration: {
    profiles: SubmitProfiles;
    credentials: CredentialManagement;
  };
  automation: {
    autoSubmit: AutoSubmitWorkflow;
    cicd: CICDIntegration;
  };
  distribution: {
    tracks: DistributionTracks;
    stores: AppStorePublishing;
  };
}
```

## 🎯 主な機能

### プラットフォーム対応

```typescript
interface PlatformSupport {
  android: {
    target: "Google Play Store";
    destination: "Google Play Console";
    tracks: ["internal", "alpha", "beta", "production"];
    automation: "完全自動化対応";
    firstSubmit: "手動アップロード必須";
  };

  ios: {
    target: "Apple App Store";
    destination: "App Store Connect / TestFlight";
    distribution: {
      testFlight: "自動配信";
      production: "手動送信必要";
    };
    requirement: "Apple Developer アカウント（年間$99）";
  };
}
```

## 🤖 Android 送信

### 前提条件

```typescript
interface AndroidPrerequisites {
  account: {
    type: "Google Play Developer アカウント";
    required: true;
  };

  console: {
    setup: "Google Play Console でアプリ作成";
    required: true;
  };

  credentials: {
    type: "Google Service Account Key";
    format: "JSON";
    purpose: "API認証用";
  };

  cli: {
    tool: "EAS CLI";
    authentication: "eas login";
  };

  configuration: {
    packageName: "app.json に設定";
    format: "com.yourcompany.yourapp";
  };

  build: {
    type: "本番環境用ビルド";
    command: "eas build --platform android --profile production";
  };

  initialUpload: {
    requirement: "最低1回の手動アップロード";
    reason: "Google Play Console でアプリ登録";
  };
}
```

### パッケージ名の設定

```typescript
interface AndroidPackageConfig {
  location: "app.json";
  configuration: {
    android: {
      package: string; // 例: "com.yourcompany.yourapp"
    };
  };

  example: `
    {
      "android": {
        "package": "com.yourcompany.yourapp"
      }
    }
  `;

  constraints: {
    uniqueness: "Google Play Store 全体で一意";
    format: "逆ドメイン形式";
    immutability: "公開後は変更不可";
  };
}
```

**実装例**：

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "android": {
      "package": "com.yourcompany.myapp"
    }
  }
}
```

### Service Account の設定

```typescript
interface ServiceAccountSetup {
  configuration: {
    location: "eas.json";
    key: "serviceAccountKeyPath";
    value: "Service Account Key JSON ファイルへの相対パス";
  };

  security: {
    storage: "プロジェクトルート外推奨";
    gitignore: "必須（ソースコントロールにコミット禁止）";
    permissions: "読み取り専用";
  };

  example: `
    {
      "submit": {
        "production": {
          "android": {
            "serviceAccountKeyPath": "../credentials/api-xxx-yyy-zzz.json"
          }
        }
      }
    }
  `;
}
```

**設定例**：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "production"
      }
    },
    "preview": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "internal"
      }
    }
  }
}
```

### 送信方法

```typescript
interface AndroidSubmitMethods {
  local: {
    command: "eas submit --platform android";
    profile: "eas submit --platform android --profile <profile-name>";
    requirements: ["EAS CLI インストール", "認証済み"];
  };

  easWorkflows: {
    type: "CI/CD";
    configuration: `
      jobs:
        build_android:
          platform: android
          profile: production
        submit_android:
          needs: [build_android]
          platform: android
    `;
    advantages: ["自動化", "ビルド後即送信", "手動介入不要"];
  };

  otherCICD: {
    platforms: ["GitHub Actions", "GitLab CI", "CircleCI", "Jenkins"];
    command: "eas submit --platform android --profile production";
    environment: {
      EXPO_TOKEN: "Personal Access Token";
    };
  };

  autoSubmit: {
    flag: "--auto-submit";
    usage: "eas build --platform android --auto-submit";
    behavior: "ビルド完了後に自動送信";
    configuration: "eas.json の submit プロファイル使用";
  };
}
```

**コマンド例**：

```bash
# ローカルから送信
eas submit --platform android

# 特定プロファイルで送信
eas submit --platform android --profile production

# ビルドと送信を同時実行
eas build --platform android --auto-submit

# CI/CD での送信
EXPO_TOKEN=$EXPO_TOKEN eas submit --platform android --profile production
```

### 配信トラック

```typescript
interface AndroidTracks {
  internal: {
    purpose: "内部テスト";
    audience: "最大100人のテスター";
    reviewProcess: "なし（即座に利用可能）";
    useCase: "初期開発段階、QA";
  };

  alpha: {
    purpose: "クローズドアルファテスト";
    audience: "限定テスター";
    reviewProcess: "なし";
    useCase: "機能テスト、バグ修正検証";
  };

  beta: {
    purpose: "オープン/クローズドベータテスト";
    audience: "より広範なテスター";
    reviewProcess: "最小限";
    useCase: "本番前の最終検証";
  };

  production: {
    purpose: "本番配信";
    audience: "全ユーザー";
    reviewProcess: "Google の審査プロセス";
    availability: "承認後、全ユーザー利用可能";
  };
}
```

**詳細ドキュメント**: [`android.md`](./submit/android.md)

## 🍎 iOS 送信

### 前提条件

```typescript
interface IOSPrerequisites {
  account: {
    type: "Apple Developer アカウント";
    cost: "$99/年";
    required: true;
  };

  configuration: {
    bundleIdentifier: "app.json に設定";
    format: "com.yourcompany.yourapp";
    location: "ios.bundleIdentifier";
  };

  cli: {
    tool: "EAS CLI";
    authentication: "eas login";
  };

  build: {
    type: "本番環境用ビルド（IPA）";
    command: "eas build --platform ios --profile production";
  };

  appStoreConnect: {
    setup: "App Store Connect でアプリ作成";
    timing: "初回送信前";
  };
}
```

### Bundle Identifier の設定

```typescript
interface IOSBundleConfig {
  location: "app.json";
  configuration: {
    ios: {
      bundleIdentifier: string; // 例: "com.yourcompany.yourapp"
    };
  };

  example: `
    {
      "ios": {
        "bundleIdentifier": "com.yourcompany.yourapp"
      }
    }
  `;

  constraints: {
    uniqueness: "Apple App Store 全体で一意";
    format: "逆ドメイン形式";
    registration: "Apple Developer Portal で事前登録";
  };
}
```

**実装例**：

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "ios": {
      "bundleIdentifier": "com.yourcompany.myapp"
    }
  }
}
```

### 送信方法

```typescript
interface IOSSubmitMethods {
  local: {
    command: "eas submit --platform ios";
    interactive: true;
    options: {
      buildSelection: "最新ビルド選択";
      credentials: "自動管理 or 手動提供";
    };
  };

  configured: {
    configuration: "eas.json での設定";
    example: `
      {
        "submit": {
          "production": {
            "ios": {
              "ascAppId": "your-app-store-connect-app-id"
            }
          }
        }
      }
    `;
  };

  autoSubmit: {
    flag: "--auto-submit";
    usage: "eas build --platform ios --auto-submit";
    destination: "TestFlight";
    postSubmit: "App Store Connect で手動承認必要";
  };

  cicd: {
    requirement: "App Store Connect API キー";
    environment: {
      EXPO_TOKEN: "Personal Access Token";
    };
    configuration: "eas.json での API キー設定";
  };
}
```

**コマンド例**：

```bash
# ローカルから送信
eas submit --platform ios

# 特定プロファイルで送信
eas submit --platform ios --profile production

# ビルドと送信を同時実行
eas build --platform ios --auto-submit

# CI/CD での送信
EXPO_TOKEN=$EXPO_TOKEN eas submit --platform ios --profile production
```

### App Store Connect API キー

```typescript
interface AppStoreConnectAPI {
  purpose: "CI/CD での自動送信";

  creation: {
    location: "App Store Connect > Users and Access > Keys";
    permissions: ["App Manager", "Developer", "Admin"];
    download: "1回のみ（再ダウンロード不可）";
  };

  components: {
    keyId: "Key ID";
    issuerId: "Issuer ID";
    keyFile: ".p8 ファイル";
  };

  configuration: {
    location: "eas.json";
    example: `
      {
        "submit": {
          "production": {
            "ios": {
              "ascAppId": "1234567890",
              "appleId": "your-apple-id@example.com",
              "ascApiKeyPath": "../credentials/AuthKey_XXXXX.p8",
              "ascApiKeyIssuerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
              "ascApiKeyId": "XXXXXXXXXX"
            }
          }
        }
      }
    `;
  };

  security: {
    storage: "安全な場所に保管";
    gitignore: "必須";
    rotation: "定期的なローテーション推奨";
  };
}
```

### 手動送信オプション

```typescript
interface ManualSubmitOption {
  tool: "Apple Transporter";
  availability: "Mac App Store";

  process: {
    steps: [
      "Apple Transporter アプリをダウンロード",
      "EAS でビルドをダウンロード（.ipa ファイル）",
      "Apple Transporter で IPA ファイルをアップロード",
      "App Store Connect でビルドを確認",
    ];
  };

  requirements: {
    appStoreConnect: "事前にアプリエントリー作成必須";
    credentials: "Apple ID でサインイン";
  };

  useCase: [
    "EAS Submit が利用できない場合",
    "特殊な送信要件がある場合",
    "手動での細かい制御が必要な場合",
  ];
}
```

### 送信後のワークフロー

```typescript
interface PostSubmitWorkflow {
  testFlight: {
    availability: "送信後数分〜数時間";
    processing: "Apple の処理時間に依存";
    testing: {
      internal: "自動的に利用可能";
      external: "TestFlight レビュー必要（24-48時間）";
    };
  };

  production: {
    submission: "App Store Connect で手動送信";
    review: {
      process: "Apple の審査プロセス";
      duration: "通常24-48時間";
      requirements: [
        "アプリ説明・スクリーンショット",
        "プライバシーポリシー",
        "サポート URL",
        "年齢制限設定",
      ];
    };
    release: {
      manual: "承認後、手動リリース";
      automatic: "承認後、自動リリース（設定可能）";
    };
  };
}
```

**詳細ドキュメント**: [`ios.md`](./submit/ios.md)

## ⚙️ eas.json 設定

### ファイル構造

```typescript
interface EASJsonSubmitConfig {
  location: "プロジェクトルート（package.json の隣）";

  structure: {
    submit: {
      [profileName: string]: {
        android?: AndroidSubmitConfig;
        ios?: IOSSubmitConfig;
      };
    };
  };
}

interface AndroidSubmitConfig {
  serviceAccountKeyPath?: string;
  track?: "internal" | "alpha" | "beta" | "production";
  releaseStatus?: "draft" | "completed";
  rollout?: number; // 0-1 の段階的リリース割合
}

interface IOSSubmitConfig {
  ascAppId?: string;
  appleId?: string;
  ascApiKeyPath?: string;
  ascApiKeyIssuerId?: string;
  ascApiKeyId?: string;
  appleTeamId?: string;
}
```

### プロファイル設定

```typescript
interface SubmitProfiles {
  default: {
    name: "production";
    usage: "プロファイル未指定時に使用";
  };

  multiple: {
    purpose: "環境ごとに異なる設定";
    example: `
      {
        "submit": {
          "production": {
            "android": {
              "serviceAccountKeyPath": "../credentials/prod-key.json",
              "track": "production"
            },
            "ios": {
              "ascAppId": "1234567890"
            }
          },
          "preview": {
            "android": {
              "serviceAccountKeyPath": "../credentials/dev-key.json",
              "track": "internal"
            },
            "ios": {
              "ascAppId": "1234567890"
            }
          }
        }
      }
    `;
  };

  usage: {
    default: "eas submit --platform ios";
    specific: "eas submit --platform ios --profile preview";
  };
}
```

### プロファイル拡張

```typescript
interface ProfileExtension {
  feature: "extends キーによる設定継承";

  benefits: [
    "共通設定の再利用",
    "設定の重複排除",
    "メンテナンス性向上",
  ];

  example: `
    {
      "submit": {
        "base": {
          "android": {
            "serviceAccountKeyPath": "../credentials/api-key.json"
          },
          "ios": {
            "ascAppId": "1234567890"
          }
        },
        "production": {
          "extends": "base",
          "android": {
            "track": "production"
          }
        },
        "staging": {
          "extends": "base",
          "android": {
            "track": "internal"
          }
        }
      }
    }
  `;

  behavior: {
    merging: "深い結合（deep merge）";
    override: "子プロファイルの設定が優先";
  };
}
```

### Android 設定オプション

```typescript
interface AndroidConfigOptions {
  serviceAccountKeyPath: {
    type: "string";
    required: true;
    description: "Google Service Account Key JSON ファイルへのパス";
    example: "../credentials/api-xxx-yyy-zzz.json";
  };

  track: {
    type: "string";
    required: false;
    default: "internal";
    options: ["internal", "alpha", "beta", "production"];
    description: "配信トラック";
  };

  releaseStatus: {
    type: "string";
    required: false;
    default: "completed";
    options: ["draft", "completed"];
    description: "リリース状態";
  };

  rollout: {
    type: "number";
    required: false;
    range: "0.0 - 1.0";
    description: "段階的リリース割合（production のみ）";
    example: "0.1 = 10% のユーザーに配信";
  };
}
```

### iOS 設定オプション

```typescript
interface IOSConfigOptions {
  ascAppId: {
    type: "string";
    required: true;
    description: "App Store Connect アプリ ID";
    location: "App Store Connect > App Information > General Information";
  };

  appleId: {
    type: "string";
    required: false;
    description: "Apple ID（メールアドレス）";
    useCase: "対話的認証時に使用";
  };

  ascApiKeyPath: {
    type: "string";
    required: false;
    description: "App Store Connect API Key (.p8) へのパス";
    useCase: "CI/CD での自動認証";
  };

  ascApiKeyIssuerId: {
    type: "string";
    required: false;
    description: "API Key Issuer ID";
    dependency: "ascApiKeyPath と組み合わせて使用";
  };

  ascApiKeyId: {
    type: "string";
    required: false;
    description: "API Key ID";
    dependency: "ascApiKeyPath と組み合わせて使用";
  };

  appleTeamId: {
    type: "string";
    required: false;
    description: "Apple Team ID";
    useCase: "複数チームに所属している場合";
  };
}
```

**詳細ドキュメント**: [`eas-json.md`](./submit/eas-json.md)

## 🔄 自動化とワークフロー

### 自動送信

```typescript
interface AutoSubmitFeature {
  purpose: "ビルド完了後の自動送信";

  activation: {
    flag: "--auto-submit";
    buildCommand: "eas build --platform <platform> --auto-submit";
    requirement: "eas.json での submit プロファイル設定";
  };

  workflow: {
    steps: [
      "eas build コマンド実行",
      "ビルドプロセス完了",
      "ビルド成果物の検証",
      "自動的に eas submit 実行",
      "アプリストアへアップロード",
    ];
  };

  benefits: [
    "手動介入不要",
    "エラー減少",
    "デプロイ時間短縮",
    "一貫性のあるワークフロー",
  ];

  example: `
    # Android 自動送信
    eas build --platform android --profile production --auto-submit

    # iOS 自動送信
    eas build --platform ios --profile production --auto-submit

    # 両プラットフォーム同時
    eas build --platform all --profile production --auto-submit
  `;
}
```

### CI/CD 統合

```typescript
interface CICDIntegration {
  easWorkflows: {
    type: "Expo の公式 CI/CD";
    configuration: "eas.json";
    example: `
      build:
        production:
          withCredentials: true

      workflows:
        production_deploy:
          jobs:
            - name: Build Android
              build:
                platform: android
                profile: production
            - name: Submit Android
              submit:
                platform: android
                profile: production
            - name: Build iOS
              build:
                platform: ios
                profile: production
            - name: Submit iOS
              submit:
                platform: ios
                profile: production
    `;
  };

  githubActions: {
    configuration: ".github/workflows/";
    example: `
      name: EAS Submit

      on:
        workflow_dispatch:

      jobs:
        submit:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3

            - uses: actions/setup-node@v3
              with:
                node-version: 18

            - name: Setup Expo
              uses: expo/expo-github-action@v8
              with:
                expo-version: latest
                eas-version: latest
                token: \${{ secrets.EXPO_TOKEN }}

            - name: Submit to stores
              run: |
                eas submit --platform android --profile production --non-interactive
                eas submit --platform ios --profile production --non-interactive
    `;
  };

  environment: {
    EXPO_TOKEN: {
      type: "Personal Access Token";
      creation: "https://expo.dev/settings/access-tokens";
      storage: "CI/CD シークレット";
    };
  };
}
```

## 🎯 実装パターンとベストプラクティス

### マルチ環境設定

```typescript
interface MultiEnvironmentSetup {
  development: {
    android: {
      track: "internal";
      purpose: "開発チーム内テスト";
    };
    ios: {
      destination: "TestFlight Internal Testing";
    };
  };

  staging: {
    android: {
      track: "alpha";
      purpose: "QA・ステークホルダーテスト";
    };
    ios: {
      destination: "TestFlight External Testing";
    };
  };

  production: {
    android: {
      track: "production";
      rollout: "段階的リリース（10% → 50% → 100%）";
    };
    ios: {
      destination: "App Store";
      review: "Apple 審査プロセス";
    };
  };

  configuration: `
    {
      "submit": {
        "development": {
          "android": {
            "serviceAccountKeyPath": "../credentials/dev-key.json",
            "track": "internal"
          }
        },
        "staging": {
          "android": {
            "serviceAccountKeyPath": "../credentials/staging-key.json",
            "track": "alpha"
          }
        },
        "production": {
          "android": {
            "serviceAccountKeyPath": "../credentials/prod-key.json",
            "track": "production",
            "rollout": 0.1
          }
        }
      }
    }
  `;
}
```

### セキュリティベストプラクティス

```typescript
interface SubmitSecurityPractices {
  credentialManagement: {
    storage: [
      "プロジェクトルート外に保存",
      "環境変数での参照も検討",
      "チーム共有は安全な方法で（1Password、Vault など）",
    ];

    gitignore: [
      "*.json（Service Account Keys）",
      "*.p8（App Store Connect API Keys）",
      "credentials/",
      "secrets/",
    ];

    rotation: [
      "定期的なキーローテーション",
      "退職者のアクセス取り消し",
      "侵害疑いの即座対応",
    ];
  };

  accessControl: {
    principle: "最小権限の原則";
    android: {
      serviceAccount: "送信に必要な最小限の権限のみ付与";
      permissions: ["リリース管理者"];
    };
    ios: {
      apiKey: "App Manager 権限推奨";
      team: "適切な Team ID 設定";
    };
  };

  monitoring: {
    logging: "送信ログの定期確認";
    alerts: "異常な送信パターンの検出";
    audit: "定期的なアクセス監査";
  };
}
```

### エラーハンドリング

```typescript
interface SubmitErrorHandling {
  common_errors: {
    authentication: {
      symptoms: "認証エラー、権限不足";
      solutions: [
        "Service Account / API Key の有効性確認",
        "権限設定の見直し",
        "キーファイルパスの確認",
      ];
    };

    configuration: {
      symptoms: "設定エラー、パラメータ不正";
      solutions: [
        "eas.json の構文確認",
        "必須パラメータの確認",
        "プロファイル名の確認",
      ];
    };

    build: {
      symptoms: "ビルドが見つからない、互換性エラー";
      solutions: [
        "最新ビルドの存在確認",
        "プラットフォーム一致確認",
        "ビルドプロファイルの確認",
      ];
    };

    store: {
      symptoms: "アプリストア側のエラー";
      solutions: [
        "アプリストアステータス確認",
        "アプリ設定の完全性確認",
        "バージョンコードの重複確認",
      ];
    };
  };

  debugging: {
    verbose: "eas submit --platform <platform> --verbose";
    logs: "詳細なエラーログの確認";
    support: "Expo フォーラム・Discord でのサポート";
  };
}
```

### パフォーマンス最適化

```typescript
interface SubmitOptimization {
  parallel_submission: {
    approach: "両プラットフォームを並列送信";
    method: "別々のジョブ・ワークフローで実行";
    benefit: "送信時間の短縮";
    example: `
      # 並列実行（別ターミナル or CI/CD ジョブ）
      eas submit --platform android --profile production &
      eas submit --platform ios --profile production &
      wait
    `;
  };

  build_caching: {
    approach: "ビルド成果物の再利用";
    method: "同じビルドを複数プロファイルで送信";
    benefit: "ビルド時間の節約";
  };

  credential_caching: {
    approach: "認証情報のキャッシュ";
    location: "EAS サーバー側で管理";
    benefit: "認証時間の短縮";
  };
}
```

## 📊 モニタリングとトラブルシューティング

### 送信ステータス確認

```typescript
interface SubmitMonitoring {
  easDashboard: {
    url: "https://expo.dev";
    features: [
      "送信履歴の表示",
      "ステータスの確認",
      "エラーログの閲覧",
      "ビルドとの関連付け",
    ];
  };

  cli: {
    commands: {
      list: "eas submit:list";
      view: "eas submit:view [submission-id]";
    };
  };

  notifications: {
    email: "送信完了・エラー通知";
    webhook: "カスタム統合用 Webhook";
  };

  metrics: {
    tracking: [
      "送信成功率",
      "平均送信時間",
      "エラー発生頻度",
      "プラットフォーム別統計",
    ];
  };
}
```

### トラブルシューティングガイド

```typescript
interface TroubleshootingGuide {
  android: {
    issue: "Service Account Key エラー";
    checks: [
      "JSON ファイルの有効性",
      "ファイルパスの正確性",
      "Google Play Console での権限設定",
      "Service Account の有効化",
    ];
    solution: "新しい Service Account Key を作成して再設定";
  };

  ios: {
    issue: "App Store Connect 認証エラー";
    checks: [
      "Apple Developer アカウントの有効性",
      "App Store Connect API Key の有効性",
      "Bundle Identifier の一致",
      "Team ID の正確性",
    ];
    solution: "認証情報の再確認と API Key の再生成";
  };

  build: {
    issue: "ビルドが見つからない";
    checks: [
      "最新ビルドの完了確認",
      "プラットフォームの一致",
      "プロファイルの一致",
      "ビルド ID の確認",
    ];
    solution: "新しいビルドを作成してから送信";
  };

  configuration: {
    issue: "eas.json 設定エラー";
    checks: [
      "JSON 構文の有効性",
      "プロファイル名のタイポ",
      "必須フィールドの存在",
      "ファイルパスの相対性",
    ];
    solution: "eas.json の検証と修正";
  };
}
```

## 🔗 関連リソース

### 内部リンク

- [introduction.md](./submit/introduction.md) - EAS Submit の概要と主な機能
- [android.md](./submit/android.md) - Android アプリの送信手順
- [ios.md](./submit/ios.md) - iOS アプリの送信手順
- [eas-json.md](./submit/eas-json.md) - eas.json での設定詳細

### 関連ドキュメント

- **[EAS Build](../build/)** - アプリのビルドプロセス
- **[EAS Update](../update/)** - OTA アップデート
- **[Accounts](../accounts/)** - アカウント管理と認証
- **[Workflow](../workflow/)** - 開発ワークフロー統合

### 外部リンク

- [Expo Dashboard](https://expo.dev) - 送信履歴とステータス確認
- [Google Play Console](https://play.google.com/console) - Android アプリ管理
- [App Store Connect](https://appstoreconnect.apple.com) - iOS アプリ管理
- [EAS CLI ドキュメント](https://docs.expo.dev/eas-cli/) - CLI リファレンス

### コマンドリファレンス

```bash
# 基本送信コマンド
eas submit --platform android
eas submit --platform ios
eas submit --platform all

# プロファイル指定
eas submit --platform android --profile production
eas submit --platform ios --profile staging

# 自動送信
eas build --platform android --auto-submit
eas build --platform ios --auto-submit

# 非対話モード（CI/CD 用）
eas submit --platform android --non-interactive
eas submit --platform ios --non-interactive

# 送信履歴
eas submit:list
eas submit:view [submission-id]

# ヘルプ
eas submit --help
```

## 📋 まとめ

EAS Submit は、アプリストアへの送信プロセスを大幅に簡素化する強力なツールです：

```typescript
interface EASSubmitSummary {
  strengths: [
    "両プラットフォーム（Android/iOS）の統一的な送信体験",
    "認証情報の安全な管理",
    "自動化とCI/CD統合の容易さ",
    "柔軟なプロファイル設定",
    "段階的リリースのサポート",
  ];

  useCases: [
    "手動送信の自動化",
    "CI/CD パイプラインへの統合",
    "マルチ環境デプロイメント",
    "段階的リリース戦略",
    "チーム開発での一貫性確保",
  ];

  bestPractices: [
    "環境ごとの送信プロファイル設定",
    "認証情報の安全な管理",
    "自動送信の活用",
    "エラーハンドリングの実装",
    "送信ステータスのモニタリング",
  ];

  workflow: {
    development: "internal/TestFlight でテスト";
    staging: "alpha/beta でQA検証";
    production: "段階的リリースで本番展開";
  };

  nextSteps: [
    "eas.json での送信プロファイル設定",
    "認証情報の準備（Service Account / API Key）",
    "初回手動送信の実施（Android）",
    "自動送信ワークフローの構築",
    "CI/CD パイプラインへの統合",
  ];
}
```

このガイドを参考に、効率的で安全なアプリストア送信ワークフローを実装してください。
