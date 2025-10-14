# Expo CLI

## 概要

Expo CLIは、Expoツールを使用する開発者向けの主要なコマンドラインインターフェースです。プロジェクトの作成、開発サーバーの起動、ビルドの実行、デプロイなど、Expo開発ワークフローのあらゆる側面を管理できます。

## インストール

Expo CLIは、プロジェクトごとにインストールする必要はありません。`npx`を使用して、最新バージョンを常に実行できます。

```bash
npx expo --version
```

### グローバルインストール（オプション）

頻繁に使用する場合は、グローバルにインストールすることもできます：

```bash
npm install -g expo-cli
```

## コアコマンド

### 開発サーバーの起動

```bash
npx expo start
```

開発サーバーを起動し、以下のオプションが利用可能になります：

- Expo Go アプリでの実行
- Development builds での実行
- iOS シミュレーターでの実行
- Android エミュレーターでの実行
- Web ブラウザでの実行

#### オプション

```bash
npx expo start --clear        # キャッシュをクリアして起動
npx expo start --offline      # オフラインモードで起動
npx expo start --web          # Webブラウザで起動
npx expo start --ios          # iOSシミュレーターで起動
npx expo start --android      # Androidエミュレーターで起動
```

#### ターミナルUIショートカット

開発サーバー実行中に使用できるキーボードショートカット：

- `a` - Androidデバイス/エミュレーターで開く
- `i` - iOSシミュレーターで開く
- `w` - Webブラウザで開く
- `r` - アプリをリロード
- `m` - メニューの表示/非表示を切り替え
- `j` - React DevToolsを開く
- `c` - ログをクリア
- `?` - すべてのコマンドを表示

### ネイティブディレクトリの生成（Prebuild）

```bash
npx expo prebuild
```

ネイティブの`android`と`ios`ディレクトリを生成します。これにより、ネイティブコードのカスタマイズが可能になります。

#### オプション

```bash
npx expo prebuild --clean      # 既存のディレクトリを削除して再生成
npx expo prebuild --platform ios   # iOSのみ生成
npx expo prebuild --platform android   # Androidのみ生成
```

### ネイティブアプリのビルドと実行

#### iOS

```bash
npx expo run:ios
```

iOSアプリをコンパイルしてシミュレーターまたは接続されたデバイスで実行します。

##### オプション

```bash
npx expo run:ios --device          # 物理デバイスで実行
npx expo run:ios --configuration Release   # Releaseビルドで実行
npx expo run:ios --scheme YourScheme       # 特定のスキームを指定
```

#### Android

```bash
npx expo run:android
```

Androidアプリをコンパイルしてエミュレーターまたは接続されたデバイスで実行します。

##### オプション

```bash
npx expo run:android --device         # 物理デバイスで実行
npx expo run:android --variant release    # Releaseバリアントで実行
npx expo run:android --port 8081          # カスタムポートを指定
```

### パッケージのインストール

```bash
npx expo install package-name
```

互換性のあるバージョンのパッケージをインストールします。Expo SDKのバージョンと互換性のある依存関係のバージョンを自動的に選択します。

#### 例

```bash
npx expo install react-native-screens react-native-safe-area-context
```

#### バージョン検証と修正

```bash
npx expo install --check     # 互換性の問題をチェック
npx expo install --fix       # 互換性の問題を自動修正
```

### プロダクションビルドのエクスポート

```bash
npx expo export
```

JavaScriptとアセットを本番用にバンドルします。

#### オプション

```bash
npx expo export --platform ios        # iOSのみエクスポート
npx expo export --platform android    # Androidのみエクスポート
npx expo export --output-dir ./dist   # 出力ディレクトリを指定
npx expo export --clear               # キャッシュをクリア
```

## 認証コマンド

### アカウント登録

```bash
npx expo register
```

新しいExpoアカウントを作成します。

### ログイン

```bash
npx expo login
```

Expoアカウントにログインします。

#### オプション

```bash
npx expo login --username your-username
npx expo login --username your-username --password your-password
```

### 現在のユーザー確認

```bash
npx expo whoami
```

現在ログインしているアカウントを表示します。

### ログアウト

```bash
npx expo logout
```

現在のセッションからログアウトします。

## プロジェクト情報コマンド

### プロジェクト設定の表示

```bash
npx expo config
```

現在のプロジェクト設定を表示します（`app.json`または`app.config.js`から）。

#### オプション

```bash
npx expo config --type public    # 公開設定のみ表示
npx expo config --type prebuild  # prebuild設定を表示
npx expo config --type introspect # すべての設定を表示
```

### 依存関係の診断

```bash
npx expo doctor
```

プロジェクトの依存関係の問題を診断し、修正方法を提案します。

