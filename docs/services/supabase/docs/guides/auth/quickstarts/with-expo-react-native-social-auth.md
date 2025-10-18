# Expo React Nativeでソーシャル認証アプリを構築する

## 概要
このチュートリアルでは、Supabaseを使用してソーシャル認証を実装するExpo React Nativeアプリの構築方法を説明します。このアプリは以下の機能を持ちます:
- Row Level Securityを使用したSupabase Database
- AppleとGoogle認証によるソーシャルログイン
- 保護されたナビゲーション

## 主要な手順

### 1. プロジェクトのセットアップ
- 新しいSupabaseプロジェクトを作成
- データベーススキーマをセットアップ
- API詳細を設定

### 2. アプリの初期化
- Expoを使用して新しいReact Nativeプロジェクトを作成
- 依存関係をインストール:
  ```bash
  npx create-expo-app@latest expo-social-auth
  npx expo install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store expo-splash-screen
  ```

### 3. 認証フロー
- 認証状態を管理する`AuthContext`を作成
- セッション管理を処理する`AuthProvider`を実装
- Expo Routerを使用して保護されたルートを設定
- ログインとログアウトコンポーネントを作成

### 4. ソーシャル認証
- Apple Sign-In（iOSとAndroid）を統合
- Google Sign-Inを実装
- Supabase Authで認証を処理

### 5. 環境設定
- Supabase認証情報を含む`.env`ファイルをセットアップ
- プラットフォーム固有の認証設定を構成

## 認証コンテキストの実装例

### AuthContextの作成

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

type AuthContextType = {
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // セッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 認証状態の変更をリッスン
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 環境変数の設定

`.env`ファイルを作成し、Supabase認証情報を追加します:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ソーシャルログインの実装

### Appleサインイン

```typescript
import * as AppleAuthentication from 'expo-apple-authentication'

const handleAppleSignIn = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    if (credential.identityToken) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      })
      if (error) throw error
    }
  } catch (e) {
    console.error(e)
  }
}
```

### Googleサインイン

```typescript
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession()

const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'YOUR_EXPO_CLIENT_ID',
  iosClientId: 'YOUR_IOS_CLIENT_ID',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID',
})

useEffect(() => {
  if (response?.type === 'success') {
    const { id_token } = response.params

    supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token,
    })
  }
}, [response])
```

## 保護されたルート

```typescript
import { useAuth } from './contexts/AuthContext'
import { Redirect } from 'expo-router'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return <YourProtectedContent />
}
```

## さらに学ぶ

このチュートリアルでは、各ステップに対する包括的なコード例を提供し、Webとモバイルプラットフォームの両方をカバーしています。

- [Supabase Authドキュメント](/docs/guides/auth#authentication)
- [Expo認証ガイド](https://docs.expo.dev/guides/authentication/)
- [React Native向けサーバーサイド認証](/docs/guides/auth/server-side/react-native)
