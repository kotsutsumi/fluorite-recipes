# VercelでのAI構築

AIサービスとモデルは、さまざまなユースケースのアプリケーション構築と展開を強化し、自動化するのに役立ちます：

- **チャットボットと仮想アシスタント**: 顧客とのやり取りを改善
- **AIを活用したコンテンツ生成**: デジタルコンテンツを自動化および最適化
- **レコメンデーションシステム**: 個人に最適化されたエクスペリエンスを提供
- **自然言語処理（NLP）**: 高度なテキスト分析と翻訳を可能に
- **検索拡張生成（RAG）**: コンテキストを理解した応答で文書を強化
- **AIを活用した画像およびメディアサービス**: 視覚コンテンツを最適化

## AIプロバイダとの統合

VercelのAIインテグレーションにより、AIを活用したアプリケーションを効率的に構築および展開できます。Vercelマーケットプレイスを通じて、ユースケース例とともに適切なAIサービスを調査できます。

2種類のAIインテグレーションをインストールおよび管理できます：

- **ネイティブインテグレーション**: Vercelとシームレスに連携し、組み込みの課金とアカウントプロビジョニングを含むソリューション
- **接続可能なアカウント**: プロジェクトにリンク可能なサードパーティサービス

## AIインテグレーションの使用

Vercel[ダッシュボード](/dashboard)のAIタブで、インストールされたAIインテグレーションを表示できます。

## 利用可能なAIプロバイダ

Vercelは、以下のような主要なAIプロバイダとの統合をサポートしています：

### 言語モデル

- [OpenAI](/docs/ai/openai) - GPT-4.5、GPT-5、o3-mini、DALL·E 3
- [xAI](/docs/ai/xai) - Grok-2、Grok-2 Vision、Grok-3 Beta
- [Anthropic (via AI Gateway)](/docs/ai-gateway) - Claude Sonnet 4
- [Groq](/docs/ai/groq) - 超高速LLM推論
- [Perplexity](/docs/ai/perplexity) - AI搭載検索

### 画像・動画生成

- [fal](/docs/ai/fal) - リアルタイム画像・動画生成
- [Replicate](/docs/ai/replicate) - オープンソースモデルの実行

### 音声合成

- [ElevenLabs](/docs/ai/elevenlabs) - 高品質音声合成
- [LMNT](/docs/ai/lmnt) - 低遅延音声生成

### インフラストラクチャ

- [Deep Infra](/docs/ai/deepinfra) - スケーラブルMLインフラ
- [Together AI](/docs/ai/togetherai) - 対話型AIエクスペリエンス

### データベースとベクトル検索

- [Pinecone](/docs/ai/pinecone) - ベクトルデータベース

## AIインテグレーションの追加

### ダッシュボードから

1. Vercelダッシュボードの「AI」タブに移動
2. 「AIプロバイダをインストール」をクリック
3. 使用するプロバイダを選択
4. インストール手順に従う

詳細は、[プロバイダの追加ガイド](/docs/ai/adding-a-provider)を参照してください。

## モデルの追加

インテグレーションをインストールした後、特定のモデルをプロジェクトに追加できます。

詳細は、[モデルの追加ガイド](/docs/ai/adding-a-model)を参照してください。

## AI SDK

[AI SDK](https://sdk.vercel.ai) は、Next.js、React、Vue、Svelteなどで AI 対応アプリケーションを構築するための TypeScript ツールキットです。

詳細は、[AI SDK ドキュメント](/docs/ai-sdk)を参照してください。

## AI Gateway

[AI Gateway](https://vercel.com/ai-gateway) は、単一のエンドポイントを通じて数百のモデルにアクセスするための統一 API を提供します。

詳細は、[AI Gateway ドキュメント](/docs/ai-gateway)を参照してください。

## ベストプラクティス

### モデルの選択

- **タスクに適したモデルを選択**: 各モデルには異なる強みがあります
- **コストを考慮**: モデルによって料金が異なります
- **レイテンシ要件**: 一部のモデルは他のモデルよりも高速です

### コスト最適化

- [観測性ダッシュボード](/docs/ai-gateway/observability)を使用して使用状況を監視
- プロンプトを最適化してトークン使用量を削減
- 適切なモデルサイズを選択

### セキュリティ

- APIキーを環境変数に保存
- レート制限を実装
- ユーザー入力を検証

## サンプルプロジェクト

Vercelは、さまざまなAIユースケースのためのテンプレートを提供しています：

- [AI Chatbot](https://vercel.com/templates/next.js/nextjs-ai-chatbot)
- [AI SDK Starter](https://vercel.com/templates/next.js/ai-sdk-starter)
- [Document QA](https://vercel.com/templates/next.js/document-qa)

[すべてのAIテンプレートを表示](https://vercel.com/templates?search=ai)

## サポートとリソース

- [AI SDK ドキュメント](https://sdk.vercel.ai)
- [AI Gateway ドキュメント](/docs/ai-gateway)
- [Vercelコミュニティ](https://vercel.com/community)
- [GitHubディスカッション](https://github.com/vercel/ai/discussions)

## 関連リンク

- [AI SDK](/docs/ai-sdk)
- [AI Gateway](/docs/ai-gateway)
- [プロバイダの追加](/docs/ai/adding-a-provider)
- [モデルの追加](/docs/ai/adding-a-model)