#### オプション

```bash
npx expo doctor --fix        # 自動的に問題を修正
npx expo doctor --fix-dependencies   # 依存関係の問題のみ修正
```

## カスタマイズコマンド

### Config Pluginsの管理

```bash
npx expo customize
```

ネイティブ設定ファイル（`Info.plist`、`AndroidManifest.xml`など）をカスタマイズします。

### アイコンとスプラッシュスクリーンの生成

```bash
npx expo prebuild --clean
```

`app.json`の設定に基づいて、アイコンとスプラッシュスクリーンを自動生成します。

## 環境変数

Expo CLIの動作をカスタマイズするための環境変数：

### 一般的な環境変数

```bash
# オフラインモード
EXPO_OFFLINE=1

# デバッグログ
DEBUG=expo:*

# CI環境での実行
CI=1

# テレメトリの無効化
EXPO_NO_TELEMETRY=1

# カスタムMetroポート
RCT_METRO_PORT=8082

# カスタムAPI URL
EXPO_API_URL=https://custom-api.expo.dev
```

### プラットフォーム固有の環境変数

#### iOS

```bash
# iOSシミュレーターの指定
EXPO_IOS_SIMULATOR=iPhone 14 Pro

# Xcodeのビルド設定
EXPO_XCODE_BUILD_CONFIGURATION=Release
```

#### Android

```bash
# Androidエミュレーターの指定
EXPO_ANDROID_EMULATOR=Pixel_5_API_31

# Gradleの設定
EXPO_ANDROID_GRADLE_PROPERTIES=org.gradle.jvmargs=-Xmx4096m
```

### 開発サーバーの設定

```bash
# カスタム開発サーバーURL
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Webpack DevServerの設定
EXPO_WEBPACK_DEV_SERVER_PORT=19006

# Metro Bundlerの設定
EXPO_METRO_CACHE_ENABLED=1
```

## テレメトリ

Expo CLIは、ツールの改善のために匿名の使用状況データを収集します。

### テレメトリの無効化

```bash
export EXPO_NO_TELEMETRY=1
```

または、`~/.expo/settings.json`で設定：

```json
{
  "telemetry": false
}
```

### 収集されるデータ

- コマンドの使用頻度
- エラーレポート（個人情報は含まれません）
- パフォーマンスメトリクス
- 使用されているパッケージバージョン

## デバッグとトラブルシューティング

### デバッグモード

```bash
DEBUG=expo:* npx expo start
```

詳細なデバッグログを表示します。

### キャッシュのクリア

```bash
npx expo start --clear
```

Metro Bundlerのキャッシュをクリアします。

### 依存関係の問題を修正

```bash
npx expo doctor --fix
```

### よくある問題

#### ポートが既に使用されている

```bash
npx expo start --port 8082
```

#### ネイティブモジュールの問題

```bash
npx expo prebuild --clean
cd ios && pod install
cd android && ./gradlew clean
```

#### 環境のリセット

```bash
rm -rf node_modules
rm -rf ios android .expo
npm install
npx expo prebuild --clean
```

## CI/CD統合

### GitHub Actions

```yaml
name: Expo CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx expo export --platform all
```

### GitLab CI

```yaml
image: node:18

stages:
  - build

build:
  stage: build
  script:
    - npm install
    - npx expo export --platform all
  artifacts:
    paths:
      - dist/
```

## ベストプラクティス

### 1. バージョン固定

`package.json`でExpo SDKのバージョンを固定します：

```json
{
  "dependencies": {
    "expo": "~49.0.0"
  }
}
```

### 2. npxの使用

グローバルインストールの代わりに`npx`を使用して、常に最新のCLIを使用します。

### 3. Development Buildsの使用

本番レベルのアプリには、Expo Goの代わりにDevelopment Buildsを使用します。

### 4. 環境変数の管理

機密情報は環境変数を使用し、`.env`ファイルを`.gitignore`に追加します。

### 5. プリビルドの定期的な実行

ネイティブ依存関係を追加した後は、必ず`npx expo prebuild`を実行します。

## リソース

- [Expo CLI GitHub リポジトリ](https://github.com/expo/expo/tree/main/packages/@expo/cli)
- [Expo ドキュメント](https://docs.expo.dev/)
- [Expo Forums](https://forums.expo.dev/)
- [Discord コミュニティ](https://chat.expo.dev/)

## まとめ

Expo CLIは、Expo開発ワークフローの中心的なツールです。このガイドで説明した基本的なコマンドとオプションをマスターすることで、効率的にExpoアプリケーションを開発、テスト、デプロイできます。

さらなる詳細や高度な使用方法については、公式ドキュメントを参照してください。
