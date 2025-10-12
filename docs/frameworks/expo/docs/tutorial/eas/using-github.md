# GitHubリポジトリからビルドをトリガー

GitHubリポジトリからビルドをトリガーするプロセスについて学びます。

## Expo GitHubアプリを設定

この機能を使用するには、GitHubアカウントを接続します：
- [expo.dev/settings](https://expo.dev/settings#connections)に移動
- Connections > GitHubで、Connectをクリック
- Expo GitHubアプリを承認
- インストールをExpoアカウントにリンク

## GitHubリポジトリを接続

ビルドのトリガーを有効にするには：
- EASダッシュボードで、Projects > Select project > Project settings > GitHubに移動
- プロジェクトリポジトリを見つけて接続

## デフォルトのリポジトリ設定を使用

デフォルトでは、Expo GitHubアプリはソースコードのルートディレクトリ（`/`）を選択します。

## GitHub PRラベルを使用してビルドをトリガー

自動的にビルドをトリガーする手順：

1. `eas.json`を更新してビルドイメージを指定：
```json
{
  "build": {
    "development": {
      "android": {
        "image": "latest"
      },
      "ios": {
        "image": "latest"
      }
    }
  }
}
```

2. 新しいブランチを作成してコードを変更
3. プルリクエストを作成
4. ラベル`eas-build-all:development`を追加

Expo GitHubアプリは、AndroidとiOSのビルドを自動的に開始します。

## まとめ

以下の方法を学びました：
- GitHubアカウントをExpoとリンク
- リポジトリをEASプロジェクトに接続
- GitHub PRラベルを使用して自動開発ビルドを作成
