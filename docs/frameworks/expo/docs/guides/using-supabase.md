# Supabaseを使用する

ExpoアプリでSupabaseを統合し、認証、データベース、ストレージを実装する方法を学びます。

## 概要

Supabaseは、オープンソースのBackend-as-a-Service（BaaS）プラットフォームで、以下を提供します：

**主な機能**：
- **Postgresデータベース**: 強力なリレーショナルデータベース
- **ユーザー認証**: Email、OAuth、マジックリンク
- **ファイルストレージ**: 画像やファイルの保存
- **Edge Functions**: サーバーレス関数
- **リアルタイム同期**: リアルタイムデータ更新
- **Vector & AIツールキット**: AI統合機能

## セットアップ

### ステップ1: Supabaseプロジェクトの作成

1. [database.new](https://database.new)にアクセス
2. 新しいプロジェクトを作成
3. データベースパスワードを設定
4. リージョンを選択

### ステップ2: APIキーの取得

**Supabaseダッシュボード**から：

1. **Settings** → **API**に移動
2. 以下を取得：
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: 公開用のAPIキー

### ステップ3: 依存関係のインストール

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

**必要なパッケージ**：
- `@supabase/supabase-js`: Supabase JavaScriptクライアント
- `@react-native-async-storage/async-storage`: セッション永続化用

## 初期設定

### Supabaseクライアントの作成

```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 環境変数の設定

**.env.local**:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**app.config.js**で環境変数を使用：
```javascript
export default {
  expo: {
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
```

## 認証の実装

### Email認証

```typescript
// app/auth/signup.tsx
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for verification!');
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button
        title={loading ? 'Loading...' : 'Sign Up'}
        onPress={handleSignUp}
        disabled={loading}
      />
    </View>
  );
}
```

### サインイン

```typescript
// app/auth/signin.tsx
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(app)');
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button
        title={loading ? 'Loading...' : 'Sign In'}
        onPress={handleSignIn}
        disabled={loading}
      />
    </View>
  );
}
```

### OAuth（ソーシャルログイン）

```typescript
import { supabase } from '@/lib/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Google OAuth
const signInWithGoogle = async () => {
  const redirectUrl = makeRedirectUri();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    return;
  }

  if (data.url) {
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    if (result.type === 'success') {
      const url = new URL(result.url);
      const accessToken = url.searchParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
  }
};

// Apple OAuth
const signInWithApple = async () => {
  const redirectUrl = makeRedirectUri();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: redirectUrl,
    },
  });

  // Google OAuthと同様の処理
};
```

### セッション管理

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, signOut };
}
```

## データベース操作

### Row Level Security（RLS）の設定

**Supabase SQL Editor**で：

```sql
-- テーブルの作成
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成: ユーザーは自分のプロフィールのみ閲覧可能
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- ポリシーの作成: ユーザーは自分のプロフィールのみ更新可能
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### データの読み取り

```typescript
import { supabase } from '@/lib/supabase';

// 全データを取得
const fetchProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data;
};

// 特定のデータを取得
const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

// フィルタリングとソート
const fetchFilteredProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', '%john%')
    .order('created_at', { ascending: false })
    .limit(10);

  return data;
};
```

### データの挿入

```typescript
// 単一レコードの挿入
const createProfile = async (profile: {
  id: string;
  username: string;
  full_name: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data[0];
};

// 複数レコードの挿入
const createMultipleProfiles = async (profiles: Array<any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profiles)
    .select();

  return { data, error };
};
```

### データの更新

```typescript
// レコードの更新
const updateProfile = async (userId: string, updates: {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data[0];
};
```

### データの削除

```typescript
// レコードの削除
const deleteProfile = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting profile:', error);
    return false;
  }

  return true;
};
```

## リアルタイム機能

### リアルタイムサブスクリプション

```typescript
// hooks/useRealtimeProfiles.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    // 初期データを取得
    fetchProfiles();

    // リアルタイムサブスクリプション
    const channel: RealtimeChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Change received!', payload);

          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) =>
              prev.map((profile) =>
                profile.id === payload.new.id ? payload.new : profile
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) =>
              prev.filter((profile) => profile.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setProfiles(data);
  };

  return profiles;
}
```

## ファイルストレージ

### バケットの作成

**Supabaseダッシュボード** → **Storage**で新しいバケットを作成。

### ファイルのアップロード

```typescript
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

const uploadAvatar = async (userId: string) => {
  // 画像を選択
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets[0].base64) {
    return null;
  }

  const photo = result.assets[0];
  const filePath = `${userId}/avatar.${photo.uri.split('.').pop()}`;

  // Base64からArrayBufferに変換
  const arrayBuffer = decode(photo.base64);

  // Supabaseにアップロード
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, arrayBuffer, {
      contentType: `image/${photo.uri.split('.').pop()}`,
      upsert: true,
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  // 公開URLを取得
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
```

### ファイルのダウンロード

```typescript
const downloadFile = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
};
```

### ファイルの削除

```typescript
const deleteFile = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
};
```

## ベストプラクティス

### 1. エラーハンドリング

```typescript
const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T | null> => {
  try {
    const { data, error } = await queryFn();

    if (error) {
      console.error('Supabase error:', error);
      // エラーログサービスに送信
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};
```

### 2. 型安全性

```typescript
// database.types.ts（Supabase CLIで生成）
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
};

// 使用例
const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return data;
};
```

### 3. パフォーマンスの最適化

```typescript
// 必要なフィールドのみを選択
const { data } = await supabase
  .from('profiles')
  .select('id, username')
  .limit(20);

// インデックスを活用
// Supabase SQL Editorで:
// CREATE INDEX idx_profiles_username ON profiles(username);

// ページネーション
const fetchProfilesPage = async (page: number, pageSize: number = 20) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .range(from, to);

  return data;
};
```

## まとめ

Supabaseは、以下の包括的なバックエンド機能を提供します：

### 主な機能
- **認証**: Email、OAuth、マジックリンク
- **データベース**: Postgresを使用したRow Level Security
- **ストレージ**: ファイルアップロードと管理
- **リアルタイム**: リアルタイムデータ同期

### 統合のメリット
- オープンソースで自己ホスティング可能
- 自動生成されるREST API
- TypeScriptクライアントライブラリ
- React Nativeから直接データベースにアクセス可能

### ベストプラクティス
- Row Level Securityを使用してデータを保護
- 環境変数でAPIキーを管理
- 適切なエラーハンドリング
- 型安全性の確保

これらのパターンを活用して、Expoアプリに強力なバックエンド機能を統合できます。
