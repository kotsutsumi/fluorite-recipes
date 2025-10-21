# チームの作成

アカウントに新しいチームを作成します。

## エンドポイント

```
POST /v1/teams
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## リクエストボディ

```typescript
interface CreateTeamRequest {
  slug: string;  // 必須: チームの希望スラッグ（最大48文字）
  name?: string;  // オプション: チーム名（最大256文字）省略時はslugから自動生成
  attribution?: {
    sessionReferrer?: string;
    landingPage?: string;
    pageBeforeConversionPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  };
}
```

## レスポンス

### 成功 (200)

```typescript
interface CreateTeamResponse {
  id: string;    // 例: "team_nLlpyC6RE1qxqglFKbrMxlud"
  slug: string;  // 例: "a-random-team"
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効な値または重複スラッグ |
| 401 | 未認証 |
| 403 | 権限不足 |

## 使用例

### 基本的なチーム作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const team = await vercel.teams.createTeam({
  requestBody: {
    slug: 'my-awesome-team'
  }
});

console.log(`✅ Team created!`);
console.log(`  ID: ${team.id}`);
console.log(`  Slug: ${team.slug}`);
```

### 名前付きチーム作成

```typescript
const team = await vercel.teams.createTeam({
  requestBody: {
    slug: 'engineering-team',
    name: 'Engineering Team'
  }
});

console.log(`Created: ${team.slug}`);
console.log(`Team ID: ${team.id}`);
```

### アトリビューション付きチーム作成

```typescript
const team = await vercel.teams.createTeam({
  requestBody: {
    slug: 'marketing-team',
    name: 'Marketing Team',
    attribution: {
      sessionReferrer: 'https://google.com',
      landingPage: '/pricing',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'team-signup'
    }
  }
});

console.log(`Team created with attribution tracking`);
```

### エラーハンドリング付き作成

```typescript
async function createTeamSafely(slug: string, name?: string) {
  try {
    const team = await vercel.teams.createTeam({
      requestBody: {
        slug,
        name
      }
    });

    console.log(`✅ Team created successfully`);
    console.log(`  ID: ${team.id}`);
    console.log(`  Slug: ${team.slug}`);
    console.log(`  URL: https://vercel.com/${team.slug}`);

    return team;
  } catch (error) {
    if (error.statusCode === 400) {
      console.error(`❌ Invalid slug or slug already in use: ${slug}`);
    } else if (error.statusCode === 401) {
      console.error('❌ Authentication failed');
    } else {
      console.error(`❌ Failed to create team: ${error.message}`);
    }
    throw error;
  }
}

await createTeamSafely('my-new-team', 'My New Team');
```

### チーム作成後の初期設定

```typescript
async function createAndConfigureTeam(slug: string, name: string) {
  // 1. チーム作成
  const team = await vercel.teams.createTeam({
    requestBody: { slug, name }
  });

  console.log(`Team created: ${team.id}`);

  // 2. チーム設定を更新
  await vercel.teams.patchTeam({
    teamId: team.id,
    requestBody: {
      description: 'A new team for our projects',
      enablePreviewFeedback: 'on',
      remoteCaching: {
        enabled: true
      }
    }
  });

  console.log('Team settings configured');

  // 3. メンバーを招待
  await vercel.teams.inviteUserToTeam({
    teamId: team.id,
    requestBody: {
      email: 'member@example.com',
      role: 'DEVELOPER'
    }
  });

  console.log('Initial member invited');

  return team;
}

await createAndConfigureTeam('awesome-team', 'Awesome Team');
```

## スラッグの制限事項

- **長さ**: 最大48文字
- **文字**: 小文字の英数字とハイフン（`-`）のみ
- **開始/終了**: ハイフンで開始または終了できません
- **一意性**: すべてのVercelアカウントで一意である必要があります

## 名前とスラッグの違い

- **slug**: URLで使用される一意の識別子（`vercel.com/{slug}`）
- **name**: 表示用の人間が読める名前（省略時はslugから自動生成）

例：
```typescript
{
  slug: 'acme-corp',      // URL: vercel.com/acme-corp
  name: 'ACME Corporation' // 表示名: ACME Corporation
}
```

## アトリビューションフィールド

チーム作成の経路を追跡するための情報：

- **sessionReferrer**: セッションのリファラーURL
- **landingPage**: 最初にアクセスしたページ
- **pageBeforeConversionPage**: コンバージョン直前のページ
- **utm系**: UTMパラメータによるマーケティング追跡

## 作成後の推奨アクション

1. チーム設定の構成
2. メンバーの招待
3. プロジェクトの作成または移行
4. 課金設定の確認
5. SAML SSOの設定（必要な場合）

## 関連リンク

- [Update a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/update-a-team.md)
- [Invite a User](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/invite-a-user.md)
- [List All Teams](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-all-teams.md)
- [Delete a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/delete-a-team.md)
