# EAS Metadata - 包括的アプリストアメタデータ管理ガイド

## 📋 概要

EAS Metadata は、コマンドラインからアプリストアのプレゼンスを自動化および維持するためのツールです。複数の異なるフォームを経由する代わりに、すべてのアプリ情報を含む `store.config.json` ファイルを使用して、プロジェクト環境を離れることなくアプリストア情報を素早く更新できます。

> **重要**: EAS Metadataはプレビュー段階であり、破壊的な変更が加えられる可能性があります。

```typescript
interface EASMetadataSystem {
  platform: {
    supported: "Apple App Store"
    planned: "Google Play Store (未サポート)"
  }
  workflow: {
    pull: "ストアから設定を取得"
    configure: "ローカルで設定を編集"
    validate: "組み込み検証で問題検出"
    push: "ストアに設定を送信"
  }
  features: {
    automation: "アプリストア情報の送信を自動化"
    validation: "リジェクト問題を事前に特定"
    collaboration: "チーム連携を可能に"
    localization: "多言語対応"
    dynamicConfig: "外部データソース統合"
  }
}
```

## 🎯 主な利点

### 1. アプリストア情報の送信を自動化

```typescript
interface AutomationBenefits {
  efficiency: {
    singleSource: "store.config.jsonファイルで一元管理"
    commandLine: "eas metadata:pushで素早くプッシュ"
    noManualForms: "複数フォーム経由不要"
  }
  consistency: {
    versionControl: "Git管理で変更履歴追跡"
    teamSync: "チーム全体で設定同期"
    reproducibility: "環境間で再現可能"
  }
}
```

### 2. 事前検証による高速フィードバックループ

```typescript
interface ValidationBenefits {
  earlyDetection: {
    preSubmission: "送信前に問題を検出"
    builtInRules: "組み込み検証ルール"
    commonPitfalls: "一般的な落とし穴を回避"
  }
  fastIteration: {
    noReviewWait: "レビュー待ち不要"
    immediateValidation: "即座のフィードバック"
    rapidCorrection: "素早い修正サイクル"
  }
  toolSupport: {
    vscodeExtension: "Expo Tools拡張機能"
    autocompletion: "自動補完と提案"
    inlineWarnings: "インライン警告"
  }
}
```

