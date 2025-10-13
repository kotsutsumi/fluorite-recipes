# ビルドエラーとクラッシュのトラブルシューティング

何かがうまくいかない場合、おそらく次の2つの方法のいずれかでうまくいかないでしょう：

1. ビルドが失敗する。
2. ビルドは成功するが、ランタイムエラーが発生する。たとえば、実行時にクラッシュしたりハングしたりする。

## 関連するエラーログを見つける

### ランタイムエラー

リリースビルドが実行時にクラッシュしている場合にログを見つける方法については、デバッグガイドの[「本番エラー」セクション](/debugging/runtime-issues#production-errors)を参照してください。

### ビルドエラー

ビルド詳細ページに移動し、失敗したビルドフェーズをクリックして展開します。多くの場合、エラーのある最も早いフェーズに最も有用な情報が含まれています。

## JavaScriptバンドルをローカルで検証する

ビルドが`Task :app:bundleReleaseJsAndAssets FAILED`（Android）または`Metro encountered an error`（iOS）で失敗する場合、Metro bundlerがアプリのJavaScriptコードをバンドルできなかったことを意味します。

次を実行して、本番バンドルをローカルでビルドできます：

```
npx expo export
```

## プロジェクトがローカルでビルドおよび実行されることを確認する

プロジェクトがリリースモードでローカルでビルドおよび実行される場合、次の条件が満たされていれば、EAS Buildでもビルドされる可能性が高いです：

- 関連するビルドツールのバージョンが両方の環境で同じ
- 関連する環境変数が同じ
- EAS Buildにアップロードされたアーカイブに同じソースファイルが含まれている

次のコマンドでローカルビルドを検証できます：

```
# Androidリリースモード
npx expo run:android --variant release

# iOSリリースモード
npx expo run:ios --configuration Release
```

## それでも問題が解決しない場合

### 良い質問をする方法

ヘルプを求める際は、必ず次を共有してください：

- ビルドページへのリンク
- エラーログ
- 最小限の再現可能な例またはリポジトリリンク

コミュニティサポートについては、[Expo DiscordとForums](https://chat.expo.dev/)に参加してください。

## 一般的な問題と解決策

### 依存関係の問題

```bash
# node_modulesとロックファイルをクリーン
rm -rf node_modules
rm package-lock.json  # または yarn.lock、pnpm-lock.yaml

# 依存関係を再インストール
npm install
```

### ネイティブモジュールの問題

```bash
# iOSの場合：Podsをクリーン
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Androidの場合：ビルドキャッシュをクリーン
cd android
./gradlew clean
cd ..
```

### 環境変数の問題

eas.jsonですべての必要な環境変数が設定されていることを確認してください：

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.example.com"
      }
    }
  }
}
```

このドキュメントは、Expoのビルドおよびランタイムエラーのトラブルシューティングに関する包括的なガイドを提供し、一般的な問題を診断および解決するためのステップバイステップのアドバイスを提供します。
