# はじめに

このクイックスタートでは、Vercelの[AI Gateway](https://vercel.com/ai-gateway)を使用してAIモデルリクエストを行う方法を説明します。このガイドでは[AI SDK](https://ai-sdk.dev)を使用しますが、[OpenAI SDK](/docs/ai-gateway/openai-compat)や他の[コミュニティフレームワーク](/docs/ai-gateway/framework-integrations)と統合することもできます。

## アプリケーションのセットアップ

`mkdir`コマンドを使用して新しいディレクトリを作成します。新しいディレクトリに移動し、`pnpm init`コマンドを実行して`package.json`を作成します。

```bash
mkdir demo
cd demo
pnpm init
```

## 依存関係のインストール

AI SDKパッケージと必要な依存関係をインストールします。

```bash
pnpm i ai dotenv @types/node tsx typescript
```

- `dotenv`: 環境変数（AI Gateway APIキー）にアクセスするため
- `tsx`: TypeScriptコードを実行するためのランナー
- `typescript`: TypeScriptコンパイラ
- `@types/node`: Node.js APIのTypeScript定義

## APIキーの設定

APIキーを作成するには、ダッシュボードの[AI Gateway](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway)タブに移動します：

1. 左側のサイドバーで「APIキー」を選択
2. 「キーを作成」を選択し、ダイアログで「キーを作成」を選択

APIキーを取得したら、`.env.local`ファイルを作成し、以下のようにAPIキーを追加します：

```env
AI_GATEWAY_API_KEY=your-api-key-here
```

## 最初のAIリクエストの作成

プロジェクトのルートに`index.ts`ファイルを作成し、以下のコードを追加します：

```typescript
import 'dotenv/config';
import { generateText } from 'ai';

async function main() {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'Hello, world!',
  });

  console.log(result.text);
}

main();
```

このコードは、AI Gatewayを通じてAnthropicのClaude Sonnet 4モデルを使用してテキストを生成します。

## アプリケーションの実行

以下のコマンドでアプリケーションを実行します：

```bash
npx tsx index.ts
```

成功すると、モデルからの応答がコンソールに表示されます。

## 次のステップ

- [モデルとプロバイダ](/docs/ai-gateway/models-and-providers)について詳しく学ぶ
- [観測性機能](/docs/ai-gateway/observability)を調査する
- [OpenAI互換API](/docs/ai-gateway/openai-compat)を試す
- [フレームワーク統合](/docs/ai-gateway/framework-integrations)を探索する
