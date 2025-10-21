# メンバー情報の取得

インストールの特定のメンバー情報を取得します。

## エンドポイント

```
GET /v1/installations/{integrationConfigurationId}/member/{memberId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インテグレーション構成識別子 |
| `memberId` | string | ✓ | メンバー識別子 |

## レスポンス

### 成功 (200)

```typescript
interface MemberInfo {
  id: string;
  role: "ADMIN" | "USER";
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | リソースが見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const member = await vercel.marketplace.getMember({
  integrationConfigurationId: 'icfg_abc123',
  memberId: 'user_xyz789'
});

console.log(`Member ID: ${member.id}`);
console.log(`Role: ${member.role}`);

if (member.role === 'ADMIN') {
  console.log('このユーザーはインテグレーションをインストール可能です');
} else {
  console.log('このユーザーは閲覧権限のみです');
}
```

## ロールの説明

### ADMIN
- インテグレーションのインストールが可能
- Vercelチーム内の管理者権限を持つユーザー
- 完全な構成管理権限

### USER
- 閲覧権限のみ
- Vercel BillingまたはViewerロールを持つユーザー
- インテグレーションのインストールや削除は不可

## ユースケース

1. **権限チェック**: ユーザーが管理操作を実行可能か確認
2. **UI表示制御**: ユーザーのロールに基づいて機能を表示/非表示
3. **監査ログ**: メンバーのロールを記録して追跡

## 関連リンク

- [Get Account Information](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-account-information.md)
