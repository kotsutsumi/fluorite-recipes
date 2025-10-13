# 事前パッケージ済みジョブ

## 概要

事前パッケージ済みジョブは、アプリのビルド、提出、テストなどの一般的なタスクを自動化するのに役立つ「すぐに使えるワークフロージョブ」です。

## ジョブタイプ

### 1. Buildジョブ

#### 目的
カスタマイズ可能な設定でAndroidまたはiOSアプリをビルドします。

#### 主な構文
```yaml
jobs:
  build_app:
    type: build
    params:
      platform: android | ios # 必須
      profile: string # オプション
      message: string # オプション
```

#### 例
```yaml
name: Build iOS app
jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: production
```

### 2. Deployジョブ

#### 目的
EAS Hostingを使用してアプリケーションをデプロイします。

#### 主な構文
```yaml
jobs:
  deploy_web:
    type: deploy
    params:
      alias: string # オプション
      prod: boolean # オプション
```

### 3. Submitジョブ

#### 目的
EAS Submitを使用してビルドをアプリストアに提出します。

#### 主な構文
```yaml
jobs:
  submit_to_store:
    type: submit
    params:
      build_id: string # 必須
      profile: string # オプション
```

### 4. TestFlightジョブ

#### 目的
iOSビルドをTestFlightテストグループに配布します。

#### 主な構文
```yaml
jobs:
  testflight_distribution:
    type: testflight
    params:
      build_id: string # 必須
      internal_groups: string[] # オプション
      external_groups: string[] # オプション
```

### 5. Updateジョブ

#### 目的
EAS Updateを使用してアップデートを公開します。

#### 主な構文
```yaml
jobs:
  publish_update:
    type: update
    params:
      message: string # オプション
      platform: string # オプション
      branch: string # オプション
```

### 6. Maestroジョブ

#### 目的
Maestroを使用して自動化されたUIテストを実行します。

#### 主な構文
```yaml
jobs:
  run_ui_tests:
    type: maestro
    params:
      build_id: string # 必須
      flow_path: string # 必須
```

## 使用方法

事前パッケージ済みジョブは、ワークフローYAMLファイル内で定義され、一般的な開発およびリリースタスクを自動化するために使用されます。各ジョブタイプには特定のパラメータがあり、プロジェクトのニーズに合わせてカスタマイズできます。
