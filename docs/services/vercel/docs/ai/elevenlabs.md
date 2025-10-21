# Vercel ElevenLabs 統合

[ElevenLabs](https://elevenlabs.io) は、高度な音声合成と音声処理技術を専門とするプラットフォームです。Vercelとの統合により、インタラクティブメディア体験を作成するための自然な音声と音声拡張を組み込むことができます。

## ユースケース

以下のようなAIアプリケーションで ElevenLabs を活用できます：

- **音声合成**: バーチャルアシスタントや音声読み上げアプリケーションでの自然な音声生成
- **音声拡張**: ノイズ低減や音声明瞭度の改善
- **インタラクティブメディア**: ゲームやインタラクティブメディアでのリアルな音声景観の実装

## 利用可能なモデル

### Eleven English v2
- **タイプ**: 音声
- 最高品質の英語テキスト読み上げモデル

### Eleven English v1
- **タイプ**: 音声
- オリジナルの ElevenLabs 英語テキスト読み上げモデル

### Eleven Multilingual v1
- **タイプ**: 音声
- 多言語テキスト読み上げモデル（Eleven Multilingual v2 に置き換えられました）

### Eleven Multilingual v2
- **タイプ**: 音声
- 28言語をサポートする多言語テキスト読み上げモデル

### Eleven Turbo v2
- **タイプ**: 音声
- 最速の英語テキスト読み上げモデル

### Eleven Turbo v2.5
- **タイプ**: 音声
- 改良された低レイテンシーモデル

## はじめに

### 依存関係のインストール

```bash
pnpm i elevenlabs
```

### 環境変数の設定

```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

## 使用例

### テキスト読み上げ

```typescript
import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const audio = await client.generate({
  voice: 'Rachel',
  text: 'こんにちは、ElevenLabsへようこそ',
  model_id: 'eleven_turbo_v2',
});

// 音声ストリームを処理
for await (const chunk of audio) {
  // 音声チャンクを再生または保存
}
```

### ストリーミング

```typescript
const audioStream = await client.generate({
  voice: 'Rachel',
  text: '長いテキストをストリーミング',
  model_id: 'eleven_turbo_v2',
  stream: true,
});

for await (const chunk of audioStream) {
  // リアルタイムで音声を再生
  playAudioChunk(chunk);
}
```

### 音声クローニング

```typescript
const voice = await client.voices.clone({
  name: 'Custom Voice',
  files: [audioFile1, audioFile2, audioFile3],
  description: 'カスタム音声の説明',
});

const audio = await client.generate({
  voice: voice.voice_id,
  text: 'クローンされた音声でのテキスト',
  model_id: 'eleven_multilingual_v2',
});
```

### 多言語対応

```typescript
const audio = await client.generate({
  voice: 'Rachel',
  text: 'Bonjour, comment allez-vous?',
  model_id: 'eleven_multilingual_v2',
  language_code: 'fr',
});
```

## パラメータ設定

### 音声設定

```typescript
const audio = await client.generate({
  voice: 'Rachel',
  text: 'テキスト',
  model_id: 'eleven_turbo_v2',
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  },
});
```

## 料金

ElevenLabsは、生成された文字数に基づいて課金されます。モデルによって料金が異なります。

## ベストプラクティス

- 低レイテンシーが必要な場合は Turbo モデルを使用
- 多言語アプリケーションには Multilingual v2 を使用
- 音声設定を調整して最適な結果を得る

## 関連リンク

- [ElevenLabs ドキュメント](https://elevenlabs.io/docs)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
