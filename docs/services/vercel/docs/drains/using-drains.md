# Drainsの使用

## 概要

DrainsはProおよびEnterpriseプランで利用可能な機能で、可観測性データをカスタムHTTPエンドポイントまたは統合に転送できます。

## Drainsの設定

### サポートされているデータタイプ

- **Logs**: ログ
- **Traces**: トレース
- **Speed Insights**: Speed Insightsデータ
- **Web Analytics**: Web Analyticsデータ

### 設定手順

1. **Team Settings > Drainsに移動**
2. **「Add Drain」をクリック**
3. **データタイプを選択**
4. **データを送信するプロジェクトを選択**
5. **サンプリングレートを設定**
6. **配信先を選択**（カスタムエンドポイントまたは統合）

## ログソースオプション

ログDrainsでは以下のソースから選択可能：

- **Functions**: Vercel Functions
- **Edge Functions**: エッジFunction
- **Static Files**: 静的ファイル
- **Rewrites**: リライト
- **Builds**: ビルド
- **Firewall**: ファイアウォール

## 配信先のタイプ

### カスタムエンドポイント

カスタムHTTPエンドポイントを設定する場合：

**1. HTTPエンドポイントURLを設定**
```
https://your-endpoint.com/logs
```

**2. データ形式を選択**
- JSON
- NDJSON
- Protobuf（トレースの場合）

**3. オプションの署名検証**
- 署名秘密を設定
- エンドポイントで検証を実装

**4. カスタムヘッダーを追加**
```
Authorization: Bearer your-token
X-Custom-Header: value
```

### ネイティブ統合

マーケットプレイス統合を使用する場合：

1. ログとトレースデータ用の統合を使用
2. インストール済みまたは利用可能な製品を選択
3. 統合固有の設定を構成

#### サポートされている統合

- Dash0
- Braintrust
- その他のマーケットプレイス統合

## サンプリングレートの設定

### サンプリングレートとは

データ量とコストを管理するために、送信するイベントの割合を制御します。

### 設定例

- **100%**: すべてのイベントを送信（デフォルト）
- **50%**: イベントの半分を送信
- **10%**: イベントの10%を送信

### 推奨事項

- **本番環境**: より高いサンプリングレート（80-100%）
- **プレビュー環境**: より低いサンプリングレート（10-50%）
- 高トラフィック時には調整

## 環境の選択

Drainsは以下の環境をサポート：

- **Production**: 本番環境のみ
- **Preview**: プレビュー環境のみ
- **Both**: すべての環境

## ログとトレースの相関

### 自動相関

- トレースされたリクエスト中のユーザーコードログに自動的に適用
- ログとトレースを関連付けて理解を深める

### 制限事項

- ユーザーコードログにのみ適用
- トレースされたリクエスト中にのみ機能

## カスタムエンドポイントの例

### ログDrainエンドポイント（Node.js）

```javascript
import crypto from 'crypto';

export default async function handler(req, res) {
  const signature = req.headers['x-vercel-signature'];
  const signatureSecret = process.env.DRAIN_SECRET;

  // 署名を検証
  const rawBody = await getRawBody(req);
  const expectedSignature = crypto
    .createHmac('sha1', signatureSecret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({ error: '無効な署名' });
  }

  // ログを処理
  const logs = JSON.parse(rawBody);
  console.log('受信したログ:', logs);

  // 外部サービスに転送
  await forwardToLoggingService(logs);

  return res.status(200).json({ success: true });
}
```

### トレースDrainエンドポイント（Node.js）

```javascript
export default async function handler(req, res) {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/x-protobuf') {
    // Protobuf形式のトレースを処理
    const buffer = await getRawBody(req);
    await processProtobufTraces(buffer);
  } else if (contentType === 'application/json') {
    // JSON形式のトレースを処理
    const traces = await req.json();
    await processJsonTraces(traces);
  }

  return res.status(200).json({ success: true });
}
```

## Drainsの管理

### 一時停止と再開

Drainsは必要に応じて一時停止および再開できます：

1. Drains設定に移動
2. Drainを選択
3. 一時停止/再開ボタンをクリック

### Drainsの削除

不要になったDrainsを削除するには：

1. Drains設定に移動
2. 削除するDrainを選択
3. 削除ボタンをクリック
4. 確認

### エンドポイント接続のテスト

Drainを作成または編集する際：

1. エンドポイントURLを入力
2. 「Test Connection」をクリック
3. 接続が成功することを確認

## データ形式の比較

### JSON

**利点**:
- 読みやすい
- デバッグが簡単
- 広くサポートされている

**欠点**:
- より大きなペイロードサイズ

### NDJSON（改行区切りJSON）

**利点**:
- ストリーミングに適している
- 大量のデータに効率的
- 行ごとの処理が可能

**欠点**:
- 標準JSONより読みにくい

### Protobuf

**利点**:
- 非常に効率的
- バイナリ形式
- 高速な処理

**欠点**:
- デバッグが難しい
- スキーマ定義が必要

## ベストプラクティス

### エンドポイントの要件

- **200 OKで応答**: エンドポイントは200 OKステータスで応答する必要がある
- **低レイテンシ**: 高速な応答時間を維持
- **エラーハンドリング**: 適切なエラー処理を実装
- **レート制限**: レート制限を適切に処理

### セキュリティ

- **署名検証を使用**: すべてのリクエストで署名を検証
- **HTTPS接続**: 安全な接続のみを使用
- **機密データの保護**: ログから機密情報を除外

### パフォーマンス

- **サンプリングレートの調整**: トラフィックとコストのバランスを取る
- **効率的な形式**: 大量のデータにはNDJSONまたはProtobufを使用
- **エンドポイントの監視**: エンドポイントのパフォーマンスを追跡

## トラブルシューティング

### データが受信されない

- エンドポイントURLが正しいことを確認
- エンドポイントが200 OKで応答することを確認
- ファイアウォール設定を確認
- サンプリングレートが0でないことを確認

### 署名検証の失敗

- 署名秘密が正しいことを確認
- 生のリクエストボディを使用していることを確認
- SHA1アルゴリズムを使用していることを確認

### 部分的なデータ

- ログソースの選択を確認
- フィルタ設定を見直し
- エンドポイントのレート制限を確認

## 次のステップ

- [ログDrainsリファレンス](/docs/drains/reference/logs)を確認
- [トレースDrainsリファレンス](/docs/drains/reference/traces)を確認
- [Drainsセキュリティ](/docs/drains/security)を実装
- Speed InsightsとAnalytics Drainsを探索

## 関連リソース

- [Drains概要](/docs/drains)
- [可観測性](/docs/observability)
- [ログ](/docs/logs)
- [OpenTelemetry](/docs/otel)
