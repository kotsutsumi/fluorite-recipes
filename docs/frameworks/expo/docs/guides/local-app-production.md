# ローカルで本番ビルドを作成

このガイドでは、AndroidとiOSプラットフォーム向けの本番ビルドをローカルで作成する詳細な手順を説明します。

## Android本番ビルド

### 前提条件

- **OpenJDK**: Java開発キット
- **生成されたandroidディレクトリ**: `npx expo prebuild`で生成

### 主な手順

#### 1. アップロードキーの作成

Androidアプリに署名するためのkeystoreを生成します：

```bash
sudo keytool -genkey -v -keystore my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

生成されたkeystoreを`android/app`ディレクトリに移動します：

```bash
mv my-upload-key.keystore android/app/
```

#### 2. Gradle変数の更新

`android/gradle.properties`にkeystore設定を追加します：

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

#### 3. リリースバンドルの生成

androidディレクトリに移動して、リリースバンドルをビルドします：

```bash
cd android
./gradlew app:bundleRelease
```

生成された`.aab`ファイルは以下の場所にあります：

```
android/app/build/outputs/bundle/release/app-release.aab
```

#### 4. Google Playへの手動提出

Google Play Consoleに`.aab`ファイルを手動で提出します：

1. Google Play Consoleにログイン
2. アプリを選択
3. リリース管理 → アプリリリース
4. 内部テスト、クローズドテスト、またはオープンテストを選択
5. `.aab`ファイルをアップロード

## iOS本番ビルド

### 前提条件

- **有料Apple Developer会員資格**: App Store配信に必要
- **Xcode**: macOSにインストール済み
- **生成されたiosディレクトリ**: `npx expo prebuild`で生成

### 主な手順

#### 1. XcodeでiOSワークスペースを開く

```bash
xed ios
```

このコマンドでXcodeワークスペースが開きます。

#### 2. 署名とチームの設定

Xcodeで以下を設定します：

1. プロジェクトナビゲーターでプロジェクトを選択
2. **Signing & Capabilities**タブを開く
3. **Team**を選択（Apple Developer Accountから）
4. **Automatically manage signing**にチェック

#### 3. リリーススキームの設定

1. **Product** → **Scheme** → **Edit Scheme**を選択
2. **Build Configuration**を**Release**に設定
3. **Close**をクリック

#### 4. ビルドとアーカイブ

1. **Product** → **Build**でビルド
2. **Product** → **Archive**でアーカイブ
3. アーカイブが完成したら、Organizerが自動的に開きます

#### 5. App Store Connectへの配信

1. Organizerで**Distribute App**をクリック
2. **App Store Connect**を選択
3. **Upload**を選択
4. 署名オプションを選択
5. **Upload**をクリック

#### 6. TestFlightまたはApp Storeへの提出

App Store Connectで：

1. TestFlight → 内部テストまたは外部テスト
2. または、App Store → 新規バージョンを作成

## 重要な注意事項

### 署名認証情報の管理

- **keystoreファイルを安全に保管**: バックアップを取り、安全な場所に保存
- **パスワードを記録**: keystoreとkey aliasのパスワードを安全に記録
- **バージョン管理から除外**: keystoreとパスワードをgitignoreに追加

### .gitignoreの更新

```gitignore
# Android署名
*.keystore
*.jks
gradle.properties

# iOS署名
*.mobileprovision
*.p12
```

### バージョンコードとバージョン名

`app.json`でバージョン情報を更新します：

```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "1.0.1"
    }
  }
}
```

## トラブルシューティング

### Android

#### 署名エラー

keystoreパスとパスワードが正しいか確認します。

#### ビルドエラー

Gradleキャッシュをクリアします：

```bash
cd android
./gradlew clean
```

### iOS

#### 署名エラー

Apple Developer Accountのステータスを確認し、証明書が有効か確認します。

#### アーカイブエラー

Xcodeのキャッシュをクリアします：

```bash
# Derived Dataをクリア
rm -rf ~/Library/Developer/Xcode/DerivedData
```

## まとめ

ローカルでの本番ビルド作成は、アプリの配信プロセスを完全に制御できる方法です。署名認証情報を安全に管理し、プラットフォーム固有の提出プロセスに従うことで、スムーズな配信が実現できます。
