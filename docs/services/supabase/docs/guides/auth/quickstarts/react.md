# ReactでSupabase Authを使用する

## 概要
このクイックスタートガイドでは、Supabaseを使用してReactアプリケーションに認証を実装する方法を説明します。

## 手順

### 1. Supabaseプロジェクトを作成する
- Supabase Dashboardで新しいプロジェクトを起動します
- SQLを実行してusersテーブルが空であることを確認します

### 2. Reactアプリを作成する
Viteを使用して新しいReactアプリケーションを作成します:
```bash
npm create vite@latest my-app -- --template react
```

### 3. Supabaseライブラリをインストールする
```bash
cd my-app && npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 4. ログインコンポーネントを設定する
`App.jsx`で、Supabaseクライアントを作成し、認証を設定します:

```jsx
import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://<project>.supabase.co', '<sb_publishable_... or anon key>')

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (<div>Logged in!</div>)
  }
}
```

### 5. アプリを起動する
```bash
npm run dev
```

注: このガイドには、APIキーの変更に関する詳細と、新しいパブリッシャブルキーの使用が推奨されています。
