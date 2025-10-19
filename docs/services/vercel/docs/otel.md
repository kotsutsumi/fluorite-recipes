# Vercel OpenTelemetryクイックスタート

## 概要

Vercelの OpenTelemetry (OTel) コレクターはすべてのプランで利用可能で、Vercel Functionsからアプリケーションパフォーマンスモニタリング（APM）ベンダーにトレースを送信できます。

## サポートされているOTel統合

- DataDog（ベータ版、Pro/Enterpriseプラン）
- New Relic（ベータ版、Pro/Enterpriseプラン）
- Dash0（ベータ版、Pro/Enterpriseプラン）

## 開始方法

### 1. OTel統合をインストール

- Vercel Marketplaceから可観測性統合を選択
- 「Add Integration」をクリックしてインストール手順に従う

### 2. トレースを有効化

- 統合設定でトレースを構成

### 3. OpenTelemetryを初期化

#### `@vercel/otel` の使用

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'your-project-name' });
}
```

#### OpenTelemetry SDKの使用

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

export async function register() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'your-project-name',
    }),
    spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
  });

  await sdk.start();
}
```

### 4. リクエストのトレースを開始

#### Next.js 13.4+の場合

`next.config.js`に`experimental.instrumentationHook = true`を追加することで、自動インストルメンテーションが利用可能です。

#### その他のフレームワークの場合

手動でスパンを作成：

```typescript
import { trace, context } from '@opentelemetry/api';

export default async function handler(req, res) {
  const tracer = trace.getTracer('my-service');
  const span = tracer.startSpan('my-operation');

  try {
    // 処理ロジック
    span.setAttributes({
      'http.method': req.method,
      'http.url': req.url,
    });

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    span.end();
  }
}
```

## トレースデータの構造

### スパンの属性

OpenTelemetryスパンには以下の情報が含まれます：

- **名前**: 操作の名前
- **開始時刻**: 操作開始のタイムスタンプ
- **終了時刻**: 操作終了のタイムスタンプ
- **属性**: カスタムメタデータ
- **イベント**: スパン内の重要なポイント
- **ステータス**: 操作の結果

### カスタム属性の追加

```typescript
span.setAttributes({
  'user.id': userId,
  'transaction.amount': amount,
  'custom.metadata': metadata,
});
```

## ベストプラクティス

### スパンの命名

- 明確で説明的な名前を使用
- 一貫した命名規則に従う
- 操作の種類を含める

### 属性の使用

- 関連するコンテキストを含める
- 機密情報を避ける
- 標準的なセマンティック規約を使用

### エラー処理

```typescript
try {
  // 処理
} catch (error) {
  span.recordException(error);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error.message,
  });
  throw error;
} finally {
  span.end();
}
```

## トラブルシューティング

### トレースが表示されない

- 統合が正しく設定されていることを確認
- `register()`関数が呼び出されていることを確認
- APMベンダーの設定を確認

### パフォーマンスへの影響

- サンプリングレートを調整
- 不要なスパンを削除
- バッチ処理を使用

## 次のステップ

- [セッショントレーシング](/docs/session-tracing)を探索
- [可観測性](/docs/observability)を設定
- APMダッシュボードでデータを分析

## 関連リソース

- [OpenTelemetry公式ドキュメント](https://opentelemetry.io/)
- [Vercelの可観測性](/docs/observability)
- [ランタイムログ](/docs/logs/runtime)
