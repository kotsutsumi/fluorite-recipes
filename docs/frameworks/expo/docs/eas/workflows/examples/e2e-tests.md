# EAS WorkflowsとMaestroでE2Eテストを実行

## 概要
このガイドは、ExpoプロジェクトでMaestroを使用してEAS Workflows上でエンドツーエンド（E2E）テストをセットアップして実行する方法を説明します。

## 手順

### 1. プロジェクトのセットアップ
- 新しいプロジェクトを作成
- EASと同期
- プロジェクトを設定
- GitHubリポジトリをリンク

### 2. Maestroテストケースの追加
`.maestro`ディレクトリにテストフローを作成：

#### home.yml
```yaml
appId: dev.expo.eastestsexample
---
- launchApp
- assertVisible: 'Welcome!'
```

#### expand_test.yml
```yaml
appId: dev.expo.eastestsexample
---
- launchApp
- tapOn: 'Explore.*'
- tapOn: '.*File-based routing'
- assertVisible: 'This app has two screens.*'
```

### 3. Maestroテストをローカルで実行（オプション）
- Maestro CLIをインストール
- ローカルエミュレーター/シミュレーターにアプリをインストール
- `maestro test`コマンドでテストを実行

### 4. E2Eテスト用のビルドプロファイル
`eas.json`を設定：
```json
{
  "build": {
    "e2e-test": {
      "withoutCredentials": true,
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 5. E2Eテストワークフローの作成
`.eas/workflows`にワークフローファイルを作成：

#### e2e-test-android.yml
```yaml
name: e2e-test-android
on:
  pull_request:
    branches: ['*']
jobs:
  build_android_for_e2e:
    type: build
    params:
      platform: android
      profile: e2e-test
  maestro_test:
    needs: [build_android_for_e2e]
    type: maestro
    params:
      build_id: ${{ needs.build_android_for_e2e.outputs.build_id }}
      flow_path: .maestro
```

## 主な利点
- 自動化されたE2Eテスト
- プルリクエストごとのテスト実行
- AndroidとiOSの両方をサポート
- Maestro統合による強力なテスト機能
