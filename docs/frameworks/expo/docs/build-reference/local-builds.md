# localフラグを使用してEAS Buildをローカルで実行する

--localフラグを使用して、マシンまたはカスタムインフラストラクチャでローカルにEAS Buildを使用する方法を学びます。

---

`eas build --local`フラグを使用して、通常EAS Buildサーバーで実行されるのと同じビルドプロセスをマシン上で直接実行できます。これは、クラウドビルドで発生しているビルドの失敗をデバッグするための便利な方法です。

Terminalコマンド：
```
eas build --platform android --local
# または
eas build --platform ios --local
```

## 前提条件

Expoで認証される必要があります：
- `eas login`を実行
- または、トークンベース認証を使用して`EXPO_TOKEN`を設定

## ローカルビルドの使用例

- EASサーバーでのビルド失敗のデバッグ
- サードパーティのCI/CDサービスを制限する会社のポリシーのサポート

## デバッグ用のローカルビルドの使用

ローカルビルドのデバッグでサポートされている環境変数：
- `EAS_LOCAL_BUILD_SKIP_CLEANUP=1` - 作業ディレクトリのクリーンアップを無効化
- `EAS_LOCAL_BUILD_WORKINGDIR` - 作業ディレクトリを指定
- `EAS_LOCAL_BUILD_ARTIFACTS_DIR` - アーティファクトディレクトリを設定

## 制限事項

ローカルビルドの制限には以下が含まれます：
- 特定のプラットフォームのみのビルド
- バージョンのカスタマイズ不可
- キャッシングのサポートなし
- 環境変数のサポートが限定的
- 手動でのツールのインストールが必要
- Windowsではサポートされていない（macOSとLinuxのみ）

## 開発ビルドと本番ビルドのローカルでのアプリコンパイル

開発ビルドの場合は、以下を使用します：
- `npx expo run:android`
- `npx expo run:ios`

本番ビルドの場合は、Android StudioとXcodeがインストールされている必要があります。

`eas build --local`フラグは、ローカル開発コンパイルとは異なるアプローチを提供します。

## ローカルビルドの利点

1. **デバッグの容易さ**: ビルドプロセスをステップバイステップで確認可能
2. **迅速なイテレーション**: ネットワークのアップロード時間を節約
3. **プライバシー**: コードがマシンから離れない
4. **カスタマイズ**: ビルド環境を完全に制御

## ローカルビルドのセットアップ

### Android用のセットアップ

```bash
# 必要なツールをインストール
# - Android Studio
# - Android SDK
# - Java JDK

# 環境変数を設定
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### iOS用のセットアップ

```bash
# 必要なツールをインストール
# - Xcode (App Storeから)
# - CocoaPods

sudo gem install cocoapods
```

## ローカルビルドの実行例

```bash
# デバッグ情報を保持してビルド
EAS_LOCAL_BUILD_SKIP_CLEANUP=1 eas build --platform android --local

# カスタム作業ディレクトリを使用
EAS_LOCAL_BUILD_WORKINGDIR=/tmp/my-build eas build --platform ios --local

# アーティファクトを特定のディレクトリに保存
EAS_LOCAL_BUILD_ARTIFACTS_DIR=./build-output eas build --platform android --local
```

これらのオプションを使用することで、ローカルでのビルドプロセスを完全に制御し、問題を迅速にデバッグできます。
