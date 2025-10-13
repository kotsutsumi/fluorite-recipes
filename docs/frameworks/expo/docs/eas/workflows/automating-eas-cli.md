# EAS CLIコマンドの自動化

## プロジェクトの設定

GitHubリポジトリでEAS Workflowsを設定するには：
- プロジェクトのGitHub設定に移動
- GitHubアプリをインストール
- ExpoプロジェクトにマッチするGitHubリポジトリを接続

## ビルドの作成

### EAS CLIビルドコマンドの例
```
eas build --platform ios --profile production
```

### ワークフローファイル（.eas/workflows/build-ios-production.yml）
```yaml
name: iOS production build
on:
  push:
    branches: ['main']
jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production
```

トリガー方法：
- `main`ブランチへのプッシュ
- CLIコマンドの実行：`eas workflow:run build-ios-production.yml`

## ビルドの提出

### EAS CLI Submitコマンドの例
```
eas submit --platform ios
```

### ワークフローファイル（.eas/workflows/submit-ios.yml）
```yaml
name: Submit iOS app
on:
  push:
    branches: ['main']
jobs:
  submit_ios:
    name: Submit iOS
    type: submit
    params:
      platform: ios
```

トリガー方法：
- `main`ブランチへのプッシュ
- CLIコマンドの実行：`eas workflow:run submit-ios.yml`

## アップデートの公開

### EAS CLI Updateコマンドの例
```
eas update --auto
```

### ワークフローファイル（.eas/workflows/publish-update.yml）
```yaml
name: Publish update
on:
  push:
    branches: ['*']
jobs:
  update:
    name: Update
    type: update
    params:
      branch: ${{ github.ref_name || 'test'}}
```

トリガー方法：
- 任意のブランチへのプッシュ
- CLIコマンドの実行：`eas workflow:run publish-update.yml`

## 次のステップ

以下のワークフロー例を探索：
- 開発ビルド
- プレビューアップデート
- 本番ビルド
