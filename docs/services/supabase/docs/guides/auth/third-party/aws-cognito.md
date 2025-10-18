# Amazon Cognito (AWS Amplify)

Amazon Cognito User Poolsは、AWS Amplifyを通じて、または単独で、Supabase Authと連携して、または独立して使用できる認証プロバイダです。

## 目次

- [はじめに](#はじめに)
- [セットアップ手順](#セットアップ手順)
- [Supabaseクライアントのセットアップ](#supabaseクライアントのセットアップ)
- [カスタムクレームの設定](#カスタムクレームの設定)
- [RLSポリシーの実装](#rlsポリシーの実装)
- [AWS Amplifyとの統合](#aws-amplifyとの統合)

## はじめに

Amazon Cognito User Poolsを使用することで、AWSエコシステムの認証機能をSupabaseプロジェクトに統合できます。

### 前提条件

- Supabaseプロジェクト
- AWSアカウント
- Amazon Cognito User Pool

## セットアップ手順

### 1. Cognito User Pool情報の取得

Amazon Cognito ConsoleからUser Pool情報を取得：

- **User Pool ID**: 例 `us-east-1_abc123xyz`
- **リージョン**: 例 `us-east-1`

### 2. サードパーティ認証の統合を追加

#### Supabaseダッシュボードでの設定

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にログイン
2. プロジェクトの「Authentication」→「Third-party Auth」を選択
3. 「Add Integration」をクリック
4. 「AWS Cognito」を選択
5. User Pool IDとリージョンを入力

#### CLIを使用する場合

`supabase/config.toml`ファイルに以下を追加：

```toml
[auth.third_party.aws_cognito]
enabled = true
user_pool_id = "us-east-1_abc123xyz"
user_pool_region = "us-east-1"
```

### 3. Pre-Token Generation Triggerの設定

すべてのJWTに`role: 'authenticated'`のカスタムクレームを割り当てます。

### 4. Supabaseクライアントのセットアップ

アプリケーションでSupabaseクライアントをセットアップします。

## Supabaseクライアントのセットアップ

### TypeScript (AWS Amplify v6使用)

```typescript
import { createClient } from '@supabase/supabase-js'
import { fetchAuthSession } from 'aws-amplify/auth'

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        try {
          const session = await fetchAuthSession()
          const token = session.tokens?.idToken?.toString()
          return token ?? null
        } catch (error) {
          console.error('Error fetching auth session:', error)
          return null
        }
      },
    }
  )
}
```

### React with Amplify

```typescript
// lib/amplify.ts
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
      loginWith: {
        oauth: {
          domain: 'your-domain.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code',
        },
      },
    },
  },
})

// components/SupabaseProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { Hub } from 'aws-amplify/utils'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const client = getSupabaseClient()
    setSupabase(client)

    // Amplifyの認証イベントを監視
    const listener = Hub.listen('auth', (data) => {
      console.log('Auth event:', data.payload.event)
      // トークンが更新されたら、Supabaseクライアントも更新
      if (data.payload.event === 'signedIn' || data.payload.event === 'tokenRefresh') {
        const newClient = getSupabaseClient()
        setSupabase(newClient)
      }
    })

    return () => listener()
  }, [])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return context
}
```

### Next.js App Routerでの使用例

```typescript
// app/dashboard/page.tsx
'use client'

import { useSupabase } from '@/components/SupabaseProvider'
import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'

export default function Dashboard() {
  const supabase = useSupabase()
  const [data, setData] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // データを取得
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')

        if (error) {
          console.error('Error:', error)
        } else {
          setData(data)
        }
      } catch (error) {
        console.error('Not authenticated:', error)
      }
    }

    checkAuth()
  }, [supabase])

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.username}</p>}
      {/* データの表示 */}
    </div>
  )
}
```

### Swift (iOS with Amplify)

```swift
import Amplify
import AWSCognitoAuthPlugin
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
                        try await self.getCognitoToken()
                    }
                )
            )
        )
    }

    private func getCognitoToken() async throws -> String? {
        do {
            let session = try await Amplify.Auth.fetchAuthSession()

            guard let cognitoTokenProvider = session as? AuthCognitoTokensProvider else {
                return nil
            }

            let tokens = try cognitoTokenProvider.getCognitoTokens().get()
            return tokens.idToken
        } catch {
            print("Failed to fetch auth session: \(error)")
            return nil
        }
    }

    func getClient() -> SupabaseClient? {
        return supabase
    }
}
```

### Flutter

```dart
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static Future<void> initialize() async {
    // Amplifyの設定
    await Amplify.addPlugin(AmplifyAuthCognito());
    await Amplify.configure(amplifyconfig);

    // Supabaseの初期化
    await Supabase.initialize(
      url: 'YOUR_SUPABASE_URL',
      anonKey: 'YOUR_SUPABASE_ANON_KEY',
      authOptions: FlutterAuthClientOptions(
        accessToken: () async {
          try {
            final session = await Amplify.Auth.fetchAuthSession();
            if (session is CognitoAuthSession) {
              return session.userPoolTokensResult.value.idToken.raw;
            }
            return null;
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

### Kotlin (Android with Amplify)

```kotlin
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue

class SupabaseManager {
    val supabase = createSupabaseClient(
        supabaseUrl = "YOUR_SUPABASE_URL",
        supabaseKey = "YOUR_SUPABASE_ANON_KEY"
    ) {
        install(GoTrue) {
            accessToken = {
                getCognitoToken()
            }
        }
    }

    private suspend fun getCognitoToken(): String? {
        return try {
            val session = Amplify.Auth.fetchAuthSession().await()
            (session as? AWSCognitoAuthSession)
                ?.userPoolTokensResult
                ?.value
                ?.idToken
        } catch (e: Exception) {
            null
        }
    }
}
```

## カスタムクレームの設定

### Pre-Token Generation Lambda Trigger

Amazon Cognito ConsoleでPre-Token Generation Triggerを設定し、カスタムクレームを追加します。

#### Node.js Lambda関数の例

```javascript
exports.handler = async (event) => {
  // IDトークンにカスタムクレームを追加
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        role: 'authenticated',
        user_id: event.request.userAttributes.sub,
        email: event.request.userAttributes.email,
      },
    },
  }

  return event
}
```

#### グループベースのロール割り当て

```javascript
exports.handler = async (event) => {
  // ユーザーのグループを確認
  const groups = event.request.groupConfiguration?.groupsToOverride || []

  let role = 'authenticated'
  let appRoles = []

  // グループに基づいてロールを設定
  if (groups.includes('Admins')) {
    appRoles.push('admin')
  }
  if (groups.includes('Editors')) {
    appRoles.push('editor')
  }

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        role: role,
        user_id: event.request.userAttributes.sub,
        email: event.request.userAttributes.email,
        app_roles: JSON.stringify(appRoles),
        groups: JSON.stringify(groups),
      },
    },
  }

  return event
}
```

#### カスタム属性の追加

```javascript
exports.handler = async (event) => {
  const userAttributes = event.request.userAttributes

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        role: 'authenticated',
        user_id: userAttributes.sub,
        email: userAttributes.email,
        // カスタム属性（例: custom:organization_id）
        org_id: userAttributes['custom:organization_id'],
        department: userAttributes['custom:department'],
      },
    },
  }

  return event
}
```

### Lambda関数のデプロイ

1. AWS Lambda Consoleで新しい関数を作成
2. 上記のコードを貼り付け
3. Cognito User Pool Consoleで「Triggers」タブを開く
4. 「Pre token generation trigger」にLambda関数を追加

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

### グループベースのアクセス制御

```sql
-- 管理者グループのメンバーのみアクセス可能
CREATE POLICY "Admins only"
ON public.admin_settings
FOR ALL
USING (
  (auth.jwt() -> 'app_roles')::jsonb ? 'admin'
);

