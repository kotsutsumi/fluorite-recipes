# Androidビルドプロセス

EAS BuildでAndroidプロジェクトがどのようにビルドされるかを学びます。

* * *

このページでは、EAS BuildでAndroidプロジェクトをビルドするプロセスについて説明します。ビルドサービスの実装の詳細に興味がある場合は、このページを読むと良いでしょう。

## ビルドプロセス

EAS BuildでAndroidプロジェクトをビルドする手順を詳しく見てみましょう。まず、プロジェクトを準備するためにローカルマシン上でいくつかの手順を実行し、その後リモートサービスでプロジェクトをビルドします。

### ローカル手順

最初のフェーズはコンピューター上で行われます。EAS CLIが次の手順を完了する責任があります：

1. eas.jsonで`cli.requireCommit`が`true`に設定されている場合、gitインデックスがクリーンかどうかを確認します。これは、コミットされていない変更がないことを意味します。クリーンでない場合、EAS CLIはローカルの変更をコミットするオプションを提供するか、ビルドプロセスを中止します。

2. `builds.android.PROFILE_NAME.withoutCredentials`が`true`に設定されていない限り、ビルドに必要な認証情報を準備します。

   - `builds.android.PROFILE_NAME.credentialsSource`の値に応じて、認証情報はローカルのcredentials.jsonファイルまたはEASサーバーから取得されます。`remote`モードが選択されているが認証情報がまだ存在しない場合、新しいキーストアを生成するように求められます。

3. リポジトリのコピーを含むtarballを作成します。実際の動作は、使用している[VCSワークフロー](https://expo.fyi/eas-vcs-workflow)によって異なります。

4. プロジェクトのtarballをプライベートAWS S3バケットにアップロードし、EAS Buildにビルドリクエストを送信します。

### リモート手順

次に、EAS Buildがリクエストを受け取ったときに何が起こるかを説明します：

1. ビルド用の新しいDockerコンテナを作成します。

   - すべてのビルドは、すべてのビルドツール（Java JDK、Android SDK、NDKなど）がインストールされた独自の新しいコンテナを取得します。

2. プライベートAWS S3バケットからプロジェクトのtarballをダウンロードして展開します。

3. `NPM_TOKEN`が設定されている場合、[.npmrcを作成](/build-reference/private-npm-packages)します。

4. `eas-build-pre-install`npmフックを実行します（存在する場合）。

5. プロジェクトで使用されているパッケージマネージャーを使用して、JavaScript依存関係をインストールします（`npm install`、`yarn install`など）。

6. 必要に応じて、`npx expo prebuild`を実行してネイティブプロジェクトを生成します（管理されたプロジェクトの場合）。

7. Android固有の依存関係をインストールします（Gradle依存関係）。

8. `eas-build-post-install`npmフックを実行します（存在する場合）。

9. eas.jsonの設定に基づいて、適切なGradleコマンドを実行してアプリをビルドします（例：`./gradlew :app:bundleRelease`）。

10. ビルドアーティファクト（.aabまたは.apkファイル）をアップロードします。

11. ビルドが成功した場合は`eas-build-on-success`、失敗した場合は`eas-build-on-error`、いずれの場合も`eas-build-on-complete`フックを実行します。

## ビルド設定

### Gradleコマンド

eas.jsonでカスタムGradleコマンドを指定できます：

```json
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease"
      }
    },
    "development": {
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    }
  }
}
```

### ビルドタイプ

- **AAB（Android App Bundle）**: Google Play Storeへの提出用（デフォルト）
- **APK**: 直接インストールまたは内部配布用

### 環境変数

ビルドプロセスで使用できる環境変数：

- `ANDROID_SDK_ROOT`: Android SDKのパス
- `JAVA_HOME`: Java JDKのパス
- `GRADLE_OPTS`: Gradleのオプション

## パフォーマンスの最適化

1. **依存関係のキャッシュ**: Gradle依存関係は自動的にキャッシュされます
2. **ビルド並列化**: Gradleの並列ビルドを有効化
3. **増分ビルド**: 変更されたモジュールのみをビルド

### gradle.propertiesの最適化例

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true
android.enableJetifier=true
android.useAndroidX=true
```

## トラブルシューティング

一般的な問題と解決策：

1. **メモリ不足**: `gradle.properties`でヒープサイズを増やす
2. **依存関係の解決失敗**: キャッシュをクリアして再試行
3. **ビルドツールバージョンの不一致**: `build.gradle`でバージョンを明示的に指定

このドキュメントは、EAS BuildでのAndroidビルドプロセスの完全な理解を提供します。
