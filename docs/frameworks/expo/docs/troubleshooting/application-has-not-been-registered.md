# "Application has not been registered" エラー

ExpoまたはReact Nativeアプリで"Application has not been registered"エラーが発生した場合の診断と解決方法を学びます。

## エラーの説明

**エラーメッセージ**:
```
Application 'main' has not been registered.
This can happen if:
* Metro (the local dev server) is run from the wrong folder.
* A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called.
```

**発生タイミング**: アプリの起動時、通常は白い画面またはエラー画面が表示される

## 主な原因

### 1. アプリ登録前の例外

**説明**: アプリが完全にロードして登録される前にエラーが発生

**症状**:
- アプリが起動しない
- 白い画面が表示される
- エラーログに他のエラーメッセージが含まれる

**原因の例**:
- インポートエラー
- 構文エラー
- ランタイムエラー
- ネイティブモジュールの初期化失敗

### 2. ルートコンポーネントの登録ミスマッチ

**説明**: JavaScriptとネイティブ側のアプリ登録に不整合がある

**症状**:
- 特定のプラットフォームでのみ発生
- 開発環境では動作するが本番環境で失敗

**原因の例**:
- `AppRegistry.registerComponent`の誤った使用
- `registerRootComponent`の欠落
- AppKeyの不一致

### 3. ネイティブモジュールの複数バージョン

**説明**: 同じネイティブモジュールの異なるバージョンが共存している

**症状**:
- ビルド後にエラーが発生
- 特定の機能使用時にクラッシュ

## トラブルシューティング手順

### ステップ1: ログを確認

**エラーメッセージの前のログを確認**:

```bash
# 開発サーバーのログを確認
npx expo start

# iOS実機のログ
# Xcode → Window → Devices and Simulators → デバイスを選択 → Open Console

# Androidのログ
adb logcat
```

**探すべきエラー**:
- `Cannot find module`
- `SyntaxError`
- `TypeError`
- `ReferenceError`
- ネイティブモジュールのロードエラー

### ステップ2: 正しいAppKey登録を確認

#### Expoプロジェクト

**正しい登録方法**:
```typescript
// App.tsx または index.js
import { registerRootComponent } from 'expo';
import App from './App'; // または './src/App'

registerRootComponent(App);
```

**誤った登録方法**:
```typescript
// ❌ 非推奨: 直接AppRegistryを使用
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('SomeOtherName', () => App); // AppKeyが一致しない
```

#### React Nativeプロジェクト

**index.js**:
```typescript
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// app.jsonのnameと一致する必要がある
AppRegistry.registerComponent(appName, () => App);
```

**app.json**:
```json
{
  "name": "MyApp", // index.jsのappNameと一致
  "displayName": "My App"
}
```

### ステップ3: 依存関係のバージョンを確認

**重複する依存関係を確認**:

```bash
# npm
npm ls react-native

# yarn
yarn why react-native
```

**問題の例**:
```
├─┬ expo@51.0.0
│ └── react-native@0.74.1
└─┬ some-package@1.0.0
  └── react-native@0.73.0  # 異なるバージョン
```

**解決策**:
```bash
# 依存関係を修正
npx expo install --fix

# または、手動で修正
npm install react-native@0.74.1
```

### ステップ4: 開発サーバーへの接続を確認

**症状**: 誤った開発サーバーに接続している

**確認方法**:
1. 実行中の開発サーバーを確認
```bash
# 実行中のプロセスを確認
ps aux | grep "expo\|metro\|react-native"
```

2. すべての開発サーバーを停止
```bash
# プロセスを終了
killall node
# または
killall -9 node
```

3. 正しいディレクトリから開発サーバーを起動
```bash
cd /path/to/your/project
npx expo start
```

### ステップ5: 本番モードでテスト

**開発環境固有の問題か確認**:

```bash
# 本番モードで起動
npx expo start --no-dev --minify

# または
npx expo start --no-dev
```

**本番モードでのみ発生する場合**:
- Minificationの問題
- 環境変数の問題
- 開発環境専用のコードが含まれている

### ステップ6: キャッシュをクリア

**キャッシュの問題を排除**:

#### macOS/Linux

```bash
# node_modulesを削除
rm -rf node_modules

# キャッシュをクリア
npm cache clean --force

# 再インストール
npm install

# Watchmanをリセット
watchman watch-del-all

# Metro bundlerキャッシュをクリア
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache

# 開発サーバーを起動
npx expo start --clear
```

#### Windows

```bash
# node_modulesを削除
rm -rf node_modules

# キャッシュをクリア
npm cache clean --force

# 再インストール
npm install

# Watchmanをリセット
watchman watch-del-all

# Metro bundlerキャッシュをクリア
del %localappdata%\Temp\haste-map-*
del %localappdata%\Temp\metro-cache

# 開発サーバーを起動
npx expo start --clear
```

### ステップ7: ネイティブコードを再ビルド

