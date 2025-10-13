# Android用の本番ビルドを作成

## 前提条件

Google Play Storeにアプリを公開するには、以下が必要です：
- Google Play Developer Account（有料）
- Google Service Accountキー
- `eas.json`の本番ビルドプロファイル

## Android用の本番ビルド

### 1. 本番ビルドを作成

次のコマンドを実行してAndroid本番ビルドを作成：

```bash
eas build --platform android
```

### 2. Google Play Consoleでアプリを作成

- Google Playダッシュボードに移動
- 「Create app」をクリック
- アプリの詳細を入力

### 3. 内部テストバージョンをリリース

- 「Start testing now」をクリック
- 内部テスター用のメールリストを作成
- 新しいリリースを作成
- 署名キーを選択

### 4. アプリバイナリをアップロード

- EASダッシュボードから.aabファイルをダウンロード
- Google Play Consoleにアップロード
- リリース詳細を提供
- 保存して公開

### 5. 内部リリースバージョンを共有

- 内部テスター用の招待リンクをコピー
- テスターはアプリをダウンロードしてインストールできます

### 6. Google Service Account権限キーを追加

- JSONキーをプロジェクトのルートにコピー
- `.gitignore`に追加
- サービスアカウントパスで`eas.json`を更新

### 7. 内部リリース

`eas.json`を更新：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        "track": "internal"
      }
    }
  }
}
```

実行：
```bash
eas submit --platform android
```

### 8. 本番リリース

`eas.json`のtrackを"production"に更新：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-file.json",
        "track": "production"
      }
    }
  }
}
```

実行：
```bash
eas submit --platform android
```

### 9. 自動リリース

今後のリリースには、以下を使用：

```bash
eas build --platform android --auto-submit
```

## まとめ

このガイドでは、EAS Buildを使用してAndroid本番ビルドを作成し、Google Play Storeに送信するプロセスをカバーしました。
