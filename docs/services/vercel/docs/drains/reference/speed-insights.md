# Speed Insights Drainsリファレンス

## 概要

Speed Insights Drainsは、アプリケーションからパフォーマンスメトリクスとWeb Vitalsを外部エンドポイントに送信して、保存と分析を行います。Drainを作成し、Speed Insightsデータタイプを選択することで有効化できます。

## Speed Insightsスキーマ

スキーマには、パフォーマンスメトリクスを説明する複数のフィールドが含まれます：

| 名前 | タイプ | 説明 | 例 |
|------|------|-------------|---------|
| `schema` | string | スキーマバージョン | `"vercel.speed_insights.v1"` |
| `timestamp` | string | メトリクス収集のISOタイムスタンプ | `"2023-09-14T15:30:00.000Z"` |
| `projectId` | string | Vercelプロジェクト識別子 | `"Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2"` |
| `metricType` | string | パフォーマンスメトリクスタイプ | `"CLS"`, `"LCP"`, `"FID"`, `"INP"`, `"FCP"`, `"TTFB"` |
| `value` | number | メトリクス値 | `0.1`, `1500` |
| `origin` | string | オリジンURL | `"https://example.com"` |
| `path` | string | ページパス | `"/blog/post-1"` |
| `route` | string | 動的ルート | `"/blog/[slug]"` |
| `url` | string | 完全なURL | `"https://example.com/blog/post-1"` |
| `deviceCategory` | string | デバイスタイプ | `"mobile"`, `"desktop"`, `"tablet"` |
| `connection` | string | ネットワークタイプ | `"4g"`, `"wifi"` |
| `country` | string | 国コード | `"US"`, `"JP"` |

## データ形式

### JSON形式

```json
[
  {
    "schema": "vercel.speed_insights.v1",
    "timestamp": "2023-09-14T15:30:00.000Z",
    "projectId": "Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2",
    "metricType": "CLS",
    "value": 0.1,
    "origin": "https://example.com",
    "path": "/blog/post-1",
    "route": "/blog/[slug]",
    "url": "https://example.com/blog/post-1",
    "deviceCategory": "mobile",
    "connection": "4g",
    "country": "US"
  },
  {
    "schema": "vercel.speed_insights.v1",
    "timestamp": "2023-09-14T15:30:05.000Z",
    "projectId": "Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2",
    "metricType": "LCP",
    "value": 1500,
    "origin": "https://example.com",
    "path": "/blog/post-1",
    "route": "/blog/[slug]",
    "deviceCategory": "desktop",
    "connection": "wifi",
    "country": "JP"
  }
]
```

### NDJSON形式

```
{"schema":"vercel.speed_insights.v1","timestamp":"2023-09-14T15:30:00.000Z","projectId":"Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2","metricType":"CLS","value":0.1}
{"schema":"vercel.speed_insights.v1","timestamp":"2023-09-14T15:30:05.000Z","projectId":"Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2","metricType":"LCP","value":1500}
```

## メトリクスタイプ

| メトリクス | 説明 | 典型的な値 | 良好なしきい値 |
|---------|-------------|--------------|--------------|
| **CLS** | Cumulative Layout Shift | 0.0 - 1.0+ | ≤ 0.1 |
| **LCP** | Largest Contentful Paint (ms) | 0 - 10000+ | ≤ 2500 |
| **FID** | First Input Delay (ms) | 0 - 1000+ | ≤ 100 |
| **INP** | Interaction to Next Paint (ms) | 0 - 1000+ | ≤ 200 |
| **FCP** | First Contentful Paint (ms) | 0 - 10000+ | ≤ 1800 |
| **TTFB** | Time to First Byte (ms) | 0 - 5000+ | ≤ 800 |

## サンプリングレート

高トラフィックを処理する際に、データ量を制御するためのサンプリングレートを設定できます。

**設定例**:
- 100%: すべてのメトリクスを送信
- 50%: メトリクスの半分を送信
- 10%: メトリクスの10%を送信

## エンドポイント実装の例

### Node.js / Express

```javascript
const express = require('express');
const app = express();

app.post('/speed-insights', express.json(), async (req, res) => {
  try {
    const metrics = req.body;

    // メトリクスを処理
    for (const metric of metrics) {
      console.log(`${metric.metricType}: ${metric.value}ms (${metric.path})`);

      // データベースに保存
      await saveMetric(metric);

      // パフォーマンスアラートをチェック
      if (shouldAlert(metric)) {
        await sendAlert(metric);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('メトリクス処理エラー:', error);
    res.status(200).json({ success: false });
  }
});

function shouldAlert(metric) {
  const thresholds = {
    LCP: 2500,
    CLS: 0.1,
    INP: 200,
    FCP: 1800,
    TTFB: 800,
  };

  return metric.value > thresholds[metric.metricType];
}

app.listen(3000);
```

### Next.js API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface SpeedInsightMetric {
  schema: string;
  timestamp: string;
  projectId: string;
  metricType: string;
  value: number;
  origin: string;
  path: string;
  route?: string;
  deviceCategory?: string;
  connection?: string;
  country?: string;
}

export async function POST(req: NextRequest) {
  try {
    const metrics: SpeedInsightMetric[] = await req.json();

    // メトリクスを集約
    const aggregated = aggregateMetrics(metrics);

    // ストレージに保存
    await saveToDatabase(aggregated);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Speed Insights処理エラー:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

function aggregateMetrics(metrics: SpeedInsightMetric[]) {
  const byPath: Record<string, any> = {};

  metrics.forEach(metric => {
    if (!byPath[metric.path]) {
      byPath[metric.path] = {};
    }

    if (!byPath[metric.path][metric.metricType]) {
      byPath[metric.path][metric.metricType] = [];
    }

    byPath[metric.path][metric.metricType].push(metric.value);
  });

  return byPath;
}
```

## ベストプラクティス

### データ処理

- メトリクスをパスとタイプ別に集約
- パーセンタイル（P75、P95、P99）を計算
- 時系列データを保存

### アラート設定

- しきい値を超えたメトリクスに対してアラート
- デバイスタイプ別に分析
- 地理的パターンを監視

### パフォーマンス最適化

- 非同期処理を使用
- バッチ挿入を実装
- インデックスを最適化

## トラブルシューティング

### データが受信されない

- Speed Insights Drainが設定されていることを確認
- サンプリングレートを確認
- エンドポイントが到達可能であることを確認

### 不正確なデータ

- タイムスタンプ解析を確認
- 値の単位を確認（ミリ秒 vs 秒）
- サンプリングバイアスを考慮

## 次のステップ

- [Drainsの使用](/docs/drains/using-drains)
- [Speed Insights概要](/docs/speed-insights)
- [メトリクスの理解](/docs/speed-insights/metrics)

## 関連リソース

- [Drains概要](/docs/drains)
- [Speed Insightsドキュメント](/docs/speed-insights)
- [Core Web Vitals](https://web.dev/vitals/)