-- 複数のグループをチェック
CREATE POLICY "Editors and Admins can write"
ON public.documents
FOR INSERT
WITH CHECK (
  (auth.jwt() -> 'app_roles')::jsonb ?| array['editor', 'admin']
);
```

### 組織ベースのアクセス制御

```sql
-- 同じ組織のメンバーのみアクセス可能
CREATE POLICY "Organization members only"
ON public.projects
FOR ALL
USING (auth.jwt() ->> 'org_id' = organization_id);
```

## AWS Amplifyとの統合

### Amplifyの初期化

```typescript
// amplify/config.ts
import { Amplify } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
}

Amplify.configure(amplifyConfig)
```

### 認証フローの実装

```typescript
import { signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth'

// サインアップ
export async function handleSignUp(email: string, password: string) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
        autoSignIn: true,
      },
    })

    return { isSignUpComplete, userId, nextStep }
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// 確認コードの送信
export async function handleConfirmSignUp(email: string, code: string) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    })

    return { isSignUpComplete, nextStep }
  } catch (error) {
    console.error('Error confirming sign up:', error)
    throw error
  }
}

// サインイン
export async function handleSignIn(email: string, password: string) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    })

    return { isSignedIn, nextStep }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// サインアウト
export async function handleSignOut() {
  try {
    await signOut()
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
```

## トラブルシューティング

### トークンにカスタムクレームが含まれない

**確認事項**:
1. Pre-Token Generation Triggerが正しく設定されているか
2. Lambda関数が正しくデプロイされているか
3. Lambda関数に必要な権限があるか

```javascript
// トークンの内容を確認（デバッグ用）
import { fetchAuthSession } from 'aws-amplify/auth'

const session = await fetchAuthSession()
const token = session.tokens?.idToken?.toString()
if (token) {
  const decoded = JSON.parse(atob(token.split('.')[1]))
  console.log('Token claims:', decoded)
}
```

### RLSポリシーが機能しない

```sql
-- JWTの内容を確認
SELECT auth.jwt();

-- 特定のクレームを確認
SELECT auth.jwt() ->> 'role';
SELECT auth.jwt() ->> 'user_id';
```

## セキュリティのベストプラクティス

1. **環境変数の保護**: すべてのシークレットを安全に管理
2. **RLSの有効化**: すべてのテーブルでRow Level Securityを有効化
3. **最小権限の原則**: 必要最小限の権限のみ付与
4. **トークンの有効期限**: 適切な有効期限を設定
5. **MFAの有効化**: 多要素認証を有効化

```typescript
// MFAの設定
import { setUpTOTP, verifyTOTPToken } from 'aws-amplify/auth'

// TOTP MFAのセットアップ
const totpSetup = await setUpTOTP()
const setupUri = totpSetup.getSetupUri('MyApp', 'user@example.com')
// QRコードを生成して表示

// TOTPコードの検証
await verifyTOTPToken({ code: '123456' })
```

## 関連リンク

- [AWS Amplify公式ドキュメント](https://docs.amplify.aws/)
- [Amazon Cognito公式ドキュメント](https://docs.aws.amazon.com/cognito/)
- [サードパーティ認証概要](/docs/services/supabase/docs/guides/auth/third-party/overview.md)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
