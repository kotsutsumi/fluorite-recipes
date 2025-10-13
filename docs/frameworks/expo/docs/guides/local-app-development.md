# ローカルアプリ開発

## 前提条件

Expoアプリをローカルでビルドするには、以下をインストールして設定する必要があります：

### Android開発

- **Android Studio**: Androidアプリのビルドに必要
- **Java Development Kit (JDK)**: Android開発に必要

### iOS開発（macOSのみ）

- **Xcode**: iOSアプリのビルドに必要
- **CocoaPods**: iOSの依存関係管理

## ローカルアプリコンパイル

Expo CLIコマンドを使用してプロジェクトをローカルでビルドします：

```bash
# ネイティブAndroidプロジェクトをビルド
npx expo run:android

# ネイティブiOSプロジェクトをビルド
npx expo run:ios
```

### 主なポイント

#### 自動ディレクトリ生成

これらのコマンドは、`android`と`ios`ディレクトリを自動的に生成します（存在しない場合）。

#### デバイスの指定

`--device`フラグで特定のデバイスを指定できます：

```bash
# 特定のAndroidデバイスで実行
npx expo run:android --device <device-name>

# 特定のiOSデバイスで実行
npx expo run:ios --device <device-name>
```

#### リリースビルド

リリースバリアントをビルドできます：

```bash
# Androidリリースビルド
npx expo run:android --variant release

# iOSリリースビルド
npx expo run:ios --configuration Release
```

#### デバッグ最適化ビルド（Android）

Androidでは、より高速な開発のために`debugOptimized`バリアントをサポートしています：

```bash
npx expo run:android --variant debugOptimized
```

## expo-dev-clientを使用したローカルビルド

`expo-dev-client`をインストールして、開発UIとツールを含めます：

```bash
npx expo install expo-dev-client
```

### expo-dev-clientの利点

#### 1. カスタム開発クライアント

カスタムネイティブコードを含む開発ビルドを作成できます。

#### 2. 開発ツール

デバッグツール、エラーハンドリング、開発メニューを提供します。

#### 3. Expo Goの制限を克服

Expo Goではサポートされていないネイティブライブラリを使用できます。

## Android Product Flavorsを使用したローカルビルド

SDK 52以降では、特定のAndroid Product Flavorsを使用したビルドをサポートしています：

### Product Flavorsの設定

`app.json`でProduct Flavorsを設定します：

```json
{
  "expo": {
    "android": {
      "productFlavors": {
        "free": {
          "applicationId": "dev.expo.myapp.free"
        },
        "paid": {
          "applicationId": "dev.expo.myapp.paid"
        }
      }
    }
  }
}
```

### Product Flavorsでビルド

特定のProduct Flavorでビルドします：

```bash
# freeバリアントをビルド
npx expo run:android --variant freeDebug

# paidバリアントをビルド
npx expo run:android --variant paidDebug
```

### 特定のアプリIDで起動

```bash
# 特定のアプリIDで起動
npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free
```

## EASを使用したローカルビルド

カスタムインフラストラクチャまたはローカルでビルドを実行することもサポートしています。

### ローカルEASビルド

```bash
# ローカルでEASビルドを実行
eas build --local
```

### カスタムビルドワーカー

独自のビルドワーカーを設定して、EASビルドをカスタムインフラストラクチャで実行できます。

## ビルドキャッシュ

ビルドを高速化するために、キャッシュを使用できます：

### Androidキャッシュ

Gradleキャッシュは自動的に使用されます。

### iOSキャッシュ

CocoaPodsキャッシュは自動的に使用されます。

## トラブルシューティング

### 一般的な問題と解決策

#### 1. Android Studioが見つからない

環境変数`ANDROID_HOME`を設定します：

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 2. Xcodeコマンドラインツールが見つからない

Xcodeコマンドラインツールをインストールします：

```bash
xcode-select --install
```

#### 3. 依存関係のインストールエラー

キャッシュをクリアして再インストールします：

```bash
# Androidの場合
cd android && ./gradlew clean && cd ..

# iOSの場合
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

#### 4. ビルドエラー

クリーンビルドを実行します：

```bash
# Androidクリーンビルド
npx expo run:android --no-build-cache

# iOSクリーンビルド
npx expo run:ios --no-build-cache
```

## まとめ

ローカルアプリ開発は、Expoアプリをより細かく制御し、カスタムネイティブコードを統合するための強力な方法です。Android StudioとXcodeを適切に設定し、Expo CLIコマンドを使用することで、効率的な開発ワークフローを実現できます。
