# Android App Linksの設定

Android App Linksを設定するには、Webサイトとアプリの間に双方向の関連付けを確立する必要があります。

## 主要な手順

### 1. アプリ設定にintentFiltersを追加

`app.json`に`android.intentFilters`を追加します：

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.webapp.io",
              "pathPrefix": "/records"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 設定の説明

- **`action`**: `VIEW`アクション（コンテンツの表示）
- **`autoVerify`**: `true`に設定してApp Linksを有効化
- **`scheme`**: `https`を使用（セキュアな接続）
- **`host`**: ドメイン（ワイルドカード`*.webapp.io`も使用可能）
- **`pathPrefix`**: 特定のパスプレフィックス（例: `/records`）
- **`category`**: `BROWSABLE`（ブラウザから開ける）と`DEFAULT`

## 2. Webサイトとの双方向関連付け

### assetlinks.jsonファイルの作成

Webサイトに`assetlinks.json`ファイルを作成します：

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ]
  }
}]
```

### 含める情報

1. **`package_name`**: Androidアプリのパッケージ名
2. **`sha256_cert_fingerprints`**: アプリの署名証明書のSHA256フィンガープリント

### SHA256フィンガープリントの取得

```bash
# Keystoreファイルから取得
keytool -list -v -keystore my-release-key.keystore

# Google Play Consoleからも取得可能
```

### ファイルのホスティング

`assetlinks.json`ファイルは、HTTPSを使用してWebサイトにホストする必要があります：

```
https://webapp.io/.well-known/assetlinks.json
```

## デバッグ

### Expo CLIのトンネル機能を使用

```bash
# トンネルフラグを使用
npx expo start --tunnel

# 環境変数でサブドメインを設定
EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel
```

### adbコマンドでテスト

```bash
# App Linksをテスト
adb shell am start -W -a android.intent.action.VIEW -d "https://webapp.io/records" com.example.myapp
```

## トラブルシューティング

### 一般的な問題と解決策

#### 1. HTTPSウェブサイトの確認

App LinksはHTTPSを必要とします。WebサイトがHTTPSで提供されていることを確認してください。

#### 2. Android App Linksの検証

```bash
# adbでApp Linksを検証
adb shell pm get-app-links com.example.myapp
```

#### 3. Webファイル更新後のアプリ再ビルド

`assetlinks.json`を更新した後は、アプリを再ビルドして変更を反映させてください。

#### 4. ドメイン検証の確認

Androidは自動的にドメインを検証します。検証が失敗する場合は、以下を確認してください：

- `assetlinks.json`が正しい場所にある
- HTTPSでアクセス可能
- JSON形式が正しい
- パッケージ名とフィンガープリントが一致

## まとめ

Android App Linksは、通常のHTTPSリンクを使用してアプリを開く強力な機能です。適切に設定することで、ユーザーはWebリンクをクリックするだけでアプリ内の特定のコンテンツにアクセスできます。
