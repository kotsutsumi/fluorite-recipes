# AndroidアプリをGoogle Play Storeに送信

ExpoとEAS Submitを使用してAndroidアプリをGoogle Play Storeに送信する方法を説明します。

## 前提条件

送信前に以下の準備が必要です：

1. **Google Play開発者アカウントの作成**
2. **Google Play Consoleでアプリを作成**
3. **Google Service Account Keyの作成**
4. **EAS CLIのインストールと認証**
5. **app.jsonにパッケージ名を追加**
6. **本番環境用アプリのビルド**
7. **最低1回の手動アップロード**

## パッケージ名の設定

`app.json`にパッケージ名を追加します：

```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

## Service Accountの設定

`eas.json`でService Accountを設定します：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json"
      }
    }
  }
}
```

## 送信方法

### コンピューターから送信

```bash
eas submit --platform android
```

### EAS Workflows（CI/CD）を使用

```yaml
jobs:
  build_android:
    platform: android
    profile: production
  submit_android:
    needs: [build_android]
    platform: android
```

### その他のCI/CDサービスを使用

```bash
eas submit --platform android --profile production
```

## オプション：自動送信

ビルド後に自動的に送信するには、`--auto-submit`フラグを使用します：

```bash
eas build --platform android --auto-submit
```

## 重要な注意事項

- 初回送信は必ず手動で行う必要があります
- Service Account Keyは安全に保管してください
- ソースコントロールにキーファイルをコミットしないでください
- Google Play Consoleで適切なトラック（internal/alpha/beta/production）を選択してください
