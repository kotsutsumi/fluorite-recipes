# PRプレビュー用のGitHub Actions

## 概要

GitHub Actionを使用して、プルリクエスト用のプレビューアップデートを自動的に公開します。

## セットアップ手順

### 1. Expoアクセストークンの生成

- Expoアクセストークンを生成
- `EXPO_TOKEN`としてリポジトリシークレットに追加

### 2. ワークフローファイルの作成

`.github/workflows/preview.yml`:

```yaml
name: preview
on: pull_request
jobs:
  update:
    name: EAS Update
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
      - run: npm ci
      - run: eas update --auto
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Bunを使用する場合

```yaml
- uses: oven-sh/setup-bun@v1
- run: bun install
- run: bun eas update --auto
```

## 利点

- プルリクエストごとに自動的にプレビューアップデートを公開
- マージ前に変更をテスト
- チームコラボレーションの改善
