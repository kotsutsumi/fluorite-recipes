# React Nativeバージョンミスマッチエラー

JavaScriptとネイティブコードのReact Nativeバージョン不一致を解決する方法を学びます。

## エラーの説明

**エラーメッセージ**:
```
React Native version mismatch.

JavaScript version: 0.74.1
Native version: 0.73.0

Make sure that you have rebuilt the native code.
```

**発生タイミング**: アプリの起動時または開発サーバーへの接続時

**影響**: アプリが正常に動作しない、クラッシュする、予期しない動作が発生する

## 主な原因

### 1. React NativeまたはExpo SDKのバージョンアップグレード

**シナリオ**: package.jsonのバージョンを更新したが、ネイティブコードを再ビルドしていない

**例**:
```json
// package.json（更新前）
{
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "0.73.0"
  }
}

// package.json（更新後）
{
  "dependencies": {
    "expo": "~51.0.0",
    "react-native": "0.74.1"
  }
}
```

### 2. 誤ったローカル開発サーバーへの接続

**シナリオ**: 複数のExpoプロジェクトを同時に開いており、誤ったサーバーに接続している

**症状**:
- デバイスが別のプロジェクトの開発サーバーに接続
- ネイティブバージョンとJavaScriptバージョンの不一致

### 3. 依存関係のバージョン競合

**シナリオ**: 異なるパッケージが異なるReact Nativeバージョンを要求

**例**:
```
node_modules
├── react-native@0.74.1 (メイン)
└── some-package
    └── react-native@0.73.0 (重複)
```

## 解決手順

### ステップ1: すべての開発サーバーを閉じる

**ターミナルで実行中のプロセスを確認**:

```bash
# macOS/Linux
ps aux | grep "expo\|metro\|react-native"

# Windows
tasklist | findstr "node"
```

**すべてのNode.jsプロセスを終了**:

```bash
# macOS/Linux
killall node

# または、特定のポートを使用しているプロセスのみ
lsof -ti:8081 | xargs kill

# Windows（PowerShell）
taskkill /F /IM node.exe

# または、特定のポート
netstat -ano | findstr :8081
taskkill /PID <プロセスID> /F
```

### ステップ2: SDKバージョンを確認

#### app.jsonを確認

```json
{
  "expo": {
    "sdkVersion": "51.0.0"  // ここを確認
  }
}
```

#### package.jsonを確認

```json
{
  "dependencies": {
    "expo": "~51.0.0",  // app.jsonのsdkVersionと一致
    "react-native": "0.74.1"
  }
}
```

**不一致の例**:
```json
// app.json
{
  "expo": {
    "sdkVersion": "51.0.0"
  }
}

// package.json
{
  "dependencies": {
    "expo": "~50.0.0",  // ❌ 不一致！
    "react-native": "0.73.0"
  }
}
```

### ステップ3: Expo Doctorでバージョン互換性をチェック

```bash
npx expo-doctor
```

**出力例**:
```
✔ Check Expo config for common issues
✔ Check package.json for common issues
✔ Check dependencies for packages that should not be installed directly
✖ Check for common project setup issues

Warning: expo package version (50.0.0) in package.json does not match SDK version (51.0.0) in app.json.
```

### ステップ4: 依存関係を修正

#### 自動修正（推奨）

```bash
# Expoが依存関係を自動的に修正
npx expo install --fix
```

**このコマンドは以下を実行**:
- app.jsonのSDKバージョンを読み取り
- 互換性のあるパッケージバージョンをインストール
- 競合するバージョンを解決

#### 手動修正

```bash
# 特定のバージョンをインストール
npm install expo@~51.0.0 react-native@0.74.1

# または、Yarnを使用
yarn add expo@~51.0.0 react-native@0.74.1
```

### ステップ5: キャッシュをクリア

#### 包括的なキャッシュクリア

**macOS/Linux**:
```bash
# node_modulesを削除
rm -rf node_modules

# キャッシュをクリア
npm cache clean --force

# 依存関係を再インストール
npm install

# Watchmanをリセット
watchman watch-del-all

# Metro bundlerキャッシュをクリア
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache

# 開発サーバーをクリアして起動
npx expo start --clear
```

**Windows**:
```bash
# node_modulesを削除
rm -rf node_modules

# キャッシュをクリア
npm cache clean --force

# 依存関係を再インストール
npm install

# Metro bundlerキャッシュをクリア
del %localappdata%\Temp\haste-map-*
del %localappdata%\Temp\metro-cache

# 開発サーバーをクリアして起動
npx expo start --clear
```

### ステップ6: ネイティブコードを再ビルド

**重要**: JavaScriptバージョンを更新した後は、ネイティブコードを必ず再ビルドする必要があります。

#### Expo Managed Workflow

```bash
# プリビルドをクリーン実行
npx expo prebuild --clean

# iOSを再ビルド
npx expo run:ios

# Androidを再ビルド
npx expo run:android
```

#### React Native Bare Workflow

**iOS**:
```bash
# Xcodeビルドキャッシュをクリア
rm -rf ~/Library/Developer/Xcode/DerivedData

# Podを再インストール
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..

# iOSをビルド
npx react-native run-ios
```

**Android**:
```bash
# Gradleキャッシュをクリア
cd android
./gradlew clean
cd ..

# Androidをビルド
npx react-native run-android
```

## Expo SDKとReact Nativeのバージョンマッピング

### バージョン対応表

