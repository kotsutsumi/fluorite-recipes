# Firebase Auth

Firebase AuthはSupabaseプロジェクトと連携して、サードパーティ認証プロバイダーとして、またはスタンドアロンで使用できます。

## 目次

- [はじめに](#はじめに)
- [セットアップ手順](#セットアップ手順)
- [Supabaseクライアントのセットアップ](#supabaseクライアントのセットアップ)
- [カスタムクレームの設定](#カスタムクレームの設定)
- [RLSポリシーの実装](#rlsポリシーの実装)
- [セキュリティに関する注意点](#セキュリティに関する注意点)

## はじめに

Firebase Authを使用している既存のアプリケーションをSupabaseに移行する場合、または両方を併用する場合、このガイドに従ってください。

### 前提条件

- Supabaseプロジェクト
- Firebase プロジェクト
- Firebase Admin SDK（カスタムクレーム設定用）

## セットアップ手順

### 1. SupabaseプロジェクトとFirebaseプロジェクトを接続

#### Supabaseダッシュボードでの設定

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトの「Authentication」→「Third-party Auth」を選択
3. 「Add Integration」をクリック
4. 「Firebase」を選択

#### 必要な情報

Firebase ConsoleからプロジェクトIDを取得：

```
プロジェクトID: your-firebase-project-id
```

### 2. サードパーティ認証の統合を追加

プロジェクトの認証設定で、サードパーティ認証の統合を追加します。

#### CLIを使用する場合

`supabase/config.toml`ファイルに以下を追加：

```toml
[auth.third_party.firebase]
enabled = true
project_id = "your-firebase-project-id"
```

### 3. セルフホスティング時のRLSポリシー設定

セルフホスティング時は、不正アクセスを防ぐため、すべてのテーブル、ストレージ、リアルタイムチャネルに制限付きのRLSポリシーを作成します。

```sql
-- RLSを有効化
ALTER TABLE public.your_table ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーのみアクセス可能
CREATE POLICY "Authenticated users only"
ON public.your_table
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated');
```

### 4. カスタムユーザークレームの割り当て

すべてのユーザーに`role: 'authenticated'`のカスタムユーザークレームを割り当てます。

## Supabaseクライアントのセットアップ

### Web (JavaScript/TypeScript)

Firebase Authを使用してSupabaseクライアントを作成：

```typescript
import { createClient } from '@supabase/supabase-js'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebaseの初期化
const firebaseApp = initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-firebase-project-id",
})

const firebaseAuth = getAuth(firebaseApp)

// Supabaseクライアントの作成
const supabase = createClient(
  'https://<supabase-project>.supabase.co',
  'SUPABASE_PUBLISHABLE_KEY',
  {
    accessToken: async () => {
      const user = firebaseAuth.currentUser
      if (!user) return null

      // forceRefresh = false で既存のトークンを使用
      const token = await user.getIdToken(/* forceRefresh */ false)
      return token
    },
  }
)
```

### React での使用例

```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './firebase'

export function useSupabase() {
  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      const client = createClient(
        process.env.REACT_APP_SUPABASE_URL!,
        process.env.REACT_APP_SUPABASE_ANON_KEY!,
        {
          accessToken: async () => {
            if (!user) return null
            return await user.getIdToken(false)
          },
        }
      )
      setSupabase(client)
    })

    return () => unsubscribe()
  }, [])

  return supabase
}
```

### Next.js での使用例

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from './firebase'

export async function getSupabaseClient() {
  const auth = getAuth(firebaseApp)

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        const user = auth.currentUser
        if (!user) return null
        return await user.getIdToken(false)
      },
    }
  )
}

// コンポーネントでの使用
export default function UserProfile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single()

      if (data) setProfile(data)
    }

    loadProfile()
  }, [])

  return <div>{/* プロフィール表示 */}</div>
}
```

## カスタムクレームの設定

Firebase Admin SDKを使用して、ユーザーにカスタムクレームを設定します。

### Node.js (Firebase Cloud Functions)

```javascript
const admin = require('firebase-admin')
admin.initializeApp()

// ユーザー作成時にカスタムクレームを設定
exports.setUserRole = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'authenticated',
      user_id: user.uid,
      email: user.email,
    })

    console.log(`Custom claims set for user ${user.uid}`)
  } catch (error) {
    console.error('Error setting custom claims:', error)
  }
})

// 既存ユーザーにカスタムクレームを一括設定
async function setClaimsForAllUsers() {
  const listUsers = await admin.auth().listUsers()

  for (const user of listUsers.users) {
    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'authenticated',
      user_id: user.uid,
      email: user.email,
    })
  }

  console.log('Custom claims set for all users')
}
```

### カスタムクレームの検証

クライアント側でカスタムクレームを確認：

```javascript
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const user = auth.currentUser

