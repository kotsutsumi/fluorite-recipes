# アップグレード

Next.jsの新しいバージョンにアップグレードするには、いくつかの方法があります。

このページでは、Next.jsアプリケーションを最新バージョンまたはカナリアバージョンにアップグレードする方法について学びます。

## 最新バージョンへのアップグレード

最新バージョンのNext.jsにアップグレードするには、アップグレードコードモードを使用できます：

```bash
npx @next/codemod@latest upgrade latest
```

このコマンドは、Next.jsとその関連パッケージを最新バージョンにアップグレードし、必要なコード変更を自動的に適用します。

### 手動アップグレード

手動でアップグレードする場合は、以下のコマンドを実行します：

**npm**:
```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

**pnpm**:
```bash
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

**yarn**:
```bash
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

**bun**:
```bash
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

> **知っておくと良いこと**:
>
> - TypeScriptを使用している場合は、`@types/react`と`@types/react-dom`も最新バージョンにアップグレードしてください。

## カナリアバージョンへのアップグレード

カナリアチャンネルでは、Next.jsの最新機能を早期にテストできます。カナリアリリースは、Next.jsの次のバージョンに含まれる予定の機能を含みます。

カナリアバージョンにアップグレードするには：

```bash
npm i next@canary
```

### カナリアで利用可能な機能

カナリアバージョンには、次の実験的な機能が含まれています：

**キャッシング**:
- `"use cache"` ディレクティブ
- `cacheLife` 設定
- `cacheTag` 関数
- `cacheComponents` オプション

**認証**:
- `forbidden` 関数
- `unauthorized` 関数
- `forbidden.js` ファイル
- `unauthorized.js` ファイル
- `authInterrupts` 設定

> **警告**: カナリアバージョンは実験的な機能を含み、本番環境での使用は推奨されません。

## バージョン別アップグレードガイド

### バージョン15へのアップグレード

Next.js 15にアップグレードするには、以下の手順に従ってください：

1. **依存関係のアップグレード**:

```bash
npm i next@15 react@rc react-dom@rc
```

2. **コードモードの実行**:

```bash
npx @next/codemod@latest upgrade latest
```

3. **主な変更点の確認**:

- **React 19**: Next.js 15にはReact 19が含まれています
- **非同期Request APIs**: `cookies()`、`headers()`、`params`、`searchParams`が非同期になりました
- **キャッシングのセマンティクス**: `fetch`リクエストは、`GET`ルートハンドラーと`Client Router Cache`がデフォルトでキャッシュされなくなりました
- **ルートハンドラーのデフォルトランタイム**: Route HandlersのデフォルトランタイムがNode.jsになりました

詳細については、[Version 15アップグレードガイド](/docs/app/building-your-application/upgrading/version-15)を参照してください。

### バージョン14へのアップグレード

Next.js 14にアップグレードするには、以下の手順に従ってください：

1. **依存関係のアップグレード**:

```bash
npm i next@14 react@latest react-dom@latest
```

2. **主な変更点の確認**:

- **最小Node.jsバージョン**: Node.js 18.17以降が必要です
- **`next/image`の改善**: メモリ使用量の改善と、より高速な画像最適化
- **`next/link`の動作**: `<Link>`コンポーネントは、常に`<a>`タグをレンダリングします
- **Turbopack**: 開発環境でのTurbopackサポートが改善されました

詳細については、[Version 14アップグレードガイド](/docs/app/building-your-application/upgrading/version-14)を参照してください。

## コードモード

コードモードは、コードベースの変換を自動化するツールです。これにより、APIが変更されたときに、多くのファイルをプログラム的に変更できます。

Next.jsは、以下のコードモードを提供しています：

### 利用可能なコードモード

**App Routerへの移行**:
- `app-dir-migration`: `pages`ディレクトリから`app`ディレクトリへの移行を支援します

**React機能のアップグレード**:
- `new-link`: `<Link>`コンポーネントを新しいAPIに変換します
- `next-image-to-legacy-image`: `next/image`を`next/legacy/image`に変換します
- `next-image-experimental`: `next/legacy/image`から新しい`next/image`に変換します