**推奨ツール**: VS Codeユーザーの場合、[Expo Tools拡張機能](https://github.com/expo/vscode-expo#readme)が `store.config.json` ファイルの自動補完と提案を提供します。

### 3. チームコラボレーション

```typescript
interface CollaborationBenefits {
  workflow: {
    gitIntegration: "バージョン管理システムで管理"
    pullRequests: "変更レビューとコードレビュー"
    changeTracking: "変更履歴の完全な可視性"
  }
  consistency: {
    sharedConfig: "チーム共有の設定"
    standardization: "標準化されたプロセス"
    knowledgeSharing: "ドキュメント化されたワークフロー"
  }
}
```

## 🚀 はじめに

### 前提条件

```typescript
interface Prerequisites {
  platform: {
    current: "Apple App Store"
    status: "完全サポート"
  }
  requirements: {
    account: "Expo アカウント"
    project: "Expo プロジェクト"
    appVersion: "ストアに送信済みのアプリバージョン"
  }
  tools: {
    easCli: "EAS CLI インストール済み"
    vscode: "VS Code + Expo Tools拡張機能（推奨）"
  }
}
```

**現在の制限**:
- Apple App Storeのみサポート
- Google Play Storeは未サポート

### ストア設定を作成する

#### 既存アプリからプル

```bash
# ストアから既存の情報を取得
eas metadata:pull
```

```typescript
interface MetadataPull {
  source: "App Store Connect"
  output: "store.config.json"
  content: [
    "アプリ情報",
    "ローカライゼーション",
    "カテゴリ",
    "年齢制限",
    "レビュー情報"
  ]
}
```

#### 新規作成

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

```typescript
interface NewStoreConfig {
  location: "プロジェクトルート"
  filename: "store.config.json"
  required: {
    configVersion: 0
    apple: AppleStoreConfig
  }
  optional: {
    version: "特定バージョンとの同期"
  }
}
```

### ストア設定をプッシュする

```bash
# 設定をApp Storeにプッシュ
eas metadata:push
```

```typescript
interface MetadataPush {
  validation: {
    preCheck: "送信前の検証実行"
    errors: "エラー時は中止"
    warnings: "警告表示、続行可能"
  }
  upload: {
    target: "App Store Connect"
    updates: "変更された項目のみ"
    confirmation: "プッシュ前に確認"
  }
}
```

**詳細ドキュメント**: [`getting-started.md`](./metadata/getting-started.md)

## ⚙️ 設定パターン

### 1. 静的ストア設定

```json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

```typescript
interface StaticConfig {
  format: "JSON"
  characteristics: {
    simplicity: "シンプルで理解しやすい"
    validation: "JSONスキーマ検証"
    versionControl: "Git管理に最適"
  }
  useCases: [
    "静的なアプリ情報",
    "頻繁に変更しない設定",
    "シンプルなローカライゼーション"
  ]
}
```

### 2. 動的ストア設定

```javascript
// store.config.js
const config = require('./store.config.json');

const year = new Date().getFullYear();
config.apple.copyright = `${year} Acme, Inc.`;

module.exports = config;
```

```typescript
interface DynamicConfig {
  format: "JavaScript"
  capabilities: {
    computation: "動的な値の計算"
    conditional: "条件付きロジック"
    integration: "外部モジュール統合"
  }
  useCases: [
    "動的な著作権表示",
    "環境依存の設定",
    "計算された値"
  ]
  configuration: {
    easJson: {
      submit: {
        production: {
          ios: {
            metadataPath: "./store.config.js"
          }
        }
      }
    }
  }
}
```

**eas.json設定**:
```json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```

### 3. 外部コンテンツを含むストア設定

```javascript
// store.config.js
const config = require('./store.config.json');

module.exports = async () => {
  const year = new Date().getFullYear();
  const info = await fetchLocalizations('...').then(response => response.json());

  config.apple.copyright = `${year} Acme, Inc.`;
  config.apple.info = info;

  return config;
};
```

```typescript
interface ExternalContentConfig {
  format: "JavaScript (async)"
  capabilities: {
    async: "非同期データ取得"
    api: "外部APIとの統合"
    cms: "CMSからのコンテンツ取得"
    localization: "翻訳サービス統合"
  }
  useCases: [
    "CMSからのローカライゼーション取得",
    "翻訳サービスとの統合",
    "動的コンテンツ管理",
    "外部データソース同期"
  ]
  benefits: {
    centralization: "コンテンツの中央管理",
    workflow: "既存ワークフローとの統合",
    automation: "完全自動化されたデプロイ"
  }
}
```

**統合パターン例**:

```typescript
// CMSからローカライゼーションを取得
interface CMSIntegration {
  async fetchFromCMS(): Promise<LocalizationData> {
    const response = await fetch('https://cms.example.com/api/app-store-content');
    return response.json();
  }
}

// 翻訳サービスとの統合
interface TranslationServiceIntegration {
  async fetchTranslations(): Promise<Record<string, Translation>> {
    const languages = ['en-US', 'ja', 'de', 'fr'];
    const translations = await Promise.all(
      languages.map(lang =>
        fetch(`https://translation-service.com/api/${lang}`)
      )
    );
    return Object.fromEntries(
      await Promise.all(translations.map(async (r, i) =>
        [languages[i], await r.json()]
      ))
    );
  }
}
```

**詳細ドキュメント**: [`config.md`](./metadata/config.md)

## 📐 ストア設定スキーマ

### ルート設定

```typescript
interface StoreConfigRoot {
  configVersion: number  // 必須: 現在は0
  apple?: AppleStoreConfig
  version?: string  // オプション: 特定バージョンと同期
}
```

### Apple App Store設定

```typescript
interface AppleStoreConfig {
  copyright?: string
  version?: string
  advisory?: AppleAdvisory
  categories?: AppleCategories
  info?: Record<AppleLanguage, AppleInfo>
  release?: AppleRelease
  review?: AppleReview
}
```

### 年齢制限設定（Advisory）

```typescript
interface AppleAdvisory {
  // 年齢制限アンケート回答
  alcoholTobaccoOrDrugUseOrReferences?: AdvisoryLevel
  contests?: AdvisoryLevel
  gambling?: boolean
  gamblingAndContests?: boolean
  gamblingSimulated?: AdvisoryLevel
  horrorOrFearThemes?: AdvisoryLevel
  matureOrSuggestiveThemes?: AdvisoryLevel
  medicalOrTreatmentInformation?: AdvisoryLevel
  profanityOrCrudeHumor?: AdvisoryLevel
  sexualContentGraphicAndNudity?: AdvisoryLevel
  sexualContentOrNudity?: AdvisoryLevel
  unrestrictedWebAccess?: boolean
  violenceCartoonOrFantasy?: AdvisoryLevel
  violenceRealistic?: AdvisoryLevel
  violenceRealisticProlongedGraphicOrSadistic?: AdvisoryLevel
}

type AdvisoryLevel = 'NONE' | 'INFREQUENT_OR_MILD' | 'FREQUENT_OR_INTENSE'
```

**使用例**:
```json
{
  "apple": {
    "advisory": {
      "violenceCartoonOrFantasy": "INFREQUENT_OR_MILD",
      "profanityOrCrudeHumor": "NONE",
      "gambling": false,
      "unrestrictedWebAccess": false
    }
  }
}
```

### カテゴリ設定

```typescript
interface AppleCategories {
  primary: AppleCategory
  secondary?: AppleCategory
}

type AppleCategory =
  | 'BOOKS'
  | 'BUSINESS'
  | 'DEVELOPER_TOOLS'
  | 'EDUCATION'
  | 'ENTERTAINMENT'
  | 'FINANCE'
  | 'FOOD_AND_DRINK'
  | 'GAMES'
  | 'GRAPHICS_AND_DESIGN'
  | 'HEALTH_AND_FITNESS'
  | 'LIFESTYLE'
  | 'MAGAZINES_AND_NEWSPAPERS'
  | 'MEDICAL'
  | 'MUSIC'
  | 'NAVIGATION'
  | 'NEWS'
  | 'PHOTO_AND_VIDEO'
  | 'PRODUCTIVITY'
  | 'REFERENCE'
  | 'SHOPPING'
  | 'SOCIAL_NETWORKING'
  | 'SPORTS'
  | 'STICKERS'
  | 'TRAVEL'
  | 'UTILITIES'
  | 'WEATHER'
```

**使用例**:
```json
{
  "apple": {
    "categories": {
      "primary": "PRODUCTIVITY",
      "secondary": "BUSINESS"
    }
  }
}
```

### ローカライゼーション設定

```typescript
interface AppleInfo {
  title: string  // 最大30文字
  subtitle?: string  // 最大30文字
  description: string  // 最大4000文字
  keywords?: string[]  // 最大100文字（合計）
  marketingUrl?: string
  supportUrl?: string  // App Store Connectで設定されていない場合必須
  privacyPolicyUrl?: string  // App Store Connectで設定されていない場合必須
  privacyPolicyText?: string
  privacyChoicesUrl?: string
  whatsNew?: string  // 最大4000文字
}

type AppleLanguage =
  | 'ar-SA'  // アラビア語
  | 'ca'     // カタロニア語
  | 'cs'     // チェコ語
  | 'da'     // デンマーク語
  | 'de-DE'  // ドイツ語
  | 'el'     // ギリシャ語
  | 'en-AU'  // 英語（オーストラリア）
  | 'en-CA'  // 英語（カナダ）
  | 'en-GB'  // 英語（イギリス）
  | 'en-US'  // 英語（アメリカ）
  | 'es-ES'  // スペイン語（スペイン）
  | 'es-MX'  // スペイン語（メキシコ）
  | 'fi'     // フィンランド語
  | 'fr-CA'  // フランス語（カナダ）
  | 'fr-FR'  // フランス語（フランス）
  | 'he'     // ヘブライ語
  | 'hi'     // ヒンディー語
  | 'hr'     // クロアチア語
  | 'hu'     // ハンガリー語
  | 'id'     // インドネシア語
  | 'it'     // イタリア語
  | 'ja'     // 日本語
  | 'ko'     // 韓国語
  | 'ms'     // マレー語
  | 'nl-NL'  // オランダ語
  | 'no'     // ノルウェー語
  | 'pl'     // ポーランド語
  | 'pt-BR'  // ポルトガル語（ブラジル）
  | 'pt-PT'  // ポルトガル語（ポルトガル）
  | 'ro'     // ルーマニア語
  | 'ru'     // ロシア語
  | 'sk'     // スロバキア語
  | 'sv'     // スウェーデン語
  | 'th'     // タイ語
  | 'tr'     // トルコ語
  | 'uk'     // ウクライナ語
  | 'vi'     // ベトナム語
  | 'zh-Hans'  // 中国語（簡体字）
  | 'zh-Hant'  // 中国語（繁体字）
```

**多言語対応例**:
```json
{
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app", "productivity"]
      },
      "ja": {
        "title": "素晴らしいアプリ",
        "subtitle": "あなたが作った素晴らしいアプリ",
        "description": "これまで見た中で最も素晴らしいアプリ",
        "keywords": ["素晴らしい", "アプリ", "生産性"]
      },
      "de-DE": {
        "title": "Tolle App",
        "subtitle": "Ihre selbstgemachte tolle App",
        "description": "Die tollste App, die Sie je gesehen haben",
        "keywords": ["toll", "app", "produktivität"]
      }
    }
  }
}
```

### リリース戦略

```typescript
interface AppleRelease {
  automaticRelease?: boolean
  earliestReleaseDate?: number  // Unixタイムスタンプ（ミリ秒）
  phasedRelease?: boolean
}
```

**リリースパターン**:

```typescript
interface ReleasePatterns {
  immediate: {
    automaticRelease: true
    description: "承認後即座にリリース"
  }
  scheduled: {
    automaticRelease: false
    earliestReleaseDate: number  // 指定日時
    description: "特定日時にリリース"
  }
  phased: {
    automaticRelease: true
    phasedRelease: true
    description: "7日間で段階的にリリース"
    rollout: "1日目: 1% → 7日目: 100%"
  }
  manual: {
    automaticRelease: false
    description: "手動でリリース制御"
  }
}
```

**使用例**:
```json
{
  "apple": {
    "release": {
      "automaticRelease": true,
      "phasedRelease": true
    }
  }
}
```

### レビュー情報

```typescript
interface AppleReview {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  demoUsername?: string
  demoPassword?: string
  demoRequired?: boolean
  notes?: string
  attachments?: AppleReviewAttachment[]
}

