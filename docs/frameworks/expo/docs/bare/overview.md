# 既存のReact NativeアプリでExpoを使用する概要

既存のReact NativeプロジェクトでExpoツールとサービスを段階的に採用する方法を説明します。

## 前提条件

Expoを既存のReact Nativeアプリに統合する前に、以下が必要です：

### 1. Expoモジュールのインストール

```bash
npx install-expo-modules@latest
```

### 2. Expo CLIの使用

React Native CLIの代わりにExpo CLIを使用します：

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

## 採用フェーズ

Expoの採用は、4つのフェーズに分けられます。

### フェーズ1: クイックウィン

すぐに利益が得られる基本的な統合：

#### 1. Expo SDKライブラリの使用

Expo SDKライブラリをインストールして使用します：

```bash
npx expo install expo-camera expo-location
```

#### 2. `expo-dev-client`のインストール

開発ビルドのための開発クライアントをインストールします：

```bash
npx expo install expo-dev-client
npx expo run:android
# または
npx expo run:ios
```

#### 3. ネイティブモジュールの記述

Expo Modules APIを使用してネイティブモジュールを簡単に記述できます。

#### 4. ネイティブプロジェクトアップグレードヘルパーの使用

ネイティブプロジェクトをアップグレードするためのツールを使用します。

### フェーズ2: 新しいワークフロー

より高度な機能を採用：

#### 1. アプリ配布

EAS Buildを使用してアプリを配布します：

```bash
npm install -g eas-cli
eas build
```

#### 2. `expo-updates`のインストール

リモート更新のための`expo-updates`をインストールします：

```bash
npx expo install expo-updates
```

### フェーズ3: 新しいマインドセット

開発アプローチを変更：

#### 1. Prebuildの採用

Continuous Native Generation（CNG）を使用してネイティブプロジェクトを管理します：

```bash
npx expo prebuild
```

#### 2. Expo Routerの使用

ファイルベースルーティングを使用します：

```bash
npx expo install expo-router
```

### フェーズ4: フルExpo

Expoの全機能を活用します。

## 主な利点

Expoを採用することで得られるメリット：

### 1. 改善された開発エクスペリエンス

- Fast Refresh
- React Native DevTools
- Hermesデバッガー

### 2. プロフェッショナルなCI/CDワークフロー

- EAS Build: クラウドビルドサービス
- EAS Submit: アプリストアへの自動提出
- EAS Update: OTA更新

### 3. 高品質なネイティブライブラリ

- Expo SDKライブラリ
- コミュニティでテスト済み

### 4. 簡単なネイティブモジュール開発

- Expo Modules API
- SwiftとKotlinでモジュールを記述

### 5. 簡素化されたネイティブプロジェクト管理

- Prebuild
- Config plugins

## よくある質問

### Q: 採用にどれくらい時間がかかりますか？

A: 段階的に採用できます。基本的な統合は数時間、フル採用は数週間です。

### Q: アプリサイズへの影響は？

A: Expoモジュールは必要なものだけをバンドルします。影響は最小限です。

### Q: 既存のツールとの互換性は？

A: Expoは既存のReact Nativeツールと互換性があります。

### Q: 実装の柔軟性は？

A: 必要な機能だけを採用できます。すべてを使用する必要はありません。

## 推奨される次のステップ

### 1. Expoモジュールのインストール

```bash
npx install-expo-modules@latest
```

### 2. Expo CLIへの移行

React Native CLIからExpo CLIに移行します。

### 3. 開発ビルドの作成

```bash
npx expo install expo-dev-client
npx expo run:android
```

### 4. EAS Buildの試用

```bash
eas build
```

### 5. Expo Routerの探索

```bash
npx expo install expo-router
```

## まとめ

Expoは段階的に採用でき、開発者が自分のプロジェクトに最適なツールを選択できます。基本的な統合から完全な採用まで、各フェーズで明確なメリットが得られます。
