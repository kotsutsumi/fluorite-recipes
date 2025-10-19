# トレースDrainsリファレンス

## 概要

トレースDrainsは、デプロイメントから分散トレーシングデータを外部エンドポイントに転送して、保存と分析を行います。2つの設定方法があります：

1. **カスタムエンドポイント**: 任意のHTTPエンドポイントにトレースを送信
2. **ネイティブ統合**: Vercel Marketplaceの統合（例：Braintrust）を使用

トレースは、OpenTelemetry Protocol（OTLP）仕様に従ってHTTPS経由で送信されます。

## トレーススキーマ

Vercelは、すべてのトレースに特定のリソース属性を自動的に追加します：

| 名前 | タイプ | 説明 | 例 |
|------|------|-------------|---------|
| `vercel.projectId` | string | Vercelプロジェクトの識別子 | `"Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2"` |
| `vercel.deploymentId` | string | Vercelデプロイメントの識別子 | `"dpl_2YZzo1cJAjijSf1hwDFK5ayu2Pid"` |

## トレース形式

### JSON形式

トレースは、OpenTelemetry仕様に従ってJSONオブジェクトとして送信されます：

```json
{
  "resourceSpans": [{
    "resource": {
      "attributes": [{
        "key": "service.name",
        "value": { "stringValue": "vercel-function" }
      }, {
        "key": "vercel.projectId",
        "value": { "stringValue": "Qmc52npNy86S8VV4Mt8a8dP1LEkRNbgosW3pBCQytkcgf2" }
      }, {
        "key": "vercel.deploymentId",
        "value": { "stringValue": "dpl_2YZzo1cJAjijSf1hwDFK5ayu2Pid" }
      }]
    },
    "scopeSpans": [{
      "scope": { "name": "vercel" },
      "spans": [{
        "traceId": "7bba9f33312b3dbb8b2c2c62bb7abe2d",
        "spanId": "086e83747d0e381e",
        "name": "GET /api/users",
        "kind": "server",
        "startTimeUnixNano": "1694723400000000000",
        "endTimeUnixNano": "1694723400150000000",
        "attributes": [{
          "key": "http.method",
          "value": { "stringValue": "GET" }
        }, {
          "key": "http.url",
          "value": { "stringValue": "/api/users" }
        }],
        "status": { "code": 0 }
      }]
    }]
  }]
}
```

### Protobuf形式

効率的な大量トレースデータ転送のためのバイナリprotobuf形式。

**利点**:
- バイナリ形式で効率的
- 高スループット
- より小さいペイロードサイズ

**使用例**:
- 高トラフィックアプリケーション
- 大量のトレースデータ
- 帯域幅の最適化

## OpenTelemetryスパン構造

### スパンの主要フィールド

| フィールド | タイプ | 説明 |
|---------|------|-------------|
| `traceId` | string | トレースの一意の識別子 |
| `spanId` | string | スパンの一意の識別子 |
| `parentSpanId` | string | 親スパンのID（存在する場合） |
| `name` | string | スパン名（例：`GET /api/users`） |
| `kind` | string | スパンの種類（`server`, `client`, `internal`） |
| `startTimeUnixNano` | string | スパン開始時刻（ナノ秒） |
| `endTimeUnixNano` | string | スパン終了時刻（ナノ秒） |
| `attributes` | array | スパン属性の配列 |
| `status` | object | スパンステータス |

### スパンの種類

| 種類 | 説明 | 使用例 |
|------|-------------|---------|
| `server` | サーバーサイドスパン | APIエンドポイント |
| `client` | クライアントサイドスパン | 外部API呼び出し |
| `internal` | 内部スパン | 内部関数呼び出し |
| `producer` | メッセージプロデューサー | メッセージキュー |
| `consumer` | メッセージコンシューマー | メッセージ処理 |

### スパン属性の例

```json
{
  "attributes": [
    {
      "key": "http.method",
      "value": { "stringValue": "POST" }
    },
    {
      "key": "http.status_code",
      "value": { "intValue": 200 }
    },
    {
      "key": "http.url",
      "value": { "stringValue": "/api/users/123" }
    },
    {
      "key": "db.system",
      "value": { "stringValue": "postgresql" }
    }
  ]
}
```

## エンドポイント実装の例

### Node.js / Express (JSON)

