# EAS Buildで最初のビルドを作成

## 前提条件

EAS Buildでビルドを作成するには、以下が必要です：
- React Native Android/iOSプロジェクト
- Expoユーザーアカウント
- 最新のEAS CLIがインストールされていること

### 新しいプロジェクトの作成
```terminal
npx create-expo-app my-app
```

## セットアップ手順

### 1. EAS CLIのインストール
```terminal
npm install -g eas-cli
```

### 2. Expoアカウントへのログイン
```terminal
eas login
```

### 3. プロジェクトの設定
```terminal
eas build:configure
```

### 4. ビルドの実行

#### ビルドオプション
- Androidエミュレーター/デバイスビルド
- iOSシミュレータービルド
- App Storeビルド

#### Androidビルドコマンド
```terminal
eas build --platform android
```

#### iOSビルドコマンド
```terminal
eas build --platform ios
```

### 5. ビルド完了を待つ
- CLIまたはWebダッシュボードでビルドの進捗を監視
- ビルドログとステータスを確認

### 6. ビルドのデプロイ
- アプリストア向け：EAS Submitを使用
- 直接インストール：ビルドダッシュボードの「Install」ボタンを使用

## 次のステップ
- `eas.json`の設定
- 内部配布について学ぶ
- アップデートと提出の自動化を探索

## 重要な注意事項
- アプリストアには開発者アカウントが必要
- Google Play：$25の一度限りの料金
- Apple Developer Program：$99の年間メンバーシップ
