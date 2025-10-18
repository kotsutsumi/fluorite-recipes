# リポジトリの理解

Turborepoには、リポジトリ構造を理解し、コードベースを使用および最適化するのに役立つツールが含まれています。

## `turbo ls`

パッケージをリストするには、`turbo ls`を実行します。これにより、リポジトリ内のパッケージとその場所が表示されます。

```bash title="Terminal"
> turbo ls

 @repo/eslint-config packages/eslint-config
 @repo/typescript-config packages/typescript-config
 @repo/ui packages/ui
 docs apps/docs
 web apps/web
```

`run`と同様に、`ls`に[フィルタを適用](/docs/crafting-your-repository/running-tasks#using-filters)できます：

```bash title="Terminal"
> turbo ls --filter ...ui
3 packages (pnpm9)

 @repo/ui packages/ui
 docs apps/docs
 web apps/web
```

## `turbo run`

モノレポで実行できるタスクを確認するには、タスクを指定せずに`turbo run`を呼び出すだけです。タスクとそれらが定義されているパッケージのリストが表示されます：

```bash title="Terminal"
> turbo run
No tasks provided, here are some potential ones

 lint
  @repo/ui, docs, web
 build
  docs, web
 dev
  docs, web
 start
  docs, web
 generate:component
  @repo/ui
```

## `turbo query`

リポジトリ構造を詳しく調べたい場合、`2.2.0`以降、Turborepoは`turbo query`を介してリポジトリへのGraphQLインターフェースを提供します。`test`タスクを持つすべてのパッケージを見つけるなどのクエリを実行できます：

```bash title="Terminal"
> turbo query "query { packages(filter: { has: { field: TASK_NAME, value: \"build\"}}) { items { name } } }"
{
  "data": {
    "packages": {
      "items": [
        {
          "name": "//"
        },
        {
          "name": "docs"
        },
        {
          "name": "web"
        }
      ]
    }
  }
}
```

### 他のクエリ例

多くの依存関係を持つパッケージを特定する：

```bash title="Terminal"
> turbo query "query { packages(filter: { greaterThan: { field: DIRECT_DEPENDENT_COUNT, value: 10 } }) { items { name } } }"
```

コミットで影響を受けるパッケージを確認する：

```bash title="Terminal"
> turbo query "query { affectedPackages(base: \"HEAD^\", head: \"HEAD\") { items { reason { __typename } } } }"
```

## ツールの活用

これらのツールは、開発者が依存関係の問題を診断し、タスクの実行を最適化し、モノレポの構造を理解するのに役立ちます。

### 主な利点

- **パッケージの可視性**: どのパッケージがどこにあるかを迅速に確認
- **タスクの発見**: 利用可能なタスクとその場所を簡単に特定
- **高度なクエリ**: GraphQLを使用して複雑なリポジトリ分析を実行

## ベストプラクティス

1. **定期的な監査**: `turbo ls`を使用して、リポジトリ構造が期待どおりであることを確認
2. **タスク管理**: `turbo run`でタスクの重複や矛盾を特定
3. **依存関係分析**: `turbo query`で複雑な依存関係グラフを理解

これらのツールを活用することで、モノレポの管理と最適化がより効率的になります。
