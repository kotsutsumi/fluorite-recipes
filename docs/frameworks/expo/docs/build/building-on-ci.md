# CIからビルドをトリガー

## 前提条件

### ローカルマシンから成功したビルドを実行

非対話モードでEAS Buildをセットアップするには：
- EASでプロジェクトを初期化
- `projectId`を生成
- `eas.json`ファイルを追加
- アプリ設定プロパティを入力
- ビルド認証情報が作成されていることを確認

## EAS Workflowsの使用

`.eas/workflows/build.yml`のワークフロー設定例：

```yaml
name: Build
on:
  push:
    branches:
      - main
jobs:
  build_android:
    name: Build Android App
    type: build
    params:
      platform: android
  build_ios:
    name: Build iOS App
    type: build
    params:
      platform: ios
```

## 他のCIサービス向けのアプリ設定

### 認証要件

1. Expoアカウント認証用の個人アクセストークンを作成
2. （オプション）Apple Services Connect（ASC）APIトークンを提供：
   - `EXPO_ASC_API_KEY_PATH`
   - `EXPO_ASC_KEY_ID`
   - `EXPO_ASC_ISSUER_ID`
   - `EXPO_APPLE_TEAM_ID`
   - `EXPO_APPLE_TEAM_TYPE`

### 新しいビルドのトリガー

以下のコマンドを使用してビルドをトリガー：

```bash
npx eas-cli build --platform all --non-interactive --no-wait
```

## CIサービスの例

ドキュメントでは以下の設定スニペットを提供：
- Travis CI
- GitLab CI
- Bitbucket Pipelines
- CircleCI
- GitHub Actions

各例では、それぞれのCI設定ファイルでEAS Buildをセットアップする方法を示しています。

### GitHub Actionsの例

```yaml
name: EAS Build
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    name: Install and build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Build on EAS
        run: eas build --platform all --non-interactive
```
