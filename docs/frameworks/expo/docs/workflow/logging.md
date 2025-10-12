# ログの表示

React Nativeアプリでのログ記録は、Webブラウザと同様に機能します。`console.log`、`console.warn`、`console.error`などの標準的なコンソールメソッドを使用できます。

## コンソールログ

`npx expo start`を実行してデバイスを接続すると、コンソールログがターミナルプロセスに表示されます。

### 低忠実度ログ

これらのログはランタイムからExpo CLIにWebSocket経由で送信されるため、結果は低忠実度です。

### 高忠実度ログ

高忠実度ログと`console.table`などの高度なロギング機能を使用するには：

1. **Hermesを使用した開発ビルドを作成**
2. **インスペクターを接続**

#### 開発ビルドの作成

```bash
npx expo install expo-dev-client
npx expo run:android
# または
npx expo run:ios
```

#### インスペクターの接続

ChromeまたはEdgeで以下を開きます：

```
chrome://inspect
```

または

```
edge://inspect
```

## ネイティブログ

ネイティブランタイムログは、以下で表示できます：

### Android Studio

1. Android Studioを開く
2. **Logcat**タブを選択
3. デバイスまたはエミュレーターを選択
4. ログレベルをフィルター（Verbose、Debug、Info、Warn、Error）

### Xcode

1. Xcodeを開く
2. **Window** → **Devices and Simulators**
3. デバイスまたはシミュレーターを選択
4. **Open Console**をクリック

詳細については、「ネイティブデバッグ」ドキュメントを参照してください。

## システムログ

デバイスの包括的なシステムログを表示するには：

### Android

```bash
npx react-native log-android
```

このコマンドは、デバイスで発生しているすべてのこと（他のアプリやオペレーティングシステムからのログを含む）のログを表示します。

#### フィルター例

特定のタグでフィルターする：

```bash
npx react-native log-android | grep "MyApp"
```

### iOS

```bash
npx react-native log-ios
```

このコマンドも、デバイスで発生しているすべてのことのログを表示します。

#### フィルター例

特定のプロセスでフィルターする：

```bash
npx react-native log-ios | grep "MyApp"
```

## ロギングのベストプラクティス

### 1. 適切なログレベルを使用

```typescript
// 一般的な情報
console.log('アプリが起動しました');

// 警告
console.warn('非推奨のAPIを使用しています');

// エラー
console.error('データの読み込みに失敗しました', error);
```

### 2. 構造化ログ

```typescript
console.log('ユーザーログイン', {
  userId: user.id,
  timestamp: new Date().toISOString(),
  platform: Platform.OS,
});
```

### 3. 本番環境でのログ削除

本番ビルドからコンソールログを削除します（「JavaScriptの圧縮」を参照）：

```javascript
// metro.config.js
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
  },
};
```

### 4. カスタムロガーの使用

```typescript
class Logger {
  static log(message: string, data?: any) {
    if (__DEV__) {
      console.log(`[LOG] ${message}`, data);
    }
  }

  static error(message: string, error?: Error) {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error);
    }
    // 本番環境ではエラー追跡サービスに送信
  }
}

// 使用例
Logger.log('データを読み込み中', { count: items.length });
Logger.error('APIエラー', error);
```

## デバッグツール

### React Native Debugger

React Native Debuggerは、より高度なデバッグ機能を提供します：

```bash
# インストール
brew install --cask react-native-debugger
```

### Flipper

Flipperは、モバイルアプリ用の統合デバッグプラットフォームです：

- ネットワークインスペクター
- レイアウトインスペクター
- ログビューアー
- クラッシュレポーター

## トラブルシューティング

### ログが表示されない

#### 確認事項

1. **デバイスが接続されているか**：`npx expo start`で確認
2. **正しいログレベルか**：Verbose以上に設定
3. **キャッシュをクリア**：`npx expo start --clear`

### ログが遅い

Webソケット経由のログは遅延がある場合があります。高忠実度ログには、インスペクターを使用してください。

## まとめ

Expoアプリのログを表示する方法は複数あります：

- **コンソールログ**: 基本的なロギング
- **ネイティブログ**: Android StudioとXcode
- **システムログ**: `react-native log-android`と`react-native log-ios`
- **インスペクター**: 高忠実度デバッグ

適切なロギング方法を選択することで、効率的なデバッグとトラブルシューティングが可能になります。
