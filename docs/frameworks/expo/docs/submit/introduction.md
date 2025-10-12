# EAS Submit の紹介

EAS Submitは、アプリのバイナリをGoogle Play StoreとApple App Storeに送信するためのホスト型サービスです。

## 主な機能

### Androidへの送信
- ビルドをGoogle Play Consoleにアップロード
- 複数のトラックをサポート：internal、alpha、beta、production
- productionトラックは承認後、すべてのユーザーがアプリを利用可能

### iOSへの送信
- ビルドをApp Store Connect/TestFlightにアップロード
- TestFlightでビルドが利用可能になる
- 本番環境への送信には、App Store Connect経由での手動送信が必要

## 送信プロセス

EAS Submitは以下の方法で起動できます：
- CLIコマンド
- ビルド完了後の自動送信
- CI/CDパイプライン経由

このサービスは、認証情報の管理と送信プロセスを処理することで、アプリの配信を簡素化します。アプリはそれぞれのアプリストアプラットフォームでの配信キューに追加されます。

## 開始方法

以下のガイドを参照してください：

- [Google Play Storeへの送信](/frameworks/expo/docs/submit/android)
- [Apple App Storeへの送信](/frameworks/expo/docs/submit/ios)
- [`eas.json`での送信設定](/frameworks/expo/docs/submit/eas-json)

プラットフォーム固有の送信ガイドに従って、送信ワークフローを設定してください。