interface AppleReviewAttachment {
  path: string  // ローカルファイルパス
  description?: string
}
```

**レビュー情報の活用例**:
```json
{
  "apple": {
    "review": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "review@example.com",
      "phone": "+1-555-0100",
      "demoUsername": "demo@example.com",
      "demoPassword": "Demo123!",
      "demoRequired": true,
      "notes": "Please test the premium features using the demo account provided.",
      "attachments": [
        {
          "path": "./review-assets/demo-guide.pdf",
          "description": "Step-by-step guide for reviewing premium features"
        }
      ]
    }
  }
}
```

**詳細ドキュメント**: [`schema.md`](./metadata/schema.md)

## 🛠️ コマンドリファレンス

### eas metadata:pull

```bash
# ストアから現在の設定を取得
eas metadata:pull

# 特定のプロファイルを指定
eas metadata:pull --profile production
```

```typescript
interface MetadataPullCommand {
  purpose: "App Store Connectから現在の設定を取得"
  output: "store.config.json（またはカスタムパス）"
  options: {
    profile?: string  // eas.jsonのプロファイル
  }
  behavior: {
    overwrite: "既存ファイルを上書き確認"
    merge: "新規取得のみ"
  }
}
```

### eas metadata:push

```bash
# 設定をストアにプッシュ
eas metadata:push

