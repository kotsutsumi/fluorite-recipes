# iOS用の本番ビルドを作成

## 前提条件

iOSアプリを公開するには、以下が必要です：
- Apple Developer account
- `eas.json`の本番ビルドプロファイル

## 本番ビルドの手順

### 1. 配信プロビジョニングプロファイルを作成
`eas credentials`を実行して、次のプロンプトに従います：
- iOSプラットフォームを選択
- 本番ビルドプロファイルを選択
- Apple Developerアカウントにログイン
- 新しい配信証明書とプロビジョニングプロファイルを生成

### 2. 本番ビルドを作成
コマンドを実行：
```
eas build --platform ios
```

### 3. アプリバイナリを送信
次を使用してビルドを送信：
```
eas submit --platform ios
```

### 4. 内部テストバージョンをリリース
- Apple Developerアカウントにログイン
- TestFlightに移動
- テストユーザーグループを作成
- テスターを招待

### 5. App Storeに送信
- App Store Connectでメタデータを追加
- スクリーンショットを提供
- ビルドを選択
- レビューのために送信

### 6. 自動送信
今後のリリースには、以下を使用：
```
eas build --platform ios --auto-submit
```

> 注記：自動送信はTestFlightにアップロードしますが、App Storeレビューに自動的には送信しません。

## 主要なハイライト
- Apple Developerアカウントが必要
- ビルドと送信にEAS CLIを使用
- TestFlight経由の内部テストをサポート
- 手動のApp Store送信を許可
- 自動ビルドプロセスのオプションを提供
