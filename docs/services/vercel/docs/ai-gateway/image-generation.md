# イメージ生成

AI Gatewayは、イメージ生成および編集機能をサポートしています。テキストプロンプトから新しい画像を生成し、既存の画像を編集し、自然言語の指示で画像のバリエーションを作成できます。

利用可能なイメージ生成モデルは、[AI Gatewayモデルページ](https://vercel.com/ai-gateway/models)のイメージフィルターで確認できます。

## Google Gemini 2.5 Flash Image

Googleの[Gemini 2.5 Flash Imageモデル](https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/)は、最先端のイメージ生成および編集機能を提供します。このモデルは、テキストレスポンスと共に画像出力を可能にする[レスポンスモダリティの指定](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#image-outputs)をサポートしています。

## 基本的な画像生成

`generateText`または`streamText`関数を使用して、テキストプロンプトから画像を生成します。

### TypeScript (generateText)

```typescript
import 'dotenv/config';
import { generateText } from 'ai';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const result = await generateText({
    model: 'google/gemini-2.5-flash-image-preview',
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    prompt:
      '夕日の湖で丸太の上で眠るイシガメの2つのバージョンをレンダリングしてください。',
  });

  // 画像を保存
  if (result.experimental_attachments) {
    for (const [index, attachment] of result.experimental_attachments.entries()) {
      if (attachment.contentType?.startsWith('image/')) {
        const buffer = Buffer.from(attachment.data, 'base64');
        const filename = `output-${index}.${attachment.contentType.split('/')[1]}`;
        fs.writeFileSync(path.join(__dirname, filename), buffer);
        console.log(`Saved image: ${filename}`);
      }
    }
  }

  console.log('Text response:', result.text);
}

main();
```

### TypeScript (streamText)

```typescript
import 'dotenv/config';
import { streamText } from 'ai';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const result = streamText({
    model: 'google/gemini-2.5-flash-image-preview',
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    prompt: '美しい夕焼けの風景画を生成してください。',
  });

  // テキストをストリーミング
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  // 完了後に画像を保存
  const finalResult = await result.response;
  if (finalResult.experimental_attachments) {
    for (const [index, attachment] of finalResult.experimental_attachments.entries()) {
      if (attachment.contentType?.startsWith('image/')) {
        const buffer = Buffer.from(attachment.data, 'base64');
        const filename = `stream-output-${index}.${attachment.contentType.split('/')[1]}`;
        fs.writeFileSync(path.join(__dirname, filename), buffer);
        console.log(`\nSaved image: ${filename}`);
      }
    }
  }
}

main();
```

## 画像編集

既存の画像を入力として使用し、それを編集または変更できます：

```typescript
import 'dotenv/config';
import { generateText } from 'ai';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  // 既存の画像を読み込む
  const inputImagePath = path.join(__dirname, 'input.jpg');
  const inputImageBuffer = fs.readFileSync(inputImagePath);
  const inputImageBase64 = inputImageBuffer.toString('base64');

  const result = await generateText({
    model: 'google/gemini-2.5-flash-image-preview',
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'この画像に虹を追加してください。',
          },
          {
            type: 'image',
            image: inputImageBase64,
          },
        ],
      },
    ],
  });

  // 編集された画像を保存
  if (result.experimental_attachments) {
    for (const [index, attachment] of result.experimental_attachments.entries()) {
      if (attachment.contentType?.startsWith('image/')) {
        const buffer = Buffer.from(attachment.data, 'base64');
        const filename = `edited-${index}.${attachment.contentType.split('/')[1]}`;
        fs.writeFileSync(path.join(__dirname, filename), buffer);
        console.log(`Saved edited image: ${filename}`);
      }
    }
  }

  console.log('Text response:', result.text);
}

main();
```

## 画像バリエーション

既存の画像に基づいてバリエーションを生成できます：

```typescript
import 'dotenv/config';
import { generateText } from 'ai';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const inputImagePath = path.join(__dirname, 'input.jpg');
  const inputImageBuffer = fs.readFileSync(inputImagePath);
  const inputImageBase64 = inputImageBuffer.toString('base64');

  const result = await generateText({
    model: 'google/gemini-2.5-flash-image-preview',
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'この画像の3つの異なるスタイルバリエーションを作成してください。',
          },
          {
            type: 'image',
            image: inputImageBase64,
          },
        ],
      },
    ],
  });

  // バリエーションを保存
  if (result.experimental_attachments) {
    for (const [index, attachment] of result.experimental_attachments.entries()) {
      if (attachment.contentType?.startsWith('image/')) {
        const buffer = Buffer.from(attachment.data, 'base64');
        const filename = `variation-${index}.${attachment.contentType.split('/')[1]}`;
        fs.writeFileSync(path.join(__dirname, filename), buffer);
        console.log(`Saved variation: ${filename}`);
      }
    }
  }

  console.log('Text response:', result.text);
}

main();
```

## サポートされている画像形式

- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- GIF (`.gif`)

## ベストプラクティス

### プロンプトの最適化

明確で詳細なプロンプトを使用して、より良い結果を得ます：

```typescript
// 良いプロンプト
const result = await generateText({
  model: 'google/gemini-2.5-flash-image-preview',
  providerOptions: {
    google: { responseModalities: ['TEXT', 'IMAGE'] },
  },
  prompt: '青い空と白い雲のある、山々に囲まれた静かな湖の写実的な風景画を生成してください。',
});

// 悪いプロンプト
const result = await generateText({
  model: 'google/gemini-2.5-flash-image-preview',
  providerOptions: {
    google: { responseModalities: ['TEXT', 'IMAGE'] },
  },
  prompt: '風景画',
});
```

### エラーハンドリング

```typescript
try {
  const result = await generateText({
    model: 'google/gemini-2.5-flash-image-preview',
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    prompt: '美しい夕焼けを生成してください。',
  });

  if (result.experimental_attachments) {
    // 画像を処理
  }
} catch (error) {
  console.error('Image generation error:', error);
  // フォールバックロジック
}
```

### コスト管理

画像生成は、テキスト生成よりもコストが高い場合があります。[観測性ダッシュボード](/docs/ai-gateway/observability)を使用して、使用状況とコストを監視してください。

## 制限事項

- 画像のサイズと解像度には制限があります
- 一部のモデルは特定の画像形式のみをサポートします
- 生成時間は、画像の複雑さによって異なります

## 関連リンク

- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
- [Google Generative AI プロバイダー](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
- [観測性](/docs/ai-gateway/observability)
