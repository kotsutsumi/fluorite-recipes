# LiteLLM

[LiteLLM](https://www.litellm.ai/) は、LLM（大規模言語モデル）を呼び出すための統一インターフェースを提供するオープンソースライブラリです。このガイドでは、[Vercel AI Gateway](/docs/ai-gateway) と LiteLLM を統合して、さまざまな AI モデルとプロバイダにアクセスする方法を説明します。

## はじめに

### 新しいプロジェクトの作成

まず、プロジェクト用の新しいディレクトリを作成します：

```bash
mkdir litellm-ai-gateway
cd litellm-ai-gateway
```

### 依存関係のインストール

必要な LiteLLM Python パッケージをインストールします：

```bash
pip install litellm python-dotenv
```

### 環境変数の設定

[Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key)を含む `.env` ファイルを作成します：

```env
VERCEL_AI_GATEWAY_API_KEY=your-api-key-here
```

[Vercel デプロイメント内の AI Gateway](/docs/ai-gateway#using-the-ai-gateway-with-a-vercel-oidc-token) を使用する場合は、`VERCEL_OIDC_TOKEN` 環境変数も使用できます。

### LiteLLM アプリケーションの作成

`main.py` という新しいファイルを以下のコードで作成します：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

# メッセージを送信
response = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "What is the capital of France?"}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"]
)

print(response.choices[0].message.content)
```

### アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
python main.py
```

## ストリーミング

LiteLLM でストリーミングレスポンスを使用するには：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

response = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "Tell me a long story."}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## 複数のモデルの使用

LiteLLM を使用すると、異なるモデルを簡単に切り替えることができます：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

# Anthropic Claude を使用
response1 = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"]
)

# OpenAI GPT に切り替え
response2 = litellm.completion(
    model="vercel_ai/openai/gpt-5",
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"]
)

print("Claude:", response1.choices[0].message.content)
print("GPT:", response2.choices[0].message.content)
```

## ツールコール

LiteLLM でツールコールを使用するには：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The location to get weather for"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

response = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "What is the weather in San Francisco?"}],
    tools=tools,
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"]
)

print(response.choices[0].message.tool_calls)
```

## エラーハンドリング

適切なエラーハンドリングを実装します：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

try:
    response = litellm.completion(
        model="vercel_ai/anthropic/claude-sonnet-4",
        messages=[{"role": "user", "content": "Hello!"}],
        api_base="https://ai-gateway.vercel.sh/v1",
        api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"]
    )
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
    # フォールバックロジックまたはエラー処理
```

## プロバイダオプション

AI Gateway の[プロバイダオプション](/docs/ai-gateway/provider-options)を使用するには、カスタムヘッダーを追加します：

```python
import os
import litellm
from dotenv import load_dotenv

load_dotenv()

os.environ["VERCEL_AI_GATEWAY_API_KEY"] = os.getenv("VERCEL_AI_GATEWAY_API_KEY")

response = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"],
    extra_headers={
        "x-gateway-order": "bedrock,anthropic"
    }
)

print(response.choices[0].message.content)
```

## ベストプラクティス

### 環境変数の使用

API キーをコードに直接埋め込まず、環境変数を使用します。

### リトライロジック

LiteLLM の組み込みリトライ機能を使用します：

```python
response = litellm.completion(
    model="vercel_ai/anthropic/claude-sonnet-4",
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://ai-gateway.vercel.sh/v1",
    api_key=os.environ["VERCEL_AI_GATEWAY_API_KEY"],
    num_retries=3
)
```

### 観測性の活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

## 関連リンク

- [LiteLLM ドキュメント](https://docs.litellm.ai/)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
