# @turbo/codemod

Turborepoは、機能が非推奨になった際にTurborepoコードベースをアップグレードするのに役立つ、codemod変換と自動マイグレーションスクリプトを提供します。

Codemodは、コードベース上でプログラム的に実行される変換です。これにより、反復的な変更を手動で管理することなく、大量の変更を適用できます。

## 使用方法

まず、パッケージマネージャーのinstallコマンドを実行したことを確認してください。

```bash
npx @turbo/codemod [transform] [path] [--dry] [--print]
```

- `transform` - 変換の名前、以下の利用可能な変換を参照
- `path` - 変換するファイルまたはディレクトリ
- `--dry` - ドライラン（コードは編集されません）
- `--print` - 比較のために変更された出力を表示

## Turborepoバージョンのアップグレード

ほとんどの場合、以下を実行できます:

```bash
npx @turbo/codemod
```

アップグレードに必要なすべてのcodemodが自動的に実行されます。

### Turborepo 2.x

以下のcodemodは、Turborepoの2番目のメジャーバージョンでのマイグレーションパスに使用されます。

#### 2.x用のCodemod:

##### 1. update-schema-json-url (2.0.0)
schema.jsonのURLをv2に更新します。

```bash
npx @turbo/codemod update-schema-json-url
```

##### 2. add-package-names (2.0.0)
名前のないパッケージの `package.json` に名前を追加します。

```bash
npx @turbo/codemod add-package-names
```

##### 3. clean-globs (2.0.0)
無効なglobパターンを修正します。

```bash
npx @turbo/codemod clean-globs
```

##### 4. migrate-dot-env (2.0.0)
`.env` ファイルを `dotEnv` から `inputs` に移動します。

```bash
npx @turbo/codemod migrate-dot-env
```

**変更前:**
```json
{
  "tasks": {
    "build": {
      "dotEnv": [".env"]
    }
  }
}
```

**変更後:**
```json
{
  "tasks": {
    "build": {
      "inputs": [".env"]
    }
  }
}
```

##### 5. rename-output-mode (2.0.0)
`outputMode` を `outputLogs` にリネームします。

```bash
npx @turbo/codemod rename-output-mode
```

**変更前:**
```json
{
  "tasks": {
    "build": {
      "outputMode": "full"
    }
  }
}
```

**変更後:**
```json
{
  "tasks": {
    "build": {
      "outputLogs": "full"
    }
  }
}
```

##### 6. rename-pipeline (2.0.0)
`pipeline` を `tasks` にリネームします。

```bash
npx @turbo/codemod rename-pipeline
```

**変更前:**
```json
{
  "pipeline": {
    "build": {}
  }
}
```

**変更後:**
```json
{
  "tasks": {
    "build": {}
  }
}
```

##### 7. stabilize-ui (2.0.0)
`experimentalUI` を `ui` にリネームします。

```bash
npx @turbo/codemod stabilize-ui
```

**変更前:**
```json
{
  "experimentalUI": true
}
```

**変更後:**
```json
{
  "ui": "stream"
}
```

### Turborepo 1.x

以下のcodemodは、Turborepoの最初のメジャーバージョンでのマイグレーションパスに使用されます。

#### 1.x用のCodemod:

これらのcodemodは、Turborepo 1.xの各マイナーバージョン間での移行をサポートします。通常、設定ファイルの形式や構造の変更に対応します。

## カスタムcodemodの作成

独自のcodemodを作成する必要がある場合は、[jscodeshift](https://github.com/facebook/jscodeshift)を使用できます。これは、Turborepoのcodemodが構築されているのと同じツールです。

## トラブルシューティング

### Codemodが期待通りに動作しない

1. `--dry` フラグを使用して、変更内容をプレビューします
2. `--print` フラグを使用して、変更された出力を確認します
3. 変更を手動で適用する必要があるかどうかを確認します

### バックアップの作成

Codemodを実行する前に、コードベースのバックアップを作成することをお勧めします。Gitを使用している場合は、変更をコミットする前に差分を確認できます。

```bash
git status
git diff
```
