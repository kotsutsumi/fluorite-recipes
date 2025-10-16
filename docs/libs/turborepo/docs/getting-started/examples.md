# サンプルから始める

`create-turbo`を使用して、お気に入りのツールを使ったサンプルをブートストラップします。

## パッケージマネージャーのインストールコマンド

各パッケージマネージャーでサンプルを開始するには、以下のコマンドを使用します:

- pnpm:
```bash
# 以下にリストされているサンプルを使用
pnpm dlx create-turbo@latest --example [example-name]

# コミュニティのGitHubリポジトリを使用
pnpm dlx create-turbo@latest --example [github-url]
```

- yarn:
```bash
# 以下にリストされているサンプルを使用
yarn dlx create-turbo@latest --example [example-name]

# コミュニティのGitHubリポジトリを使用
yarn dlx create-turbo@latest --example [github-url]
```

- npm:
```bash
# 以下にリストされているサンプルを使用
npx create-turbo@latest --example [example-name]

# コミュニティのGitHubリポジトリを使用
npx create-turbo@latest --example [github-url]
```

- bun (Beta):
```bash
# 以下にリストされているサンプルを使用
bunx create-turbo@latest --example [example-name]

# コミュニティのGitHubリポジトリを使用
bunx create-turbo@latest --example [github-url]
```

## コアメンテナンスのサンプル

以下のサンプルはTurborepoコアチームによってメンテナンスされており、最新の依存関係と積極的なissueサポートがあります:

1. **Basic**: 2つのNext.jsアプリケーションを含む基本的なモノレポサンプル
2. **Kitchen sink**: フロントエンドとバックエンドの両方を含む複数のフレームワーク
3. **Non-monorepo**: Turborepoを使用するスタンドアロンアプリケーション
4. **Shell commands**: GitHub Issueの再現用のほぼ空のTurborepo
5. **SvelteKit**: UIライブラリを共有する複数のSvelteKitアプリを含むモノレポ
6. **TailwindCSS**: TailwindCSSで構築されたUIライブラリを共有する複数のNext.jsアプリを含むモノレポ

## コミュニティメンテナンスのサンプル

コミュニティは、Turborepoとさまざまなツールやライブラリを紹介する追加のサンプルを提供しています。

**注意**: これらのサンプルのGitHub Issueはクローズされます。問題が見つかった場合は、修正を含むプルリクエストを送信してください。
