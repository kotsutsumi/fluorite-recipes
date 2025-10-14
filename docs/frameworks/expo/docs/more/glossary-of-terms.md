# Expo用語集

## 概要

このドキュメントは、Expo、React Native、およびクロスプラットフォームモバイル開発に関連する技術用語の包括的な用語集です。

## A

### Android

Googleによって開発されたモバイルオペレーティングシステム。React NativeとExpoアプリは、Androidデバイスで実行できます。

### Android Emulator

物理的なAndroidデバイスなしで、コンピューター上でAndroidアプリをテストするための仮想デバイス。

### Android Studio

Googleの公式Android開発環境。Android Emulatorと開発ツールが含まれています。

### App Store

Appleの公式アプリケーション配信プラットフォーム。iOSアプリはApp Storeを通じて配信されます。

### App.json

Expoプロジェクトの設定ファイル。アプリ名、アイコン、スプラッシュスクリーン、プラットフォーム固有の設定などを含みます。

### app.config.js

動的な設定が必要な場合に使用される、JavaScriptベースのExpo設定ファイル。`app.json`の代わりに使用できます。

### Asset

アプリで使用される画像、フォント、動画などのリソースファイル。

## B

### Bare Workflow

ネイティブの`android`と`ios`ディレクトリを含むExpoプロジェクト。ネイティブコードの完全なカスタマイズが可能です。

### Bundle

JavaScriptコードとアセットをパッケージ化したファイル。アプリの実行に必要なすべてのコードが含まれます。

### Bundler

JavaScriptファイルを単一のバンドルにまとめるツール。Expoでは、Metro Bundlerが使用されます。

## C

### Certificate

iOSアプリの署名に使用されるデジタル証明書。Apple Developer Programのメンバーシップが必要です。

### Channel

EAS Updateで使用される、アップデートを配信するための論理的なグループ。例：`production`、`staging`、`preview`。

### CI/CD

Continuous Integration / Continuous Deployment（継続的インテグレーション/継続的デプロイメント）。自動化されたビルドとデプロイメントプロセス。

### CLI

Command Line Interface（コマンドラインインターフェース）。ターミナルから実行されるコマンドベースのツール。

### Code Push

アプリストアを経由せずに、over-the-airでアプリを更新する技術。ExpoではEAS Updateがこの機能を提供します。

### Config Plugin

Expoアプリのネイティブ設定を変更するためのプラグインシステム。`app.json`または`app.config.js`で設定します。

### Continuous Native Generation (CNG)

ネイティブプロジェクトディレクトリを自動生成するExpoのアプローチ。`npx expo prebuild`コマンドで実行されます。

## D

### Deep Link

アプリの特定の画面やコンテンツに直接リンクするURL。

### Development Build

`expo-dev-client`パッケージを含むデバッグビルド。本番レベルのアプリ開発に推奨されます。

### Development Server

開発中にアプリにコードを提供するローカルサーバー。`npx expo start`で起動されます。

### DevTools

開発者向けのデバッグツール。React Developer Tools、Chrome DevToolsなどが含まれます。

### Dependency

プロジェクトが依存する外部のパッケージやライブラリ。`package.json`で管理されます。

## E

### EAS (Expo Application Services)

Expoが提供する、深く統合されたクラウドサービス群。EAS Build、EAS Submit、EAS Updateなどが含まれます。

### EAS Build

クラウドベースのビルドサービス。iOS、Android、Webアプリのビルドを自動化します。

### EAS Submit

アプリストアへの提出を自動化するサービス。App StoreとGoogle Play Storeに対応しています。

### EAS Update

over-the-airでのアップデート配信サービス。アプリストアの審査なしにアプリを更新できます。

### Environment Variables

アプリの動作を制御するための変数。APIキーやエンドポイントURLなどを保存します。

### Expo

React Nativeアプリを構築するためのオープンソースプラットフォームとツールセット。

### Expo CLI

Expoプロジェクトを管理するためのコマンドラインツール。

### expo-dev-client

Development Buildsを有効にするパッケージ。カスタムネイティブコードを含むアプリの開発に使用されます。

### Expo Go