**Development buildまたはカスタムネイティブコードを使用している場合**:

```bash
# iOSの再ビルド
rm -rf ios/build
npx expo prebuild --clean
npx expo run:ios

# Androidの再ビルド
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npx expo run:android
```

## 一般的なシナリオと解決策

### シナリオ1: インポートエラー

**エラーメッセージ**:
```
Cannot find module './components/Button'
```

**解決策**:
1. ファイルパスを確認
```typescript
// ✅ 正しいパス
import Button from './components/Button';

// ❌ 誤ったパス
import Button from './component/Button'; // タイポ
```

2. ファイル拡張子を確認
```typescript
// ✅ 拡張子なし（推奨）
import Button from './components/Button';

// ✅ 明示的な拡張子
import Button from './components/Button.tsx';
```

### シナリオ2: 構文エラー

**エラーメッセージ**:
```
SyntaxError: Unexpected token
```

**解決策**:
1. コードを確認
```typescript
// ❌ 構文エラー
const data = { name: 'John' age: 30 };

// ✅ 修正
const data = { name: 'John', age: 30 };
```

2. Babel設定を確認
```json
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### シナリオ3: ネイティブモジュールの初期化失敗

**エラーメッセージ**:
```
Native module cannot be null
```

**解決策**:
1. Config Pluginを確認
```json
// app.json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app"
    ]
  }
}
```

2. プリビルドを実行
```bash
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

### シナリオ4: 条件付きインポートの問題

**エラーメッセージ**:
```
Cannot read property 'default' of undefined
```

**問題のあるコード**:
```typescript
// ❌ 条件付きインポート
let Component;
if (Platform.OS === 'ios') {
  Component = require('./IOSComponent');
} else {
  Component = require('./AndroidComponent');
}
```

**解決策**:
```typescript
// ✅ プラットフォーム固有ファイルを使用
// Component.ios.tsx
export default function Component() {
  return <View />;
}

// Component.android.tsx
export default function Component() {
  return <View />;
}

// 使用時
import Component from './Component';
```

### シナリオ5: 環境変数の問題

**エラーメッセージ**:
```
undefined is not an object (evaluating 'process.env.API_KEY')
```

**解決策**:
1. `.env`ファイルを確認
```bash
# .env
EXPO_PUBLIC_API_KEY=your-api-key
```

2. 正しい接頭辞を使用
```typescript
// ✅ Expo環境変数
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

// ❌ Expo接頭辞なし
const apiKey = process.env.API_KEY; // undefined
```

3. 開発サーバーを再起動
```bash
npx expo start --clear
```

## 予防策

### 1. registerRootComponentを使用

```typescript
// ✅ 推奨: Expoのヘルパー関数
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### 2. 依存関係の一貫性を保つ

```bash
# 定期的に依存関係をチェック
npx expo-doctor

# 依存関係を修正
npx expo install --fix
```

### 3. エラーバウンダリを実装

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
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

// 使用例
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 4. 適切なログを実装

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // クラッシュレポートサービスに送信
  },
};

// 使用例
try {
  initializeApp();
} catch (error) {
  logger.error('Failed to initialize app', error);
  throw error;
}
```

## デバッグのヒント

### コンソールログを追加

```typescript
// App.tsx
console.log('App.tsx loaded');

export default function App() {
  console.log('App component rendering');

  return <View />;
}

// index.js
console.log('index.js loaded');
import { registerRootComponent } from 'expo';
import App from './App';

console.log('Registering root component');
registerRootComponent(App);
console.log('Root component registered');
```

### React DevToolsでコンポーネントツリーを確認

```bash
# React DevToolsを起動
npx react-devtools
```

### ソースマップを有効化

```json
// app.json
{
  "expo": {
    "packagerOpts": {
      "sourceExts": ["js", "json", "ts", "tsx", "jsx"]
    }
  }
}
```

## まとめ

"Application has not been registered"エラーは、以下の方法で解決できます：

### 主な原因
- **アプリ登録前の例外**: インポート、構文、ランタイムエラー
- **登録ミスマッチ**: `registerRootComponent`の誤った使用
- **ネイティブモジュールの問題**: 複数バージョンの共存

### トラブルシューティング手順
1. ログを確認してエラーメッセージの前のエラーを特定
2. 正しいAppKey登録を確認
3. 依存関係のバージョンを検証
4. 開発サーバーへの接続を確認
5. 本番モードでテスト
6. キャッシュをクリア
7. ネイティブコードを再ビルド

### 予防策
- `registerRootComponent`を使用
- 依存関係の一貫性を維持
- エラーバウンダリの実装
- 適切なログの実装

### デバッグのヒント
- コンソールログを戦略的に配置
- React DevToolsでコンポーネントツリーを検査
- ソースマップを有効化して詳細なスタックトレースを取得

これらの手順とヒントを活用して、エラーを効率的に診断し解決できます。
