# 同じデバイスにアプリのバリアントをインストールする

同じデバイスに複数のアプリバリアントをインストールする方法を学びます。

* * *

開発、プレビュー、本番ビルドを作成する際、これらのビルドバリアントを同じデバイスに同時にインストールすることは一般的です。これにより、アプリをアンインストールして再インストールする必要なく、開発作業、アプリの次のバージョンのプレビュー、本番バージョンの実行をデバイス上で行うことができます。

## 前提条件

デバイスにアプリの複数のバリアントをインストールするには、各バリアントが一意のアプリケーションID（Android）またはバンドル識別子（iOS）を持っている必要があります。

## 開発バリアントと本番バリアントを設定する

このドキュメントは、アプリバリアントを設定するためのステップバイステップガイドを提供します：

1. `app.json`を`app.config.js`に変換する
2. バリアントを区別するための環境変数を追加する
3. EAS Buildを設定する
4. 開発サーバーと本番サーバーの設定をセットアップする

### 主要な設定例

```javascript
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
  android: {
    package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  }
};
```

### eas.jsonの設定

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "preview"
      }
    },
    "production": {
      "env": {
        "APP_VARIANT": "production"
      }
    }
  }
}
```

## 追加設定

このガイドは、以下の詳細な設定をカバーしています：
- EAS Build
- 開発サーバーの使用
- 本番バリアントのデプロイ
- 既存のReact Nativeプロジェクト
- AndroidとiOS固有のセットアップ手順

## アプリアイコンとスプラッシュスクリーンのカスタマイズ

各バリアントに異なるアイコンを設定することもできます：

```javascript
export default {
  icon: IS_DEV ? './assets/icon-dev.png' : './assets/icon.png',
  splash: {
    image: IS_DEV ? './assets/splash-dev.png' : './assets/splash.png',
  }
};
```

## ビルドの実行

各バリアント用のビルドを実行：

```bash
# 開発ビルド
eas build --profile development --platform ios

# プレビュービルド
eas build --profile preview --platform ios

# 本番ビルド
eas build --profile production --platform ios
```

## バリアントの検証

すべてのバリアントが正しくインストールされていることを確認：

1. 各ビルドをデバイスにインストール
2. すべてのアプリアイコンがホーム画面に表示されることを確認
3. 各アプリを起動して、正しいバリアントであることを確認

このドキュメントは、ExpoとEAS Buildを使用して同じデバイスに複数のアプリバリアントを管理したい開発者向けの包括的な手順を提供します。
