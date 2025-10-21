# ログDrainsリファレンス

## 概要

ログDrainsは、Vercelデプロイメントからのログを外部エンドポイントに転送して、保存と分析を行います。2つの設定方法があります：

1. **カスタムエンドポイント**: 任意のHTTPエンドポイントにログを送信
2. **ネイティブ統合**: Vercel Marketplaceの統合（例：Dash0）を使用

## ログスキーマ

ログスキーマには、さまざまなタイプと要件を持つ複数のフィールドが含まれます：

### 主要フィールド

| フィールド | タイプ | 必須 | 説明 | 例 |
|---------|------|------|-------------|---------|
| `id` | string | はい | 一意のログエントリ識別子 | `"1573817187330377061717300000"` |
| `deploymentId` | string | はい | Vercelデプロイメント識別子 | `"dpl_233NRGRjVZX1caZrXWtz5g1TAksD"` |
| `source` | string | はい | ログの発生元 | `"build"`, `"edge"`, `"lambda"` |
| `host` | string | はい | リクエストのホスト名 | `"my-app-abc123.vercel.app"` |
| `timestamp` | number | はい | Unixタイムスタンプ（ミリ秒） | `1573817187330` |
| `projectId` | string | はい | Vercelプロジェクト識別子 | `"prj_12345"` |
| `level` | string | いいえ | ログの重大度 | `"info"`, `"warning"`, `"error"`, `"fatal"` |

### オプションフィールド

| フィールド | タイプ | 説明 | 例 |
|---------|------|-------------|---------|
| `message` | string | ログの内容 | `"Request received"` |
| `buildId` | string | ビルド識別子 | `"bld_abc123"` |
| `entrypoint` | string | リクエストエントリーポイント | `"api/users.js"` |
| `path` | string | Functionまたは動的パス | `"/api/users"` |
| `environment` | string | デプロイメント環境 | `"production"`, `"preview"` |

## ログ形式

### JSON形式

```json
{
  "id": "1573817187330377061717300000",
  "deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD",
  "source": "build",
  "host": "my-app-abc123.vercel.app",
  "timestamp": 1573817187330,
  "projectId": "prj_12345",
  "message": "Building application...",
  "level": "info"
}
```

### NDJSON形式

```
{"id": "1573817187330377061717300000","deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD","source":"build","timestamp":1573817187330}
{"id": "1573817187330377061717300001","deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD","source":"lambda","timestamp":1573817187331}
```

## ログソース

ログDrainsは以下のソースをサポート：

| ソース | 説明 |
|--------|-------------|
| `static` | 静的アセットリクエスト |
| `lambda` | Vercel Function出力 |
| `edge` | エッジランタイムFunction出力 |
| `build` | ビルドステップ出力 |
| `external` | 外部リライト |
| `firewall` | Vercel Firewallリクエストログ |

### ソース別の使用例

**Static**:
- 静的ファイルアクセスの追跡
- CDNキャッシュの分析

**Lambda**:
- Functionエラーのデバッグ
- パフォーマンスの監視

**Edge**:
- エッジFunctionの実行を追跡
- グローバルレイテンシの分析

**Build**:
- ビルドの問題のデバッグ
- デプロイメント時間の最適化

**External**:
- リライトパターンの監視
- 外部サービスの統合を追跡

**Firewall**:
- セキュリティイベントの監視
- ブロックされたリクエストの分析

## ログ環境

ログDrainsは以下の環境をフィルタリング可能：

| 環境 | 説明 |
|------|-------------|
| `production` | 割り当てられたドメインを持つデプロイメントからのログ |
| `preview` | 生成されたデプロイメントURLからのログ |

## サンプリングレート

サンプリングレートを設定して、ログ量を管理し、高トラフィックシナリオ中のコストを制御します。

### サンプリングレートの例

```
100% - すべてのログを送信
50% - ログの半分を送信
10% - ログの10%を送信
```

## ログペイロードの例

### Lambda Function

```json
{
  "id": "1573817187330377061717300002",
  "deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD",
  "source": "lambda",
  "host": "my-app.vercel.app",
  "timestamp": 1573817187330,
  "projectId": "prj_12345",
  "path": "/api/users",
  "message": "User query executed",
  "level": "info",
  "environment": "production"
}
```

### Build Log

```json
{
  "id": "1573817187330377061717300003",
  "deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD",
  "source": "build",
  "host": "my-app-abc123.vercel.app",
  "timestamp": 1573817187330,
  "projectId": "prj_12345",
  "buildId": "bld_abc123",
  "message": "Installing dependencies...",
  "level": "info"
}
```

### Firewall Log

```json
{
  "id": "1573817187330377061717300004",
  "deploymentId": "dpl_233NRGRjVZX1caZrXWtz5g1TAksD",
  "source": "firewall",
  "host": "my-app.vercel.app",
  "timestamp": 1573817187330,
  "projectId": "prj_12345",
  "message": "Request blocked",
  "level": "warning",
  "environment": "production"
}
```

## エンドポイント実装の例

### Node.js / Express

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();

app.post('/logs', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-vercel-signature'];
  const signatureSecret = process.env.DRAIN_SECRET;

  // 署名を検証
  const expectedSignature = crypto
    .createHmac('sha1', signatureSecret)
    .update(req.body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({ error: '無効な署名' });
  }

  // ログを処理
  const logs = JSON.parse(req.body);

  logs.forEach(log => {
    console.log(`[${log.level}] ${log.message}`);
    // ロギングサービスに転送
  });

  res.status(200).json({ success: true });
});

app.listen(3000);
```

### Next.js API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-vercel-signature');
  const signatureSecret = process.env.DRAIN_SECRET!;

  const rawBody = await req.text();

  // 署名を検証
  const expectedSignature = crypto
    .createHmac('sha1', signatureSecret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: '無効な署名' }, { status: 403 });
  }

  // ログを処理
  const logs = JSON.parse(rawBody);

  // ロギングロジック
  await processLogs(logs);

  return NextResponse.json({ success: true });
}
```

## ベストプラクティス

### エンドポイントのパフォーマンス

- 高速な応答を維持（<100ms）
- 非同期処理を使用
- バッファリングとバッチ処理を実装

### エラーハンドリング

- 常に200 OKで応答
- エラーをログに記録するが、リクエストは失敗しない
- 再試行ロジックを実装

### データの保存

- 効率的なストレージスキーマを使用
- インデックスを適切に設定
- データ保持ポリシーを実装

## トラブルシューティング

### ログが受信されない

- エンドポイントが到達可能であることを確認
- 200 OKステータスで応答していることを確認
- ファイアウォール設定を確認

### 署名検証の失敗

- 正しい秘密を使用していることを確認
- 生のリクエストボディを検証
- SHA1アルゴリズムを使用

## 次のステップ

- [Drainsの使用](/docs/drains/using-drains)
- [Drainsセキュリティ](/docs/drains/security)
- [トレースDrainsリファレンス](/docs/drains/reference/traces)

## 関連リソース

- [Drains概要](/docs/drains)
- [ログの概要](/docs/logs)
- [ランタイムログ](/docs/logs/runtime)
