# turbopackPersistentCaching

> **警告**: この機能は現在canaryチャンネルで利用可能です。変更される可能性があり、実験的な機能です。

Turbopack Persistent Cachingは、`next dev`と`next build`コマンド間で作業を削減できます：

- ビルド間で`.next`フォルダにデータを保存および復元します
- 後続のビルドと開発セッションを高速化する可能性があります

## 設定例

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackPersistentCaching: true,
  },
}

export default nextConfig
```

## 重要な注意事項

> **警告**: Persistent Cachingはまだ開発中であり、安定していません

> **Good to know**: ほとんどのキャッシュエントリは、異なる設定と環境変数のため、コマンド固有です

## 動作

Persistent Cachingを有効にすると、Turbopackは以下を行います：

1. ビルド成果物を`.next/cache/turbopack`に保存します
2. 後続のビルドでキャッシュされたデータを読み込みます
3. 変更されていないファイルの処理をスキップします
4. 増分ビルド時間を大幅に短縮します

## パフォーマンスへの影響

Persistent Cachingは、以下のシナリオで特に有効です：

- 大規模なコードベース
- 頻繁なビルド
- CI/CD環境

## 推奨事項

- この機能を採用する際には、いくつかの安定性の問題が予想されます
- [GitHub issues](https://github.com/vercel/next.js/issues)を通じてフィードバックを提供することをお勧めします

## キャッシュの管理

キャッシュをクリアする必要がある場合：

```bash
# キャッシュディレクトリを削除
rm -rf .next/cache/turbopack
```

または、`.gitignore`にキャッシュディレクトリを追加することを検討してください：

```bash filename=".gitignore"
.next/cache/turbopack
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.5.0` | Persistent cachingが実験的機能としてリリースされました |

## 関連項目

- [Turbopackドキュメント](https://turbo.build/pack/docs)
- [Next.jsキャッシング](/docs/app/building-your-application/caching)