# 特定のプロファイルを指定
eas metadata:push --profile production

# 自動承認（CI/CD向け）
eas metadata:push --non-interactive
```

```typescript
interface MetadataPushCommand {
  purpose: "ローカル設定をApp Store Connectに送信"
  input: "store.config.json（またはカスタムパス）"
  options: {
    profile?: string  // eas.jsonのプロファイル
    nonInteractive?: boolean  // 確認スキップ
  }
  workflow: {
    validation: "送信前の検証実行"
    confirmation: "変更内容の確認表示"
    upload: "差分のみアップロード"
    result: "成功・失敗の報告"
  }
}
```

### eas metadata:lint

```bash
# 設定ファイルの検証のみ実行
eas metadata:lint

# 特定ファイルを検証
eas metadata:lint --config ./custom-store.config.json
```

```typescript
interface MetadataLintCommand {
  purpose: "設定ファイルの検証のみ実行（送信なし）"
  checks: [
    "JSONスキーマ検証",
    "必須フィールド確認",
    "文字数制限チェック",
    "形式検証（URL、メールなど）"
  ]
  output: {
    errors: "修正必須の問題"
    warnings: "推奨される改善点"
    success: "検証成功メッセージ"
  }
}
```

## 🎯 実装パターンとベストプラクティス

### CI/CD統合パターン

```typescript
interface CICDIntegration {
  githubActions: {
    workflow: `
      name: Update App Store Metadata
      on:
        push:
          branches: [main]
          paths: ['store.config.json']

      jobs:
        update-metadata:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                node-version: '18'

            - name: Install EAS CLI
              run: npm install -g eas-cli

            - name: Push Metadata
              run: eas metadata:push --non-interactive
              env:
                EXPO_TOKEN: \${{ secrets.EXPO_TOKEN }}
    `
  }

