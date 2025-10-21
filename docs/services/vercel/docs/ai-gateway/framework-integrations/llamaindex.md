# LlamaIndex

[LlamaIndex](https://www.llamaindex.ai/) は、LLM を使用してエンタープライズデータに接続された知識アシスタントを簡単に構築できるライブラリです。このガイドでは、[Vercel AI Gateway](/docs/ai-gateway) と LlamaIndex を統合して、さまざまな AI モデルとプロバイダにアクセスする方法を説明します。

## はじめに

### 新しいプロジェクトの作成

まず、プロジェクト用の新しいディレクトリを作成し、初期化します：

```bash
mkdir llamaindex-ai-gateway
cd llamaindex-ai-gateway
```

### 依存関係のインストール

必要な LlamaIndex パッケージと `python-dotenv` パッケージをインストールします：

```bash
pip install llama-index-llms-vercel-ai-gateway llama-index python-dotenv
```

### 環境変数の設定

[Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key)を使用して `.env` ファイルを作成します：

```env
AI_GATEWAY_API_KEY=your-api-key-here
```

Vercel デプロイメント内から AI Gateway を使用する場合は、`VERCEL_OIDC_TOKEN` 環境変数も使用できます。

### LlamaIndex アプリケーションの作成

`main.py` という新しいファイルを作成し、以下のコードを追加します：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core.llms import ChatMessage
import os

load_dotenv()

llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

messages = [
    ChatMessage(role="user", content="What is the capital of France?")
]

response = llm.chat(messages)
print(response.message.content)
```

### アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
python main.py
```

## ストリーミング

LlamaIndex でストリーミングレスポンスを使用するには：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core.llms import ChatMessage
import os

load_dotenv()

llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

messages = [
    ChatMessage(role="user", content="Tell me a long story.")
]

response = llm.stream_chat(messages)

for chunk in response:
    print(chunk.delta, end="")
```

## ドキュメントのインデックス化とクエリ

LlamaIndex の主要な機能は、ドキュメントをインデックス化してクエリすることです：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
import os

load_dotenv()

# LLMを設定
llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

Settings.llm = llm

# ドキュメントを読み込む
documents = SimpleDirectoryReader("data").load_data()

# インデックスを作成
index = VectorStoreIndex.from_documents(documents)

# クエリエンジンを作成
query_engine = index.as_query_engine()

# クエリを実行
response = query_engine.query("What is this document about?")
print(response)
```

## チャットエンジンの使用

LlamaIndex のチャットエンジンを使用して、コンテキストを保持した会話を構築できます：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
import os

load_dotenv()

# LLMを設定
llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

Settings.llm = llm

# ドキュメントを読み込んでインデックス化
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)

# チャットエンジンを作成
chat_engine = index.as_chat_engine()

# 会話
response1 = chat_engine.chat("What is this document about?")
print(response1)

response2 = chat_engine.chat("Can you give me more details?")
print(response2)
```

## エージェントの構築

LlamaIndex でツールを使用して AI エージェントを構築できます：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
import os

load_dotenv()

# LLMを設定
llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

# ツールを定義
def get_weather(location: str) -> str:
    """指定された場所の天気を取得します。"""
    return f"The weather in {location} is sunny and 72°F"

weather_tool = FunctionTool.from_defaults(fn=get_weather)

# エージェントを作成
agent = ReActAgent.from_tools([weather_tool], llm=llm, verbose=True)

# エージェントを実行
response = agent.chat("What is the weather in San Francisco?")
print(response)
```

## モデルの切り替え

AI Gateway を使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます：

```python
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
import os

# Anthropic Claude を使用
llm1 = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

# OpenAI GPT に切り替え
llm2 = VercelAIGateway(
    model="openai/gpt-5",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)
```

## エラーハンドリング

適切なエラーハンドリングを実装します：

```python
from dotenv import load_dotenv
from llama_index.llms.vercel_ai_gateway import VercelAIGateway
from llama_index.core.llms import ChatMessage
import os

load_dotenv()

llm = VercelAIGateway(
    model="anthropic/claude-sonnet-4",
    api_key=os.getenv("AI_GATEWAY_API_KEY")
)

try:
    messages = [
        ChatMessage(role="user", content="Hello!")
    ]
    response = llm.chat(messages)
    print(response.message.content)
except Exception as e:
    print(f"Error: {e}")
    # フォールバックロジックまたはエラー処理
```

## ベストプラクティス

### 環境変数の使用

API キーをコードに直接埋め込まず、環境変数を使用します。

### インデックスのキャッシング

大規模なドキュメントセットの場合、インデックスをキャッシュしてパフォーマンスを向上させます：

```python
from llama_index.core import StorageContext, load_index_from_storage

# インデックスを保存
index.storage_context.persist()

# インデックスを読み込む
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
```

### 観測性の活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

## 関連リンク

- [LlamaIndex ドキュメント](https://docs.llamaindex.ai/)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
