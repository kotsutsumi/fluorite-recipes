# APIルート

EAS HostingダッシュボードでAPIルートを監視および検査する方法を説明します。

## 監視エリア

EAS Hostingダッシュボードでは、APIルートを3つの主要なエリアで監視できます：

### 1. クラッシュ

**概要:**
- レスポンスが返されないキャッチされていないエラー
- Hostingクラッシュページで表示
- クラッシュはグループ化されます
- スタックトレースとメタデータを表示

**確認方法:**
1. プロジェクトダッシュボードに移動
2. Hosting → Crashesセクションにアクセス
3. クラッシュの詳細を表示してデバッグ

**情報内容:**
- エラーメッセージ
- スタックトレース
- 発生時刻
- 影響を受けたリクエスト数

### 2. ログ

**概要:**
- すべてのコンソールログが記録されます（`log`、`info`、`error`）
- デプロイメントレベルのログでアクセス可能
- 特定のデプロイメントを選択して表示

**確認方法:**
1. プロジェクトダッシュボードに移動
2. 特定のデプロイメントを選択
3. Logsセクションにアクセス

**ログの種類:**
```typescript
// これらはすべて記録されます
console.log('情報メッセージ');
console.info('情報レベルのログ');
console.error('エラーメッセージ');
```

### 3. リクエスト

**概要:**
- プロジェクトレベルとデプロイメントレベルで表示可能
- ステータス、ブラウザ、リージョン、期間などのメタデータを表示
- すべてのサービスリクエスト（APIルートを含む）を表示

**確認方法:**
1. プロジェクトダッシュボードに移動
2. Hosting → Requestsセクションにアクセス
3. フィルターと検索を使用して特定のリクエストを探す

**表示される情報:**
- HTTPステータスコード
- リクエストパス
- リクエスト元のリージョン
- レスポンス時間
- ブラウザとデバイス情報

## リクエストの詳細検索

### Cf-Rayヘッダーによる検索

特定のリクエストを`Cf-Ray`ヘッダーIDで検索できます：

```typescript
// APIルートでヘッダーを取得
export async function GET(request: Request) {
  const cfRay = request.headers.get('cf-ray');
  console.log('CF-Ray:', cfRay);

  return Response.json({ success: true });
}
```

ダッシュボードでこのIDを使用して特定のリクエストを検索できます。

## サンプリングと高トラフィック

### データ記録のサンプリング

高トラフィックのデプロイメントでは：
- データ記録を管理するためにサンプリングが使用されます
- サンプリングされたデータでも統計カウントが提供されます
- すべてのリクエストがカウントされますが、すべての詳細が記録されるわけではありません

### パフォーマンスへの影響

サンプリングにより：
- パフォーマンスが最適化されます
- 正確な統計が維持されます
- 詳細なデバッグ情報が代表的なサンプルで利用可能

## APIルートのベストプラクティス

### ロギング戦略

```typescript
// app/api/users+api.ts
export async function GET(request: Request) {
  console.log('[API] Fetching users');

  try {
    const users = await fetchUsers();
    console.log(`[API] Successfully fetched ${users.length} users`);
    return Response.json(users);
  } catch (error) {
    console.error('[API] Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
```

### エラーハンドリング

```typescript
// app/api/data+api.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 入力検証
    if (!body.id) {
      return Response.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // データ処理
    const result = await processData(body);

    return Response.json(result);
  } catch (error) {
    // エラーログ
    console.error('[API] Error:', error);

    // クライアントへの適切なエラーレスポンス
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### メトリクスの追跡

```typescript
// app/api/metrics+api.ts
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    const data = await fetchData();
    const duration = Date.now() - startTime;

    console.log(`[Metrics] Request duration: ${duration}ms`);

    return Response.json(data);
  } catch (error) {
    console.error('[Metrics] Request failed:', error);
    throw error;
  }
}
```

## デバッグのヒント

### 1. 構造化ログ

```typescript
// 構造化されたログ形式を使用
console.log(JSON.stringify({
  level: 'info',
  timestamp: new Date().toISOString(),
  message: 'User action',
  userId: user.id,
  action: 'login'
}));
```

### 2. リクエストIDの追跡

```typescript
export async function GET(request: Request) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request started`);

  try {
    const result = await processRequest();
    console.log(`[${requestId}] Request completed`);
    return Response.json(result);
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}
```

### 3. 環境別のログレベル

```typescript
const isDev = process.env.NODE_ENV === 'development';

function debugLog(message: string) {
  if (isDev) {
    console.log('[DEBUG]', message);
  }
}
```

## パフォーマンス監視

### レスポンス時間の追跡

ダッシュボードで以下を監視：
- 平均レスポンス時間
- 95パーセンタイルのレスポンス時間
- 遅いリクエストの特定

### ボトルネックの特定

1. Requestsセクションで遅いリクエストをソート
2. 特定のエンドポイントのパターンを確認
3. ログで詳細なタイミング情報を確認

## 次のステップ

- [キャッシング戦略の実装](/frameworks/expo/docs/eas/hosting/reference/caching)
- [レスポンスとヘッダーの最適化](/frameworks/expo/docs/eas/hosting/reference/responses-and-headers)
- [Worker ランタイムの理解](/frameworks/expo/docs/eas/hosting/reference/worker-runtime)

## 関連リソース

- [Expo Router APIルートドキュメント](https://docs.expo.dev/router/reference/api-routes/)
- [デプロイワークフローの自動化](/frameworks/expo/docs/eas/hosting/workflows)
