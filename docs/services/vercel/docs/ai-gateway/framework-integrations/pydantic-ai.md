# Pydantic AI

[Pydantic AI](https://ai.pydantic.dev/) は、AI を使用した本番グレードのアプリケーションを簡単に構築できる Python エージェントフレームワークです。このガイドでは、[Vercel AI Gateway](/docs/ai-gateway) と Pydantic AI を統合して、さまざまな AI モデルとプロバイダにアクセスする方法を説明します。

## はじめに

### 新しいプロジェクトの作成

まず、プロジェクト用の新しいディレクトリを作成し、初期化します：

```bash
mkdir pydantic-ai-gateway
cd pydantic-ai-gateway
```

### 依存関係のインストール

必要な Pydantic AI パッケージと `python-dotenv` パッケージをインストールします：

```bash
pip install pydantic-ai python-dotenv
```

### 環境変数の設定

[Vercel AI Gateway API キー](/docs/ai-gateway#using-the-ai-gateway-with-an-api-key)を使用して `.env` ファイルを作成します：

```env
VERCEL_AI_GATEWAY_API_KEY=your-api-key-here
```

[Vercel デプロイメント内から AI Gateway を使用](/docs/ai-gateway#using-the-ai-gateway-with-a-vercel-oidc-token)する場合は、`VERCEL_OIDC_TOKEN` 環境変数も使用できます。

### Pydantic AI アプリケーションの作成

`main.py` という新しいファイルを作成し、以下のコードを追加します：

```python
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os

load_dotenv()

# AI Gatewayモデルを設定
model = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

# エージェントを作成
agent = Agent(
    model,
    system_prompt='You are a helpful assistant.'
)

# エージェントを実行
result = agent.run_sync('What is the capital of France?')
print(result.data)
```

### アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
python main.py
```

## 構造化出力

Pydantic AI の強みは、構造化された出力を生成することです：

```python
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os

load_dotenv()

# レスポンススキーマを定義
class Recipe(BaseModel):
    name: str
    ingredients: list[str]
    instructions: list[str]
    prep_time_minutes: int

# モデルとエージェントを設定
model = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

agent = Agent(
    model,
    result_type=Recipe,
    system_prompt='You are a chef assistant.'
)

# エージェントを実行
result = agent.run_sync('Give me a recipe for chocolate chip cookies.')
print(result.data)
```

## ツールの使用

Pydantic AI でツールを使用して AI エージェントを構築できます：

```python
from dotenv import load_dotenv
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
import os

load_dotenv()

model = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

agent = Agent(
    model,
    system_prompt='You are a weather assistant.'
)

@agent.tool
async def get_weather(ctx: RunContext, location: str) -> str:
    """指定された場所の天気を取得します。"""
    # 実際の天気APIを呼び出す
    return f"The weather in {location} is sunny and 72°F"

# エージェントを実行
result = agent.run_sync('What is the weather in San Francisco?')
print(result.data)
```

## ストリーミング

Pydantic AI でストリーミングレスポンスを使用するには：

```python
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os

load_dotenv()

model = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

agent = Agent(model)

# ストリーミングレスポンス
async def stream_example():
    async with agent.run_stream('Tell me a long story.') as result:
        async for message in result.stream():
            print(message, end='', flush=True)

# 非同期関数を実行
import asyncio
asyncio.run(stream_example())
```

## 依存性注入

Pydantic AI は依存性注入をサポートしています：

```python
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
import os

load_dotenv()

class UserContext(BaseModel):
    user_id: str
    name: str

model = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

agent = Agent(
    model,
    deps_type=UserContext,
    system_prompt='You are a personalized assistant.'
)

@agent.tool
async def get_user_preferences(ctx: RunContext[UserContext]) -> str:
    """ユーザーの好みを取得します。"""
    return f"User {ctx.deps.name} prefers outdoor activities"

# エージェントを実行
user = UserContext(user_id='123', name='John')
result = agent.run_sync('What do I like?', deps=user)
print(result.data)
```

## モデルの切り替え

AI Gateway を使用すると、コードの変更を最小限に抑えてモデルを切り替えることができます：

```python
# Anthropic Claude を使用
model1 = OpenAIModel(
    'anthropic/claude-sonnet-4',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)

# OpenAI GPT に切り替え
model2 = OpenAIModel(
    'openai/gpt-5',
    base_url='https://ai-gateway.vercel.sh/v1',
    api_key=os.getenv('VERCEL_AI_GATEWAY_API_KEY')
)
```

## エラーハンドリング

適切なエラーハンドリングを実装します：

```python
try:
    result = agent.run_sync('Hello!')
    print(result.data)
except Exception as e:
    print(f"Error: {e}")
    # フォールバックロジックまたはエラー処理
```

## ベストプラクティス

### 型安全性の活用

Pydantic のスキーマを使用して、入力と出力の型安全性を確保します：

```python
class Input(BaseModel):
    query: str
    max_results: int = 10

class Output(BaseModel):
    results: list[str]
    count: int

agent = Agent(
    model,
    result_type=Output,
    system_prompt='You are a search assistant.'
)
```

### 環境変数の使用

API キーをコードに直接埋め込まず、環境変数を使用します。

### 観測性の活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

## 関連リンク

- [Pydantic AI ドキュメント](https://ai.pydantic.dev/)
- [AI Gateway 入門](/docs/ai-gateway/getting-started)
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)
- [利用可能なモデル](https://vercel.com/ai-gateway/models)
