# Vercel LMNT統合

[LMNT](https://lmnt.com/)は、精度と効率に優れたデータ処理と予測分析モデルを提供します。VercelとLMNTの統合により、アプリケーションに正確な洞察と予測を提供できます。特に金融やヘルスケア分野で有用です。

## ユースケース

LMNTとVercelの統合を使用して、以下のようなAIアプリケーションを構築できます：

- **高品質な音声合成**: チャットボット、AIエージェント、ゲーム、その他のデジタルメディア向けに、リアルな音声を生成
- **スタジオ品質のカスタム音声**: 実際の音声の感情的な豊かさと本物らしさを忠実に再現する音声クローニング
- **信頼性の高い低遅延、全二重ストリーミング**: 会話型エクスペリエンスのための優れたパフォーマンスを実現

## はじめに

Vercel LMNTインテグレーションは、[Vercelダッシュボード](/dashboard)のAIタブからアクセスできます。

### 前提条件

このガイドに従うには、以下が必要です：

- 既存の[Vercelプロジェクト](/docs/projects/overview#creating-a-project)
- 最新バージョンの[Vercel CLI](/docs/cli#installing-vercel-cli)

```bash
pnpm i -g vercel@latest
```

### プロジェクトにプロバイダーを追加する

#### ダッシュボードを使用する

1. [Vercelダッシュボード](/dashboard)のAIタブに移動
2. 「AIプロバイダをインストール」をクリック
3. LMNTを選択
4. インストール手順に従う

## 使用例

### テキスト読み上げ

```typescript
import { LMNT } from 'lmnt-node';

const client = new LMNT({
  apiKey: process.env.LMNT_API_KEY,
});

const synthesis = await client.speech.synthesize({
  text: 'こんにちは、LMNTへようこそ',
  voice: 'lily',
});

// 音声データを処理
```

### ストリーミング

```typescript
const stream = await client.speech.synthesize({
  text: '長いテキストをストリーミング',
  voice: 'lily',
  streaming: true,
});

for await (const chunk of stream) {
  // リアルタイムで音声を再生
  playAudioChunk(chunk);
}
```

### 音声のカスタマイズ

```typescript
const synthesis = await client.speech.synthesize({
  text: 'カスタマイズされた音声',
  voice: 'lily',
  speed: 1.2,
  format: 'mp3',
});
```

## 料金

LMNTは、生成された音声の長さに基づいて課金されます。

## ベストプラクティス

- 会話型アプリケーションにはストリーミングを使用
- 適切な音声を選択して最良の結果を得る
- キャッシングを活用してコストを削減

## 関連リンク

- [LMNT ドキュメント](https://docs.lmnt.com)
- [AI SDK](https://sdk.vercel.ai)
- [プロバイダーの追加](/docs/ai/adding-a-provider)
