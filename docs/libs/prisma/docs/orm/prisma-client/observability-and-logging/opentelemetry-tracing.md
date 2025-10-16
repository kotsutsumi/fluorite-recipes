# OpenTelemetryトレーシング

Prisma Clientは、OpenTelemetryを使用した分散トレーシングをサポートしています。

## トレーシングの有効化

`schema.prisma`でトレーシングフィーチャーフラグを有効化:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["tracing"]
}
```

## OpenTelemetryのセットアップ

```typescript
import { PrismaClient } from '@prisma/client'
import { trace } from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

const provider = new NodeTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter()))
provider.register()

const prisma = new PrismaClient()
```

## トレースの収集

Prismaは自動的にクエリのトレースを収集します。

## ベストプラクティス

- 分散システムでトレーシングを使用
- サンプリングレートを適切に設定
- トレースデータを可視化ツールで分析
