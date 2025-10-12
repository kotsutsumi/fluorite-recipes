# トラブルシューティング概要

Expoアプリ開発における一般的な問題の診断と解決方法を学びます。

## 概要

このガイドは、Expo開発で遭遇する可能性のある問題を特定、診断、解決するための構造化されたアプローチを提供します。

**主なカテゴリ**：
- エラーと警告
- ランタイムデバッグ
- プラットフォーム固有の問題
- ビルドとデプロイ
- パフォーマンス問題

## エラーと警告

### 一般的なエラー

#### 1. "Application has not been registered"

**症状**: アプリの起動時にエラーが表示される

**原因**：
- アプリ登録前に例外が発生
- ルートコンポーネントの登録ミスマッチ
- ネイティブモジュールの依存関係の複数バージョン

**解決策**：
- ログでエラーメッセージの前にあるエラーを確認
- `registerRootComponent`の使用を確認
- 依存関係のバージョンを検証

詳細: [application-has-not-been-registered.md](./application-has-not-been-registered.md)

#### 2. React Native バージョンミスマッチ

**症状**: "React Native version mismatch. JavaScript version: X.XX.X, Native version: X.XX.X"

**原因**：
- React NativeまたはExpo SDKのバージョンアップグレード後
- 誤ったローカル開発サーバーへの接続

**解決策**：
```bash
# すべての開発サーバーを閉じる
# app.jsonのSDKバージョンがpackage.jsonと一致するか確認

# バージョン互換性をチェック
npx expo-doctor

# 依存関係を修正
npx expo install --fix

# キャッシュをクリア
rm -rf node_modules
npm cache clean --force
npm install
npx expo start --clear
```

詳細: [react-native-version-mismatch.md](./react-native-version-mismatch.md)

### ログとエラースタックトレースの表示

#### デバイスログの確認

**iOS（実機）**：
```bash
# Xcodeコンソール
# Xcode → Window → Devices and Simulators → デバイスを選択 → Open Console
```

**Android（実機）**：
```bash
# logcatを使用
adb logcat
```

**Expo Go**：
```bash
# Expo CLI開発サーバーでログを表示
npx expo start
# ターミナルにログが表示される
```

#### React Native Debuggerの使用

```bash
# React Native Debuggerをインストール
# macOS
brew install --cask react-native-debugger

# または、手動でダウンロード
# https://github.com/jhen0409/react-native-debugger
```

**設定**：
1. React Native Debuggerを起動
2. Expo開発サーバーを起動
3. デバイスでデバッグメニューを開く（シェイクまたはCmd+D/Ctrl+M）
4. "Debug Remote JS"を選択

### キャッシュのクリア

#### macOS/Linux

```bash
# Expo CLI with npm
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
rm -fr $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
npx expo start --clear
```

詳細: [clear-cache-macos-linux.md](./clear-cache-macos-linux.md)

#### Windows

```bash
# Expo CLI with npm
rm -rf node_modules
npm cache clean --force
npm install
watchman watch-del-all
del %localappdata%\Temp\haste-map-*
del %localappdata%\Temp\metro-cache
npx expo start --clear
```

詳細: [clear-cache-windows.md](./clear-cache-windows.md)

## ランタイムデバッグ

### ネイティブランタイムの問題の検査

#### iOSシミュレーター

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

#### Androidエミュレーター

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
```

**使用方法**：
1. `react-devtools`を起動
2. Expoアプリを起動
3. 自動的に接続される

#### Flipper

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

### Dev Toolsプラグイン

#### Reactotron

```bash
# Reactotronをインストール
npm install --save-dev reactotron-react-native

# 初期化
# app/_layout.tsx
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

## 一般的なデバッグ戦略

### 1. エラーメッセージの分析

```typescript
// エラーの詳細情報を取得
console.log('Error name:', error.name);
console.log('Error message:', error.message);
console.log('Error stack:', error.stack);
```

### 2. ログの確認

```typescript
// 詳細なログを追加
console.log('Component mounted');
console.log('Data:', JSON.stringify(data, null, 2));
console.warn('Warning: This is deprecated');
console.error('Error occurred:', error);
```

### 3. 開発ツールの活用

```typescript
// React DevToolsでコンポーネントを検査
// プロパティと状態を確認
// パフォーマンスプロファイリング
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

| Expo SDK | React Native |
|----------|--------------|
| SDK 51   | 0.74.x       |
| SDK 50   | 0.73.x       |
| SDK 49   | 0.72.x       |
| SDK 48   | 0.71.x       |

**互換性の確認**：
```bash
# 現在のバージョンを確認
npx expo-doctor

# 依存関係を修正
npx expo install --fix
```

## ネットワークとプロキシ

### プロキシ設定

**企業ネットワークでの開発**：

詳細: [proxies.md](./proxies.md)

**基本設定**：
```bash
# npmプロキシ設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# gitプロキシ設定
git config --global http.proxy http://proxy.company.com:8080
```

## パフォーマンス問題

### 遅いビルド時間

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

**ドキュメント**：
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

**フォーラム**：
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)

**GitHub**：
- [Expo GitHub](https://github.com/expo/expo)
- [React Native GitHub](https://github.com/facebook/react-native)

### コミュニティサポート

**Discord**：
- [Expo Discord](https://chat.expo.dev/)
- React Native Discord

**Stack Overflow**：
- [expo](https://stackoverflow.com/questions/tagged/expo)タグ
- [react-native](https://stackoverflow.com/questions/tagged/react-native)タグ

### ニュースレターとブログ

- [Expo Newsletter](https://expo.dev/newsletter)
- [Expo Blog](https://blog.expo.dev/)

## トラブルシューティングチェックリスト

### 問題が発生した場合

1. **エラーメッセージを読む**
   - 完全なエラースタックトレースを確認
   - 前後のログメッセージを確認

2. **バージョンを確認**
   - `npx expo-doctor`を実行
   - Expo SDKとReact Nativeのバージョンを確認

3. **キャッシュをクリア**
   - `npx expo start --clear`
   - `rm -rf node_modules && npm install`

4. **依存関係を更新**
   - `npx expo install --fix`
   - `npm update`

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

1. **定期的な更新**
```bash
# 週次で依存関係を更新
npx expo install --fix
npm update
```

2. **バージョン管理**
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

3. **ドキュメント化**
```markdown
# プロジェクトのREADME.md
## 既知の問題
- Issue 1: 説明と解決策
- Issue 2: 説明と解決策
```

4. **テスト**
```bash
# 変更後に必ずテスト
npx expo start
# 複数のプラットフォームで確認
```

## まとめ

このトラブルシューティングガイドは、以下の方法を提供します：

### 主なトラブルシューティング領域
- **エラーと警告**: ログ分析、エラー解決、キャッシュクリア
- **ランタイムデバッグ**: ネイティブ問題の検査、デバッグツール
- **プラットフォーム固有**: Expo Router、プッシュ通知、EAS
- **パフォーマンス**: ビルド最適化、アプリ起動高速化

### デバッグ戦略
1. エラーメッセージの徹底的な分析
2. ログとスタックトレースの確認
3. 開発ツールの効果的な活用
4. バージョン互換性の検証
5. キャッシュクリアと依存関係の更新

### サポートリソース
- 公式ドキュメントとフォーラム
- GitHub issueとプルリクエスト
- Discord コミュニティ
- Stack Overflow

### 予防策
- 定期的な依存関係の更新
- 正確なバージョン指定
- 既知の問題の文書化
- 包括的なテスト

これらの戦略とリソースを活用して、Expo開発での問題を効率的に診断し解決できます。
