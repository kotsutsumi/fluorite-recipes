# Clerk

ClerkはSupabaseの認証プロバイダとして、Supabase Authと併用、またはスタンドアロンで利用できます。

## 目次

- [はじめに](#はじめに)
- [セットアップ方法](#セットアップ方法)
- [ローカル開発と自己ホスティング](#ローカル開発と自己ホスティング)
- [Clerkインスタンスの手動設定](#clerkインスタンスの手動設定)
- [Supabaseクライアントのセットアップ](#supabaseクライアントのセットアップ)
- [RLSポリシーの使用](#rlsポリシーの使用)

## はじめに

Clerkを使用してSupabaseプロジェクトにアクセスするには、以下の手順に従います。

### 前提条件

- Supabaseプロジェクト
- Clerkアカウント

## セットアップ方法

### 1. Clerkの統合ページで設定

1. [ClerkのSupabase連携ページ](https://dashboard.clerk.com/setup/supabase)にアクセス
2. 画面の指示に従って設定を完了

### 2. Supabaseダッシュボードで統合を追加

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトの「Authentication」→「Third-party Auth」を選択
3. 「Add Integration」をクリック
4. 「Clerk」を選択
5. Clerkから提供された情報を入力

## ローカル開発と自己ホスティング

ローカル開発環境や自己ホスティング環境でClerkを使用する場合は、`supabase/config.toml`ファイルに以下の設定を追加します。

```toml
[auth.third_party.clerk]
enabled = true
domain = "example.clerk.accounts.dev"
```

### 設定値の説明

- `enabled`: Clerk統合を有効化
- `domain`: ClerkのドメインURL（Clerkダッシュボードから取得）

## Clerkインスタンスの手動設定

Clerkを手動で設定する場合は、以下の手順に従います。

### 1. Clerkセッショントークンに`role`クレームを追加

Clerkダッシュボードで：

1. 「JWT Templates」に移動
2. 新しいテンプレートを作成または既存のテンプレートを編集
3. 以下のクレームを追加：

```json
{
  "role": "authenticated"
}
```

### 2. カスタムクレームの設定（オプション）

より詳細なアクセス制御が必要な場合：

```json
{
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "org_id": "{{user.organization_id}}",
  "org_role": "{{user.organization_role}}"
}
```

### 3. Supabaseダッシュボードで連携を登録

1. Supabaseダッシュボードの「Authentication」→「Third-party Auth」
2. ClerkのJWKS URL、Issuer URLを入力

## Supabaseクライアントのセットアップ

### TypeScript / JavaScript

```typescript
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/nextjs'

export function useSupabaseClient() {
  const { session } = useSession()

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${session?.getToken()}`,
        },
      },
      auth: {
        persistSession: false,
      },
      accessToken: async () => {
        return (await session?.getToken()) ?? null
      },
    }
  )

  return supabaseClient
}
```

### Next.js App Routerでの使用例

```typescript
'use client'

import { useSupabaseClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function UserData() {
  const supabase = useSupabaseClient()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        console.error('Error:', error)
      } else {
        setData(data)
      }
    }

    loadData()
  }, [supabase])

  return (
    <div>
      {/* データの表示 */}
    </div>
  )
}
```

### React (Vite/CRA)

```typescript
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/clerk-react'

export function useSupabase() {
  const { session } = useSession()

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => {
        const token = await session?.getToken()
        return token ?? null
      },
    }
  )

  return supabase
}
```

## RLSポリシーの使用

Clerkセッショントークンのクレームを利用して、データベースやストレージ、リアルタイムチャネルへのアクセスを制御できます。

### ユーザーIDベースのポリシー

```sql
-- ユーザーが自分のデータのみアクセスできる
CREATE POLICY "Users can access own data"
ON public.user_profiles
FOR ALL
USING (auth.jwt() ->> 'sub' = user_id);
```

### 認証済みユーザーのみアクセス可能

```sql
-- 認証済みユーザーのみ読み取り可能
CREATE POLICY "Authenticated users can read"
ON public.posts
FOR SELECT
USING (auth.jwt() ->> 'role' = 'authenticated');
```

### 組織ロールベースのアクセス制御

Clerkの組織機能を使用している場合：

```sql
-- 組織メンバーのみアクセス可能
CREATE POLICY "Organization members only"
ON public.projects
FOR ALL
USING (
  auth.jwt() ->> 'org_id' = organization_id
);

-- 組織の管理者のみ編集可能
CREATE POLICY "Organization admins can update"
ON public.projects
FOR UPDATE
USING (
  auth.jwt() ->> 'org_id' = organization_id
  AND auth.jwt() ->> 'org_role' = 'admin'
);
```

### メールドメインベースの制御

```sql
-- 特定のドメインのユーザーのみアクセス可能
CREATE POLICY "Company domain only"
ON public.internal_documents
FOR ALL
USING (
  auth.jwt() ->> 'email' LIKE '%@company.com'
);
```

## 高度な使用例

### ストレージバケットへのアクセス制御

```sql
-- ユーザーが自分のフォルダーのみアクセス可能
CREATE POLICY "Users can access own folder"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);
```

### リアルタイムチャネルの制限

```typescript
// 組織メンバーのみチャネルに参加可能
const channel = supabase
  .channel('org-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `org_id=eq.${session.organizationId}`,
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### Clerk Webhookとの統合

Clerkのwebhookを使用してSupabaseのデータを同期：

```typescript
// API Route: /api/webhooks/clerk
import { Webhook } from 'svix'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  const evt = wh.verify(payload, headers)

  // ユーザー作成時にSupabaseにプロフィールを作成
  if (evt.type === 'user.created') {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from('user_profiles').insert({
      user_id: evt.data.id,
      email: evt.data.email_addresses[0].email_address,
      full_name: `${evt.data.first_name} ${evt.data.last_name}`,
    })
  }

  return new Response('OK', { status: 200 })
}
```

## トラブルシューティング

### トークンが取得できない

**問題**: `session?.getToken()`が`null`を返す

**解決策**:
- ユーザーがログインしているか確認
- ClerkのJWTテンプレートが正しく設定されているか確認
- セッションが有効期限内か確認

### RLSポリシーが機能しない

**問題**: データベースクエリが失敗する

**解決策**:
```sql
-- JWTクレームを確認
SELECT auth.jwt();

-- ポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- RLSが有効化されているか確認
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### CORSエラー

**問題**: ブラウザでCORSエラーが発生

**解決策**:
- Supabaseダッシュボードの「Authentication」→「URL Configuration」で許可されたオリジンを確認
- アプリケーションのURLが追加されているか確認

## セキュリティのベストプラクティス

1. **環境変数の保護**: APIキーを環境変数に保存し、コミットしない
2. **RLSの有効化**: すべてのテーブルでRow Level Securityを有効化
3. **最小権限の原則**: 必要最小限のアクセス権限のみ付与
4. **トークンの有効期限**: 短い有効期限を設定し、定期的に更新
5. **監査ログ**: データベースアクセスを記録して監視

```sql
-- 監査ログテーブルの作成
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  action TEXT,
  table_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- トリガーで自動記録
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name)
  VALUES (auth.jwt() ->> 'sub', TG_OP, TG_TABLE_NAME);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 関連リンク

- [Clerk公式ドキュメント](https://clerk.com/docs)
- [Supabase認証ドキュメント](https://supabase.com/docs/guides/auth)
- [サードパーティ認証概要](/docs/services/supabase/docs/guides/auth/third-party/overview.md)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
