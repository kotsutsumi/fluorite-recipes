# アカウント情報の取得

インストールに関連付けられたアカウント情報を取得します。

## エンドポイント

```
GET /v1/installations/{integrationConfigurationId}/account
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール構成識別子 |

## レスポンス

### 成功 (200)

```typescript
interface AccountInfo {
  name?: string;  // インストールが紐づいているチーム名
  url: string;    // インストールへのダッシュボードリンク
  contact: {
    email: string;  // 必須
    name?: string;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | リソースが見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const accountInfo = await vercel.marketplace.getAccountInfo({
  integrationConfigurationId: 'icfg_abc123'
});

console.log(`Team: ${accountInfo.name || 'Personal'}`);
console.log(`Contact: ${accountInfo.contact.name} <${accountInfo.contact.email}>`);
console.log(`Dashboard: ${accountInfo.url}`);
```

## ユースケース

このエンドポイントは以下の場合に使用します：

1. **サポート連絡先の確認**: インストールの主要連絡先を取得
2. **チーム情報の表示**: どのチームに関連付けられているか確認
3. **ダッシュボードリンク**: ユーザーを適切なダッシュボードに誘導

## レスポンスフィールドの説明

- **name**: チームアカウントの場合はチーム名、個人アカウントの場合は省略される可能性があります
- **url**: Vercelダッシュボード内のインストール設定ページへのリンク
- **contact.email**: 主要連絡先のメールアドレス（必須）
- **contact.name**: 連絡先の名前（オプション）
