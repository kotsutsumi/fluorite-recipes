# 提出の自動化

## 概要
EAS Buildは`--auto-submit`フラグで自動アプリ提出を提供し、開発者がモバイルデプロイプロセスを合理化できるようにします。

## 主な機能

### 提出プロファイルの選択
- デフォルトプロファイルはビルドプロファイル名と一致
- `--auto-submit-with-profile=<profile-name>`でカスタムプロファイルを指定可能

### ビルドプロファイルの環境変数
提出時に`app.config.js`を評価する際、ビルドプロファイルの環境変数が使用されます。

### デフォルトのアプリストア提出動作

#### Android提出
- 新しいアプリのデフォルトは内部リリースを作成
- 設定可能なリリースステータス：
  - `draft`
  - `completed`
  - `inProgress`
  - `halted`

トラックには以下が含まれます：
- `internal`（デフォルト）
- `alpha`
- `beta`
- `production`

#### iOS提出
- デフォルトでTestFlightにビルドを提出
- 内部テストで利用可能
- 最大100人の内部テスターをサポート
- 手動のApp Storeレビュープロセス
- 追加のTestFlightグループを指定可能

### メタデータの更新
- EAS SubmitはストアメタデータBを更新しません
- TestFlightアップロード後にiOSアプリ情報を更新するにはEAS Metadataを使用

## コード例：設定

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

```javascript
export default () => {
  return {
    name: process.env.APP_ENV === 'production' ? 'My App' : 'My App (DEV)',
    ios: {
      bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.my.app' : 'com.my.app-dev',
    }
  };
};
```

## 追加リソース
- [EAS Submitドキュメント](/submit/introduction)
- [提出ダッシュボード](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/submissions)
