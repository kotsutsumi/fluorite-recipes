# 監視可能性とログ記録

Prisma Clientは、アプリケーションの監視可能性を向上させるためのさまざまな機能を提供しています。

## 監視可能性の機能

- **ログ記録**: クエリの実行とイベントのログ記録
- **メトリクス**: パフォーマンスメトリクスの収集
- **OpenTelemetryトレーシング**: 分散トレーシングのサポート

詳細については、以下を参照してください:

- [ログ記録](/docs/orm/prisma-client/observability-and-logging/logging)
- [メトリクス](/docs/orm/prisma-client/observability-and-logging/metrics)
- [OpenTelemetryトレーシング](/docs/orm/prisma-client/observability-and-logging/opentelemetry-tracing)

## ベストプラクティス

- 本番環境では適切なログレベルを設定
- メトリクスを収集してパフォーマンスを監視
- 分散システムではトレーシングを実装