if (user) {
  const idTokenResult = await user.getIdTokenResult()
  console.log('Custom claims:', idTokenResult.claims)
  // { role: 'authenticated', user_id: '...', email: '...' }
}
```

## RLSポリシーの実装

Firebase AuthのJWTクレームを使用してRow Level Securityポリシーを実装します。

### ユーザーIDベースのアクセス制御

```sql
-- ユーザーが自分のデータのみアクセス
CREATE POLICY "Users can access own data"
ON public.user_profiles
FOR ALL
USING (
  auth.jwt() ->> 'user_id' = user_id
  -- または auth.jwt() ->> 'sub' = user_id
);
```

### 認証済みユーザーのみ読み取り可能

```sql
CREATE POLICY "Authenticated users can read"
ON public.posts
FOR SELECT
USING (auth.jwt() ->> 'role' = 'authenticated');
```

### メールドメインベースの制御

```sql
-- 特定のドメインのユーザーのみアクセス可能
CREATE POLICY "Company emails only"
ON public.internal_docs
FOR ALL
USING (
  auth.jwt() ->> 'email' LIKE '%@company.com'
);
```

### カスタムクレームを使用した高度な制御

```sql
-- 管理者のみ編集可能
CREATE POLICY "Admins can update"
ON public.settings
FOR UPDATE
USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- チームメンバーのみアクセス可能
CREATE POLICY "Team members only"
ON public.team_documents
FOR ALL
USING (
  auth.jwt() ->> 'team_id' = team_id
);
```

## セキュリティに関する注意点

### 1. プロジェクトIDの検証（セルフホスティング時）

セルフホスティング時は、異なるFirebaseプロジェクトからのJWTによる不正アクセスを防ぐため、厳格なRLSポリシーを設定してください。

```sql
-- Firebaseプロジェクトの検証
CREATE OR REPLACE FUNCTION verify_firebase_project()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'aud' = 'your-firebase-project-id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ポリシーで使用
CREATE POLICY "Verify Firebase project"
ON public.sensitive_data
FOR ALL
USING (verify_firebase_project());
```

### 2. トークンの有効期限管理

```typescript
// トークンを定期的に更新
const getValidToken = async () => {
  const user = firebaseAuth.currentUser
  if (!user) return null

  // 有効期限が近い場合は強制更新
  const idTokenResult = await user.getIdTokenResult()
  const expirationTime = new Date(idTokenResult.expirationTime).getTime()
  const now = new Date().getTime()

  // 5分以内に期限切れの場合は更新
  if (expirationTime - now < 5 * 60 * 1000) {
    return await user.getIdToken(true) // 強制更新
  }

  return idTokenResult.token
}
```

### 3. 環境変数の保護

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# サーバーサイドのみで使用
FIREBASE_ADMIN_SDK_KEY=your_admin_sdk_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## データ同期

Firebase AuthのユーザーデータをSupabaseに同期する例：

```javascript
// Cloud Function: ユーザー作成時に同期
exports.syncUserToSupabase = functions.auth.user().onCreate(async (user) => {
  const { createClient } = require('@supabase/supabase-js')

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: user.uid,
      email: user.email,
      display_name: user.displayName,
      photo_url: user.photoURL,
      created_at: new Date(user.metadata.creationTime).toISOString(),
    })

  if (error) {
    console.error('Error syncing user:', error)
  }
})

// Cloud Function: ユーザー削除時に同期
exports.deleteUserFromSupabase = functions.auth.user().onDelete(async (user) => {
  const { createClient } = require('@supabase/supabase-js')

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  await supabase
    .from('user_profiles')
    .delete()
    .eq('user_id', user.uid)
})
```

## トラブルシューティング

### トークンが検証されない

**確認事項**：
- FirebaseプロジェクトIDが正しく設定されているか
- カスタムクレームが正しく設定されているか
- トークンの有効期限が切れていないか

```javascript
// デバッグ用：トークンの内容を確認
const user = firebaseAuth.currentUser
const idTokenResult = await user.getIdTokenResult()
console.log('Token claims:', idTokenResult.claims)
```

### RLSポリシーが機能しない

```sql
-- JWTの内容を確認
SELECT auth.jwt();

-- 特定のクレームを確認
SELECT auth.jwt() ->> 'role';
SELECT auth.jwt() ->> 'user_id';
```

## ベストプラクティス

1. **カスタムクレームの最小化**: 必要最小限のクレームのみ含める
2. **トークンのキャッシュ**: 頻繁なトークン更新を避ける
3. **エラーハンドリング**: 認証エラーを適切に処理する
4. **セキュアな通信**: 常にHTTPSを使用する
5. **ログとモニタリング**: 認証関連のイベントをログに記録

## 関連リンク

- [Firebase Authentication公式ドキュメント](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [サードパーティ認証概要](/docs/services/supabase/docs/guides/auth/third-party/overview.md)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
