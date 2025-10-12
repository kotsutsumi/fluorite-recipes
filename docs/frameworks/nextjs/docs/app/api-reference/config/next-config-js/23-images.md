# images

`images` 設定を使用すると、Next.js で画像の読み込みと最適化をカスタマイズできます。

## カスタム画像ローダーの設定

```javascript
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

## カスタムローダー関数の例

```javascript
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

## 主要なポイント

- ローダーファイルは文字列 URL を返す関数をエクスポートする必要があります
- 関数のシリアライゼーションのため、クライアントコンポーネントを使用する必要があります
- `next.config.js` でグローバルに設定するか、`loader` プロップを使用して画像ごとに設定できます
- Akamai、Cloudinary、Cloudflare などの複数のクラウド画像最適化プロバイダーをサポート

## サポートされる画像 CDN

ドキュメントには、以下のような様々な画像 CDN と最適化サービスの詳細なローダー設定が提供されています:

- **Akamai**: グローバル CDN プロバイダー
- **Cloudinary**: 包括的な画像管理プラットフォーム
- **Cloudflare**: パフォーマンス重視の CDN
- その他多数

## 柔軟性

この設定は柔軟で、異なるホスティングや画像変換プラットフォーム間で高度な画像最適化技術をサポートし、開発者がカスタム画像処理ワークフローを簡単に統合できるようにします。
