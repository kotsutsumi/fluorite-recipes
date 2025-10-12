# iOSシミュレーター

macOSでiOSアプリを開発するには、iOSシミュレーターをセットアップする必要があります。

## XcodeとWatchmanのセットアップ

### 1. Xcodeのインストール

#### Mac App Storeから

1. Mac App Storeを開く
2. "Xcode"を検索
3. **Install**または**Update**をクリック

> **注意**: Xcodeは大きいアプリケーションです（約10-15GB）。ダウンロードとインストールには時間がかかります。

### 2. Xcodeコマンドラインツールのインストール

1. Xcodeを開く
2. **Settings**（**Xcode** → **Settings**）を開く
3. **Locations**タブを選択
4. **Command Line Tools**ドロップダウンからバージョンを選択してインストール

または、ターミナルから：

```bash
xcode-select --install
```

### 3. XcodeでiOSシミュレーターのインストール

1. Xcode **Settings**を開く
2. **Platforms**タブを選択
3. **Platform Support** → **iOS**で**Get**をクリック

これにより、iOSシミュレーターランタイムがダウンロードされます。

### 4. Watchmanのインストール

Watchmanは、ファイルシステムの変更を監視するツールです。

```bash
brew update
brew install watchman
```

## 試してみる

### Expo CLIでシミュレーターを起動

1. **Expo開発サーバーを起動**

```bash
npx expo start
```

2. **iOSシミュレーターで開く**

ターミナルで`i`キーを押すと、iOSシミュレーターが開きます。

3. **対話的にシミュレーターを選択**

`shift + i`キーを押すと、利用可能なシミュレーターのリストが表示され、選択できます。

### 直接実行

```bash
npx expo run:ios
```

このコマンドは、iOSプロジェクトをビルドしてシミュレーターで実行します。

## Expo Orbit

Expo OrbitはmacOSメニューバーからビルドの起動とシミュレーター管理を可能にします。

### インストール

[Expo Orbit](https://expo.dev/orbit)をダウンロードしてインストールします。

### 機能

- **ビルドの起動**: EASビルドやローカルビルドを素早く起動
- **シミュレーター管理**: 複数のシミュレーターを簡単に切り替え
- **更新の確認**: 新しいExpo SDKバージョンの通知

## シミュレーターの制限事項

iOSシミュレーターには、実際のデバイスにはある以下の機能がありません：

### ハードウェア制限

- **音声入力**: マイク機能がありません
- **気圧計**: 気圧センサーがありません
- **カメラ**: カメラ機能がありません
- **モーションサポート**: 加速度計やジャイロスコープがありません

### ソフトウェア制限

- **バックグラウンドアプリの一時停止**: iOS 11以降では、バックグラウンドアプリが一時停止されます

これらの機能をテストするには、実際のiOSデバイスが必要です。

## トラブルシューティング

### CLIがスタックする

CLIがスタックする場合、macOSツールバーからシミュレーターを手動で開きます：

1. **Xcode**を開く
2. **Xcode** → **Open Developer Tool** → **Simulator**

### 初回インストールで操作が必要

初回インストール時は、Expo Goアプリを開くために操作が必要な場合があります：

1. シミュレーターでExpo Goアイコンをタップ
2. アプリが起動するのを待つ

### バージョン更新

新しいSDKバージョンにアップグレードするには、希望するSDKバージョンで新しいプロジェクトを作成します：

```bash
npx create-expo-app@latest my-app --template blank
cd my-app
npx expo start
```

### `xcrun`エラー

`xcrun`エラーが発生した場合：

#### 1. Expo Goを再インストール

シミュレーターでExpo Goアプリを削除し、再インストールします：

```bash
# シミュレーターでExpo Goを削除
# Expo開発サーバーを再起動
npx expo start
# 'i'キーを押してシミュレーターで開く
```

#### 2. シミュレーターのコンテンツを消去

必要に応じて、シミュレーターのコンテンツを消去します：

1. シミュレーターを開く
2. **Device** → **Erase All Content and Settings**

## 複数のシミュレーターの管理

### シミュレーターのリスト表示

```bash
xcrun simctl list devices
```

### 特定のシミュレーターの起動

```bash
xcrun simctl boot "iPhone 15 Pro"
```

### シミュレーターの作成

```bash
xcrun simctl create "iPhone 15 Custom" "com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro" "com.apple.CoreSimulator.SimRuntime.iOS-17-0"
```

### シミュレーターの削除

```bash
xcrun simctl delete "iPhone 15 Custom"
```

## 高度な機能

### スクリーンショットの撮影

シミュレーターで：

1. **File** → **New Screen Recording**（録画）
2. **Cmd + S**（スクリーンショット）

または、コマンドラインから：

```bash
xcrun simctl io booted screenshot screenshot.png
```

### ダークモードの切り替え

```bash
xcrun simctl ui booted appearance dark
# または
xcrun simctl ui booted appearance light
```

### 位置情報のシミュレーション

シミュレーターで：

1. **Features** → **Location** → **Custom Location**
2. 緯度と経度を入力

## パフォーマンスの最適化

### シミュレーターのリソース設定

シミュレーターのパフォーマンスを改善するには：

1. 不要なシミュレーターを削除
2. macOSの他のアプリを閉じる
3. 十分なRAMを割り当てる

### Fast Refreshの使用

Fast Refreshを有効にして、開発速度を向上させます：

```bash
# Fast Refreshはデフォルトで有効
# Developer Menuで確認（Cmd + D）
```

## まとめ

iOSシミュレーターは、macOSでiOSアプリを開発およびテストするための強力なツールです。Xcodeとシミュレーターを適切にセットアップすることで、物理デバイスなしで効率的にiOSアプリを開発できます。ただし、一部の機能（カメラ、モーションセンサーなど）は実際のデバイスでのみテストできることに注意してください。
