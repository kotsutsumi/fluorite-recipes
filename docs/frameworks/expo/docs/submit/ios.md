# iOSアプリをApple App Storeに送信

ExpoとEAS Submitを使用してiOSアプリをApple App Storeに送信する方法を説明します。

## 前提条件

送信前に以下の準備が必要です：

1. **Apple Developer アカウント**
2. **app.jsonにBundle Identifierを設定**
3. **EAS CLIのインストールと認証**
4. **本番環境用アプリのビルド**

## 送信方法

### ローカルコンピューターから送信

基本的な送信コマンド：

```bash
eas submit --platform ios
```

`eas.json`で送信プロファイルを設定できます：

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

オプション：`--auto-submit`フラグで自動送信：

```bash
eas build --platform ios --auto-submit
```

### CI/CDサービスを使用

#### App Store Connect APIキーの設定

1. App Store Connect APIキーを作成
2. `eas.json`で送信プロファイルを設定
3. EAS WorkflowsまたはCI/CDプラットフォームで使用
4. `EXPO_TOKEN`環境変数が必要

#### EAS Workflowsの例

```yaml
jobs:
  build_ios:
    platform: ios
    profile: production
  submit_ios:
    needs: [build_ios]
    platform: ios
```

## 手動送信オプション

Apple Transporterアプリを使用した手動送信も可能です：

1. Apple Transporterアプリをダウンロード
2. IPAファイルを手動でApp Store Connectにアップロード
3. App Store Connectでアプリエントリーを事前に作成

## Bundle Identifierの設定

`app.json`にBundle Identifierを追加：

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

## 送信後

- ビルドはTestFlightで利用可能になります
- 本番環境への送信はApp Store Connect経由で手動で行います
- App Store Connectで追加のメタデータと説明を設定します

## 重要な注意事項

- Apple Developerアカウントが必要（年間$99）
- 初回送信前にApp Store Connectでアプリを作成
- TestFlightでのテストを推奨
- 本番リリースにはAppleの審査プロセスが必要
