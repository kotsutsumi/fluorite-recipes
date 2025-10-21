# モデルバリアント

一部のAI推論プロバイダは、特別なモデルバリアントを提供しています。これらのモデルは、より大きなコンテキストサイズなど、異なる機能を持つことがあります。また、リクエストに応じて異なるコストが発生する可能性もあります。

AIゲートウェイがこれらのモデルを利用可能にすると、プロバイダカードの「モデルバリアント」セクションでその機能セットの概要が強調表示され、詳細へのリンクが提供されます。

モデルバリアントは、推論プロバイダのプレビューまたはベータ機能に依存することがあるため、安定したモデル機能よりも継続的な可用性が低い可能性があります。最新情報については、プロバイダのサイトを確認してください。

## Anthropic Claude Sonnet 4: 1Mトークンコンテキスト（ベータ）

ヘッダー `anthropic-beta: context-1m-2025-08-07` を有効にします。

- **詳細情報**: [アナウンスメント](https://www.anthropic.com/news/1m-context)、[コンテキストウィンドウのドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/context-windows#1m-token-context-window)
- **価格（概要）**: 総入力トークン（プロンプト + キャッシュの読み書き）が200Kを超える場合、入力は2倍、出力は1.5倍で課金されます。それ以外の場合は標準料金が適用されます。[価格の詳細](https://docs.anthropic.com/en/docs/about-claude/models#model-comparison-table)

### 使用例

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: '非常に長いコンテキストでの質問...',
  headers: {
    'anthropic-beta': 'context-1m-2025-08-07',
  },
});
```

## モデルバリアントの使用

### AI SDK

AI SDK を使用してモデルバリアントにアクセスするには、適切なヘッダーを設定します：

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'あなたのプロンプト',
  headers: {
    'anthropic-beta': 'context-1m-2025-08-07',
  },
});
```

### OpenAI SDK

OpenAI 互換 API を使用する場合：

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

const response = await openai.chat.completions.create(
  {
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: 'あなたのプロンプト',
      },
    ],
  },
  {
    headers: {
      'anthropic-beta': 'context-1m-2025-08-07',
    },
  }
);
```

### Python

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv('AI_GATEWAY_API_KEY'),
    base_url='https://ai-gateway.vercel.sh/v1',
)

response = client.chat.completions.create(
    model='anthropic/claude-sonnet-4',
    messages=[
        {
            'role': 'user',
            'content': 'あなたのプロンプト',
        }
    ],
    extra_headers={
        'anthropic-beta': 'context-1m-2025-08-07',
    },
)
```

## ベストプラクティス

### コストの考慮

モデルバリアントは、標準モデルとは異なる料金体系を持つことがあります。大規模なコンテキストを使用する場合は、コストを慎重に監視してください。

```typescript
// コストを監視するために観測性ダッシュボードを確認
const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: '長いコンテキスト...',
  headers: {
    'anthropic-beta': 'context-1m-2025-08-07',
  },
});
```

### 可用性の確認

モデルバリアントはベータ機能であることが多いため、本番環境で使用する前に、可用性と安定性を確認してください。

### フォールバック戦略

モデルバリアントが利用できない場合のフォールバック戦略を実装します：

```typescript
try {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'あなたのプロンプト',
    headers: {
      'anthropic-beta': 'context-1m-2025-08-07',
    },
  });
  console.log(result.text);
} catch (error) {
  console.log('バリアントが利用できません。標準モデルにフォールバック');
  const fallbackResult = await generateText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'あなたのプロンプト',
  });
  console.log(fallbackResult.text);
}
```

## 観測性

AI Gateway の[観測性ダッシュボード](/docs/ai-gateway/observability)を使用して、モデルバリアントの使用状況とコストを監視します：

- リクエスト数
- トークン使用量
- レイテンシ
- コスト

## 今後のバリアント

新しいモデルバリアントが利用可能になると、AI Gateway でサポートされます。最新情報については、以下を確認してください：

- [AI Gateway モデルページ](https://vercel.com/ai-gateway/models)
- 各プロバイダーの公式ドキュメント
- AI Gateway のリリースノート

## 関連リンク

- [利用可能なモデル](https://vercel.com/ai-gateway/models)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [観測性](/docs/ai-gateway/observability)
- [料金](/docs/ai-gateway/pricing)
