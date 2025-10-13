# 異なるアプリバージョンを管理

開発者向けとユーザー向けのアプリバージョンについて学び、EAS Buildが開発者向けバージョンを自動的に管理する方法を理解します。

## 開発者向けとユーザー向けのアプリバージョンを理解する

アプリバージョンは2つの値で構成されます：

- 開発者向けの値：Androidの`versionCode`とiOSの`buildNumber`で表されます
- ユーザー向けの値：app.config.jsの`version`で表されます

app.config.jsで開発者向けの値を手動で管理する例：

```javascript
{
  ios: {
    buildNumber: 1
    ...
  },
  android: {
    versionCode: 1
  }
  ...
}
```

> 注記：ユーザー向けのバージョン番号はEASによって処理されません。代わりに、本番アプリをレビューのために提出する前に、アプリストア開発者ポータルで定義します。

## EAS Buildによる自動アプリバージョン管理

デフォルトでは、EAS Buildは開発者向けの値の自動化を支援します。リモートバージョンソースを利用して、新しい本番リリースが行われるたびに開発者向けの値を自動的にインクリメントします。

`eas init`でプロジェクトを初期化すると、EAS CLIは自動的に`eas.json`にこれらのプロパティを追加します：

- `cli.appVersionSource`を`remote`に設定
- `build.production.autoIncrement`を`true`に設定

`eas.json`の例：

```json
{
  "cli": {
    ...
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
  ...
}
```

## すでに公開されているアプリの開発者向けアプリバージョンを同期

すでにアプリストアに公開されているアプリの場合、次の手順に従ってバージョンを同期します：

1. ターミナルで`eas build:version:set`を実行
2. プラットフォーム（AndroidまたはiOS）を選択
3. アプリバージョンソースをリモートに設定
4. アプリストアからの最後のバージョン番号を入力

## まとめ

アプリのバージョン管理の違い、一意のアプリバージョンの重要性について探り、本番ビルドの`eas.json`で自動バージョン更新を有効にしました。
