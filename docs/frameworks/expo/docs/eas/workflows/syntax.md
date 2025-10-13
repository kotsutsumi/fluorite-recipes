# EAS Workflowsの構文

## 概要

ワークフローは、「1つ以上のジョブで構成される設定可能な自動化プロセス」であり、YAML設定ファイルが必要です。

## ワークフローファイル

- `.eas/workflows`ディレクトリに配置
- `.yml`または`.yaml`拡張子が必要
- YAML構文を使用

### プロジェクト構造の例
```
my-app
 ├── .eas
 │   └── workflows
 │       ├── create-development-builds.yml
 │       ├── publish-preview-update.yml
 │       └── deploy-to-production.yml
 └── eas.json
```

## 主要な設定セクション

### `name`
- 人間にわかりやすいワークフロー名
- EASダッシュボードに表示されます

### `on`
ワークフローをトリガーするGitHubイベントを定義：
- `push`
- `pull_request`
- `pull_request_labeled`
- `schedule.cron`
- `workflow_dispatch.inputs`

### `jobs`
- ワークフロー内の個別のジョブを定義
- 事前パッケージ済みまたはカスタムジョブが使用可能

## 事前パッケージ済みジョブタイプ

1. `build`: Android/iOSビルドを作成
2. `deploy`: アプリケーションをデプロイ
3. `submit`: アプリストアにビルドを提出
4. `update`: アプリのアップデートを公開
5. `maestro`: UIテストを実行
6. `slack`: Slackメッセージを送信
7. その他...

## カスタムジョブ

カスタムジョブでは特定のコマンドとステップを実行できます：

```yaml
jobs:
  my_job:
    steps:
      - name: My first step
        run: echo "Hello World"
```

## 組み込み関数

EASは複数の組み込み関数を提供：
- `eas/checkout`
- `eas/install_node_modules`
- `eas/prebuild`
- `eas/send_slack_message`

## 制御フロー

以下を使用してジョブの実行を制御：
- `needs`: ジョブの依存関係を指定
- `after`: 特定のイベント後にジョブを実行
- `if`: 条件付き実行
