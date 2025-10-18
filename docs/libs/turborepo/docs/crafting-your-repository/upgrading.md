# アップグレード

## 2.0へのアップグレード

### `turbo.json`の更新

1.xから2.0へのアップグレードを開始するには、パッケージマネージャーに応じてcodemod migrateコマンドを実行します:

```bash
# pnpm
pnpm dlx @turbo/codemod migrate

# yarn
yarn dlx @turbo/codemod migrate

# npm
npx @turbo/codemod migrate

# bun (Beta)
bunx @turbo/codemod migrate
```

これにより、1.xから2.0への破壊的変更に対応するように`turbo.json`が更新され、`name`フィールドを持たない`package.json`に`name`フィールドが追加されます。

### ルートの`package.json`に`packageManager`フィールドを追加

Turborepo 2.0では、ルートの`package.json`に`packageManager`フィールドを追加する必要があります:

```diff
{
+ "packageManager": "pnpm@9.2.0"  # または yarn@1.22.19, npm@10.8.1, bun@1.2.0
}
```

### `eslint-config-turbo`の更新

`eslint-config-turbo`を使用している場合は、メジャーバージョンに合わせて更新してください。

### `turbo run`コマンドの更新

Turborepo 2.0の主な変更点:

- 環境変数のストリクトモードがデフォルトになりました
- ワークスペースルートがすべてのパッケージの暗黙的な依存関係になりました
- `--filter`を優先して`--ignore`フラグが削除されました
- 非推奨の`--scope`フラグが削除されました
- `engines`フィールドがハッシュ化で使用されるようになりました
- `--filter`でのパッケージ名の推論とマッチングが変更されました
- `--only`がパッケージの依存関係ではなく、タスクの依存関係を制限するようになりました