```javascript
const express = require('express');
const app = express();

app.post('/traces', express.json(), async (req, res) => {
  try {
    const { resourceSpans } = req.body;

    // トレースを処理
    for (const resourceSpan of resourceSpans) {
      const resource = resourceSpan.resource;
      const scopeSpans = resourceSpan.scopeSpans;

      for (const scopeSpan of scopeSpans) {
        const spans = scopeSpan.spans;

        for (const span of spans) {
          console.log(`Trace: ${span.traceId}, Span: ${span.name}`);
          // APMシステムに転送
          await forwardToAPM(span);
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('トレース処理エラー:', error);
    res.status(200).json({ success: false });
  }
});

app.listen(3000);
```

### Next.js API Route (Protobuf)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import protobuf from 'protobufjs';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type');

  try {
    if (contentType === 'application/x-protobuf') {
      // Protobufデータを処理
      const buffer = Buffer.from(await req.arrayBuffer());

      // Protobufスキーマを使用してデコード
      const TracesData = await loadProtobufSchema();
      const traces = TracesData.decode(buffer);

      // トレースを処理
      await processTraces(traces);
    } else if (contentType === 'application/json') {
      // JSONデータを処理
      const traces = await req.json();
      await processTraces(traces);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('トレース処理エラー:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
```

## トレースデータの処理

### スパンの抽出

```javascript
function extractSpans(resourceSpans) {
  const allSpans = [];

  resourceSpans.forEach(resourceSpan => {
    const projectId = resourceSpan.resource.attributes.find(
      attr => attr.key === 'vercel.projectId'
    )?.value.stringValue;

    resourceSpan.scopeSpans.forEach(scopeSpan => {
      scopeSpan.spans.forEach(span => {
        allSpans.push({
          projectId,
          traceId: span.traceId,
          spanId: span.spanId,
          name: span.name,
          duration: calculateDuration(span),
          attributes: parseAttributes(span.attributes),
        });
      });
    });
  });

  return allSpans;
}

function calculateDuration(span) {
  const start = BigInt(span.startTimeUnixNano);
  const end = BigInt(span.endTimeUnixNano);
  return Number(end - start) / 1000000; // ミリ秒に変換
}
```

### 属性の解析

```javascript
function parseAttributes(attributes) {
  const parsed = {};

  attributes.forEach(attr => {
    const key = attr.key;
    const value = attr.value;

    if (value.stringValue) {
      parsed[key] = value.stringValue;
    } else if (value.intValue) {
      parsed[key] = value.intValue;
    } else if (value.boolValue !== undefined) {
      parsed[key] = value.boolValue;
    }
  });

  return parsed;
}
```

## ベストプラクティス

### パフォーマンス

- 非同期処理を使用
- バッチ処理を実装
- 効率的なストレージを使用

### データ処理

- トレースIDでスパンをグループ化
- 期間を計算
- 有用な属性を抽出

### エラーハンドリング

- 常に200 OKで応答
- エラーをログに記録
- データ損失を防ぐ

## トレースデータの分析

### 基本的な分析

```javascript
function analyzeTraces(spans) {
  const analysis = {
    totalSpans: spans.length,
    avgDuration: 0,
    errorCount: 0,
    slowestSpans: [],
  };

  let totalDuration = 0;

  spans.forEach(span => {
    totalDuration += span.duration;

    if (span.status?.code !== 0) {
      analysis.errorCount++;
    }
  });

  analysis.avgDuration = totalDuration / spans.length;
  analysis.slowestSpans = spans
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  return analysis;
}
```

## トラブルシューティング

### トレースが受信されない

- エンドポイントが到達可能であることを確認
- Content-Typeヘッダーを確認
- Protobufスキーマが正しいことを確認

### デコードエラー

- Protobufスキーマのバージョンを確認
- バッファのエンコーディングを確認
- エラーメッセージを記録

## 次のステップ

- [Drainsの使用](/docs/drains/using-drains)
- [ログDrainsリファレンス](/docs/drains/reference/logs)
- [OpenTelemetry統合](/docs/otel)

## 関連リソース

- [Drains概要](/docs/drains)
- [OpenTelemetryドキュメント](https://opentelemetry.io/)
- [OTLP仕様](https://opentelemetry.io/docs/reference/specification/protocol/)
