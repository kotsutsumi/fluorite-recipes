# Speed Insights クイックスタート

## 前提条件

- Vercelアカウント
- Vercelプロジェクト
- Vercel CLIがインストールされている

## セットアップ手順

### 1. VercelでSpeed Insightsを有効化

1. プロジェクトダッシュボードに移動
2. 「Speed Insights」タブを選択
3. 「Enable」をクリック
4. 新しいルート（`/_vercel/speed-insights/*`にスコープ）が追加されます

### 2. プロジェクトにパッケージを追加

パッケージマネージャーを使用してインストール：

```bash
pnpm i @vercel/speed-insights
```

### 3. SpeedInsightsコンポーネントを追加

Next.js v13.5+の場合、ルートレイアウトに追加：

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### その他のフレームワーク

**React:**
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

**Vue:**
```vue
<template>
  <div>
    <YourApp />
    <SpeedInsights />
  </div>
</template>

<script>
import { SpeedInsights } from '@vercel/speed-insights/vue';

export default {
  components: {
    SpeedInsights,
  },
};
</script>
```

**Svelte:**
```svelte
<script>
  import { SpeedInsights } from '@vercel/speed-insights/svelte';
</script>

<YourApp />
<SpeedInsights />
```

### 4. Vercelにデプロイ

#### CLIの使用：

```bash
vercel deploy
```

#### Gitリポジトリの接続：

- Gitリポジトリを接続して自動デプロイ

### 5. ダッシュボードを表示

1. プロジェクトダッシュボードに移動
2. 「Speed Insights」タブをクリック
3. 訪問者データが入力されるまで待つ

## データ収集の確認

データが収集されていることを確認するには：

1. ブラウザの開発者ツールを開く
2. ネットワークタブを確認
3. `/_vercel/speed-insights/vitals`へのリクエストを探す

## 次のステップ

### パフォーマンスの最適化

- メトリクスを分析
- 改善の機会を特定
- 変更を実装
- 影響を測定

### 高度な設定

- [パッケージドキュメント](/docs/speed-insights/package)を確認
- サンプルレートの設定
- カスタムエンドポイントの使用

### チーム教育

- [メトリクス](/docs/speed-insights/metrics)について学ぶ
- [プライバシーポリシー](/docs/speed-insights/privacy-policy)を確認
- [料金と制限](/docs/speed-insights/limits-and-pricing)を理解

## トラブルシューティング

### データが表示されない

1. Speed Insightsがダッシュボードで有効になっていることを確認
2. `@vercel/speed-insights`パッケージが正しくインストールされていることを確認
3. コンポーネントが適切に配置されていることを確認
4. 最新のデプロイメントを本番に昇格

### スクリプトの読み込みに失敗

1. アドブロッカーが無効になっていることを確認
2. ネットワークタブでエラーを確認
3. デプロイメントが正常に完了したことを確認

## ベストプラクティス

### コンポーネントの配置

- アプリのルートレベルに配置
- すべてのページで一度だけ読み込む
- レイアウトまたはルートコンポーネントで使用

### パフォーマンスへの影響

- 最小限のオーバーヘッド
- 非同期読み込み
- ユーザー体験に影響なし

## 関連リソース

- [Speed Insights概要](/docs/speed-insights)
- [パッケージリファレンス](/docs/speed-insights/package)
- [メトリクスの理解](/docs/speed-insights/metrics)
- [トラブルシューティング](/docs/speed-insights/troubleshooting)

*注意: Speed Insightsはすべての Vercelプランで利用可能*
