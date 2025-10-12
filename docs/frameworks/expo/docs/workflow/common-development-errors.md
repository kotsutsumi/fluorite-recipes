# よくある開発エラー

Expoを使用する開発者が遭遇する一般的な開発エラーのリストです。

## エラーとデバッグ

### Metro bundler ECONNREFUSED 127.0.0.1:19001

#### 症状

ローカル開発サーバーへの接続が妨げられるエラー。

#### 解決策

1. **`.expo`ディレクトリを削除**

```bash
rm -rf .expo
```

2. **ネットワーク/ファイアウォールの問題を確認**

- ファイアウォール設定を確認
- VPNを無効化
- アンチウイルスソフトウェアを一時的に無効化

3. **開発サーバーを再起動**

```bash
npx expo start --clear
```

### Module AppRegistry is not a registered callable module

#### 症状

起動時にJavaScriptバンドルの実行がブロックされる。

#### 解決策

1. **本番モードで実行**

```bash
npx expo start --no-dev --minify
```

2. **デバイスログを確認**

Android Studio（Logcat）またはXcodeでデバイスログを確認します。

3. **Babel設定を検証**

`babel.config.js`が正しく設定されているか確認します：

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

4. **minifierの非互換性を調査**

`metro.config.js`のminifier設定を確認します。

5. **キャッシュをクリア**

```bash
npx expo start --clear
```

### npm ERR! No git binary found in $PATH

#### 症状

gitがインストールされていないか、システムパスに設定されていない。

#### 解決策

1. **gitをインストール**

##### macOS

```bash
brew install git
```

##### Windows

[Git for Windows](https://git-scm.com/download/win)をダウンロードしてインストールします。

##### Linux

```bash
sudo apt-get install git
# または
sudo yum install git
```

2. **gitがパスに設定されているか確認**

```bash
git --version
```

### XX.X.X is not a valid SDK version

#### 症状

SDKバージョンが非推奨またはサポートされていない。

#### 解決策

1. **サポートされているSDKバージョンにアップグレード**

```bash
npx expo upgrade
```

2. **`app.json`を更新**

```json
{
  "expo": {
    "sdkVersion": "49.0.0"
  }
}
```

3. **依存関係をインストール**

```bash
npm install
```

### React Native version mismatch

#### 症状

開発サーバーとアプリが異なるReact Nativeバージョンを使用している。

#### 解決策

1. **`app.json`と`package.json`でReact Nativeバージョンを揃える**

`app.json`：

```json
{
  "expo": {
    "sdkVersion": "49.0.0"
  }
}
```

`package.json`：

```json
{
  "dependencies": {
    "react-native": "0.72.0"
  }
}
```

2. **依存関係を再インストール**

```bash
rm -rf node_modules
npm install
```

3. **キャッシュをクリア**

```bash
npx expo start --clear
```

### Application has not been registered

#### 症状

ネイティブ側とJavaScript側のアプリ登録の不一致。

#### 解決策

1. **ネイティブ側とJavaScript側でAppKeyを揃える**

JavaScript側（`index.js`または`App.js`）：

```javascript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

ネイティブ側（Android `MainApplication.java`）：

```java
@Override
protected String getMainComponentName() {
  return "main"; // JavaScript側と一致させる
}
```

2. **アプリを再ビルド**

```bash
npx expo run:android
# または
npx expo run:ios
```

### Application not behaving as expected

#### 症状

キャッシュが現在のアプリケーション状態を表示するのを妨げている可能性がある。

#### 解決策

1. **プロジェクトキャッシュをクリア**

```bash
npx expo start --clear
```

2. **Metroキャッシュをクリア**

```bash
rm -rf .expo
rm -rf node_modules/.cache
```

3. **Watchmanキャッシュをクリア（macOS/Linux）**

```bash
watchman watch-del-all
```

4. **依存関係を再インストール**

```bash
rm -rf node_modules
npm install
```

5. **ネイティブビルドをクリーン**

Android：

```bash
cd android
./gradlew clean
cd ..
```

iOS：

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## 追加のトラブルシューティング

### ポートが使用中

#### 症状

ポート19000または19001が既に使用されている。

#### 解決策

1. **別のポートを使用**

```bash
npx expo start --port 19002
```

2. **使用中のプロセスを終了**

##### macOS/Linux

```bash
lsof -i :19000
kill -9 <PID>
```

##### Windows

```cmd
netstat -ano | findstr :19000
taskkill /PID <PID> /F
```

### ビルドエラー

#### 症状

アプリのビルドに失敗する。

#### 解決策

1. **依存関係を確認**

```bash
npx expo-doctor
```

2. **ネイティブディレクトリを再生成**

```bash
npx expo prebuild --clean
```

3. **Android/iOSキャッシュをクリア**

## さらなる支援

ドキュメントは貢献を奨励し、さらなる支援のためのリンクを提供しています：

- [Expo Forums](https://forums.expo.dev/)
- [GitHub Issues](https://github.com/expo/expo/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

## まとめ

一般的な開発エラーを理解し、適切な解決策を適用することで、スムーズな開発体験が実現できます。問題が解決しない場合は、Expoコミュニティやサポートチャネルに相談してください。
