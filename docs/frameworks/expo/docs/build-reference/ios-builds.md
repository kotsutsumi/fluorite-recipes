# iOSビルドプロセス

EAS BuildでiOSプロジェクトがどのようにビルドされるかを学びます。

* * *

このページでは、EAS BuildでiOSプロジェクトをビルドするプロセスについて説明します。ビルドサービスの実装の詳細に興味がある場合は、このページを読むと良いでしょう。

## ビルドプロセス

EAS BuildでiOSプロジェクトをビルドする手順を詳しく見てみましょう。まず、プロジェクトを準備するためにローカルマシン上でいくつかの手順を実行し、その後リモートサービスでプロジェクトをビルドします。

### ローカル手順

最初のフェーズはコンピューター上で行われます。EAS CLIが次の手順を完了する責任があります：

1. eas.jsonで`cli.requireCommit`が`true`に設定されている場合、gitインデックスがクリーンかどうかを確認します。これは、コミットされていない変更がないことを意味します。クリーンでない場合、EAS CLIはローカルの変更をコミットするオプションを提供するか、ビルドプロセスを中止します。

2. ビルドに必要な認証情報を準備します。
   - `builds.ios.PROFILE_NAME.credentialsSource`の値に応じて、認証情報はローカルのcredentials.jsonファイルまたはEASサーバーから取得されます。`remote`モードが選択されているが認証情報がまだ存在しない場合、認証情報を生成するように求められます。

3. bareプロジェクトには追加の手順が必要です：Xcodeプロジェクトが、EASサーバーでビルド可能に設定されているかどうかを確認します（正しいバンドル識別子とApple Team IDが設定されていることを確認するため）。

4. リポジトリのコピーを含むtarballを作成します。実際の動作は、使用している[VCSワークフロー](https://expo.fyi/eas-vcs-workflow)によって異なります。

5. プロジェクトのtarballをプライベートAWS S3バケットにアップロードし、EAS Buildにビルドリクエストを送信します。

### リモート手順

この次のフェーズでは、EAS Buildがリクエストを受け取ったときに何が起こるかを説明します：

1. ビルド用の新しいmacOS VMを作成します。
   - すべてのビルドは、すべてのビルドツール（Xcode、Fastlaneなど）がインストールされた独自の新しいmacOS VMを取得します。

2. プライベートAWS S3バケットからプロジェクトのtarballをダウンロードして展開します。

3. `NPM_TOKEN`が設定されている場合、[.npmrcを作成](/build-reference/private-npm-packages)します。

4. `eas-build-pre-install`npmフックを実行します（存在する場合）。

5. プロジェクトで使用されているパッケージマネージャーを使用して、JavaScript依存関係をインストールします（`npm install`、`yarn install`など）。

6. 必要に応じて、`npx expo prebuild`を実行してネイティブプロジェクトを生成します（管理されたプロジェクトの場合）。

7. CocoaPodsを使用してiOS依存関係をインストールします（`pod install`）。

8. `eas-build-post-install`npmフックを実行します（存在する場合）。

9. Xcodeを使用してプロジェクトをビルドします（`xcodebuild`コマンド経由）。

10. ビルドアーティファクト（.ipaまたは.appファイル）をアップロードします。

11. ビルドが成功した場合は`eas-build-on-success`、失敗した場合は`eas-build-on-error`、いずれの場合も`eas-build-on-complete`フックを実行します。

## ビルド設定

### スキームとビルド設定

eas.jsonでカスタムスキームとビルド設定を指定できます：

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "MyApp"
      }
    },
    "development": {
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": true
      }
    }
  }
}
```

### ビルド出力

- **IPA（iOS App Package）**: App Storeへの提出または配布用
- **APP**: シミュレーター用のビルド（`simulator: true`の場合）

### 環境変数

ビルドプロセスで使用できる環境変数：

- `XCODE_VERSION`: 使用するXcodeのバージョン
- `FASTLANE_XCODE_LIST_TIMEOUT`: Xcodeリストのタイムアウト
- `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`: App Store Connect用のアプリ固有パスワード

## iOS固有の設定

### Capabilities（機能）

iOSの機能は自動的に同期されます：

```json
{
  "ios": {
    "entitlements": {
      "com.apple.developer.healthkit": true,
      "com.apple.developer.in-app-payments": [
        "merchant.com.example.myapp"
      ]
    }
  }
}
```

### プロビジョニングプロファイル

EAS Buildは自動的に適切なプロビジョニングプロファイルを管理します：

- **Development**: 開発用デバイス
- **Ad Hoc**: 内部テスト用
- **App Store**: ストア配布用

## パフォーマンスの最適化

1. **CocoaPods依存関係のキャッシュ**: 自動的にキャッシュされます
2. **Xcode派生データのキャッシュ**: ビルド時間を短縮
3. **並列ビルド**: 複数のターゲットを並列ビルド

### Podfileの最適化例

```ruby
# Podfile
install! 'cocoapods', :deterministic_uuids => false

target 'MyApp' do
  use_frameworks!

  # Podsをここに追加
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

## トラブルシューティング

一般的な問題と解決策：

1. **コード署名エラー**: 認証情報が正しく設定されているか確認
2. **Podインストールの失敗**: Podfile.lockを削除して再試行
3. **Xcodeバージョンの不一致**: eas.jsonで`image`を指定

### ビルドログの確認

ビルドの詳細ページでログを確認：

1. 「Spin up build environment」- 環境のセットアップ
2. 「Install dependencies」- 依存関係のインストール
3. 「Run Fastlane」- ビルドの実行
4. 「Upload artifacts」- アーティファクトのアップロード

## シミュレータービルド

シミュレーター専用のビルドを作成：

```json
{
  "build": {
    "simulator": {
      "ios": {
        "simulator": true
      }
    }
  }
}
```

シミュレータービルドの利点：

- Apple Developerアカウント不要
- 署名不要
- 高速なビルド時間
- ローカルテストに最適

このドキュメントは、EAS BuildでのiOSビルドプロセスの完全な理解を提供します。
