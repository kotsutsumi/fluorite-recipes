# モデルとプロバイダ

AIゲートウェイの統一APIは柔軟に設計されており、アプリケーションの一部を書き換えることなく、[異なるAIモデル](https://vercel.com/ai-gateway/models)とプロバイダを切り替えることができます。これは、異なるモデルをテストしたり、コストやパフォーマンス上の理由で基盤となるAIプロバイダを変更したい場合に便利です。

サポートされているモデルとプロバイダの一覧を確認するには、[AIゲートウェイモデルページ](https://vercel.com/ai-gateway/models)をチェックしてください。

## モデルとプロバイダとは

**モデル**は入力データを処理して応答を生成するAIアルゴリズムです。例えば、[Grok](https://docs.x.ai/docs/models)、[GPT-5](https://platform.openai.com/docs/models/gpt-5)、[Claude Sonnet 4](https://www.anthropic.com/claude/sonnet)などがあります。

**プロバイダ**は、これらのモデルをホストする企業またはサービスで、[xAI](https://x.ai)、[OpenAI](https://openai.com)、[Anthropic](https://anthropic.com)などがあります。

## モデルの指定方法

モデルとプロバイダを指定する方法は2つあります：

1. AISDKの関数呼び出しの一部として
2. アプリケーション内のすべてのリクエストにグローバルに

### AISDKの関数呼び出しの一部として

AISDKでは、プレーンな文字列またはAIゲートウェイプロバイダを使用してモデルを指定できます。

#### プレーン文字列を使用

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
});
```

#### AIゲートウェイプロバイダを使用

```typescript
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  prompt: 'Hello, world!',
});
```

### グローバルに設定

環境変数またはSDKの設定を使用して、アプリケーション全体でデフォルトのモデルとプロバイダを設定できます。

## モデルの切り替え

AIゲートウェイを使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます。

### プロバイダ間の切り替え

```typescript
// Anthropicを使用
const result1 = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
});

// OpenAIに切り替え
const result2 = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Hello, world!',
});
```

### 同じプロバイダ内でのモデル切り替え

```typescript
// Claude Sonnet 4を使用
const result1 = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
});

// Claude Opusに切り替え
const result2 = await generateText({
  model: 'anthropic/claude-3-opus-20240229',
  prompt: 'Hello, world!',
});
```

## プロバイダオプション

AIゲートウェイは、プロバイダの動作をカスタマイズするための追加オプションを提供します。詳細については、[プロバイダオプション](/docs/ai-gateway/provider-options)を参照してください。

## 関連リンク

- [利用可能なモデル](https://vercel.com/ai-gateway/models)
- [プロバイダオプション](/docs/ai-gateway/provider-options)
- [はじめに](/docs/ai-gateway/getting-started)
