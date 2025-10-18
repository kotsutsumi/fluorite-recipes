# turbo-ignore

`turbo` を使用して、パッケージまたはその依存関係に変更があるかどうかを判断します。これは、CI内でタスクを素早くスキップするのに便利です。

```bash title="Terminal"
npx turbo-ignore [workspace] [flags...]
```

詳細については、以下を参照してください:
- [タスクのスキップに関する入門ガイド](/docs/crafting-your-repository/constructing-ci#skipping-tasks-and-other-unnecessary-work)
- [タスクのスキップに関する高度なガイド](/docs/guides/skipping-tasks)
- [npmの `turbo-ignore` ドキュメント](https://www.npmjs.com/package/turbo-ignore)

## turbo-ignoreのバージョニング

`turbo-ignore` は通常、リポジトリに依存関係をインストールする前に使用されるため、`turbo-ignore` を実行する際に `turbo` バイナリが利用できない場合があります。その代わりに、`turbo-ignore` は以下の戦略でリポジトリに使用する正しいバージョンを検索します:

- まず、ルートの `package.json#devDependencies` または `package.json#dependencies` で `turbo` エントリをチェックします。バージョンが見つかった場合、それが使用されます。
- `package.json` でエントリが見つからない場合、`turbo.json` がそのスキーマのために読み込まれます。[`tasks` キー](/docs/reference/configuration#tasks)が見つかった場合、`turbo@^2` を使用します。Turborepo v1の `pipeline` が見つかった場合、`turbo@^1` を使用します。

## 使用方法

`turbo-ignore` は、CI環境でビルドやデプロイをスキップするかどうかを決定するために使用されます。通常、Vercel、Netlify、またはその他のCI/CDプラットフォームのビルド設定で使用されます。

### 基本的な使用例

```bash
# 特定のワークスペースの変更をチェック
npx turbo-ignore my-app
```

### CI環境での使用

多くのプラットフォームでは、ビルドをスキップするかどうかを決定するために「無視ビルドステップ」を設定できます。

#### Vercelの例

Vercelの「Ignored Build Step」設定で:

```bash
npx turbo-ignore
```

これにより、現在のプロジェクトまたはその依存関係に変更がない場合、ビルドがスキップされます。

## フラグ

### `--fallback`

比較するための以前のデプロイメントが見つからない場合の動作を指定します。

```bash
npx turbo-ignore --fallback=HEAD^
```

### `--task`

実行するタスクを指定します（デフォルトは `build`）。

```bash
npx turbo-ignore --task=deploy
```

### `--workspace`

チェックするワークスペースを指定します。

```bash
npx turbo-ignore --workspace=my-app
```

## 動作の仕組み

`turbo-ignore` は以下のロジックを使用して、ビルドをスキップするかどうかを決定します:

1. 指定されたワークスペース（または現在のディレクトリから推測されたワークスペース）に変更があるかどうかをチェックします
2. そのワークスペースが依存するパッケージに変更があるかどうかをチェックします
3. 変更が見つかった場合、終了コード1を返します（ビルドを続行）
4. 変更が見つからない場合、終了コード0を返します（ビルドをスキップ）

この動作により、変更されたコードのみをビルドし、不要なビルド時間とリソースを節約できます。
