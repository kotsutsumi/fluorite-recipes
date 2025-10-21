# Vercel SDK - チーム管理

プログラムでチームメンバーシップを管理する方法を説明します。

## 📚 目次

- [概要](#概要)
- [チームメンバーの招待](#チームメンバーの招待)
- [実装例](#実装例)

## 概要

Vercel SDKを使用してチームメンバーシップをプログラムで管理する方法を紹介します。

## チームメンバーの招待

### 目的

指定されたロールで新しいユーザーをチームに追加します。

### プロセスフロー

```typescript
interface InvitationProcess {
  step1: "アカウントに関連付けられているすべてのチームを取得";
  step2: "スラッグ識別子でターゲットチームを検索";
  step3: "ユーザーメールとロール指定で招待を実行";
  step4: "招待ステータスの確認を受信";
}
```

### 基本的な実装

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function inviteTeamMember(
  teamSlug: string,
  email: string,
  role: "MEMBER" | "OWNER" | "VIEWER" = "MEMBER"
) {
  try {
    // 1. 利用可能なすべてのチームを取得
    const teams = await vercel.teams.getTeams();

    // 2. スラッグでターゲットチームを特定
    const targetTeam = teams.teams?.find(team => team.slug === teamSlug);

    if (!targetTeam) {
      throw new Error(`Team with slug "${teamSlug}" not found`);
    }

    // 3. チームIDと招待詳細で招待を実行
    const invitation = await vercel.teams.inviteUserToTeam({
      teamId: targetTeam.id,
      requestBody: {
        email,
        role
      }
    });

    // 4. 確認を受信
    console.log('Invitation sent successfully:');
    console.log(`- Email: ${invitation.email}`);
    console.log(`- Role: ${invitation.role}`);
    console.log(`- Username: ${invitation.username || 'Pending'}`);

    return invitation;
  } catch (error) {
    console.error('Failed to invite team member:', error);
    throw error;
  }
}

// 使用例
await inviteTeamMember(
  "my-team",
  "newmember@example.com",
  "MEMBER"
);
```

## 招待パラメータ

### ロールタイプ

```typescript
type TeamRole = "OWNER" | "MEMBER" | "VIEWER";

interface RolePermissions {
  OWNER: {
    description: "すべての管理権限";
    permissions: [
      "プロジェクト管理",
      "チーム設定",
      "メンバー管理",
      "課金管理",
      "すべてのプロジェクトへのアクセス"
    ];
  };
  MEMBER: {
    description: "標準的な開発者権限";
    permissions: [
      "プロジェクトデプロイ",
      "環境変数管理",
      "ログ閲覧",
      "割り当てられたプロジェクトへのアクセス"
    ];
  };
  VIEWER: {
    description: "読み取り専用アクセス";
    permissions: [
      "プロジェクト閲覧",
      "デプロイメント閲覧",
      "ログ閲覧"
    ];
  };
}
```

### 招待パラメータの詳細

```typescript
interface InvitationParameters {
  email: string;           // ターゲットユーザーのメールアドレス
  role: TeamRole;          // 割り当てる権限レベル
}
```

## レスポンス情報

### 成功時のレスポンス

```typescript
interface InvitationResponse {
  email: string;           // 招待されたメールアドレス
  role: TeamRole;          // 割り当てられたロール
  username?: string;       // ユーザー名（既存ユーザーの場合）
  uid: string;             // 招待の一意識別子
  createdAt: number;       // 招待作成のタイムスタンプ
}
```

招待が成功すると、システムは割り当てられたロールと招待されたユーザーのユーザー名を含む確認データを返します。これは検証のためにログに記録できます。

## 高度な使用例

### 複数メンバーの招待

```typescript
interface TeamInvitation {
  email: string;
  role: TeamRole;
}

async function inviteMultipleMembers(
  teamSlug: string,
  invitations: TeamInvitation[]
) {
  const teams = await vercel.teams.getTeams();
  const targetTeam = teams.teams?.find(team => team.slug === teamSlug);

  if (!targetTeam) {
    throw new Error(`Team "${teamSlug}" not found`);
  }

  const results = [];

  for (const invitation of invitations) {
    try {
      const result = await vercel.teams.inviteUserToTeam({
        teamId: targetTeam.id,
        requestBody: invitation
      });

      results.push({ email: invitation.email, status: 'success', data: result });
      console.log(`✓ Invited ${invitation.email} as ${invitation.role}`);

      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({ email: invitation.email, status: 'failed', error });
      console.error(`✗ Failed to invite ${invitation.email}:`, error);
    }
  }

  return results;
}

// 使用例
await inviteMultipleMembers("my-team", [
  { email: "dev1@example.com", role: "MEMBER" },
  { email: "dev2@example.com", role: "MEMBER" },
  { email: "manager@example.com", role: "OWNER" },
  { email: "viewer@example.com", role: "VIEWER" }
]);
```

### チームメンバーのリスト取得

```typescript
async function listTeamMembers(teamSlug: string) {
  const teams = await vercel.teams.getTeams();
  const targetTeam = teams.teams?.find(team => team.slug === teamSlug);

  if (!targetTeam) {
    throw new Error(`Team "${teamSlug}" not found`);
  }

  const members = await vercel.teams.getTeamMembers({
    teamId: targetTeam.id
  });

  console.log(`Team members for ${teamSlug}:`);
  members.forEach(member => {
    console.log(`- ${member.email} (${member.role})`);
  });

  return members;
}
```

### チームメンバーの削除

```typescript
async function removeTeamMember(teamSlug: string, userId: string) {
  const teams = await vercel.teams.getTeams();
  const targetTeam = teams.teams?.find(team => team.slug === teamSlug);

  if (!targetTeam) {
    throw new Error(`Team "${teamSlug}" not found`);
  }

  await vercel.teams.removeTeamMember({
    teamId: targetTeam.id,
    userId
  });

  console.log(`✓ Removed user ${userId} from team ${teamSlug}`);
}
```

## エラーハンドリング

```typescript
async function safeInviteTeamMember(
  teamSlug: string,
  email: string,
  role: TeamRole
) {
  try {
    return await inviteTeamMember(teamSlug, email, role);
  } catch (error) {
    if (error.code === 'forbidden') {
      console.error('権限エラー: チームメンバーを招待する権限がありません');
    } else if (error.code === 'not_found') {
      console.error('チームが見つかりません');
    } else if (error.code === 'bad_request') {
      console.error('無効なリクエスト: メールアドレスまたはロールを確認してください');
    } else {
      console.error('予期しないエラー:', error);
    }

    throw error;
  }
}
```

## ベストプラクティス

### チーム管理

1. **ロールの適切な割り当て**: 最小権限の原則に従う
2. **招待の確認**: 招待後にステータスを確認
3. **定期的な見直し**: チームメンバーと権限を定期的に確認
4. **監査ログ**: すべてのチーム変更を記録

### セキュリティ

1. **権限管理**: OWNERロールは慎重に割り当てる
2. **メール検証**: 正しいメールアドレスを確認
3. **アクセス制御**: 不要になったメンバーを削除

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/team-management)