**メタデータAPI**:
- `metadata-to-segment-config`: Metadataをセグメント設定に変換します

**組み込みNext.js APIの変更**:
- `next-og-import`: 動的OG画像生成のインポートパスを変更します
- `next-dynamic-access-named-export`: 名前付きエクスポートから`next/dynamic`にアクセスする方法を変更します

### コードモードの実行

コードモードを実行するには、以下のコマンドを使用します：

```bash
npx @next/codemod <transform> <path>
```

例：

```bash
npx @next/codemod new-link ./pages
```

**オプション**:
- `<transform>`: コードモードの名前
- `<path>`: 変換を適用するファイルまたはディレクトリ
- `--dry`: ドライラン（変更をプレビュー）
- `--print`: 変更された出力を比較のために印刷

## 段階的なアップグレード戦略

大規模なアプリケーションの場合、段階的なアップグレードアプローチを推奨します：

### ステップ1: 依存関係の確認

アップグレード前に、すべての依存関係が新しいNext.jsバージョンと互換性があることを確認してください：

```bash
npm outdated
```

### ステップ2: 開発環境でのテスト

本番環境にデプロイする前に、開発環境で徹底的にテストしてください：

```bash
npm run dev
```

### ステップ3: ビルドの検証

アップグレード後、ビルドが成功することを確認してください：

```bash
npm run build
```

### ステップ4: E2Eテストの実行

可能であれば、E2E（エンドツーエンド）テストを実行して、すべての機能が期待どおりに動作することを確認してください。

### ステップ5: 本番環境へのデプロイ

すべてのテストが成功したら、本番環境にデプロイします。

## トラブルシューティング

### 一般的な問題

**型エラー（TypeScript）**:

TypeScriptを使用している場合、型定義が正しくインストールされていることを確認してください：

```bash
npm i -D @types/react @types/react-dom
```

**ビルドエラー**:

ビルドエラーが発生した場合、キャッシュをクリアしてみてください：

```bash
rm -rf .next
npm run build
```

**依存関係の競合**:

依存関係の競合が発生した場合、`node_modules`を削除して再インストールしてください：

```bash
rm -rf node_modules package-lock.json
npm install
```

### サポートが必要な場合

アップグレードで問題が発生した場合：

1. [Next.jsドキュメント](https://nextjs.org/docs)を確認してください
2. [GitHub Discussions](https://github.com/vercel/next.js/discussions)でコミュニティに質問してください
3. [GitHub Issues](https://github.com/vercel/next.js/issues)でバグを報告してください

## ベストプラクティス

### アップグレード前のチェックリスト

- [ ] 現在のコードをバージョン管理システムにコミット
- [ ] 依存関係の互換性を確認
- [ ] 破壊的変更のドキュメントを確認
- [ ] バックアップを作成

### アップグレード後のチェックリスト

- [ ] すべてのテストが成功することを確認
- [ ] 本番ビルドが成功することを確認
- [ ] パフォーマンスメトリクスを確認
- [ ] エラーモニタリングを確認

### 定期的なアップグレード

Next.jsのアップグレードを定期的に行うことで、以下のメリットがあります：

- **セキュリティ**: 最新のセキュリティパッチを取得
- **パフォーマンス**: パフォーマンスの改善を活用
- **機能**: 新しい機能とAPIを使用
- **サポート**: コミュニティサポートを受けやすい

## 次のステップ

これで、Next.jsをアップグレードする方法を理解できました。次のステップでは、さらに詳細なアップグレードガイドについて学びます：

- **[Version 15 Upgrade Guide](/docs/app/building-your-application/upgrading/version-15)**: バージョン15への詳細なアップグレードガイドを参照してください。
- **[Version 14 Upgrade Guide](/docs/app/building-your-application/upgrading/version-14)**: バージョン14への詳細なアップグレードガイドを参照してください。
- **[Codemods](/docs/app/building-your-application/upgrading/codemods)**: 利用可能なすべてのコードモードについて学びます。
