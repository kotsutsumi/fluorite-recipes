# デフォルトのレスポンスとヘッダー

EAS Hostingで自動的に適用されるデフォルトのヘッダーと動作について説明します。

## アセットレスポンス

### ETagヘッダー

EAS Hostingは自動的にアセットレスポンスに`ETag`ヘッダーを追加します。

```http
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**目的:**
- ブラウザキャッシュの検証
- 条件付きリクエストのサポート
- 帯域幅の最適化

**動作:**
1. ブラウザが`If-None-Match`ヘッダーでリクエスト
2. ETagが一致する場合、304 Not Modifiedを返す
3. 変更がある場合のみ、完全なレスポンスを返す

## CORSレスポンス

### デフォルトのCORS設定

EAS Hostingは寛容なデフォルトCORS設定を提供します：

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: *
Access-Control-Max-Age: 3600
```

**特徴:**
- すべてのオリジンからのリクエストを許可
- 認証情報の送信を有効化
- すべてのヘッダーを公開
- OPTIONSレスポンスを1時間キャッシュ

### カスタムCORS設定

APIルートでCORSをカスタマイズできます：

```typescript
// app/api/restricted+api.ts
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://yourdomain.com',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
```

### OPTIONSリクエストの処理

```typescript
// app/api/data+api.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    }
  });
}

export async function POST(request: Request) {
  // POST処理
}
```

## セキュリティヘッダー

### Strict-Transport-Security

HTTPSの使用を強制します：

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**効果:**
- ブラウザにHTTPSの使用を強制
- 中間者攻撃を防止
- 1年間（31536000秒）有効

### バージョンヘッダーの削除

EAS Hostingは不要なバージョン情報ヘッダーを削除します：
- `X-Powered-By` ヘッダーを削除
- サーバー情報の漏洩を防止

### Content-Security-Policy

iframeへの埋め込みを防止します：

```http
Content-Security-Policy: frame-ancestors 'self'
```

**効果:**
- 同一オリジンのみiframe埋め込みを許可
- クリックジャッキング攻撃を防止

### カスタムセキュリティヘッダー

```typescript
// app/api/secure+api.ts
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}
```

## リクエストヘッダー

EAS Hostingは、リクエストの詳細情報を含むヘッダーを自動的に追加します。

### 転送されたIP情報

```typescript
export async function GET(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('eas-real-ip');

  console.log('Client IP:', realIp);
}
```

利用可能なヘッダー：
- `x-forwarded-for`: プロキシチェーン
- `eas-real-ip`: クライアントの実際のIP
- `cf-connecting-ip`: Cloudflareの接続IP

### 地理情報ヘッダー

```typescript
export async function GET(request: Request) {
  const continent = request.headers.get('eas-ip-continent');
  const country = request.headers.get('eas-ip-country');
  const city = request.headers.get('eas-ip-city');
  const timezone = request.headers.get('eas-ip-timezone');

  console.log(`Request from: ${city}, ${country} (${timezone})`);

  return Response.json({
    location: { continent, country, city, timezone }
  });
}
```

利用可能な地理情報ヘッダー：
- `eas-ip-continent`: 大陸コード（例：`NA`）
- `eas-ip-country`: 国コード（例：`US`）
- `eas-ip-city`: 都市名（例：`San Francisco`）
- `eas-ip-timezone`: タイムゾーン（例：`America/Los_Angeles`）
- `eas-ip-latitude`: 緯度
- `eas-ip-longitude`: 経度

### Cloudflareデータセンター情報

```typescript
export async function GET(request: Request) {
  const datacenter = request.headers.get('cf-ray');
  const cfColo = request.headers.get('cf-ipcountry');

  console.log('Datacenter:', datacenter);
}
```

## クラッシュページ

### 自動エラーハンドリング

JavaScriptエラーが処理されない場合、EAS Hostingは自動的にクラッシュページを表示します。

**特徴:**
- ユーザーフレンドリーなエラーメッセージ
- スタックトレースは非表示（本番環境）
- ダッシュボードで詳細を確認可能

### カスタムエラーハンドリング

```typescript
// app/api/data+api.ts
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);

    return Response.json(
      {
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
```

## 実用的なヘッダー使用例

### 地理ベースのコンテンツ

```typescript
export async function GET(request: Request) {
  const country = request.headers.get('eas-ip-country');

  const content = getContentForCountry(country);

  return Response.json(content);
}
```

### レート制限

```typescript
const rateLimits = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get('eas-real-ip') || 'unknown';

  const count = rateLimits.get(ip) || 0;
  if (count > 100) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  rateLimits.set(ip, count + 1);

  // リクエスト処理
  return Response.json({ success: true });
}
```

### タイムゾーンベースのレスポンス

```typescript
export async function GET(request: Request) {
  const timezone = request.headers.get('eas-ip-timezone');

  const localizedData = formatDataForTimezone(data, timezone);

  return Response.json(localizedData);
}
```

## ヘッダーデバッグ

### すべてのヘッダーを表示

```typescript
export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());

  return Response.json({
    headers,
    url: request.url,
    method: request.method
  });
}
```

### 特定のヘッダーを検査

```typescript
export async function GET(request: Request) {
  console.log('--- Request Headers ---');
  console.log('IP:', request.headers.get('eas-real-ip'));
  console.log('Country:', request.headers.get('eas-ip-country'));
  console.log('City:', request.headers.get('eas-ip-city'));
  console.log('User-Agent:', request.headers.get('user-agent'));
  console.log('CF-Ray:', request.headers.get('cf-ray'));

  return Response.json({ success: true });
}
```

## ベストプラクティス

### セキュリティ

1. **最小権限の原則**: 必要なヘッダーのみを公開
2. **CORS制限**: 本番環境では`*`ではなく特定のオリジンを指定
3. **セキュリティヘッダー**: CSP、X-Frame-Options などを適切に設定

### パフォーマンス

1. **ヘッダーサイズ**: 不要なヘッダーは送信しない
2. **キャッシュ制御**: 適切なCache-Controlヘッダーを設定
3. **圧縮**: 大きなレスポンスは圧縮

### デバッグ

1. **ログ記録**: 重要なヘッダー情報をログに記録
2. **エラーハンドリング**: 適切なエラーレスポンスを返す
3. **モニタリング**: ダッシュボードでヘッダーパフォーマンスを監視

## 次のステップ

- [Worker ランタイムの理解](/frameworks/expo/docs/eas/hosting/reference/worker-runtime)
- [キャッシング戦略の最適化](/frameworks/expo/docs/eas/hosting/reference/caching)
- [APIルートの監視](/frameworks/expo/docs/eas/hosting/api-routes)
