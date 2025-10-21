# Vercel Functions

## 概要

Vercel Functionsを使用すると、サーバーを管理することなくサーバーサイドのコードを実行できます。自動スケーリングを提供し、APIやデータベース接続を処理し、[fluid compute](/docs/fluid-compute)による強化された同時実行性を提供します。

## はじめに

Next.js(App Router)での関数の例:

```typescript
export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}
```

## Functionsのライフサイクル

- Functionsはデフォルトで単一リージョンで実行
- 受信リクエストに基づいて自動的にスケール
- 複数のリージョンで実行するように設定可能
- リクエストがない場合はゼロにスケールダウン

### Functionsとデータソース

- レイテンシを削減するため、データソースに近い場所で関数を実行
- デフォルトのNode.jsランタイムはワシントンD.C.、USA(`iad1`)で実行
- リージョンはプロジェクト設定で設定可能

## 関数のメトリクスを表示

1. プロジェクトダッシュボードに移動
2. Observabilityタブをクリック
3. Vercel Functionsセクションを選択
4. 以下のようなメトリクスを表示:
   - 消費されたGB-Hoursの合計
   - 最適化された同時実行性によるコスト削減

## 料金

料金は以下に基づいて計算されます:

- アクティブCPU
- プロビジョニングされたメモリ
- 呼び出し回数

## 関連リソース

- [Fluid Compute](/docs/fluid-compute)
- [ランタイム](/docs/functions/runtimes)
- [関数の設定](/docs/functions/configuring-functions)
- [ストリーミング関数](/docs/functions/streaming-functions)
- [関数の制限](/docs/functions/limitations)
- [関数のログ](/docs/functions/logs)
