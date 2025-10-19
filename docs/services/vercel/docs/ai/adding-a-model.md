# モデルの追加

## モデルの探索

モデルを探索するには:

1. 検索バー、プロバイダ選択、またはタイプフィルターを使用して、追加したいモデルを見つけます
2. 「Explore」ボタンを押して、追加したいモデルを選択します
3. モデルプレイグラウンドが開き、プロジェクトに追加する前にモデルをテストできます

## モデルプレイグラウンドの使用

モデルプレイグラウンドでは、プロジェクトに追加する前にモデルの機能をテストできます。

- **プロバイダを未インストールの場合**: 各プロバイダで10回の生成が可能
- **設定のカスタマイズ**: モデルの設定（温度、最大出力長など）を構成できます
- **異なるインターフェース**: モデルの種類によって、プレイグラウンドのインターフェースが異なります（チャットモデル、画像モデルなど）

### プレイグラウンドの機能

- **プロンプトテスト**: さまざまなプロンプトを試して、モデルの応答を確認
- **パラメータ調整**: 温度、max_tokens、top_pなどを調整
- **結果の比較**: 異なる設定での結果を比較
- **コードエクスポート**: テスト結果をコードとしてエクスポート

## プロジェクトへのモデル追加

モデルをプロジェクトに追加するには:

1. 「Add Model」ボタンを選択
2. 複数のプロバイダがサポートしている場合、使用するプロバイダを選択
3. プロバイダカードを確認し、「Add Provider」ボタンを押す
4. プロジェクトへのアクセス権を設定（全プロジェクトまたは特定のプロジェクト）
5. プロバイダのウェブサイトでの接続プロセスを完了
6. Vercelダッシュボードのプロバイダ統合ページにリダイレクトされます

## コードでのモデルの使用

### AI SDK

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Hello, world!',
});

console.log(result.text);
```

### AI Gateway

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Hello, world!',
});

console.log(result.text);
```

## モデルタイプ

### チャットモデル

テキストベースの会話に使用：

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'openai/gpt-5',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
});
```

### 画像生成モデル

テキストから画像を生成：

```typescript
import { generateImage } from 'ai';

const result = await generateImage({
  model: 'fal/flux-pro',
  prompt: 'A beautiful sunset over the ocean',
});
```

### 埋め込みモデル

テキストをベクトルに変換：

```typescript
import { embed } from 'ai';

const result = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'Hello, world!',
});
```

### 音声モデル

音声合成とテキスト読み上げ：

```typescript
import { synthesize } from 'ai';

const result = await synthesize({
  model: 'elevenlabs/eleven-turbo-v2',
  text: 'Hello, world!',
});
```

## モデルの設定

### 温度

モデルの創造性を制御：

```typescript
const result = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Write a story',
  temperature: 0.7, // 0.0（決定的）〜 1.0（創造的）
});
```

### 最大トークン数

生成される最大トークン数：

```typescript
const result = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Explain quantum physics',
  maxTokens: 500,
});
```

### Top P

出力の多様性を制御：

```typescript
const result = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Generate a poem',
  topP: 0.9,
});
```

## モデルの比較

### 異なるモデルのテスト

```typescript
const models = ['openai/gpt-5', 'anthropic/claude-sonnet-4', 'groq/llama-3.1-70b'];

for (const model of models) {
  const result = await generateText({
    model,
    prompt: 'What is AI?',
  });
  console.log(`${model}: ${result.text}`);
}
```

### パフォーマンス比較

- **レイテンシ**: モデルの応答速度
- **品質**: 出力の品質
- **コスト**: トークンあたりのコスト

## おすすめのAIモデル

Vercelは、さまざまなユースケースに適したモデルを推奨しています。AIダッシュボードの「Recommended」セクションで確認できます。

### 人気のモデル

- **OpenAI GPT-5**: 汎用言語タスク
- **Anthropic Claude Sonnet 4**: 長いコンテキストと複雑な推論
- **Groq Llama 3.1**: 高速推論
- **fal FLUX Pro**: 高品質画像生成
- **ElevenLabs Turbo v2**: 自然な音声合成

## ベストプラクティス

### モデルの選択

1. **ユースケースを考慮**: タスクに最適なモデルを選択
2. **コストを評価**: 予算内で最高のパフォーマンスを得る
3. **レイテンシを確認**: リアルタイムアプリケーションでは低レイテンシが重要

### テストと最適化

1. **プレイグラウンドでテスト**: 本番環境に展開する前にテスト
2. **パラメータを調整**: 最適な設定を見つける
3. **複数のモデルを比較**: 最適なモデルを選択

### 監視

- [観測性ダッシュボード](/docs/ai-gateway/observability)を使用して使用状況を監視
- コストとパフォーマンスを追跡
- エラー率を監視

## トラブルシューティング

### モデルが見つからない

**症状**: 特定のモデルが利用できない

**解決策**:
- プロバイダがインストールされているか確認
- モデル名が正しいか確認
- プロバイダのドキュメントを確認

### レート制限エラー

**症状**: レート制限に達した

**解決策**:
- リクエストの頻度を減らす
- より高いティアのプランにアップグレード
- 複数のプロバイダを使用してロードバランシング

## 関連リンク

- [プロバイダーの追加](/docs/ai/adding-a-provider)
- [AI SDK](https://sdk.vercel.ai)
- [AI Gateway](/docs/ai-gateway)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
