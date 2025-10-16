# エディター統合

`turbo`で最高のエクスペリエンスを得るために、Turborepoはいくつかのエディター統合ユーティリティを提供しています:

## `turbo.json`のJSONスキーマ

TurborepoはJSONスキーマを使用して、`turbo.json`ファイルで自動補完を提供します。`$schema`キーを含めることで、エディターはドキュメントとリンティングを提供できます。

### Webからの取得

`schema.json`はURL経由でアクセスでき、パッケージマネージャーのインストールコマンドを実行せずにエディター内での検証が可能です:

```json
{
  "$schema": "https://turborepo.com/schema.json"
}
```

バージョン付きスキーマも利用可能です:

```json
{
  "$schema": "https://turborepo.com/schema.v1.json"
}
```

### `node_modules`からの取得

Turborepo 2.4以降、`schema.json`はパッケージインストール後に`node_modules`で利用可能です:

```json
{
  "$schema": "./node_modules/turbo/schema.json"
}
```

> 注意: リポジトリルートに`turbo`をインストールし、異なるパッケージ設定では必要に応じてスキーマパスを調整してください。

## 環境変数のリンティング

[`eslint-config-turbo`パッケージ](/docs/reference/eslint-config-turbo)は、環境変数の適切な処理を保証するのに役立ちます。

## Turborepo LSP

高度な自動補完とリンティングを提供します。含まれる機能:
- 無効なグロブのヒント
- 存在しないタスクまたはパッケージへの参照
- リポジトリの可視性ツール

[VSCode Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=Vercel.turbo-vsc)で利用可能です。

> 言語サーバーはLanguage Server Protocolと互換性のあるエディターをサポートしています。他のエディターに興味がありますか？[issue tracker](https://github.com/vercel/turborepo/issues)でリクエストを記録してください。