Expoアプリをテストするためのサンドボックスアプリ。学習と実験に適しています。本番レベルのアプリには、Development Buildsの使用を推奨します。

### Expo Modules

デバイスとシステム機能にアクセスするためのネイティブモジュールのコレクション。

### Expo Router

ファイルベースのルーティングライブラリ。`app`ディレクトリの構造に基づいてナビゲーションを自動生成します。

### Expo SDK

デバイスとシステム機能にアクセスするためのnpmパッケージのコレクション。カメラ、位置情報、通知などの機能を提供します。

### Export

アプリのJavaScriptバンドルとアセットを、本番用にエクスポートするプロセス。`npx expo export`で実行されます。

## F

### Fast Refresh

コードの変更を即座にアプリに反映する開発機能。Metro Bundlerでサポートされています。

### File-Based Routing

ファイルシステムの構造に基づいてルーティングを定義する方法。Expo Routerで使用されます。

## G

### Git

バージョン管理システム。コードの変更履歴を追跡します。

### GitHub Actions

GitHubのCI/CDプラットフォーム。自動化されたビルドとデプロイメントワークフローを作成できます。

### Google Play Store

Googleの公式アプリケーション配信プラットフォーム。Androidアプリが配信されます。

## H

### Hermes

React Native向けに最適化されたJavaScriptエンジン。アプリの起動時間とメモリ使用量を改善します。

### Hot Reloading

コードの変更時にアプリを自動的にリロードする開発機能。現在はFast Refreshに置き換えられています。

## I

### iOS

Appleによって開発されたモバイルオペレーティングシステム。iPhoneとiPadで実行されます。

### iOS Simulator

物理的なiOSデバイスなしで、Mac上でiOSアプリをテストするための仮想デバイス。

## J

### JavaScript

Webとモバイルアプリ開発に使用されるプログラミング言語。React NativeとExpoの基盤です。

### JSX

JavaScriptの構文拡張。UIコンポーネントを宣言的に記述できます。

## K

### Keychain

iOSのセキュアなストレージシステム。パスワードやトークンなどの機密情報を保存します。

### Keystore

Androidアプリの署名に使用される暗号化キー。アプリの認証と更新に必要です。

## L

### Linking

アプリ内外でのディープリンクとURL処理を管理するAPI。

### Linter

コードの品質と一貫性をチェックするツール。ESLintが一般的に使用されます。

## M

### Managed Workflow

Expoが提供する標準化されたワークフロー。ネイティブコードの直接管理が不要です。現在は、Continuous Native Generation (CNG)に統合されています。

### Manifest

アプリのメタデータと設定を含むファイル。Expo Updatesプロトコルで使用されます。

### Metro Bundler

React Native向けのJavaScriptバンドラー。開発サーバーとプロダクションビルドの両方で使用されます。

### Module

再利用可能なコードの単位。ネイティブモジュールは、ネイティブコードをJavaScriptに公開します。

## N

### Native Code

プラットフォーム固有の言語（Objective-C、Swift、Java、Kotlin）で書かれたコード。

### Native Module

JavaScriptからネイティブプラットフォーム機能にアクセスするためのブリッジ。

### Navigation

アプリ内の画面間の移動を管理するシステム。React NavigationやExpo Routerが使用されます。

### Node.js

サーバーサイドJavaScriptランタイム。Expoツールとビルドプロセスに必要です。

### npm

Node Package Manager。JavaScriptパッケージのインストールと管理を行います。

### npx

npmパッケージを一時的に実行するツール。グローバルインストールなしでCLIツールを実行できます。

## O

### OTA (Over-The-Air)

アプリストアを経由せずに、ネットワーク経由でアプリを更新する方法。EAS Updateで提供されます。

## P

### Package Manager

依存関係を管理するツール。npm、yarn、pnpm、bunなどがあります。

### Prebuild

React Nativeプロジェクト用の一時的なネイティブ`android`と`ios`ディレクトリを生成するプロセス。`npx expo prebuild`で実行されます。

### Production Build

エンドユーザー向けに最適化されたアプリのビルド。デバッグ機能が無効化され、パフォーマンスが最適化されています。

