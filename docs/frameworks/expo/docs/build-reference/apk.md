# Androidエミュレーターとデバイス用のAPKをビルドする

EAS Buildを使用する際に、Androidエミュレーターとデバイス用の.apkを設定してインストールする方法を学びます。

* * *

EAS BuildでAndroidアプリをビルドする際にデフォルトで使用されるファイル形式は、[Android App Bundle](https://developer.android.com/platform/technology/app-bundle)（AAB/.aab）です。この形式は、Google Play Storeへの配布に最適化されています。ただし、AABはデバイスに直接インストールすることはできません。ビルドをAndroidデバイスまたはエミュレーターに直接インストールするには、代わりに[Android Package](https://en.wikipedia.org/wiki/Android_application_package)（APK/.apk）をビルドする必要があります。

## APKをビルドするプロファイルの設定

.apkを生成するには、ビルドプロファイルに次のプロパティのいずれかを追加して、[eas.json](/build/eas-json)を変更します：

*   `developmentClient`を`true`に設定（デフォルト）
*   `distribution`を`internal`に設定
*   `android.buildType`を`apk`に設定
*   `android.gradleCommand`を`:app:assembleRelease`、`:app:assembleDebug`、[`:app:assembleDebugOptimized`](/more/expo-cli#compiling-android)（SDK 54以降で利用可能）、またはその他の.apkを生成するGradleコマンドに設定

eas.json

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "preview4": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

これで、次のコマンドでビルドを実行できます：

Terminal

```
eas build -p android --profile preview
```

プロファイルには好きな名前を付けることができます。この例では`preview`という名前にしていますが、`local`、`apk`、または最も意味のある名前を付けることができます。

## APKのインストール

ビルドが完了すると、.apkファイルをダウンロードしてAndroidデバイスまたはエミュレーターにインストールできます。

### エミュレーターへのインストール

```bash
adb install path/to/your-app.apk
```

### 物理デバイスへのインストール

1. デバイスをUSBで接続します
2. デバイスでUSBデバッグを有効にします
3. 次のコマンドを実行します：

```bash
adb install path/to/your-app.apk
```

または、.apkファイルをデバイスに転送して、ファイルマネージャーから直接インストールすることもできます。

## 注意事項

- APKはテストと内部配布に適しています
- Google Play Storeへの提出にはAABを使用してください
- APKファイルは通常AABファイルよりも大きくなります
