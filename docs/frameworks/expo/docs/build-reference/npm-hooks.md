# ビルドライフサイクルフック

npmを使用してビルドプロセスをカスタマイズするためのEAS Buildライフサイクルフックの使用方法を学びます。

* * *

EAS Buildライフサイクルnpmフックを使用すると、ビルドプロセスの前または後にスクリプトを実行することで、ビルドプロセスをカスタマイズできます。

> より良い理解のために、[Androidビルドプロセス](/build-reference/android-builds)および[iOSビルドプロセス](/build-reference/ios-builds)を参照してください。

> ライフサイクルフックは、[カスタムビルド](/custom-builds/get-started)のビルドプロセスでは実行されません。プロセス中にビルドステップによって手動で抽出して呼び出す必要があります。

## EAS Buildライフサイクルフック

利用可能なEAS Buildライフサイクルnpmフックは6つあります。使用するには、package.jsonで設定できます。

| ビルドライフサイクルnpmフック | 説明 |
|--------------------------|-------------|
| `eas-build-pre-install` | EAS Buildが`npm install`を実行する前に実行されます。 |
| `eas-build-post-install` | 動作はプラットフォームとプロジェクトタイプによって異なります。Androidの場合、`npm install`と`npx expo prebuild`（必要な場合）の後に1回実行されます。iOSの場合、`npm install`、`npx expo prebuild`（必要な場合）、および`pod install`の後に1回実行されます。 |
| `eas-build-on-success` | このフックは、ビルドが成功した場合にビルドプロセスの最後にトリガーされます。 |
| `eas-build-on-error` | このフックは、ビルドが失敗した場合にビルドプロセスの最後にトリガーされます。 |
| `eas-build-on-complete` | このフックは、ビルドプロセスの最後にトリガーされます。`EAS_BUILD_STATUS`環境変数でビルドのステータスを確認できます。`finished`または`errored`のいずれかです。 |
| `eas-build-on-cancel` | このフックは、ビルドがキャンセルされた場合にトリガーされます。 |

1つ以上のライフサイクルフックを使用する場合のpackage.jsonの例：

```json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "echo 123",
    "eas-build-post-install": "echo 456",
    "eas-build-on-success": "echo 'Build succeeded!'",
    "eas-build-on-error": "echo 'Build failed!'",
    "eas-build-on-complete": "echo 'Build completed'",
    "eas-build-on-cancel": "echo 'Build cancelled'"
  }
}
```

## 使用例

### ビルド前のセットアップ

```json
{
  "scripts": {
    "eas-build-pre-install": "node scripts/pre-build-setup.js"
  }
}
```

### ビルド後のクリーンアップ

```json
{
  "scripts": {
    "eas-build-post-install": "node scripts/post-build-cleanup.js"
  }
}
```

これらのフックを使用することで、ビルドプロセスを完全にカスタマイズし、自動化できます。
