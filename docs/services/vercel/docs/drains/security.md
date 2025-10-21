# Drainsセキュリティ

## トランスポートレベルのセキュリティ

すべてのDrainsはHTTPS暗号化をサポートしています。

## Drainsエンドポイントの保護

### 署名検証

- Vercelは各Drainで`x-vercel-signature`ヘッダーを送信
- このヘッダーには、Drain署名秘密を使用して作成されたペイロードボディのハッシュが含まれる
- Drainsリストの「Edit」をクリックすることで、この秘密を見つけたり更新したりできる

### 検証の例（Next.js）

```typescript
import crypto from 'crypto';

export async function POST(request: Request) {
  const signatureSecret = '<Drain signature secret>';
  const rawBody = await request.text();
  const rawBodyBuffer = Buffer.from(rawBody, 'utf-8');
  const bodySignature = sha1(rawBodyBuffer, signatureSecret);

  if (bodySignature !== request.headers.get('x-vercel-signature')) {
    return Response.json(
      {
        code: 'invalid_signature',
        error: "signature didn't match",
      },
      { status: 403 }
    );
  }

  console.log(rawBody);
  return Response.json({ success: true });
}

function sha1(data: Buffer, secret: string): string {
  return crypto.createHmac('sha1', secret).update(data).digest('hex');
}
```

### Node.js / Express の例

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

app.post('/drain', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-vercel-signature'];
  const signatureSecret = process.env.DRAIN_SECRET;

  // 署名を検証
  const expectedSignature = crypto
    .createHmac('sha1', signatureSecret)
    .update(req.body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({
      code: 'invalid_signature',
      error: '署名が一致しませんでした',
    });
  }

  // リクエストを処理
  const data = JSON.parse(req.body.toString());
  console.log('検証済みデータ:', data);

  res.json({ success: true });
});

app.listen(3000);
```

### 追加の認証

Drain配信先を設定する際に、カスタムヘッダーを追加できます。

#### カスタムヘッダーの例

```
Authorization: Bearer your-secret-token
X-API-Key: your-api-key
X-Custom-Header: custom-value
```

## IPアドレスの可視性

### 利用可能性

- EnterpriseおよびProプランで利用可能
- オーナーと管理者がアクセス可能

### IPアドレスの非表示

1. Vercelダッシュボードに移動
2. スコープセレクターでチームを選択
3. Settings > Security & Privacyに移動
4. IP Address Visibilityスイッチをオフに切り替え

#### IPアドレス非表示の影響

- **Drainsに影響**: Drainsデータにはクライアント IPアドレスが含まれなくなる
- **可観測性に影響**: ダッシュボードとログでIPアドレスが非表示になる
- **セキュリティ機能**: DDoS緩和などのために内部的には引き続き収集される

## セキュリティのベストプラクティス

### エンドポイントのセキュリティ

#### 1. 常に署名を検証

```typescript
async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = crypto
    .createHmac('sha1', secret)
    .update(body)
    .digest('hex');

  return signature === expectedSignature;
}
```

#### 2. HTTPS接続のみを使用

- HTTP エンドポイントを使用しない
- 有効なSSL/TLS証明書を確保
- 証明書を最新に保つ

#### 3. レート制限を実装

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 100リクエストに制限
});

app.use('/drain', limiter);
```

#### 4. エラー情報を公開しない

```typescript
export async function POST(request: Request) {
  try {
    // リクエストを処理
    await processData(request);
    return Response.json({ success: true });
  } catch (error) {
    // 内部的にエラーをログ
    console.error('内部エラー:', error);

    // 一般的なエラーを返す
    return Response.json(
      { error: 'リクエストの処理中にエラーが発生しました' },
      { status: 200 } // 常に200を返してVercelの再試行を防ぐ
    );
  }
}
```

### データのセキュリティ

#### 機密データのフィルタリング

```typescript
function sanitizeLogData(log: any) {
  const sanitized = { ...log };

  // 機密フィールドを削除
  delete sanitized.apiKey;
  delete sanitized.password;
  delete sanitized.token;

  // パラメータから機密情報を編集
  if (sanitized.url) {
    sanitized.url = sanitized.url.replace(/apiKey=[^&]+/, 'apiKey=REDACTED');
  }

  return sanitized;
}
```

#### データの暗号化

```typescript
import crypto from 'crypto';

function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

function decryptData(encryptedData: string, key: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### アクセス制御

#### IPホワイトリスト

```javascript
const allowedIPs = ['192.168.1.1', '10.0.0.1'];

app.use('/drain', (req, res, next) => {
  const clientIP = req.ip;

  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
});
```

#### APIキーの検証

```typescript
export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey || !await validateAPIKey(apiKey)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // リクエストを処理
}

async function validateAPIKey(key: string): Promise<boolean> {
  // データベースまたはキャッシュで検証
  return key === process.env.VALID_API_KEY;
}
```

## セキュリティ監査

### ログの監視

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'drain-security.log' }),
  ],
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for');

  // セキュリティイベントをログ
  logger.info('Drain request received', {
    ip,
    timestamp: new Date().toISOString(),
    signature: request.headers.get('x-vercel-signature') ? 'present' : 'missing',
  });

  // 処理を続ける
}
```

### 異常検出

```typescript
function detectAnomalies(requests: any[]) {
  const byIP: Record<string, number> = {};

  requests.forEach(req => {
    byIP[req.ip] = (byIP[req.ip] || 0) + 1;
  });

  // 1時間に100件以上のリクエストを送信するIPを検出
  const suspicious = Object.entries(byIP)
    .filter(([_, count]) => count > 100)
    .map(([ip]) => ip);

  if (suspicious.length > 0) {
    // アラートを送信
    console.warn('疑わしいアクティビティ検出:', suspicious);
  }
}
```

## コンプライアンス

### GDPR準拠

- 個人データを最小限に抑える
- データ保持ポリシーを実装
- ユーザーの削除リクエストを尊重

### SOC 2準拠

- アクセスをログに記録
- データを暗号化
- 定期的なセキュリティ監査

## トラブルシューティング

### 署名検証の失敗

**一般的な原因**:
- 誤った秘密
- 変更されたリクエストボディ
- エンコーディングの問題

**デバッグ**:

```typescript
console.log('受信した署名:', signature);
console.log('期待される署名:', expectedSignature);
console.log('ボディ:', rawBody);
```

### 不正なアクセス試行

**対策**:
- レート制限を強化
- IPブロックリストを実装
- アラートを設定

## 次のステップ

- [Drainsの使用](/docs/drains/using-drains)
- [ログDrainsリファレンス](/docs/drains/reference/logs)
- [セキュリティのベストプラクティス](/docs/security)

## 関連リソース

- [Drains概要](/docs/drains)
- [Vercelセキュリティ](/docs/security)
- [暗号化](/docs/encryption)
