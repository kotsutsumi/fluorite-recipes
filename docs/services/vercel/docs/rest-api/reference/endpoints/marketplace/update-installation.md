# インストールの更新

インテグレーションのインストール情報を更新します。

## エンドポイント

```
PATCH /v1/installations/{integrationConfigurationId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール識別子 |

## リクエストボディ（オプション）

```typescript
interface UpdateInstallationRequest {
  billingPlan?: {
    id: string;                    // 必須
    type: "prepayment" | "subscription";  // 必須
    name: string;                  // 必須
    description?: string;
    paymentMethodRequired?: boolean;
    cost?: number;
    details?: string[];
    highlightedDetails?: string[];
    effectiveDate?: string;
  };

  notification?: {
    level: "info" | "warn" | "error";  // 必須
    title: string;                      // 必須
    message?: string;
    href?: string;  // URI形式
  };
}
```

## レスポンス

### 成功 (204)

レスポンスボディなし。更新が正常に完了しました。

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 見つかりません |

## 使用例

### 課金プランの更新

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.marketplace.updateInstallation({
  integrationConfigurationId: 'icfg_abc123',
  requestBody: {
    billingPlan: {
      id: 'plan_pro',
      type: 'subscription',
      name: 'Professional Plan',
      description: '月額$29のプロフェッショナルプラン',
      cost: 2900,  // セント単位
      details: [
        '無制限のプロジェクト',
        '優先サポート',
        '高度な分析機能'
      ],
      effectiveDate: '2024-01-01'
    }
  }
});
```

### 通知の送信

```typescript
await vercel.marketplace.updateInstallation({
  integrationConfigurationId: 'icfg_abc123',
  requestBody: {
    notification: {
      level: 'warn',
      title: 'メンテナンス予定',
      message: '2024年1月15日にシステムメンテナンスを実施します',
      href: 'https://status.example.com'
    }
  }
});
```

### 両方を更新

```typescript
await vercel.marketplace.updateInstallation({
  integrationConfigurationId: 'icfg_abc123',
  requestBody: {
    billingPlan: {
      id: 'plan_enterprise',
      type: 'subscription',
      name: 'Enterprise Plan',
      cost: 9900
    },
    notification: {
      level: 'info',
      title: 'プランアップグレード完了',
      message: 'Enterpriseプランへのアップグレードが完了しました'
    }
  }
});
```

## 通知レベル

- **info**: 情報通知
- **warn**: 警告通知
- **error**: エラー通知