  gitlab: {
    pipeline: `
      update-metadata:
        stage: deploy
        only:
          changes:
            - store.config.json
        script:
          - npm install -g eas-cli
          - eas metadata:push --non-interactive
        variables:
          EXPO_TOKEN: $EXPO_TOKEN
    `
  }
}
```

### ローカライゼーション管理パターン

```typescript
interface LocalizationManagement {
  fileStructure: {
    approach: "分離されたローカライゼーションファイル"
    structure: `
      locales/
        en-US.json
        ja.json
        de-DE.json
        fr-FR.json
      store.config.js  // ファイルを統合
    `
  }

  implementation: `
    // store.config.js
    const fs = require('fs');
    const path = require('path');

    const localesDir = path.join(__dirname, 'locales');
    const locales = fs.readdirSync(localesDir)
      .filter(file => file.endsWith('.json'))
      .reduce((acc, file) => {
        const locale = file.replace('.json', '');
        acc[locale] = JSON.parse(
          fs.readFileSync(path.join(localesDir, file), 'utf8')
        );
        return acc;
      }, {});

    module.exports = {
      configVersion: 0,
      apple: {
        info: locales
      }
    };
  `
}
```

### コンテンツ検証パターン

```typescript
interface ContentValidation {
  preCommitHook: {
    tool: "husky + lint-staged"
    setup: `
      // package.json
      {
        "husky": {
          "hooks": {
            "pre-commit": "lint-staged"
          }
        },
        "lint-staged": {
          "store.config.json": ["eas metadata:lint"]
        }
      }
    `
  }

  customValidation: `
    // validate-store-config.js
    const config = require('./store.config.json');

    function validateConfig(config) {
      const errors = [];

      // タイトル文字数チェック
      Object.entries(config.apple.info).forEach(([locale, info]) => {
        if (info.title.length > 30) {
          errors.push(\`\${locale}: Title exceeds 30 characters\`);
        }
        if (info.subtitle && info.subtitle.length > 30) {
          errors.push(\`\${locale}: Subtitle exceeds 30 characters\`);
        }
      });

      // 必須URLチェック
      if (!config.apple.info['en-US'].supportUrl) {
        errors.push('Support URL is required');
      }

      return errors;
    }

    const errors = validateConfig(config);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      process.exit(1);
    }
  `
}
```

### バージョン管理パターン

```typescript
interface VersionManagement {
  semver: {
    approach: "セマンティックバージョニング"
    pattern: `
      // package.json と同期
      const packageJson = require('./package.json');

      module.exports = {
        configVersion: 0,
        apple: {
          version: packageJson.version,
          info: {
            "en-US": {
              whatsNew: \`
                Version \${packageJson.version}
                - New feature X
                - Bug fix Y
                - Performance improvements
              \`
            }
          }
        }
      };
    `
  }

