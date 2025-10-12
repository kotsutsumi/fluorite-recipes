# React Native CLIからExpo CLIへの移行

React Native CLIからExpo CLIに移行する方法を説明します。

## 移行の主な手順

### 1. Expoパッケージのインストール

```bash
npx install-expo-modules@latest
```

このコマンドは、プロジェクトにExpoモジュールをインストールし、必要な設定を自動的に行います。

## Expo CLIの利点

Expo CLIは、React Native CLIに比べていくつかの利点があります：

### 1. インスタントHermesデバッガー

Hermesデバッガーに即座にアクセスできます。

### 2. React Native DevTools統合

React Native DevToolsとシームレスに統合されています。

### 3. Continuous Native Generation（CNG）サポート

ネイティブプロジェクトを動的に生成できます。

### 4. Expo Routerによるファイルベースルーティング

ファイルベースルーティングシステムを使用できます。

### 5. 組み込み環境変数サポート

環境変数を簡単に管理できます。

### 6. 改善されたネイティブログフォーマット

ネイティブログがより読みやすくなります。

### 7. ファーストクラスのTypeScriptサポート

TypeScriptがデフォルトでサポートされています。

### 8. Webサポート

Webプラットフォームをサポートしています。

### 9. モノレポサポート

モノレポ構成をサポートしています。

## アプリのコンパイルと実行

React Native CLIコマンドの代わりに、以下のコマンドを使用します：

### Android

#### React Native CLI（旧）

```bash
npx react-native run-android
```

#### Expo CLI（新）

```bash
npx expo run:android
```

### iOS

#### React Native CLI（旧）

```bash
npx react-native run-ios
```

#### Expo CLI（新）

```bash
npx expo run:ios
```

### 追加オプション

#### 特定のデバイスで実行

```bash
# Android
npx expo run:android --device

# iOS
npx expo run:ios --device
```

#### リリースビルド

```bash
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```

## よくある質問

### Q: Expo Modules APIはどのようにインストールされますか？

A: Expo Modules APIは`expo`パッケージとともにインストールされます。

### Q: out-of-treeプラットフォーム（macOS/Windows）で使用できますか？

A: はい、可能です。Expo CLIはout-of-treeプラットフォームもサポートしています。

### Q: 既存のReact Native CLIコマンドは引き続き機能しますか？

A: はい、機能しますが、Expo CLIコマンドの使用を推奨します。

### Q: Expo Goは必要ですか？

A: いいえ、Bare React Nativeプロジェクトでは不要です。開発ビルドを作成できます。

## 推奨される次のステップ

### 1. Expo CLIリファレンスの探索

[Expo CLI Reference](/more/expo-cli)を参照してください。

### 2. Metroバンドラーのカスタマイズ

`metro.config.js`を使用してMetroをカスタマイズします：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### 3. Prebuildの採用

Continuous Native Generation（CNG）を使用します：

```bash
npx expo prebuild
```

### 4. Expo SDKの使用

Expo SDKライブラリをインストールします：

```bash
npx expo install expo-camera expo-location
```

### 5. Expo Routerの試用

ファイルベースルーティングを使用します：

```bash
npx expo install expo-router
```

## コマンド比較

### 開発サーバーの起動

| React Native CLI | Expo CLI |
|-----------------|----------|
| `npx react-native start` | `npx expo start` |

### アプリの実行

| プラットフォーム | React Native CLI | Expo CLI |
|--------------|-----------------|----------|
| Android | `npx react-native run-android` | `npx expo run:android` |
| iOS | `npx react-native run-ios` | `npx expo run:ios` |

### ログの表示

| プラットフォーム | React Native CLI | Expo CLI |
|--------------|-----------------|----------|
| Android | `npx react-native log-android` | `npx expo run:android` (ログは自動表示) |
| iOS | `npx react-native log-ios` | `npx expo run:ios` (ログは自動表示) |

## Expo CLIの追加機能

### インタラクティブモード

Expo CLIはインタラクティブモードを提供します：

```bash
npx expo start
```

以下のキーを押すことで、さまざまなアクションを実行できます：

- `a`: Androidエミュレーターで開く
- `i`: iOSシミュレーターで開く
- `w`: Webブラウザで開く
- `r`: アプリをリロード
- `m`: Developer Menuを切り替え

### 環境変数

`.env`ファイルを使用して環境変数を管理できます：

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
```

コードで使用：

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## トラブルシューティング

### Expo CLIコマンドが見つからない

#### 解決策

グローバルにインストールされた`expo-cli`を削除します：

```bash
npm uninstall -g expo-cli
```

Expo CLIは`expo`パッケージに含まれています。

### ポートが使用中

#### 解決策

別のポートを指定します：

```bash
npx expo start --port 19001
```

## まとめ

Expo CLIは、Android、iOS、Webプラットフォームを対象とするほとんどのReact Nativeプロジェクトに推奨されます。React Native CLIに比べて多くの利点があり、開発エクスペリエンスを大幅に向上させます。
