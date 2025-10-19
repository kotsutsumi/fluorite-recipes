# Vercel fal 統合

[fal](https://fal.ai/) は、~120ms 以下の高速推論を実現する、リアルタイムAIアプリケーション開発プラットフォームです。拡散モデルに特化し、コールドスタートがなく、使用した分だけ課金されるモデルを提供しています。

## ユースケース

以下のようなAIアプリケーションに活用できます：

- **テキストから画像生成**: リアルタイムでテキスト説明から複雑な視覚コンテンツを即座に作成
- **リアルタイム画像処理**: ストリーミングビデオのリアルタイムフィルター、拡張、物体認識
- **深度マップ作成**: 3Dモデリング、拡張現実、高度な写真編集のための空間関係理解

## 利用可能なモデル

### Stable Diffusion XL
- **タイプ**: 画像
- 光速でSDXLを実行

### Creative Upscaler
- **タイプ**: 画像
- クリエイティブな画像アップスケール

### FLUX.1 [dev] with LoRAs
- **タイプ**: 画像
- 高速でパーソナライズされたスタイルや特定のブランドアイデンティティの画像生成

### Veo 2 テキストからビデオ
- **タイプ**: ビデオ
- リアルな動きと高品質な出力

### Wan-2.1 画像からビデオ
- **タイプ**: ビデオ
- 静止画から自然で流れるような動きのあるビデオ生成

## はじめに

### 依存関係のインストール

```bash
pnpm i @fal-ai/serverless-client
```

### 環境変数の設定

```env
FAL_KEY=your-fal-api-key
```

## 使用例

### テキストから画像

```typescript
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: process.env.FAL_KEY,
});

const result = await fal.subscribe('fal-ai/flux-pro', {
  input: {
    prompt: '美しい夕焼けの風景',
  },
});

console.log(result.images[0].url);
```

### 画像アップスケール

```typescript
const result = await fal.subscribe('fal-ai/creative-upscaler', {
  input: {
    image_url: 'https://example.com/image.jpg',
    prompt: '高解像度の詳細な画像',
  },
});
```

### ビデオ生成

```typescript
const result = await fal.subscribe('fal-ai/veo-2', {
  input: {
    prompt: '海辺を歩く人',
    num_frames: 60,
  },
});

console.log(result.video.url);
```

## リアルタイムストリーミング

```typescript
const stream = await fal.stream('fal-ai/flux-pro', {
  input: {
    prompt: '抽象的なアート',
  },
  onQueueUpdate: (update) => {
    console.log('Queue update:', update);
  },
});

for await (const event of stream) {
  console.log('Event:', event);
}
```

## 料金

falは使用量ベースの課金で、コールドスタートがないため、予測可能なコストとパフォーマンスを提供します。

## ベストプラクティス

- リアルタイムアプリケーションにはストリーミングを使用
- プロンプトを最適化して最良の結果を得る
- 適切なモデルを選択してコストとパフォーマンスをバランス

## 関連リンク

- [fal ドキュメント](https://fal.ai/docs)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
