# Next.js 9.5

**投稿日**: 2020年7月27日（月曜日）

**著者**: Connor Davis、JJ Kasper、Joe Haddad、Luis Alvarez、Shu Uesugi、Tim Neutkens

## 主な機能

Next.js 9.5では、いくつかの重要な改善が導入されました：

### 1. 安定したインクリメンタル静的再生成

デプロイ後にミリ秒単位で静的ページを再ビルド

### 2. カスタマイズ可能なベースパス

ドメインのサブパスでNext.jsプロジェクトをホスト

### 3. リライト、リダイレクト、ヘッダーのサポート

URLルーティングとページメタデータを管理

### 4. URLの末尾スラッシュオプション

URL スラッシュの動作を一貫して適用

### 5. ページバンドルの永続的キャッシング

ビルド間で変更されていないJavaScriptファイルを引き継ぐ

### 6. Fast Refreshの機能強化

ライブ編集体験を改善

### 7. 本番環境でのReactプロファイリング

レンダリング「コスト」を測定

### 8. オプションのキャッチオールルート

SEO主導のユースケースのためのより柔軟性

### 9. Webpack 5サポート（ベータ）

ビルドサイズと速度を改善

## 詳細ハイライト

### インクリメンタル静的再生成

この機能により、バックグラウンドで再レンダリングすることで、既存の静的ページを更新できます。「stale-while-revalidate」メカニズムに触発されています。

設定例：
```javascript
export async function getStaticProps() {
  return {
    props: await getDataFromCMS(),
    revalidate: 1,
  };
}
```

### カスタマイズ可能なベースパス

特定のパス下でプロジェクトルーティングを簡単に設定：

```javascript
module.exports = {
  basePath: '/docs',
};
```

### リライトとリダイレクト

URLルーティングとリダイレクトを設定：

```javascript
module.exports = {
  async rewrites() {
    return [
      { source: '/backend/:path*', destination: 'https://example.com/:path*' },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
```

## まとめ

Next.js 9.5は、開発者に高度なルーティング機能、パフォーマンスの最適化、柔軟なデプロイメントオプションを提供します。
