# iOS Universal Linksの設定

iOS Universal Linksを設定するには、WebサイトとiOSアプリの間に関連付けを確立する必要があります。

## 設定の主要な手順

### 1. Apple App Site Association（AASA）ファイルの作成

`public/.well-known/apple-app-site-association`にAASAファイルを作成します：

```json
{
  "applinks": {
    "details": [{
      "appID": "QQ57RJ5UTD.com.example.myapp",
      "paths": ["/records/*"]
    }]
  }
}
```

### AASAファイルの構造

- **`appID`**: Apple Team IDとバンドル識別子を組み合わせた形式（`TEAM_ID.BUNDLE_ID`）
- **`paths`**: サポートするパス（ワイルドカード使用可能）

### Apple Team IDの確認

Apple Team IDは、Apple Developer Accountから確認できます：

1. [Apple Developer Account](https://developer.apple.com/account)にログイン
2. Membership詳細でTeam IDを確認

### パスパターンの例

```json
{
  "applinks": {
    "details": [{
      "appID": "QQ57RJ5UTD.com.example.myapp",
      "paths": [
        "/records/*",        // /recordsで始まるすべてのパス
        "/products/*/details", // 特定のパターン
        "NOT /admin/*"       // 除外パターン
      ]
    }]
  }
}
```

## 2. AASAファイルのホスティング

AASAファイルは、**HTTPS**を使用してWebサイトにホストする必要があります：

```
https://expo.dev/.well-known/apple-app-site-association
```

### 重要な要件

- **HTTPSが必須**
- **Content-Type**: `application/json`
- **ファイル拡張子なし**（`.json`は不要）
- **ルートドメインまたは`.well-known`ディレクトリに配置**

## 3. ネイティブアプリの設定

`app.json`に`associatedDomains`を追加します：

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:expo.dev"]
    }
  }
}
```

### 複数のドメインをサポート

```json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:expo.dev",
        "applinks:www.expo.dev",
        "applinks:staging.expo.dev"
      ]
    }
  }
}
```

## 追加機能

### Apple Smart Bannerの設定

WebサイトのHTMLの`<head>`タグにメタタグを追加します：

```html
<meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
```

これにより、Safariでアプリへのスマートバナーが表示されます。

### iTunes App IDの確認

App Store Connectからアプリの数値IDを確認できます。

## デバッグとテスト

### ローカルテストにトンネル機能を使用

```bash
# Expo CLIのトンネル機能
EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel
```

### AASAファイルの検証

以下のツールでAASAファイルを検証できます：

- [Apple App Site Association Validator](https://branch.io/resources/aasa-validator/)
- [Universal Links Validator](https://limitless-sierra-4673.herokuapp.com/)

### デバッグのヒント

#### 1. HTTPSウェブサイトの確認

Universal LinksはHTTPSを必要とします。

#### 2. AASAファイルの検証

```bash
# curlでAASAファイルを確認
curl -I https://expo.dev/.well-known/apple-app-site-association
```

#### 3. Webファイル更新後のアプリ再ビルド

AASAファイルを更新した後は、アプリを再ビルドしてください。

#### 4. iOSキャッシュのクリア

iOSはAASAファイルをキャッシュします。デバイスを再起動してキャッシュをクリアできます。

## トラブルシューティング

### Universal Linksが機能しない場合

1. **AASAファイルがHTTPSでアクセス可能か確認**
2. **appIDが正しいか確認**（Team ID + Bundle ID）
3. **パスパターンが正しいか確認**
4. **アプリを再ビルド**
5. **デバイスを再起動してキャッシュをクリア**

### デバイスでのテスト

- Safariでリンクを長押しして「開く」オプションを確認
- メモアプリにリンクを貼り付けてタップ
- メールからリンクをタップ

## まとめ

iOS Universal Linksは、通常のHTTPSリンクを使用してアプリを開く強力な機能です。適切に設定することで、ユーザーはWebリンクをクリックするだけでアプリ内の特定のコンテンツにシームレスにアクセスできます。
