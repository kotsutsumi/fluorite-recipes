# Web Analytics Drainsリファレンス

## 概要

Web Analytics Drainsは、トラッキングイベント時にアプリケーションからページビューとカスタムイベントを外部エンドポイントにHTTPS経由で送信します。

## Web Analyticsスキーマ

スキーマには、アナリティクスイベントを説明する複数のフィールドが含まれます：

| フィールド | タイプ | 説明 | 例 |
|-------|------|-------------|---------|
| `schema` | string | スキーマバージョン | `"vercel.analytics.v1"` |
| `eventType` | string | イベントのタイプ | `"pageview"`, `"event"` |
| `eventName` | string | カスタムイベントの名前 | `"button_click"`, `"form_submit"` |
| `timestamp` | number | Unixタイムスタンプ（ミリ秒） | `1694723400000` |
| `projectId` | string | Vercelプロジェクト識別子 | `"Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2"` |
| `origin` | string | オリジンURL | `"https://example.com"` |
| `path` | string | URLパス | `"/dashboard"` |
| `route` | string | 動的ルート | `"/dashboard/[id]"` |
| `referrer` | string | リファラURL | `"https://google.com"` |
| `userAgent` | string | ユーザーエージェント文字列 | `"Mozilla/5.0..."` |
| `country` | string | 国コード | `"US"`, `"JP"` |

## データ形式

### JSON形式

イベントはJSON配列として送信されます：

```json
[
  {
    "schema": "vercel.analytics.v1",
    "eventType": "pageview",
    "timestamp": 1694723400000,
    "projectId": "Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2",
    "origin": "https://example.com",
    "path": "/dashboard",
    "route": "/dashboard",
    "referrer": "https://google.com",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "country": "US"
  },
  {
    "schema": "vercel.analytics.v1",
    "eventType": "event",
    "eventName": "button_click",
    "timestamp": 1694723405000,
    "projectId": "Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2",
    "origin": "https://example.com",
    "path": "/dashboard",
    "route": "/dashboard",
    "country": "US"
  }
]
```

### NDJSON形式

イベントは改行区切りのJSONオブジェクトとして送信されます：

```
{"schema":"vercel.analytics.v1","eventType":"pageview","timestamp":1694723400000,"projectId":"...","path":"/dashboard"}
{"schema":"vercel.analytics.v1","eventType":"event","eventName":"button_click","timestamp":1694723405000,"projectId":"..."}
```

## イベントタイプ

### Pageview イベント

ページビューが発生したときに送信されます：

```json
{
  "schema": "vercel.analytics.v1",
  "eventType": "pageview",
  "timestamp": 1694723400000,
  "projectId": "prj_123",
  "origin": "https://example.com",
  "path": "/products",
  "route": "/products",
  "referrer": "https://search.engine.com",
  "country": "JP"
}
```

### Custom イベント

カスタムイベントが追跡されたときに送信されます：

```json
{
  "schema": "vercel.analytics.v1",
  "eventType": "event",
  "eventName": "purchase_completed",
  "timestamp": 1694723410000,
  "projectId": "prj_123",
  "origin": "https://example.com",
  "path": "/checkout/success",
  "country": "JP"
}
```

## サンプリングレート

高トラフィックアプリケーション向けに、データ量を管理するためのサンプリングレートを設定できます。

## エンドポイント実装の例

### Node.js / Express

```javascript
const express = require('express');
const app = express();

app.post('/analytics', express.json(), async (req, res) => {
  try {
    const events = req.body;

    for (const event of events) {
      if (event.eventType === 'pageview') {
        await trackPageView(event);
      } else if (event.eventType === 'event') {
        await trackCustomEvent(event);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics処理エラー:', error);
    res.status(200).json({ success: false });
  }
});

async function trackPageView(event) {
  console.log(`ページビュー: ${event.path} from ${event.country}`);
  // データベースに保存
}

async function trackCustomEvent(event) {
  console.log(`カスタムイベント: ${event.eventName} on ${event.path}`);
  // データベースに保存
}

app.listen(3000);
```

### Next.js API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  schema: string;
  eventType: 'pageview' | 'event';
  eventName?: string;
  timestamp: number;
  projectId: string;
  origin: string;
  path: string;
  route?: string;
  referrer?: string;
  country?: string;
}

export async function POST(req: NextRequest) {
  try {
    const events: AnalyticsEvent[] = await req.json();

    // イベントを処理
    const stats = await processEvents(events);

    // データベースに保存
    await saveAnalytics(stats);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics処理エラー:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

async function processEvents(events: AnalyticsEvent[]) {
  const stats = {
    pageviews: 0,
    customEvents: 0,
    byPath: {} as Record<string, number>,
    byCountry: {} as Record<string, number>,
  };

  events.forEach(event => {
    if (event.eventType === 'pageview') {
      stats.pageviews++;
      stats.byPath[event.path] = (stats.byPath[event.path] || 0) + 1;
    } else {
      stats.customEvents++;
    }

    if (event.country) {
      stats.byCountry[event.country] = (stats.byCountry[event.country] || 0) + 1;
    }
  });

  return stats;
}
```

## ベストプラクティス

### データ集約

- パスとイベント名別にグループ化
- 時系列データを保存
- ユニーク訪問者を追跡（プライバシーに配慮）

### パフォーマンス

- バッチ処理を使用
- 非同期書き込み
- インデックスを最適化

### プライバシー

- 機密データをフィルタリング
- GDPRとCCPAに準拠
- ユーザーの匿名性を維持

## ダッシュボードの構築

### 基本的なメトリクス

```javascript
async function getDashboardMetrics(projectId, timeRange) {
  const metrics = {
    totalPageviews: await countPageviews(projectId, timeRange),
    uniqueVisitors: await countUniqueVisitors(projectId, timeRange),
    topPages: await getTopPages(projectId, timeRange, 10),
    topReferrers: await getTopReferrers(projectId, timeRange, 10),
    byCountry: await getCountryDistribution(projectId, timeRange),
  };

  return metrics;
}
```

## トラブルシューティング

### イベントが受信されない

- Analytics Drainが設定されていることを確認
- サンプリングレートを確認
- エンドポイントが200 OKで応答することを確認

### 重複イベント

- タイムスタンプベースの重複排除を実装
- イベントIDを使用（利用可能な場合）

## 次のステップ

- [Drainsの使用](/docs/drains/using-drains)
- [Web Analytics概要](/docs/analytics)
- [カスタムイベント](/docs/analytics/custom-events)

## 関連リソース

- [Drains概要](/docs/drains)
- [Web Analyticsドキュメント](/docs/analytics)
- [プライバシーポリシー](/docs/analytics/privacy-policy)
