# EAS Workflows - 完全ガイド

## 概要

EAS Workflowsは、React Nativeアプリケーションの開発とリリースプロセスを自動化するCI/CDサービスです。アプリストアへのビルドと提出、プレビューアップデートの作成、開発チームの一般的なタスクの自動化を支援します。

## TypeScript型定義

```typescript
/**
 * EAS Workflowの完全な型定義
 */
interface EASWorkflow {
  /** ワークフローの表示名 */
  name: string;

  /** ワークフローをトリガーするGitHubイベント（オプション） */
  on?: WorkflowTrigger;

  /** ワークフロー内で実行されるジョブ */
  jobs: Record<string, WorkflowJob>;
}

/**
 * ワークフローのトリガー設定
 */
interface WorkflowTrigger {
  /** ブランチへのプッシュでトリガー */
  push?: {
    branches?: string[];
  };

  /** プルリクエストでトリガー */
  pull_request?: {
    branches?: string[];
    types?: string[];
  };

  /** ラベル付きプルリクエストでトリガー */
  pull_request_labeled?: {
    labels?: string[];
  };

  /** スケジュールでトリガー（cron構文） */
  schedule?: {
    cron?: string;
  };

  /** 手動トリガー（入力パラメータ付き） */
  workflow_dispatch?: {
    inputs?: Record<string, WorkflowInput>;
  };
}

/**
 * ワークフロー入力パラメータ
 */
interface WorkflowInput {
  /** 入力の説明 */
  description?: string;

  /** 必須かどうか */
  required?: boolean;

  /** デフォルト値 */
  default?: string | boolean | number;

  /** 入力タイプ */
  type?: 'string' | 'boolean' | 'number' | 'choice';

  /** 選択肢（typeがchoiceの場合） */
  options?: string[];
}

/**
 * ワークフロージョブ（事前パッケージ済みまたはカスタム）
 */
type WorkflowJob = PrePackagedJob | CustomJob;

/**
 * 事前パッケージ済みジョブ
 */
interface PrePackagedJob {
  /** ジョブの表示名 */
  name?: string;

  /** ジョブタイプ */
  type: 'build' | 'deploy' | 'submit' | 'testflight' | 'update' | 'maestro' | 'slack';

  /** ジョブパラメータ */
  params?: BuildParams | DeployParams | SubmitParams | TestFlightParams | UpdateParams | MaestroParams | SlackParams;

  /** ジョブの依存関係 */
  needs?: string[];

  /** 実行後の条件 */
  after?: string[];

  /** 条件付き実行 */
  if?: string;
}

/**
 * カスタムジョブ
 */
interface CustomJob {
  /** ジョブの表示名 */
  name?: string;

  /** 実行するステップ */
  steps: JobStep[];

  /** ジョブの依存関係 */
  needs?: string[];

  /** 実行後の条件 */
  after?: string[];

  /** 条件付き実行 */
  if?: string;
}

/**
 * ジョブステップ
 */
interface JobStep {
  /** ステップの表示名 */
  name?: string;

  /** 実行するコマンド */
  run?: string;

  /** 使用する組み込み関数 */
  uses?: 'eas/checkout' | 'eas/install_node_modules' | 'eas/prebuild' | 'eas/send_slack_message';

  /** 関数のパラメータ */
  with?: Record<string, any>;
}

/**
 * Buildジョブのパラメータ
 */
interface BuildParams {
  /** ビルドプラットフォーム（必須） */
  platform: 'android' | 'ios';

  /** eas.jsonのビルドプロファイル名（オプション） */
  profile?: string;

  /** ビルドメッセージ（オプション） */
  message?: string;
}

/**
 * Deployジョブのパラメータ
 */
interface DeployParams {
  /** デプロイエイリアス（オプション） */
  alias?: string;

  /** 本番環境へのデプロイ（オプション） */
  prod?: boolean;
}

/**
 * Submitジョブのパラメータ
 */
interface SubmitParams {
  /** 提出するビルドID（必須） */
  build_id: string;

  /** eas.jsonの提出プロファイル名（オプション） */
  profile?: string;
}

/**
 * TestFlightジョブのパラメータ
 */
interface TestFlightParams {
  /** 配布するビルドID（必須） */
  build_id: string;

  /** 内部テストグループ（オプション） */
  internal_groups?: string[];

  /** 外部テストグループ（オプション） */
  external_groups?: string[];
}

/**
 * Updateジョブのパラメータ
 */
interface UpdateParams {
  /** アップデートメッセージ（オプション） */
  message?: string;

  /** プラットフォーム（オプション） */
  platform?: 'android' | 'ios' | 'all';

  /** アップデートブランチ（オプション） */
  branch?: string;
}

/**
 * Maestroジョブのパラメータ
 */
interface MaestroParams {
  /** テストするビルドID（必須） */
  build_id: string;

  /** Maestroフローファイルのパス（必須） */
  flow_path: string;
}

/**
 * Slackジョブのパラメータ
 */
interface SlackParams {
  /** Slackメッセージの内容 */
  message?: string;

  /** Webhook URL */
  webhook_url?: string;
}
```

