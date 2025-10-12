# EAS Workflowsを始める

## 概要
EAS WorkflowsはReact Native CI/CDサービスで、以下を含む開発およびリリースプロセスの自動化を支援します：
- アプリストアリリースのビルドと提出
- プレビューアップデートの作成
- 開発チームの一般的なタスクの自動化

## 前提条件
4つの主要な要件：
1. Expoアカウントへの登録
2. `npx create-expo-app@latest`でプロジェクトを作成
3. `npx eas-cli@latest init`を使用してプロジェクトをEASと同期
4. プロジェクトルートに`eas.json`ファイルを追加

## Workflowsの開始

### ワークフローファイルの作成
1. `.eas/workflows`ディレクトリを作成
2. YAMLワークフローファイルを追加（例：`create-production-builds.yml`）

### ワークフロー設定の例
```yaml
name: Create Production Builds
jobs:
  build_android:
    type: build
    params:
      platform: android
  build_ios:
    type: build
    params:
      platform: ios
```

### ワークフローの実行
以下のコマンドでワークフローを実行：
```
npx eas-cli@latest workflow:run create-production-builds.yml
```

## 追加機能

### GitHub統合
- GitHubリポジトリをEASプロジェクトにリンク
- 特定のGitHubイベントでワークフローをトリガー
- ワークフローファイルの`on`トリガーで設定

### VS Codeサポート
- Expo Tools VS Code拡張機能をダウンロード
- ワークフローファイルのオートコンプリートと説明を取得

## 他のCIサービスとの主な違い
- 事前設定されたジョブタイプ
- アプリ開発に特化
- expo.devと統合
- 最適化されたクラウドマシン

> フィードバックや機能リクエストは workflows@expo.dev にメールしてください
