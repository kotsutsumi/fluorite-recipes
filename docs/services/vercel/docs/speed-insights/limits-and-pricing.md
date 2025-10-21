# Speed Insights: 制限と料金

## 利用可能性

Speed Insightsはすべての Vercelプランで利用可能：
- Hobbyプラン
- Proプラン
- Enterpriseプラン

## 料金

### Hobbyプラン

- 無料
- 1つのプロジェクトで有効化
- 限られたデータポイント

### Proプラン

- プロジェクトあたり月額$10の基本料金

### 料金表

| リソース | Hobbyに含まれる | オンデマンド料金 |
|----------|----------------|-----------------|
| Speed Insightsデータポイント | 最初の10,000 | 10,000データポイントあたり$0.65 |

## 制限事項

### データポイント報告期間

| プラン | 報告期間 |
|-------|----------|
| Hobby | 7日 |
| Pro | 30日 |
| Enterprise | 90日 |

### データポイント制限

| プラン | 月間最大データポイント |
|-------|---------------------|
| Hobby | 10,000 |
| Pro | 無制限 |
| Enterprise | 無制限 |

## 重要な注意事項

### データポイント制限に達した場合

- Hobbyプラン: 制限に達すると、翌日まで記録が一時停止
- サンプルレートを調整してデータポイントを削減可能

### データポイントの削減

サンプルレートの調整により：
- 収集されるデータポイントの量を減らす
- コストを管理
- `@vercel/speed-insights`パッケージを使用して設定

## 日割り計算

### Pro/Enterpriseプラン

- 有効化時に即座に課金
- 残りのサイクルの部分請求
- サイクル終了前に無効化可能だが、既存のデータは引き続き表示可能

## サンプルレート

### デフォルトの動作

- デフォルトでは、すべてのデータポイントが使用される
- コスト管理のためにサンプルレートを設定可能

### サンプルレートの設定

```typescript
<SpeedInsights sampleRate={0.5} />
```

この例では、50%のイベントのみが送信されます。

## 使用量の管理

### Proチームの場合

- [Spend Management](/docs/spend-management)を設定してコストを制御
- 使用量しきい値を設定
- 予算制限を適用

### モニタリング

- ダッシュボードで使用量を定期的に確認
- データポイント消費を追跡
- 必要に応じてサンプルレートを調整

## 追加コスト

Speed InsightsおよびWeb Analyticsスクリプトは、以下で追加コストが発生する可能性があります：

- **Data Transfer**: データ転送
- **Edge Requests**: エッジリクエスト

## データポイントとは

**データポイント**の定義：

訪問ごとに最大6つのデータポイント：
- TTFB (Time to First Byte)
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- FID (First Input Delay) - レガシー

## 使用量通知

Vercelは使用量制限に近づくと通知を送信し、チームがSpeed Insights消費を管理するのを支援します。

## コスト最適化戦略

### 1. サンプルレートの調整

```typescript
// 本番環境: 80%のトラフィックを追跡
<SpeedInsights sampleRate={0.8} />

// 開発環境: より低いレート
<SpeedInsights sampleRate={0.1} />
```

### 2. 特定のパスの除外

```typescript
<SpeedInsights
  beforeSend={(data) => {
    if (data.url.includes('/admin')) {
      return null; // 管理ページを除外
    }
    return data;
  }}
/>
```

### 3. 環境別の設定

```typescript
const sampleRate = process.env.NODE_ENV === 'production' ? 1.0 : 0.1;

<SpeedInsights sampleRate={sampleRate} />
```

## プランの比較

| 機能 | Hobby | Pro | Enterprise |
|------|-------|-----|------------|
| プロジェクト数 | 1 | 無制限 | 無制限 |
| データポイント | 10,000 | 無制限* | 無制限* |
| 報告期間 | 7日 | 30日 | 90日 |
| サンプルレート設定 | はい | はい | はい |
| カスタム制限 | いいえ | いいえ | はい |

*従量課金

## Enterpriseプラン

Enterpriseプランではカスタム制限がある場合があります。詳細については、カスタマーサクセスマネージャーにお問い合わせください。

## ベストプラクティス

### コスト管理

- 定期的に使用量を監視
- 適切なサンプルレートを設定
- 不要なページを除外
- 予算制限を設定

### データ品質

- サンプルレートとデータ精度のバランスを取る
- 重要なページには高いサンプルレートを使用
- 定期的に設定を見直し

## 次のステップ

- [パッケージ設定](/docs/speed-insights/package)でサンプルレートを調整
- [Spend Management](/docs/spend-management)を設定
- [使用量を最適化](/docs/manage-and-optimize-observability)

## 関連リソース

- [Speed Insights概要](/docs/speed-insights)
- [料金プラン](/docs/pricing)
- [可観測性の管理と最適化](/docs/manage-and-optimize-observability)
