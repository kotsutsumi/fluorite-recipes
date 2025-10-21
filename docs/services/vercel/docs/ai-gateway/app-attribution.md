# アプリ アトリビューション

アプリ アトリビューションにより、Vercelは AI Gateway を通じてリクエストを行うアプリケーションを識別できます。提供された場合、アプリは AI Gateway ページで紹介され、認知度を高めることができます。

アプリ アトリビューションはオプションです。これらのヘッダーを送信しない場合でも、リクエストは通常通り機能します。

## 仕組み

AI Gateway は、存在する場合に2つのリクエストヘッダーを読み取ります：

- `http-referer`：リクエストを行うページまたはサイトのURL
- `x-title`：アプリのわかりやすい名前（例：「Acme Chat」）

これらのヘッダーは、サーバーサイドのリクエストで直接設定できます。

## 例

### TypeScript (AI SDK)

```typescript
import { streamText } from 'ai';

const result = streamText({
  headers: {
    'http-referer': 'https://myapp.vercel.app',
    'x-title': 'MyApp',
  },
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
});

for await (const part of result.textStream) {
  process.stdout.write(part);
}
```

### TypeScript (OpenAI)

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
        content: 'Hello, world!',
      },
    ],
  },
  {
    headers: {
      'http-referer': 'https://myapp.vercel.app',
      'x-title': 'MyApp',
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
            'content': 'Hello, world!',
        }
    ],
    extra_headers={
        'http-referer': 'https://myapp.vercel.app',
        'x-title': 'MyApp',
    },
)
```

## ベストプラクティス

### 一貫した命名

アプリケーション全体で一貫した `x-title` を使用します。これにより、AI Gateway ダッシュボードで使用状況を簡単に追跡できます。

### 有効な URL を使用

`http-referer` には、有効で公開アクセス可能な URL を使用します。これにより、ユーザーがあなたのアプリケーションを見つけやすくなります。

### 環境変数の使用

アプリのタイトルと URL を環境変数に保存して、簡単に管理できるようにします：

```typescript
const headers = {
  'http-referer': process.env.APP_URL,
  'x-title': process.env.APP_TITLE,
};
```

## プライバシー

アプリ アトリビューションヘッダーは、アプリケーションレベルの情報のみを提供する必要があります。ユーザー固有の情報や機密情報を含めないでください。

## AI Gateway ページでの紹介

適切なアトリビューションヘッダーを提供し、アプリが一定の使用量基準を満たすと、AI Gateway のモデルページやプロバイダーページで紹介される可能性があります。これにより、より多くのユーザーにアプリが認知されます。

## よくある質問

### アトリビューションヘッダーは必須ですか？

いいえ、アトリビューションヘッダーはオプションです。これらを提供しない場合でも、リクエストは正常に機能します。

### クライアントサイドのリクエストでこれらのヘッダーを使用できますか？

ブラウザのセキュリティ制限により、クライアントサイドのリクエストでは `http-referer` ヘッダーを設定できません。サーバーサイドのリクエストでこれらのヘッダーを使用することをお勧めします。

### アトリビューション情報はどこで確認できますか？

AI Gateway ダッシュボードの観測性セクションで、アプリケーション別の使用状況を確認できます。

## 関連リンク

- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [観測性](/docs/ai-gateway/observability)
- [OpenAI 互換 API](/docs/ai-gateway/openai-compat)