  releaseNotes: {
    automation: "CHANGELOG.mdから自動生成"
    implementation: `
      // generate-release-notes.js
      const fs = require('fs');
      const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

      function extractLatestVersion(changelog) {
        const versionRegex = /## \\[(\\d+\\.\\d+\\.\\d+)\\]([\\s\\S]*?)(?=## \\[|$)/;
        const match = changelog.match(versionRegex);
        return match ? match[2].trim() : '';
      }

      const whatsNew = extractLatestVersion(changelog);

      module.exports = async () => {
        const config = require('./store.config.json');
        Object.keys(config.apple.info).forEach(locale => {
          config.apple.info[locale].whatsNew = whatsNew;
        });
        return config;
      };
    `
  }
}
```

### エラーハンドリングパターン

```typescript
interface ErrorHandling {
  retryLogic: `
    // push-with-retry.js
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    async function pushWithRetry(maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await execPromise('eas metadata:push --non-interactive');
          console.log('Metadata pushed successfully');
          return;
        } catch (error) {
          console.error(\`Attempt \${i + 1} failed:\`, error.message);
          if (i === maxRetries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  `

  validation: `
    // Enhanced validation with detailed feedback
    async function validateAndPush() {
      try {
        // 事前検証
        await execPromise('eas metadata:lint');
        console.log('✅ Validation passed');

        // プッシュ
        await execPromise('eas metadata:push --non-interactive');
        console.log('✅ Metadata pushed successfully');

      } catch (error) {
        console.error('❌ Error:', error.message);

        // エラータイプに応じた処理
        if (error.message.includes('validation')) {
          console.error('Please fix validation errors in store.config.json');
        } else if (error.message.includes('authentication')) {
          console.error('Please check your EXPO_TOKEN');
        }

        process.exit(1);
      }
    }
  `
}
```

## 🔍 よくある質問（FAQ）

### Q1: Google Play Storeはサポートされていますか？

```typescript
interface GooglePlaySupport {
  current: "未サポート"
  reason: "Apple App Storeのみ現在サポート"
  future: "将来的なサポートの可能性あり"
  alternative: [
    "Google Play Console API",
    "Fastlane",
    "手動アップロード"
  ]
}
```

**回答**: いいえ、現在EAS MetadataはApple App Storeのみをサポートしています。

### Q2: プレビュー段階とはどういう意味ですか？

```typescript
interface PreviewStatus {
  implications: {
    breakingChanges: "破壊的な変更が加えられる可能性"
    apiStability: "API仕様が変更される可能性"
    featureAdditions: "新機能の追加予定"
  }
  recommendations: [
    "本番環境での慎重な使用",
    "バージョン固定の検討",
    "変更ログの定期確認",
    "フィードバックの提供"
  ]
}
```

**回答**: プレビュー段階では、APIや機能に破壊的な変更が加えられる可能性があります。本番環境で使用する場合は注意が必要です。

### Q3: 動的設定と静的設定のどちらを使うべきですか？

```typescript
interface ConfigChoice {
  useStatic: {
    when: [
      "アプリ情報が静的",
      "シンプルなローカライゼーション",
      "外部統合が不要"
    ]
    benefits: [
      "シンプルで理解しやすい",
      "JSONスキーマ検証",
      "VS Code拡張機能のフルサポート"
    ]
  }

  useDynamic: {
    when: [
      "動的な値が必要（年度、バージョンなど）",
      "外部サービスとの統合",
      "複雑なローカライゼーション管理"
    ]
    benefits: [
      "柔軟性の向上",
      "自動化の強化",
      "外部システムとの統合"
    ]
  }
}
```

### Q4: 設定変更はいつストアに反映されますか？

```typescript
interface UpdateTiming {
  metadataOnly: {
    timing: "即座～数時間"
    review: "レビュー不要（ほとんどの場合）"
    changes: [
      "説明文の更新",
      "キーワードの変更",
      "スクリーンショットの追加"
    ]
  }

