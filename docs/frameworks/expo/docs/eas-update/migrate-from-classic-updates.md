# Classic UpdatesからEAS Updateへの移行

## 前提条件

EAS Updateには以下が必要：
- Expo SDK >= 45.0.0
- Expo CLI >= 5.3.0
- EAS CLI >= 0.50.0
- expo-updates >= 0.13.0

## EAS CLIのインストール

### 1. EAS CLIのインストール

```bash
npm install --global eas-cli
```

### 2. Expoアカウントでログイン

```bash
eas login
```

## プロジェクトの設定

### 1. EAS Updateでプロジェクトを初期化

```bash
eas update:configure
```

### 2. アプリ設定から`expo.sdkVersion`を削除

### 3. `eas.json`を更新して`channel`プロパティを含める

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

## 新しいビルドの作成

設定変更を適用するために新しいビルドを作成します。

## アップデートの公開

以下を使用してアップデートを公開：

```bash
eas update --channel [channel-name] --message [message]
```

## 追加の移行手順

- `expo publish`を`eas update`に置き換え
- `Updates.releaseChannel`を`Updates.channel`に置き換え
- `Constants.manifest`への参照を削除

## 詳細情報

- [EAS Updateの仕組み](/frameworks/expo/docs/eas-update/how-it-works)
- [デプロイメントパターン](/frameworks/expo/docs/eas-update/deployment-patterns)

> SDK 49はClassic Updatesをサポートする最後のバージョンでした。
