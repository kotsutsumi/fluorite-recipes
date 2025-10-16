# create-turbo

Turborepoを始める最も簡単な方法は、`create-turbo`を使用することです。このCLIツールを使用して、すべてが設定された新しいモノレポを素早く構築できます。

## 基本的なインストール

`create-turbo`は、pnpm、yarn、npm、bun(Beta)などの複数のパッケージマネージャーをサポートしています。

```bash
pnpm dlx create-turbo@latest
```

## 例から始める

`--example`フラグを使用して、コミュニティまたはコアメンテナンスの例でモノレポをブートストラップできます。

```bash
pnpm dlx create-turbo@latest --example [example-name]
```

### コアメンテナンスの例

- **Basic**: 2つのNext.jsアプリケーション
- **Kitchen sink**: 複数のフロントエンドおよびバックエンドフレームワーク
- **Non-monorepo**: スタンドアロンアプリケーション
- **Shell commands**: シェルコマンドの例
- **SvelteKit**: SvelteKitの統合
- **TailwindCSS**: TailwindCSSの統合

### コミュニティメンテナンスの例

- **Design System**: デザインシステムの実装
- **Angular**: Angularとの統合
- **Yarn Berry**: Yarn Berryの使用
- **Changesets**: Changesetsとの統合
- **Docker**: Docker化された環境
- **Gatsby**: Gatsbyフレームワーク
- **Nest.js**: Nest.jsバックエンド
- **React Native**: React Nativeモバイルアプリ
- **Vite**: Viteビルドツール
- **Vue/Nuxt**: VueとNuxtフレームワーク

## CLIオプション

### `-m, --package-manager`

使用するパッケージマネージャーを選択します。

```bash
pnpm dlx create-turbo@latest --package-manager=pnpm
```

### `--skip-install`

パッケージマネージャーのインストールをスキップします。

```bash
pnpm dlx create-turbo@latest --skip-install
```

### `--turbo-version`

使用するTurboバージョンを指定します。

```bash
pnpm dlx create-turbo@latest --turbo-version=2.0.0
```

### `-e, --example`

特定の例を使用します。

```bash
pnpm dlx create-turbo@latest --example=basic
```

### `-p, --example-path`

複雑なGitHub URLの例パスを指定します。

```bash
pnpm dlx create-turbo@latest --example-path=examples/with-docker
```
