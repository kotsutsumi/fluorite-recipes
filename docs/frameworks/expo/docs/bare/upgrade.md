# ネイティブプロジェクトアップグレードヘルパー

Native Project Upgrade Helperは、Expo SDKネイティブプロジェクトをアップグレードする際に、SDKバージョン間のファイルごとの差分を提供するツールです。

## 主な目的

Native Project Upgrade Helperは、以下を支援します：

- ネイティブプロジェクトをアップグレードする際に必要な変更を特定
- 現在のSDKバージョンとターゲットSDKバージョン間のネイティブプロジェクトファイルを比較
- React Native Upgrade Helperに似ていますが、Expoモジュールに焦点を当てています

## 使用方法

### 1. Expo SDKと依存関係のアップグレード

まず、Expo SDKと依存関係をアップグレードします：

```bash
npx expo install expo@latest
npx expo install --fix
```

### 2. Upgrade Helperの使用

[Native Project Upgrade Helper](https://expo.dev/upgrade-helper)にアクセスします。

### 3. バージョンの選択

- **From**: 現在のSDKバージョン（例：SDK 53）
- **To**: ターゲットSDKバージョン（例：SDK 54）

### 4. 差分の確認

ツールは、アップグレードに必要なすべての変更を表示します。

### 5. 変更の適用

ファイルをコピーまたは編集して、変更を手動で適用します。

## 変更例（SDK 53からSDK 54）

### Gradleラッパーバージョンの更新

`android/gradle/wrapper/gradle-wrapper.properties`：

```diff
-distributionUrl=https\://services.gradle.org/distributions/gradle-8.8-all.zip
+distributionUrl=https\://services.gradle.org/distributions/gradle-8.9-all.zip
```

### AndroidとiOS設定ファイルの変更

複数の設定ファイルが更新される可能性があります：

- `android/build.gradle`
- `android/app/build.gradle`
- `ios/Podfile`
- `package.json`

### React NativeとExpoパッケージバージョンの更新

`package.json`：

```diff
{
  "dependencies": {
-   "expo": "~53.0.0",
+   "expo": "~54.0.0",
-   "react-native": "0.76.0",
+   "react-native": "0.77.0"
  }
}
```

### ビルドとプロジェクト設定の調整

`android/gradle.properties`、`ios/YourApp.xcodeproj/project.pbxproj`などの設定ファイルが更新される可能性があります。

## 推奨される代替案

> **興味がありますか？** ネイティブコードのアップグレードを完全に回避したい場合は、[Continuous Native Generation（CNG）](/workflow/continuous-native-generation)を参照してください。

### Continuous Native Generation（CNG）の利点

- **ネイティブコードの手動アップグレードが不要**
- **自動ネイティブプロジェクト生成**
- **設定プラグインによるカスタマイズ**

### CNGへの移行

```bash
# ネイティブディレクトリを削除
rm -rf android ios

# Prebuildを実行
npx expo prebuild

# .gitignoreに追加
echo "android/" >> .gitignore
echo "ios/" >> .gitignore
```

## ステップバイステップのアップグレードプロセス

### 1. 現在のバージョンの確認

```bash
npx expo --version
```

### 2. バックアップの作成

```bash
git add .
git commit -m "Backup before upgrade"
```

### 3. Expo SDKのアップグレード

```bash
npx expo install expo@latest
```

### 4. 依存関係の修正

```bash
npx expo install --fix
```

### 5. Upgrade Helperで差分を確認

[Upgrade Helper](https://expo.dev/upgrade-helper)で変更を確認します。

### 6. ネイティブファイルの更新

差分に基づいて、ネイティブファイルを手動で更新します。

### 7. 依存関係の再インストール

```bash
# node_modulesを削除
rm -rf node_modules

# 依存関係を再インストール
npm install

# iOSポッドを再インストール
npx pod-install
```

### 8. キャッシュのクリア

```bash
npx expo start --clear
```

### 9. アプリのビルドとテスト

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### 10. 問題の修正

ビルドエラーや実行時エラーを修正します。

## トラブルシューティング

### ビルドエラー

#### Android

```bash
cd android
./gradlew clean
cd ..
```

#### iOS

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### 依存関係の競合

`package.json`で依存関係のバージョンを確認してください。

### ネイティブモジュールの問題

ネイティブモジュールが新しいSDKバージョンと互換性があるか確認してください。

## ベストプラクティス

### 1. 段階的なアップグレード

複数のバージョンをスキップするのではなく、1つずつアップグレードしてください。

### 2. 十分なテスト

アップグレード後、アプリを十分にテストしてください。

### 3. チームとのコミュニケーション

チームメンバーにアップグレードについて通知してください。

### 4. CI/CDの更新

CI/CDパイプラインが新しいSDKバージョンをサポートしているか確認してください。

## CNGへの移行を検討

手動でネイティブコードをアップグレードすることに疲れた場合は、Continuous Native Generation（CNG）への移行を検討してください：

### CNGの利点

- **自動ネイティブプロジェクト生成**
- **アップグレードの簡素化**
- **設定プラグインによる柔軟性**

### 移行手順

1. `.gitignore`に`android/`と`ios/`を追加
2. `npx expo prebuild`を実行してネイティブプロジェクトを生成
3. 必要に応じて設定プラグインを使用してカスタマイズ

## まとめ

Native Project Upgrade Helperは、Expo SDKネイティブプロジェクトをアップグレードする際に役立つツールです。差分を確認して変更を手動で適用することで、アップグレードをスムーズに進めることができます。ただし、手動アップグレードを避けたい場合は、Continuous Native Generation（CNG）の採用を検討してください。