  withAppUpdate: {
    timing: "アプリレビューと同時"
    review: "必須"
    changes: [
      "新バージョンのリリースノート",
      "カテゴリの変更",
      "年齢制限の変更"
    ]
  }
}
```

### Q5: CI/CDで自動化する際の推奨事項は？

```typescript
interface CICDBestPractices {
  security: [
    "EXPO_TOKENを環境変数として管理",
    "専用のロボットユーザーを使用",
    "最小権限の原則を適用",
    "定期的なトークンローテーション"
  ]

  validation: [
    "プッシュ前に必ずlintを実行",
    "バージョン番号の整合性確認",
    "必須フィールドの存在確認"
  ]

  monitoring: [
    "プッシュ成功・失敗の通知設定",
    "エラーログの保存",
    "変更履歴の追跡"
  ]

  workflow: [
    "メインブランチへのマージ時のみ実行",
    "手動承認ステップの追加（本番環境）",
    "リトライロジックの実装"
  ]
}
```

**詳細ドキュメント**: [`faq.md`](./metadata/faq.md)

## ⚠️ 制限事項と注意点

```typescript
interface Limitations {
  platform: {
    supported: ["iOS", "tvOS", "ipadOS"]
    unsupported: ["Android", "Web"]
  }

  appStore: {
    screenshots: "未サポート - 手動アップロード必要"
    appPreviews: "未サポート - 手動アップロード必要"
    inAppPurchases: "未サポート - App Store Connectで設定"
  }

  preview: {
    stability: "破壊的変更の可能性"
    support: "限定的なサポート"
    documentation: "継続的な更新"
  }

  apiLimits: {
    rateLimit: "App Store Connect APIのレート制限"
    fileSize: "添付ファイルサイズ制限"
    requestTimeout: "長時間実行の可能性"
  }
}
```

## 🔗 関連リソース

### 内部リンク
- [`getting-started.md`](./metadata/getting-started.md) - 使い始めガイド
- [`config.md`](./metadata/config.md) - 設定パターン詳細
- [`schema.md`](./metadata/schema.md) - 完全なスキーマリファレンス
- [`faq.md`](./metadata/faq.md) - よくある質問

### 外部リンク
- [Expo Tools VS Code Extension](https://github.com/expo/vscode-expo#readme) - VS Code拡張機能
- [App Store Connect](https://appstoreconnect.apple.com/) - Apple開発者ポータル
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) - レビューガイドライン

### 関連ドキュメント
- **[EAS Build](../build/)** - アプリビルドプロセス
- **[EAS Submit](../submit/)** - アプリストア提出
- **[EAS Update](../update/)** - OTAアップデート

## 📋 まとめ

```typescript
interface EASMetadataSummary {
  strengths: [
    "コマンドラインからのストア管理",
    "バージョン管理システムとの統合",
    "事前検証による高速フィードバック",
    "チームコラボレーション促進",
    "CI/CD自動化対応",
    "多言語ローカライゼーション",
    "動的コンテンツ管理"
  ]

  currentLimitations: [
    "Apple App Storeのみサポート",
    "プレビュー段階（破壊的変更の可能性）",
    "スクリーンショット管理未サポート"
  ]

  idealUseCases: [
    "頻繁なメタデータ更新が必要なアプリ",
    "多言語対応アプリ",
    "チーム開発プロジェクト",
    "CI/CD統合環境",
    "外部CMSとの連携"
  ]

  workflow: {
    initial: "eas metadata:pull でストア設定を取得"
    configure: "store.config.json を編集"
    validate: "eas metadata:lint で検証"
    deploy: "eas metadata:push でストアに反映"
  }

  nextSteps: [
    "VS Code Expo Tools拡張機能のインストール",
    "プロジェクトへのstore.config.json追加",
    "CI/CDパイプラインへの統合",
    "チームワークフローの確立"
  ]
}
```

EAS Metadataを活用することで、アプリストアのプレゼンス管理を自動化し、チーム全体での効率的なコラボレーションを実現できます。事前検証機能により、リジェクトリスクを最小限に抑え、高速な反復開発が可能になります。
