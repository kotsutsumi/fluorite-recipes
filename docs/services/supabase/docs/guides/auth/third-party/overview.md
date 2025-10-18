# サードパーティ認証 - 概要

## 認証プロバイダーへの一級のサポート

Supabaseは、以下のサードパーティ認証プロバイダーに対して一級のサポートを提供しています：

- [Clerk](/docs/services/supabase/docs/guides/auth/third-party/clerk.md)
- [Firebase Auth](/docs/services/supabase/docs/guides/auth/third-party/firebase-auth.md)
- [Auth0](/docs/services/supabase/docs/guides/auth/third-party/auth0.md)
- [AWS Cognito (AWS Amplifyの有無に関わらず)](/docs/services/supabase/docs/guides/auth/third-party/aws-cognito.md)
- [WorkOS](/docs/services/supabase/docs/guides/auth/third-party/workos.md)

これらのプロバイダーを使用して、Supabaseの以下のサービスにアクセスできます：

- [データAPI (REST and GraphQL)](https://supabase.com/docs/guides/database)
- [ストレージ](https://supabase.com/docs/guides/storage)
- [リアルタイム](https://supabase.com/docs/guides/realtime)
- [関数](https://supabase.com/docs/guides/functions)

既存の本番アプリケーションで上記の認証プロバイダーを使用している場合、ユーザーをSupabase Authに移行したり、複雑な回避策を使用したりする必要はありません。

## 仕組み

Supabaseの製品を使用する際、非対称キーで署名されたJWT（JSON Web Token）を使用する必要があります。サードパーティ認証のサポートにより、これらのプロバイダーが発行したJWTをSupabase Authと同様に信頼できます。

### 認証フロー

1. **ユーザー認証**: ユーザーがサードパーティプロバイダー（Clerk、Auth0など）で認証
2. **JWT発行**: プロバイダーが非対称署名されたJWTを発行
3. **Supabaseアクセス**: JWTを使用してSupabaseのサービスにアクセス
4. **検証**: Supabaseがプロバイダーの公開鍵を使用してJWTを検証
5. **アクセス許可**: Row Level Security (RLS) ポリシーに基づいてアクセスを制御

## 制限事項

サードパーティ認証を使用する際、以下の制限があります：

### 1. JWT署名方式

サードパーティプロバイダーは、非対称署名されたJWTを使用する必要があります。サポートされている署名アルゴリズム：

- RS256 (RSA Signature with SHA-256)
- ES256 (ECDSA using P-256 and SHA-256)
- その他の標準的な非対称アルゴリズム

### 2. 公開鍵の管理

JWTの署名キーは、プロジェクトの設定に保存され、定期的に更新される必要があります。

### 3. カスタムクレーム

Supabaseでは、JWTに特定のクレーム（特に`role`クレーム）を含める必要があります。これにより、Row Level Securityポリシーが適切に機能します。

### 4. セッション管理

サードパーティプロバイダーを使用する場合、セッション管理はプロバイダー側で行われます。Supabaseはセッション状態を保持しません。

## 利用シーン

### 既存アプリケーションの移行

既存のアプリケーションで認証プロバイダーを使用している場合：

```typescript
// 既存のAuth0実装
import { useAuth0 } from '@auth0/auth0-react'

// Supabaseクライアントに統合
const { getAccessTokenSilently } = useAuth0()
const supabase = createClient(url, key, {
  accessToken: async () => {
    return await getAccessTokenSilently()
  }
})
```

### エンタープライズ認証

WorkOSやAuth0を使用して、SAML SSO、ディレクトリ同期などのエンタープライズ機能を活用：

```typescript
// WorkOSとSupabaseの統合
const supabase = createClient(url, key, {
  accessToken: async () => {
    return await workos.userManagement.getAccessToken()
  }
})
```

### マルチテナント アプリケーション

異なる組織ごとに異なる認証プロバイダーを使用：

```typescript
// テナントごとのプロバイダー切り替え
const getAccessToken = async (tenantId: string) => {
  const provider = getTenantProvider(tenantId)
  return await provider.getToken()
}

const supabase = createClient(url, key, {
  accessToken: () => getAccessToken(currentTenantId)
})
```

## セキュリティのベストプラクティス

### 1. Row Level Security (RLS) の設定

すべてのテーブルにRLSポリシーを設定して、適切なアクセス制御を実装：

```sql
-- ユーザーが自分のデータのみアクセスできるようにする
CREATE POLICY "Users can only access their own data"
ON public.user_data
FOR ALL
USING (auth.jwt() ->> 'sub' = user_id);
```

### 2. カスタムクレームの検証

JWTに必要なクレームが含まれていることを確認：

```sql
-- roleクレームの検証
CREATE POLICY "Authenticated users only"
ON public.protected_table
FOR ALL
USING (
  auth.jwt() ->> 'role' = 'authenticated'
);
```

### 3. トークンの有効期限管理

短い有効期限のトークンを使用し、自動更新を実装：

```typescript
const supabase = createClient(url, key, {
  accessToken: async () => {
    // トークンを自動更新
    const token = await provider.getToken({ forceRefresh: true })
    return token
  }
})
```

## 実装例

### TypeScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    accessToken: async () => {
      // プロバイダーからアクセストークンを取得
      const token = await authProvider.getAccessToken()
      return token
    }
  }
)

// データベースクエリ
const { data, error } = await supabase
  .from('users')
  .select('*')
```

### React

```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from './auth-provider'

function App() {
  const { getToken } = useAuth()
  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        accessToken: async () => await getToken()
      }
    )
    setSupabase(client)
  }, [getToken])

  return <div>{/* アプリケーション */}</div>
}
```

## RLSポリシーの活用

サードパーティプロバイダーのJWTクレームを使用してアクセス制御：

### ユーザーIDベースの制御

```sql
-- JWTのsubクレームを使用
CREATE POLICY "User can access own data"
ON user_profiles
FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id);
```

### 組織ベースの制御

```sql
-- JWTのorg_idクレームを使用
CREATE POLICY "Organization members only"
ON projects
FOR ALL
USING (auth.jwt() ->> 'org_id' = organization_id);
```

### ロールベースの制御

```sql
-- JWTのroleクレームを使用
CREATE POLICY "Admin only"
ON admin_settings
FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin'
);
```

## トラブルシューティング

### JWTが検証されない

**確認事項**：
- プロバイダーの公開鍵が正しく設定されているか
- JWTの署名アルゴリズムがサポートされているか
- JWTの有効期限が切れていないか

### RLSポリシーが機能しない

**確認事項**：
- JWTに`role`クレームが含まれているか
- ポリシーの条件が正しいか
- テーブルでRLSが有効になっているか

```sql
-- RLSの有効化を確認
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### アクセストークンが取得できない

**確認事項**：
- プロバイダーのSDKが正しく初期化されているか
- ユーザーが認証されているか
- トークンのスコープが適切か

## 次のステップ

各プロバイダーの詳細な統合ガイドを参照してください：

- [Clerk統合ガイド](/docs/services/supabase/docs/guides/auth/third-party/clerk.md)
- [Firebase Auth統合ガイド](/docs/services/supabase/docs/guides/auth/third-party/firebase-auth.md)
- [Auth0統合ガイド](/docs/services/supabase/docs/guides/auth/third-party/auth0.md)
- [AWS Cognito統合ガイド](/docs/services/supabase/docs/guides/auth/third-party/aws-cognito.md)
- [WorkOS統合ガイド](/docs/services/supabase/docs/guides/auth/third-party/workos.md)
