# AI Gateway

AI Gateway は、[すべてのプラン](/docs/plans)で利用可能で、その使用は [AI 製品利用規約](/legal/ai-product-terms) に従います。

[AI Gateway](https://vercel.com/ai-gateway) は、単一のエンドポイントを通じて[数百のモデル](https://vercel.com/ai-gateway/models)にアクセスするための統一 API を提供します。予算の設定、使用状況の監視、リクエストの負荷分散、フォールバックの管理が可能です。

このデザインは、[AI SDK 5](/docs/ai-gateway/getting-started)、[OpenAI SDK](/docs/ai-gateway/openai-compat)、または[お好みのフレームワーク](/docs/ai-gateway/framework-integrations)とシームレスに連携します。

## 主な機能

- **統一 API**: プロバイダーとモデル間を最小限のコード変更で切り替え可能
- **高い信頼性**: あるプロバイダーでリクエストが失敗した場合、自動的に他のプロバイダーにリトライ
- **埋め込みサポート**: 検索、検索、その他のタスク用のベクトル埋め込みを生成
- **支出モニタリング**: 異なるプロバイダー間の支出を監視

### コード例

#### AI SDK

```typescript
import { generateText } from 'ai';

const { text } = generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'What is the capital of France?',
});
```

#### Python

```python
import os
from openai import OpenAI

client = OpenAI(
  api_key=os.getenv('AI_GATEWAY_API_KEY'),
  base_url='https://ai-gateway.vercel.sh/v1',
)

response = client.chat.completions.create(
  model='anthropic/claude-sonnet-4',
  messages=[{'role': 'user', 'content': 'What is the capital of France?'}],
)
```

## 始め方

AI Gateway を使い始めるには、[はじめにガイド](/docs/ai-gateway/getting-started)をご覧ください。

## 料金

AI Gateway の料金については、[料金ページ](/docs/ai-gateway/pricing)をご覧ください。

## 関連リンク

- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [モデルとプロバイダ](/docs/ai-gateway/models-and-providers)
- [観測性](/docs/ai-gateway/observability)
- [認証](/docs/ai-gateway/authentication)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
