# ビルド設定プロセス

EAS CLIがEAS Build用にプロジェクトをどのように設定するかを学びます。

* * *

このガイドでは、EAS CLIが`eas build:configure`（または`eas build`。これはプロジェクトがまだ設定されていない場合に同じプロセスを実行します）でプロジェクトを設定する際に何が起こるかを学びます。

EAS CLIは、プロジェクトを設定する際に次の手順を実行します：

## 1. 設定するプラットフォームについて尋ねる

コマンドを初めて実行すると、EASプロジェクトが初期化され、設定するプラットフォームを選択するように求められます。単一のプラットフォームにのみEAS Buildを使用したい場合は問題ありません。考えが変わった場合は、後で戻って他のプラットフォームを設定できます。

## 2. eas.jsonを作成する

このコマンドは、デフォルト設定でルートディレクトリにeas.jsonファイルを作成します。次のようになります：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

bareプロジェクトの場合は、少し異なって見えます。

これがEAS Buildの設定です。各プラットフォームに対して`"development"`、`"preview"`、`"production"`という名前の3つのビルドプロファイル（`"production"`、`"debug"`、`"testing"`など、複数のビルドプロファイルを持つことができます）を定義しています。

## 3. プロジェクトを設定する

この手順は、プロジェクトのタイプによって異なります。

### 3.1 初期化完了

これで、プロジェクトがEAS Buildと互換性を持つようになるための初期化が完了しました。

### 3.2 Expoプロジェクト

まだapp.jsonに`android.package`や`ios.bundleIdentifier`を設定していない場合、最初のビルドを作成するときにEAS CLIがそれらを指定するように求めます。

- `android.package`は、Google Play Storeでアプリを識別するために使用されるAndroidアプリケーションIDとして使用されます
- `ios.bundleIdentifier`は、App Storeでアプリを識別するために使用されます

### 3.3 Bareプロジェクト

bareプロジェクトの場合、EAS CLIは次を確認します：

- Androidプロジェクトが正しく設定されているか
- iOSプロジェクトが正しく設定されているか
- バンドル識別子とパッケージ名が一貫しているか

## ビルドプロファイルの理解

### Developmentプロファイル

```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  }
}
```

- Expo Development Clientビルドを作成します
- 内部配布用（TestFlightまたは内部テスト）
- ホットリロードと開発ツールを含む

### Previewプロファイル

```json
{
  "preview": {
    "distribution": "internal"
  }
}
```

- 本番に近いビルド
- 内部テストとレビュー用
- 本番機能を持つが、ストアには提出されない

### Productionプロファイル

```json
{
  "production": {}
}
```

- App StoreとGoogle Play Store提出用
- 最適化された本番ビルド
- デフォルト設定を使用

## プラットフォーム固有の設定

各プロファイルは、プラットフォーム固有の設定を持つことができます：

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "enterpriseProvisioning": "universal"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

## 環境変数

ビルドプロファイルに環境変数を追加：

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.production.com",
        "ENVIRONMENT": "production"
      }
    },
    "development": {
      "env": {
        "API_URL": "https://api.development.com",
        "ENVIRONMENT": "development"
      }
    }
  }
}
```

## カスタムビルドプロファイル

独自のカスタムプロファイルを作成できます：

```json
{
  "build": {
    "staging": {
      "extends": "production",
      "distribution": "internal",
      "env": {
        "API_URL": "https://api.staging.com",
        "ENVIRONMENT": "staging"
      }
    },
    "qa": {
      "extends": "preview",
      "env": {
        "ENVIRONMENT": "qa"
      }
    }
  }
}
```

## ベストプラクティス

1. **プロファイルの分離**: 開発、ステージング、本番環境を分離
2. **環境変数の使用**: ハードコードされた値を避ける
3. **継承の活用**: `extends`を使用して設定を再利用
4. **一貫性の維持**: すべてのプラットフォームで命名規則を一貫させる

## トラブルシューティング

設定の問題が発生した場合：

1. `eas.json`の構文を確認
2. 必要なプロパティがすべて設定されているか確認
3. `eas build:configure`を再実行して設定をリセット
4. ビルドログで詳細なエラーメッセージを確認

このドキュメントは、EAS Buildのプロジェクト設定プロセスの完全な理解を提供します。