### Provisioning Profile

iOSアプリの配布に必要なファイル。開発、アドホック、App Store配布用のプロファイルがあります。

### Push Notification

アプリがフォアグラウンドにない時でも、ユーザーに送信できる通知。

## Q

### QR Code

Expo Goやdevelopment buildsでアプリを起動するためにスキャンできる2次元バーコード。

## R

### React

ユーザーインターフェースを構築するためのJavaScriptライブラリ。

### React Native

Reactを使用してネイティブモバイルアプリを構築するためのフレームワーク。

### Release Build

本番環境用に最適化されたビルド。デバッグシンボルが削除され、コードが難読化されています。

### Runtime Version

アプリのバイナリバージョンを識別する文字列。EAS Updateの互換性管理に使用されます。

## S

### SDK (Software Development Kit)

アプリケーション開発のためのツール、ライブラリ、ドキュメントのコレクション。

### Simulator

物理デバイスをエミュレートする仮想環境。iOSではSimulator、AndroidではEmulatorと呼ばれます。

### Slug

アプリを識別するための一意の文字列。`app.json`の`slug`フィールドで定義されます。

### Splash Screen

アプリ起動時に表示される初期画面。

### State Management

アプリのデータとUIの状態を管理する方法。Redux、MobX、Context APIなどがあります。

### Stylesheet

ReactNativeでスタイルを定義するためのAPI。CSSに似た構文を使用します。

## T

### Tab Navigation

タブベースのナビゲーションパターン。画面の下部または上部にタブバーが表示されます。

### Telemetry

使用状況データの匿名収集。ツールの改善に使用されます。

### TestFlight

Appleのベータテストプラットフォーム。App Storeリリース前にiOSアプリをテストできます。

### TypeScript

JavaScriptのスーパーセット。静的型付けを追加し、コードの品質と保守性を向上させます。

## U

### Universal Link

iOSで、Webリンクとアプリのディープリンクの両方として機能するURL。

### Update

アプリストアを経由せずに配信される、アプリのJavaScriptとアセットの新しいバージョン。

## V

### Version

アプリのリリースを識別する番号。セマンティックバージョニング（例：1.0.0）が一般的です。

## W

### Web

ブラウザベースのプラットフォーム。React NativeアプリはReact Native Webを使用してWebで実行できます。

### Webpack

JavaScriptアプリケーションのための静的モジュールバンドラー。Expoは、Webビルドにwebpackを使用します。

## X

### Xcode

Appleの公式iOS開発環境。iOSアプリのビルドとテストに必要です。

## Y

### Yarn

npmの代替となるパッケージマネージャー。より高速で、決定論的な依存関係解決を提供します。

## 関連用語

### App Bundle

Androidアプリの新しい配布形式。APKよりも効率的で、ダウンロードサイズが小さくなります。

### App Clip

iOSの機能で、アプリ全体をインストールせずに、アプリの一部を素早く体験できます。

### CocoaPods

iOSプロジェクトの依存関係マネージャー。React Nativeのネイティブモジュールで使用されます。

### Fastlane

iOSとAndroidのビルド、テスト、リリースプロセスを自動化するツール。

### Gradle

Androidプロジェクトのビルドシステム。依存関係の管理とビルドタスクの自動化を行います。

### JSI (JavaScript Interface)

React NativeのJavaScriptとネイティブコード間の新しい通信レイヤー。

### Monorepo

複数のプロジェクトを単一のリポジトリで管理する開発アプローチ。

### React Native Directory

コミュニティによって管理される、React Nativeライブラリの検索可能なデータベース。

### React Native Web

React NativeコンポーネントをWebで実行できるようにするライブラリ。

### Storybook

UIコンポーネントを独立して開発・テストするためのツール。

### Turbo Modules

React Nativeの新しいネイティブモジュールシステム。JSIを使用して、より高速な通信を実現します。

## まとめ

この用語集は、Expoエコシステムと関連技術の理解を深めるための参考資料です。新しい用語や概念が追加されるたびに、このドキュメントは更新されます。

より詳細な情報が必要な場合は、[公式ドキュメント](https://docs.expo.dev/)を参照してください。