| Expo SDK | React Native | リリース日 |
|----------|--------------|-----------|
| SDK 51   | 0.74.x       | 2024年5月 |
| SDK 50   | 0.73.x       | 2024年1月 |
| SDK 49   | 0.72.x       | 2023年6月 |
| SDK 48   | 0.71.x       | 2023年2月 |
| SDK 47   | 0.70.x       | 2022年11月 |

**最新のマッピングを確認**:
- [Expo SDK Versions](https://docs.expo.dev/versions/latest/)

### 互換性の確認方法

```bash
# Expo Doctorで互換性をチェック
npx expo-doctor

# 出力例
✔ Check Expo config
✔ Check package.json
✔ Check dependencies
✔ Check for common issues
```

## 一般的なシナリオと解決策

### シナリオ1: Expo SDKアップグレード後

**問題**: SDK 50からSDK 51にアップグレードしたが、エラーが発生

**解決策**:
```bash
# ステップ1: app.jsonを更新
# "sdkVersion": "51.0.0"に変更

# ステップ2: 依存関係を自動修正
npx expo install --fix

# ステップ3: キャッシュをクリア
rm -rf node_modules
npm cache clean --force
npm install

# ステップ4: プリビルド
npx expo prebuild --clean

# ステップ5: 再ビルド
npx expo run:ios
npx expo run:android
```

### シナリオ2: 複数プロジェクトの開発

**問題**: 2つのExpoプロジェクトを同時に開いており、デバイスが誤ったサーバーに接続

**解決策**:
```bash
# ステップ1: すべての開発サーバーを閉じる
killall node

# ステップ2: 正しいプロジェクトディレクトリに移動
cd /path/to/correct/project

# ステップ3: 開発サーバーを起動
npx expo start

# ステップ4: デバイスでアプリを再起動
# QRコードを再スキャン
```

### シナリオ3: 依存関係の競合

**問題**: サードパーティパッケージが古いReact Nativeバージョンを要求

**解決策**:
```bash
# ステップ1: 依存関係ツリーを確認
npm ls react-native

# ステップ2: 競合するパッケージを特定
# 出力例:
# ├─┬ expo@51.0.0
# │ └── react-native@0.74.1
# └─┬ old-package@1.0.0
#   └── react-native@0.73.0  # 競合

# ステップ3: パッケージを更新または削除
npm update old-package

# または、代替パッケージを探す
npm uninstall old-package
npm install compatible-package
```

### シナリオ4: Monorepo環境

**問題**: MonorepoでReact Nativeのバージョンが複数存在

**解決策**:

**package.json（ルート）**:
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "resolutions": {
    "react-native": "0.74.1"  // すべてのワークスペースで同じバージョンを使用
  }
}
```

**または、Yarnを使用**:
```bash
# yarn.lockを削除
rm yarn.lock

# 依存関係を再インストール
yarn install
```

## 予防策

### 1. アップグレード前のチェックリスト

```bash
# ステップ1: 現在のバージョンを記録
npx expo-doctor > version-before.txt

# ステップ2: バックアップを作成
git add .
git commit -m "Backup before upgrade"

# ステップ3: アップグレード
npx expo install --fix

# ステップ4: キャッシュをクリア
npm run reset

# ステップ5: 再ビルド
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

### 2. package.jsonで正確なバージョンを指定

```json
{
  "dependencies": {
    // ✅ 推奨: チルダ（~）で小数点以下のパッチバージョンを許可
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.1",

    // ❌ 非推奨: キャレット（^）は予期しないアップグレードを引き起こす可能性
    "expo": "^51.0.0"
  }
}
```

### 3. 定期的な依存関係のチェック

```bash
# 週次で実行
npx expo-doctor

# 問題があれば自動修正
npx expo install --fix
```

### 4. CI/CDでのバージョンチェック

**.github/workflows/check-versions.yml**:
```yaml
name: Check Versions

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx expo-doctor
```

## トラブルシューティングのヒント

### ログを確認

```bash
# 開発サーバーのログを確認
npx expo start

# デバイスのログを確認（iOS）
# Xcode → Window → Devices and Simulators → デバイスを選択 → Open Console

# デバイスのログを確認（Android）
adb logcat
```

### React Native バージョンを確認

```bash
# インストールされているバージョンを確認
npm ls react-native

# または
cat node_modules/react-native/package.json | grep version
```

### デバッグモードで起動

```bash
# 詳細なログを有効にして起動
DEBUG=* npx expo start --clear
```

## まとめ

React Nativeバージョンミスマッチエラーは、以下の方法で解決できます：

### 主な原因
- **アップグレード**: React NativeまたはExpo SDKのバージョン変更後の再ビルド不足
- **開発サーバー**: 誤ったローカルサーバーへの接続
- **依存関係競合**: 複数の React Native バージョンの共存

### 解決手順
1. すべての開発サーバーを閉じる
2. SDKバージョンの一致を確認（app.json vs package.json）
3. `npx expo-doctor`でバージョン互換性をチェック
4. `npx expo install --fix`で依存関係を自動修正
5. キャッシュをクリア
6. ネイティブコードを再ビルド

### Expo SDKとReact Nativeのマッピング
- SDK 51 → React Native 0.74.x
- SDK 50 → React Native 0.73.x
- SDK 49 → React Native 0.72.x

### 予防策
- アップグレード前のチェックリストを使用
- package.jsonで正確なバージョンを指定（`~`を使用）
- 定期的に`npx expo-doctor`を実行
- CI/CDでバージョンチェックを自動化

これらの手順とベストプラクティスを活用して、バージョンミスマッチエラーを効率的に解決し、予防できます。
