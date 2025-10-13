# Yarn 1（Classic）でnpmキャッシュを使用する

このドキュメントでは、yarn.lockファイルのレジストリを上書きするpre-install npmフックを追加することで、Yarn 1（Classic）でnpmキャッシュを使用する方法を説明します。

重要なポイント：
- デフォルトでは、EAS npmキャッシュはYarn 1では機能しません
- Yarn 1はレジストリを上書きする方法を提供していません
- この問題はYarn 2以降で解決されています

## 推奨される解決策

`package.json`に次のスクリプトを追加します：

```json
{
  "scripts": {
    "eas-build-pre-install": "bash -c \"[ ! -z \\\"$EAS_BUILD_NPM_CACHE_URL\\\" ] && sed -i -e \\\"s#https://registry.yarnpkg.com#$EAS_BUILD_NPM_CACHE_URL#g\\\" yarn.lock\" || true"
  }
}
```

## スクリプトの説明

このスクリプトはbashコマンドを使用して：
- `EAS_BUILD_NPM_CACHE_URL`が設定されているかチェックします
- `sed`を使用して、デフォルトのYarnレジストリURLをnpmキャッシュURLに置き換えます
- `yarn.lock`ファイルを適切に変更します

## 動作の仕組み

1. EAS Buildは`EAS_BUILD_NPM_CACHE_URL`環境変数を設定します
2. pre-installフックがトリガーされます
3. スクリプトがyarn.lock内のすべてのレジストリURLを置き換えます
4. Yarnがキャッシュされたnpmレジストリから依存関係をインストールします

## 注意事項

- これはYarn 1（Classic）ユーザー専用の回避策です
- Yarn 2以降を使用している場合は、この回避策は必要ありません
- スクリプトはyarn.lockファイルを変更しますが、これはビルドプロセス中のみで、ローカルファイルには影響しません

このドキュメントは、ビルド中にnpmキャッシュを活用したいYarn 1（Classic）ユーザー向けの回避策について説明しています。
