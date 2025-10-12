# キャッシュのクリア（macOS/Linux）

macOSとLinuxでExpoおよびReact Nativeプロジェクトのキャッシュをクリアする方法を学びます。

## キャッシュクリアが必要な場合

**症状**:
- 古いコードが実行される
- 変更が反映されない
- ビルドエラーが解決しない
- 依存関係の問題
- 予期しない動作

**キャッシュクリアで解決できる問題**:
- 古いJavaScriptバンドル
- 破損したMetroキャッシュ
- 古いnode_modules
- Watchmanの問題
- パッケージマネージャーのキャッシュ

## Expo CLI（npm使用）

### 完全なキャッシュクリア手順

```bash
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

### 各コマンドの説明

#### 1. node_modulesを削除

```bash
rm -rf node_modules
```

**目的**: すべてのインストール済みパッケージを削除

**理由**:
- 破損したパッケージファイル
- バージョンの不整合
- シンボリックリンクの問題

#### 2. npmキャッシュをクリア

```bash
npm cache clean --force
```

**目的**: グローバルnpmキャッシュをクリア

**理由**:
- 古いパッケージメタデータ
- 破損したtarball
- キャッシュの不整合

**キャッシュの場所を確認**:
```bash
npm config get cache
# 出力例: /Users/username/.npm
```

#### 3. 依存関係を再インストール

```bash
npm install
```

**目的**: package.jsonからすべての依存関係を再インストール

**オプション**:
```bash
# より詳細なログを表示
npm install --verbose

# クリーンインストール（package-lock.jsonから）
npm ci
```

#### 4. Watchmanキャッシュをクリア

```bash
watchman watch-del-all
```

**目的**: Facebookのファイルウォッチャーサービスをリセット

**理由**:
- ファイル変更の検出問題
- 古いウォッチリスト
- ウォッチマンの状態の破損

**Watchmanがインストールされていない場合**:
```bash
# Homebrewでインストール
brew install watchman
```

#### 5. Hasteマップキャッシュをクリア

```bash
rm -fr $TMPDIR/haste-map-*
```

**目的**: Metroバンドラーのモジュールマップをクリア

**理由**:
- 古いモジュール解決情報
- ファイルシステムの変更が反映されない

**手動でディレクトリを確認**:
```bash
echo $TMPDIR
ls -la $TMPDIR | grep haste-map
```

#### 6. Metroキャッシュをクリア

```bash
rm -rf $TMPDIR/metro-cache
```

**目的**: Metroバンドラーのキャッシュをクリア

**理由**:
- 古いトランスパイル結果
- バンドルの不整合
- 依存関係グラフの問題

#### 7. 開発サーバーをクリアして起動

```bash
npx expo start --clear
```

**目的**: Metroバンドラーキャッシュをクリアして開発サーバーを起動

**その他のオプション**:
```bash
# リセット状態で起動
npx expo start --clear --reset-cache

# オフラインモード
npx expo start --offline
```

## Expo CLI（Yarn使用）

### 完全なキャッシュクリア手順

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: Yarnキャッシュをクリア
yarn cache clean

# ステップ3: 依存関係を再インストール
yarn

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア
rm -fr $TMPDIR/haste-map-*

# ステップ6: Metroキャッシュをクリア
rm -rf $TMPDIR/metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

### Yarn固有のコマンド

#### Yarnキャッシュをクリア

```bash
yarn cache clean
```

**Yarnキャッシュの場所を確認**:
```bash
yarn cache dir
# 出力例: /Users/username/Library/Caches/Yarn/v6
```

**特定のパッケージのみクリア**:
```bash
yarn cache clean expo
yarn cache clean react-native
```

#### Yarnロックファイルを削除して再生成

```bash
# yarn.lockを削除
rm yarn.lock

# 依存関係を再インストール
yarn

# または、既存のロックファイルを尊重
yarn install --frozen-lockfile
```

## React Native CLI（npm使用）

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Metroキャッシュをクリア
rm -fr $TMPDIR/react-*

# ステップ6: 開発サーバーをクリアして起動
npx react-native start --reset-cache
```

## React Native CLI（Yarn使用）

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: Yarnキャッシュをクリア
yarn cache clean

# ステップ3: 依存関係を再インストール
yarn

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Metroキャッシュをクリア
rm -fr $TMPDIR/react-*

# ステップ6: 開発サーバーをクリアして起動
npx react-native start --reset-cache
```

## プラットフォーム固有のキャッシュクリア

### iOSキャッシュのクリア

```bash
# Xcodeビルドキャッシュをクリア
rm -rf ~/Library/Developer/Xcode/DerivedData

# CocoaPodsキャッシュをクリア
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..

# iOSビルドフォルダをクリア
rm -rf ios/build

# 開発サーバーを再起動
npx expo start --clear
```

### Androidキャッシュのクリア

```bash
# Gradleキャッシュをクリア
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..

# Androidビルドフォルダをクリア
rm -rf android/app/build
rm -rf android/build

# Gradle globalキャッシュをクリア
rm -rf ~/.gradle/caches

