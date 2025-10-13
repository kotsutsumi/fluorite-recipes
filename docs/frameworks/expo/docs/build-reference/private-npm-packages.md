# プライベートnpmパッケージの使用

EAS Buildでプライベートnpmパッケージを使用するように設定する方法を学びます。

* * *

EAS Buildは、プロジェクトでプライベートnpmパッケージを使用することを完全にサポートしています。これらは、npm（[Pro/Teamsプラン](https://www.npmjs.com/products)をお持ちの場合）またはプライベートレジストリ（例：セルフホストの[Verdaccio](https://verdaccio.org/)を使用）に公開できます。

ビルドを開始する前に、プロジェクトを設定してEAS Buildにnpmトークンを提供する必要があります。

## デフォルトのnpm設定

デフォルトでは、EAS Buildは、すべてのビルドで依存関係のインストールを高速化するセルフホストnpmキャッシュを使用します。すべてのEAS Buildビルダーは、各プラットフォーム用の.npmrcファイルで設定されています：

### Android

`registry=http://npm-cache-service.worker-infra-production.svc.cluster.local:4873`

### iOS

`registry=http://10.254.24.8:4873`

## npmに公開されたプライベートパッケージ

プロジェクトがnpmに公開されたプライベートパッケージを使用している場合、EAS Buildに[読み取り専用npmトークン](https://docs.npmjs.com/about-access-tokens)を提供して、依存関係を正常にインストールできるようにする必要があります。

推奨される方法は、アカウントまたはプロジェクトのシークレットに`NPM_TOKEN`シークレットを追加することです。

EASがビルド中に`NPM_TOKEN`環境変数が利用可能であることを検出すると、次の.npmrcが自動的に作成されます：

.npmrc
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
```

ただし、これは.npmrcがプロジェクトのルートディレクトリにない場合にのみ発生します。このファイルが既にある場合は、手動で更新する必要があります。

## プライベートレジストリに公開されたパッケージ

セルフホストの[Verdaccio](https://verdaccio.org/)などのプライベートnpmレジストリを使用している場合は、.npmrcを手動で設定する必要があります。

プロジェクトのルートディレクトリに次の内容の.npmrcファイルを作成します：

.npmrc
```
registry=__REPLACE_WITH_REGISTRY_URL__
```

レジストリが認証を必要とする場合は、適切な認証トークンを追加してください。

## シークレットの設定

プライベートパッケージにアクセスするためのトークンを設定するには：

```bash
eas secret:create --scope project --name NPM_TOKEN --value your-token-here
```

または、Expo Webサイトでプロジェクト設定からシークレットを追加できます。

これにより、EAS Buildがプライベートnpmパッケージにアクセスしてビルドを正常に完了できるようになります。
