# Web Analyticsイベントから機密データを編集

## 概要

URLやクエリパラメータには、ユーザーID、トークン、注文番号など、自動的に追跡したくない機密情報が含まれることがあります。

## 機密データを編集する方法

### 1. イベントまたはルートを無視

`beforeSend`関数で`null`を返すことで、特定のルートの追跡を防ぐことができます：

```typescript
<Analytics
  beforeSend={(event: BeforeSendEvent) => {
    if (event.url.includes('/private')) {
      return null;
    }
    return event;
  }}
/>
```

### 2. クエリパラメータの削除

URLを解析および調整することでイベントを変更します：

```typescript
<Analytics
  beforeSend={(event) => {
    const url = new URL(event.url);
    url.searchParams.delete('secret');
    return {
      ...event,
      url: url.toString(),
    };
  }}
/>
```

### 3. ユーザーのオプトアウト追跡

`localStorage`を使用してユーザーが追跡を無効にできるようにします：

```typescript
<Analytics
  beforeSend={(event) => {
    if (localStorage.getItem('va-disable')) {
      return null;
    }
    return event;
  }}
/>
```

## 高度な例

### 複数のパターンのフィルタリング

```typescript
<Analytics
  beforeSend={(event) => {
    const url = new URL(event.url);

    // 機密パスを除外
    const sensitivePaths = ['/admin', '/api/secret', '/internal'];
    if (sensitivePaths.some(path => event.url.includes(path))) {
      return null;
    }

    // 機密パラメータを削除
    const sensitiveParams = ['token', 'apiKey', 'session'];
    sensitiveParams.forEach(param => {
      url.searchParams.delete(param);
    });

    return {
      ...event,
      url: url.toString(),
    };
  }}
/>
```

### URLパスの編集

```typescript
<Analytics
  beforeSend={(event) => {
    const url = new URL(event.url);

    // UUIDをプレースホルダーに置き換え
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    url.pathname = url.pathname.replace(uuidPattern, ':id');

    return {
      ...event,
      url: url.toString(),
    };
  }}
/>
```

### カスタムイベントデータの編集

```typescript
import { track } from '@vercel/analytics';

function trackPurchase(orderId: string, email: string, amount: number) {
  // 機密データ（メール）を除外
  track('Purchase', {
    // orderId: orderId, // 除外
    amount: amount,
    // email: email, // 除外
  });
}
```

## ベストプラクティス

### 何を編集すべきか

- ユーザーID
- セッショントークン
- APIキー
- 個人を特定できる情報（PII）
- 支払い情報
- 機密ビジネスデータ

### データのサニタイズ

```typescript
function sanitizeUrl(url: string): string {
  const urlObj = new URL(url);

  // 機密パラメータを削除
  ['userId', 'token', 'apiKey', 'session'].forEach(param => {
    urlObj.searchParams.delete(param);
  });

  // パスから機密部分を編集
  urlObj.pathname = urlObj.pathname
    .replace(/\/user\/\d+/, '/user/:id')
    .replace(/\/order\/[A-Z0-9]+/, '/order/:orderId');

  return urlObj.toString();
}

<Analytics
  beforeSend={(event) => ({
    ...event,
    url: sanitizeUrl(event.url),
  })}
/>
```

### ユーザー設定の尊重

```typescript
function App() {
  const [trackingConsent, setTrackingConsent] = useState(
    () => localStorage.getItem('analytics-consent') === 'true'
  );

  return (
    <>
      <YourApp />
      <Analytics
        beforeSend={(event) => {
          if (!trackingConsent) {
            return null;
          }
          return event;
        }}
      />
    </>
  );
}
```

## プライバシーコンプライアンス

### GDPR準拠

- ユーザーに追跡について通知
- 同意オプションを提供
- データ編集を実装
- データ保持ポリシーを尊重

### CCPA準拠

- オプトアウトメカニズムを提供
- 個人データを編集
- プライバシーポリシーを維持

## テスト

### 編集のテスト

```typescript
// デバッグモードを有効化
<Analytics
  debug={true}
  beforeSend={(event) => {
    console.log('送信前:', event);

    // 編集ロジック
    const sanitized = sanitizeEvent(event);

    console.log('送信後:', sanitized);
    return sanitized;
  }}
/>
```

## トラブルシューティング

### beforeSendが機能しない

- 関数が正しく定義されていることを確認
- イベントオブジェクトを返していることを確認
- コンソールエラーを確認

### 過度なフィルタリング

- フィルタロジックを確認
- nullを返しすぎていないことを確認
- デバッグモードでテスト

## 次のステップ

- [プライバシーポリシー](/docs/analytics/privacy-policy)を確認
- [パッケージ設定](/docs/analytics/package)を学ぶ
- [カスタムイベント](/docs/analytics/custom-events)を探索

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [プライバシーポリシー](/docs/analytics/privacy-policy)
- [GDPR準拠](/legal/gdpr)
