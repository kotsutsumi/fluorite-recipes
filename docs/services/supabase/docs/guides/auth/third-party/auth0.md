# Auth0

Auth0は、Supabase Authと連携して、または単独でSupabaseプロジェクトで認証プロバイダーとして使用できます。

## 目次

- [はじめに](#はじめに)
- [セットアップ手順](#セットアップ手順)
- [Auth0アクションの設定](#auth0アクションの設定)
- [Supabaseクライアントのセットアップ](#supabaseクライアントのセットアップ)
- [RLSポリシーの実装](#rlsポリシーの実装)
- [高度な使用例](#高度な使用例)

## はじめに

Auth0を使用することで、エンタープライズグレードの認証機能をSupabaseプロジェクトに統合できます。

### 前提条件

- Supabaseプロジェクト
- Auth0アカウント
- Auth0テナント

## セットアップ手順

### 1. SupabaseプロジェクトとAuth0テナントを接続

Auth0テナント情報を取得：
- **テナントID**: 例 `your-tenant.auth0.com`
- **リージョンID**: 必要に応じて（例: `us`, `eu`, `au`）

#### Supabaseダッシュボードでの設定

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトの「Authentication」→「Third-party Auth」を選択
3. 「Add Integration」をクリック
4. 「Auth0」を選択
5. テナント情報を入力

### 2. プロジェクトの認証設定で統合を追加

#### ダッシュボードを使用

プロジェクトの[認証設定](/dashboard/project/_/auth/third-party)で、サードパーティ認証の統合を追加します。

#### CLIを使用

`supabase/config.toml`ファイルに以下の設定を追加：

```toml
[auth.third_party.auth0]
enabled = true
tenant = "your-tenant"
tenant_region = "us"  # オプション: us, eu, au など
```

### 3. Auth0アクションを使用してカスタムクレームを設定

すべてのJWTに`role: 'authenticated'`カスタムクレームを割り当てます。

### 4. Supabaseクライアントのセットアップ

アプリケーションでSupabaseクライアントをセットアップします。

## Auth0アクションの設定

### ロールクレームの追加

Supabaseプロジェクトは、Data API、ストレージ、またはRealtime認証を使用する際に、JWTに含まれる`role`クレームを検査して、適切なPostgresロールを割り当てます。

デフォルトでは、Auth0のJWT（アクセストークンとIDトークンの両方）に`role`クレームが含まれていません。

#### Auth0 Actionsでカスタムクレームを追加

1. [Auth0ダッシュボード](https://manage.auth0.com/)にログイン
2. 「Actions」→「Flows」→「Login」を選択
3. 新しいアクションを作成

```javascript
/**
* @param {Event} event - トリガーイベントの詳細
* @param {PostLoginAPI} api - インターフェイス
*/
exports.onExecutePostLogin = async (event, api) => {
  // アクセストークンにroleクレームを追加
  api.accessToken.setCustomClaim('role', 'authenticated')

  // オプション: ユーザー情報を追加
  api.accessToken.setCustomClaim('user_id', event.user.user_id)
  api.accessToken.setCustomClaim('email', event.user.email)

  // IDトークンにも同様のクレームを追加
  api.idToken.setCustomClaim('role', 'authenticated')
  api.idToken.setCustomClaim('user_id', event.user.user_id)
}
```

4. アクションを保存してデプロイ
5. Login Flowにアクションを追加

### 組織ロールベースのクレーム

Auth0 Organizationsを使用している場合：

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // 基本的な認証済みロール
  api.accessToken.setCustomClaim('role', 'authenticated')

  // 組織情報を追加
  if (event.organization) {
    api.accessToken.setCustomClaim('org_id', event.organization.id)
    api.accessToken.setCustomClaim('org_name', event.organization.name)
  }

  // ユーザーのロール情報
  if (event.authorization) {
    const roles = event.authorization.roles || []
    api.accessToken.setCustomClaim('app_roles', roles)

    // 管理者チェック
    if (roles.includes('admin')) {
      api.accessToken.setCustomClaim('is_admin', true)
    }
  }
}
```

## Supabaseクライアントのセットアップ

### TypeScript / JavaScript (React/Next.js)

```typescript
import { createClient } from '@supabase/supabase-js'
import { useAuth0 } from '@auth0/auth0-react'

export function useSupabaseClient() {
  const { getAccessTokenSilently } = useAuth0()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            },
          })
          return token
        } catch (error) {
          console.error('Error getting access token:', error)
          return null
        }
      },
    }
  )

  return supabase
}
```

### Next.js App Router での使用例

```typescript
// app/providers.tsx
'use client'

import { Auth0Provider } from '@auth0/auth0-react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Auth0Provider>
  )
}

// app/dashboard/page.tsx
'use client'

import { useSupabaseClient } from '@/lib/supabase'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const supabase = useSupabaseClient()
  const [data, setData] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

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
  }, [isAuthenticated, supabase])

  return <div>{/* データの表示 */}</div>
}
```

### Swift (iOS)

```swift
import Auth0
import Supabase

class SupabaseManager {
    static let shared = SupabaseManager()

