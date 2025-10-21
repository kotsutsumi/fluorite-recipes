# Open Graph(OG)画像生成

## メリット

- **パフォーマンス**: 高速な画像生成のために、関数がほぼ瞬時に開始
- **使いやすさ**: HTMLとCSSを使用して画像を定義
- **コスト効率**: 計算された画像をエッジで自動的にキャッシュ

## サポートされている機能

- flexboxや絶対配置を含む基本的なCSSレイアウト
- カスタムフォントとテキストスタイリング
- Google Fontsからのフォント文字サブセットのダウンロード
- Vercelにデプロイされた任意のフレームワークと互換性あり
- 本番デプロイメント前にOG画像をプレビュー

## ランタイムサポート

Node.jsランタイムでサポートされています。ローカルおよびリモートリソースを読み込むことができます:

```javascript
const fs = require('fs').promises;

const loadLocalImage = async () => {
  const imageData = await fs.readFile('/path/to/image.png');
  // 画像データを処理
};
```

### ランタイムの注意事項

| 設定 | サポートされている構文 | 注記 |
|--------------|-----------------|-------|
| `pages/` + Edge runtime | `return new Response(…)` | 完全サポート |
| `app/` + Node.js runtime | `return new Response(…)` | 完全サポート |
| `app/` + Edge runtime | `return new Response(…)` | 完全サポート |
| `pages/` + Node.js runtime | サポートされていません | `return new Response(…)`をサポートしていません |

## 使用要件

- Node.js 22以降
- `@vercel/og`をインストール
- Next.js v12.2.3+を推奨
- 画像生成用のAPIエンドポイントを作成
- `robots.txt`にOG画像ルートを追加

## 開始例

```typescript
import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👋 Hello
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```
