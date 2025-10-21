# React NativeでSupabase Authを使用する

React NativeでSupabase Authを使用する方法を学びます

---

## 1. 新しいSupabaseプロジェクトを作成する

Supabase Dashboardで[新しいプロジェクトを起動](https://supabase.com/dashboard)します。

新しいデータベースには、ユーザーを保存するためのテーブルがあります。SQL Editorで以下のSQLを実行すると、このテーブルが現在空であることを確認できます:

```sql
select * from auth.users;
```

## 2. Reactアプリを作成する

`create-expo-app`コマンドを使用してReactアプリを作成します:

```bash
npx create-expo-app -t expo-template-blank-typescript my-app
```

## 3. Supabaseクライアントライブラリをインストールする

`supabase-js`と必要な依存関係をインストールします:

```bash
cd my-app && npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed react-native-url-polyfill
```

## 4. ログインコンポーネントを設定する

プロジェクトのURLとキーを使用してSupabaseクライアントをエクスポートするヘルパーファイル`lib/supabase.ts`を作成します。

> 注意: Supabaseはキーの仕組みを変更しています。レガシーキーと新しいパブリッシャブルキーの両方を使用できます。

キーの値を取得するには、プロジェクトのSettings pageのAPI Keysセクションを開きます:
- レガシーキーの場合、クライアントサイド用に`anon`キーを、サーバーサイド操作用に`service_role`キーをコピーします
- 新しいキーの場合、パブリッシャブルキーを作成します

```typescript
import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL
const supabaseAnonKey = YOUR_REACT_NATIVE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// アプリの状態変更時にトークンを自動更新する処理
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}
```

## さらに学ぶ

- [Supabase Authドキュメント](/docs/guides/auth#authentication)
- [React Native向けサーバーサイド認証](/docs/guides/auth/server-side/react-native)
