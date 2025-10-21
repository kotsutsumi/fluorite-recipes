# チームの更新

チームの設定を更新します。

## エンドポイント

```
PATCH /v2/teams/{teamId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

**権限**: OWNERロールが必要です。

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `teamId` | string | ✓ | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `slug` | string | チームスラッグ（例: `my-team-url-slug`） |

## リクエストボディ（すべてオプション）

```typescript
interface UpdateTeamRequest {
  name?: string;  // 最大256文字
  description?: string;  // 最大140文字
  slug?: string;  // 新しいチームスラッグ
  avatar?: string;  // アップロードされた画像のハッシュ
  emailDomain?: string;  // 自動参加用のドメイン
  previewDeploymentSuffix?: string;  // プレビューデプロイメントのサフィックス
  regenerateInviteCode?: boolean;  // 新しい招待コードを生成
  saml?: {
    enforced?: boolean;
    roles?: {
      admin?: string;
      member?: string;
      developer?: string;
      billing?: string;
      viewer?: string;
      contributor?: string;
    };
  };
  remoteCaching?: {
    enabled?: boolean;
  };
  enablePreviewFeedback?: "on" | "off" | "default";
  enableProductionFeedback?: "on" | "off" | "default";
  defaultDeploymentProtection?: {
    passwordProtection?: {
      deploymentType?: "all" | "preview" | "prod_deployment_urls_and_all_previews" | "none";
    };
    ssoProtection?: {
      deploymentType?: "all" | "preview" | "prod_deployment_urls_and_all_previews" | "none";
    };
  };
  defaultExpirationSettings?: {
    deploymentExpiration?: number;  // 保持期間（秒）
  };
  hideIpAddresses?: boolean;  // モニタリングクエリでIPアドレスを非表示
}
```

## レスポンス

### 成功 (200)

更新された完全なTeamオブジェクトを返します。

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ値 |
| 401 | 未認証（トークン不足/無効） |
| 402 | 支払いが必要 |
| 403 | 権限不足（OWNERロールが必要） |
| 428 | 保護アドオンが不足、またはユーザープランで利用不可 |

## 使用例

### 基本情報の更新

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    name: 'New Team Name',
    description: 'Updated team description'
  }
});

console.log(`Updated: ${updatedTeam.name}`);
```

### スラッグの変更

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    slug: 'new-team-slug'
  }
});

console.log(`New slug: ${updatedTeam.slug}`);
```

### 招待コードの再生成

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    regenerateInviteCode: true
  }
});

console.log('New invite code generated');
```

### SAML設定の更新

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    saml: {
      enforced: true,
      roles: {
        admin: 'admin-group',
        member: 'member-group',
        developer: 'developer-group'
      }
    }
  }
});

console.log('SAML configuration updated');
```

### デプロイメント保護の設定

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    defaultDeploymentProtection: {
      passwordProtection: {
        deploymentType: 'preview'  // プレビューのみパスワード保護
      },
      ssoProtection: {
        deploymentType: 'all'  // すべてSSO保護
      }
    }
  }
});

console.log('Deployment protection updated');
```

### フィードバック機能の有効化

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    enablePreviewFeedback: 'on',
    enableProductionFeedback: 'off'
  }
});

console.log('Feedback settings updated');
```

### リモートキャッシングの有効化

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    remoteCaching: {
      enabled: true
    }
  }
});

console.log('Remote caching enabled');
```

### デプロイメント保持期間の設定

```typescript
// 30日間保持
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    defaultExpirationSettings: {
      deploymentExpiration: 30 * 24 * 60 * 60  // 30日（秒単位）
    }
  }
});

console.log('Deployment expiration set to 30 days');
```

### IPアドレスの非表示化

```typescript
const updatedTeam = await vercel.teams.patchTeam({
  teamId: 'team_abc123',
  requestBody: {
    hideIpAddresses: true
  }
});

console.log('IP addresses will be hidden in monitoring queries');
```

## デプロイメント保護タイプ

- **all**: すべてのデプロイメントに適用
- **preview**: プレビューデプロイメントのみ
- **prod_deployment_urls_and_all_previews**: 本番URLとすべてのプレビュー
- **none**: 保護なし

## フィードバック設定

- **on**: 有効
- **off**: 無効
- **default**: デフォルト設定を使用

## 注意事項

- チーム設定を更新するにはOWNER権限が必要です
- スラッグの変更は既存のURLに影響を与える可能性があります
- SAML設定の変更は慎重に行ってください
- デプロイメント保護機能は適切なプランで利用可能である必要があります

## 関連リンク

- [Get a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/get-a-team.md)
- [Create a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/create-a-team.md)
- [Delete a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/delete-a-team.md)
