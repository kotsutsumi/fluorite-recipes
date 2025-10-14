---
title: パッケージ.json
description: package.json ファイルで使用できる Expo 固有のプロパティのリファレンス。
---

import { PaddedAPIBox } from '~/components/plugins/PaddedAPIBox';

**package.json** は、JavaScript プロジェクトのメタデータを含む JSON ファイルです。これは、**package.json** ファイルで使用できる Expo 固有のプロパティへの参照です。

<PaddedAPIBox>

## `install.exclude`

次のコマンドは、プロジェクトにインストールされているライブラリのバージョン チェックを実行し、ライブラリのバージョンが Expo が推奨するバージョンと異なる場合に警告を出します。

- `npx expo start` および `npx expo-doctor`
- `npx expo install` (そのライブラリの新しいバージョンをインストールする場合、または `--check` または `--fix` オプションを使用する場合)

**package.json** ファイルの `install.exclude` 配列の下にライブラリを指定することで、バージョン チェックから除外できます。

```json package.json
{
  "expo": {
    "install": {
      "exclude": ["expo-updates", "expo-splash-screen"]
    }
  }
}
```

</PaddedAPIBox>

<PaddedAPIBox>

## `autolinking`

**package.json** の `autolinking` プロパティを使用して、モジュール解決動作を構成できるようにします。

完全なリファレンスについては、[自動リンク設定](/modules/autolinking/#configuration) を参照してください。

</PaddedAPIBox>

<PaddedAPIBox>

## `doctor`

[`npx expo-doctor`](/develop/tools/#expo-doctor) コマンドの動作を設定できます。

<PaddedAPIBox>

### `reactNativeDirectoryCheck`

デフォルトでは、Expo Doctor はプロジェクトのパッケージを [React Native ディレクトリ](https://reactnative.directory/) に対して検証します。このチェックでは、React Native Directory に含まれていないパッケージのリストを示す警告がスローされます。

プロジェクトの **package.json** ファイルに次の構成を追加することで、このチェックをカスタマイズできます。

```json package.json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        /* @info Use this option to disable/enable the check. */
        "enabled": true,
        /* @end */
        /* @info Use this option to exclude specific packages. */
        "exclude": ["/foo/", "bar"],
        /* @end */
        /* @info Use this option to disable/enable listing unknown packages. */
        "listUnknownPackages": true
        /* @end */
      }
    }
  }
}
```

デフォルトでは、チェックは有効になっており、不明なパッケージがリストされます。

</PaddedAPIBox>

<PaddedAPIBox>

### `appConfigFieldsNotSyncedCheck`

Expo Doctor は、プロジェクトに **android** や **ios** などのネイティブ プロジェクト ディレクトリが含まれているかどうかを確認します。これらのディレクトリは存在するが、**.gitignore** または [**.easignore**](/build-reference/easignore) ファイルにリストされていない場合、Expo Doctor はアプリ構成ファイルの存在を確認します。このファイルが存在する場合は、プロジェクトが [Prebuild](/workflow/prebuild) を使用するように構成されていることを意味します。

**android** または **ios** ディレクトリが存在する場合、EAS ビルドはアプリ構成プロパティをネイティブ プロジェクトに同期しません。これらの条件が当てはまる場合、Expo Doctor は警告を発します。

このチェックを無効または有効にするには、次の構成をプロジェクトの **package.json** ファイルに追加します。

```json package.json
{
  "expo": {
    "doctor": {
      "appConfigFieldsNotSyncedCheck": {
        "enabled": false
      }
    }
  }
}
```

</PaddedAPIBox>

</PaddedAPIBox>
