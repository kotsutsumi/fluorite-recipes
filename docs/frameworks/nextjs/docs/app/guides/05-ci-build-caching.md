# CI ビルドキャッシュ

Next.js は `.next/cache` にキャッシュを保存し、ビルド間で共有することでビルドパフォーマンスを向上させます。この機能を活用するには、CI ワークフローをビルド間でキャッシュを保持するように設定する必要があります。

## 主要な CI プロバイダーのキャッシュ設定

### Vercel

- 自動キャッシュ、設定不要
- Turborepo ユーザーは Vercel のドキュメントで追加の詳細を確認できます

### CircleCI

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

### Travis CI

```yaml
cache:
  directories:
    - $HOME/.cache/yarn
    - node_modules
    - .next/cache
```

### GitLab CI

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/
```

### GitHub Actions

```yaml
uses: actions/cache@v4
with:
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

### その他のプロバイダー

以下のプロバイダーも特定のキャッシュ設定をサポートしています：

- Netlify
- AWS CodeBuild
- Bitbucket Pipelines
- Heroku
- Azure Pipelines
- Jenkins

## 重要なポイント

キーとなるのは、ビルドステップ間で `.next/cache` ディレクトリが保持されるようにすることです。これにより、パフォーマンスが向上し、ビルド時間が短縮されます。

## ベストプラクティス

1. **依存関係のキャッシュ**: `node_modules` と `.next/cache` の両方をキャッシュする
2. **キャッシュキーの設定**: ロックファイル（`package-lock.json`、`yarn.lock` など）のチェックサムを使用してキャッシュキーを生成する
3. **パフォーマンス監視**: キャッシュの効果を測定し、ビルド時間の改善を追跡する

CI 環境で Next.js のビルドキャッシュを適切に設定することで、デプロイメントパイプラインの効率が大幅に向上します。
