# Prebuildの採用

React Native CLIでブートストラップされたプロジェクトでExpo Prebuildを採用する方法を学びます。

## `expo`パッケージのインストール

`npx expo prebuild`コマンドを使用するために、`expo`パッケージをインストールします：

```bash
npm install expo
```

または

```bash
yarn add expo
```

## エントリーファイルの更新

エントリーファイルを`registerRootComponent`を使用するように変更します：

```javascript
import {registerRootComponent} from 'expo';
import App from './App';

registerRootComponent(App);
```

### 変更前

```javascript
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### 変更後

```javascript
import {registerRootComponent} from 'expo';
import App from './App';

registerRootComponent(App);
```

## Prebuildの実行

以下のコマンドを実行して、AndroidとiOSディレクトリを再生成します：

```bash
npx expo prebuild --clean
```

### `--clean`フラグ

`--clean`フラグは、既存の`android`と`ios`ディレクトリを削除してから再生成します。

## ビルドのテスト

生成されたプロジェクトをテストします：

```bash
# Androidプロジェクトをビルド
npx expo run:android

# iOSプロジェクトをビルド
npx expo run:ios
```

## 追加の変更

Prebuildを完全に採用するために、以下の追加変更を推奨します：

### 1. .gitignoreの更新

`android`と`ios`ディレクトリをgitignoreに追加します：

```gitignore
# ネイティブディレクトリ
android/
ios/
```

### 2. app.jsonの変更

`app.json`にExpo設定を追加します：

```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "android": {
      "package": "com.example.myapp"
    },
    "ios": {
      "bundleIdentifier": "com.example.myapp"
    }
  }
}
```

### 3. metro.config.jsの更新

Expoのメトロ設定を使用するように更新します：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### 4. package.jsonスクリプトの変更

スクリプトをExpo CLIコマンドに更新します：

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  }
}
```

## ネイティブカスタマイズの移行

既存のネイティブカスタマイズを移行する必要があります：

### 1. 組み込みアプリ設定フィールドとの重複確認

変更が組み込みアプリ設定フィールドと重複していないか確認します。

### 2. Expo設定プラグインの検索

多くのネイティブライブラリには、Expo設定プラグインがあります。

### 3. VS Code Expo拡張機能の使用

VS Code Expo拡張機能を使用して、生成されたネイティブプロジェクトを検査します。

### 4. ローカル設定プラグインの開発

必要に応じて、ローカル設定プラグインを開発します：

```bash
npx create-expo-module@latest --local
```

## さらに機能を追加

Prebuildを採用した後、以下の機能を追加できます：

### 1. EAS Build

クラウドビルドサービスでアプリをビルドします：

```bash
npm install -g eas-cli
eas build
```

### 2. EAS Update

アプリストアを経由せずに更新を配信します：

```bash
eas update
```

### 3. Expo for web

Webサポートを追加します：

```bash
npx expo start --web
```

### 4. Expo Dev Client

開発ビルドにカスタムネイティブコードを追加します：

```bash
npx expo install expo-dev-client
```

### 5. Expo Native Module API

カスタムネイティブモジュールを作成します：

```bash
npx create-expo-module
```

## Prebuildの利点

### 1. 自動ネイティブプロジェクト生成

ネイティブプロジェクトを手動で維持する必要がありません。

### 2. アップグレードの簡素化

React Nativeバージョンのアップグレードが容易になります。

### 3. Expoネイティブモジュール開発のサポート

Expo Modules APIを使用してカスタムネイティブコードを記述できます。

### 4. 設定プラグインエコシステム

豊富な設定プラグインエコシステムを活用できます。

### 5. CI/CDの改善

EAS Buildなどのクラウドビルドサービスとシームレスに統合できます。

## まとめ

Prebuildを採用することで、ネイティブプロジェクトの管理が大幅に簡素化されます。自動生成、簡単なアップグレード、豊富なエコシステムのサポートにより、開発効率が向上します。
