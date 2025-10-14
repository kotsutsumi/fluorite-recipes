# Expo トラブルシューティング包括ガイド

Expoアプリ開発における一般的な問題の診断、解決、予防のための包括的なリファレンスガイドです。

## メタデータ

```typescript
interface TroubleshootingMetadata {
  version: string;           // "1.0.0"
  lastUpdated: string;       // "2024-01-15"
  expoSDK: string;          // "51.x"
  reactNative: string;      // "0.74.x"
  category: string;         // "troubleshooting"
}

interface TroubleshootingCategory {
  errors: ErrorTroubleshooting;
  runtime: RuntimeDebugging;
  platform: PlatformSpecific;
  build: BuildAndDeploy;
  performance: PerformanceIssues;
  network: NetworkAndProxy;
  cache: CacheManagement;
}
```

## 目次

- [エラーと警告](#エラーと警告)
- [ランタイムデバッグ](#ランタイムデバッグ)
- [プラットフォーム固有のトラブルシューティング](#プラットフォーム固有のトラブルシューティング)
- [ビルドとデプロイ](#ビルドとデプロイ)
- [パフォーマンス問題](#パフォーマンス問題)
- [ネットワークとプロキシ](#ネットワークとプロキシ)
- [キャッシュ管理](#キャッシュ管理)
- [バージョン互換性](#バージョン互換性)
- [サポートリソース](#サポートリソース)

## エラーと警告

### 一般的なエラー

#### "Application has not been registered"

アプリの起動時に発生する登録エラーです。

```typescript
interface ApplicationRegistrationError {
  errorMessage: string;
  causes: RegistrationErrorCause[];
  solutions: Solution[];
  preventions: Prevention[];
}

interface RegistrationErrorCause {
  type: 'PreRegistrationException' | 'RegistrationMismatch' | 'ModuleConflict';
  description: string;
  symptoms: string[];
  examples: string[];
}

interface Solution {
  step: number;
  action: string;
  command?: string;
  platform?: 'ios' | 'android' | 'all';
}
```

**主な原因**：

1. **アプリ登録前の例外**
   - インポートエラー
   - 構文エラー
   - ランタイムエラー
   - ネイティブモジュールの初期化失敗

2. **ルートコンポーネントの登録ミスマッチ**
   - `AppRegistry.registerComponent`の誤った使用
   - `registerRootComponent`の欠落
   - AppKeyの不一致

3. **ネイティブモジュールの複数バージョン**
   - 同じモジュールの異なるバージョンが共存
   - 依存関係の競合

**トラブルシューティング手順**：

```bash
# ステップ1: ログを確認
npx expo start

# iOS実機のログ
# Xcode → Window → Devices and Simulators → デバイスを選択 → Open Console

# Androidのログ
adb logcat

# ステップ2: 正しいAppKey登録を確認
# App.tsx または index.js
```

```typescript
// ✅ 正しい登録方法（Expo）
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

// ❌ 誤った登録方法
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('SomeOtherName', () => App); // AppKeyが一致しない
```

```bash
# ステップ3: 依存関係のバージョンを確認
npm ls react-native

# 依存関係を修正
npx expo install --fix

# ステップ4: 開発サーバーへの接続を確認
ps aux | grep "expo\|metro\|react-native"
killall node

# ステップ5: 本番モードでテスト
npx expo start --no-dev --minify

# ステップ6: キャッシュをクリア
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npx expo start --clear

# ステップ7: ネイティブコードを再ビルド
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

**予防策**：

```typescript
// 1. registerRootComponentを使用
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

// 2. エラーバウンダリを実装
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {this.state.error?.message}
          </Text>
          <Button
            title="Reload"
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

詳細: [application-has-not-been-registered.md](./troubleshooting/application-has-not-been-registered.md)

#### React Native バージョンミスマッチ

JavaScriptとネイティブコードのReact Nativeバージョン不一致エラーです。

```typescript
interface VersionMismatchError {
  errorMessage: string;
  javascriptVersion: string;
  nativeVersion: string;
  causes: MismatchCause[];
  solutions: VersionSolution[];
}

interface MismatchCause {
  type: 'SDKUpgrade' | 'WrongServer' | 'DependencyConflict';
  description: string;
  scenario: string;
}

interface VersionSolution {
  step: number;
  action: string;
  commands: string[];
  platform?: 'macOS' | 'Windows' | 'Linux' | 'all';
}
```

**エラーメッセージ**：

```
React Native version mismatch.

JavaScript version: 0.74.1
Native version: 0.73.0

Make sure that you have rebuilt the native code.
```

**主な原因**：

1. **React NativeまたはExpo SDKのバージョンアップグレード**
   - package.jsonのバージョンを更新したが、ネイティブコードを再ビルドしていない

2. **誤ったローカル開発サーバーへの接続**
   - 複数のExpoプロジェクトを同時に開いており、誤ったサーバーに接続

3. **依存関係のバージョン競合**
   - 異なるパッケージが異なるReact Nativeバージョンを要求

**解決手順**：

```bash
# ステップ1: すべての開発サーバーを閉じる
killall node
# または
lsof -ti:8081 | xargs kill

# ステップ2: SDKバージョンを確認
# app.jsonとpackage.jsonの一致を確認
```

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
    "expo": "~51.0.0",
    "react-native": "0.74.1"
  }
}
```

```bash
# ステップ3: Expo Doctorでバージョン互換性をチェック
npx expo-doctor

# ステップ4: 依存関係を修正
npx expo install --fix

# ステップ5: キャッシュをクリア
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npx expo start --clear

# ステップ6: ネイティブコードを再ビルド
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

**Expo SDKとReact Nativeのマッピング**：

```typescript
interface SDKVersionMapping {
  expoSDK: string;
  reactNative: string;
  releaseDate: string;
  supported: boolean;
}

const versionMappings: SDKVersionMapping[] = [
  { expoSDK: '51.x', reactNative: '0.74.x', releaseDate: '2024-05', supported: true },
  { expoSDK: '50.x', reactNative: '0.73.x', releaseDate: '2024-01', supported: true },
  { expoSDK: '49.x', reactNative: '0.72.x', releaseDate: '2023-06', supported: true },
  { expoSDK: '48.x', reactNative: '0.71.x', releaseDate: '2023-02', supported: false },
];
```

**予防策**：

```json
// package.jsonで正確なバージョンを指定
{
  "dependencies": {
    "expo": "~51.0.0",        // チルダ（~）で小数点以下のパッチバージョンを許可
    "react": "18.2.0",
    "react-native": "0.74.1"
  }
}
```

```bash
# 定期的な依存関係のチェック
npx expo-doctor

# 問題があれば自動修正
npx expo install --fix
```

詳細: [react-native-version-mismatch.md](./troubleshooting/react-native-version-mismatch.md)

### ログとエラースタックトレースの表示

```typescript
interface LoggingStrategy {
  platform: 'iOS' | 'Android' | 'ExpoGo';
  method: string;
  command: string;
  tools: string[];
}
```

**デバイスログの確認**：

```bash
# iOS実機
# Xcode → Window → Devices and Simulators → デバイスを選択 → Open Console

# Android実機
adb logcat

# Expo Go
npx expo start
# ターミナルにログが表示される
```

**React Native Debuggerの使用**：

```bash
# macOS
brew install --cask react-native-debugger

# 設定
# 1. React Native Debuggerを起動
# 2. Expo開発サーバーを起動
# 3. デバイスでデバッグメニューを開く（シェイクまたはCmd+D/Ctrl+M）
# 4. "Debug Remote JS"を選択
```

## キャッシュ管理

### キャッシュクリアの必要性

```typescript
interface CacheIssue {
  symptom: string;
  cause: string;
  resolution: string;
  preventable: boolean;
}

interface CacheClearStrategy {
  level: 'basic' | 'intermediate' | 'deep' | 'complete';
  commands: CacheCommand[];
  estimatedTime: string;
  successRate: number;
}

interface CacheCommand {
  step: number;
  description: string;
  command: string;
  platform: 'macOS' | 'Windows' | 'Linux' | 'all';
  required: boolean;
}
```

**症状**：
- 古いコードが実行される
- 変更が反映されない
- ビルドエラーが解決しない
- 依存関係の問題
- 予期しない動作

**キャッシュクリアで解決できる問題**：
- 古いJavaScriptバンドル
- 破損したMetroキャッシュ
- 古いnode_modules
- Watchmanの問題
- パッケージマネージャーのキャッシュ

### macOS/Linux キャッシュクリア

```bash
# 完全なキャッシュクリア手順

# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア
rm -fr $TMPDIR/haste-map-*

# ステップ6: Metroキャッシュをクリア
rm -rf $TMPDIR/metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

**Yarn使用時**：

```bash
# Yarnキャッシュをクリア
yarn cache clean

# Yarnキャッシュの場所を確認
yarn cache dir

# 依存関係を再インストール
yarn
```

**プラットフォーム固有のキャッシュクリア**：

```bash
# iOSキャッシュのクリア
rm -rf ~/Library/Developer/Xcode/DerivedData

cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..

rm -rf ios/build

# Androidキャッシュのクリア
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..

rm -rf android/app/build
rm -rf android/build
rm -rf ~/.gradle/caches
```

詳細: [clear-cache-macos-linux.md](./troubleshooting/clear-cache-macos-linux.md)

### Windows キャッシュクリア

```bash
# 完全なキャッシュクリア手順（コマンドプロンプト）

# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア
del %localappdata%\Temp\haste-map-*

# ステップ6: Metroキャッシュをクリア
del %localappdata%\Temp\metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

**PowerShell版**：

```powershell
# node_modulesを削除
Remove-Item -Recurse -Force node_modules

# npmキャッシュをクリア
npm cache clean --force

# 依存関係を再インストール
npm install

# Watchmanキャッシュをクリア
watchman watch-del-all

# Hasteマップキャッシュをクリア
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-*

# Metroキャッシュをクリア
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-cache

# 開発サーバーをクリアして起動
npx expo start --clear
```

**Windows固有の考慮事項**：

```typescript
interface WindowsConsideration {
  issue: string;
  solution: string;
  registry?: boolean;
  admin?: boolean;
}

const windowsConsiderations: WindowsConsideration[] = [
  {
    issue: 'ファイルパスの長さ制限（260文字）',
    solution: 'レジストリでLongPathsEnabledを有効化',
    registry: true,
    admin: true
  },
  {
    issue: 'ファイルロックの問題',
    solution: 'taskkill /F /IM node.exe でプロセスを強制終了',
    admin: false
  },
  {
    issue: 'ウイルス対策ソフトの干渉',
    solution: 'node_modulesをスキャンから除外',
    admin: true
  }
];
```

詳細: [clear-cache-windows.md](./troubleshooting/clear-cache-windows.md)

### 便利なスクリプト

```json
// package.jsonにカスタムスクリプトを追加
{
  "scripts": {
    "start": "expo start",
    "clear": "expo start --clear",
    "reset": "rm -rf node_modules && npm install && watchman watch-del-all && npm start",
    "deep-clean": "rm -rf node_modules ios/build android/app/build && npm cache clean --force && npm install && npx expo start --clear"
  }
}
```

```bash
# シェルエイリアスを作成（~/.zshrc または ~/.bashrc）
alias expo-clear='rm -rf node_modules && npm cache clean --force && npm install && watchman watch-del-all && npx expo start --clear'
alias expo-deep-clean='rm -rf node_modules ios/build android/app/build .expo $TMPDIR/metro-* $TMPDIR/haste-map-* && npm install && npx expo start --clear'
```

## ランタイムデバッグ

### ネイティブランタイムの問題の検査

```typescript
interface RuntimeDebugStrategy {
  platform: 'iOS' | 'Android';
  tools: DebugTool[];
  commonIssues: string[];
  solutions: string[];
}

interface DebugTool {
  name: string;
  purpose: string;
  installation: string;
  usage: string;
}
```

**iOSシミュレーター**：

```bash
# シミュレーターを起動
npx expo run:ios

# Xcodeでログを表示
# Xcode → Window → Devices and Simulators → Simulator → Open Console
```

**一般的な問題**：
- ネイティブモジュールのリンクエラー
- Podfileの依存関係の問題
- ビルド設定の不一致

**Androidエミュレーター**：

```bash
# エミュレーターを起動
npx expo run:android

# logcatでログを表示
adb logcat
```

**一般的な問題**：
- Gradleビルドエラー
- 依存関係の競合
- ProGuardの設定

### デバッグとプロファイリングツール

#### React DevTools

```bash
# React DevToolsをインストール
npm install -g react-devtools

# 起動
react-devtools

# 使用方法
# 1. react-devtoolsを起動
# 2. Expoアプリを起動
# 3. 自動的に接続される
```

#### Flipper

```typescript
interface FlipperFeatures {
  networkInspector: boolean;
  layoutInspector: boolean;
  logViewer: boolean;
  databaseInspector: boolean;
  pluginSupport: boolean;
}
```

```bash
# Flipperをインストール
# https://fbflipper.com/

# Development buildで使用
# React Native Debuggerの代替
```

**主な機能**：
- ネットワークインスペクター
- レイアウトインスペクター
- ログビューアー
- データベースインスペクター

#### Reactotron

```bash
# Reactotronをインストール
npm install --save-dev reactotron-react-native
```

```typescript
// app/_layout.tsx
import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative()
  .connect();
```

**機能**：
- API呼び出しの監視
- 状態管理のデバッグ
- カスタムコマンドの実行

## プラットフォーム固有のトラブルシューティング

### Expo Router

```typescript
interface ExpoRouterDebug {
  issue: string;
  debugMethod: string;
  solution: string;
}
```

**一般的な問題**：
- ルーティングの設定ミス
- ナビゲーションの問題
- 動的ルートのエラー

**デバッグ方法**：

```bash
# Expo Routerのデバッグモードを有効化
export EXPO_ROUTER_DEBUG=1
npx expo start
```

### プッシュ通知

**一般的な問題**：
- トークンが生成されない
- 通知が受信されない
- パーミッションの問題

**デバッグステップ**：
1. パーミッションの状態を確認
2. Expo Push Tokenを検証
3. 開発環境と本番環境の設定を確認

### EAS Build

**ビルドエラー**：
- 依存関係の問題
- ネイティブモジュールの競合
- 設定ファイルのエラー

**解決策**：

```bash
# eas.jsonを検証
eas build:configure

# ローカルでビルドをテスト
eas build --platform ios --local
```

### EAS Update

**更新が配信されない**：
- チャンネル設定の確認
- ランタイムバージョンの一致を確認
- アセットの最適化

## ネットワークとプロキシ

### プロキシ設定

```typescript
interface ProxyConfiguration {
  platform: 'macOS' | 'Windows' | 'Linux';
  method: 'system' | 'environment' | 'tool-specific';
  config: ProxyConfig;
}

interface ProxyConfig {
  httpProxy: string;
  httpsProxy: string;
  noProxy: string[];
  authentication?: {
    username: string;
    password: string;
  };
}
```

**プロキシが必要な場合**：
- 企業ネットワークでの開発
- ファイアウォールの背後での作業
- HTTPSトラフィックの検査が必要
- ネットワークトラフィックのデバッグ

**macOS/Linuxでの環境変数設定**：

```bash
# ~/.zshrc または ~/.bashrc に追加

# HTTPプロキシ
export HTTP_PROXY="http://proxy.company.com:8080"
export http_proxy="http://proxy.company.com:8080"

# HTTPSプロキシ
export HTTPS_PROXY="http://proxy.company.com:8080"
export https_proxy="http://proxy.company.com:8080"

# プロキシをバイパスするホスト
export NO_PROXY="localhost,127.0.0.1,.local"
export no_proxy="localhost,127.0.0.1,.local"

# 認証が必要な場合
# export HTTP_PROXY="http://username:password@proxy.company.com:8080"

# 変更を適用
source ~/.zshrc
```

**npmプロキシ設定**：

```bash
# プロキシを設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 認証が必要な場合
npm config set proxy http://username:password@proxy.company.com:8080
npm config set https-proxy http://username:password@proxy.company.com:8080

# 設定を確認
npm config get proxy
npm config get https-proxy

# プロキシ設定を削除
npm config delete proxy
npm config delete https-proxy
```

**Gitプロキシ設定**：

```bash
# グローバル設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# 設定を確認
git config --get http.proxy
git config --get https.proxy

# プロキシ設定を削除
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**Charles Proxy（macOS推奨）**：

```bash
# Homebrewでインストール
brew install --cask charles

# 設定
# 1. Charles Proxyを起動
# 2. Proxy → Proxy Settings
# 3. Port: 8888（デフォルト）
# 4. Enable transparent HTTP proxyingをチェック

# 外部プロキシサーバーの設定
# Proxy → External Proxy Settings
# Use external proxy serversをチェック
```

**一般的な問題と解決策**：

```typescript
interface ProxyIssue {
  issue: string;
  errorMessage: string;
  solution: string;
  command?: string;
}

const proxyIssues: ProxyIssue[] = [
  {
    issue: 'SSL証明書エラー',
    errorMessage: 'unable to verify the first certificate',
    solution: 'npmで厳密なSSLを無効化',
    command: 'npm config set strict-ssl false'
  },
  {
    issue: '認証が必要なプロキシ',
    errorMessage: 'Proxy authentication required',
    solution: 'ユーザー名とパスワードをURLに含める',
    command: 'export HTTP_PROXY="http://username:password@proxy.company.com:8080"'
  },
  {
    issue: 'プロキシのバイパスが必要',
    errorMessage: 'Connection timeout',
    solution: 'NO_PROXY環境変数を設定',
    command: 'export NO_PROXY="localhost,127.0.0.1,.local,.internal"'
  }
];
```

詳細: [proxies.md](./troubleshooting/proxies.md)

## 一般的なデバッグ戦略

### 1. エラーメッセージの分析

```typescript
// エラーの詳細情報を取得
interface ErrorAnalysis {
  name: string;
  message: string;
  stack: string;
  cause?: unknown;
}

function analyzeError(error: Error): ErrorAnalysis {
  console.log('Error name:', error.name);
  console.log('Error message:', error.message);
  console.log('Error stack:', error.stack);

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: (error as any).cause
  };
}
```

### 2. ログの確認

```typescript
// 詳細なログを追加
interface LogLevel {
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  data?: unknown;
}

function logWithLevel(logLevel: LogLevel): void {
  const timestamp = new Date().toISOString();

  switch (logLevel.level) {
    case 'log':
      console.log(`[${timestamp}] LOG:`, logLevel.message, logLevel.data);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARNING:`, logLevel.message, logLevel.data);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR:`, logLevel.message, logLevel.data);
      break;
    case 'info':
      console.info(`[${timestamp}] INFO:`, logLevel.message, logLevel.data);
      break;
  }
}
```

### 3. 開発ツールの活用

```typescript
// React DevToolsでコンポーネントを検査
interface ComponentInspection {
  name: string;
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  performance: PerformanceMetrics;
}

interface PerformanceMetrics {
  renderTime: number;
  rerenderCount: number;
  lastRenderTimestamp: number;
}
```

### 4. バージョンの互換性を確認

```bash
# Expo Doctorでプロジェクトをチェック
npx expo-doctor
```

### 5. キャッシュのクリア

```bash
# 古いデータや破損したデータを削除
npx expo start --clear
```

## バージョン互換性

### Expo SDK とReact Nativeのマッピング

```typescript
interface VersionCompatibility {
  expoSDK: string;
  reactNative: string;
  releaseDate: string;
  endOfSupport?: string;
  supported: boolean;
  features: string[];
}

const versionCompatibilityMatrix: VersionCompatibility[] = [
  {
    expoSDK: '51.x',
    reactNative: '0.74.x',
    releaseDate: '2024-05',
    supported: true,
    features: ['New Architecture', 'Fabric', 'Turbo Modules']
  },
  {
    expoSDK: '50.x',
    reactNative: '0.73.x',
    releaseDate: '2024-01',
    supported: true,
    features: ['Improved Metro', 'Better TypeScript support']
  },
  {
    expoSDK: '49.x',
    reactNative: '0.72.x',
    releaseDate: '2023-06',
    supported: true,
    features: ['Expo Router v2', 'Local-first development']
  },
  {
    expoSDK: '48.x',
    reactNative: '0.71.x',
    releaseDate: '2023-02',
    endOfSupport: '2024-02',
    supported: false,
    features: ['Expo Router v1']
  }
];
```

**互換性の確認**：

```bash
# 現在のバージョンを確認
npx expo-doctor

# 依存関係を修正
npx expo install --fix
```

## パフォーマンス問題

### 遅いビルド時間

```typescript
interface BuildPerformanceIssue {
  cause: string;
  impact: string;
  solution: string;
  estimatedImprovement: string;
}
```

**原因**：
- 大きなnode_modules
- キャッシュの問題
- 非効率なネイティブ依存関係

**解決策**：

```bash
# キャッシュをクリア
npm cache clean --force
rm -rf node_modules
npm install

# Watchmanをリセット
watchman watch-del-all
```

### 遅いアプリ起動

**原因**：
- 大きなJSバンドル
- 初期化時の重い処理
- 最適化されていない画像

**解決策**：
- コード分割を使用
- 遅延ローディングを実装
- 画像を最適化

## サポートリソース

### 公式リソース

```typescript
interface SupportResource {
  type: 'documentation' | 'forum' | 'github' | 'discord' | 'stackoverflow';
  name: string;
  url: string;
  description: string;
  responseTime?: string;
}

const supportResources: SupportResource[] = [
  {
    type: 'documentation',
    name: 'Expo Documentation',
    url: 'https://docs.expo.dev/',
    description: '公式ドキュメント'
  },
  {
    type: 'forum',
    name: 'Expo Forums',
    url: 'https://forums.expo.dev/',
    description: 'コミュニティフォーラム',
    responseTime: '24-48時間'
  },
  {
    type: 'github',
    name: 'Expo GitHub',
    url: 'https://github.com/expo/expo',
    description: 'オープンソースリポジトリ'
  },
  {
    type: 'discord',
    name: 'Expo Discord',
    url: 'https://chat.expo.dev/',
    description: 'リアルタイムチャット',
    responseTime: '数分〜数時間'
  },
  {
    type: 'stackoverflow',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/questions/tagged/expo',
    description: 'Q&Aコミュニティ'
  }
];
```

**ドキュメント**：
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

**フォーラム**：
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)

**GitHub**：
- [Expo GitHub](https://github.com/expo/expo)
- [React Native GitHub](https://github.com/facebook/react-native)

**コミュニティサポート**：
- [Expo Discord](https://chat.expo.dev/)
- React Native Discord

**Stack Overflow**：
- [expo](https://stackoverflow.com/questions/tagged/expo)タグ
- [react-native](https://stackoverflow.com/questions/tagged/react-native)タグ

## トラブルシューティングチェックリスト

### 問題が発生した場合

```typescript
interface TroubleshootingChecklist {
  step: number;
  action: string;
  command?: string;
  required: boolean;
  estimatedTime: string;
}

const troubleshootingSteps: TroubleshootingChecklist[] = [
  {
    step: 1,
    action: 'エラーメッセージを読む',
    required: true,
    estimatedTime: '1-2分'
  },
  {
    step: 2,
    action: 'バージョンを確認',
    command: 'npx expo-doctor',
    required: true,
    estimatedTime: '1分'
  },
  {
    step: 3,
    action: 'キャッシュをクリア',
    command: 'npx expo start --clear',
    required: true,
    estimatedTime: '2-5分'
  },
  {
    step: 4,
    action: '依存関係を更新',
    command: 'npx expo install --fix',
    required: false,
    estimatedTime: '5-10分'
  },
  {
    step: 5,
    action: 'ドキュメントを検索',
    required: false,
    estimatedTime: '10-30分'
  },
  {
    step: 6,
    action: '最小限の再現例を作成',
    required: false,
    estimatedTime: '30-60分'
  },
  {
    step: 7,
    action: 'コミュニティに質問',
    required: false,
    estimatedTime: '24-48時間（返答待ち）'
  }
];
```

1. **エラーメッセージを読む**
   - 完全なエラースタックトレースを確認
   - 前後のログメッセージを確認

2. **バージョンを確認**
   ```bash
   npx expo-doctor
   ```

3. **キャッシュをクリア**
   ```bash
   npx expo start --clear
   rm -rf node_modules && npm install
   ```

4. **依存関係を更新**
   ```bash
   npx expo install --fix
   npm update
   ```

5. **ドキュメントを検索**
   - 公式ドキュメントで解決策を確認
   - フォーラムやStack Overflowで検索

6. **最小限の再現例を作成**
   - 問題を分離
   - シンプルなテストケースを作成

7. **コミュニティに質問**
   - フォーラムやDiscordで質問
   - GitHubでissueを作成

## 予防策

### ベストプラクティス

```typescript
interface PreventionStrategy {
  practice: string;
  frequency: string;
  command?: string;
  automation: boolean;
}

const preventionStrategies: PreventionStrategy[] = [
  {
    practice: '定期的な更新',
    frequency: '週次',
    command: 'npx expo install --fix && npm update',
    automation: true
  },
  {
    practice: 'バージョン管理',
    frequency: 'プロジェクト開始時',
    command: 'package.jsonで正確なバージョンを指定',
    automation: false
  },
  {
    practice: 'ドキュメント化',
    frequency: '問題発生時',
    command: 'README.mdに既知の問題を記録',
    automation: false
  },
  {
    practice: 'テスト',
    frequency: '変更後',
    command: 'npx expo start && 複数のプラットフォームで確認',
    automation: true
  }
];
```

**1. 定期的な更新**：

```bash
# 週次で依存関係を更新
npx expo install --fix
npm update
```

**2. バージョン管理**：

```json
// package.jsonで正確なバージョンを指定
{
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.1"
  }
}
```

**3. ドキュメント化**：

```markdown
# プロジェクトのREADME.md
## 既知の問題
- Issue 1: 説明と解決策
- Issue 2: 説明と解決策
```

**4. テスト**：

```bash
# 変更後に必ずテスト
npx expo start
# 複数のプラットフォームで確認
```

## まとめ

このトラブルシューティングガイドは、以下の方法を提供します：

### 主なトラブルシューティング領域

```typescript
interface TroubleshootingSummary {
  category: string;
  topics: string[];
  keyCommands: string[];
  estimatedResolutionTime: string;
}

const summaryByCategory: TroubleshootingSummary[] = [
  {
    category: 'エラーと警告',
    topics: [
      'Application has not been registered',
      'React Native version mismatch',
      'ログとスタックトレースの表示'
    ],
    keyCommands: ['npx expo start', 'npx expo-doctor', 'npx expo install --fix'],
    estimatedResolutionTime: '10-30分'
  },
  {
    category: 'キャッシュ管理',
    topics: [
      'macOS/Linuxキャッシュクリア',
      'Windowsキャッシュクリア',
      'プラットフォーム固有のキャッシュ'
    ],
    keyCommands: [
      'rm -rf node_modules && npm install',
      'npx expo start --clear',
      'watchman watch-del-all'
    ],
    estimatedResolutionTime: '5-15分'
  },
  {
    category: 'ランタイムデバッグ',
    topics: [
      'React DevTools',
      'Flipper',
      'Reactotron',
      'ネイティブログの確認'
    ],
    keyCommands: ['react-devtools', 'adb logcat'],
    estimatedResolutionTime: '15-60分'
  },
  {
    category: 'ネットワークとプロキシ',
    topics: [
      'プロキシ設定',
      'SSL証明書エラー',
      '認証プロキシ',
      'Charles Proxy/Fiddler'
    ],
    keyCommands: [
      'npm config set proxy',
      'git config --global http.proxy',
      'export HTTP_PROXY'
    ],
    estimatedResolutionTime: '10-30分'
  },
  {
    category: 'パフォーマンス',
    topics: [
      '遅いビルド時間',
      '遅いアプリ起動',
      'コード分割',
      '画像最適化'
    ],
    keyCommands: ['npm cache clean --force', 'watchman watch-del-all'],
    estimatedResolutionTime: '30-120分'
  }
];
```

### デバッグ戦略

1. **エラーメッセージの徹底的な分析**
   - スタックトレースを確認
   - 前後のログを確認
   - エラーの原因を特定

2. **ログとスタックトレースの確認**
   - React DevToolsで検査
   - ネイティブログを確認
   - 詳細なログを追加

3. **開発ツールの効果的な活用**
   - React DevTools
   - Flipper
   - Reactotron

4. **バージョン互換性の検証**
   - `npx expo-doctor`を実行
   - Expo SDKとReact Nativeのマッピングを確認

5. **キャッシュクリアと依存関係の更新**
   - 段階的なキャッシュクリア
   - 依存関係の修正

### サポートリソース

- **公式ドキュメント**: Expo/React Nativeドキュメント
- **フォーラム**: Expo Forums、React Native Community
- **GitHub**: Issue、PR、ディスカッション
- **Discord**: リアルタイムコミュニティサポート
- **Stack Overflow**: Q&Aコミュニティ

### 予防策

- **定期的な依存関係の更新**: 週次で`npx expo install --fix`
- **正確なバージョン指定**: package.jsonでチルダ（~）を使用
- **既知の問題の文書化**: README.mdに記録
- **包括的なテスト**: 変更後に複数のプラットフォームで確認

### 関連ドキュメント

- [Application has not been registered エラー](./troubleshooting/application-has-not-been-registered.md)
- [React Native バージョンミスマッチ](./troubleshooting/react-native-version-mismatch.md)
- [キャッシュのクリア（macOS/Linux）](./troubleshooting/clear-cache-macos-linux.md)
- [キャッシュのクリア（Windows）](./troubleshooting/clear-cache-windows.md)
- [プロキシ設定](./troubleshooting/proxies.md)
- [トラブルシューティング概要](./troubleshooting/overview.md)

これらの戦略とリソースを活用して、Expo開発での問題を効率的に診断し解決できます。
