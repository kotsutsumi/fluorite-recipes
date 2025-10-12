# eas.jsonによる設定

## EAS Build

### ネイティブプラットフォーム共通のプロパティ

`eas.json`ファイルは、EAS BuildおよびSubmitサービスを様々なプロパティで設定できます：

主要プロパティ：
- `withoutCredentials`: 認証情報の設定をスキップするブール値
- `extends`: 別のプロファイルから設定を継承
- `credentialsSource`: 認証情報のソースを選択（ローカルまたはリモート）
- `distribution`: アプリの配布方法（ストアまたは内部）
- `developmentClient`: 開発ビルドを生成
- `resourceClass`: ビルドサーバーのリソースを指定
- `env`: ビルド中の環境変数を設定

### Android固有のオプション

Android設定には以下が含まれます：
- `image`: ビルド環境イメージ
- `buildType`: 成果物のタイプを選択（app-bundleまたはAPK）
- `gradleCommand`: カスタムGradleビルドタスク
- `autoIncrement`: バージョンの自動インクリメント

### iOS固有のオプション

iOS設定には以下が含まれます：
- `simulator`: iOSシミュレーター用のビルド
- `enterpriseProvisioning`: プロビジョニング方法
- `scheme`: Xcodeプロジェクトのスキーム
- `buildConfiguration`: Xcodeビルド設定

## EAS Submit

### Android Submit オプション

Android提出の主要プロパティ：
- `serviceAccountKeyPath`: Google Service Accountキーのパス
- `track`: Google Playリリーストラック
- `releaseStatus`: リリースステータスの設定

### iOS Submit オプション

iOS提出の主要プロパティ：
- `appleId`: Apple IDユーザー名
- `ascAppId`: App Store ConnectアプリケーションID
- `appleTeamId`: Apple Developer Team ID
- `metadataPath`: ストア設定ファイルのパス

このドキュメントは、ExpoのEASサービスを使用してモバイルアプリケーションをビルドおよび提出するための包括的な設定オプションを提供します。