## プロジェクト構造

### ワークフローファイルの配置

ワークフローファイルは`.eas/workflows`ディレクトリに配置する必要があります：

```
my-app/
├── .eas/
│   └── workflows/
│       ├── create-development-builds.yml
│       ├── publish-preview-update.yml
│       ├── deploy-to-production.yml
│       └── build-and-submit.yml
├── eas.json
├── app.json
└── package.json
```

### ファイル命名規則

- `.yml`または`.yaml`拡張子を使用
- わかりやすい名前を付ける（例：`build-ios-production.yml`）
- ハイフンでワードを区切る

## ワークフローの開始

### 前提条件

EAS Workflowsを使用する前に、以下を完了してください：

1. **Expoアカウント登録**: [expo.dev](https://expo.dev)でアカウントを作成
2. **プロジェクト作成**: `npx create-expo-app@latest`でプロジェクトを作成
3. **EAS初期化**: `npx eas-cli@latest init`でプロジェクトをEASと同期
4. **eas.json作成**: プロジェクトルートに`eas.json`ファイルを追加

### GitHub統合（オプション）

GitHubリポジトリと統合することで、自動トリガーが可能になります：

1. プロジェクトのGitHub設定に移動
2. Expo GitHub Appをインストール
3. ExpoプロジェクトにマッチするGitHubリポジトリを接続

## ワークフロー構文

### 基本構造

```yaml
name: ワークフロー名
on:
  push:
    branches: ['main']
jobs:
  job_name:
    type: build
    params:
      platform: ios
```

### `name`フィールド

人間にわかりやすいワークフロー名。EASダッシュボードに表示されます。

```yaml
name: iOS本番ビルドと提出
```

### `on`フィールド（トリガー設定）

#### プッシュトリガー

```yaml
on:
  push:
    branches: ['main', 'develop']
```

#### プルリクエストトリガー

```yaml
on:
  pull_request:
    branches: ['main']
    types: ['opened', 'synchronize']
```

#### ラベル付きプルリクエスト

```yaml
on:
  pull_request_labeled:
    labels: ['preview']
```

#### スケジュールトリガー

```yaml
on:
  schedule:
    cron: '0 0 * * *'  # 毎日午前0時
```

#### 手動トリガー

```yaml
on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'ビルドするプラットフォーム'
        required: true
        type: choice
        options:
          - android
          - ios
          - all
```

### `jobs`フィールド

ワークフロー内で実行される個別のジョブを定義します。

## 事前パッケージ済みジョブ

### 1. Buildジョブ

AndroidまたはiOSアプリをビルドします。

```yaml
jobs:
  build_ios:
    name: iOS本番ビルド
    type: build
    params:
      platform: ios
      profile: production
      message: 'メインブランチからの本番ビルド'
```

**パラメータ**:
- `platform`: `android`または`ios`（必須）
- `profile`: `eas.json`のビルドプロファイル名（オプション）
- `message`: ビルドメッセージ（オプション）

**関連コマンド**:
```bash
eas build --platform ios --profile production
```

### 2. Deployジョブ

EAS Hostingを使用してアプリケーションをデプロイします。

```yaml
jobs:
  deploy_web:
    name: Webアプリをデプロイ
    type: deploy
    params:
      alias: staging
      prod: false
```

**パラメータ**:
- `alias`: デプロイエイリアス（オプション）
- `prod`: 本番環境へのデプロイ（オプション）

**関連コマンド**:
```bash
eas deploy --alias staging
```

### 3. Submitジョブ

ビルドをアプリストアに提出します。

```yaml
jobs:
  submit_ios:
    name: iOSビルドを提出
    type: submit
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
      profile: production
    needs: [build_ios]
```

**パラメータ**:
- `build_id`: 提出するビルドID（必須）
- `profile`: `eas.json`の提出プロファイル名（オプション）

**関連コマンド**:
```bash
eas submit --platform ios --id <build_id>
```

### 4. TestFlightジョブ

iOSビルドをTestFlightテストグループに配布します。

```yaml
jobs:
  testflight_distribution:
    name: TestFlightに配布
    type: testflight
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
      internal_groups: ['QA Team', 'Beta Testers']
      external_groups: ['External Beta']
    needs: [build_ios]
```

**パラメータ**:
- `build_id`: 配布するビルドID（必須）
- `internal_groups`: 内部テストグループ（オプション）
- `external_groups`: 外部テストグループ（オプション）

### 5. Updateジョブ

EAS Updateを使用してアップデートを公開します。

```yaml
jobs:
  publish_update:
    name: アップデートを公開
    type: update
    params:
      message: '新機能とバグ修正'
      platform: all
      branch: ${{ github.ref_name }}
```

**パラメータ**:
- `message`: アップデートメッセージ（オプション）
- `platform`: `android`、`ios`、または`all`（オプション）
- `branch`: アップデートブランチ（オプション）

**関連コマンド**:
```bash
eas update --message "新機能" --branch main
```

### 6. Maestroジョブ

Maestroを使用してUIテストを実行します（実験段階）。

```yaml
jobs:
  run_ui_tests:
    name: UIテストを実行
    type: maestro
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
      flow_path: .maestro/login-flow.yaml
    needs: [build_ios]
```

**パラメータ**:
- `build_id`: テストするビルドID（必須）
- `flow_path`: Maestroフローファイルのパス（必須）

**注意**: Maestroテストは現在実験段階であり、結果の不安定性が発生する可能性があります。

### 7. Slackジョブ

Slackメッセージを送信します。

```yaml
jobs:
  notify_slack:
    name: Slack通知
    type: slack
    params:
      message: 'ビルドが完了しました！'
      webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
    after: [build_ios]
```

## カスタムジョブ

カスタムジョブでは、特定のコマンドとステップを実行できます。

### 基本的なカスタムジョブ

```yaml
jobs:
  custom_task:
    name: カスタムタスク
    steps:
      - name: プロジェクトをチェックアウト
        uses: eas/checkout

      - name: 依存関係をインストール
        uses: eas/install_node_modules

      - name: テストを実行
        run: npm test

      - name: リントを実行
        run: npm run lint
```

### 組み込み関数

EASは以下の組み込み関数を提供しています：

#### `eas/checkout`

リポジトリをチェックアウトします。

```yaml
- name: プロジェクトをチェックアウト
  uses: eas/checkout
```

#### `eas/install_node_modules`

Node.jsの依存関係をインストールします。

```yaml
- name: 依存関係をインストール
  uses: eas/install_node_modules
```

#### `eas/prebuild`

Expoプリビルドを実行します。

```yaml
- name: プリビルドを実行
  uses: eas/prebuild
```

#### `eas/send_slack_message`

Slackメッセージを送信します。

```yaml
- name: Slackに通知
  uses: eas/send_slack_message
  with:
    message: 'デプロイが完了しました！'
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 制御フロー

### ジョブの依存関係（`needs`）

他のジョブが完了するまでジョブを待機させます。

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios

  submit_ios:
    type: submit
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
    needs: [build_ios]
```

### 後続実行（`after`）

特定のジョブの後にジョブを実行します（成功・失敗に関わらず）。

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios

  notify_team:
    type: slack
    params:
      message: 'ビルドプロセスが完了しました'
    after: [build_ios]
```

### 条件付き実行（`if`）

条件に基づいてジョブを実行します。

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios

  submit_ios:
    type: submit
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
    needs: [build_ios]
    if: ${{ github.ref == 'refs/heads/main' }}
```

## 実践的な例

### 例1: 本番ビルドと提出

```yaml
name: 本番ビルドと提出
on:
  push:
    branches: ['main']
jobs:
  build_android:
    name: Androidビルド
    type: build
    params:
      platform: android
      profile: production

  build_ios:
    name: iOSビルド
    type: build
    params:
      platform: ios
      profile: production

  submit_android:
    name: Google Playに提出
    type: submit
    params:
      build_id: ${{ jobs.build_android.outputs.build_id }}
    needs: [build_android]

  submit_ios:
    name: App Storeに提出
    type: submit
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
    needs: [build_ios]
```

### 例2: プレビューアップデート

```yaml
name: プレビューアップデート
on:
  pull_request:
    branches: ['main']
jobs:
  publish_update:
    name: プレビューアップデートを公開
    type: update
    params:
      branch: ${{ github.ref_name }}
      message: 'PR #${{ github.event.number }}のプレビュー'
```

### 例3: スケジュール済みビルド

```yaml
name: 夜間ビルド
on:
  schedule:
    cron: '0 2 * * *'  # 毎日午前2時
jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: nightly

  build_ios:
    type: build
    params:
      platform: ios
      profile: nightly
```

### 例4: 完全なCI/CDパイプライン

```yaml
name: 完全なCI/CDパイプライン
on:
  push:
    branches: ['main']
jobs:
  test:
    name: テストを実行
    steps:
      - uses: eas/checkout
      - uses: eas/install_node_modules
      - run: npm test
      - run: npm run lint

  build_ios:
    name: iOSビルド
    type: build
    params:
      platform: ios
      profile: production
    needs: [test]

  build_android:
    name: Androidビルド
    type: build
    params:
      platform: android
      profile: production
    needs: [test]

  testflight:
    name: TestFlightに配布
    type: testflight
    params:
      build_id: ${{ jobs.build_ios.outputs.build_id }}
      internal_groups: ['QA Team']
    needs: [build_ios]

  submit_android:
    name: Google Playに提出
    type: submit
    params:
      build_id: ${{ jobs.build_android.outputs.build_id }}
    needs: [build_android]

  notify_success:
    name: 成功を通知
    type: slack
    params:
      message: 'デプロイが成功しました！'
    after: [submit_android, testflight]
```

## ワークフローの実行

### CLIから実行

```bash
# ワークフローを実行
npx eas-cli@latest workflow:run <workflow-file-name>.yml

# 例
npx eas-cli@latest workflow:run build-ios-production.yml
```

### GitHubイベントから自動実行

ワークフローに`on`フィールドが定義されている場合、指定されたGitHubイベントで自動的に実行されます：

```yaml
on:
  push:
    branches: ['main']
```

上記の設定により、`main`ブランチへのプッシュ時に自動実行されます。

### 手動トリガー

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'デプロイ環境'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
```

EASダッシュボードまたはCLIから手動でトリガーできます。

## EAS CLIコマンドとの対応

### ビルドコマンド

| EAS CLI | Workflow |
|---------|----------|
| `eas build --platform ios --profile production` | `type: build` + `params: { platform: ios, profile: production }` |
| `eas build --platform android` | `type: build` + `params: { platform: android }` |

### 提出コマンド

| EAS CLI | Workflow |
|---------|----------|
| `eas submit --platform ios` | `type: submit` + `params: { platform: ios, build_id: ... }` |
| `eas submit --platform android --id <build_id>` | `type: submit` + `params: { build_id: <build_id> }` |

### アップデートコマンド

| EAS CLI | Workflow |
|---------|----------|
| `eas update --auto` | `type: update` + `params: { branch: ... }` |
| `eas update --branch main --message "Fix"` | `type: update` + `params: { branch: main, message: "Fix" }` |

## VS Codeサポート

Expo Tools VS Code拡張機能をインストールすることで、以下の機能が利用できます：

- ワークフローファイルのシンタックスハイライト
- オートコンプリート機能
- パラメータの説明とドキュメント
- エラー検出

**インストール方法**:
1. VS Codeで拡張機能マーケットプレイスを開く
2. "Expo Tools"を検索
3. インストールをクリック

## 現在の制限事項

### 1. Maestroテストは実験段階

- テスト結果の不安定性が発生する可能性があります
- Expoは安定性と信頼性の向上に取り組んでいます

### 2. プログラマティックなジョブステータスアクセスなし

- ジョブステータスをプログラムで取得できません
- この機能は将来のロードマップに含まれています

### 3. 共有ワークフロー設定なし

- 各ワークフローは独立して定義する必要があります
- 設定の重複が発生する可能性があります

### 4. Matrixサポートなし

- Matrixビルドは現在サポートされていません
- 異なる設定での並列ワークフローのバリエーションを実行できません

## ベストプラクティス

### 1. ワークフローの命名規則

わかりやすく、目的を明確にした名前を使用：

```yaml
# 良い例
name: 本番環境へのデプロイ
name: プレビューアップデート作成
name: 夜間ビルドとテスト

# 悪い例
name: ワークフロー1
name: ビルド
```

### 2. ジョブの依存関係を適切に設定

```yaml
jobs:
  test:
    steps:
      - run: npm test

  build:
    type: build
    needs: [test]  # テストが成功した後にビルド

  submit:
    type: submit
    needs: [build]  # ビルドが成功した後に提出
```

### 3. 環境変数とシークレットの使用

```yaml
jobs:
  notify:
    type: slack
    params:
      webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 4. 条件付き実行の活用

```yaml
jobs:
  submit_production:
    type: submit
    if: ${{ github.ref == 'refs/heads/main' }}
    needs: [build]
```

### 5. エラーハンドリング

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios

  notify_failure:
    type: slack
    params:
      message: 'ビルドが失敗しました'
    if: ${{ jobs.build.status == 'failure' }}
    after: [build]
```

## トラブルシューティング

### ワークフローが実行されない

**原因**:
- GitHubリポジトリが接続されていない
- トリガー条件が満たされていない
- ワークフローファイルの構文エラー

**解決方法**:
1. GitHubリポジトリが正しく接続されているか確認
2. `on`フィールドのトリガー条件を確認
3. YAMLの構文を検証（VS Code拡張機能を使用）

### ビルドが失敗する

**原因**:
- `eas.json`の設定エラー
- 認証情報が不足
- 依存関係の問題

**解決方法**:
1. `eas.json`のビルドプロファイルを確認
2. 必要な認証情報が設定されているか確認
3. ローカルで`eas build`を実行してエラーを確認

### ジョブの依存関係エラー

**原因**:
- 循環依存
- 存在しないジョブへの参照

**解決方法**:
1. `needs`フィールドで循環依存がないか確認
2. 参照しているジョブ名が正しいか確認

## 関連ドキュメント

- [EAS Build](/docs/frameworks/expo/docs/eas/build.md)
- [EAS Submit](/docs/frameworks/expo/docs/eas/submit.md)
- [EAS Update](/docs/frameworks/expo/docs/eas/update.md)
- [EAS環境変数](/docs/frameworks/expo/docs/eas/environment-variables.md)
- [eas.json設定](/docs/frameworks/expo/docs/eas/json.md)

## コマンドリファレンス

```bash
# ワークフロー関連コマンド
npx eas-cli@latest workflow:run <workflow-file>     # ワークフローを実行
npx eas-cli@latest workflow:list                     # ワークフロー一覧を表示

# 関連コマンド
npx eas-cli@latest build --platform <platform>       # ビルドを作成
npx eas-cli@latest submit --platform <platform>      # ビルドを提出
npx eas-cli@latest update --branch <branch>          # アップデートを公開
npx eas-cli@latest init                              # EASプロジェクトを初期化
```

## 追加リソース

- **公式ドキュメント**: [expo.dev/eas](https://expo.dev/eas)
- **EASニュースレター**: 最新情報と機能強化を受け取る
- **フィードバック**: workflows@expo.dev にメール

## まとめ

EAS Workflowsは、React Nativeアプリケーションの開発とリリースプロセスを大幅に自動化します：

- **事前パッケージ済みジョブ**: ビルド、提出、アップデート、テストなどの一般的なタスクを簡単に自動化
- **カスタムジョブ**: プロジェクト固有のタスクを柔軟に定義
- **GitHub統合**: プッシュ、プルリクエスト、スケジュールなどのイベントで自動トリガー
- **制御フロー**: ジョブの依存関係、条件付き実行、後続実行を活用した高度なワークフロー
- **VS Codeサポート**: オートコンプリートと構文検証で開発体験を向上

---

*このドキュメントは、EAS Workflowsの包括的なガイドとして、プロジェクトのCI/CD自動化を支援します。*
