# バイナリサイズ問題のトラブルシューティング

Prisma Clientのバイナリサイズを最適化します。

## バイナリサイズの削減

### 1. engineTypeの設定

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定により、Rustバイナリがダウンロードされず、デプロイメントサイズが大幅に削減されます。

### 2. 必要なバイナリターゲットのみを含める

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native"]
}
```

### 3. 本番ビルドの最適化

`package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && npm prune --production"
  }
}
```

## デプロイメントプラットフォーム固有の最適化

### Vercel

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

### AWS Lambda

レイヤーを使用してPrisma Clientを共有:

```bash
# レイヤーの作成
mkdir prisma-layer
cd prisma-layer
npm install @prisma/client
```

## ベストプラクティス

- `engineType = "client"`を使用
- 不要な依存関係を削除
- デプロイメントパッケージを最適化
