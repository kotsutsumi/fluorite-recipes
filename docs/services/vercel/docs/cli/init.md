# vercel init

`vercel init` コマンドは、[Vercelがサポートするフレームワーク](/docs/frameworks)の例を、[Vercelの例リポジトリ](https://github.com/vercel/vercel/tree/main/examples)から、ローカルに初期化するために使用されます。

## 使用方法

```bash
vercel init
```

Vercelがサポートするフレームワークの例をローカルに初期化します。フレームワークを選択するプロンプトが表示されます。

## 拡張された使用方法

特定のフレームワークの例をローカルに初期化:

```bash
vercel init [framework-name]
```

特定のフレームワークの例をローカルに初期化し、ディレクトリ名を変更:

```bash
vercel init [framework-name] [new-local-directory-name]
```

## 例

```bash
vercel init next
```

Next.jsの例プロジェクトを初期化します。

```bash
vercel init gatsby my-gatsby-site
```

Gatsbyの例を`my-gatsby-site`という名前のディレクトリに初期化します。

## ユニークなオプション

### Force（強制）

`--force`（省略形 `-f`）オプションは、既存のローカルディレクトリを強制的に置き換えるために使用されます。

```bash
vercel init --force
```

```bash
vercel init gatsby my-project-directory --force
```

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel init`コマンドで使用できます。
