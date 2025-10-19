# Vercelの可観測性の管理と最適化

## 概要

可観測性セクションは、Web Analytics、Monitoring、Speed Insightsの使用量メトリクスをカバーします。

## 料金と使用量メトリクス

### 管理インフラストラクチャメトリクス

| メトリクス | 説明 | 課金対象 | 最適化可能性 |
|--------|-------------|--------|--------------|
| **Web Analyticsイベント** | ページビューとカスタムイベントの数 | はい | 削減可能 |
| **Speed Insightsデータポイント** | ブラウザパフォーマンス測定 | はい | 削減可能 |
| **Observability Plusイベント** | サイトリクエストに基づくイベント | はい | 限定的 |
| **Monitoringイベント** | Webサイトリクエスト追跡 | はい | 限定的 |

## プラン使用量制限

### HobbyおよびProリソース制限

| リソース | Hobbyに含まれる | オンデマンド料金 |
|----------|----------------|-----------------|
| Web Analyticsイベント | 最初の50,000イベント | イベントあたり$0.00003 |
| Speed Insightsデータポイント | 最初の10,000 | 10,000あたり$0.65 |
| Observability Plusイベント | なし | 100万あたり$1.20 |

## 最適化戦略

### Web Analyticsイベント

**使用量の追跡**:
- プロジェクト間の総イベント数を追跡
- カスタムイベント量を削減
- `beforeSend()`を使用して無関係なイベントをフィルタリング

**最適化の例**:

```typescript
<Analytics
  beforeSend={(event) => {
    // 管理ページを除外
    if (event.url.includes('/admin')) {
      return null;
    }

    // 開発環境を除外
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    return event;
  }}
/>
```

**高ボリュームイベントの特定**:
1. Analyticsダッシュボードに移動
2. Eventsパネルを分析
3. 高頻度イベントを特定
4. 必要性を評価

### Speed Insightsデータポイント

**最適化方法**:

#### 1. サンプルレートの調整

```typescript
// 本番環境: 80%のトラフィックを追跡
<SpeedInsights sampleRate={0.8} />

// 開発環境: より低いレート
<SpeedInsights sampleRate={0.1} />
```

#### 2. `@vercel/speed-insights`パッケージの使用

プロジェクトレベルでサンプルレートを設定

#### 3. コスト制限の設定

チーム請求設定でコスト制限を設定

#### 4. 非重要プロジェクトで無効化

トラフィックの少ないプロジェクトまたはテストプロジェクトでSpeed Insightsを無効化

#### 5. `beforeSend()`の使用

データポイントをフィルタリング：

```typescript
<SpeedInsights
  beforeSend={(data) => {
    // 特定のパスを除外
    if (data.url.includes('/internal')) {
      return null;
    }
    return data;
  }}
/>
```

### MonitoringとObservabilityイベント

**最適化の制限**:
- リクエストベースの追跡のため、最適化の可能性は限定的
- プロジェクト別および総数でイベントを監視

**監視項目**:
- プロジェクト別イベント数
- チーム全体の総イベント数
- 時間経過に伴う傾向

### Drains使用量の最適化

**最適化戦略**:

#### 1. 環境別のログフィルタリング

本番環境のみにDrainsを設定：

```typescript
// Drain設定で環境フィルタを使用
Environment: Production only
```

#### 2. サンプリングレートの使用

すべてのログを送信する代わりにサンプリング：

```
Sampling Rate: 50% (ログの半分を送信)
```

#### 3. ログボリュームの削減

- 冗長なログステートメントを削除
- ログレベルを適切に使用（info、warning、error）
- 不要なデバッグログを削除

## コスト監視

### 使用量ダッシュボード

1. チーム設定に移動
2. Usage タブを選択
3. 可観測性メトリクスを確認

### 請求アラートの設定

1. Team Settings > Billing に移動
2. Spend Managementを設定
3. しきい値アラートを設定

## ベストプラクティス

### 定期的な監視

- 月次使用量レビューをスケジュール
- 傾向を特定
- 異常を調査

### 段階的な最適化

1. 現在の使用量を測定
2. 高コスト領域を特定
3. 最適化を実装
4. 影響を監視
5. 必要に応じて調整

### プロジェクト別の戦略

- **高トラフィックプロジェクト**: 積極的なフィルタリングとサンプリング
- **中トラフィックプロジェクト**: 適度な最適化
- **低トラフィックプロジェクト**: 最小限の最適化または無効化

## コスト計算の例

### Web Analytics

```
月間ページビュー: 1,000,000
カスタムイベント: 100,000
総イベント: 1,100,000

Hobbyに含まれる: 50,000
課金対象: 1,050,000

コスト: 1,050,000 × $0.00003 = $31.50/月
```

### Speed Insights

```
月間訪問者: 100,000
訪問あたりデータポイント: 4
総データポイント: 400,000

Hobbyに含まれる: 10,000
課金対象: 390,000

コスト: (390,000 / 10,000) × $0.65 = $25.35/月
```

## 追加の考慮事項

### スクリプトコスト

Web AnalyticsおよびSpeed Insightsスクリプトは、以下で追加コストが発生する可能性があります：

- **Data Transfer**: データ転送
- **Edge Requests**: エッジリクエスト

これらのコストは通常最小限ですが、非常に高いトラフィック量では顕著になる可能性があります。

### Monitoringのサンセット

**重要**: Proプラン向けのMonitoringは現在Observability Plusの一部であり、100万イベントあたり$1.20で課金されます。

## トラブルシューティング

### 予期しない高使用量

1. 使用量ダッシュボードを確認
2. プロジェクト別の内訳を分析
3. 最近の変更を確認
4. フィルタリングとサンプリングを実装

### 最適化が機能しない

1. 設定変更を確認
2. デプロイメントを確認
3. 使用量の傾向を監視
4. サポートに連絡（必要に応じて）

## 次のステップ

- [Spend Management](/docs/spend-management)を設定
- [Web Analytics](/docs/analytics)を最適化
- [Speed Insights](/docs/speed-insights)を最適化
- [Observability Plus](/docs/observability/observability-plus)を確認

## 関連リソース

- [料金プラン](/docs/pricing)
- [Web Analytics制限](/docs/analytics/limits-and-pricing)
- [Speed Insights制限](/docs/speed-insights/limits-and-pricing)
- [Drains](/docs/drains)
