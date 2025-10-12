# ローカル認証情報の使用

EASを使用する際にローカル認証情報を設定して使用する方法を学びます。

---

通常、EASに認証情報を処理させることで、コード署名の専門家でなくても済みます。ただし、一部のユーザーは、プロジェクトのキーストア、証明書、プロファイルを独立して管理したい場合があります。

## credentials.json

ローカル認証情報の設定を選択する場合は、プロジェクトのルートに`credentials.json`ファイルを作成する必要があります。以下は例です：

```json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "paofohlooZ9e",
      "keyAlias": "keyalias",
      "keyPassword": "aew1Geuthoev"
    }
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "iex3shi9Lohl"
    }
  }
}
```

> credentials.jsonとすべての認証情報を.gitignoreに追加して、誤ってシークレットをコミットしないようにしてください。

### Android認証情報

リリースキーストアを生成するには、keytoolコマンドを使用します：

```bash
keytool \
-genkey -v \
-storetype JKS \
-keyalg RSA \
-keysize 2048 \
-validity 10000 \
-storepass KEYSTORE_PASSWORD \
-keypass KEY_PASSWORD \
-alias KEY_ALIAS \
-keystore release.keystore \
-dname "CN=com.expo.your.android.package,OU=,O=,L=,S=,C=US"
```

### iOS認証情報

前提条件には以下が含まれます：
- 有料のApple Developerアカウント
- 配布証明書
- プロビジョニングプロファイル

[Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)で生成されます

#### マルチターゲット
