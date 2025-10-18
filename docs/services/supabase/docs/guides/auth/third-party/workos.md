# WorkOS

WorkOSは、Supabase Authと連携して、またはスタンドアロンで、サードパーティ認証プロバイダーとして使用できます。

## 目次

- [はじめに](#はじめに)
- [セットアップ手順](#セットアップ手順)
- [JWTテンプレートの設定](#jwtテンプレートの設定)
- [Supabaseクライアントのセットアップ](#supabaseクライアントのセットアップ)
- [RLSポリシーの実装](#rlsポリシーの実装)
- [エンタープライズ機能](#エンタープライズ機能)

## はじめに

WorkOSは、B2B SaaSアプリケーション向けのエンタープライズ対応認証プロバイダーです。SAML SSO、ディレクトリ同期、監査ログなどの機能を提供します。

### 前提条件

- Supabaseプロジェクト
- WorkOSアカウント
- WorkOSクライアントID

### WorkOSの主な機能

- **SSO (Single Sign-On)**: SAML、OAuth 2.0、OpenID Connect
- **ディレクトリ同期**: Azure AD、Google Workspace、Oktaなど
- **監査ログ**: コンプライアンス対応のログ記録
- **マルチテナント**: 組織ごとの認証設定

## セットアップ手順

### 1. SupabaseプロジェクトとWorkOSテナントを接続

#### WorkOS発行者URLの取得

WorkOSの発行者（Issuer）URLは以下の形式です：

```
https://api.workos.com/user_management/<your-client-id>
```

カスタム認証ドメインを設定している場合は、`api.workos.com`を置き換えてください。

#### Supabaseダッシュボードでの設定

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトの「Authentication」→「Third-party Auth」を選択
3. 「Add Integration」をクリック
4. 「WorkOS」を選択
5. WorkOSの発行者URLを入力

### 2. プロジェクトの認証設定で統合を追加

#### CLIを使用する場合

`supabase/config.toml`ファイルに以下の設定を追加：

```toml
[auth.third_party.workos]
enabled = true
issuer = "https://api.workos.com/user_management/<your-client-id>"
```

カスタムドメインを使用している場合：

```toml
[auth.third_party.workos]
enabled = true
issuer = "https://auth.yourcompany.com/user_management/<your-client-id>"
```

### 3. JWTテンプレートの設定

アクセストークンに`role: 'authenticated'`クレームを割り当てるJWTテンプレートを設定します。

## JWTテンプレートの設定

### 認証済みロールの追加

Supabaseプロジェクトは、Data API、ストレージ、またはRealtime認証を使用する際に、JWTに含まれる`role`クレームを検査してPostgresロールを割り当てます。

WorkOS JWTには、ユーザーの組織内のロールに対応する`role`クレームが含まれていますが、Supabaseが期待する形式とは異なります。

#### WorkOSダッシュボードでの設定

1. [WorkOSダッシュボード](https://dashboard.workos.com/)にログイン
2. 「User Management」→「JWT Configuration」を選択
3. カスタムクレームを追加

#### JWT テンプレートの例

```json
{
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "email": "{{user.email}}",
  "org_id": "{{user.organization_id}}",
  "org_role": "{{user.role}}"
}
```

#### 組織ロールベースのクレーム

```json
{
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "email": "{{user.email}}",
  "org_id": "{{user.organization_id}}",
  "org_role": "{{user.role}}",
  "is_admin": "{{user.role == 'admin'}}",
  "permissions": "{{user.permissions}}"
}
```

## Supabaseクライアントのセットアップ

### TypeScript / JavaScript

```typescript
import { createClient } from '@supabase/supabase-js'
import { WorkOS } from '@workos-inc/node'

// WorkOSクライアントの初期化
const workos = new WorkOS(process.env.WORKOS_API_KEY!)

// Supabaseクライアントの作成
export function getSupabaseClient(sessionId: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        try {
          // WorkOSセッションからアクセストークンを取得
          const session = await workos.userManagement.authenticateWithCode({
            clientId: process.env.WORKOS_CLIENT_ID!,
            code: sessionId,
          })

          return session.accessToken
        } catch (error) {
          console.error('Error getting WorkOS token:', error)
          return null
        }
      },
    }
  )
}
```

### Next.js App Routerでの使用例

```typescript
// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('/login?error=missing_code')
  }

  try {
    const { user, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID!,
        code,
      })

    // セッションにトークンを保存
    const response = NextResponse.redirect('/dashboard')
    response.cookies.set('workos_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1時間
    })

    if (refreshToken) {
      response.cookies.set('workos_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30日
      })
    }

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect('/login?error=auth_failed')
  }
}

// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getSupabaseServerClient() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('workos_access_token')?.value

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`,
        } : {},
      },
    }
  )
}

// app/dashboard/page.tsx
import { getSupabaseServerClient } from '@/lib/supabase-server'

export default async function Dashboard() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .single()

  if (error) {
    return <div>Error loading profile</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### React (クライアントサイド)

```typescript
// hooks/useSupabase.ts
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useSupabase() {
  const [supabase, setSupabase] = useState(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // WorkOSトークンをlocalStorageまたはクッキーから取得
    const token = localStorage.getItem('workos_access_token')
    setAccessToken(token)

    if (token) {
      const client = createClient(
        process.env.REACT_APP_SUPABASE_URL!,
        process.env.REACT_APP_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      )
      setSupabase(client)
    }
  }, [accessToken])

  return supabase
}

// components/Profile.tsx
export function Profile() {
  const supabase = useSupabase()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!supabase) return

    async function loadProfile() {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single()

      if (data) setProfile(data)
    }

    loadProfile()
  }, [supabase])

  return <div>{/* プロフィール表示 */}</div>
}
```

## RLSポリシーの実装

### 基本的なアクセス制御

```sql
-- 認証済みユーザーのみアクセス可能
CREATE POLICY "Authenticated users only"
ON public.posts
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated');

-- ユーザーが自分のデータのみアクセス
CREATE POLICY "Users can access own data"
ON public.user_profiles
FOR ALL
USING (auth.jwt() ->> 'user_id' = user_id);
```

### 組織ベースのアクセス制御

```sql
-- 同じ組織のメンバーのみアクセス可能
CREATE POLICY "Organization members only"
ON public.projects
FOR ALL
USING (auth.jwt() ->> 'org_id' = organization_id);

-- 組織の管理者のみ編集可能
CREATE POLICY "Organization admins can update"
ON public.projects
FOR UPDATE
USING (
  auth.jwt() ->> 'org_id' = organization_id
  AND auth.jwt() ->> 'org_role' = 'admin'
);
```

### 権限ベースのアクセス制御

```sql
-- 特定の権限を持つユーザーのみアクセス可能
CREATE POLICY "Users with edit permission"
ON public.documents
FOR UPDATE
USING (
  (auth.jwt() -> 'permissions')::jsonb ? 'documents:edit'
);

-- 複数の権限をチェック
CREATE POLICY "Users with required permissions"
ON public.sensitive_data
FOR ALL
USING (
  (auth.jwt() -> 'permissions')::jsonb ?& array['data:read', 'data:write']
);
```

### 管理者専用アクセス

```sql
-- 管理者のみアクセス可能
CREATE POLICY "Admins only"
ON public.admin_settings
FOR ALL
USING (
  auth.jwt() ->> 'org_role' = 'admin'
  OR (auth.jwt() ->> 'is_admin')::boolean = true
);
```

## エンタープライズ機能

### SSO (Single Sign-On)

WorkOSのSSO機能を使用して、エンタープライズ顧客向けのSAML SSOを実装：

```typescript
// SSO認証の開始
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

export async function initiateSSOLogin(organizationId: string) {
  const authorizationUrl = workos.sso.getAuthorizationURL({
    clientId: process.env.WORKOS_CLIENT_ID!,
    redirectUri: 'https://yourapp.com/auth/callback',
    organization: organizationId,
  })

  return authorizationUrl
}

// SSOコールバックの処理
export async function handleSSOCallback(code: string) {
  const profile = await workos.sso.getProfileAndToken({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code,
  })

  // Supabaseにユーザー情報を同期
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('user_profiles')
    .upsert({
      user_id: profile.profile.id,
      email: profile.profile.email,
      first_name: profile.profile.firstName,
      last_name: profile.profile.lastName,
      organization_id: profile.profile.organizationId,
    })

  return profile
}
```

### ディレクトリ同期

Azure AD、Google Workspace、Oktaなどからユーザーとグループを自動同期：

```typescript
// Webhookハンドラーの実装
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

export async function handleDirectorySyncWebhook(payload: any) {
  const event = await workos.webhooks.constructEvent({
    payload,
    sigHeader: request.headers['workos-signature'],
    secret: process.env.WORKOS_WEBHOOK_SECRET!,
  })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.event) {
    case 'dsync.user.created':
      await supabase.from('user_profiles').insert({
        user_id: event.data.id,
        email: event.data.emails[0]?.value,
        directory_id: event.data.directoryId,
      })
      break

    case 'dsync.user.updated':
      await supabase.from('user_profiles').update({
        email: event.data.emails[0]?.value,
      }).eq('user_id', event.data.id)
      break

    case 'dsync.user.deleted':
      await supabase.from('user_profiles').delete().eq('user_id', event.data.id)
      break

    case 'dsync.group.created':
      await supabase.from('groups').insert({
        group_id: event.data.id,
        name: event.data.name,
        directory_id: event.data.directoryId,
      })
      break
  }
}
```

### 監査ログ

WorkOSの監査ログを使用してコンプライアンス対応のログ記録を実装：

```typescript
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

// 監査イベントの記録
export async function logAuditEvent(event: {
  action: string
  actorId: string
  targetId?: string
  metadata?: Record<string, any>
}) {
  await workos.auditLogs.createEvent({
    organizationId: process.env.WORKOS_ORGANIZATION_ID!,
    event: {
      action: event.action,
      occurredAt: new Date().toISOString(),
      actor: {
        id: event.actorId,
        type: 'user',
      },
      targets: event.targetId ? [{
        id: event.targetId,
        type: 'document',
      }] : [],
      context: {
        location: '0.0.0.0',
        userAgent: 'Mozilla/5.0...',
      },
      metadata: event.metadata,
    },
  })
}

// データベース操作の監査
async function updateDocument(documentId: string, userId: string, changes: any) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('documents')
    .update(changes)
    .eq('id', documentId)

  if (!error) {
    await logAuditEvent({
      action: 'document.updated',
      actorId: userId,
      targetId: documentId,
      metadata: { changes },
    })
  }

  return { data, error }
}
```

## トラブルシューティング

### JWTにロールクレームが含まれない

**確認事項**:
1. WorkOSのJWTテンプレートが正しく設定されているか
2. カスタムクレームが正しく定義されているか

```typescript
// トークンの内容を確認
const token = 'your-workos-token'
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log('Token claims:', decoded)
```

### アクセストークンの更新

```typescript
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

async function refreshAccessToken(refreshToken: string) {
  const { accessToken, refreshToken: newRefreshToken } =
    await workos.userManagement.authenticateWithRefreshToken({
      clientId: process.env.WORKOS_CLIENT_ID!,
      refreshToken,
    })

  return { accessToken, refreshToken: newRefreshToken }
}
```

## セキュリティのベストプラクティス

1. **環境変数の保護**: すべてのシークレットを安全に管理
2. **Webhookの検証**: WorkOS Webhookの署名を検証
3. **RLSの有効化**: すべてのテーブルでRow Level Securityを有効化
4. **監査ログの記録**: すべての重要な操作を記録
5. **最小権限の原則**: 必要最小限の権限のみ付与

```typescript
// Webhook署名の検証
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY!)

export async function verifyWebhook(payload: string, signature: string) {
  try {
    const event = await workos.webhooks.constructEvent({
      payload,
      sigHeader: signature,
      secret: process.env.WORKOS_WEBHOOK_SECRET!,
    })
    return event
  } catch (error) {
    console.error('Webhook verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}
```

## 関連リンク

- [WorkOS公式ドキュメント](https://workos.com/docs)
- [WorkOS User Management](https://workos.com/docs/user-management)
- [サードパーティ認証概要](/docs/services/supabase/docs/guides/auth/third-party/overview.md)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