    private var supabase: SupabaseClient?

    func initialize() {
        supabase = SupabaseClient(
            supabaseURL: URL(string: "YOUR_SUPABASE_URL")!,
            supabaseKey: "YOUR_SUPABASE_ANON_KEY",
            options: SupabaseClientOptions(
                auth: .init(
                    accessToken: { @MainActor in
                        try await self.getAuth0Token()
                    }
                )
            )
        )
    }

    private func getAuth0Token() async throws -> String? {
        let credentialsManager = CredentialsManager(authentication: Auth0.authentication())

        guard credentialsManager.hasValid() else {
            return nil
        }

        let credentials = try await credentialsManager.credentials()
        return credentials.accessToken
    }

    func getClient() -> SupabaseClient? {
        return supabase
    }
}
```

### Flutter

```dart
import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static Future<void> initialize() async {
    final auth0 = Auth0(
      'YOUR_AUTH0_DOMAIN',
      'YOUR_AUTH0_CLIENT_ID',
    );

    await Supabase.initialize(
      url: 'YOUR_SUPABASE_URL',
      anonKey: 'YOUR_SUPABASE_ANON_KEY',
      authOptions: FlutterAuthClientOptions(
        accessToken: () async {
          try {
            final credentials = await auth0.credentialsManager.credentials();
            return credentials.accessToken;
          } catch (e) {
            print('Error getting token: $e');
            return null;
          }
        },
      ),
    );
  }
}
```

### Kotlin (Android)

```kotlin
import com.auth0.android.Auth0
import com.auth0.android.authentication.AuthenticationAPIClient
import com.auth0.android.result.Credentials
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue

class SupabaseManager(private val auth0: Auth0) {
    private val authenticationClient = AuthenticationAPIClient(auth0)

    val supabase = createSupabaseClient(
        supabaseUrl = "YOUR_SUPABASE_URL",
        supabaseKey = "YOUR_SUPABASE_ANON_KEY"
    ) {
        install(GoTrue) {
            accessToken = {
                getAuth0Token()
            }
        }
    }

    private suspend fun getAuth0Token(): String? {
        return try {
            // Auth0からトークンを取得
            val credentials = getStoredCredentials()
            credentials?.accessToken
        } catch (e: Exception) {
            null
        }
    }

    private fun getStoredCredentials(): Credentials? {
        // 保存されたクレデンシャルを取得
        // 実装は使用する認証フローによる
        return null
    }
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
  AND (auth.jwt() -> 'app_roles')::jsonb ? 'admin'
);
```

### ロールベースのアクセス制御

```sql
-- 管理者のみアクセス可能
CREATE POLICY "Admins only"
ON public.admin_settings
FOR ALL
USING (
  (auth.jwt() -> 'app_roles')::jsonb ? 'admin'
);

-- 読み取りは全員、書き込みはエディター以上
CREATE POLICY "Everyone can read, editors can write"
ON public.documents
FOR SELECT
USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Editors can write"
ON public.documents
FOR INSERT
WITH CHECK (
  (auth.jwt() -> 'app_roles')::jsonb ?| array['editor', 'admin']
);
```

## 高度な使用例

### Auth0 Management APIとの連携

```typescript
// ユーザーメタデータをSupabaseに同期
import { ManagementClient } from 'auth0'

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
})

async function syncUserMetadata(userId: string) {
  // Auth0からユーザー情報を取得
  const user = await management.getUser({ id: userId })

  // Supabaseに同期
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      metadata: user.user_metadata,
    })
}
```

### ストレージバケットへのアクセス制御

```sql
-- 組織のフォルダーへのアクセス制限
CREATE POLICY "Organization folder access"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'organization-files'
  AND (storage.foldername(name))[1] = auth.jwt() ->> 'org_id'
);
```

## トラブルシューティング

### トークンにロールクレームが含まれない

**確認事項**:
1. Auth0アクションが正しく設定されているか
2. アクションがLogin Flowに追加されているか
3. アクションがデプロイされているか

```javascript
// トークンの内容を確認
const { getAccessTokenSilently } = useAuth0()
const token = await getAccessTokenSilently()
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log('Token claims:', decoded)
```

### Audienceの設定

Auth0でAPIを作成し、適切なAudienceを設定：

```typescript
const { getAccessTokenSilently } = useAuth0()
const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: 'https://your-api-audience',
    scope: 'openid profile email',
  },
})
```

## セキュリティのベストプラクティス

1. **環境変数の保護**: すべてのシークレットを安全に管理
2. **RLSの有効化**: すべてのテーブルでRow Level Securityを有効化
3. **最小権限の原則**: 必要最小限のスコープとロールのみ付与
4. **トークンの検証**: サーバーサイドでトークンを検証
5. **監査ログ**: すべての認証イベントを記録

## 関連リンク

- [Auth0公式ドキュメント](https://auth0.com/docs)
- [Auth0 Actions](https://auth0.com/docs/customize/actions)
- [サードパーティ認証概要](/docs/services/supabase/docs/guides/auth/third-party/overview.md)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
