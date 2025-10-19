# NestJS on Vercel

## 概要

NestJSは、効率的で信頼性の高いスケーラブルなサーバーサイドアプリケーションを構築するためのプログレッシブNode.jsフレームワークです。Vercelでは、追加設定なしでデプロイできます。

## Vercelでのメリット

- **Fluid compute**: 使用したCPUに対してのみ課金
- **プレビューデプロイメント**: プルリクエストごとのプレビュー環境
- **インスタントロールバック**: 以前のデプロイメントへの迅速な復帰
- **Vercelファイアウォール**: 多層セキュリティシステム
- **セキュアコンピュート**: 安全な実行環境

## エントリーポイントの検出

Vercelは、以下のいずれかのファイル名を自動的に検出します：

- `src/main.{js,mjs,cjs,ts,cts,mts}`
- `src/app.{js,mjs,cjs,ts,cts,mts}`
- `src/index.{js,mjs,cjs,ts,cts,mts}`
- `src/server.{js,mjs,cjs,ts,cts,mts}`
- `app.{js,mjs,cjs,ts,cts,mts}`
- `index.{js,mjs,cjs,ts,cts,mts}`
- `server.{js,mjs,cjs,ts,cts,mts}`

## アプリケーションのセットアップ

### 基本的なNestJSアプリケーション

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### Vercel向けのエクスポート

Vercelでデプロイする場合、アプリケーションインスタンスをエクスポートする必要があります：

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  return app;
}

export default bootstrap();
```

## ローカル開発

```bash
vercel dev
```

このコマンドで、Vercel環境をローカルで再現し、開発中にアプリケーションをテストできます。

## デプロイ

```bash
vc deploy
```

## Vercelファンクション

NestJSアプリケーションは単一のVercelファンクションとして動作し、以下の特徴があります：

- トラフィックに応じて自動的にスケールアップ/ダウン
- デフォルトでFluid Computeを使用
- アクティブなCPU使用時間のみ課金

## 静的アセット

`public/`ディレクトリ内のファイルは、VercelのCDNで自動的に提供されます：

```
project/
├── public/
│   ├── images/
│   └── assets/
└── src/
    └── main.ts
```

## ベストプラクティス

### 環境変数の使用

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

Vercelダッシュボードまたは`.env.local`ファイルで環境変数を設定できます。

### データベース接続

サーバーレス環境では、接続プーリングに注意が必要です：

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // サーバーレス環境向けの設定
      extra: {
        max: 1, // 接続プールサイズを制限
      },
    }),
  ],
})
export class AppModule {}
```

## 追加リソース

- [NestJS公式ドキュメント](https://nestjs.com/)
- [Vercel Functions](/docs/functions)
- [Fluid Compute](/docs/fluid-compute)
- [Secure Compute](/docs/secure-compute)
