# 既存のReact Nativeプロジェクトにexpo-dev-clientをインストール

既存のReact Nativeプロジェクトに`expo-dev-client`をインストールする方法を説明します。

## 前提条件

- **`expo`パッケージがインストールされている必要があります**
- React Native CLIで作成されたプロジェクトで、Expoライブラリがない場合は、[Expoモジュールをインストール](/bare/installing-expo-modules)してください

## 1. expo-dev-clientのインストール

ターミナルで以下のコマンドを実行します：

```bash
npx expo install expo-dev-client
```

iOSプロジェクトの場合は、ポッドをインストールします：

```bash
npx pod-install
```

## 2. ディープリンクの設定

`uri-scheme`を使用してディープリンクスキームを追加します：

### 現在のスキームをリスト表示

```bash
npx uri-scheme list
```

### スキームの追加

```bash
npx uri-scheme add your-scheme
```

例：

```bash
npx uri-scheme add myapp
```

これにより、`myapp://`というカスタムURLスキームが追加されます。

### スキームの確認

#### Android

`android/app/src/main/AndroidManifest.xml`を確認：

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="myapp"/>
</intent-filter>
```

#### iOS

`ios/YourApp/Info.plist`を確認：

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

## 3. アプリのビルドとインストール

デバッグビルドを作成します。以下の方法のいずれかを使用します：

### オプション1: ローカルExpo CLI

#### Android

```bash
npx expo run:android
```

#### iOS

```bash
npx expo run:ios
```

### オプション2: クラウドでEAS Build

#### EAS CLIのインストール

```bash
npm install -g eas-cli
```

#### EASプロジェクトの設定

```bash
eas build:configure
```

#### 開発ビルドの作成

```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

`eas.json`の例：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 開発ビルドの使用

### 開発サーバーの起動

```bash
npx expo start --dev-client
```

### デバイスまたはシミュレーターで開く

開発ビルドを起動し、開発サーバーに接続します。

### アプリのリロード

コードを変更すると、Fast Refreshが自動的に適用されます。

## 開発ビルドの機能

### 1. カスタムネイティブコード

カスタムネイティブコードを含めることができます。

### 2. 開発ツール

- React Native Debugger
- React DevTools
- Element Inspector

### 3. エラーハンドリング

開発中のエラーを視覚的に表示します。

### 4. Fast Refresh

コンポーネントの状態を保持したまま、コードの変更を即座に反映します。

## 追加の注意事項

### 新しいプロジェクト

新しいプロジェクトの場合は、以下のコマンドを使用します：

```bash
npx create-expo-app -e with-dev-client
```

### Continuous Native Generation（CNG）を使用するプロジェクト

CNGを使用するプロジェクトの場合は、[Create a development build](/develop/development-builds/create-a-build)を参照してください。

## トラブルシューティング

### 開発ビルドが起動しない

#### 確認事項

1. **ディープリンクスキームが正しく設定されているか**
2. **開発サーバーが実行中か**
3. **デバイスとコンピューターが同じネットワークにあるか**

### 接続エラー

#### 解決策

1. **ファイアウォール設定を確認**
2. **ポート19000が開いているか確認**
3. **開発サーバーを再起動**

```bash
npx expo start --dev-client --clear
```

### ビルドエラー

#### Android

```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

#### iOS

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx expo run:ios
```

## ベストプラクティス

### 1. 開発ビルドを定期的に更新

依存関係を更新した後は、開発ビルドを再ビルドしてください。

### 2. ディープリンクスキームを文書化

チームメンバーがディープリンクスキームを知っているようにしてください。

### 3. EAS Buildでビルドを自動化

CI/CDパイプラインにEAS Buildを統合してください。

## 次のステップ

### 1. カスタムネイティブモジュールの追加

Expo Modules APIを使用してネイティブモジュールを作成します：

```bash
npx create-expo-module@latest --local
```

### 2. EAS Updateの設定

開発ビルドでEAS Updateを使用します：

```bash
npx expo install expo-updates
eas update:configure
```

### 3. 開発ビルドの配布

TestFlightやInternal App Sharingを使用してチームに配布します。

## まとめ

`expo-dev-client`をReact Nativeプロジェクトに統合することで、カスタムネイティブコードを含む開発ビルドを作成できます。開発ツールとエラーハンドリングにより、開発エクスペリエンスが大幅に向上します。
