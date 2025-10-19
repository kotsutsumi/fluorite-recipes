# フレームワーク統合

Vercel [AI Gateway](/docs/ai-gateway) は、人気のコミュニティ AI フレームワークとツールと統合し、[コスト追跡](/docs/ai-gateway/observability)や[統一 API アクセス](/docs/ai-gateway/models-and-providers)などのゲートウェイ機能を活用しながら、強力な AI アプリケーションを構築することを可能にします。

## 統合の概要

AI Gateway は、以下のいくつかの方法で人気のフレームワークと統合できます：

- **OpenAI 互換レイヤー**: AI Gateway の [OpenAI 互換エンドポイント](/docs/ai-gateway/openai-compat)を使用
- **ネイティブサポート**: プラグインまたは公式サポートを通じた直接統合
- **AI SDK 統合**: [AI SDK](/docs/ai-sdk) を活用して [AI Gateway](/docs/ai-gateway) の機能に直接アクセス

## サポートされているフレームワーク

以下のリストは、現在 AI Gateway 統合をサポートしているフレームワークの非網羅的なリストです：

- [LangChain](/docs/ai-gateway/framework-integrations/langchain)
- [LangFuse](/docs/ai-gateway/framework-integrations/langfuse)
- [LiteLLM](/docs/ai-gateway/framework-integrations/litellm)
- [LlamaIndex](/docs/ai-gateway/framework-integrations/llamaindex)
- [Mastra](/docs/ai-gateway/framework-integrations/mastra)
- [Pydantic AI](/docs/ai-gateway/framework-integrations/pydantic-ai)

## 統合方法の選択

### OpenAI 互換レイヤーを使用する場合

以下の場合に適しています：

- 既存の OpenAI SDK コードがある
- 最小限のコード変更で統合したい
- フレームワークが OpenAI 互換エンドポイントをサポートしている

### ネイティブサポートを使用する場合

以下の場合に適しています：

- フレームワークが AI Gateway のネイティブ統合を提供している
- フレームワーク固有の機能を最大限に活用したい
- 最適なパフォーマンスと機能セットが必要

### AI SDK 統合を使用する場合

以下の場合に適しています：

- TypeScript/JavaScript プロジェクトを使用している
- 統一された開発者エクスペリエンスが必要
- AI SDK の高度な機能（ストリーミング、ツール呼び出しなど）を活用したい

## 各フレームワークの詳細

各フレームワークの詳細な統合ガイドについては、以下のページを参照してください：

### LangChain

LangChain は、エージェント開発ライフサイクルの各ステップのためのツールを提供します。

[LangChain 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/langchain)

### LangFuse

LangFuse は、チームが AI アプリケーションを共同で開発、監視、評価、デバッグするのを支援する LLM エンジニアリングプラットフォームです。

[LangFuse 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/langfuse)

### LiteLLM

LiteLLM は、LLM（大規模言語モデル）を呼び出すための統一インターフェースを提供するオープンソースライブラリです。

[LiteLLM 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/litellm)

### LlamaIndex

LlamaIndex は、LLM を使用してエンタープライズデータに接続された知識アシスタントを簡単に構築できるライブラリです。

[LlamaIndex 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/llamaindex)

### Mastra

Mastra は、Vercel AI SDK を活用した最新の JavaScript スタックで AI 機能を構築およびデプロイするためのフレームワークです。

[Mastra 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/mastra)

### Pydantic AI

Pydantic AI は、AI を使用した本番グレードのアプリケーションを簡単に構築できる Python エージェントフレームワークです。

[Pydantic AI 統合ガイドを見る →](/docs/ai-gateway/framework-integrations/pydantic-ai)

## 共通の統合パターン

### 認証

すべてのフレームワーク統合では、AI Gateway API キーまたは Vercel OIDC トークンを使用して認証する必要があります。

```env
AI_GATEWAY_API_KEY=your-api-key-here
```

または、Vercel デプロイメント内で：

```env
VERCEL_OIDC_TOKEN=auto-generated-by-vercel
```

### ベースURL設定

OpenAI 互換レイヤーを使用する場合、ベース URL を AI Gateway エンドポイントに設定します：

```
https://ai-gateway.vercel.sh/v1
```

### エラーハンドリング

すべての統合で、適切なエラーハンドリングを実装することをお勧めします：

```typescript
try {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'Hello, world!',
  });
} catch (error) {
  console.error('AI Gateway error:', error);
  // フォールバックロジックまたはエラー処理
}
```

## ベストプラクティス

### 1. 環境変数を使用

API キーや設定をコードに直接埋め込まず、環境変数を使用します。

### 2. エラーハンドリングを実装

AI Gateway リクエストが失敗する可能性があるため、適切なエラーハンドリングを実装します。

### 3. 観測性を活用

AI Gateway の[観測性機能](/docs/ai-gateway/observability)を使用して、使用状況、コスト、パフォーマンスを監視します。

### 4. プロバイダオプションを使用

[プロバイダオプション](/docs/ai-gateway/provider-options)を使用して、フォールバック戦略やコスト最適化を実装します。

### 5. テストを実施

本番環境にデプロイする前に、統合を徹底的にテストします。

## トラブルシューティング

### 認証エラー

- API キーが正しく設定されているか確認
- 環境変数名が正しいか確認
- API キーが有効で、削除されていないか確認

### 接続エラー

- ベース URL が正しいか確認
- ネットワーク接続を確認
- ファイアウォールやプロキシ設定を確認

### モデルが見つからない

- モデル名が正しいフォーマットか確認（例：`anthropic/claude-sonnet-4`）
- モデルが AI Gateway でサポートされているか確認
- [利用可能なモデル](https://vercel.com/ai-gateway/models)を確認

## サポートが必要ですか？

フレームワーク統合に関するサポートが必要な場合は、以下のリソースを参照してください：

- [AI Gateway ドキュメント](/docs/ai-gateway)
- [コミュニティフォーラム](https://github.com/vercel/ai/discussions)
- [サポートチーム](https://vercel.com/support)

## 関連リンク

- [はじめに](/docs/ai-gateway/getting-started)
- [認証](/docs/ai-gateway/authentication)
- [OpenAI 互換 API](/docs/ai-gateway/openai-compat)
- [モデルとプロバイダ](/docs/ai-gateway/models-and-providers)
