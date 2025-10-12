# EAS Workflowsで開発ビルドを作成

## 概要
開発ビルドは、Expoの開発者ツールを含む特殊なビルドで、シミュレーター、エミュレーター、物理デバイス向けの本番環境に近いビルドを可能にします。

## 前提条件

### 1. 環境のセットアップ
開発ビルド用にプロジェクトとデバイスを設定：
- Androidデバイスのセットアップ
- Androidエミュレーターのセットアップ
- iOSデバイスのセットアップ
- iOSシミュレーターのセットアップ

### 2. ビルドプロファイルの作成

#### eas.json設定
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

#### ワークフローファイル（.eas/workflows/create-development-builds.yml）
```yaml
name: Create development builds
jobs:
  android_development_build:
    name: Build Android
    type: build
    params:
      platform: android
      profile: development

  ios_device_development_build:
    name: Build iOS device
    type: build
    params:
      platform: ios
      profile: development

  ios_simulator_development_build:
    name: Build iOS simulator
    type: build
    params:
      platform: ios
      profile: development-simulator
```

### ワークフローの実行
ターミナルコマンド：
```
eas workflow:run .eas/workflows/create-development-builds.yml
```

## 主な利点
- 複数のプラットフォーム向けにビルドを作成
- 物理デバイスとシミュレーターをサポート
- ビルドで開発者ツールを有効化