# 開発サーバーを再起動
npx expo start --clear
```

## 環境固有のキャッシュ

### macOS固有

```bash
# 一時ファイルの場所
echo $TMPDIR
# 出力例: /var/folders/xx/yyyyyyyy/T/

# システムキャッシュをクリア（注意して使用）
sudo rm -rf /Library/Caches/*
sudo rm -rf ~/Library/Caches/*
```

### Linux固有

```bash
# 一時ファイルの場所
echo $TMPDIR
# 通常は /tmp または /var/tmp

# システムキャッシュをクリア
rm -rf /tmp/*
rm -rf ~/.cache/*
```

## トラブルシューティング後のキャッシュクリア

### 問題が解決しない場合の追加手順

#### 1. グローバルパッケージを再インストール

```bash
# Expo CLIを再インストール
npm uninstall -g expo-cli
npm install -g expo-cli

# EAS CLIを再インストール
npm uninstall -g eas-cli
npm install -g eas-cli
```

#### 2. 環境変数をリセット

```bash
# .bashrcまたは.zshrcを確認
cat ~/.zshrc | grep -i "expo\|react\|node"

# 不要な環境変数をコメントアウト
```

#### 3. Nodeバージョンを確認

```bash
# 現在のNodeバージョン
node -v

# npmバージョン
npm -v

# 推奨バージョンに更新（nvmを使用）
nvm install 20
nvm use 20
```

#### 4. プロジェクトを完全にクリーン

```bash
# すべてのキャッシュと生成ファイルを削除
rm -rf node_modules
rm -rf ios/build
rm -rf android/app/build
rm -rf android/build
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
rm -rf ~/Library/Developer/Xcode/DerivedData

# 依存関係を再インストール
npm install

# Watchmanをリセット
watchman watch-del-all

# 開発サーバーを起動
npx expo start --clear
```

## 便利なスクリプト

### package.jsonにカスタムスクリプトを追加

```json
{
  "scripts": {
    "start": "expo start",
    "clear": "expo start --clear",
    "reset": "rm -rf node_modules && npm install && watchman watch-del-all && npm start",
    "deep-clean": "rm -rf node_modules ios/build android/app/build && npm cache clean --force && npm install && npx expo start --clear"
  }
}
```

**使用方法**:
```bash
# 基本的なクリア
npm run clear

# リセット
npm run reset

# ディープクリーン
npm run deep-clean
```

### シェルエイリアスを作成

```bash
# ~/.zshrc または ~/.bashrc に追加
alias expo-clear='rm -rf node_modules && npm cache clean --force && npm install && watchman watch-del-all && npx expo start --clear'
alias expo-deep-clean='rm -rf node_modules ios/build android/app/build .expo $TMPDIR/metro-* $TMPDIR/haste-map-* && npm install && npx expo start --clear'
```

**使用方法**:
```bash
# クリアして起動
expo-clear

# ディープクリーン
expo-deep-clean
```

## ベストプラクティス

### 1. 定期的なキャッシュクリア

```bash
# 週次でキャッシュをクリア
# crontabで自動化
# 0 0 * * 0 cd /path/to/project && npm run reset
```

### 2. 問題発生時の最初のステップ

```bash
# 簡単なクリア
npx expo start --clear

# それでも解決しない場合
npm run reset
```

### 3. 大きな変更後のクリーン

```bash
# Expo SDKアップグレード後
npx expo install --fix
npm run deep-clean

# 新しい依存関係追加後
npm run reset
```

## 注意事項

### コマンド実行時の注意

**❌ 避けるべきこと**:
```bash
# ルート権限で実行しない
sudo rm -rf node_modules  # 不要

# すべてを削除しない
rm -rf /  # 危険！
```

**✅ 推奨**:
```bash
# プロジェクトディレクトリ内でのみ実行
cd /path/to/your/project
rm -rf node_modules
```

### バックアップの推奨

```bash
# 重要な変更前にバックアップ
# プロジェクトディレクトリ全体
cp -r /path/to/project /path/to/backup

# または、Gitを使用
git add .
git commit -m "Backup before cache clear"
```

## まとめ

macOS/Linuxでのキャッシュクリアは、以下の方法を提供します：

### 基本的なキャッシュクリア
1. node_modulesを削除
2. パッケージマネージャーキャッシュをクリア
3. 依存関係を再インストール
4. Watchmanをリセット
5. Metro/Hasteマップキャッシュをクリア
6. 開発サーバーをクリアして起動

### プラットフォーム固有
- **iOS**: XcodeキャッシュとCocoaPodsをクリア
- **Android**: Gradleキャッシュとビルドフォルダをクリア

### 便利なツール
- カスタムnpmスクリプト
- シェルエイリアス
- 自動化されたクリーニング

### ベストプラクティス
- 定期的なキャッシュクリア
- 問題発生時の段階的アプローチ
- 大きな変更後の完全クリーン
- 重要な変更前のバックアップ

これらの手順とツールを活用して、キャッシュ関連の問題を効率的に解決できます。
