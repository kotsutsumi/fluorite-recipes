# output

`output` 設定は、本番ビルドに必要なファイルのみを自動的にトレースして含めることで、デプロイを最適化するのに役立ちます。

## 動作原理

- `next build` 中に、Next.js は `@vercel/nft` を使用してインポート、require、ファイルシステムの使用を静的に分析
- 各ページに必要なファイルを正確に判断
- 本番サーバーをトレースして必要なファイルを特定

## Standalone 出力オプション

`next.config.js` で `output: 'standalone'` を設定すると、次のことができます:

- 最小限のデプロイファイルを含む `.next/standalone` フォルダを作成
- アプリケーションを実行するための最小限の `server.js` を生成
- `node_modules` のインストール要件を除外

### 設定例

```javascript
module.exports = {
  output: 'standalone',
}
```

## 追加機能

- 本番デプロイに必要なファイルを自動的にコピー
- `public` と `.next/static` フォルダの手動コピーを許可
- モノレポセットアップでのカスタムトレースルートをサポート
- `outputFileTracingIncludes` と `outputFileTracingExcludes` を使用して特定のファイルを含める/除外するオプションを提供

## 注意事項

- 一部の複雑なセットアップでは、手動ファイルトレース設定が必要になる場合があります
- すべてのルート (Edge Runtime など) がトレースの影響を受けるわけではありません

目標は、必要不可欠なファイルのみを含めることで、より効率的で軽量なデプロイを作成することです。
